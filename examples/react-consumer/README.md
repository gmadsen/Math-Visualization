# react-consumer (proof of concept)

**What this proves.** The widget registry introduced by the `feat/portable-data-model`
work is genuinely framework-portable. This POC renders the `w-cat`
*composition-explorer* widget with React using only two inputs:
`widgets/composition-explorer/schema.json` (for validation) and the widget's
`params` block from `content/category-theory.json` (for data). It never parses
`category-theory.html`, never imports `widgets/composition-explorer/index.mjs`
(the vanilla-JS renderer), and never touches any DOM-mutation code from the
notebook. A React component takes the schema-validated params as props and
produces the same conceptual SVG diagram + readout + reset affordance the
vanilla widget does — proving a second framework can consume the registry.

**How to run.**

```bash
cd examples/react-consumer
npm install
npm run render
```

Expected output: a line `params validated: OK`, followed by the server-rendered
HTML (a `<div class="widget">…</div>` containing the title "Composition
explorer", object labels A/B/C, and morphism labels id_A/id_B/id_C/f/g/h).
