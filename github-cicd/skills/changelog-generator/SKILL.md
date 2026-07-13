---
name: changelog-generator
description: Generate a technical changelog from commit history/PR titles between two refs, grouped by change type (feat/fix/chore/breaking), for internal engineering consumption. Distinct from release-notes-generator's curated, audience-facing output. Triggers on "generate a changelog", "changelog between these two tags", "create a changelog from our commits", "changelog generator".
user-invocable: true
---

# Changelog Generator

Generate a technical changelog from commit/PR history between two refs — a raw, categorized engineering log. Distinct from `release-notes-generator`, which produces curated, audience-facing prose.

## When to use

- Preparing a `CHANGELOG.md` entry for a release.
- The user wants a categorized log of changes between two tags/commits.

**Out of scope**:
- Curated, audience-facing release notes → `release-notes-generator`

## Inputs

- Two refs (tags, branches, or commit SHAs) defining the range.
- Commit messages and/or merged PR titles/labels in that range.
- Conventional commit format, if used (feat/fix/chore/etc. prefixes), for automatic categorization.

## Workflow

### 1. Discover

Gather all commits/PRs in the range between the two refs.

### 2. Categorize

Group by type: Features, Fixes, Breaking Changes, Chores/Internal, Documentation — using conventional commit prefixes if present, or PR labels, or inferring from the commit/PR title if neither is available (clearly marking inferred categorization as such).

### 3. Generate

Produce a structured changelog entry, each item linking back to its commit/PR, with breaking changes called out prominently at the top regardless of chronological order.

### 4. Report

The generated changelog content, plus a note on which items had ambiguous/inferred categorization (worth a quick human sanity check) versus clearly categorized ones.

## Notes

- Breaking changes should always surface at the top, not buried chronologically — this is the single most important thing a changelog reader needs to see first.
- If commit messages don't follow a consistent convention, say so and note that categorization is best-effort/inferred rather than presenting it as fully reliable.
