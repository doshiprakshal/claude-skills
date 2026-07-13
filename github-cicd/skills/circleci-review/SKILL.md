---
name: circleci-review
description: Review .circleci/config.yml — orb version pinning and trust, workflow/job structure, caching effectiveness, and resource class sizing. Triggers on "review our circleci config", "circleci pipeline review", "should we pin our circleci orbs", "circleci resource class review".
user-invocable: true
---

# CircleCI Review

Review a CircleCI configuration for orb trust, workflow structure, caching, and resource sizing.

## When to use

- Reviewing a CircleCI config before or after adoption.
- The user asks about orb pinning or resource class sizing.

**Out of scope**:
- Broader multi-tool pipeline security patterns → `pipeline-security`
- Mechanical secret scanning → `secrets-review`

## Inputs

- `.circleci/config.yml` (including any orbs referenced).
- Contexts and their secret environment variables.
- Resource class settings per job.

## Workflow

### 1. Discover

Gather the config file, orb references, and context/secret usage.

### 2. Checks

- **Orb version pinning** — orbs referenced with a specific version, not a floating major-version tag that could pull in unreviewed changes; third-party (non-CircleCI-verified) orbs reviewed for trust before use, since an orb can execute arbitrary steps.
- **Workflow/job structure** — jobs sequenced with actual dependencies (`requires:`) rather than unnecessary full serialization; independent jobs run in parallel where possible.
- **Caching effectiveness** — dependency caching keyed correctly (e.g., on a lockfile hash) so cache actually invalidates when dependencies change, not stale-keyed in a way that either never updates or never hits.
- **Resource class sizing** — jobs sized to an appropriate resource class for their actual workload (not defaulting to the largest available "just in case," nor undersized causing slow/flaky builds from resource starvation).
- **Context/secret scope** — contexts holding secrets restricted to the specific jobs/branches that need them, and to trusted pipeline triggers (not exposed to untrusted fork PR builds).

### 3. Report

Findings grouped by Orb Trust/Pinning, Workflow Structure, Caching, Resource Sizing, Secret Scope, each with severity and fix.

## Notes

- Unpinned or untrusted third-party orbs are a real supply-chain risk — an orb is essentially arbitrary code executed in your pipeline.
- Resource class sizing should be informed by actual build duration/resource-utilization data where available, not guessed.
