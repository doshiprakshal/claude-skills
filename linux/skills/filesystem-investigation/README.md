# Filesystem Investigation

Diagnoses filesystem-level issues — disk full despite apparent free space (inode exhaustion, deleted-but-open files), mount problems, read-only remounts from filesystem errors, and permission issues.

See `SKILL.md` for the full workflow.

## How to invoke

- "Disk is full but df shows space."
- "Why did the filesystem remount read-only?"
- "No space left on device but there's space."

## Example

### Input

```
$ df -h /var
Filesystem      Size  Used  Avail  Use%
/dev/sda1        50G   30G    18G   63%
```
Application logs `write failed: No space left on device`.

```
$ df -i /var
Filesystem      Inodes  IUsed   IFree  IUse%
/dev/sda1      3276800 3276800     0   100%
```

### Output (abbreviated)

> **Symptom summary**
> `df -h` shows 18G free (63% used), but the application is getting "No space left on device" — a classic mismatch signal.
>
> **Root cause**
> `df -i` shows inode usage at 100% (all 3,276,800 inodes used) despite plenty of block space free. The filesystem has run out of inodes, not disk space — this happens when there are a huge number of small files (each file, regardless of size, consumes one inode). "No space left on device" is the exact error Linux returns for both conditions, which is why `df -h` alone doesn't explain it.
>
> **Recommended fix**
> Find what's consuming inodes: `find /var -xdev -printf '%h\n' | sort | uniq -c | sort -rn | head` to identify the directory with the most files. Common culprits: an unbounded cache directory, a mail queue, or a logging setup creating one file per event instead of appending. Clean up or restructure the offending directory, then consider whether the filesystem needs to be reformatted with more inodes if this is a recurring pattern (inode count is typically fixed at filesystem creation time and can't be increased in-place on most filesystems).

This example is illustrative — a real investigation depends entirely on the actual evidence gathered from the target host.
