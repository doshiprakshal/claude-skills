---
name: package-audit
description: Audit installed packages — outdated/vulnerable versions against known CVEs, unnecessary packages increasing attack surface, orphaned dependencies, and held-back updates. Triggers on "audit our installed packages", "are we running vulnerable package versions", "package hygiene review", "why are these packages held back from updating".
user-invocable: true
---

# Package Audit

Review a host's installed package inventory for security and hygiene issues.

## When to use

- A periodic package hygiene review.
- The user asks whether installed packages have known vulnerabilities.

**Out of scope**:
- Container image scanning → the `security` domain's `image-scan-review`
- SSH-specific configuration → `ssh-security`

## Inputs

- Installed package list and versions (`dpkg -l`/`rpm -qa`).
- Available security updates (`apt list --upgradable`/`yum updateinfo` or equivalent).
- Held/pinned package versions, if any.

## Workflow

### 1. Discover

Gather the installed package inventory and available update/security-advisory information.

### 2. Checks

- **Known-vulnerable versions** — installed package versions with published CVEs, especially those marked critical/high severity by the distribution's security advisories.
- **Unnecessary packages increasing attack surface** — packages installed but not actually needed for the host's function (a full desktop environment on a server, unused network services, compilers/dev tools on a production host) — each is additional attack surface and patch burden with no corresponding benefit.
- **Orphaned dependencies** — packages that were dependencies of something since removed, now unused and unmaintained by any explicit install intent.
- **Held-back updates** — packages deliberately pinned/held from updating; confirm the reason is still valid (a known compatibility issue that's since been resolved upstream would mean the hold is now just accumulating unpatched vulnerabilities for no remaining benefit).
- **Repository trust** — package sources (APT/YUM repos) are from trusted, expected origins, not an unexpected third-party repo that could serve compromised packages.

### 3. Report

Findings grouped by Vulnerable Versions, Unnecessary Packages, Orphaned Dependencies, Held Updates, Repository Trust, each with severity (CVE severity informing package-vulnerability severity) and fix.

## Notes

- Prioritize by actual CVE severity and exploitability, not just package count — one critical, remotely-exploitable CVE matters far more than a dozen low-severity findings.
- Before recommending removal of a package, confirm nothing on the host actually depends on it (check reverse dependencies) to avoid breaking something.
