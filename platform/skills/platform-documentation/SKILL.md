---
name: platform-documentation
description: Review platform-team-produced documentation for coverage, findability, and currency — whether developers can actually self-serve answers from docs rather than asking the platform team directly, distinct from TechDocs technical setup or general technical-writing quality. Triggers on "review our platform documentation coverage", "why does everyone still ask us instead of reading the docs", "is our platform documentation findable and current", "audit our platform docs for gaps".
user-invocable: true
---

# Platform Documentation

Review platform-team-produced documentation for coverage, findability, and currency — whether it actually reduces direct platform-team support burden or is being bypassed.

## When to use

- Assessing whether platform documentation is adequate, findable, and current.
- The platform team notices developers routinely ask questions that should be answered by existing docs.

**Out of scope**:
- TechDocs technical setup within Backstage → `backstage-review`
- General technical writing quality/structure for any document → `productivity/technical-documentation`

## Inputs

- The current documentation set and its organization/location.
- Support channel history (questions asked) if available, to identify gaps between what's documented and what's actually asked.

## Workflow

### 1. Assess coverage against real questions

Cross-reference support-channel/ticket history against existing docs — questions asked repeatedly that already have a documented answer indicate a findability problem; questions with no documented answer indicate a genuine coverage gap. Distinguishing these two categories matters because the fix differs (findability vs. writing new content).

### 2. Assess findability

Check whether documentation is discoverable through the paths developers actually use (search, the service catalog, an onboarding checklist) rather than requiring insider knowledge of where to look — well-written docs that are hard to find provide little practical value.

### 3. Assess currency

Check whether documentation reflects the current state of the platform (post golden-path/template updates) — stale docs describing a previous version of a workflow actively mislead readers, similar to the golden-path staleness risk in `golden-path-review`.

### 4. Assess self-service sufficiency

For the highest-volume recurring questions, determine whether docs alone would let a developer resolve their question without needing to ask the platform team directly — this is the practical bar that matters more than raw page count or writing quality.

### 5. Report

Findings grouped by Coverage Gaps (undocumented, from real questions), Findability Gaps (documented but not found), Currency Gaps (documented but stale), Self-Service Sufficiency, each with severity and the top recurring-question candidates for new/improved docs.

## Notes

- Always distinguish "not documented" from "documented but not found" — the fix for the former is writing new content; the fix for the latter is improving navigation/search/promotion of existing content, and conflating them leads to redundant writing instead of fixing the actual problem.
- Support-channel history is the most reliable evidence source for what to prioritize — it reflects what developers actually get stuck on, which is often different from what the platform team assumes needs documenting.
