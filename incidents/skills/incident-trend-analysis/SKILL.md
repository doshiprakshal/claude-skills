---
name: incident-trend-analysis
description: Analyze incident trends over time — frequency, severity mix, MTTR/MTTD trajectory, and which services/teams contribute disproportionately, to inform where reliability investment should go. Triggers on "analyze our incident trends over the last quarter", "is our mttr getting better or worse", "which services have the most incidents", "show me our incident volume and severity trend over time".
user-invocable: true
---

# Incident Trend Analysis

Analyze incident trends over time — frequency, severity, and resolution-time trajectory — to identify where reliability investment is most needed.

## When to use

- Reviewing incident data across a time period for trend/pattern analysis.
- The user asks whether MTTR/MTTD is improving, or which services have disproportionate incident volume.

**Out of scope**:
- Extracting systemic root-cause themes across postmortems → `lessons-learned`
- Detecting whether specific incidents are near-duplicates of each other → `repeat-incident-detection`

## Inputs

- A set of incidents over a defined period, with metadata: date, severity, affected service, duration (time-to-detect, time-to-resolve if available).

## Workflow

### 1. Compute volume and severity trend

Incident count over time (by period — weekly/monthly), broken down by severity, to see whether overall volume and severity mix is improving, worsening, or flat — a flat total count with rising Sev1 proportion is a different (worse) signal than a flat total count with stable severity mix.

### 2. Compute MTTD/MTTR trajectory

Time-to-detect and time-to-resolve trends over the period — improving detection/resolution time is a meaningful signal of operational maturity even if incident count itself hasn't changed.

### 3. Identify disproportionate contributors

Which services/teams account for a disproportionate share of incidents (and weighted by severity, not just raw count) — a service with many low-severity incidents is a different priority than one with fewer but higher-severity incidents.

### 4. Correlate with known changes

If a significant change occurred during the period (a major migration, a new on-call structure, a big feature launch), note whether the trend shifts around that point — correlation only, not asserted causation, unless independently confirmed.

### 5. Report

Trend charts/tables for volume, severity mix, MTTD/MTTR, and top contributors, with a short interpretation of what's improving/worsening and where investment appears most warranted.

## Notes

- Always weight "top contributor" analysis by severity/impact, not raw incident count alone — a service with 10 low-severity incidents may warrant less investment than one with 2 severe ones.
- Be careful with small sample sizes — a trend computed over very few incidents can look dramatic but not be statistically meaningful; state sample size and avoid overstating confidence in short-period trends.
