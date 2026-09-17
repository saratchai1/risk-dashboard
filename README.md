# Forest Carbon Command Center — Executive MVP

Executive-first prototype for **forest carbon project performance, MRV readiness, risk management, decisions, actions, and management briefing**.

## Status

- MVP version: `0.2.0`
- Reference date in demo data: `2026-09-17`
- Runtime dependencies: none
- Backend: none (local browser state only)
- Intended audience: executives / project management

## What is implemented

- Executive portfolio overview
- Target / actual / forecast framing
- Project cockpit and project-level drill-down
- Portfolio risk register with likelihood × impact matrix
- Separate risk severity and evidence confidence
- Risk detail drawer with cause, consequence, evidence, treatment, owner, due date, and residual risk
- Decision center with approve / defer demo flow
- Action center with traceability back to risk / decision and follow-up logic
- MRV / verification readiness checklist
- Executive brief view with print/PDF and copyable management summary
- CSV export for risk and action registers
- Responsive desktop/mobile layout
- LocalStorage persistence for demo decision/action status
- Traceable conceptual flow: **Monitoring → Signal → Risk → Decision → Action → Follow-up → Residual Risk**

## Important data note

This MVP intentionally uses **assumed / demo values** to test information architecture and executive workflow. Some project groupings, carbon targets, forecasts, milestone dates, risk records, readiness values, and management recommendations are placeholders.

Known plot labels and monitoring concepts are used only to make the prototype concrete. **Do not use the demo values for impact claims, verification, carbon accounting, official risk reporting, or management reporting** until the dashboard is connected to canonical project data.

## Run locally

```bash
npm run dev
```

Then open `http://localhost:4173`.

Validation:

```bash
npm test
```

The app is static and can be hosted on Vercel, Cloudflare Pages, GitHub Pages, or any static web server.

## Recommended production integration order

1. Connect project / plot master data from the existing monitoring platform as read-only sources.
2. Connect monitoring events by **actual observation date**; keep Care Year as a nullable business/reporting classification.
3. Connect operational evidence: drone, satellite, field, review, analysis revision, and work plan.
4. Introduce canonical backend domains for `ProjectTarget`, `Milestone`, `Risk`, `RiskAssessment`, `Decision`, `Action`, `VerificationCycle`, and audit events.
5. Replace all demo carbon target / forecast values with versioned methodology-backed calculations.
6. Add authentication, RBAC, immutable audit history, source/version metadata, and server-side persistence.
7. Only then add automated risk rules, cross-evidence checks, forecasting, and AI summaries.

## MVP scope boundary

This prototype is **not** a carbon-credit calculation engine, **not** an official Premium T-VER risk assessment, **not** a verifier, and **not** an automated decision maker. Recommendations shown in the UI are demo decision-support patterns; final decisions remain human-controlled.

See:

- `docs/ASSUMPTIONS.md`
- `docs/INTEGRATION_PLAN.md`
