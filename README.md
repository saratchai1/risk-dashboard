# Forest Carbon Command Center — MVP

Executive-first prototype for **forest carbon project performance, MRV readiness, risk management, decisions, and actions**.

## What this MVP demonstrates

- Executive portfolio overview
- Target / actual / forecast framing
- Project cockpit and project-level drill-down
- Portfolio risk register with likelihood × impact matrix
- Separate severity and evidence confidence
- Decision center / needs-attention queue
- MRV / verification readiness checklist
- Traceable conceptual flow: **Monitoring → Signal → Risk → Decision → Action → Follow-up**

## Important data note

This first MVP intentionally uses **assumed / demo values** to test information architecture and executive workflow. Some project names, carbon targets, forecasts, milestone dates, and risk values are placeholders. Known monitoring concepts and plot labels are used only to make the prototype concrete.

Do not use the demo values for impact claims, verification, carbon accounting, or management reporting until the dashboard is connected to canonical project data.

## Run locally

```bash
npm run dev
```

Then open `http://localhost:4173`.

Static hosting also works because the MVP has no build step and no runtime dependencies.

## Suggested next integrations

1. Connect project/plot master data from the existing monitoring platform.
2. Connect monitoring events by **actual observation date**; keep Care Year as a nullable business/reporting classification.
3. Connect operational evidence (drone, satellite, field, review, work plan) as read-only sources first.
4. Add canonical domains for ProjectTarget, Milestone, Risk, RiskAssessment, Decision, Action, VerificationCycle.
5. Replace demo carbon target/forecast values with versioned methodology-backed calculations.
6. Add authentication, RBAC, audit log, and source/version metadata before production use.

## MVP scope boundary

This prototype is intentionally **not** a carbon-credit calculation engine and **not** an automated decision maker. Recommendations shown in the UI are demo decision-support patterns; final decisions remain human-controlled.
