# Release Notes Generator

Generates curated, audience-facing release notes from a changelog/merged PRs — translating technical changes into user-relevant language, grouped by user impact.

See `SKILL.md` for the full workflow.

## How to invoke

- "Write release notes for v2.4.0."
- "Generate user-facing release notes."
- "Translate this changelog for customers."

## Example

### Input

Changelog (from `changelog-generator`):
```
## Breaking Changes
- Removed deprecated /v1/users endpoint

## Features
- Add SSO login support (auth)

## Fixes
- Correct pagination off-by-one error (api)

## Documentation
- Update API reference for pagination

## Chores
- Bump lodash to 4.17.21
```
Audience: customers (external, using the public API).

### Output (abbreviated)

> **Release Notes — v2.4.0**
>
> **New: Single Sign-On (SSO) login**
> You can now log in using your organization's SSO provider, in addition to email/password.
>
> **Fixed: Pagination bug**
> Fixed an issue where paginated API results could occasionally return one fewer item than expected on the last page.
>
> **⚠️ Breaking change: `/v1/users` endpoint removed**
> The deprecated `/v1/users` endpoint (announced for removal in a previous release) has been removed. If you're still using it, switch to `/v2/users` before upgrading.
>
> **Omitted from customer-facing notes**
> The lodash dependency bump and internal documentation update were omitted — neither has a customer-visible effect. Confirm this is fine, or let me know if you'd like a fuller internal-audience version instead.

This example is illustrative — a real release notes document depends entirely on the actual changelog content and target audience for the target release.
