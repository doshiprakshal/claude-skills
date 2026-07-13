# Networking Skills

Planned: 20 skills. 20 built so far.

Each skill lives in its own subfolder under [`skills/`](./skills) with a `SKILL.md` (instructions Claude follows when the skill runs) and a `README.md` (what it does, how to invoke it, and a worked example).

## Built

| Skill | What it does |
|---|---|
| [`dns-investigation`](./skills/dns-investigation) | General DNS resolution failures — resolver, propagation, DNSSEC. |
| [`tcp-analysis`](./skills/tcp-analysis) | TCP-level behavior — retransmits, window scaling, resets, handshake failures. |
| [`udp-analysis`](./skills/udp-analysis) | UDP-specific issues — silent loss, fragmentation, retry tuning. |
| [`mtu-investigation`](./skills/mtu-investigation) | Small-works-large-fails pattern — PMTUD black holes, tunnel overhead. |
| [`packet-loss`](./skills/packet-loss) | Localizes real loss vs. ICMP rate-limiting artifacts in mtr/traceroute. |
| [`tls-investigation`](./skills/tls-investigation) | A specific handshake failure — version/cipher mismatch, SNI, mTLS rejection. |
| [`certificate-review`](./skills/certificate-review) | Proactive fleet-wide cert audit — expiry, chain completeness, weak algorithms. |
| [`api-connectivity`](./skills/api-connectivity) | Layered triage (DNS→TCP→TLS→HTTP) routing to the right specialist skill. |
| [`firewall-review`](./skills/firewall-review) | Rule ordering, permissiveness, unused rules, default posture. Vendor-agnostic. |
| [`load-balancer-review`](./skills/load-balancer-review) | Algorithm fit, health checks, session affinity, TLS termination. Vendor-agnostic. |
| [`cdn-review`](./skills/cdn-review) | Cache policy fit, origin shielding, purge safety, multi-CDN fit. Vendor-agnostic. |
| [`nat-gateway-review`](./skills/nat-gateway-review) | Port exhaustion risk, redundancy, cost/resilience tradeoff. Vendor-agnostic. |
| [`routing-review`](./skills/routing-review) | Static routes, BGP health, asymmetric routing, redundancy testing. |
| [`vpn-review`](./skills/vpn-review) | Encryption strength, split/full-tunnel fit, redundancy, access scope. |
| [`kubernetes-networking`](./skills/kubernetes-networking) | CNI plugin health, pod IP exhaustion, overlay/underlay routing. |
| [`service-mesh-review`](./skills/service-mesh-review) | mTLS consistency, retry/circuit-breaker sanity, sidecar overhead. |
| [`ingress-review`](./skills/ingress-review) | Controller sizing, IngressClass design, TLS strategy, rate limiting. |
| [`proxy-investigation`](./skills/proxy-investigation) | 502/504s, dropped headers, buffering issues on a specific proxy. |
| [`latency-investigation`](./skills/latency-investigation) | Separates network-layer latency from application-layer processing time. |
| [`network-architecture-review`](./skills/network-architecture-review) | Holistic topology/segmentation/redundancy review across environments. |
