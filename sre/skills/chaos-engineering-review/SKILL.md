---
name: chaos-engineering-review
description: Review or design a chaos engineering practice — experiment selection based on actual risk hypotheses, blast-radius control, and whether findings actually translate into fixes, distinct from a one-off resilience test or disaster recovery drill. Triggers on "review our chaos engineering practice", "help us design a chaos experiment", "are our chaos experiments actually testing meaningful failure modes", "do our chaos engineering findings ever get fixed".
user-invocable: true
---

# Chaos Engineering Review

Review or design a chaos engineering practice — experiment selection, blast-radius control, and whether findings actually translate into fixes.

## When to use

- Designing a new chaos engineering program or specific experiment.
- Reviewing whether an existing chaos engineering practice is actually valuable.

**Out of scope**:
- A specific disaster-recovery drill for a defined catastrophic scenario → `databases/disaster-recovery`
- General incident response readiness independent of proactive chaos testing → `operational-readiness`

## Inputs

- Current or proposed chaos experiments and their scope.
- Hypotheses being tested (what failure mode, what expected system behavior).
- History of findings from past experiments and what happened to them.

## Workflow

### 1. Assess hypothesis-driven experiment design

Check whether experiments are designed around specific, meaningful failure hypotheses (e.g., "if this dependency times out, does our circuit breaker actually engage as expected") rather than being generic/random fault injection with no clear question being tested — a hypothesis-free experiment produces data without necessarily producing insight.

### 2. Assess blast radius control

Confirm experiments have appropriate safety controls (a defined scope, an abort mechanism, ideally starting in non-production or a controlled production subset before wider rollout) — chaos engineering's value depends on controlled, safe experimentation, not on ad hoc unguarded fault injection in full production.

### 3. Assess prioritization of experiments

Check whether experiment selection targets the failure modes most likely to matter (informed by architecture risk analysis or past incident patterns) rather than testing arbitrary or already-well-understood scenarios.

### 4. Assess follow-through on findings

The most important check: when an experiment reveals an actual weakness, does that finding turn into a tracked, fixed issue — a chaos engineering practice that surfaces real gaps but never follow through on fixing them provides much less value than the effort invested suggests, similar to the escalation-follow-through concern in `error-budget-review`.

### 5. Report

Findings on Hypothesis-Driven Design, Blast Radius Control, Experiment Prioritization, Findings Follow-Through, each with severity, plus (if designing new experiments) specific proposed hypotheses and safety controls.

## Notes

- Findings follow-through is the highest-value and most commonly unchecked dimension — a chaos engineering program can look sophisticated (real experiments, real findings) while providing little actual reliability improvement if findings don't turn into fixes; always check for concrete evidence of this.
- Blast radius control should be assessed with real scrutiny before recommending any new experiment in a production environment — the value of finding a weakness doesn't justify skipping safety controls that prevent the experiment itself from causing a real incident.
