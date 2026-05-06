# `toric-varieties-w2`

Verbatim-renderer slug for an inline widget on the `toric-varieties` topic. Uses the shared verbatim renderer at `widgets/_shared/verbatim-renderer.mjs`; `bodyMarkup` and `bodyScript` are the full widget body and the driving script extracted as opaque strings so the byte-identical round-trip stays intact.

To upgrade this widget into a bespoke renderer with semantic params (slider ranges, color tokens, etc.), replace `widgets/toric-varieties-w2/index.mjs` with a custom `renderMarkup` / `renderScript` and update the schema accordingly.
