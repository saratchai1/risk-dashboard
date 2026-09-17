# MVP assumptions and data caveats

The dashboard was built from currently available project context plus explicit assumptions to demonstrate an executive workflow.

## Treated as known context

- The wider program uses plot-level monitoring.
- Drone / imagery, heatmap or derived analysis, field observations, review workflows, and work-plan concepts exist in the operational monitoring environment.
- Example plot labels such as `51-STC`, `73-STC`, and `81-STC` are used to make the prototype concrete.
- Growth / field / satellite / tide concepts are represented as possible evidence sources.

## Assumed for the MVP

- The four executive project groupings shown in the UI.
- Project area aggregation.
- Carbon targets and carbon forecasts.
- Verification / milestone dates.
- Risk likelihood, impact, residual risk, owners, due dates, and some causal statements.
- MRV readiness percentages and checklist states.
- Decision recommendations and action progress.

## Rules for interpreting the prototype

1. A monitoring signal is not automatically a confirmed issue.
2. Risk severity is separate from evidence confidence.
3. Carbon numbers are illustrative only.
4. MRV readiness is a management concept, not an official verification result.
5. Demo recommendations do not constitute technical, regulatory, or management approval.
6. Local browser state is used only to demonstrate interaction; production state must be server-side and auditable.
