# Proxy Investigation

Diagnoses issues with a forward or reverse proxy — configuration correctness, connection handling limits, header manipulation bugs, and buffering-related timeouts.

See `SKILL.md` for the full workflow.

## How to invoke

- "Why is our proxy dropping headers?"
- "Nginx returning 502/504."
- "Why is our reverse proxy timing out on WebSocket connections?"

## Example

### Input

nginx reverse proxy in front of a WebSocket-based application. Regular HTTP requests work fine, but WebSocket connections fail immediately after the initial handshake. `nginx.conf` has no special configuration for the WebSocket location block beyond a standard `proxy_pass`.

### Output (abbreviated)

> **Symptom summary**
> WebSocket connections fail right after handshake; regular HTTP through the same proxy works fine.
>
> **Root cause**
> nginx requires explicit configuration to support WebSocket's connection upgrade — by default, nginx doesn't forward the `Upgrade`/`Connection` headers needed for the HTTP-to-WebSocket protocol upgrade, and without them the proxied connection doesn't actually establish as a WebSocket (even though the initial handshake response might look successful at the HTTP level). This is a very common, specific nginx+WebSocket configuration gap.
>
> **Recommended fix**
> Add to the relevant `location` block:
> ```nginx
> proxy_http_version 1.1;
> proxy_set_header Upgrade $http_upgrade;
> proxy_set_header Connection "upgrade";
> ```
> Also confirm `proxy_read_timeout` is set high enough for long-lived WebSocket connections (the default is often too short for persistent connections and would cause them to be cut off after the default timeout even once the upgrade itself works).
>
> **How to verify**
> After the fix, WebSocket connections through the proxy should stay open and functional beyond the initial handshake.

This example is illustrative — a real investigation depends entirely on the actual proxy configuration and symptom for the target setup.
