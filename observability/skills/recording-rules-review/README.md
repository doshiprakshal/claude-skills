# Recording Rules Review

Reviews Prometheus recording rules — whether they actually reduce query load/improve dashboard performance, redundancy between rules, and naming convention consistency.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our recording rules."
- "Are our recording rules actually helping?"
- "Do we have redundant recording rules?"

## Example

### Input

40 recording rules found. Cross-referencing against all dashboards and alert rules shows 12 of them are never queried by anything. Two others (`job:http_errors:rate5m` and `service_error_rate_5m`) compute nearly identical aggregations with different naming conventions.

### Output (abbreviated)

> **Findings**
>
> - **12 of 40 recording rules are never used** — `[Medium]` — these rules are computed and stored on every evaluation cycle with zero consumers. Pure overhead. Safe to remove after confirming (e.g., via a brief deprecation period) nothing undiscovered depends on them.
> - **Redundant rules with inconsistent naming** — `[Low]` — `job:http_errors:rate5m` (follows Prometheus naming convention) and `service_error_rate_5m` (doesn't) compute nearly the same thing. Consolidate into one, following the standard `level:metric:operations` convention, and update any consumers of the removed one.
>
> **Overall verdict**
> Removing the 12 unused rules is a clean, low-risk cleanup with a direct (if modest) reduction in evaluation overhead. The redundant-rule consolidation is a smaller, secondary improvement.

This example is illustrative — a real review depends entirely on the actual recording rules and their usage discovered for the target instance.
