# Service Catalog Review

Reviews a service catalog's data model and completeness — coverage, dependency-relationship accuracy, and downstream workflow trust — independent of the specific tool.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our service catalog data model."
- "Is our service catalog actually trustworthy?"
- "What should our service catalog track?"

## Example

### Input

Service catalog covers 120 of an estimated 160 actual running services (75% coverage). It tracks ownership and lifecycle stage but not dependency relationships. The on-call routing tool consumes catalog ownership data directly to determine who to page for an alert.

### Output (abbreviated)

> **Findings**
>
> - **25% coverage gap (40 of 160 services missing)** — `[High]` — since on-call routing directly consumes catalog ownership data, any alert on one of the 40 missing services has no clear routing path, likely defaulting to a fallback/generic on-call rotation that isn't the actual owning team. This is a direct operational risk, not just a documentation gap, given the downstream dependency on this data.
> - **No dependency-relationship modeling** — `[Medium]` — without dependency data, any future blast-radius or impact-assessment workflow (see `incidents/blast-radius-analysis`) has no catalog-level data to build on and would require manual investigation each time. Recommend adding dependency tracking, ideally auto-derived from actual traffic/config rather than manually maintained.
>
> **Overall verdict**: given on-call routing's direct dependency on catalog data, the coverage gap is the highest-priority finding — prioritize onboarding the missing 40 services (or at minimum their ownership metadata) before investing in the dependency-modeling expansion.

This example is illustrative — a real review depends entirely on the actual catalog data model and coverage discovered.
