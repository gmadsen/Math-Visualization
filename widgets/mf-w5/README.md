# `mf-w5`

Bespoke verbatim slug for the "HJB on a binomial state tree" widget on `mathematical-finance`.

Migrated from an inline `<div class="widget">` block by `scripts/migrate-inline-widgets-{typea,typeb}.mjs`. Uses the shared renderer at `widgets/_shared/verbatim-renderer.mjs` — `bodyMarkup` and `bodyScript` are emitted verbatim. See `schema.json` for the param shape.

A future deeper migration could hoist this widget's semantic params (slider ranges, etc.) out of the opaque body strings into typed schema fields.
