export interface LabStep {
  step: number;
  title: string;
  description: string;
  command?: string;
}

export interface Config {
  filename: string;
  language: string;
  description: string;
  content: string;
}

export interface DebugStep {
  step: number;
  action: string;
  command?: string;
  expectedOutput: string;
  finding: string;
}

export interface Lab {
  title: string;
  difficulty: string;
  duration: string;
  objective: string;
  miniLab: {
    overview: string;
    prerequisites: string[];
    steps: LabStep[];
  };
  configs: Config[];
  brokenSetup: {
    description: string;
    configs: Config[];
    symptoms: string[];
  };
  debugging: {
    approach: string;
    steps: DebugStep[];
    rootCause: string;
    fix: string;
    fixedConfig: string;
  };
}

export const LABS: Record<string, Lab[]> = {
  Kubernetes: [
    {
      title: "Kubernetes: Debugging CrashLoopBackOff",
      difficulty: "Intermediate",
      duration: "30 minutes",
      objective: "Diagnose and fix a pod stuck in CrashLoopBackOff due to a misconfigured environment variable and missing secret.",
      miniLab: {
        overview: "You'll deploy a web app that immediately crashes on startup. Using kubectl logs, describe, and events, you'll trace the crash to a missing secret reference and fix the deployment.",
        prerequisites: ["kubectl configured against a cluster (minikube or kind works)", "Basic familiarity with Deployments and Pods"],
        steps: [
          { step: 1, title: "Apply the deployment", description: "Deploy the broken application to your cluster.", command: "kubectl apply -f deployment.yaml" },
          { step: 2, title: "Watch the pod status", description: "Observe the pod cycling into CrashLoopBackOff.", command: "kubectl get pods -w" },
          { step: 3, title: "Check pod logs", description: "Read the last crash logs to find the error.", command: "kubectl logs <pod-name> --previous" },
          { step: 4, title: "Describe the pod", description: "Look at events and environment variable resolution.", command: "kubectl describe pod <pod-name>" },
          { step: 5, title: "Create the missing secret", description: "The app needs a DB_PASSWORD secret. Create it.", command: "kubectl create secret generic app-secret --from-literal=DB_PASSWORD=supersecret123" },
          { step: 6, title: "Restart the deployment", description: "Trigger a rollout to pick up the new secret.", command: "kubectl rollout restart deployment/webapp" },
          { step: 7, title: "Verify", description: "Confirm the pod is now Running.", command: "kubectl get pods" },
        ],
      },
      configs: [
        {
          filename: "deployment.yaml",
          language: "yaml",
          description: "Web app deployment referencing a secret for the database password",
          content: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: webapp
  labels:
    app: webapp
spec:
  replicas: 2
  selector:
    matchLabels:
      app: webapp
  template:
    metadata:
      labels:
        app: webapp
    spec:
      containers:
      - name: webapp
        image: nginx:1.25
        ports:
        - containerPort: 80
        env:
        - name: DB_HOST
          value: "postgres.default.svc.cluster.local"
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: app-secret
              key: DB_PASSWORD`,
        },
      ],
      brokenSetup: {
        description: "The deployment above references a secret called 'app-secret' that does not exist in the cluster. The pod starts, tries to resolve the secret, and crashes immediately.",
        symptoms: [
          "kubectl get pods shows STATUS: CrashLoopBackOff",
          "kubectl describe pod shows: Error: secret 'app-secret' not found",
          "kubectl logs --previous returns no application output — the container exits before the app starts",
        ],
        configs: [
          {
            filename: "deployment.yaml",
            language: "yaml",
            description: "This deployment references a non-existent secret — the container will crash on startup",
            content: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: webapp
spec:
  replicas: 2
  selector:
    matchLabels:
      app: webapp
  template:
    metadata:
      labels:
        app: webapp
    spec:
      containers:
      - name: webapp
        image: nginx:1.25
        env:
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: app-secret        # Bug: this secret doesn't exist
              key: DB_PASSWORD`,
          },
        ],
      },
      debugging: {
        approach: "Follow the pod lifecycle: check status → read logs → inspect events → identify the missing dependency → create it.",
        steps: [
          { step: 1, action: "Check pod status", command: "kubectl get pods", expectedOutput: "webapp-xxxx   0/1   CrashLoopBackOff   3   2m", finding: "Pod is restarting repeatedly — something crashes on startup" },
          { step: 2, action: "Read previous container logs", command: "kubectl logs <pod-name> --previous", expectedOutput: "Error from server: secret 'app-secret' not found", finding: "The container can't start because a required secret is missing" },
          { step: 3, action: "Describe the pod for events", command: "kubectl describe pod <pod-name>", expectedOutput: "Warning  Failed  ... Error: secret \"app-secret\" not found", finding: "Kubernetes itself surfaces the missing secret in the Events section" },
          { step: 4, action: "List existing secrets", command: "kubectl get secrets", expectedOutput: "default-token-xxx  kubernetes.io/...", finding: "Confirms app-secret does not exist — we need to create it" },
          { step: 5, action: "Create the missing secret", command: "kubectl create secret generic app-secret --from-literal=DB_PASSWORD=supersecret123", expectedOutput: "secret/app-secret created", finding: "Secret now exists; pods will be able to resolve the env var" },
          { step: 6, action: "Restart the deployment", command: "kubectl rollout restart deployment/webapp", expectedOutput: "deployment.apps/webapp restarted", finding: "Forces new pods to be created, which will now successfully mount the secret" },
        ],
        rootCause: "The Deployment spec references a Secret (app-secret) that was never created in the cluster. Kubernetes cannot inject the env var, so the container exits with exit code 1 immediately.",
        fix: "Create the secret before applying the deployment: `kubectl create secret generic app-secret --from-literal=DB_PASSWORD=<value>`",
        fixedConfig: `# Create the secret first
kubectl create secret generic app-secret --from-literal=DB_PASSWORD=supersecret123

# Then apply the deployment
kubectl apply -f deployment.yaml`,
      },
    },
    {
      title: "Kubernetes: HPA Not Scaling — Metrics Server Missing",
      difficulty: "Intermediate",
      duration: "25 minutes",
      objective: "Set up a Horizontal Pod Autoscaler and debug why it reports 'unknown' for CPU metrics.",
      miniLab: {
        overview: "You'll create a Deployment with an HPA targeting CPU utilization. The HPA will show '<unknown>/50%' because the metrics-server isn't installed. You'll install it and verify autoscaling works.",
        prerequisites: ["minikube or kind cluster", "kubectl", "hey or wrk for load testing (optional)"],
        steps: [
          { step: 1, title: "Deploy the app", description: "Apply the deployment and service.", command: "kubectl apply -f app.yaml" },
          { step: 2, title: "Create the HPA", description: "Create an HPA targeting 50% CPU.", command: "kubectl autoscale deployment cpu-demo --cpu-percent=50 --min=1 --max=5" },
          { step: 3, title: "Check HPA status", description: "You'll see <unknown>/50% — this is the bug.", command: "kubectl get hpa" },
          { step: 4, title: "Install metrics-server", description: "On minikube, enable the addon.", command: "minikube addons enable metrics-server" },
          { step: 5, title: "Wait and recheck", description: "After ~60s, metrics should populate.", command: "kubectl get hpa -w" },
          { step: 6, title: "Generate load", description: "Stress the app to trigger scaling.", command: "kubectl run load --image=busybox --restart=Never -- /bin/sh -c 'while true; do wget -q -O- http://cpu-demo-svc; done'" },
          { step: 7, title: "Watch replicas scale up", description: "Observe HPA increasing replica count.", command: "kubectl get hpa -w" },
        ],
      },
      configs: [
        {
          filename: "app.yaml",
          language: "yaml",
          description: "CPU-intensive app deployment with resource requests (required for HPA)",
          content: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: cpu-demo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: cpu-demo
  template:
    metadata:
      labels:
        app: cpu-demo
    spec:
      containers:
      - name: cpu-demo
        image: k8s.gcr.io/hpa-example
        ports:
        - containerPort: 80
        resources:
          requests:
            cpu: 200m
          limits:
            cpu: 500m
---
apiVersion: v1
kind: Service
metadata:
  name: cpu-demo-svc
spec:
  selector:
    app: cpu-demo
  ports:
  - port: 80
    targetPort: 80`,
        },
      ],
      brokenSetup: {
        description: "An HPA is configured for a deployment but shows '<unknown>/50%' for CPU utilization. The HPA cannot scale because it has no metrics to act on.",
        symptoms: [
          "kubectl get hpa shows TARGETS as <unknown>/50%",
          "kubectl describe hpa shows: unable to get metrics for resource cpu: unable to fetch metrics from resource metrics API",
          "Pods never scale even under high load",
        ],
        configs: [
          {
            filename: "hpa.yaml",
            language: "yaml",
            description: "HPA that will show unknown metrics — metrics-server is not installed",
            content: `apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: cpu-demo-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: cpu-demo
  minReplicas: 1
  maxReplicas: 5
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 50`,
          },
        ],
      },
      debugging: {
        approach: "Identify why the HPA can't read metrics, then install the missing component and verify the metrics pipeline works end to end.",
        steps: [
          { step: 1, action: "Check HPA targets", command: "kubectl get hpa", expectedOutput: "cpu-demo-hpa   <unknown>/50%   1   5   1   2m", finding: "<unknown> means HPA cannot read CPU metrics from the metrics API" },
          { step: 2, action: "Describe HPA for detailed error", command: "kubectl describe hpa cpu-demo-hpa", expectedOutput: "unable to fetch metrics from resource metrics API: the server could not find the requested resource", finding: "The metrics.k8s.io API is not registered — metrics-server is missing" },
          { step: 3, action: "Check if metrics-server is running", command: "kubectl get pods -n kube-system | grep metrics", expectedOutput: "(no output)", finding: "Confirms metrics-server pod does not exist" },
          { step: 4, action: "Install metrics-server (minikube)", command: "minikube addons enable metrics-server", expectedOutput: "metrics-server was successfully enabled", finding: "Metrics-server is now deploying" },
          { step: 5, action: "Verify node metrics available", command: "kubectl top nodes", expectedOutput: "NAME   CPU(cores)   CPU%   MEMORY(bytes)   MEMORY%", finding: "Metrics pipeline is working — HPA can now read CPU utilization" },
        ],
        rootCause: "The Horizontal Pod Autoscaler depends on the Kubernetes Metrics Server to read CPU/memory usage from nodes and pods. Without it, the metrics.k8s.io API is unavailable and HPA cannot make scaling decisions.",
        fix: "Install metrics-server. On minikube: `minikube addons enable metrics-server`. On a real cluster: `kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml`",
        fixedConfig: `# minikube
minikube addons enable metrics-server

# Generic cluster (may need --kubelet-insecure-tls flag in args)
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml`,
      },
    },
  ],

  Docker: [
    {
      title: "Docker: Debugging a Multi-Stage Build Failure",
      difficulty: "Beginner",
      duration: "20 minutes",
      objective: "Fix a Dockerfile where the final image is missing a required binary due to a multi-stage copy mistake.",
      miniLab: {
        overview: "You'll build a Go application using a multi-stage Dockerfile. The build succeeds but the container crashes at runtime because the binary wasn't properly copied to the final stage. You'll identify and fix the COPY instruction.",
        prerequisites: ["Docker installed", "Basic understanding of Dockerfiles"],
        steps: [
          { step: 1, title: "Build the image", description: "Build the Docker image from the Dockerfile.", command: "docker build -t go-app ." },
          { step: 2, title: "Run the container", description: "Try to start the container.", command: "docker run --rm go-app" },
          { step: 3, title: "Inspect the error", description: "Note the 'executable not found' error.", command: "docker run --rm --entrypoint sh go-app -c 'ls /app/'" },
          { step: 4, title: "Fix the COPY instruction", description: "Update the Dockerfile to copy from the correct stage name." },
          { step: 5, title: "Rebuild and verify", description: "Rebuild and confirm the app starts.", command: "docker build -t go-app . && docker run --rm go-app" },
        ],
      },
      configs: [
        {
          filename: "Dockerfile",
          language: "docker",
          description: "Correct multi-stage Dockerfile for a Go app",
          content: `# Stage 1: Build
FROM golang:1.21-alpine AS builder
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o /src/app .

# Stage 2: Run
FROM alpine:3.19
WORKDIR /app
COPY --from=builder /src/app .
ENTRYPOINT ["./app"]`,
        },
        {
          filename: "main.go",
          language: "go",
          description: "Simple Go HTTP server to containerize",
          content: `package main

import (
    "fmt"
    "net/http"
)

func main() {
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintln(w, "Hello from Docker!")
    })
    fmt.Println("Server running on :8080")
    http.ListenAndServe(":8080", nil)
}`,
        },
      ],
      brokenSetup: {
        description: "The Dockerfile builds successfully but the container exits immediately with 'exec: ./app: no such file or directory' because the COPY --from references the wrong stage name.",
        symptoms: [
          "docker build succeeds with no errors",
          "docker run exits immediately: exec ./app: no such file or directory",
          "ls /app/ inside the container shows an empty directory",
        ],
        configs: [
          {
            filename: "Dockerfile",
            language: "docker",
            description: "Broken Dockerfile — COPY --from references wrong stage name",
            content: `# Stage 1: Build
FROM golang:1.21-alpine AS builder
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o /src/app .

# Stage 2: Run
FROM alpine:3.19
WORKDIR /app
COPY --from=build /src/app .    # Bug: stage is named 'builder', not 'build'
ENTRYPOINT ["./app"]`,
          },
        ],
      },
      debugging: {
        approach: "Multi-stage COPY failures are silent at build time. Start by verifying what's actually in the final image, then trace back to the COPY instruction.",
        steps: [
          { step: 1, action: "Run and observe the error", command: "docker run --rm go-app", expectedOutput: "exec ./app: no such file or directory", finding: "The binary doesn't exist at runtime — it was never copied in" },
          { step: 2, action: "Inspect the final image contents", command: "docker run --rm --entrypoint sh go-app -c 'ls -la /app/'", expectedOutput: "total 8  drwxr-xr-x  ...", finding: "/app/ is empty — COPY failed silently" },
          { step: 3, action: "Check the Dockerfile COPY instruction", command: "grep 'COPY --from' Dockerfile", expectedOutput: "COPY --from=build /src/app .", finding: "Stage name is 'build' but the builder stage is named 'builder'" },
          { step: 4, action: "Fix and rebuild", command: "sed -i 's/--from=build/--from=builder/' Dockerfile && docker build -t go-app .", expectedOutput: "Successfully built ...", finding: "Build now correctly copies the binary from the builder stage" },
        ],
        rootCause: "`COPY --from=build` references a stage named 'build', but the builder stage is declared as `AS builder`. Docker silently skips the COPY when the source stage name doesn't match, leaving the destination empty.",
        fix: "Change `COPY --from=build` to `COPY --from=builder` in the final stage.",
        fixedConfig: `# Stage 2: Run (fixed)
FROM alpine:3.19
WORKDIR /app
COPY --from=builder /src/app .   # Correct: matches 'AS builder' in stage 1
ENTRYPOINT ["./app"]`,
      },
    },
  ],

  "Prometheus & Grafana": [
    {
      title: "Prometheus: Alerting Rule Not Firing",
      difficulty: "Intermediate",
      duration: "35 minutes",
      objective: "Debug a Prometheus alerting rule that never transitions from 'inactive' to 'pending' or 'firing'.",
      miniLab: {
        overview: "You'll set up a Prometheus alert for high HTTP error rate. The alert stays inactive despite errors occurring. You'll find the bug in the metric name used in the rule, fix it, and verify the alert fires correctly.",
        prerequisites: ["Docker Compose or a Prometheus instance", "Basic PromQL knowledge"],
        steps: [
          { step: 1, title: "Start the stack", description: "Bring up Prometheus and a sample app with docker-compose.", command: "docker-compose up -d" },
          { step: 2, title: "Check alert status", description: "Open Prometheus UI → Alerts. Note the rule shows 'inactive'.", command: "open http://localhost:9090/alerts" },
          { step: 3, title: "Test the PromQL expression", description: "Run the alert expression in the Expression Browser to see if it returns data.", command: "# In Prometheus UI, query: sum(rate(http_requests_errors_total[5m])) / sum(rate(http_requests_total[5m])) > 0.05" },
          { step: 4, title: "Explore actual metrics", description: "Find the real metric name.", command: "# In Prometheus UI, search: http_request" },
          { step: 5, title: "Fix the rule", description: "Update the alert rule with the correct metric name and reload Prometheus.", command: "curl -X POST http://localhost:9090/-/reload" },
          { step: 6, title: "Verify the alert fires", description: "Generate errors and watch the alert go from inactive → pending → firing.", command: "for i in $(seq 1 100); do curl -s http://localhost:8080/error > /dev/null; done" },
        ],
      },
      configs: [
        {
          filename: "alert_rules.yaml",
          language: "yaml",
          description: "Correct Prometheus alerting rule for high HTTP error rate",
          content: `groups:
- name: http_alerts
  rules:
  - alert: HighErrorRate
    expr: |
      sum(rate(http_requests_total{status=~"5.."}[5m]))
      /
      sum(rate(http_requests_total[5m]))
      > 0.05
    for: 2m
    labels:
      severity: warning
    annotations:
      summary: "High HTTP error rate detected"
      description: "Error rate is {{ $value | humanizePercentage }} over the last 5 minutes"`,
        },
        {
          filename: "prometheus.yml",
          language: "yaml",
          description: "Prometheus configuration loading the alert rules",
          content: `global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alert_rules.yaml"

scrape_configs:
  - job_name: "webapp"
    static_configs:
      - targets: ["webapp:8080"]`,
        },
      ],
      brokenSetup: {
        description: "Prometheus is running and scraping metrics from the web app, but the HighErrorRate alert is permanently inactive even when the app is returning 500 errors.",
        symptoms: [
          "Prometheus Alerts page shows HighErrorRate as 'inactive'",
          "The app is clearly returning HTTP 500 errors (visible in access logs)",
          "Running the alert expression in the query browser returns no data",
        ],
        configs: [
          {
            filename: "alert_rules.yaml",
            language: "yaml",
            description: "Broken alert rule — uses wrong metric name that doesn't exist",
            content: `groups:
- name: http_alerts
  rules:
  - alert: HighErrorRate
    expr: |
      sum(rate(http_requests_errors_total[5m]))   # Bug: metric is 'http_requests_total' with status label
      /
      sum(rate(http_requests_total[5m]))
      > 0.05
    for: 2m
    labels:
      severity: warning
    annotations:
      summary: "High HTTP error rate detected"`,
          },
        ],
      },
      debugging: {
        approach: "Always verify the PromQL expression in the Prometheus query browser first. A rule that never fires is either using a wrong metric name, wrong label matchers, or a threshold that's never reached.",
        steps: [
          { step: 1, action: "Check alert state in UI", command: "open http://localhost:9090/alerts", expectedOutput: "HighErrorRate — inactive", finding: "Alert hasn't evaluated to true even once" },
          { step: 2, action: "Run the broken expression in query browser", command: "sum(rate(http_requests_errors_total[5m])) / sum(rate(http_requests_total[5m]))", expectedOutput: "no data", finding: "The numerator metric doesn't exist — returns no data, so the expression can never be > 0.05" },
          { step: 3, action: "Find the real metric name", command: "# In Prometheus query browser: http_request", expectedOutput: "http_requests_total{status='200',...}, http_requests_total{status='500',...}", finding: "The metric is http_requests_total with a 'status' label, not a separate error metric" },
          { step: 4, action: "Test the corrected expression", command: "sum(rate(http_requests_total{status=~'5..'}[5m])) / sum(rate(http_requests_total[5m]))", expectedOutput: "0.12 (or similar non-zero value)", finding: "Correct expression returns data and crosses the 0.05 threshold" },
          { step: 5, action: "Reload Prometheus after fixing the rule", command: "curl -X POST http://localhost:9090/-/reload", expectedOutput: "OK", finding: "Prometheus reloads rules; alert should move to pending within evaluation_interval" },
        ],
        rootCause: "The alert expression uses `http_requests_errors_total` which doesn't exist. The actual metric is `http_requests_total` with a `status` label. Since the numerator returns no data, the division never produces a value, and the alert never evaluates to true.",
        fix: "Replace `http_requests_errors_total` with `http_requests_total{status=~\"5..\"}` to filter 5xx responses using the status label.",
        fixedConfig: `expr: |
  sum(rate(http_requests_total{status=~"5.."}[5m]))
  /
  sum(rate(http_requests_total[5m]))
  > 0.05`,
      },
    },
  ],

  Terraform: [
    {
      title: "Terraform: State Drift and Import",
      difficulty: "Intermediate",
      duration: "40 minutes",
      objective: "Detect and resolve Terraform state drift caused by a manually created resource, then import it into state.",
      miniLab: {
        overview: "Someone on your team manually created an S3 bucket in AWS. Your Terraform config also declares this bucket. You'll see the conflict, use terraform import to bring the manual resource under Terraform management, and resolve the drift.",
        prerequisites: ["Terraform >= 1.0", "AWS CLI configured", "An AWS account (or localstack for free)"],
        steps: [
          { step: 1, title: "Apply the Terraform config", description: "Try to create the S3 bucket with Terraform.", command: "terraform init && terraform plan" },
          { step: 2, title: "Observe the conflict", description: "Plan shows the bucket will be created, but it already exists.", command: "terraform apply" },
          { step: 3, title: "Check for drift", description: "Use terraform plan to detect the discrepancy.", command: "terraform plan -detailed-exitcode" },
          { step: 4, title: "Import the existing resource", description: "Pull the manually created bucket into Terraform state.", command: "terraform import aws_s3_bucket.app_bucket my-existing-bucket-name" },
          { step: 5, title: "Reconcile config with reality", description: "Run plan again — any diffs now reflect config vs real resource.", command: "terraform plan" },
          { step: 6, title: "Apply the diff", description: "Apply to make the real resource match your Terraform config.", command: "terraform apply" },
        ],
      },
      configs: [
        {
          filename: "main.tf",
          language: "hcl",
          description: "Terraform config declaring an S3 bucket",
          content: `terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_s3_bucket" "app_bucket" {
  bucket = "my-existing-bucket-name"

  tags = {
    Environment = "production"
    ManagedBy   = "terraform"
  }
}

resource "aws_s3_bucket_versioning" "app_bucket" {
  bucket = aws_s3_bucket.app_bucket.id

  versioning_configuration {
    status = "Enabled"
  }
}`,
        },
      ],
      brokenSetup: {
        description: "Your Terraform config declares an S3 bucket, but someone manually created a bucket with the same name in AWS. Terraform's state file has no record of it.",
        symptoms: [
          "terraform apply fails with: BucketAlreadyOwnedByYou or BucketAlreadyExists error",
          "terraform plan shows the bucket as a new resource to create (+)",
          "The bucket exists in AWS but not in terraform.tfstate",
        ],
        configs: [
          {
            filename: "main.tf",
            language: "hcl",
            description: "Terraform config that conflicts with a manually created resource",
            content: `resource "aws_s3_bucket" "app_bucket" {
  bucket = "my-existing-bucket-name"   # This bucket already exists manually in AWS

  tags = {
    Environment = "production"
    ManagedBy   = "terraform"
  }
}`,
          },
        ],
      },
      debugging: {
        approach: "When apply fails because a resource already exists, don't delete it — import it. Then reconcile the config with what already exists in the provider.",
        steps: [
          { step: 1, action: "Run terraform plan", command: "terraform plan", expectedOutput: "+ aws_s3_bucket.app_bucket will be created", finding: "Terraform has no record of this bucket — it's not in state" },
          { step: 2, action: "Try applying — observe the error", command: "terraform apply", expectedOutput: "Error: BucketAlreadyOwnedByYou: my-existing-bucket-name", finding: "The bucket exists in AWS but not in Terraform state — classic drift" },
          { step: 3, action: "Import the existing bucket into state", command: "terraform import aws_s3_bucket.app_bucket my-existing-bucket-name", expectedOutput: "Import successful! The resources were imported.", finding: "Terraform state now knows about this bucket" },
          { step: 4, action: "Plan again to see config vs real diffs", command: "terraform plan", expectedOutput: "~ aws_s3_bucket.app_bucket (tags differ)", finding: "The bucket is in state now, plan shows only attribute differences to reconcile" },
          { step: 5, action: "Apply to sync config to reality", command: "terraform apply", expectedOutput: "Apply complete! Resources: 0 added, 1 changed, 0 destroyed.", finding: "Tags and config are now in sync with Terraform" },
        ],
        rootCause: "The S3 bucket was created manually outside of Terraform. Terraform's state file has no record of it, so plan treats it as a new resource. Apply fails because the bucket already exists in AWS.",
        fix: "Use `terraform import` to associate the existing resource with the Terraform config resource address, then reconcile any attribute differences with `terraform apply`.",
        fixedConfig: `# Import the manually created bucket
terraform import aws_s3_bucket.app_bucket my-existing-bucket-name

# After import, run plan to see any attribute diffs
terraform plan

# Apply to reconcile
terraform apply`,
      },
    },
  ],

  Linux: [
    {
      title: "Linux: Disk Full — Finding and Cleaning Space",
      difficulty: "Beginner",
      duration: "20 minutes",
      objective: "Identify what is consuming disk space on a full Linux system and recover space without deleting critical files.",
      miniLab: {
        overview: "A Linux server has hit 100% disk usage. Applications are failing to write logs and the database is rejecting writes. You'll locate the culprit using standard tools and recover space safely.",
        prerequisites: ["A Linux system (VM or container works)", "sudo access"],
        steps: [
          { step: 1, title: "Confirm disk is full", description: "Check filesystem usage.", command: "df -h" },
          { step: 2, title: "Find large directories", description: "Scan from root to find where space went.", command: "du -sh /* 2>/dev/null | sort -rh | head -20" },
          { step: 3, title: "Drill into the culprit", description: "Narrow down to the specific large directory.", command: "du -sh /var/* 2>/dev/null | sort -rh | head -10" },
          { step: 4, title: "Check for large log files", description: "Find oversized logs.", command: "find /var/log -type f -size +100M -exec ls -lh {} \\;" },
          { step: 5, title: "Check for deleted-but-open files", description: "A common trap: a process holds a deleted file open.", command: "lsof +L1 | grep -i deleted" },
          { step: 6, title: "Truncate or rotate the log", description: "Safely clear the log without deleting the file (so the process doesn't break).", command: "> /var/log/app/debug.log  # truncate in-place" },
          { step: 7, title: "Set up log rotation", description: "Prevent this from happening again.", command: "cat /etc/logrotate.d/app" },
        ],
      },
      configs: [
        {
          filename: "/etc/logrotate.d/app",
          language: "bash",
          description: "Logrotate config to prevent log files from growing unbounded",
          content: `/var/log/app/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    maxsize 100M
    postrotate
        systemctl reload app || true
    endscript
}`,
        },
      ],
      brokenSetup: {
        description: "A web application server is running out of disk space. The app is writing verbose debug logs in a tight loop. Disk is at 100% and new requests are failing with 'no space left on device'.",
        symptoms: [
          "df -h shows /dev/sda1 at 100% (Use%)",
          "Application returns 500 errors with 'no space left on device' in logs",
          "systemctl status app shows: Failed to write log: No space left on device",
          "New SSH sessions may fail or be very slow",
        ],
        configs: [
          {
            filename: "/etc/logrotate.d/app",
            language: "bash",
            description: "Missing or broken logrotate config — logs are never rotated",
            content: `# This file is empty or missing — no log rotation configured
# /var/log/app/debug.log has grown to 47GB`,
          },
        ],
      },
      debugging: {
        approach: "Work top-down: confirm disk is full → find which filesystem → find which directory → find the specific file → recover space safely → fix the root cause.",
        steps: [
          { step: 1, action: "Check filesystem usage", command: "df -h", expectedOutput: "/dev/sda1   50G   50G   0   100%  /", finding: "Root filesystem is completely full" },
          { step: 2, action: "Find largest top-level directories", command: "du -sh /* 2>/dev/null | sort -rh | head -10", expectedOutput: "47G  /var", finding: "/var is consuming most of the disk" },
          { step: 3, action: "Drill into /var", command: "du -sh /var/* 2>/dev/null | sort -rh | head -5", expectedOutput: "47G  /var/log", finding: "/var/log is the culprit" },
          { step: 4, action: "Find the largest log file", command: "find /var/log -type f -size +1G -exec ls -lh {} \\;", expectedOutput: "-rw-r--r-- 1 app app 47G /var/log/app/debug.log", finding: "A single debug log file has grown to 47GB" },
          { step: 5, action: "Check for deleted files held open", command: "lsof +L1 | grep deleted", expectedOutput: "app  1234  app  3w  REG ... /var/log/app/debug.log (deleted)", finding: "If the file was deleted with rm, the process still holds it open and space isn't freed until the process closes the fd" },
          { step: 6, action: "Truncate the log file safely", command: "> /var/log/app/debug.log", expectedOutput: "(no output — file is now 0 bytes)", finding: "Space is recovered immediately; the app can keep writing to the same fd" },
        ],
        rootCause: "The application is logging at DEBUG level in production with no log rotation configured. The debug.log file grew to 47GB over several weeks, filling the disk completely.",
        fix: "1) Truncate the log immediately to recover space. 2) Add a logrotate config to rotate and compress logs daily. 3) Change the app's log level to INFO or WARNING in production.",
        fixedConfig: `/var/log/app/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    maxsize 100M
    postrotate
        systemctl reload app || true
    endscript
}`,
      },
    },
  ],

  AWS: [
    {
      title: "AWS: IAM Permission Denied — Debugging Access Issues",
      difficulty: "Intermediate",
      duration: "30 minutes",
      objective: "Debug an EC2 instance that cannot access an S3 bucket due to a misconfigured IAM role policy.",
      miniLab: {
        overview: "An EC2 instance with an attached IAM role is failing to read from an S3 bucket. You'll inspect the IAM policy, identify the incorrect resource ARN, fix it, and verify access works.",
        prerequisites: ["AWS CLI configured", "Access to IAM and S3 in your AWS account"],
        steps: [
          { step: 1, title: "Reproduce the error", description: "Try to access the S3 bucket from the EC2 instance.", command: "aws s3 ls s3://my-app-data-bucket/" },
          { step: 2, title: "Check the IAM role", description: "Find which role is attached to the instance.", command: "aws ec2 describe-instances --query 'Reservations[].Instances[].IamInstanceProfile'" },
          { step: 3, title: "List role policies", description: "See what policies are attached.", command: "aws iam list-attached-role-policies --role-name my-ec2-role" },
          { step: 4, title: "Read the policy document", description: "Inspect the policy for the bug.", command: "aws iam get-policy-version --policy-arn <arn> --version-id v1" },
          { step: 5, title: "Fix the resource ARN", description: "Update the policy with the correct bucket ARN." },
          { step: 6, title: "Verify access", description: "Retry the S3 command — it should succeed.", command: "aws s3 ls s3://my-app-data-bucket/" },
        ],
      },
      configs: [
        {
          filename: "iam-policy.json",
          language: "json",
          description: "Correct IAM policy granting EC2 read access to a specific S3 bucket",
          content: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "S3ReadAccess",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::my-app-data-bucket",
        "arn:aws:s3:::my-app-data-bucket/*"
      ]
    }
  ]
}`,
        },
      ],
      brokenSetup: {
        description: "An EC2 instance has an IAM role attached, but all S3 operations fail with AccessDenied. The IAM policy looks like it should allow access.",
        symptoms: [
          "aws s3 ls s3://my-app-data-bucket/ returns: An error occurred (AccessDenied)",
          "Application logs show: AccessDeniedException when calling s3:GetObject",
          "The EC2 instance has an IAM role with an S3 policy attached",
        ],
        configs: [
          {
            filename: "iam-policy.json",
            language: "json",
            description: "Broken IAM policy — Resource ARN has a typo in bucket name",
            content: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "S3ReadAccess",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::my-app-data-bucet",    // Bug: typo — 'bucet' instead of 'bucket'
        "arn:aws:s3:::my-app-data-bucet/*"   // Bug: same typo on wildcard
      ]
    }
  ]
}`,
          },
        ],
      },
      debugging: {
        approach: "For IAM AccessDenied, start by identifying which principal is making the call, then inspect the effective permissions. IAM Policy Simulator is your best friend here.",
        steps: [
          { step: 1, action: "Reproduce the error and capture it", command: "aws s3 ls s3://my-app-data-bucket/ 2>&1", expectedOutput: "An error occurred (AccessDenied) when calling the ListObjectsV2 operation", finding: "Access is being denied — need to check IAM policy" },
          { step: 2, action: "Find the instance's IAM role", command: "aws ec2 describe-instances --instance-ids i-xxx --query 'Reservations[].Instances[].IamInstanceProfile.Arn'", expectedOutput: "arn:aws:iam::123456789:instance-profile/my-ec2-role", finding: "The role is my-ec2-role" },
          { step: 3, action: "Check attached policies", command: "aws iam list-attached-role-policies --role-name my-ec2-role", expectedOutput: "S3ReadPolicy  arn:aws:iam::123456789:policy/S3ReadPolicy", finding: "One policy attached — inspect it" },
          { step: 4, action: "Read the policy document", command: "aws iam get-policy-version --policy-arn arn:aws:iam::123456789:policy/S3ReadPolicy --version-id v1", expectedOutput: "Resource: arn:aws:s3:::my-app-data-bucet", finding: "Typo in bucket name: 'bucet' instead of 'bucket' — IAM policy points to a bucket that doesn't exist" },
          { step: 5, action: "Use IAM Policy Simulator to confirm", command: "# AWS Console → IAM → Policy Simulator → select role → test s3:ListBucket on arn:aws:s3:::my-app-data-bucket", expectedOutput: "Denied", finding: "Simulator confirms the current policy doesn't allow access to the real bucket name" },
        ],
        rootCause: "The IAM policy Resource ARN contains a typo ('my-app-data-bucet' instead of 'my-app-data-bucket'). IAM policies are exact-match on resource ARNs — the policy grants access to a bucket that doesn't exist.",
        fix: "Update the IAM policy to use the correct bucket name in both Resource ARN entries: `arn:aws:s3:::my-app-data-bucket` and `arn:aws:s3:::my-app-data-bucket/*`",
        fixedConfig: `{
  "Resource": [
    "arn:aws:s3:::my-app-data-bucket",
    "arn:aws:s3:::my-app-data-bucket/*"
  ]
}`,
      },
    },
  ],

  Nginx: [
    {
      title: "Nginx: 502 Bad Gateway — Upstream Connection Refused",
      difficulty: "Beginner",
      duration: "20 minutes",
      objective: "Debug an Nginx reverse proxy returning 502 Bad Gateway by tracing the error to a misconfigured upstream port.",
      miniLab: {
        overview: "Nginx is configured as a reverse proxy for a Node.js app. Requests return 502 Bad Gateway. You'll read Nginx error logs, test the upstream directly, find the port mismatch, and fix the proxy config.",
        prerequisites: ["Nginx installed", "A backend service running (Node, Python, etc.)"],
        steps: [
          { step: 1, title: "Observe the 502", description: "Hit the endpoint and confirm the error.", command: "curl -i http://localhost/" },
          { step: 2, title: "Check Nginx error log", description: "Find the actual upstream error.", command: "sudo tail -50 /var/log/nginx/error.log" },
          { step: 3, title: "Test the upstream directly", description: "Try to connect to the backend port.", command: "curl -i http://127.0.0.1:3001/" },
          { step: 4, title: "Find what port the app is on", description: "Check what port the backend is listening on.", command: "ss -tlnp | grep node" },
          { step: 5, title: "Fix the Nginx config", description: "Update the proxy_pass to the correct port.", command: "sudo nano /etc/nginx/sites-available/app" },
          { step: 6, title: "Test and reload", description: "Validate the config and reload Nginx.", command: "sudo nginx -t && sudo systemctl reload nginx" },
          { step: 7, title: "Verify", description: "Confirm requests now succeed.", command: "curl -i http://localhost/" },
        ],
      },
      configs: [
        {
          filename: "/etc/nginx/sites-available/app",
          language: "nginx",
          description: "Correct Nginx reverse proxy config for a Node.js app on port 3000",
          content: `server {
    listen 80;
    server_name _;

    access_log /var/log/nginx/app_access.log;
    error_log  /var/log/nginx/app_error.log;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}`,
        },
      ],
      brokenSetup: {
        description: "Nginx is running and the Node.js app is running, but every request returns 502 Bad Gateway. The app team says 'it works on my machine'.",
        symptoms: [
          "curl http://localhost/ returns: 502 Bad Gateway",
          "Nginx error log shows: connect() failed (111: Connection refused) while connecting to upstream",
          "The Node.js app process is running (ps aux | grep node shows it)",
        ],
        configs: [
          {
            filename: "/etc/nginx/sites-available/app",
            language: "nginx",
            description: "Broken Nginx config — proxy_pass points to wrong port",
            content: `server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:3001;   # Bug: app runs on 3000, not 3001
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}`,
          },
        ],
      },
      debugging: {
        approach: "A 502 always means Nginx reached the upstream but couldn't get a valid response. Check the error log for the specific upstream error, then verify the upstream is reachable independently.",
        steps: [
          { step: 1, action: "Hit the endpoint and see the 502", command: "curl -i http://localhost/", expectedOutput: "HTTP/1.1 502 Bad Gateway", finding: "Nginx is running but can't reach the backend" },
          { step: 2, action: "Read Nginx error log", command: "sudo tail -20 /var/log/nginx/error.log", expectedOutput: "connect() failed (111: Connection refused) while connecting to upstream, upstream: \"http://127.0.0.1:3001\"", finding: "Nginx is trying port 3001 but nothing is listening there" },
          { step: 3, action: "Test port 3001 directly", command: "curl http://127.0.0.1:3001/", expectedOutput: "curl: (7) Failed to connect to 127.0.0.1 port 3001: Connection refused", finding: "Port 3001 is definitely not in use" },
          { step: 4, action: "Find the actual port the app uses", command: "ss -tlnp | grep node", expectedOutput: "LISTEN  0  128  0.0.0.0:3000  ...", finding: "The Node.js app is on port 3000, not 3001" },
          { step: 5, action: "Fix proxy_pass and reload", command: "# Change proxy_pass to http://127.0.0.1:3000, then:\nsudo nginx -t && sudo systemctl reload nginx", expectedOutput: "nginx: configuration file /etc/nginx/nginx.conf test is successful", finding: "Config is valid; Nginx reloads and will now proxy to the correct port" },
        ],
        rootCause: "The Nginx `proxy_pass` directive points to port 3001, but the Node.js application is listening on port 3000. Nothing listens on 3001, so every connection attempt is refused, resulting in 502.",
        fix: "Change `proxy_pass http://127.0.0.1:3001` to `proxy_pass http://127.0.0.1:3000` and reload Nginx.",
        fixedConfig: `location / {
    proxy_pass http://127.0.0.1:3000;   # Correct port
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}`,
      },
    },
  ],
};

// Fallback for categories without a dedicated lab
const FALLBACK_CATEGORIES: Record<string, string> = {
  GCP: "AWS",
  Azure: "AWS",
  "CI/CD": "Docker",
  Helm: "Kubernetes",
  "Istio / Service Mesh": "Kubernetes",
  Ansible: "Linux",
  Elasticsearch: "Linux",
  PostgreSQL: "Linux",
};

export function getLabForCategory(category: string): Lab {
  const labs = LABS[category] || LABS[FALLBACK_CATEGORIES[category]] || LABS["Kubernetes"];
  const idx = Math.floor(Math.random() * labs.length);
  return labs[idx];
}
