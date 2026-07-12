---
name: runbook-generator
description: Generate a service-specific incident-response runbook from its actual Kubernetes configuration and dependencies — likely failure modes grounded in its real config (not a generic template), key diagnostic commands, rollback procedure, and escalation path. Triggers on "generate a runbook for this service", "create on-call docs for this app", "runbook generator", "write an incident response doc for this workload".
user-invocable: true
---

# Runbook Generator

Generate an incident-response runbook for a service, grounded in its actual Kubernetes configuration and real dependencies — not a generic template. This is a generation skill, producing the document used *before* an incident, not diagnosing a live one.

## When to use

- Preparing on-call documentation for a service, especially before it goes on a rotation for the first time.
- The user wants a runbook that reflects a specific workload's actual setup.

**Out of scope**:
- Actually diagnosing a live incident → the specific Investigate skill for that symptom (`crashloopbackoff`, `oomkilled`, etc.) — this skill produces the document referenced *during* one.

## Inputs

- The workload's manifests (dependencies, resource config, probes, PDBs, deployment mechanism).
- Any existing monitoring/alerting/dashboard links the user provides.
- Escalation contacts/on-call rotation info, if provided.

## Workflow

### 1. Discover

Gather the workload's manifests to understand its actual dependencies (databases, other services, external APIs referenced via env/config), resource configuration, probes, and PDB.

### 2. Identify likely failure modes grounded in this workload's real config

Only include a failure mode prominently if this workload's actual configuration makes it plausible — don't dump the full generic catalog. For example: tight memory limits relative to nothing else known → mention `oomkilled` as a likely page; no PDB → mention that node drains/maintenance could cause brief unavailability; has a PVC → mention `pvc-issues`; depends on an external API with no visible retry/circuit-breaker → mention that dependency as a likely cascading-failure source.

### 3. Gather operational info

Ask for what's missing and useful: dashboard links, escalation contact/rotation, any known quirks the team wants documented. Don't block the whole runbook on this — generate it with clearly marked placeholders for anything not provided.

### 4. Generate the runbook

Produce the structured document (see Deliverables).

### 5. Report

Present the runbook, and clearly flag which sections are grounded in actual observed configuration vs. placeholders the user still needs to fill in.

## Deliverables

A structured runbook:
1. **Service overview & dependencies** — what it is, what it depends on, deployment mechanism.
2. **Likely failure modes** — each with its trigger symptom and the specific Investigate skill to run, tied to this workload's actual config.
3. **Key commands/dashboards** — first diagnostic steps specific to this service.
4. **Rollback procedure** — specific to this workload's deployment mechanism (Helm release history, ArgoCD app, plain `kubectl rollout undo`).
5. **Escalation path** — who/where, or a clearly marked placeholder if not provided.

## Notes

- Every "likely failure mode" section should cite the specific config that makes it likely for this workload — a runbook that lists the same ten generic failure modes for every service isn't useful under pressure.
- Clearly mark placeholder sections (escalation contacts, dashboard links) rather than inventing plausible-sounding but fake information.
- Keep it usable at 3am — concrete commands and specific likely causes, not a wall of general advice.
