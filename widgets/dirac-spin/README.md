# `dirac-spin`

Bespoke verbatim slug for the "Spinor under boosts: rest-frame spin-up boosted to a moving frame" widget on `dirac-equation`.

Migrated from an inline `<div class="widget">` block by `scripts/migrate-inline-widgets-{typea,typeb}.mjs`. Uses the shared renderer at `widgets/_shared/verbatim-renderer.mjs` — `bodyMarkup` and `bodyScript` are emitted verbatim. See `schema.json` for the param shape.

A future deeper migration could hoist this widget's semantic params (slider ranges, etc.) out of the opaque body strings into typed schema fields.
