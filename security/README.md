# Security Skills

Planned: 20 skills. 20 built so far.

Each skill lives in its own subfolder under [`skills/`](./skills) with a `SKILL.md` (instructions Claude follows when the skill runs) and a `README.md` (what it does, how to invoke it, and a worked example).

## Built

| Skill | What it does |
|---|---|
| [`infrastructure-security`](./skills/infrastructure-security) | Holistic, cross-platform infra security posture triage. |
| [`kubernetes-security`](./skills/kubernetes-security) | Cluster/platform-level hardening — etcd, audit policy, API server, kubelet. |
| [`container-security`](./skills/container-security) | Image provenance, privilege surface, and registry security holistically. |
| [`iam-audit`](./skills/iam-audit) | Cross-platform machine identity least-privilege and trust-relationship audit. |
| [`secret-detection`](./skills/secret-detection) | Scans code/config/git history for exposed secrets. |
| [`cis-benchmark`](./skills/cis-benchmark) | Scores a system against the applicable CIS Benchmark. |
| [`compliance-audit`](./skills/compliance-audit) | Gap-maps controls against SOC2/PCI-DSS/HIPAA/GDPR. |
| [`vulnerability-analysis`](./skills/vulnerability-analysis) | Prioritizes a CVE backlog by exploitability and exposure, not CVSS alone. |
| [`dependency-review`](./skills/dependency-review) | Source dependency vulnerabilities, license risk, maintenance health. |
| [`supply-chain-security`](./skills/supply-chain-security) | Build provenance, artifact signing, SBOM, build-time dependency trust. |
| [`image-scan-review`](./skills/image-scan-review) | Triages container scan output by root cause and reachability. |
| [`runtime-security`](./skills/runtime-security) | Runtime threat detection coverage and rule tuning (e.g., Falco). |
| [`dockerfile-review`](./skills/dockerfile-review) | Static Dockerfile review — pinning, non-root, secret-in-layer risk. |
| [`admission-controller-review`](./skills/admission-controller-review) | OPA/Gatekeeper/Kyverno/PSA enforcement mode and coverage review. |
| [`network-security`](./skills/network-security) | Segmentation effectiveness, lateral-movement risk, zero-trust maturity. |
| [`identity-review`](./skills/identity-review) | Human identity lifecycle — SSO/MFA, offboarding, privileged access. |
| [`encryption-review`](./skills/encryption-review) | At-rest/in-transit coverage, key management, backup encryption. |
| [`audit-logging-review`](./skills/audit-logging-review) | Security audit log completeness, retention, tamper-resistance. |
| [`threat-modeling`](./skills/threat-modeling) | Structured STRIDE analysis for a system or proposed design. |
| [`security-architecture`](./skills/security-architecture) | Defense-in-depth maturity and blast-radius investment prioritization. |
