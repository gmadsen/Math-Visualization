# ct-w5

Verbatim slug for an inline widget on the coding-theory topic. Markup + script are stored opaquely in `params.bodyMarkup` / `params.bodyScript`; the shared verbatim renderer at `widgets/_shared/verbatim-renderer.mjs` returns them byte-for-byte.

A future migration may hoist semantic params (slider ranges, palette tokens, etc.) out of the opaque body strings; until then this slug carries the exact bytes that previously lived inline in `coding-theory.html`.
