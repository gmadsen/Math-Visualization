# inline-code-cell

Tiny in-page JavaScript REPL. The widget emits an empty host div; at runtime
the page-global library
[`js/widget-inline-code-cell.js`](../../js/widget-inline-code-cell.js) builds
the chrome (header, textarea pre-loaded with `initialCode`, Run button, output
area) by calling `MVInlineCodeCell.init('#widgetId', config)`.

## When to reach for it

Use `inline-code-cell` when a topic benefits from letting the reader poke at
small bits of executable JavaScript without leaving the page — e.g.

- Number-theory pages where the reader wants to factor or sieve a few values
  with `factor`, `primes`, `pow(a, k, m)`.
- Algorithms pages where short snippets clarify a step ("try gcd(48, 18)").
- Discrete-math demonstrations where the prelude functions are part of the
  pedagogy.

If the topic needs a continuous slider or a structured form rather than free
JavaScript, prefer a more specialized widget.

## Security model

User code runs in a sandboxed Web Worker, **not** on the main thread.
Concretely that means:

- **No DOM access.** Workers don't have `document`, `window`, the page's
  globals, or the parent's variables. The user can't read or modify the
  page or any other widget's state.
- **No `fetch` from the worker** by default — the worker boot script does
  not import any network capability and explicitly deletes
  `fetch` / `importScripts` / `XMLHttpRequest` off `self` before the user
  code runs.
- **No `eval` on the main thread.** The worker is the only place code is
  evaluated, via `(new Function(code))()` inside the worker scope.
- **2-second hard timeout.** If user code runs >2 s the main thread calls
  `worker.terminate()` and reports a timeout error. This protects against
  infinite loops in user code (the worker is a separate thread anyway, so
  the UI stays responsive even before termination).
- **No persistence.** Nothing is written to localStorage or sent off-machine.

This is the right model for a public-facing teaching notebook hosted on
GitHub Pages — readers can experiment freely without endangering the page or
each other.

## Prelude

When `prelude: "math"` (the default), the worker prepends the following
helpers before the user's code:

| name | signature | description |
|---|---|---|
| `gcd(a, b)` | `(int, int) -> int` | Euclidean gcd of `\|a\|` and `\|b\|`. |
| `mod(a, n)` | `(int, int) -> int` | Non-negative modulo (`((a % n) + n) % n`). |
| `factor(n)` | `(int) -> [[p, k], ...]` | Prime factorization with multiplicities. |
| `isPrime(n)` | `(int) -> bool` | Trial-division primality test. |
| `primes(N)` | `(int) -> [int]` | Sieve of Eratosthenes up to and including `N`. |
| `pow(b, e, m)` | `(int, int, int?) -> int` | Modular exponentiation; if `m` is omitted, regular `b**e`. |

## Params

See [`schema.json`](./schema.json) for the authoritative definition. Summary:

| field          | required | type / shape                                                |
|----------------|----------|-------------------------------------------------------------|
| `widgetId`     | yes      | DOM id for the host `<div class="widget">`.                 |
| `title`        | yes      | Header title shown in `.hd > .ttl`.                          |
| `hint`         | no       | Header hint shown in `.hd > .hint` (default: library hint). |
| `initialCode`  | no       | Code pre-loaded in the editor (default `'// type JS here\n'`). |
| `prelude`      | no       | `"math"` (default and only option today).                   |
| `rows`         | no       | Textarea row count, 4..24 (default 8).                       |
| `runLabel`     | no       | Run button label (default `'Run'`).                         |
| `sectionComment` | no     | ARTIFACT — banner comment preserved when migrating sources. |

## Alternate frontends

`initialCode` and `prelude` are pure data — a React / SSR consumer can ignore
`renderScript` and supply its own sandbox (e.g. an iframe-with-`sandbox`-attr
plus the same Worker recipe). The schema's `prelude` enum is the contract;
adding a new prelude requires updating both the schema and the library.

## Example

A canonical instance lives at [`example.json`](./example.json) (a
number-theory sandbox demonstrating the math prelude) and is consumed by
`scripts/test-widget-renderers.mjs` as the test fixture for this slug.
