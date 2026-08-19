# Target Architecture — Azure Migration Plan

This is a **planning document**, not a build spec — none of this is deployed
yet. It maps each infrastructure capability to where it fits once the site
outgrows static hosting and moves to Azure. Revisit and trim this before
actually building anything; most rows only become relevant once there's a
real backend service (API, database, auth) behind the site.

## Principle: platform capabilities as shared "data products"

Rather than bolting infrastructure onto individual apps, treat cross-cutting
concerns — secrets, DNS, observability, edge routing/load balancing — as
centrally-managed platform services that any future service (this site, an
API, a data pipeline) consumes rather than reimplements. That's the "data
product" framing: each capability below has one owner, one source of truth,
and is consumed (not duplicated) by whatever you build on top of it.

## Mapping

| Capability | Today (static site, no backend) | Azure target | Notes |
|---|---|---|---|
| Analytics ("Omniture-like") | Cloudflare Web Analytics / Plausible (free, script-tag only) | Application Insights (web analytics + usage) | Don't build an analytics platform from scratch — Omniture/Adobe Analytics is a huge commercial product; Azure's own telemetry (App Insights) is the realistic equivalent once there's server-side traffic to correlate with. |
| CDN | Cloudflare free tier, or GitHub Pages' own CDN | Azure Front Door / Azure CDN | Front Door also gives you the reverse-proxy + WAF + global LB layer in one service. |
| Reverse proxy | N/A (nothing to proxy to) | Azure Front Door or Application Gateway | Only needed once there's more than one backend service to route between. |
| DMZ / network segmentation | N/A | Azure Virtual Network with public/private subnets, NSGs, Azure Firewall | Only relevant once there's a VM/container backend holding non-public data (e.g. a database) that needs isolating from the public internet. |
| API gateway ("Apigee-like") | N/A (no APIs yet) | Azure API Management | APIM gives you auth, rate limiting, versioning once you actually have APIs (e.g. Azure Functions for the contact form, or a course platform backend). |
| File transfer (SFTP) | N/A | Azure Blob Storage's built-in SFTP support | No separate SFTP server needed — Blob Storage supports the SFTP protocol natively. |
| DNS | Registrar DNS (current), or Cloudflare DNS (free, see below) | Azure DNS | Migrate nameservers to Azure DNS when you move hosting; keeps DNS + hosting + everything else under one account/billing. |
| Load balancer | N/A (single static origin) | Azure Front Door (global) / Azure Load Balancer (regional) | Relevant once there's more than one backend instance to spread traffic across. |
| Deployment automation ("Ansible-like") | GitHub Actions (already set up — see `.github/workflows/deploy.yml`) | GitHub Actions or Azure DevOps Pipelines + Bicep/Terraform for infrastructure-as-code | Prefer Bicep (Azure-native IaC) over Ansible for Azure resources — Ansible shines for configuring VMs/servers, which this architecture mostly avoids via PaaS. |
| Secrets/credentials | `.env` (local only, gitignored) | Azure Key Vault | One central secrets store; app services reference it rather than holding their own copies. |
| Observability — metrics | N/A | Azure Monitor Metrics (or Azure Managed Grafana + Prometheus-compatible metrics if you want the Grafana stack specifically) | Azure Monitor is the native option; **Azure Managed Grafana** is a real Azure PaaS offering if you specifically want Grafana dashboards. |
| Observability — logs | N/A | Azure Monitor Log Analytics (Loki-equivalent) | |
| Observability — traces | N/A | Application Insights distributed tracing (OpenTelemetry-native) | Azure Monitor/App Insights speaks OTel natively — no separate Tempo/Mimir stack needed unless you have a strong reason to run Grafana's LGTM stack specifically. |
| Data observability | N/A | Azure Purview (data catalog/lineage) — only if you build actual data pipelines | Not relevant until there's a real data platform (e.g. course analytics pipeline, student data warehouse). |

## What to actually do now

See the main [README.md](../README.md) — the only near-term action is
**Cloudflare's free tier** for CDN/DNS/edge protection, since it's the one
thing on this list that's genuinely free, adds real value to a static site,
and requires no backend to exist first.

## When to revisit this doc

When any of these becomes true:
- You add a real backend (API, database, auth) → API gateway, DMZ, LB rows become relevant
- You migrate hosting to Azure → DNS, CDN, deployment rows get executed
- You have actual services emitting logs/metrics/traces → observability rows get executed
- You build a real data pipeline → data observability row becomes relevant
