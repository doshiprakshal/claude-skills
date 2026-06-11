import os
import json
import httpx
from datetime import datetime, timedelta
from typing import Optional

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import JWTError, jwt
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import anthropic
from dotenv import load_dotenv

load_dotenv()

# ── Config ────────────────────────────────────────────────────────────────────
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
ADZUNA_APP_ID = os.getenv("ADZUNA_APP_ID", "")
ADZUNA_APP_KEY = os.getenv("ADZUNA_APP_KEY", "")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "changeme-use-a-real-secret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# ── Database ──────────────────────────────────────────────────────────────────
DATABASE_URL = "sqlite:///./career_copilot.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class UserModel(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    resume = Column(Text, nullable=True)
    anthropic_key = Column(String, nullable=True)   # user's own API key
    analyses_count = Column(Integer, default=0)     # lifetime analyses run
    created_at = Column(DateTime, default=datetime.utcnow)


Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ── Auth ──────────────────────────────────────────────────────────────────────
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> UserModel:
    credentials_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exc
    except JWTError:
        raise credentials_exc

    user = db.query(UserModel).filter(UserModel.email == email).first()
    if user is None:
        raise credentials_exc
    return user


# ── Pydantic Schemas ──────────────────────────────────────────────────────────
class RegisterRequest(BaseModel):
    email: str
    password: str


class ResumeUpdate(BaseModel):
    resume: str


class ApiKeyUpdate(BaseModel):
    anthropic_key: str


class AnalyzeRequest(BaseModel):
    job_description: str
    resume: Optional[str] = None  # optional override; otherwise uses saved resume


class AnalysisResult(BaseModel):
    ats_score: int
    ats_breakdown: dict
    missing_skills: list[str]
    interview_questions: list[dict]
    salary_estimate: dict
    cover_letter: str
    analyses_used: int        # how many analyses this user has run (including this one)
    used_free_trial: bool     # true if this analysis used the owner's key


# ── Salary Helper ──────────────────────────────────────────────────────────────
async def fetch_salary_data(job_title: str, location: str = "us") -> dict:
    """Fetch live salary data from Adzuna job postings."""
    if not ADZUNA_APP_ID or not ADZUNA_APP_KEY:
        return {"source": "unavailable", "note": "Adzuna API keys not configured"}

    try:
        url = (
            f"https://api.adzuna.com/v1/api/jobs/{location}/search/1"
            f"?app_id={ADZUNA_APP_ID}&app_key={ADZUNA_APP_KEY}"
            f"&what={job_title.replace(' ', '+')}&results_per_page=20"
            f"&content-type=application/json&salary_include_unknown=0"
        )
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url)
            resp.raise_for_status()
            data = resp.json()

        results = data.get("results", [])
        salaries = [
            r["salary_min"] for r in results if r.get("salary_min") and r["salary_min"] > 10000
        ] + [
            r["salary_max"] for r in results if r.get("salary_max") and r["salary_max"] > 10000
        ]

        if not salaries:
            return {
                "source": "adzuna",
                "note": "No salary data found for this role in live postings",
                "job_title": job_title,
            }

        avg = int(sum(salaries) / len(salaries))
        return {
            "source": "adzuna_live_postings",
            "job_title": job_title,
            "average_salary_usd": avg,
            "min_salary_usd": int(min(salaries)),
            "max_salary_usd": int(max(salaries)),
            "sample_size": len(results),
            "note": f"Based on {len(results)} live job postings",
        }
    except Exception as e:
        return {"source": "adzuna", "error": str(e), "job_title": job_title}


