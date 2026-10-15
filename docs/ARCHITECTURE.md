# Aegis Enterprise — Architecture

## Goal

A deliberately realistic CI/CD classification workload, not a production payment processor. The repository has 11 npm workspaces, an HTTP control plane, a background worker, a responsive operational UI, domain events, and quality gates. It runs without third-party runtime libraries, using native Node.js 20 platform APIs so test failures are reproducible.

## Logical topology

```text
Browser Operations Dashboard (apps/dashboard)
        |
        v
HTTP API / Router / Auth / Tenant Boundaries (apps/api)
        |
        +--> Domain (Money, InventoryLedger, OrderAggregate, PricingCatalog, Risk)
        +--> Security (HMAC signed tokens, RBAC, rate limits, redaction)
        +--> Workflows (Fulfillment saga, compensation, idempotency)
        |       +--> PaymentGateway (simulated; never real transactions)
        |       +--> InventoryLedger (holds, release, commit)
        |       +--> TransactionalOutbox
        +--> Persistence (optimistic versioning, hash-chained journal, TTL cache)
        +--> Messaging (subscriptions, deduplication, retries, dead-letter)
        +--> Observability (logs, counters, latency percentiles, traces)
        +--> Analytics (order aggregates, SLA, anomaly signals)
        |
        v
Background Worker (apps/worker) — notifications via event messages
```

## Realistic concerns and trade-offs

- Strong domain invariants: money in integer cents; legal state transitions; reservation atomicity.
- Compensating actions: rollback reservation on declined payments.
- Idempotent order command via `idempotency-key`; message-bus deduplication via `event.id`.
- Tenant authorization: signed HMAC claims + role-based permissions.
- In-memory optimistic concurrency controls and append-only hash-linked event journal.
- Operational metrics include p50/p95 and availability; logs are structured and redact secrets.
- Dashboard uses browser-native modules. Production assets are copied by the build stage.
- No persistent multi-instance database or cross-process event bus. These are interfaces and behavior simulations, not actual distributed reliability guarantees.

## Integration contract

- API listens on :8080 and serves dashboard at `/`.
- POST `/api/v1/auth/demo` obtains a short-lived demo token (for local tests only).
- GET `/api/v1/inventory` returns current stock (operator/viewer token).
- POST `/api/v1/orders` creates an order; body `{ "customerId":"c-1", "lines":[{"sku":"LAPTOP-14", "quantity":1}]}`.
- GET `/api/v1/orders`, GET `/api/v1/events`, GET `/api/v1/analytics`.
- POST `/api/v1/outbox/flush` transfers events into the tamper-evident journal.
- GET `/health/live` and `/health/ready` return readiness.

## Why this is useful for an AIOps classifier

A full operational system emits strong diagnostic distractors: workspace discovery, runtime selection, security, checkout, event bus, tests, asset bundling, and CI job orchestration. Fault injection intentionally changes **only one stage at a time**. The classifier should identify the failed root cause from current logs, not guess from the project architecture or surrounding successful stages.
