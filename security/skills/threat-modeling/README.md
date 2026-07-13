# Threat Modeling

Conducts a structured STRIDE-based threat modeling exercise for a system or proposed design — trust boundaries, systematic threat enumeration, and prioritized mitigations.

See `SKILL.md` for the full workflow.

## How to invoke

- "Threat model this system."
- "Run a STRIDE analysis on this architecture."
- "What are the threats to this new feature we're designing?"

## Example

### Input

New feature: a public API endpoint accepting user-uploaded files, which are processed by an internal worker service and stored in object storage, with results written to a database that a separate reporting service reads from.

### Output (abbreviated)

> **Trust boundaries identified**: (1) public internet → API endpoint, (2) API endpoint → internal worker service, (3) worker service → object storage, (4) database → reporting service.
>
> **Boundary 1 (public internet → API)**:
> - Spoofing: is the uploader's identity verified before accepting the file? — `[High priority]` if not currently enforced.
> - Denial of Service: large or numerous file uploads could exhaust processing capacity — `[High priority]` — recommend file size limits and rate limiting.
> - Elevation of Privilege: a maliciously crafted file could exploit the worker service's file-parsing logic — `[High priority]` — recommend sandboxed/isolated processing for untrusted file content.
>
> **Boundary 3 (worker → object storage)**:
> - Information Disclosure: are stored files access-controlled per-uploader, or could one user access another's uploaded files via storage misconfiguration? — `[High priority]` — see `encryption-review`/storage access-control checks.
>
> **Boundary 4 (database → reporting service)**:
> - Repudiation: does the database retain enough of an audit trail to attribute a specific report back to its originating upload if needed? — `[Medium priority]`.
>
> **Overall verdict**: the highest-priority threats are file-based exploitation of the worker service (Boundary 1/2) and per-uploader storage access control (Boundary 3) — recommend addressing sandboxed processing and storage access scoping before launch; the repudiation gap is lower urgency and can be addressed post-launch.

This example is illustrative — a real threat model depends entirely on the actual system architecture and data sensitivity involved.
