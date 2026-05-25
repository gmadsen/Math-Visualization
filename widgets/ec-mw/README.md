# `ec-mw`

Bespoke semantic renderer for the **"Rank & torsion gallery"** widget on `elliptic-curves`.

A dropdown selects one of a gallery of elliptic curves (known LMFDB/Cremona data); the readout
shows the Weierstrass equation, Mordell–Weil rank, torsion subgroup, and a note (e.g. 37a1 the
smallest rank-1 conductor; Mazur's torsion bound realized by $\mathbb{Z}/10$; the Bremner–Cassels
huge-height generator of $y^2 = x^3 + 877x$).

Migrated from a verbatim slug to this semantic renderer (PLAN.md verbatim→semantic program). The
**curve dataset** (`params.curves` = `{label, eq, rank, tors, note}[]`), header `title`/`hint`, and
DOM `idPrefix` are now inspectable, AJV-validated params; the select/readout wiring is the renderer's
intrinsic behavior. Output is visually/behaviorally identical to the pre-migration widget (the host
div gained `id="ec-mw"`, slug-prefixed to avoid colliding with section anchors).

See [`schema.json`](./schema.json) for the param shape.
