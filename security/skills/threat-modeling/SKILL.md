---
name: threat-modeling
description: Conduct a structured threat modeling exercise (e.g., STRIDE) for a system or architecture — identifying trust boundaries, enumerating threats per boundary, and rating them, distinct from a general security architecture review or a specific vulnerability assessment. Triggers on "threat model this system", "run a stride analysis on this architecture", "what are the threats to this new feature we're designing", "help me think through the attack surface of this design".
user-invocable: true
---

# Threat Modeling

Conduct a structured threat modeling exercise for a system or proposed design — identifying trust boundaries and enumerating threats systematically rather than ad hoc.

## When to use

- A new system/feature/architecture needs proactive threat analysis, ideally before or during design (not after an incident).
- The user asks to "think through the attack surface" of something being built.

**Out of scope**:
- Reviewing an already-built system's overall security architecture maturity → `security-architecture`
- A specific vulnerability's exploitability assessment → `vulnerability-analysis`

## Inputs

- The system/architecture being modeled: components, data flows, and trust boundaries (or enough detail to derive them).
- Sensitivity of data/actions involved.

## Workflow

### 1. Diagram data flows and trust boundaries

Identify each component, the data flowing between them, and where trust boundaries exist (a trust boundary is any point where the level of trust changes — e.g., user input entering the system, a call crossing from an authenticated to an unauthenticated context, a third-party integration).

### 2. Enumerate threats per boundary using STRIDE

For each trust boundary, systematically consider: **S**poofing (is identity verifiable here), **T**ampering (can data be modified in transit/at rest here), **R**epudiation (can an action be denied due to lack of evidence), **I**nformation disclosure (can data leak across this boundary), **D**enial of service (can this boundary be overwhelmed), **E**levation of privilege (can trust be gained beyond what's intended) — apply each category deliberately rather than only listing threats that come to mind spontaneously.

### 3. Rate and prioritize

For each identified threat, assess likelihood and impact, and prioritize accordingly — not every theoretical threat warrants immediate mitigation; distinguish "must fix before launch" from "acceptable risk, revisit later" explicitly.

### 4. Recommend mitigations

For prioritized threats, recommend specific mitigations (which may point to existing skills for depth — e.g., an authentication threat to `identity-review`/`iam-audit`, an encryption threat to `encryption-review`).

### 5. Report

A trust-boundary-by-trust-boundary threat table (STRIDE category, threat, likelihood, impact, priority, mitigation), plus a summary of the highest-priority items.

## Notes

- Threat modeling is most valuable done early, during design — while still useful for an already-built system, doing it before implementation is far cheaper than retrofitting mitigations later; note this explicitly if the system is still in design.
- Systematically working through all six STRIDE categories per boundary, rather than free-associating, is what prevents an incomplete or narrowly-scoped threat model — resist stopping once a few obvious threats are found per boundary.
