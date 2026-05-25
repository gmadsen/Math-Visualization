# `ec-j`

Bespoke semantic renderer for the **$j$-invariant calculator** on `elliptic-curves`.

Two sliders $a,b$ drive $j = 1728\,\dfrac{4a^3}{4a^3 + 27b^2}$ for $y^2 = x^3 + ax + b$; the readout
shows $\Delta$, $j$, and CM annotations ($j=0$: CM by $\mathbb{Z}[\omega]$; $j=1728$: CM by
$\mathbb{Z}[i]$). A gallery of preset buttons jumps to famous complex-multiplication curves
($j = 0, 1728, -3375, -32768$).

Migrated from a verbatim slug to this semantic renderer (PLAN.md verbatim→semantic program). The
slider ranges/defaults (`params.a`, `params.b`), header `title`/`hint`, DOM `idPrefix`, and the
**preset gallery** (`params.presets` = `{a, b, label}[]`) are now inspectable, AJV-validated params;
the $j$-invariant formula and CM annotations are the renderer's intrinsic behavior. Output is
visually/behaviorally identical to the pre-migration widget (the host div gained an `id`).

See [`schema.json`](./schema.json) for the param shape.
