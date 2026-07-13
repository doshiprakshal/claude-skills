# Compliance Audit

Maps current security controls against a regulatory/industry compliance framework (SOC2, PCI-DSS, HIPAA, GDPR), identifying gaps between practice and requirement.

See `SKILL.md` for the full workflow.

## How to invoke

- "Are we compliant with SOC2?"
- "Map our controls against PCI-DSS requirements."
- "Gap analysis against HIPAA technical safeguards."

## Example

### Input

Target: SOC2 Type II readiness. Access control: MFA is enforced for all production access (technically in place, but no documented access-review process exists). Encryption: data at rest is encrypted (verified). Logging: centralized logging exists, but retention policy is undocumented and inconsistently applied across services.

### Output (abbreviated)

> **Control area: Access Control**
> Requirement: access reviewed periodically, MFA enforced. **Current state**: MFA enforced (control exists). **Gap type**: Evidentiary — no documented periodic access-review process exists, which SOC2 auditors will specifically request evidence of. **Remediation**: establish and document a quarterly access-review process; the technical control (MFA) is already sufficient.
>
> **Control area: Encryption**
> Requirement: data at rest encrypted. **Current state**: verified encrypted. **Gap type**: None — fully satisfied. See `encryption-review` if deeper verification across all data stores is wanted.
>
> **Control area: Logging & Monitoring**
> Requirement: consistent log retention supporting audit trail requirements. **Current state**: centralized logging exists but retention policy is undocumented and inconsistently applied. **Gap type**: Missing control (partial) — this is a real technical/process gap, not just missing documentation, since inconsistent retention means some services may not actually retain logs long enough. **Remediation**: define and enforce a consistent retention policy; see `audit-logging-review` for the technical depth.
>
> **Overall verdict**: the access-control gap is a quick documentation fix; the logging gap requires actual technical remediation (consistent retention enforcement) before it can be evidenced — prioritize the logging fix given the longer lead time.

This example is illustrative — a real audit depends entirely on the actual framework version and controls assessed, and does not substitute for a formal audit by a qualified assessor.
