# `ec-j`

Bespoke verbatim slug for the "$j$-invariant calculator" widget on `elliptic-curves`.

Migrated from inline `<div class="widget">` markup (Type A: raw HTML buried in a `raw` block) by `scripts/migrate-inline-widgets-typea.mjs`. Uses the shared renderer at `widgets/_shared/verbatim-renderer.mjs` — `bodyMarkup` and `bodyScript` are emitted verbatim. See `schema.json` for the param shape.

A future deeper migration could hoist this widget's semantic params (slider ranges, etc.) out of the opaque body strings into typed schema fields.
