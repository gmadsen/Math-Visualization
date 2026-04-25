# Agent-environment guide

The notebook's verification flow assumes a real browser — see CLAUDE.md § "Verification" for the human checklist (KaTeX rendering, widget interaction, quiz mastery roundtrip, deep-link anchors, console silence). When you're operating in an LLM sandbox without a browser, this file documents the partial-substitute flow.

## When you have a real browser

Run a local server, open the page, exercise it. Don't claim a feature works without doing this — type-checking or file existence is not enough.

```bash
python3 -m http.server 8000
# open http://localhost:8000/<page>.html
```

The full reader-side checklist lives in CLAUDE.md.

## When you don't have a browser: jsdom

If you're running in an agent sandbox without a real browser, use jsdom as a **partial substitute**. It won't exercise CSS layout or user interaction, but it *will* run the page's top-of-body helper script and KaTeX, and it *will* surface script errors. Minimum shape:

```js
const { JSDOM, VirtualConsole } = require('jsdom');
const errors = [];
const vc = new VirtualConsole();
vc.on('jsdomError', e => errors.push('jsdomError: ' + (e && (e.message || e))));
vc.on('error',      e => errors.push('error: ' + (e && (e.message || e))));
const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  virtualConsole: vc,
  url: 'file://' + file,
});
setTimeout(() => {
  const { document } = dom.window;
  // Count: aside.sidetoc a, nav.toc a[href^="#"], .widget, section, .widget svg
  // Assert: errors.length === 0
}, 500);
```

What to count, what to assert:

- `aside.sidetoc a` — sidebar TOC populated.
- `nav.toc a[href^="#"]` — top-nav anchors present (≥ 1).
- `.widget` — at least one interactive widget on the page.
- `section` — concept sections exist.
- `.widget svg` — every widget that should have an SVG has one.

A clean jsdom run is **necessary but not sufficient**. Say so explicitly when reporting:

> "jsdom smoke ran clean — N widgets, M sections, no script errors. Visual layout, interactivity, and KaTeX final pass not verified — needs human browser check."

Widget interactivity (slider drag, button clicks, the actual DOM updates that result) still has to be verified by a human in a real browser before the page is considered final.

If you can't run even jsdom, **say so explicitly**. Do not claim a visual feature works.

## Where scratch verification scripts go

Ad-hoc `_verify_*.js` files used for jsdom smoke-testing belong **one level up from the repo** (e.g. `/sessions/<id>/_verify_<page>.js`), not inside `Math-Visualization/`. The repo is public; keep it free of throwaway instrumentation. The "no scratch verify scripts in the repo" rule is in CLAUDE.md's "What not to do" list and the pre-commit hook surfaces it.
