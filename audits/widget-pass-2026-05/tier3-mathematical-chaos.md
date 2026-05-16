# mathematical-chaos — tier 3 functional verification (2026-05)

**Widgets:** 9 total, 6 responsive, 0 unresponsive, 3 static (no controls)

## Per-widget status

| ID | Title | Status | Controls tested | Controls that changed output |
|---|---|---|---:|---:|
| `w-mchaos-lyap-code` | Lyapunov-exponent sandbox: λ(f,x0)\lambda(f,x_0)λ(f,x0​) | static | 0 | 0 |
| `w-mchaos-logistic` | Logistic map cobweb: xn+1=r xn(1−xn)x_{n+1}=r\,x_n(1-x_n)xn+1​=rxn​(1−xn​) | responsive | 2 | 2 |
| `w-mchaos-bifurcation` | Bifurcation diagram of fr(x)=rx(1−x)f_r(x)=rx(1-x)fr​(x)=rx(1−x) | responsive | 1 | 1 |
| `w-mchaos-lorenz` | Lorenz system, projected to the (x,z)(x,z)(x,z) plane | responsive | 1 | 1 |
| `w-mchaos-horseshoe` | Smale's horseshoe: stretch, fold, replace | static | 0 | 0 |
| `w-mchaos-symbolic` | Symbolic dynamics: doubling map ↔ 2-shift | responsive | 2 | 2 |
| `w-mchaos-ergodic` | Time average vs. space average: f4(x)=4x(1−x)f_4(x)=4x(1-x)f4​(x)=4x(1−x) | static | 0 | 0 |
| `w-mchaos-stdmap` | Chirikov standard map: pn+1=pn+Ksin⁡θnp_{n+1}=p_n+K\sin\theta_npn+1​=pn​+Ksinθn​ | responsive | 1 | 1 |
| `w-mchaos-sharkovsky` | Sharkovsky's order — period-3 forces everything | responsive | 1 | 1 |

## Unresponsive widgets

_None._
