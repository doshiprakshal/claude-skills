# API Gateway Review

Reviews API Gateway configuration — throttling limits, authorization mechanism, caching, stage/deployment hygiene, and request/response validation.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our API Gateway."
- "Is our API Gateway auth correct?"
- "API Gateway caching review."

## Example

### Input

`GET /users/{id}/profile` route has caching enabled with a 5-minute TTL, but the cache key configuration only includes the path (`/users/{id}/profile`), not authorization-header-derived identity — wait, more precisely: the `{id}` path parameter *is* included in the cache key, but a separate `GET /account` route (returning the caller's own account based on their auth token, not a path parameter) also has caching enabled with only the method+path as the cache key, no header-based key component.

### Output (abbreviated)

> **Findings**
>
> - **`GET /account` cache key doesn't include caller identity — cross-user data leak risk** — `[Blocker]` — this route returns data specific to the authenticated caller (derived from their auth token), but the cache key is just `GET /account` with no per-user component. The first caller's response gets cached and served to every subsequent caller hitting this route within the 5-minute TTL, regardless of who they are. Add the relevant identity claim (or the auth header itself) to the cache key parameters, or disable caching on this route if per-user caching isn't worth the complexity.
> - **`GET /users/{id}/profile` cache key is correctly scoped** — *(Passed)* — `{id}` is part of the cache key, so different users' profiles don't collide with each other's cached responses.
>
> **Overall verdict**
> The `/account` route is a live, active cross-user data leak — treat as the top priority regardless of anything else found in this review. Disable caching on it immediately while the cache-key fix is implemented and tested.

This example is illustrative — a real review depends entirely on the actual API Gateway configuration discovered for the target account.
