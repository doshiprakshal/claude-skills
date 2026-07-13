---
name: jenkins-review
description: Review Jenkins pipeline configuration (Jenkinsfile) and instance hygiene — credential handling, plugin currency, agent/executor allocation, and script security (sandboxed Groovy vs. approved signatures). Triggers on "review our jenkinsfile", "jenkins pipeline review", "is our jenkins credential handling safe", "jenkins plugin security audit".
user-invocable: true
---

# Jenkins Review

Review a Jenkinsfile/pipeline configuration and relevant instance-level hygiene for security and reliability.

## When to use

- Reviewing a Jenkinsfile before or after adoption.
- The user asks about credential handling, plugin security, or agent allocation.

**Out of scope**:
- Broader multi-tool pipeline security patterns → `pipeline-security`
- Mechanical secret scanning → `secrets-review`

## Inputs

- The Jenkinsfile (declarative or scripted pipeline).
- Credential bindings used (`credentials()`, `withCredentials`).
- Plugin inventory and versions, if accessible.
- Agent/executor configuration.

## Workflow

### 1. Discover

Gather the Jenkinsfile and credential/plugin/agent configuration.

### 2. Checks

- **Credential handling** — credentials injected via `withCredentials`/`credentials()` binding (masked in logs) rather than being echoed/exported as plain environment variables that could leak into build logs.
- **Script security** — scripted pipeline sections use the Script Security plugin's sandbox appropriately; any use of `@NonCPS` or unsandboxed Groovy is reviewed for what it actually executes, since unsandboxed scripts can run arbitrary code on the Jenkins controller.
- **Plugin currency** — installed plugins aren't significantly outdated relative to current releases (older plugins are a common source of known CVEs in Jenkins environments).
- **Agent/executor allocation** — pipeline stages run on appropriately isolated agents (not everything on the controller itself, which is both a security risk — arbitrary pipeline code running with controller-level access — and a scalability bottleneck).
- **Build trigger safety** — if triggered by PRs/webhooks from external contributors, confirm the same untrusted-code-with-credentials risk pattern as GitHub Actions' `pull_request_target` doesn't apply here (credentials available to a build triggered by an untrusted PR).

### 3. Report

Findings grouped by Credential Handling, Script Security, Plugin Currency, Agent Allocation, Trigger Safety, each with severity and fix.

## Notes

- Pipeline stages running directly on the Jenkins controller (rather than on isolated agents) is a significant, often-overlooked risk — any pipeline code effectively runs with the controller's own privileges.
- Outdated Jenkins plugins are a leading real-world Jenkins compromise vector — treat plugin currency findings seriously, not as routine hygiene.
