# surg-w6

Verbatim-renderer slug for an interactive widget on the surgery-theory topic.

Renderer: shared `widgets/_shared/verbatim-renderer.mjs`.

Params (see `schema.json`):
- `widgetId` — DOM id.
- `title` — header title.
- `hint` — header hint.
- `bodyMarkup` — exact widget HTML, byte-identical to the source.
- `bodyScript` — exact `<script>...</script>` block driving the widget.

Both `bodyMarkup` and `bodyScript` carry the original inline source verbatim.
