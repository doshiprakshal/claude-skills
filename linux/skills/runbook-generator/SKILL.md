---
name: runbook-generator
description: Generate a host-level incident runbook — grounded in the host's actual configuration (services running, resource baselines, dependencies) — likely failure modes with first diagnostic steps referencing the specific Linux domain skill for each. The Linux-host counterpart to kubernetes/runbook-generator. Triggers on "generate a runbook for this server", "create on-call docs for this host", "linux host runbook generator", "write an incident doc for this box".
user-invocable: true
---

# Linux Runbook Generator

Generate an incident-response runbook for a Linux host, grounded in its actual configuration and likely failure modes — the host-level counterpart to `kubernetes/runbook-generator`.

## When to use

- Preparing on-call documentation for a host/server.
- The user wants a runbook grounded in this specific host's real setup, not a generic template.

**Out of scope**:
- Actually diagnosing a live incident → the specific Linux domain investigation skill for that symptom
- Kubernetes-workload runbooks → `kubernetes/runbook-generator`

## Inputs

- The host's running services (systemd units), resource configuration (memory limits, disk layout), and known dependencies (databases, NFS mounts, external services it relies on).
- Baseline resource usage, if known (helps predict likely failure modes).
- Existing monitoring/dashboard links and escalation contacts, if provided.

## Workflow

### 1. Discover

Gather the host's actual running services, resource configuration, and dependencies.

### 2. Identify likely failure modes grounded in this host's real config

Only include a failure mode prominently if the host's actual configuration makes it plausible — e.g., only flag disk-space exhaustion prominently if the host has a known-fast-growing data directory; only flag a specific service's failure mode if that service is actually running here.

### 3. Gather operational info

Ask for what's missing (dashboard links, escalation contacts) rather than inventing plausible-sounding placeholders.

### 4. Generate the runbook

Structured document: Host overview & dependencies; Likely failure modes (symptom + first diagnostic step + which specific skill to run); Key commands/dashboards; Escalation path.

### 5. Report

The generated runbook, clearly flagging which sections are grounded in actual observed configuration vs. placeholders needing to be filled in.

## Notes

- Every "likely failure mode" should cite the specific host configuration that makes it plausible — a generic list of every possible Linux failure mode isn't useful under pressure.
- Reference the specific skill (`memory-investigation`, `disk-investigation`, `service-failure-investigation`, etc.) for each likely failure mode's first diagnostic step, so the on-call engineer has a concrete next action, not just a symptom description.
