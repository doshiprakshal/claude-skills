---
name: api-documentation
description: Review or generate API reference documentation — endpoint/parameter completeness, example request/response accuracy, and error case coverage, specific to API-reference-style docs. Triggers on "review our api documentation", "generate api docs for this endpoint", "is our api reference documentation complete", "check our api docs for accuracy against the actual implementation".
user-invocable: true
---

# API Documentation

Review or generate API reference documentation — endpoint completeness, example accuracy, and error case coverage.

## When to use

- Reviewing or generating API reference-style documentation specifically (endpoints, parameters, request/response formats).

**Out of scope**:
- General technical documentation/guides not in API-reference format → `technical-documentation`
- A project's top-level README → `readme-generator`

## Inputs

- The API's actual implementation (or an existing spec like OpenAPI) to check documentation against.
- Existing API documentation, if reviewing rather than generating from scratch.

## Workflow

### 1. Assess endpoint/parameter completeness

Check that every endpoint, parameter (including optional ones), and response field is actually documented — missing optional parameters are a commonly overlooked gap, since required ones are more likely to be documented by default.

### 2. Verify example accuracy against actual behavior

Check that example requests/responses shown in the documentation actually match current real behavior — stale examples (from a prior API version) are a common and confusing gap; verify against the actual implementation or spec where possible, not just internal consistency of the docs themselves.

### 3. Assess error case coverage

Check that documented error responses cover the error cases a caller would actually realistically encounter (validation errors, auth failures, rate limiting, not-found) with their actual status codes and response bodies — undocumented error behavior forces callers to discover it empirically.

### 4. Assess authentication/authorization documentation

Check that auth requirements are clearly documented per endpoint, including any scope/permission requirements — this is a common source of integration friction when unclear.

### 5. Report or generate

For a review: findings on Endpoint/Parameter Completeness, Example Accuracy, Error Case Coverage, Auth Documentation, each with severity. For generation: the drafted API documentation matching this structure.

## Notes

- Always verify examples against actual current behavior rather than trusting the documentation's internal consistency alone — a beautifully consistent set of examples can still be uniformly stale if the API has changed since they were written.
- Error case documentation is frequently the most incomplete part of API docs despite being high-value for integrators — prioritize checking this even if not the primary stated concern.
