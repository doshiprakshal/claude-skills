# Claude Skills Marketplace

A collection of Claude Code skills and full-stack AI-powered apps.

## Install this marketplace (one time)

Register once — every skill installs with a single command after that.

**Step 1 — Register the marketplace:**

```bash
curl -fsSL https://raw.githubusercontent.com/doshiprakshal/claude-skills/main/install.sh | bash
```

<details>
<summary>No curl? Run the node script directly</summary>

```bash
node << 'SCRIPT'
const fs = require('fs'), path = require('path');
const f = path.join(require('os').homedir(), '.claude', 'known_marketplaces.json');
const d = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : { marketplaces: [] };
if (!d.marketplaces.find(m => m.name === 'doshiprakshal'))
  d.marketplaces.push({ name: 'doshiprakshal', url: 'https://raw.githubusercontent.com/doshiprakshal/claude-skills/main/.claude-plugin/marketplace.json' });
fs.writeFileSync(f, JSON.stringify(d, null, 2));
console.log('Registered doshiprakshal marketplace');
SCRIPT
```

</details>

**Step 2 — Install any skill inside Claude Code:**

```
/plugin install prepops@doshiprakshal
/plugin install interview-prep@doshiprakshal
```

New skills added to this marketplace are available immediately — no re-registration needed.

---

## Skills

### PrepOps — AI Infra Interview Coach

**Repo:** [doshiprakshal/PrepOps](https://github.com/doshiprakshal/PrepOps)

Adaptive AI interview coach for Infrastructure, DevOps, SRE, Cloud, MLOps, and AIOps roles.
10 learning modes · 9 interviewer personas · 8 company blueprints · production incident simulations · hiring-style feedback reports.

```
/plugin install prepops@doshiprakshal
```

---

### Interview Prep (MCQ + Flashcards)

**Path:** [`ai-infra-devops-sre-cloud-interview-coach/`](./ai-infra-devops-sre-cloud-interview-coach)

| Skill | What it does |
|-------|-------------|
| [`interview-mcq`](./ai-infra-devops-sre-cloud-interview-coach/interview-mcq) | Interactive MCQ quiz — 4 options, immediate feedback, score ring at the end |
| [`interview-flashcards`](./ai-infra-devops-sre-cloud-interview-coach/interview-flashcards) | Flip-card deck with "Got it / Still learning" tracking and restart-unseen mode |

```
/plugin install interview-prep@doshiprakshal
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
