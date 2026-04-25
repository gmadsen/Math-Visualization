# Agent-environment guide

The notebook's verification flow assumes a real browser — see CLAUDE.md § "Verification" for the human checklist (KaTeX rendering, widget interaction, quiz mastery roundtrip, deep-link anchors, console silence). When you're operating in an LLM sandbox without a browser, this file documents the partial-substitute flow.

## When you have a real browser

Run a local server, open the page, exercise it. Don't claim a feature works without doing this — type-checking or file existence is not enough.

```bash
python3 -m http.server 8000
# open http://localhost:8000/<page>.html
```

The full reader-side checklist lives in CLAUDE.md.

## Driving the browser from an agent: chrome / Playwright MCP

Both the `chrome-devtools-mcp` and `playwright-mcp` plugins drive a real Chromium against your local dev server, so KaTeX rendering, click handlers, and Web Worker boot all run for real. The agent flow is:

1. Start the local server bound to localhost — `python3 -m http.server 8765 --bind 127.0.0.1 --directory .` in the background.
2. `mcp__plugin_playwright_playwright__browser_navigate` (or the chrome-devtools equivalent) to `http://127.0.0.1:8765/<page>.html`.
3. `browser_console_messages` to catch script errors and KaTeX warnings; `browser_evaluate` to assert on the DOM (e.g. count `.widget` children, scan for raw `$…$` text, confirm `MVQuiz` initialised).
4. `browser_take_screenshot` for any UI you want a visual record of — write into `/tmp/` or session scratch, **not** the repo (`*.png` ending up in repo root is gitignored).

Prerequisite: a working Chromium. On Arch/Manjaro: `sudo pacman -S google-chrome` (or `chromium`). The Playwright MCP looks for `/opt/google/chrome/chrome` by default; if it's missing, `browser_navigate` fails with a clear message. Once installed, the MCP starts the browser on first use — no extra config.

When you're scanning a page for raw KaTeX leakage, the gotcha checklist:

- Skip `<option>` text — native `<select>` popups are OS-drawn; `js/katex-select.js` shims this with a hidden native + custom popup. Scan via the `.ks-button` text, not the `<select>`.
- Skip `<annotation>` / `.katex-mathml` subtrees — KaTeX duplicates the source LaTeX into a hidden MathML annotation for accessibility. A naive `textContent` scan picks them up as false positives.
- Skip `aria-hidden="true"` subtrees — same false-positive class.
- SVG `<text>` elements cannot host KaTeX. If a node label needs math, it must live in `<foreignObject>` + `<div>`, then `renderMathInElement(svg)` after the build.

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
