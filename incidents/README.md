# Incident Response Skills

Planned: 20 skills. 20 built so far.

Each skill lives in its own subfolder under [`skills/`](./skills) with a `SKILL.md` (instructions Claude follows when the skill runs) and a `README.md` (what it does, how to invoke it, and a worked example).

## Built

| Skill | What it does |
|---|---|
| [`incident-investigator`](./skills/incident-investigator) | End-to-end evidence gathering and root-cause hypothesis during an active incident. |
| [`rca-generator`](./skills/rca-generator) | Formal RCA document distinguishing trigger, root cause, and contributing factors. |
| [`timeline-generator`](./skills/timeline-generator) | Precise, source-attributed chronological timeline from scattered evidence. |
| [`executive-summary`](./skills/executive-summary) | Leadership-facing, non-technical impact/cause/prevention summary. |
| [`customer-summary`](./skills/customer-summary) | Customer-facing status update or public postmortem draft. |
| [`slack-summary`](./skills/slack-summary) | Brief, scannable real-time incident-channel status update. |
| [`postmortem-generator`](./skills/postmortem-generator) | Assembles the full blameless postmortem document from all inputs. |
| [`lessons-learned`](./skills/lessons-learned) | Extracts systemic, cross-incident patterns from a set of postmortems. |
| [`impact-assessment`](./skills/impact-assessment) | Quantifies affected users/requests, duration, and business impact. |
| [`blast-radius-analysis`](./skills/blast-radius-analysis) | Maps direct, transitive, and shared-fate architectural exposure. |
| [`recovery-planner`](./skills/recovery-planner) | Sequences safe recovery steps by risk/reversibility with checkpoints. |
| [`escalation-assistant`](./skills/escalation-assistant) | Decides whether/who to escalate to and drafts the handoff. |
| [`communication-draft`](./skills/communication-draft) | Audience-specific incident communication not covered by other skills. |
| [`major-incident-commander`](./skills/major-incident-commander) | Coordinates workstreams and maintains the decision log for major incidents. |
| [`action-item-generator`](./skills/action-item-generator) | Concrete, verifiable, owned action items from RCA findings. |
| [`incident-trend-analysis`](./skills/incident-trend-analysis) | Volume/severity/MTTR trends and disproportionate contributors over time. |
| [`repeat-incident-detection`](./skills/repeat-incident-detection) | Detects whether an incident is a root-cause-level repeat of a past one. |
| [`root-cause-categorization`](./skills/root-cause-categorization) | Tags an incident's root cause against a consistent taxonomy. |
| [`runbook-recommendation`](./skills/runbook-recommendation) | Drafts a runbook from how a failure mode was actually resolved. |
| [`incident-metrics-review`](./skills/incident-metrics-review) | Reviews the response program's own MTTD/MTTR/closure-rate health. |
