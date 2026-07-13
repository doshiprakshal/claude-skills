---
name: availability-review
description: Review a service's availability track record and the architectural/operational factors behind it — computing actual achieved availability, decomposing what caused unavailability, and whether the trend is improving, distinct from database/infrastructure-specific HA architecture review. Triggers on "review our service's availability track record", "what's actually been causing our downtime", "compute our actual availability for this period", "is our availability trend improving or worsening".
user-invocable: true
---

# Availability Review

Review a service's availability track record — computing actual achieved availability and decomposing what caused unavailability, distinct from the architectural HA design itself.

## When to use

- Reviewing a service's historical availability and what's driving it.

**Out of scope**:
- Database-specific HA architecture (single points of failure, failover mechanics) → `databases/ha-review`
- Kubernetes-specific cluster health → `kubernetes/cluster-health-check`

## Inputs

- Incident/downtime history for the service over the review period.
- The service's availability target (SLO), if defined.

## Workflow

### 1. Compute actual availability

Calculate actual achieved availability for the period from downtime records, being explicit about the measurement methodology (what counts as downtime, any exclusions) — this should be computed rigorously, not estimated impressionistically.

### 2. Decompose causes

Break down total unavailability by cause category (deploy-related, dependency failure, infrastructure/platform event, capacity/scaling issue, external/third-party) — this identifies where reliability investment would have the most leverage, rather than treating "downtime" as a single undifferentiated number.

### 3. Assess trend direction

Compare the current period against prior periods — is availability improving, worsening, or flat, and is that trend statistically meaningful given the incident sample size (a single severe incident can dominate a quarter's number without indicating a systemic worsening trend).

### 4. Cross-check against target

If an SLO/SLA target exists, compare actual achieved availability against it explicitly, and note the margin (or deficit) — a service consistently just barely meeting its target has less safety margin than one comfortably exceeding it, even if both are nominally "passing."

### 5. Report

Actual availability computation with methodology, cause decomposition, trend assessment, and target comparison with margin.

## Notes

- Always decompose unavailability by cause — a single aggregate downtime number doesn't tell you where to invest, while a cause breakdown (e.g., "60% of downtime was deploy-related") directly points to the highest-leverage fix.
- Be cautious about trend conclusions from a small incident sample — a single severe outlier incident can make a trend look dramatically worse without reflecting a genuine systemic shift; note sample size explicitly when characterizing trend direction.
