---
name: release-notes-generator
description: Generate curated, audience-facing release notes from a changelog/merged PRs — translating technical changes into user-relevant language, grouping by user impact rather than commit type. Distinct from changelog-generator's raw technical log. Triggers on "write release notes for this version", "generate user-facing release notes", "release notes generator", "translate this changelog for customers".
user-invocable: true
---

# Release Notes Generator

Generate curated, audience-facing release notes — translating a technical changelog into language relevant to the actual audience (end users, customers, or a broader internal audience beyond engineering). Distinct from `changelog-generator`'s raw technical log, which this skill can use as a source input.

## When to use

- Preparing customer-facing or broad-audience release notes.
- The user has a changelog and wants it translated into something readable by non-engineers.

**Out of scope**:
- The raw technical changelog itself → `changelog-generator` (a good input to this skill)

## Inputs

- A changelog or list of merged PRs/commits for the release.
- The intended audience (end users, customers, internal broad audience) — ask if not specified, since tone/detail level differs significantly.

## Workflow

### 1. Clarify audience

Confirm who's reading this — the framing, technical depth, and what's worth mentioning at all differs for end users vs. customers vs. internal stakeholders.

### 2. Translate and group

Group by user-relevant impact (new capability, improvement, fix affecting a specific area) rather than by commit type. Omit purely internal changes (dependency bumps, refactors with no user-visible effect) unless the audience specifically cares about them. Translate technical terms into plain language appropriate to the audience.

### 3. Prioritize

Lead with the most impactful/exciting changes for the audience, not necessarily the order they were merged in.

### 4. Report

The generated release notes, plus a note on anything from the source changelog that was intentionally omitted as not user-relevant (so the user can double-check nothing important was dropped).

## Notes

- Never invent user impact that isn't actually there — if a change's real-world effect is unclear from the changelog alone, ask rather than guessing at a compelling-sounding description.
- Breaking changes affecting the audience must always be included and clearly flagged, regardless of how technical the underlying change was — omitting them because they're "not exciting" would be a real disservice to the reader.
