# Jenkins Review

Reviews Jenkins pipeline configuration (Jenkinsfile) and instance hygiene — credential handling, plugin currency, agent/executor allocation, and script security.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our Jenkinsfile."
- "Jenkins pipeline review."
- "Is our Jenkins credential handling safe?"

## Example

### Input

```groovy
pipeline {
  agent any   // runs directly on whatever's available, including the controller
  stages {
    stage('Deploy') {
      steps {
        sh "curl -H 'Authorization: Bearer ${env.DEPLOY_TOKEN}' https://api.example.com/deploy"
        // DEPLOY_TOKEN set as a plain environment variable, not via withCredentials
      }
    }
  }
}
```

### Output (abbreviated)

> **Findings**
>
> - **Deploy token exposed as a plain environment variable** — `[Blocker]` — `DEPLOY_TOKEN` is referenced directly rather than bound via `withCredentials`, meaning it's not masked in build logs — if this `sh` step's output is ever printed verbosely (or the curl command itself echoes it), the token leaks into logs visible to anyone with build-log access. Rebind using `withCredentials([string(credentialsId: 'deploy-token', variable: 'DEPLOY_TOKEN')])`.
> - **`agent any` allows scheduling on the controller** — `[Medium]` — without restricting to labeled build agents, this stage could run directly on the Jenkins controller, giving pipeline code controller-level access. Restrict to a specific labeled agent pool.
>
> **Overall verdict**
> The unmasked credential is the urgent fix — it's a real, likely-already-occurring log-exposure risk, not a theoretical one. Fix the credential binding immediately; the agent restriction is a good hardening step but lower urgency.

This example is illustrative — a real review depends entirely on the actual Jenkinsfile and Jenkins configuration discovered for the target instance.
