# Helm Release Comparison

Diffs two Helm releases or two revisions of the same release — rendered manifest diff, values diff, and chart version diff — summarized by category of change rather than a raw line diff.

See `SKILL.md` for the full workflow.

## How to invoke

- "Diff these two Helm releases."
- "What changed between Helm revisions 4 and 5?"
- "Compare our staging and prod releases of `checkout-api`."

## Example

### Input

Comparing `checkout-api` in `staging` vs. `prod` — same chart version, different values.

### Output (abbreviated)

> **Summary**
> Staging and prod are on the same chart version (`2.3.1`), but differ in 3 config values and prod is missing a NetworkPolicy that staging has.
>
> **Categorized diff**
>
> *Image/config changes:*
> - `env.LOG_LEVEL`: staging=`debug`, prod=`info` (expected difference)
> - `resources.requests.cpu`: staging=`100m`, prod=`500m` (expected — prod sized for real load)
>
> *New/removed resources:*
> - `NetworkPolicy/checkout-api-allow-db` present in **staging only** — missing in prod. This looks unintentional given prod is the environment that most needs network isolation.
>
> *RBAC changes:*
> None.
>
> *Chart version:*
> Identical (`2.3.1`) on both sides.
>
> **Values diff** *(excerpt)*
> ```diff
> - networkPolicy.enabled: true   (staging)
> + networkPolicy.enabled: false  (prod)
> ```
>
> The `NetworkPolicy` gap traces directly to `networkPolicy.enabled` being explicitly set to `false` in prod's values — worth confirming whether that was intentional, since it's the opposite of what you'd expect for the more sensitive environment.

This example is illustrative — a real comparison depends entirely on the actual releases/revisions being compared.
