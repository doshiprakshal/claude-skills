# RFC Review

Reviews an RFC document for process and technical soundness — stage readiness, scope clarity, decision-making authority, and genuine feedback invitation.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review this RFC."
- "Is this RFC ready to send out for comments?"
- "Give feedback on this RFC before we circulate it."

## Example

### Input

An RFC proposing a new internal API standard is about to be sent to the entire engineering org for comment. It presents the standard as fully finalized with no open questions section, doesn't state who has final decision authority if disagreements arise, and doesn't specify whether existing services are expected to migrate or only new ones.

### Output (abbreviated)

> **Findings**
>
> - **No genuine open questions — reads as already decided** — `[High]` — circulating this org-wide with no stated open questions signals to reviewers that their feedback isn't actually going to change anything, which risks disengagement and undermines trust in future RFCs. Add a specific "open questions" section (e.g., migration timeline, exception process) to genuinely invite input on the parts that are actually still undecided.
> - **No decision-making authority stated** — `[High]` — with no clear owner for resolving disagreement, an org-wide RFC on a standard like this is likely to generate significant comment volume; without a stated resolution process, it risks stalling indefinitely. Add a line naming who makes the final call and by when.
> - **Scope ambiguity: existing vs. new services** — `[Medium]` — this is exactly the kind of question likely to dominate the comment thread unproductively if not addressed upfront. Add an explicit scope statement.
>
> **Overall verdict**: not yet ready for org-wide circulation — recommend adding the open-questions section and clarifying decision authority and scope first, since as written this risks generating unfocused feedback and stalling.

This example is illustrative — a real review depends entirely on the actual RFC content and process context.
