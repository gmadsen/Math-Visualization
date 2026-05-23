# harmonic-schwartz

Schwartz-space membership gallery, introduced on `harmonic-analysis-fourier.html`
§4 (*Schwartz space and tempered distributions*). Bespoke semantic module — the
functions are intrinsic; params carry only chrome.

See [../README.md](../README.md) for the registry contract.

## What it does

Five tabs — $e^{-\pi x^2}$, $x^2e^{-\pi x^2}$, $1/(1+x^2)$, $e^{-|x|}$, and a
smooth compactly-supported bump — each plot the function and show two badges:
**smooth ($C^\infty$)?** and **decays faster than every polynomial?** The verdict
$\in\mathcal S$ / $\notin\mathcal S$ follows from the conjunction. The Gaussian
and bump are Schwartz; $1/(1+x^2)$ is smooth but decays only like $x^{-2}$;
$e^{-|x|}$ decays fast but has a corner. The readout gives the definition, the
isomorphism $\mathcal F:\mathcal S\to\mathcal S$ with $\mathcal F^4=\mathrm{id}$
(the smoothness↔decay swap that makes *both* conditions necessary), and the
extension to tempered distributions $\mathcal S'$ ($\hat\delta=1$, $\hat 1=\delta$).

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-svg/-out` and the five function-tab button ids. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/harmonic-analysis-fourier.json`, then
`node scripts/rebuild.mjs --only widget-params` and `node scripts/rebuild.mjs`.
