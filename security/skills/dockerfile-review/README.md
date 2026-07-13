# Dockerfile Review

Statically reviews a Dockerfile for security and best-practice issues — base image pinning, non-root user, secret-in-layer risk, and multi-stage build usage.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review this Dockerfile."
- "Check this Dockerfile for security issues."
- "Review our Dockerfile for secrets or bad practices."

## Example

### Input

```dockerfile
FROM node:latest
COPY . .
ARG NPM_TOKEN
RUN echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc && npm install && rm .npmrc
CMD ["node", "server.js"]
```

### Output (abbreviated)

> **Findings**
>
> - **Mutable base image tag `node:latest`** — `[High]` — pin to a specific version and ideally digest, e.g. `node:20.11.0-slim@sha256:...`.
> - **`NPM_TOKEN` persists in an image layer despite being deleted** — `[Blocker]` — the `.npmrc` file containing the token is written and removed within the same `RUN` instruction here, which does avoid a separate persisted layer *in this specific case* — but the `ARG NPM_TOKEN` itself is still visible in image history via `docker history`. Use `RUN --mount=type=secret` instead so the token never appears in any layer or build history.
> - **No `USER` directive — running as root** — `[High]` — add `USER node` (the base image provides a non-root `node` user) after installing dependencies.
> - **`COPY . .` with no `.dockerignore` visible** — `[Medium]` — likely pulls in `.git`, local `node_modules`, and other unintended content into the build context. Add a `.dockerignore` excluding these.
> - **No multi-stage build** — `[Advisory]` — if there are build-only dependencies, consider a builder stage to keep the final image minimal.
>
> **Corrected snippet**:
> ```dockerfile
> FROM node:20.11.0-slim@sha256:<digest>
> COPY package*.json ./
> RUN --mount=type=secret,id=npm_token \
>     NPM_TOKEN=$(cat /run/secrets/npm_token) npm install
> COPY . .
> USER node
> CMD ["node", "server.js"]
> ```

This example is illustrative — a real review depends entirely on the actual Dockerfile content.
