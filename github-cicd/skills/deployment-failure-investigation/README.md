# Deployment Failure Investigation

Diagnoses why a specific CI/CD deployment failed — distinguishing build failure, test failure, and deploy-step failure using pipeline logs and exit codes, working through a root-cause catalog with evidence.

See `SKILL.md` for the full workflow.

## How to invoke

- "Why did this deployment fail?"
- "Our pipeline failed, help me debug it."
- "Diagnose this failed CI run."

## Example

### Input

Deploy stage failed with:
```
Error: AccessDenied: User: arn:aws:iam::123456789012:role/ci-deploy-role is not authorized to perform: ecs:UpdateService
```
This deploy stage succeeded on every run for the past 3 months. No changes to the pipeline YAML or deploy script in this run's diff.

### Output (abbreviated)

> **Symptom summary**
> Deploy stage failed with `AccessDenied` on `ecs:UpdateService` for `ci-deploy-role` — first occurrence after 3 months of consistent success, no pipeline/script changes in this run.
>
> **Evidence collected**
> - Error is a clean IAM authorization denial, not a network/timeout error.
> - No code/pipeline changes in this run's diff — rules out a build or deploy-script regression.
>
> **Root cause analysis**
> - Build/test failure — **ruled out**: the failure is specifically at the deploy step, an IAM authorization error, not a build or test failure.
> - Deploy-script regression — **ruled out**: no changes to the pipeline or deploy script in this run, and the role/action being called (`ecs:UpdateService`) matches every prior successful run.
> - Credential/permission change — **most likely**: the role's permissions have not changed in this pipeline's code, so the change is almost certainly on the AWS IAM side — either the role's policy was modified, or a permissions boundary/SCP was added, outside of what this pipeline controls.
>
> **Root cause**
> `ci-deploy-role`'s IAM permissions changed outside this pipeline (likely a policy edit or a new SCP), removing `ecs:UpdateService` access that existed previously. Recommend running `cloudtrail-investigation` (AWS domain) scoped to this role's policy, around the time of the last successful run, to find exactly what changed.
>
> **Recommended fix**
> Restore `ecs:UpdateService` permission to `ci-deploy-role`, or identify and adjust the SCP/policy that removed it, once the CloudTrail investigation confirms the specific change.
>
> **How to verify**
> Re-run the pipeline after the permission fix — the deploy stage should succeed with no other changes needed.

This example is illustrative — a real investigation depends entirely on the actual pipeline logs and evidence available for the target failure.
