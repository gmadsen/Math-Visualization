# harmonic-poisson

Poisson-summation / theta explorer, introduced on `harmonic-analysis-fourier.html`
§6 (*Poisson summation*). Bespoke semantic module — the arithmetic is intrinsic;
params carry only chrome.

See [../README.md](../README.md) for the registry contract.

## What it does

Slide the scale $t$. The widget applies Poisson summation
$\sum_n f(n)=\sum_n \hat f(n)$ to the Gaussian $f_t(x)=e^{-\pi t x^2}$ (whose
transform is $\hat f_t(\xi)=t^{-1/2}e^{-\pi\xi^2/t}$), drawing both Gaussians with
their integer-lattice samples and printing the two lattice sums. They agree to
floating precision, exhibiting the **theta functional equation**
$\theta(t)=t^{-1/2}\theta(1/t)$, i.e. $\theta(1/t)=\sqrt t\,\theta(t)$, where
$\theta(t)=\sum_n e^{-\pi n^2 t}$. At $t=1$ the Gaussian is its own Fourier
transform (the self-dual fixed point). The readout ties this to Riemann's 1859
functional equation $\xi(s)=\xi(1-s)$.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-t` (slider), `-tval` (pill), `-svg`, `-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/harmonic-analysis-fourier.json`, then
`node scripts/rebuild.mjs --only widget-params` and `node scripts/rebuild.mjs`.
