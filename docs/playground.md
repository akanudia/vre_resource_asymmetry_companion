# Playground

An interactive view over the **full 11,880-pair scenario archive** that
backs the manuscript's hero figure (Fig 5) and every regional cousin. The
same 4 × 2 panel grid is rebuilt in your browser as you change the
filters.

<div class="playground-launch" markdown>

[**:material-launch: &nbsp; Launch playground**](assets/interactive/playground/index.html){target=_blank .md-button .md-button--primary}

Opens in a new tab. Best viewed on a landscape screen (desktop /
laptop). Mobile works but the controls panel takes most of the screen.

</div>

## What you can do

**Pick a region.** World aggregate or any of the 10 R10 macro-regions.
The plot rebuilds against that region's pairs.

**Recolour the cloud.** The default colour encoding is climate ambition
(C1 → C7, the manuscript convention). Drop the **Colour by** combo to
recolour by technology cost, fuel price, TS resolution, supply curve, or
regional aggregation (R10 / R70).

**Change the marker shape.** Independently of colour. Default is
*Regional aggregation* (circle = R10, triangle = R70 — the manuscript
convention), but the shape encoding can be swapped to any categorical
axis or turned off entirely.

**Filter by any scenario axis.** Chip-style checkboxes for each of the
six axes: Climate, Tech cost, Fuel price, TS resolution, Supply curve,
Regional aggregation. **Click the axis label** to toggle all chips on or
off in one motion. A paired-shift point only renders when *both legs*
of its comparison are present in the filter — so unchecking either
*LoT* or *HiT* empties the supply column entirely; unchecking either
*TS04* or *TS72* empties the temporal row.

**Switch the scale.** Two modes:

- **Paper-matched.** Per-outcome column scaling. Wind and Solar columns
  share the x-axis range (they're both generation outcomes; comparable
  cherry-picking magnitudes). Cost and Emissions columns each get their
  own range. Within each outcome column, supply and temporal panels
  share x and y so the saturation-diagonal geometry is consistent. This
  is the scaling used in the static print figure.
- **Per-panel autoscale.** Every one of the eight panels picks its own
  range from its own filtered points. Best when filters have culled
  the cloud heavily and you want to see what's left at full resolution.

## How to read each panel

A point at coordinates $(x, y)$ means:

- $x$ = parametric % shift of the LO leg vs the C7-Base-median anchor
- $y$ = structural % shift LO → HI, on the same denominator

Both axes share that base-value denominator, so $x + y$ is the total
deviation of the HI configuration from the base case. Points sitting in
the **dashed wedge** ($|y| \le |x|$) are *parametrically dominant* — the
parametric distance from base exceeds the structural shift. Points
*outside* the wedge are *structurally dominant* — the structural axis
(supply-curve refinement or temporal-resolution refinement) is the
larger lever.

The print figure ([world](world.md), [regional pages](regions/)) shows
this geometry; the playground lets you slice into it any way you want.
