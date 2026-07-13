---
name: ai-security-review
description: Review AI/LLM-specific security concerns — prompt injection resistance, sensitive data handling in prompts/logs, and output-side risks (unsafe generated content, unintended tool/function-call actions), distinct from general infrastructure security. Triggers on "review our llm for prompt injection risk", "are we leaking sensitive data through our prompts or logs", "review the security of our llm tool-calling setup", "assess our ai feature for security risks".
user-invocable: true
---

# AI Security Review

Review AI/LLM-specific security concerns — prompt injection resistance, sensitive data handling, and output-side risks distinct from general infrastructure security.

## When to use

- Assessing an LLM-powered feature for AI-specific security risks (as opposed to general infrastructure security).

**Out of scope**:
- General infrastructure/network/IAM security → the `security/` domain skills
- Secrets hardcoded in application code → `security/secret-detection`

## Inputs

- The feature's prompt construction (especially how untrusted/user-controlled content enters the prompt).
- What data flows into prompts and gets logged.
- Whether the model has tool/function-calling capability and what actions those tools can take.

## Workflow

### 1. Assess prompt injection resistance

Check how untrusted content (user input, retrieved documents, third-party data) is incorporated into prompts, and whether the system is resilient to injected instructions within that content attempting to override the intended behavior — this is a fundamentally different attack surface from traditional injection (SQL/XSS) and often lacks equivalent established defenses; assess what happens if retrieved/user content contains adversarial instructions.

### 2. Assess sensitive data handling

Check whether sensitive data (PII, credentials, internal-only information) flows into prompts sent to third-party model providers, and whether prompt/response logs (cross-reference `ai-observability`) retain sensitive data without appropriate redaction/access control — a third-party API call is a data egress point that needs the same scrutiny as any other.

### 3. Assess tool/function-calling risk

For features with tool-calling capability, assess the blast radius of an action the model could be induced to take (via prompt injection or a reasoning error) — a tool that can only read data is lower risk than one that can delete/modify/send-money; confirm high-risk tool actions have appropriate confirmation gates or scope limits rather than being fully autonomous.

### 4. Assess output handling

Check how generated output is used downstream — output rendered directly as HTML/executed as code without sanitization is a real risk if the model can be induced to generate malicious content; treat model output as untrusted input to whatever consumes it next, similar to any other external input.

### 5. Report

Findings grouped by Prompt Injection Resistance, Sensitive Data Handling, Tool-Calling Risk, Output Handling, each with severity.

## Notes

- Prompt injection is a fundamentally different and less mature threat category than traditional injection attacks — there's no fully reliable technical defense yet, so the practical mitigation is often architectural (limiting what untrusted-content-influenced model output is allowed to do, especially for tool-calling) rather than assuming a prompt-level fix fully solves it.
- Model output should be treated as untrusted input to whatever system consumes it next (a browser, a database, another service) — the same rigor applied to any external, potentially-adversarial input applies here, especially when the model's input included any untrusted or user-influenced content.
