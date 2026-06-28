# Claude Skills Marketplace

A collection of Claude Code skills and full-stack AI-powered apps. Skills are zero-install — copy a single file and type a slash command. Apps require a local backend or frontend setup.

---

## Skill Collections

### Interview Prep

**Path:** [`interview/`](./interview) · [Full marketplace →](./interview/README.md)

Skills for DevOps and cloud interview preparation. Zero-install — one `curl` command and you're ready.

| Skill | What it does |
|-------|-------------|
| [`interview-mcq`](./interview/interview-mcq) | Generates an interactive MCQ quiz for any DevOps/cloud topic and opens it in your browser |

**Install all interview skills:**

```bash
git clone https://github.com/doshiprakshal/claude-skills.git
cp -r claude-skills/interview/*/  ~/.claude/skills/
```

---

## Apps (local install required)

### 1. AI Career Copilot

**Path:** [`ai-career-copilot/`](./ai-career-copilot)

An AI-powered career toolkit that analyzes your resume against any job description and gives you everything you need to land the role.

**What it does:**
- Scores your resume against a job description (ATS score with keyword, format, experience, and education breakdowns)
- Identifies missing skills and keywords that would improve your ATS score
- Generates 8 tailored interview questions (behavioral, technical, situational) with answering tips
- Fetches live salary data from the Adzuna API and provides a grounded salary estimate
- Writes a customized cover letter for the specific job
- Freemium model: 1 free analysis, then users bring their own Anthropic API key

**Stack:**
| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | FastAPI, Python 3 |
| AI | Claude (claude-opus-4-8 with extended thinking) |
| Auth | JWT (python-jose), bcrypt |
| Database | SQLite via SQLAlchemy |
| Salary data | Adzuna Jobs API |

**How to install:**

```bash
# 1. Clone the repo
git clone https://github.com/doshiprakshal/claude-skills.git
cd claude-skills/ai-career-copilot

# 2. Backend setup
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env from the example
cp .env.example .env
# Fill in: ANTHROPIC_API_KEY, ADZUNA_APP_ID, ADZUNA_APP_KEY, JWT_SECRET_KEY

uvicorn main:app --reload         # runs on http://localhost:8000

# 3. Frontend setup (new terminal)
cd ../frontend
npm install
npm run dev                       # runs on http://localhost:5173
```

**Required env vars (backend/.env):**

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key (used for the free trial analysis) |
| `ADZUNA_APP_ID` | Adzuna API app ID (get one free at developer.adzuna.com) |
| `ADZUNA_APP_KEY` | Adzuna API key |
| `JWT_SECRET_KEY` | Any long random string for signing JWTs |

---

### 2. Interview Lab Generator

**Path:** [`interview-lab-generator/`](./interview-lab-generator)

An AI-powered hands-on lab generator for DevOps and infrastructure interview prep. Pick a technology and get a complete practice lab with real configs, a broken setup to debug, and step-by-step solutions.

**What it does:**
- Generates a full practice lab for 15 DevOps/cloud categories: Kubernetes, Docker, AWS, GCP, Azure, Terraform, Prometheus & Grafana, Linux, Nginx, CI/CD, Helm, Istio, Ansible, Elasticsearch, PostgreSQL
- Each lab includes:
  - A mini hands-on lab with prerequisites and numbered steps
  - Real config/YAML files with syntax highlighting and one-click copy
  - A deliberately broken setup with listed symptoms for you to diagnose
  - Step-by-step debugging walkthrough (hidden by default — spoiler-free)
  - Root cause explanation and the correct fix

**Stack:**
| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS v4 |
| AI | Claude via `@anthropic-ai/sdk` (server-side API route) |
| Syntax highlighting | react-syntax-highlighter (One Dark theme) |
| Icons | lucide-react |

**How to install:**

```bash
# 1. Clone the repo
git clone https://github.com/doshiprakshal/claude-skills.git
cd claude-skills/interview-lab-generator

# 2. Install dependencies
npm install

# 3. Set up env
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env.local

# 4. Run
npm run dev                       # runs on http://localhost:3000
```

**Required env vars (.env.local):**

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key |

---

## Getting an Anthropic API Key

Both skills require an Anthropic API key.

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up / log in
3. Navigate to **API Keys** and create a new key
4. Keys start with `sk-ant-`

---

## Repo Structure

```
claude-skills/
├── ai-career-copilot/
│   ├── backend/          # FastAPI + SQLite
│   │   ├── main.py
│   │   ├── requirements.txt
│   │   └── .env.example
│   └── frontend/         # React + Vite
│       ├── src/
│       └── package.json
└── interview-lab-generator/
    ├── app/
    │   ├── api/generate/ # Claude API route
    │   └── page.tsx      # Main UI
    └── package.json
```

---

## Contributing

Have a skill idea? Open a PR. Each skill should live in its own top-level directory with a clear README covering setup steps and required env vars.
