# Linux Skills

Planned: 20 skills. 20 built so far.

Each skill lives in its own subfolder under [`skills/`](./skills) with a `SKILL.md` (instructions Claude follows when the skill runs) and a `README.md` (what it does, how to invoke it, and a worked example).

## Built

| Skill | What it does |
|---|---|
| [`performance-investigation`](./skills/performance-investigation) | Triages a general "system is slow" report, routing to the right resource-specific investigation. |
| [`cpu-investigation`](./skills/cpu-investigation) | Confirmed CPU bottleneck — culprit process, system time, steal time, D-state misreads. |
| [`memory-investigation`](./skills/memory-investigation) | Confirmed memory pressure — leak vs. page cache misread vs. swapping vs. OOM kill. |
| [`disk-investigation`](./skills/disk-investigation) | Confirmed disk I/O bottleneck — culprit process, saturation vs. throttling vs. failing device. |
| [`filesystem-investigation`](./skills/filesystem-investigation) | Disk-full-despite-space, inode exhaustion, deleted-open-files, read-only remounts. |
| [`process-investigation`](./skills/process-investigation) | A specific misbehaving process — zombies, hangs, D-state, orphans. |
| [`network-investigation`](./skills/network-investigation) | Host-level network — TIME_WAIT pileup, conntrack exhaustion, interface drops. |
| [`kernel-log-analysis`](./skills/kernel-log-analysis) | Catalog of what common kernel message patterns mean. |
| [`journalctl-analysis`](./skills/journalctl-analysis) | Effective systemd journal querying and cross-unit correlation. |
| [`dmesg-analysis`](./skills/dmesg-analysis) | Timeline reconstruction from a specific dmesg dump, correlated to an incident. |
| [`system-health`](./skills/system-health) | Fast live triage of overall host health, routing anything abnormal. |
| [`security-audit`](./skills/security-audit) | Sudoers scope, account hygiene, file permissions, exposed services, patch status. |
| [`startup-analysis`](./skills/startup-analysis) | Slow boot diagnosis via systemd-analyze blame/critical-chain. |
| [`service-failure-investigation`](./skills/service-failure-investigation) | Why a systemd service failed — exit codes, cgroup kills, dependency failures. |
| [`package-audit`](./skills/package-audit) | Vulnerable package versions, unnecessary packages, stale holds. |
| [`ssh-security`](./skills/ssh-security) | sshd_config hardening, authorized_keys hygiene, brute-force protection. |
| [`cron-review`](./skills/cron-review) | Schedule overlap risk, failure visibility, script permission hygiene. |
| [`log-analysis`](./skills/log-analysis) | General-purpose pattern/anomaly extraction from arbitrary log files. |
| [`capacity-planning`](./skills/capacity-planning) | Forecasts resource exhaustion from historical growth trends. |
| [`runbook-generator`](./skills/runbook-generator) | Generates a host-specific incident runbook grounded in actual configuration. |
