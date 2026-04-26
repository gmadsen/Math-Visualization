# branching-proof-scrubber

Tree-shaped sibling of [`proof-scrubber`](../proof-scrubber/README.md). Where
the linear scrubber walks a chain of steps, this widget walks a **proof
tree**: some nodes are *forks* — points where the reader picks a tactic
(direct vs. contradiction, case A vs. case B, induction vs. contrapositive)
and the consequent chain plays out. Dead-end branches are kept as
teaching counterexamples, marked with a red ✗.

The full tree is drawn as a top-down SVG. The reader's chosen path is
highlighted in the configured palette accent; untraversed branches dim
to grey; dead-ends greyed and crossed. Below the SVG sits a card with
the current node's prompt (KaTeX-rendered), prev/next step buttons, and
at fork nodes a row of branch buttons labeled with each child's
`branchLabel`. A breadcrumb traces the chosen path; reset returns to
the root.

See [`../README.md`](../README.md) for the registry contract.

## When to reach for it

Use `branching-proof-scrubber` when the **shape of the argument** is the
pedagogical point — when the reader needs to see *why* one tactic
succeeds and another stalls. Concrete cases:

- **Proof by contradiction vs. construction** — show both attempts; let
  the dead branch teach what goes wrong.
- **Cases of a theorem** — "if $x \in A$ / if $x \in B$ / if neither" — the
  reader picks a case and sees the chain that handles it.
- **"Try direct / try induction / try contrapositive"** — multiple valid
  tactics that converge on the same QED, displayed as parallel branches.
- **Algorithm correctness with sub-cases** — base case + inductive step
  with two recursive sub-arguments.

For a *linear* sequence of states (no decisions), use
[`proof-scrubber`](../proof-scrubber/README.md) instead — its slider +
play-pause UI is a better fit when there is no branching.

## Interactions

| gesture                 | effect                                                                              |
|-------------------------|-------------------------------------------------------------------------------------|
| **step → / ← step**     | advance / retreat one node along the chosen path. Disabled at forks (must pick).    |
| **branch button**       | at a fork node, pick one child to descend into.                                      |
| **click a tree node**   | jump back to any node already on the chosen path (no teleporting across forks).      |
| **arrow keys**          | ←/→ scrub when the widget has focus. `r` or `Home` resets.                          |
| **reset**               | return to the root and clear the chosen path.                                       |

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field         | required | default | purpose                                                                                                |
|---------------|----------|---------|--------------------------------------------------------------------------------------------------------|
| `widgetId`    | yes      | -       | DOM id for the outer `<div class="widget">`. All inner ids derive from this so multiple instances coexist. |
| `title`       | yes      | -       | Header title, KaTeX-allowed.                                                                            |
| `hint`        | no       | derived | Header hint. Falls back to a generic affordance string.                                                |
| `rootId`      | yes      | -       | Id of the starting node. Must reference an entry in `nodes`.                                            |
| `nodes`       | yes      | -       | Flat array of `{id, kind, prompt, children, branchLabel?, dead?}` records. The widget walks the tree implied by `rootId` + `children`. |
| `width`       | no       | `520`   | SVG viewport width in user units. CSS caps display at 100% of container.                                |
| `height`      | no       | `280`   | SVG viewport height. Bump up for trees deeper than ~5 levels.                                           |
| `palette`     | no       | `cyan`  | Accent for the chosen path: `cyan` / `violet` / `yellow` / `pink`. Resolved via `var(--<palette>)`.      |
| `sectionComment` | no    | -       | **Artifact.** Optional `/* … */` banner emitted between `<script>` and the IIFE.                         |

### Node shape

```json
{
  "id": "case-a",
  "kind": "step",
  "prompt": "Suppose $x \\in A$. Then ...",
  "children": ["case-a-conclusion"],
  "branchLabel": "case A: $x \\in A$",
  "dead": false
}
```

- `kind: "step"` — single-child sequential node; `children` length = 1.
- `kind: "fork"` — multi-child decision; `children` length ≥ 2; the reader picks one via labeled buttons.
- `kind: "leaf"` — terminal (`children` empty). Either QED, or a dead end that demonstrates a tactic failure.
- `branchLabel` — short label (5-25 chars) shown on the branch button when this node is reached via a fork. Required only on children of fork nodes.
- `dead: true` — render the node and its incoming edge muted, with a red ✗ overlay. Dead branches are kept as teaching tools — they show why the *other* tactic is the right move.

## Theme awareness

All colors come from `:root` CSS custom properties (`--bg`, `--panel`,
`--panel2`, `--ink`, `--mute`, `--line`, plus the chosen accent and
`--pink` for the dead-end ✗). A `MutationObserver` on
`document.documentElement`'s `data-theme` attribute triggers a redraw on
theme flips so the tree recolors without a reload.

## Alternate frontends

`nodes` + `rootId` is pure data — a React / SSR consumer can ignore
`renderScript` entirely and render its own tree from the schema. The
data model is fully captured: navigation rules (history is a path; pop
to retreat; push at forks; can't teleport across unchosen forks) are
enforced by the renderer, not the data.

## Example

A canonical fixture lives at [`example.json`](./example.json) — a
branching proof of the irrationality of $\sqrt{2}$ that contrasts
**direct construction** (a dead end: any candidate decomposition begs
the question) with **proof by contradiction** (which works), and inside
the contradiction branch offers a second fork between using
$\gcd(p, q) = 1$ directly and the longer infinite-descent route. The
fixture is consumed by `scripts/test-widget-renderers.mjs` as the test
instance for this slug until a topic page adopts it.
