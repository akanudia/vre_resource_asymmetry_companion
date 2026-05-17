# World aggregate

This page reads the two world-level figures: the paired-shifts hero scatter
(Fig 5 in the manuscript) and the signed structural dominance angle with
regional spread bracket (ED Fig 2). Both are computed at world aggregate from
the 1,080-run controlled factorial described on the [Methodology](methodology.md)
page.

## Paired structural shifts at world aggregate

[![Paired structural shifts at world aggregate](assets/figures/world/hero.png){ loading=lazy }](assets/figures/world/hero.png)

/// caption
**Fig 5 (manuscript).** Four outcomes × two channels: system cost, CO2
emissions, cumulative solar, cumulative wind, expressed as % of the
C7-Base-median anchor. Left column: supply-curve LoT→HiT pairs (540 pairs at
world aggregate). Right column: temporal TS04→TS72 pairs (180 pairs). Solid
lines at $x=0$ / $y=0$; dashed line at $y=\pm x$; light wedge where
$|y| > |x|$. R10 circles, R70 triangles. Colour codes the climate ambition
category (C1 ... C7). [Download PDF](assets/figures/world/hero.pdf).
///

**Reading.** Points sitting above $y = x$ (or below $y = -x$) are
structurally dominated: the structural-axis shift exceeds the parametric
distance from the anchor in magnitude. The supply channel (left column)
shows positive-y dominance for wind across most climates and large clusters
along the $y = +x$ diagonal at deep-decarbonisation scenarios — the
saturation regime, where both LoT and HiT configurations have hit the
regional supply ceiling. The temporal channel (right column) shows a tighter
parametric envelope and a clearer cost-up signature.

## Signed structural dominance, world median + regional spread

[![Signed structural dominance angle, world vs regional spread](assets/figures/world/ed_fig2_magnitude_angle.png){ loading=lazy }](assets/figures/world/ed_fig2_magnitude_angle.png)

/// caption
**ED Fig 2 (manuscript).** Per (outcome × climate × channel) cell, the
signed angle $\theta = \mathrm{atan2}(\text{structural shift}, |\text{parametric shift}|)$
in degrees on $[-90^\circ, +90^\circ]$. World median (filled dot) overlaid
with a vertical bracket showing the spread of within-cell medians across the
10 R10 regions: thick band = inter-region p25–p75; thin line = full range.
Anchor scenarios (C7-Base-median, $x=0$) excluded by construction.
[Download PDF](assets/figures/world/ed_fig2_magnitude_angle.pdf).
///

**Reading at world aggregate.** Headline cells:

| Cell | World θ | Regional range | Reading |
|---|---:|---|---|
| Wind C7 supply | +71° | −30° to +90° | saturation; 7 of 10 regions at +88°+ |
| Solar C7 supply | **−5°** | **−74° to +74°** | **the cancellation poster cell** |
| Solar C7 temporal | −66° | −85° to +21° | strong directional consensus; world reads the central tendency |
| Cost C7 supply | +31° | −45° to +59° | sign disagreement across regions |
| Cost C7 temporal | +50° | +2° to +64° | uniformly positive across all 10 regions |
| Emissions C7 supply | −52° | −61° to −12° | tight bracket; world at the strong end |

## What the regional spread tells you

The width of the regional bracket in each cell is the diagnostic for the
**channel-asymmetric global aggregation** finding:

- The **supply channel** produces structural shifts whose sign is consistent
  across regions for most outcomes. Brackets are tight; the world median sits
  near the middle of the regional distribution; the world figure
  faithfully represents the regional signature.
- The **temporal channel** is mixed: some cells (Cost C7 temporal, all 10
  regions positive) have tight brackets; others (Solar C7 supply being the
  poster child) have brackets that span most of the $[-90^\circ, +90^\circ]$
  range. When the bracket is wide and centred near $\theta = 0$, the
  regional signals are cancelling at world aggregate — the regional bias is
  real but invisible at the headline.

The implication is that **regional-scale validation matters even when the
world-scale story looks unremarkable**. A reader who sees Solar C7 supply
sitting at world θ ≈ −5° might conclude "no structural effect". The
−74° to +74° regional range tells the opposite story: every region has a
large structural shift, but their signs cancel at world aggregate.

## See also

- [Regional gallery](regions/gallery.md) — all 10 R10 regions' figures side by side
- [India worked example](regions/india.md) — full prose reading of one region
- [Methodology](methodology.md) — for the experimental design and the θ definition