# ── Claude Analysis ───────────────────────────────────────────────────────────
async def analyze_with_claude(resume: str, job_description: str, salary_data: dict, api_key: str) -> dict:
    client = anthropic.Anthropic(api_key=api_key)

    salary_context = json.dumps(salary_data, indent=2)

    prompt = f"""You are an expert career coach and ATS (Applicant Tracking System) specialist.

Analyze the resume against the job description and return ONLY a valid JSON object (no markdown, no extra text).

RESUME:
{resume}

JOB DESCRIPTION:
{job_description}

LIVE SALARY MARKET DATA:
{salary_context}

Return this exact JSON structure:
{{
  "ats_score": <integer 0-100>,
  "ats_breakdown": {{
    "keyword_match": <integer 0-100>,
    "format_score": <integer 0-100>,
    "experience_match": <integer 0-100>,
    "education_match": <integer 0-100>
  }},
  "missing_skills": [<list of specific missing skills/keywords from the JD not in the resume>],
  "interview_questions": [
    {{
      "category": "<Behavioral|Technical|Situational>",
      "question": "<interview question>",
      "tip": "<brief answering tip>"
    }}
  ],
  "salary_estimate": {{
    "range_low": <annual USD integer>,
    "range_mid": <annual USD integer>,
    "range_high": <annual USD integer>,
    "currency": "USD",
    "basis": "<explanation using the live salary data provided>",
    "live_data_summary": "<summarize the Adzuna live data above>"
  }},
  "cover_letter": "<full professional cover letter, 3-4 paragraphs, tailored to this specific job>"
}}

Rules:
- ATS score reflects how well the resume matches the JD keywords and requirements
- List 5-10 missing skills/keywords that would improve ATS score
- Provide exactly 8 interview questions (mix of categories)
- Use the live salary data provided to ground your salary estimate
- Cover letter should reference specific details from the JD"""

    # Use streaming to avoid timeout on long responses
    full_text = ""
    with client.messages.stream(
        model="claude-opus-4-8",
        max_tokens=4096,
        thinking={"type": "adaptive"},
        messages=[{"role": "user", "content": prompt}],
    ) as stream:
        for text in stream.text_stream:
            full_text += text

    # Strip any accidental markdown fences
    cleaned = full_text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.split("```")[1]
        if cleaned.startswith("json"):
            cleaned = cleaned[4:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]

    return json.loads(cleaned.strip())


# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(title="AI Career Copilot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Auth Endpoints ────────────────────────────────────────────────────────────
@app.post("/auth/register")
async def register(req: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(UserModel).filter(UserModel.email == req.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = UserModel(email=req.email, hashed_password=hash_password(req.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token({"sub": user.email}, timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return {"access_token": token, "token_type": "bearer", "email": user.email}


@app.post("/auth/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    token = create_access_token({"sub": user.email}, timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return {"access_token": token, "token_type": "bearer", "email": user.email}


# ── Profile / Resume Endpoints ────────────────────────────────────────────────
@app.get("/profile")
async def get_profile(current_user: UserModel = Depends(get_current_user)):
    return {
        "email": current_user.email,
        "has_resume": bool(current_user.resume),
        "resume": current_user.resume or "",
        "has_api_key": bool(current_user.anthropic_key),
        "analyses_count": current_user.analyses_count or 0,
    }


@app.put("/profile/resume")
async def update_resume(req: ResumeUpdate, current_user: UserModel = Depends(get_current_user), db: Session = Depends(get_db)):
    current_user.resume = req.resume
    db.commit()
    return {"message": "Resume saved successfully"}


@app.put("/profile/apikey")
async def update_api_key(req: ApiKeyUpdate, current_user: UserModel = Depends(get_current_user), db: Session = Depends(get_db)):
    # Validate the key looks like an Anthropic key
    if not req.anthropic_key.startswith("sk-ant-"):
        raise HTTPException(status_code=400, detail="Invalid Anthropic API key format. It should start with 'sk-ant-'")
    current_user.anthropic_key = req.anthropic_key
    db.commit()
    return {"message": "API key saved successfully"}


@app.delete("/profile/apikey")
async def delete_api_key(current_user: UserModel = Depends(get_current_user), db: Session = Depends(get_db)):
    current_user.anthropic_key = None
    db.commit()
    return {"message": "API key removed"}


# ── Analysis Endpoint ─────────────────────────────────────────────────────────
@app.post("/analyze", response_model=AnalysisResult)
async def analyze(req: AnalyzeRequest, current_user: UserModel = Depends(get_current_user), db: Session = Depends(get_db)):
    resume = req.resume or current_user.resume
    if not resume:
        raise HTTPException(status_code=400, detail="No resume found. Please save your resume in your profile first.")

    if req.resume and req.resume != current_user.resume:
        current_user.resume = req.resume
        db.commit()

    analyses_so_far = current_user.analyses_count or 0
    used_free_trial = False

    # First analysis → use owner's key (free trial)
    if analyses_so_far == 0:
        api_key = ANTHROPIC_API_KEY
        used_free_trial = True
    else:
        # Subsequent analyses → require user's own key
        if not current_user.anthropic_key:
            raise HTTPException(
                status_code=402,
                detail="You've used your free analysis. Please add your Anthropic API key in your profile to continue.",
            )
        api_key = current_user.anthropic_key

    # Extract job title from first line of JD for salary lookup
    first_line = req.job_description.split("\n")[0][:80]
    salary_data = await fetch_salary_data(first_line)

    result = await analyze_with_claude(resume, req.job_description, salary_data, api_key)

    # Increment counter after successful analysis
    current_user.analyses_count = analyses_so_far + 1
    db.commit()

    result["analyses_used"] = analyses_so_far + 1
    result["used_free_trial"] = used_free_trial
    return result


@app.get("/health")
async def health():
    return {"status": "ok"}
