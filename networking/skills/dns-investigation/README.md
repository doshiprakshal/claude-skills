# DNS Investigation

Diagnoses general DNS resolution failures — resolver misconfiguration, propagation delays, external domain resolution failures, and DNSSEC validation issues.

See `SKILL.md` for the full workflow.

## How to invoke

- "Why won't this domain resolve?"
- "Is this a DNS propagation issue?"
- "DNSSEC validation failure."

## Example

### Input

```
$ dig app.example.com @8.8.8.8
;; ->>HEADER<<- status: SERVFAIL

$ dig app.example.com @1.1.1.1
;; ->>HEADER<<- status: SERVFAIL

$ dig app.example.com @ns1.example.com  # authoritative, non-validating query
;; ->>HEADER<<- status: NOERROR
app.example.com. 300 IN A 203.0.113.10

$ dig +dnssec app.example.com @8.8.8.8
;; RRSIG expired
```

### Output (abbreviated)

> **Symptom summary**
> Public validating resolvers (8.8.8.8, 1.1.1.1) both return `SERVFAIL`, but the authoritative nameserver returns a valid answer directly. This pattern — failure only on validating resolvers — points at DNSSEC.
>
> **Root cause**
> The `+dnssec` query confirms it: the RRSIG (signature) for this record has expired. DNSSEC-validating resolvers refuse to return the record once its signature is no longer valid (treating it as untrustworthy), which is why 8.8.8.8 and 1.1.1.1 both fail while a direct, non-validating query to the authoritative server still succeeds.
>
> **Recommended fix**
> Re-sign the zone (most DNS providers with DNSSEC auto-signing handle this automatically, but a manual/legacy DNSSEC setup can let signatures lapse). Check the DNS provider's DNSSEC signing status and re-trigger signing if it's stuck or misconfigured.
>
> **How to verify**
> After re-signing, `dig +dnssec app.example.com @8.8.8.8` should return `NOERROR` with a valid, current RRSIG instead of `SERVFAIL`.

This example is illustrative — a real investigation depends entirely on the actual DNS query results for the target domain.
