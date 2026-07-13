# CloudFormation Review

Reviews CloudFormation templates and stacks — drift detection, stack policy protection on critical resources, nested stack structure, and change set review before execution.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our CloudFormation template."
- "Check for CloudFormation drift."
- "Is this change set safe to execute?"

## Example

### Input

Pending change set for a stack containing `aws_rds_instance` (via `AWS::RDS::DBInstance`) shows:
```
Action: Modify
LogicalResourceId: PrimaryDatabase
Replacement: True
Details: [{ "CausingEntity": "DBSubnetGroupName", "ChangeSource": "DirectModification" }]
```
The database resource has no `DeletionPolicy` set (defaults to `Delete`).

### Output (abbreviated)

> **Findings**
>
> - **Change set will replace the production database** — `[Blocker]` — the `DBSubnetGroupName` change forces a full replacement (`Replacement: True`) of `PrimaryDatabase`. Combined with no `DeletionPolicy` set (defaulting to `Delete`), executing this change set would delete the existing database and its data as part of the replacement. Do not execute as-is — either find a change to `DBSubnetGroupName` that doesn't force replacement, or if replacement is unavoidable, add `DeletionPolicy: Snapshot` first and validate the snapshot/restore path before proceeding.
>
> **Recommended fix**
> Add `DeletionPolicy: Snapshot` (and ideally `UpdateReplacePolicy: Snapshot` too) to `PrimaryDatabase` before executing this or any future change set — this ensures a final snapshot is taken automatically if a replacement/deletion ever happens, whether intentional or not.
>
> **Overall verdict**
> Do not execute this change set until the deletion/replace policy is fixed and the subnet group change is re-evaluated for a non-destructive alternative.

This example is illustrative — a real review depends entirely on the actual template and change set for the target stack.
