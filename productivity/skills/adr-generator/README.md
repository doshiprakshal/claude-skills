# ADR Generator

Generates an Architecture Decision Record from a discussion or decision context — context, decision, alternatives considered, and consequences.

See `SKILL.md` for the full workflow.

## How to invoke

- "Generate an ADR for this decision."
- "Write up this architectural decision as an ADR."
- "Draft an architecture decision record for our recent choice."

## Example

### Input

Team decided to adopt gRPC for internal service-to-service communication, replacing REST/JSON for new services. Considered alternatives: staying with REST/JSON (rejected due to serialization overhead at current scale), GraphQL (rejected — not a good fit for service-to-service, better suited for client-facing APIs). Known tradeoff: gRPC requires more tooling investment and has a steeper learning curve for the team.

### Output (abbreviated)

> **ADR-014: Adopt gRPC for Internal Service-to-Service Communication**
>
> **Status**: Accepted — [date]
>
> **Context**: As service-to-service call volume has grown, REST/JSON serialization overhead has become a measurable performance cost. The team evaluated options for internal communication going forward for new services.
>
> **Decision**: New internal services will use gRPC for service-to-service communication. Existing REST/JSON services are not required to migrate as part of this decision.
>
> **Alternatives Considered**:
> - **Continue with REST/JSON**: rejected due to serialization overhead becoming a measurable bottleneck at current scale.
> - **GraphQL**: rejected — better suited for client-facing APIs with flexible query needs than for internal service-to-service calls, which don't benefit from that flexibility and would add unnecessary complexity.
>
> **Consequences**: Requires investment in gRPC tooling (codegen, service mesh compatibility) and a learning curve for team members unfamiliar with it. In exchange, expected to reduce serialization overhead and provide stronger contract enforcement via protobuf schemas for new services.

This example is illustrative — a real ADR depends entirely on the actual decision and context provided.
