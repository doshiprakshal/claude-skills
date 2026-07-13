# Context Window Optimization

Optimizes context window composition — redundancy removal, conversation history handling, and information ordering/placement for effective model attention.

See `SKILL.md` for the full workflow.

## How to invoke

- "Optimize our context window usage."
- "Are we wasting context window space?"
- "Does the order of information in our prompt matter?"

## Example

### Input

A chat assistant feature includes: a 1500-token system prompt (contains detailed product documentation that also appears in retrieved RAG context for most queries), full unabridged conversation history for every turn (some conversations exceed 40 turns), and 5 few-shot examples included on every single request regardless of query type. Critical output-format instructions are placed in the middle of the system prompt, surrounded by other content.

### Output (abbreviated)

> **Findings**
>
> - **System prompt duplicates content already in retrieved RAG context** — `[Medium]` — the same product documentation appears in both the static system prompt and dynamically retrieved context for most queries, wasting context space on redundant information. Recommend trimming the system prompt to instructions/behavior guidance only, relying on retrieval for factual product content.
> - **Unbounded conversation history inclusion (40+ turns observed)** — `[High]` — long conversations are consuming an increasing share of the context budget with full verbatim history, likely crowding out retrieved context or hitting context limits in extended conversations. Recommend a bounded approach: keep recent N turns verbatim, summarize older turns.
> - **5 few-shot examples included on every request regardless of query type** — `[Medium]` — if query types vary, not all 5 examples are relevant to every request; consider selecting a smaller, more targeted subset per query type rather than a fixed set applied universally.
> - **Critical output-format instructions buried mid-prompt** — `[Medium]` — given the "lost in the middle" effect on long contexts, placing critical instructions in the middle rather than the beginning or end of the prompt risks reduced adherence. Recommend moving format instructions to the very start or very end of the system prompt.
>
> **Overall verdict**: the unbounded conversation history is the highest-priority fix given it grows without bound and directly threatens to exceed context limits in long conversations; the other findings are efficiency/quality improvements with lower urgency.

This example is illustrative — a real optimization depends entirely on the actual prompt composition discovered.
