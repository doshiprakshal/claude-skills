# Workflow Optimization

Simplifies CI/CD workflow structure — redundant/duplicate jobs across workflows, unnecessary sequential dependencies, and consolidation opportunities.

See `SKILL.md` for the full workflow.

## How to invoke

- "Simplify our CI/CD workflows."
- "We have too many redundant pipelines."
- "Consolidate our GitHub Actions workflows."

## Example

### Input

Three separate workflow files (`test.yml`, `test-pr.yml`, `ci.yml`) all trigger on `pull_request` and each independently run `npm install` and `npm test` with near-identical steps — apparently created at different points as the team experimented with CI setup, with no one having removed the older ones.

### Output (abbreviated)

> **Findings**
>
> - **Three workflows run essentially the same tests on every PR** — `[High]` — `test.yml`, `test-pr.yml`, and `ci.yml` all trigger on `pull_request` and independently install dependencies and run the test suite. This triples CI compute cost and time for every PR with no corresponding benefit — each PR effectively runs the same test suite three times in parallel. Consolidate into a single workflow; check git blame/history to confirm which is the actively-maintained one before deleting the other two (or ask the team if unclear).
>
> **Recommended fix**
> Keep the most recently updated/actively maintained of the three (likely `ci.yml` based on naming convention and typical migration patterns, but confirm), delete the other two, and ensure the retained workflow covers everything the deleted ones did.
>
> **Overall verdict**
> This is a clear, low-risk consolidation opportunity — the duplication appears to be organic accumulation rather than intentional redundancy, and fixing it will meaningfully reduce CI cost and time per PR.

This example is illustrative — a real review depends entirely on the actual workflow files discovered for the target repository.
