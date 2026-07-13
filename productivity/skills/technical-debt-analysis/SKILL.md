---
name: technical-debt-analysis
description: Identify and prioritize technical debt across a codebase — distinguishing debt that's actively costing velocity/reliability from debt that's merely aesthetically displeasing, and quantifying the cost of each to justify investment. Triggers on "identify our technical debt", "prioritize our technical debt backlog", "what technical debt is actually costing us velocity", "quantify the impact of this technical debt".
user-invocable: true
---

# Technical Debt Analysis

Identify and prioritize technical debt, distinguishing debt with real, quantifiable cost from debt that's merely displeasing but low-impact.

## When to use

- Identifying technical debt across a codebase and prioritizing what to address.

**Out of scope**:
- Planning the actual refactoring execution once debt items are identified → `refactoring-plan`
- Dependency-specific vulnerability/license debt → `security/dependency-review`

## Inputs

- Codebase areas known or suspected to carry technical debt.
- Available signal: change frequency/failure rate per area, developer complaints, incident history tied to specific code.

## Workflow

### 1. Identify candidate debt areas

Gather candidates from multiple signal sources — code that changes frequently and also has a high defect rate (a strong signal of real, costly debt), developer-reported pain points, and code implicated in past incidents.

### 2. Distinguish costly debt from cosmetic debt

Apply a real cost test to each candidate — does this debt actually slow down changes, cause bugs, or contribute to incidents, versus code that's merely inconsistent with current style preferences but doesn't meaningfully impede work — prioritizing by actual impact prevents debt-cleanup effort from being spent on low-value cosmetic concerns.

### 3. Quantify cost where possible

For high-candidate debt items, estimate actual cost — time added to changes in that area, defect/incident frequency tied to it, or a specific recent example of the debt causing a concrete problem — a quantified cost makes the investment case far more persuasive than an abstract "this code is messy" characterization.

### 4. Assess remediation cost

For each prioritized item, estimate the effort to address it, to compute a cost/effort ratio similar to other roadmap-prioritization skills in this marketplace.

### 5. Report

A prioritized technical debt list: area, evidence of real cost (change frequency/defect rate/incident history), quantified impact where possible, remediation effort estimate, and priority ranking by cost/effort ratio.

## Notes

- Always distinguish debt with measurable real-world cost (frequent-change + high-defect-rate areas, incident-implicated code) from debt that's merely stylistically displeasing — the latter is a much weaker prioritization case even if it's more visible or annoying day-to-day.
- Change frequency combined with defect rate is a particularly strong signal — code that changes often and also breaks often when it changes is disproportionately costly compared to code that's messy but stable and rarely touched.
