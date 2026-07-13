---
name: platform-security
description: Review how security is baked into platform golden paths and self-service actions — whether security is the default/enforced outcome of using the platform, not an opt-in step, distinct from the deep technical security control review itself. Triggers on "is security baked into our golden paths by default", "review how our platform enforces security defaults", "do teams have to opt into security or is it automatic", "review platform-level security-by-default posture".
user-invocable: true
---

# Platform Security

Review whether security is the automatic, enforced default outcome of using the platform's golden paths and self-service actions, rather than an opt-in step teams can skip.

## When to use

- Assessing whether the platform makes secure-by-default the path of least resistance.

**Out of scope**:
- The actual security control content/depth (what the security policy should require) → the relevant `security/` domain skill (`kubernetes-security`, `container-security`, `iam-audit`, `encryption-review`, etc.)
- Whether admission control enforcement is correctly configured at the policy-engine level → `security/admission-controller-review`

## Inputs

- What security-relevant defaults the platform's golden paths/templates currently set (or don't).
- Whether self-service actions have security guardrails baked in or bolted on as a separate, skippable step.

## Workflow

### 1. Assess default posture in templates/golden paths

Check whether templates/golden paths produce secure-by-default output (e.g., a new-service template that defaults to non-root containers, scoped IAM roles, encrypted storage) without the user needing to know to ask for it — cross-reference `template-review`/`golden-path-review` findings if available, but frame this specifically around the security dimension.

### 2. Assess whether security is enforced or advisory

Determine whether security-relevant defaults are actually enforced (can't easily be turned off without deliberate, visible action) or merely advisory/suggested and easily bypassed — an insecure-by-default escape hatch that's just as easy to use as the secure path undermines the whole "secure by default" premise.

### 3. Assess self-service guardrails

For self-service actions, confirm security guardrails (least-privilege scoping, quota limits, policy checks) are built into the self-service flow itself, not a separate manual security-review step that teams can route around or forget (cross-reference `self-service-review`'s guardrail-appropriateness check, applied specifically to security here).

### 4. Assess the friction of doing the secure thing vs. the insecure thing

The core question: for a developer using the platform normally, is the secure path also the easiest path? If following the insecure/legacy pattern is easier or faster than the platform's secure default, most teams will end up on the insecure path despite the secure option technically existing.

### 5. Report

Findings on Template/Golden-Path Defaults, Enforcement vs. Advisory, Self-Service Guardrails, Relative Friction, each with severity, routed to the relevant `security/` domain skill for the underlying control's depth.

## Notes

- The single most important question this skill answers is "is the secure path also the path of least resistance" — a technically-available secure option that requires more effort than the insecure default will lose in practice; always frame findings around relative friction, not just feature existence.
- An advisory-only security default (easily overridden, no visible friction to bypass) provides much weaker real-world protection than an enforced one — treat "exists but not enforced" as a distinct, lower-confidence finding from "exists and enforced."
