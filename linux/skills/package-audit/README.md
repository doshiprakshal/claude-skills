# Package Audit

Audits installed packages — outdated/vulnerable versions against known CVEs, unnecessary packages increasing attack surface, orphaned dependencies, and held-back updates.

See `SKILL.md` for the full workflow.

## How to invoke

- "Audit our installed packages."
- "Are we running vulnerable package versions?"
- "Why are these packages held back from updating?"

## Example

### Input

```
$ apt list --upgradable
openssl/stable 3.0.2-0ubuntu1.10 amd64 [upgradable from: 3.0.2-0ubuntu1.7]
```
The available update addresses CVE-2024-XXXXX (marked critical by the distribution's security advisory, remote code execution). Package has been held: `apt-mark showhold` lists `openssl`, with a note in team chat from 8 months ago about a since-resolved compatibility issue with an older app version.

### Output (abbreviated)

> **Findings**
>
> - **Critical CVE unpatched due to an outdated hold** — `[Blocker]` — `openssl` is held at a version vulnerable to a critical, remotely-exploitable CVE, and the fixed version is available but blocked by a hold placed 8 months ago for a compatibility reason that's since been resolved (the app was upgraded past the incompatibility 3 months ago, per deployment history). The hold is no longer serving any purpose and is now just blocking a critical security patch. Remove the hold and upgrade `openssl` immediately.
>
> **Recommended fix**
> `apt-mark unhold openssl && apt install --only-upgrade openssl`, then verify the app still functions correctly (the original compatibility concern should no longer apply, but worth a quick check given the hold's history).
>
> **Overall verdict**
> This is a critical, actively unpatched vulnerability caused by a stale hold outliving its original reason — treat as top priority. Review other held packages for the same pattern (a hold outliving its justification).

This example is illustrative — a real audit depends entirely on the actual package inventory and CVE data discovered for the target host.
