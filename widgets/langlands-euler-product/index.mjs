// langlands-euler-product widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The point-counting and Euler-factor assembly are
// intrinsic to the renderScript; params carry only the curve presets
// (validated against ./schema.json).

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint, curves } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  const options = curves
    .map((c, i) => `      <option value="${escapeHtml(c.id)}"${i === 0 ? ' selected' : ''}>${escapeHtml(c.label)}</option>`)
    .join('\n');
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-sel">curve $E$</label>\n` +
    `    <select id="${widgetId}-sel">\n${options}\n    </select>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 580 220" width="580" height="220" role="img" aria-label="Euler factors of the chosen elliptic curve at the first good primes"><title>Local Euler factors a_p assembling the L-function</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, curves } = params;
  const maxP = params.maxPrimes || 7;
  const data = JSON.stringify(curves);
  return (
    `<script>\n` +
    `/* langlands-euler-product widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var CURVES = ${data}, MAXP = ${maxP};\n` +
    `  var byId = {}; CURVES.forEach(function(c){ byId[c.id] = c; });\n` +
    `  var sel = document.getElementById('${widgetId}-sel');\n` +
    `  var svg = document.getElementById('${widgetId}-svg');\n` +
    `  var out = document.getElementById('${widgetId}-out');\n` +
    `  if(!sel || !svg || !out) return;\n` +
    `  var NS = 'http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e = document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent = text; return e; }\n` +
    `  function isPrime(n){ if(n<2) return false; for(var d=2; d*d<=n; d++){ if(n%d===0) return false; } return true; }\n` +
    `  function modpow(base, exp, m){ var r=1; base=((base%m)+m)%m; while(exp>0){ if(exp&1) r=(r*base)%m; base=(base*base)%m; exp=Math.floor(exp/2); } return r; }\n` +
    `  function legendre(n, p){ n=((n%p)+p)%p; if(n===0) return 0; var r=modpow(n,(p-1)/2,p); return r===1 ? 1 : -1; }\n` +
    `  function apOf(a, b, p){ var s=0; for(var x=0;x<p;x++){ var f=(((x*x%p)*x%p) + a*x + b); f=((f%p)+p)%p; s += legendre(f,p); } return -s; }\n` +
    `  function poly(ap, p){ var mid = ap===0 ? '' : (ap<0 ? ' + '+(-ap) : ' \\u2212 '+ap) + 'T'; return '1' + mid + ' + ' + p + 'T\\u00b2'; }\n` +
    `  function draw(){\n` +
    `    var c = byId[sel.value] || CURVES[0];\n` +
    `    var disc4 = 4*c.a*c.a*c.a + 27*c.b*c.b;\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    // collect good primes p >= 5 with p does not divide disc4\n` +
    `    var primes = [], n = 5;\n` +
    `    while(primes.length < MAXP && n < 200){ if(isPrime(n) && disc4 % n !== 0) primes.push(n); n++; }\n` +
    `    var top = 22, rowH = Math.min(22, (220 - top - 6)/(primes.length + 1));\n` +
    `    var cols = [40, 120, 230, 360]; // p, a_p, #E(F_p), local factor 1 - a_p T + p T^2\n` +
    `    var heads = ['p', 'a_p', '#E(\\ud835\\udd3d_p)', '1 \\u2212 a_p T + p T\\u00b2   (T = p\\u207b\\u02e2)'];\n` +
    `    for(var h=0; h<cols.length; h++){ svg.appendChild(mk('text', {x:cols[h], y:14, 'text-anchor':'start', 'font-size':10.5, 'font-weight':'600', fill:'var(--mute)'}, heads[h])); }\n` +
    `    for(var i=0;i<primes.length;i++){\n` +
    `      var p = primes[i], ap = apOf(c.a, c.b, p), nE = p + 1 - ap, y = top + (i+1)*rowH;\n` +
    `      svg.appendChild(mk('text', {x:cols[0], y:y, 'text-anchor':'start', 'font-size':12, fill:'var(--ink)'}, String(p)));\n` +
    `      svg.appendChild(mk('text', {x:cols[1], y:y, 'text-anchor':'start', 'font-size':12, 'font-weight':'600', fill:'var(--yellow)'}, (ap>=0?'+':'') + ap));\n` +
    `      svg.appendChild(mk('text', {x:cols[2], y:y, 'text-anchor':'start', 'font-size':12, fill:'var(--mute)'}, String(nE)));\n` +
    `      svg.appendChild(mk('text', {x:cols[3], y:y, 'text-anchor':'start', 'font-size':11.5, fill:'var(--cyan)'}, poly(ap, p)));\n` +
    `    }\n` +
    `    var lines = [];\n` +
    `    lines.push('a_p = p + 1 \\u2212 #E(\\ud835\\udd3d_p)  is BOTH the Hecke eigenvalue of the weight-2 form (automorphic side)');\n` +
    `    lines.push('and the trace of Frobenius tr \\u03c1_E(Frob_p) (Galois side): the local factor is identical.');\n` +
    `    lines.push('L(E,s) = \\u220f_p (1 \\u2212 a_p p\\u207b\\u02e2 + p\\u00b9\\u207b\\u00b2\\u02e2)\\u207b\\u00b9  =  \\u220f_p det(1 \\u2212 \\u03c1_E(Frob_p) p\\u207b\\u02e2)\\u207b\\u00b9');\n` +
    `    lines.push('Frobenius characteristic polynomial: x\\u00b2 \\u2212 a_p x + p   (eigenvalues of absolute value \\u221ap).');\n` +
    `    lines.push('');\n` +
    `    lines.push('The equality of these Euler products IS the bridge; strong multiplicity one (Jacquet\\u2013Shalika) makes L a complete invariant, and a functional equation pins it down \\u2014 here \\u039b(s) = \\u00b1\\u039b(2\\u2212s) in the motivic normalization (centred at s = 1), the recentred form of \\u00a72\\u2019s unitary \\u039b(s) = \\u03b5\\u039b(1\\u2212s).');\n` +
    `    out.textContent = lines.join('\\n');\n` +
    `  }\n` +
    `  sel.addEventListener('change', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
