---
name: incident-dashboard
description: Generate a focused, incident-specific dashboard assembling the panels most relevant to a specific active incident's suspected components, rather than a general-purpose service dashboard. Triggers on "build a dashboard for this incident", "assemble the relevant panels for this outage", "create an incident-specific view for this investigation", "generate a war-room dashboard for this incident".
user-invocable: true
---

# Incident Dashboard

Assemble a focused dashboard for an active incident, pulling together only the panels relevant to the suspected components, to support fast triage rather than general-purpose service monitoring.

## When to use

- An active incident needs a focused view assembled quickly, cutting across normal per-service dashboard boundaries.
- The user names specific suspected components/services and wants their signals in one place.

**Out of scope**:
- General-purpose, durable service dashboards → `dashboard-generator`
- The investigation/root-causing itself → this skill only assembles the view; pair with the relevant domain investigation skill (e.g., `kubernetes/crashloopbackoff`, `linux/performance-investigation`)

## Inputs

- The suspected components/services involved in the incident (from initial reports or alerts).
- Available metrics/panels across those components.
- The incident's approximate start time, to scope the dashboard's default time window usefully.

## Workflow

### 1. Discover

Identify the suspected components from the incident report/alert, and their call relationships (upstream/downstream) so related-but-not-yet-suspected components can be included too.

### 2. Assemble

- **Cross-service golden signals** — one row per suspected component showing request rate/error rate/latency, laid out for fast visual comparison (did the problem start in one component and propagate, or appear simultaneously everywhere — pointing to a shared dependency).
- **Deployment/change markers** — recent deploy events overlaid as annotations, since a deploy correlating with incident onset is one of the highest-value initial signals.
- **Shared dependency panels** — infrastructure shared across the suspected components (a shared database, a shared load balancer, node-level resource metrics) that could explain simultaneous impact across otherwise-unrelated services.
- **Time window** — default to a window starting somewhat before the incident's reported start (to see the lead-up) through now, not a generic "last 6 hours."

### 3. Report

The assembled dashboard/panel list, with a brief note on what the layout is designed to help distinguish (e.g., "compare the three rows to see whether the error spike started in service A before B and C").

## Notes

- The point of this skill is speed and focus during an active incident, not completeness — deliberately exclude panels unrelated to the suspected components, even if they'd belong on a general dashboard.
- Always include deploy/change annotations if available — correlating incident onset with a recent change is frequently the fastest path to a root cause and is easy to overlook when assembling panels reactively.
