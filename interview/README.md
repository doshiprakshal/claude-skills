# Interview Prep Skills

A collection of Claude Code skills for DevOps and cloud interview preparation. Each skill is zero-install — copy one file and you're ready.

## Quick install (all skills)

```bash
git clone https://github.com/doshiprakshal/claude-skills.git
cp -r claude-skills/interview/*/  ~/.claude/skills/
```

Or install skills individually — see each skill's section below.

---

## Skills

### interview-mcq — Interactive MCQ Quiz

**Path:** [`interview-mcq/`](./interview-mcq)

Generates a multiple-choice quiz for any DevOps/cloud topic and opens it in your browser as a self-contained HTML page. No server, no npm, no API key required.

**Categories:** Kubernetes · Docker · AWS · GCP · Azure · Terraform · Prometheus & Grafana · Linux · Nginx · CI/CD · Helm · Istio · Ansible · Elasticsearch · PostgreSQL

**Features:**
- 1–20 questions generated from Claude's own knowledge
- Immediate feedback with answer explanations
- Keyboard shortcuts (A/B/C/D, Enter to advance)
- Score ring at the end with retry option
- Dark-theme, self-contained HTML — no internet needed to run the quiz

**Install:**

```bash
mkdir -p ~/.claude/skills/interview-mcq && \
  curl -sSL https://raw.githubusercontent.com/doshiprakshal/claude-skills/main/interview/interview-mcq/SKILL.md \
  -o ~/.claude/skills/interview-mcq/SKILL.md
```

**Usage:**

```
/interview-mcq kubernetes 10
/interview-mcq docker
/interview-mcq aws "IAM roles"
```

Or just say *"quiz me on Terraform"* and Claude picks it up automatically.

---

## Coming soon

| Skill | Description |
|-------|-------------|
| `interview-flashcards` | Spaced-repetition flashcards in the browser for any DevOps topic |
| `interview-lab` | Hands-on practice labs with broken configs to debug |
| `interview-system-design` | Guided system design question walkthroughs |

Have a skill idea? Open a PR — add a folder here with a `SKILL.md`.
