# Secret Detection

Scans a codebase, repository (including git history), or configuration for exposed secrets using pattern and entropy-based detection.

See `SKILL.md` for the full workflow.

## How to invoke

- "Scan our repo for leaked secrets."
- "Check our git history for exposed credentials."
- "Do we have any hardcoded API keys in this codebase?"

## Example

### Input

Current HEAD of a repository contains no obvious hardcoded credentials. Git history scan finds a commit from 8 months ago that briefly added a `config.py` file with a hardcoded AWS access key, removed in a follow-up commit 2 days later. A `.env.example` file contains `API_KEY=your_api_key_here`.

### Output (abbreviated)

> **Findings**
>
> - **AWS access key exposed in git history (8 months ago, removed 2 days later)** — `[Confirmed, High]` — the key was present in the public commit history for 2 days and remains permanently visible to anyone with clone access via `git log`/history browsing, regardless of later removal. **Rotate this AWS key immediately** if it hasn't already been rotated — removal from current files does not revoke prior exposure. Consider a history rewrite (`git filter-repo` or equivalent) only after rotation, and only if broader exposure (e.g., a public repo) makes it worthwhile.
> - **`.env.example` placeholder value** — `[False positive]` — `your_api_key_here` is an obvious placeholder, not a real credential; no action needed.
>
> **Overall verdict**: one confirmed historical exposure requiring immediate credential rotation as the priority action — the placeholder finding needs no follow-up.

This example is illustrative — a real scan depends entirely on the actual repository content and history.
