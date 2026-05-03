/* widget-history-icons.js
 *
 * Hand-drawn 24×24 SVG glyphs for ~12 of the densest historical figures
 * on history.html. Each glyph is a small motif tied to that mathematician's
 * signature contribution — a low-cost identity layer that beats the
 * 2-letter monogram fallback.
 *
 * Rendered by the inline `.person` cards in history.html when the
 * mathematician's id has an entry in this dictionary; otherwise the page
 * keeps the monogram glyph that's already there. Unknown ids are silently
 * skipped (the page works fine without us).
 *
 * Design rules:
 *   - 24×24 viewBox so the existing 46-px circular .glyph slot resizes them.
 *   - currentColor stroke + fill so the era accent flows through.
 *   - Each glyph is one small idea, not an attempt at a portrait.
 */
(function(){
  'use strict';
  if(window.MVHistoryIcons) return;

  const ICONS = {
    // Riemann: zeta with a vertical line through the critical strip
    riemann:
      '<svg viewBox="0 0 24 24" aria-hidden="true">' +
      '<text x="12" y="18" text-anchor="middle" font-family="serif" font-size="18" font-style="italic" fill="currentColor">ζ</text>' +
      '<line x1="9" y1="3" x2="9" y2="21" stroke="currentColor" stroke-width="0.7" stroke-dasharray="2 2" opacity="0.6"/>' +
      '</svg>',

    // Cantor: the middle-thirds Cantor set in three iterations
    cantor:
      '<svg viewBox="0 0 24 24" aria-hidden="true">' +
      '<rect x="2" y="6"  width="20" height="2" fill="currentColor"/>' +
      '<rect x="2" y="11" width="6.7" height="2" fill="currentColor"/>' +
      '<rect x="15.3" y="11" width="6.7" height="2" fill="currentColor"/>' +
      '<rect x="2" y="16" width="2.2" height="2" fill="currentColor"/>' +
      '<rect x="6.5" y="16" width="2.2" height="2" fill="currentColor"/>' +
      '<rect x="15.3" y="16" width="2.2" height="2" fill="currentColor"/>' +
      '<rect x="19.8" y="16" width="2.2" height="2" fill="currentColor"/>' +
      '</svg>',

    // Grothendieck: the universal-arrow ∂ as a partial-derivative glyph
    grothendieck:
      '<svg viewBox="0 0 24 24" aria-hidden="true">' +
      '<text x="12" y="18" text-anchor="middle" font-family="serif" font-size="18" font-style="italic" fill="currentColor">∂</text>' +
      '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="0.6" opacity="0.4"/>' +
      '</svg>',

    // Euler: a small graph (the Königsberg-bridges abstraction)
    euler:
      '<svg viewBox="0 0 24 24" aria-hidden="true">' +
      '<line x1="6"  y1="18" x2="12" y2="6"  stroke="currentColor" stroke-width="1.2"/>' +
      '<line x1="18" y1="18" x2="12" y2="6"  stroke="currentColor" stroke-width="1.2"/>' +
      '<line x1="6"  y1="18" x2="18" y2="18" stroke="currentColor" stroke-width="1.2"/>' +
      '<line x1="6"  y1="18" x2="18" y2="6"  stroke="currentColor" stroke-width="1.2" opacity="0.4"/>' +
      '<circle cx="12" cy="6" r="2" fill="currentColor"/>' +
      '<circle cx="6"  cy="18" r="2" fill="currentColor"/>' +
      '<circle cx="18" cy="18" r="2" fill="currentColor"/>' +
      '</svg>',

    // Galois: a cancel-sign through a quintic radical (no formula)
    galois:
      '<svg viewBox="0 0 24 24" aria-hidden="true">' +
      '<path d="M3 16 L7 12 L11 18 L21 4" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="miter"/>' +
      '<line x1="6" y1="20" x2="20" y2="4" stroke="currentColor" stroke-width="1.6" opacity="0.7"/>' +
      '</svg>',

    // Newton: an inverse-square apple-and-arc
    newton:
      '<svg viewBox="0 0 24 24" aria-hidden="true">' +
      '<circle cx="7" cy="7" r="2.5" fill="currentColor"/>' +
      '<line x1="7" y1="9.5" x2="7" y2="20" stroke="currentColor" stroke-width="0.8" stroke-dasharray="1.5 1.5"/>' +
      '<path d="M3 20 Q12 12 21 20" fill="none" stroke="currentColor" stroke-width="1.2"/>' +
      '</svg>',

    // Leibniz: integral sign
    leibniz:
      '<svg viewBox="0 0 24 24" aria-hidden="true">' +
      '<text x="12" y="20" text-anchor="middle" font-family="serif" font-size="22" font-style="italic" fill="currentColor">∫</text>' +
      '</svg>',

    // Gauss: the constructible 17-gon (heptadecagon outline)
    gauss:
      '<svg viewBox="0 0 24 24" aria-hidden="true">' +
      '<g transform="translate(12 12)" fill="none" stroke="currentColor" stroke-width="1">' +
      '<polygon points="0,-9.5 3.45,-8.85 6.4,-7 8.55,-4.2 9.5,-0.85 9.13,2.55 7.55,5.6 4.95,7.95 1.65,9.35 -1.65,9.35 -4.95,7.95 -7.55,5.6 -9.13,2.55 -9.5,-0.85 -8.55,-4.2 -6.4,-7 -3.45,-8.85"/>' +
      '</g>' +
      '</svg>',

    // Hilbert: 23 dots (representing the 23 problems)
    hilbert:
      '<svg viewBox="0 0 24 24" aria-hidden="true">' +
      // grid of small filled dots
      '<g fill="currentColor">' +
        '<circle cx="4"  cy="6"  r="1.1"/><circle cx="8"  cy="6"  r="1.1"/><circle cx="12" cy="6"  r="1.1"/><circle cx="16" cy="6"  r="1.1"/><circle cx="20" cy="6"  r="1.1"/>' +
        '<circle cx="4"  cy="10" r="1.1"/><circle cx="8"  cy="10" r="1.1"/><circle cx="12" cy="10" r="1.1"/><circle cx="16" cy="10" r="1.1"/><circle cx="20" cy="10" r="1.1"/>' +
        '<circle cx="4"  cy="14" r="1.1"/><circle cx="8"  cy="14" r="1.1"/><circle cx="12" cy="14" r="1.1"/><circle cx="16" cy="14" r="1.1"/><circle cx="20" cy="14" r="1.1"/>' +
        '<circle cx="4"  cy="18" r="1.1"/><circle cx="8"  cy="18" r="1.1"/><circle cx="12" cy="18" r="1.1"/><circle cx="16" cy="18" r="1.1"/><circle cx="20" cy="18" r="1.1"/>' +
        '<circle cx="6"  cy="22" r="1.1"/><circle cx="10" cy="22" r="1.1"/><circle cx="14" cy="22" r="1.1"/>' +
      '</g>' +
      '</svg>',

    // Gödel: a Gödel sentence — "G" with a self-arrow ("This sentence …")
    godel:
      '<svg viewBox="0 0 24 24" aria-hidden="true">' +
      '<text x="6" y="18" font-family="serif" font-size="16" font-weight="600" fill="currentColor">G</text>' +
      '<path d="M16 12 Q22 12 22 17 Q22 22 17 22 Q14 22 14 19" fill="none" stroke="currentColor" stroke-width="1.1"/>' +
      '<polygon points="14,19 12,17 12,21" fill="currentColor"/>' +
      '</svg>',

    // Turing: tape with three cells and a head triangle
    turing:
      '<svg viewBox="0 0 24 24" aria-hidden="true">' +
      '<rect x="2"  y="10" width="6" height="6" fill="none" stroke="currentColor" stroke-width="1"/>' +
      '<rect x="9"  y="10" width="6" height="6" fill="currentColor" opacity="0.7"/>' +
      '<rect x="16" y="10" width="6" height="6" fill="none" stroke="currentColor" stroke-width="1"/>' +
      '<polygon points="12,5 9,9 15,9" fill="currentColor"/>' +
      '</svg>',

    // Noether: symmetry → conservation: a circle with a horizontal arrow
    'emmy-noether':
      '<svg viewBox="0 0 24 24" aria-hidden="true">' +
      '<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.2"/>' +
      '<line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="1.2" stroke-dasharray="3 2"/>' +
      '</svg>',

    // Perelman: a 3-sphere shrinking by Ricci flow (concentric circles)
    perelman:
      '<svg viewBox="0 0 24 24" aria-hidden="true">' +
      '<g fill="none" stroke="currentColor" stroke-width="1">' +
      '<circle cx="12" cy="12" r="10"/>' +
      '<circle cx="12" cy="12" r="7" opacity="0.7"/>' +
      '<circle cx="12" cy="12" r="4" opacity="0.5"/>' +
      '<circle cx="12" cy="12" r="1.6" fill="currentColor" opacity="0.85"/>' +
      '</g>' +
      '</svg>',

    // Wiles: an elliptic curve y² = x³ + ax + b (the Frey curve cartoon)
    wiles:
      '<svg viewBox="0 0 24 24" aria-hidden="true">' +
      '<path d="M3 18 Q6 4 12 12 Q18 20 21 8" fill="none" stroke="currentColor" stroke-width="1.4"/>' +
      '<line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="0.6" opacity="0.45"/>' +
      '</svg>',

    // Ramanujan: 1729 (the Hardy taxicab number)
    ramanujan:
      '<svg viewBox="0 0 24 24" aria-hidden="true">' +
      '<text x="12" y="16" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="9" font-weight="700" fill="currentColor">1729</text>' +
      '</svg>',

    // Mirzakhani: a punctured torus / moduli-space stylization
    mirzakhani:
      '<svg viewBox="0 0 24 24" aria-hidden="true">' +
      '<ellipse cx="12" cy="14" rx="10" ry="6" fill="none" stroke="currentColor" stroke-width="1.2"/>' +
      '<path d="M5 14 Q12 10 19 14" fill="none" stroke="currentColor" stroke-width="1.1"/>' +
      '<path d="M7 14.5 Q12 12.5 17 14.5" fill="none" stroke="currentColor" stroke-width="0.7" opacity="0.6"/>' +
      '</svg>',

    // Cardano: cube root with a tilted bar
    cardano:
      '<svg viewBox="0 0 24 24" aria-hidden="true">' +
      '<text x="3" y="20" font-family="serif" font-size="9" fill="currentColor">3</text>' +
      '<text x="9" y="20" font-family="serif" font-size="22" fill="currentColor">√</text>' +
      '<line x1="14" y1="6" x2="22" y2="6" stroke="currentColor" stroke-width="1.2"/>' +
      '</svg>'
  };

  window.MVHistoryIcons = {
    /** Return the inline SVG string for this person id, or null. */
    get(id){ return ICONS[id] || null; }
  };
})();
