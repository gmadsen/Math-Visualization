# `sm-boltz`

Bespoke verbatim slug for the "Boltzmann distribution on a 4-level system" widget on `statistical-mechanics`.

Migrated from an inline `<div class="widget">` (Type B: structured `type:"widget"` block without a registry slug) by `scripts/migrate-inline-widgets-typeb.mjs`. Uses the shared renderer at `widgets/_shared/verbatim-renderer.mjs` — `bodyMarkup` and `bodyScript` are emitted verbatim. See `schema.json` for the param shape.

A future deeper migration could hoist this widget's semantic params (slider ranges, etc.) out of the opaque body strings into typed schema fields.
