# API Documentation

Reviews or generates API reference documentation — endpoint/parameter completeness, example accuracy against actual behavior, and error case coverage.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our API documentation."
- "Generate API docs for this endpoint."
- "Check our API docs for accuracy against the actual implementation."

## Example

### Input

Documentation for `POST /orders` shows an example response with fields `id`, `status`, `total`. The actual implementation (checked against the OpenAPI spec) also returns a `created_at` field not mentioned anywhere in the docs, and an optional `discount_code` request parameter is undocumented. Only a single "400 Bad Request" error case is documented; the actual API also returns 401 for missing auth and 429 for rate limiting, neither documented.

### Output (abbreviated)

> **Findings**
>
> - **Undocumented response field: `created_at`** — `[Medium]` — present in actual responses but missing from docs; integrators relying solely on the documented shape wouldn't know to expect it. Add to the example response and field reference.
> - **Undocumented optional parameter: `discount_code`** — `[High]` — a real, usable parameter with no documentation at all is effectively undiscoverable to API consumers without reading source code or the spec directly. Add to the parameter reference.
> - **Missing error case documentation: 401 and 429** — `[High]` — only the 400 case is documented; callers integrating against this endpoint would have to discover the 401 (auth) and 429 (rate limit) behaviors empirically. Add both with their actual response bodies.
>
> **Overall verdict**: the undocumented `discount_code` parameter and missing error cases are the highest-priority gaps — both directly affect an integrator's ability to build against this endpoint correctly without trial and error.

This example is illustrative — a real review depends entirely on the actual API implementation and existing documentation.
