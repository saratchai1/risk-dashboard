# Integration plan

## Target architecture

```text
Operational monitoring sources
  ├─ Project / plot master
  ├─ Monitoring events
  ├─ Drone / mosaic / analysis revisions
  ├─ Satellite / tide / change signals
  ├─ Field observations
  ├─ Reviewer workflow
  └─ Work plans / evidence
            │
            ▼
Read-only canonical integration layer
            │
     ┌──────┴─────────┐
     ▼                ▼
Performance       MRV readiness
     │                │
     └──────┬─────────┘
            ▼
       Risk signals
            ▼
   Human risk assessment
            ▼
         Decision
            ▼
          Action
            ▼
      Follow-up monitor
            ▼
       Residual risk
```

## First integration milestone

Connect read-only canonical data before allowing the management dashboard to write back to the operational system.

Minimum read contract:

- `project_id`
- `plot_id`
- `observation_date`
- `care_year_id` nullable
- `monitoring_status`
- `evidence_type`
- `evidence_id`
- `analysis_revision`
- `review_status`
- `source_updated_at`

## Management domains to add later

- `project_targets`
- `project_milestones`
- `risk_signals`
- `risks`
- `risk_assessments`
- `decisions`
- `actions`
- `action_evidence`
- `verification_cycles`
- `audit_events`

## Guardrails

- Do not duplicate raw monitoring assets in the management layer.
- Do not use Care Year as the observation timestamp.
- Do not allow AI / satellite / drone signals to silently change operational truth.
- Store rule, model, methodology, and source versions for derived results.
- Keep historical risk assessment and decision history append-only where possible.
