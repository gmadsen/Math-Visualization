# Three.js prototype — WebGL mindmap

A standalone WebGL re-imagining of [`mindmap.html`](../../mindmap.html): the same
flat, force-directed concept graph and the same mental model, but rendered with
Three.js instead of SVG so it stays smooth and pretty at the full corpus size
(~1400 concept nodes + their prerequisite edges). Built as an evaluation piece
for the "WebGL-accelerated 2D" direction — *not* a 3D layout.

## What it does

- Reads the **real** concept graph from `../../concepts/bundle.js`
  (`window.__MVConcepts`) — every registered topic's concepts, their prereq
  edges, the section→color palette, and the capstone set. No hardcoded data.
- Lays the graph out with a **section-anchored, grid-accelerated force
  simulation** (spatial-hash repulsion + edge springs + a weak pull toward each
  section's anchor on a 13-spoke ring). The sim runs live for the first couple
  of seconds and cools to a stop; **Reseed** reheats it.
- Renders with an **orthographic camera** (so it reads as 2D) over a dark field:
  - **Nodes** as two GPU `Points` layers — a soft additive radial-gradient
    *glow* sprite plus a crisp *core* — colored per section, sized by degree
    (capstones bumped). One draw call each for all ~1400 nodes.
  - **Edges** as a single `LineSegments` buffer; cross-topic edges drawn a touch
    brighter than intra-topic ones.
- **Semantic zoom**: node screen-size is held constant in the vertex shader
  (`gl_PointSize` independent of camera zoom), so zooming spreads the clusters
  apart while the nodes stay readable — matching the fix applied to the SVG
  mindmap, rather than ballooning the markers.
- **Interaction**: eased pan (drag) + zoom-to-cursor (wheel); hover a node for a
  card (section · title · topic · link count); click a node to **focus its
  neighborhood** (everything else dims); *Reset view* re-centers and clears focus.

## How to view

Double-click `index.html` **from inside the repo** (its relative path to
`../../concepts/bundle.js` must resolve), or serve the repo root and open
`/examples/threejs-mindmap/`. It loads Three.js r164 from unpkg (CDN, ~600 KB,
cached after first load) and runs with no build step. Requires an internet
connection on first load for the CDN.

## Why WebGL here

The SVG mindmap puts every node + label + edge in the live DOM and leans on a
`localStorage`-cached force layout plus a per-frame label-decimation pass to stay
usable at ~1400 nodes — it works, but pan/zoom is the DOM's job and dense zoom-ins
get heavy. WebGL collapses all ~1400 nodes into two draw calls and all edges into
one, so pan/zoom/focus stay at 60 fps with room to spare, and additive glow
sprites give a "galaxy" register the flat SVG can't. The trade-offs are the usual
ones (see [`../threejs-prototype/README.md`](../threejs-prototype/README.md)):
~600 KB of CDN JS vs. 0 KB today, a glossier look that departs from the
notebook's chalkboard-SVG aesthetic, and WebGL text being awkward — this
prototype sidesteps labels entirely with an HTML hover/focus card rather than
porting the SVG version's screen-space label culler.

## Not integrated / next steps

Deliberately standalone, like the tangent-bundle prototype. If this direction is
adopted, obvious follow-ups: a screen-space label layer for the focused
neighborhood (the one feature `mindmap.html` has that this omits), the SVG
version's filters (section / level / mastery) and "suspected gaps" panel, a real
`UnrealBloomPass` instead of the cheap glow sprite, and self-hosting Three.js so
it works fully offline (`file://` without a network).
