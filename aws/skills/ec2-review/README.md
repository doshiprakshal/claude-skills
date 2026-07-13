# EC2 Review

Reviews EC2 instances for hygiene and safety — AMI/patch currency, unencrypted EBS volumes, unused/idle instances, key pair and access hygiene, and instance metadata service (IMDS) configuration.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our EC2 instances."
- "Are our EC2 instances patched?"
- "Check IMDSv2 on our instances."

## Example

### Input

Fleet scan: 12 instances, 5 still allow IMDSv1 (`HttpTokens: optional`), 2 running from an AMI baked 14 months ago, 1 instance with unencrypted root volume and a public IP with SSH (port 22) open to `0.0.0.0/0`.

### Output (abbreviated)

> **Findings**
>
> - **5 instances allow IMDSv1** — `[High]` — `HttpTokens` is `optional`, not `required`, on 5 instances. IMDSv1 is a known SSRF-to-credential-theft vector (an SSRF vulnerability in any app running on these instances could be used to steal the instance's IAM role credentials). Enforce IMDSv2 (`HttpTokens: required`) on all 5.
> - **Public SSH access on an instance with an unencrypted root volume** — `[Blocker]` — one instance combines an unencrypted root volume with SSH open to the entire internet. Restrict SSH to a specific range (or switch to SSM Session Manager and close port 22 entirely), and enable encryption on a new volume/instance (EBS encryption can't be enabled in-place on an existing unencrypted volume — requires a snapshot-and-recreate).
> - **2 instances on a 14-month-old AMI** — `[Medium]` — likely missing over a year of OS/security patches. Rebuild from a current baseline AMI.
>
> **Overall verdict**
> The publicly-exposed, unencrypted instance is the most urgent — it combines two real risks. IMDSv2 enforcement across the fleet is the next priority, then AMI refresh for the 2 stale instances.

This example is illustrative — a real review depends entirely on the actual EC2 fleet discovered for the target account.
