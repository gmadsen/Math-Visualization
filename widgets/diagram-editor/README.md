# diagram-editor

An interactive **commutative-diagram editor**. The reader can drag vertices
to rearrange the diagram, toggle individual arrows on or off, and watch
the widget re-evaluate declared relations (commutative squares, exact
sequences) live: each relation is reported as ✓ (satisfied), ✗ (violated),
or ? (indeterminate — some referenced arrow is toggled off).

Where [`clickable-diagram`](../clickable-diagram/README.md) shows a fixed
diagram and lets the reader pick objects, and
[`composition-explorer`](../composition-explorer/README.md) walks a static
composition table, this widget puts the diagram itself under the reader's
hand: rearranging makes a square's commutativity visually obvious,
toggling an arrow makes the consequence of removing it immediate.

See [`../README.md`](../README.md) for the registry contract.

## When to reach for it

Use `diagram-editor` when the **shape of the diagram is itself the lesson**
— when "see why this square commutes" or "watch what breaks if you remove
this arrow" is the pedagogical move. Concrete cases:

- **Commutative squares** — pullbacks, pushouts, naturality squares; the
  ✓ on `h ∘ f = k ∘ g` makes the constraint readable and visceral.
- **Exact sequences** — short and 5-term exact sequences, the snake
  lemma, long exact sequence in homology; toggle one map off and the
  exactness indicator drops to `?`, then `✗` when the remaining maps no
  longer compose through the named node.
- **Universal-property diagrams** — show the dotted "induced" arrow and
  let the reader rearrange the surrounding objects to see why the
  factorisation forces a specific shape.
- **Diagram chases** — toggle a map you're "free" to assume zero, see
  the consequence on every dependent relation.

For a *static* picture the reader only inspects, use
[`svg-illustration`](../svg-illustration/README.md). For a *click-driven*
selection out of a fixed picture, use
[`clickable-diagram`](../clickable-diagram/README.md). For the
**branching** case where alternatives are tactical (proof by
contradiction vs. construction), use
[`branching-proof-scrubber`](../branching-proof-scrubber/README.md) instead
— that widget walks a tree of decisions; this one explores the *shape* of
a single fixed diagram.

## Interactions

| gesture                          | effect                                                                                            |
|----------------------------------|---------------------------------------------------------------------------------------------------|
| **drag a node**                  | (mode = `free`) move the vertex to any position. (mode = `snap-grid`) snap to a 6×4 grid on drop.  |
| **toggle an arrow checkbox**     | remove (or restore) the arrow from the diagram and from every relation evaluation.                  |
| **reset**                        | restore initial node positions and turn every togglable arrow back on.                             |
| **mode = `fixed`**               | drag is disabled — only the toggle row remains, useful when the layout itself is fixed but the reader should explore arrow combinations. |

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field         | required | default      | purpose                                                                                                |
|---------------|----------|--------------|--------------------------------------------------------------------------------------------------------|
| `widgetId`    | yes      | -            | DOM id for the outer `<div class="widget">`. All inner ids derive from this so multiple instances coexist. |
| `title`       | yes      | -            | Header title, KaTeX-allowed.                                                                            |
| `hint`        | no       | derived      | Header hint. Falls back to a generic "drag · toggle · watch" string.                                    |
| `width`       | no       | `480`        | SVG viewport width in user units (CSS caps display at 100% of container).                               |
| `height`      | no       | `280`        | SVG viewport height in user units.                                                                      |
| `palette`     | no       | `violet`     | Accent for satisfied-relation glyphs and `iso` arrow ≅: `cyan` / `violet` / `yellow` / `pink`.           |
| `mode`        | no       | `snap-grid`  | `free` / `snap-grid` / `fixed`. See "Interactions".                                                     |
| `nodes`       | yes      | -            | Array of `{ id, label, x, y, color? }`. `x` / `y` are RATIOS in `[0, 1]` of the viewBox.                |
| `arrows`      | yes      | -            | Array of `{ id, from, to, label?, kind?, curve?, togglable? }`. `kind` ∈ `morphism`/`mono`/`epi`/`iso`/`dotted`. |
| `relations`   | no       | `[]`         | Array of declared relations the widget evaluates live. See below.                                        |
| `sectionComment` | no    | -            | **Artifact.** Optional `/* … */` banner emitted between `<script>` and the IIFE.                         |

### Node shape

```json
{ "id": "A", "label": "$A$", "x": 0.20, "y": 0.25, "color": "violet" }
```

`x` / `y` are ratios so the same data renders sensibly at any width / height
chosen for the SVG viewport. `color` is one of the project palette tokens
(`ink` / `blue` / `yellow` / `green` / `pink` / `violet` / `cyan`) and is
resolved at render time via `var(--<color>)`.

### Arrow shape

```json
{ "id": "f", "from": "A", "to": "B", "label": "$f$", "kind": "morphism", "togglable": true }
```

`kind`:

- `morphism` — plain →
- `mono` — hooked tail (↪)
- `epi` — double-headed (↠)
- `iso` — plain → with a small ≅ above the midpoint, in the accent color
- `dotted` — dashed → in `var(--mute)` (used for derived / induced arrows)

`curve`: perpendicular bow offset (positive = above, for left-to-right
arrows). Use to disambiguate two arrows sharing endpoints. Default 0.

### Relations

Two kinds, both with `lhs` / `rhs` arrays of arrow ids:

- `commute` — `{ kind, lhs, rhs, label? }`. Asserts the composition
  along `lhs` equals the composition along `rhs` as a single morphism.
  Reported ✓ when both chains are present and start/end at the same
  nodes; ✗ when endpoints disagree; ? when any referenced arrow is off.

- `exact` — `{ kind, lhs, rhs, at, label? }`. Asserts the sequence is
  exact at node `at`, where `lhs` composes into `at` and `rhs` composes
  out of `at`. Reported ✓ when both chains are present and pass through
  `at` correctly; ✗ when the chains miss `at`; ? when any arrow is off.

In both kinds the widget reports a *curated* relation: it doesn't try to
solve the diagram, it checks that the ids are present and the path
endpoints are consistent. Authors declare the equality / exactness; the
widget makes the *consequence of breaking it* observable.

## Theme awareness

All colors come from `:root` CSS custom properties (`--bg`, `--panel`,
`--panel2`, `--ink`, `--mute`, `--line`, `--pink` for ✗, plus the chosen
accent). A `MutationObserver` on `document.documentElement`'s
`data-theme` attribute triggers a redraw on theme flips so the diagram
recolors without a reload.

## Alternate frontends

`nodes` + `arrows` + `relations` is pure data — a React / SSR consumer
can ignore `renderScript` entirely and render its own draggable diagram
from the schema. The data model is fully captured: rendering rules
(arrow kinds, label placement, curve offsets) and evaluation rules
(`evalRelation` returning sat / vio / ind) are fully derivable from the
schema fields.

## Example

A canonical fixture lives at [`example.json`](./example.json) — a
commutative square `A → B → D` and `A → C → D` with the relation
`h ∘ f = k ∘ g` declared. Toggling any of the four arrows off drops
the relation to `?`; rearranging the vertices doesn't change the
status (commutativity is a property of the maps, not the layout) but
does make it visually obvious which paths the relation refers to.
The fixture is consumed by `scripts/test-widget-renderers.mjs` as the
test instance for this slug until a topic page adopts it.
