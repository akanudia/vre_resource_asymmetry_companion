# World aggregate

!!! abstract "Sources & provenance"
    **Manuscript:** Results § (Fig 5 hero, Fig 6 world-vs-regional),
    Extended Data Figs 2–5 (signed structural–parametric angle, regional
    decompositions, saturation), Methods § Paired-shift diagnostics
    (rivals thresholds 30 %, 16 %).  
    **External data:** none directly on this page; the AR6 plausibility
    benchmark for the same model archive lives on the
    [Methodology page](methodology.md).  
    **Companion-only:** the cell-by-cell θ readings, the regional-bracket
    interpretation, the rival-headline table and the embedded
    dominance-heatmap reading prose extend the manuscript figures with
    reader-friendly framings; no quantitative claims appear here that
    are not derivable from the manuscript figures and the released
    CSVs.

This page reads the four world-level figures from the manuscript: the
paired-shifts hero scatter (Fig 5), the world-vs-regional structural-shift
diagnostic (Fig 6), the signed structural–parametric angle with saturation
sweep and non-VRE capacity factor (ED Fig 2) and the climate-stratified
saturation diagnostic (ED Fig 3). All four are computed from the 1,080-run
controlled factorial described on the [Methodology](methodology.md) page.

## Paired structural shifts at world aggregate

[![Paired structural shifts at world aggregate](assets/figures/world/hero.png){ loading=lazy }](assets/figures/world/hero.png)

/// caption
**Fig 5 (manuscript).** Five outcomes × two channels: cumulative wind
generation, cumulative solar generation, average electricity price,
cumulative system cost (NPV) and cumulative CO$_2$ emissions, expressed as
% of the C7-Base-median anchor. Left column: supply-curve LoT→HiT pairs
(540 pairs at world aggregate). Right column: temporal TS04→TS72 pairs
(180 pairs). Solid lines at $x=0$ / $y=0$; dashed line at $y=\pm x$; light
wedge where $|y| > |x|$. R10 circles, R70 triangles. Colour codes the
climate ambition category (C1 ... C7).
[Download PDF](assets/figures/world/hero.pdf).
///

For an interactive view that lets you filter on every scenario dimension and
recolour the cloud by climate, cost, price, TS resolution, supply curve, or
regional aggregation, open the **[Playground](../playground/)**.

**Reading.** Points sitting above $y = x$ (or below $y = -x$) exhibit
strict structural dominance: the structural-axis shift exceeds the
parametric distance from the anchor in magnitude ($|S| > |P|$, equivalently
$|\theta| > 45^\circ$). Points beyond the $|y| \ge 0.5\,|x|$ band satisfy
the structural-rival threshold ($|S| \ge 0.5\,|P|$, $|\theta| \ge 26.6^\circ$);
this is the headline rivals convention used in the manuscript and
discussed on the [Methodology](methodology.md) page.
The supply channel (left column)
produces a persistent windward shift, lowers electricity prices, and reduces
emissions across nearly every scenario. Solar generation falls modestly
because it loses to wind, not because the solar resource deteriorates.
The temporal channel (right column) raises electricity prices and system
cost coherently; its wind–solar response is regime-dependent and partly
cancels across regions at the world aggregate.

## Regional coherence and cancellation

[![Regional coherence and cancellation of structural shifts](assets/figures/world/world_vs_regional.png){ loading=lazy }](assets/figures/world/world_vs_regional.png)

/// caption
**Fig 6 (manuscript).** For each outcome × channel cell, the within-cell
structural-shift distribution is shown as a horizontal bracket per
modelling entity: **World** on the top row, followed by the 10 R10
macro-regions. Filled dot = median, thick segment = p25–p75, thin capped
line = p5–p95. Pooled across all 45 parametric scenarios.
[Download PDF](assets/figures/world/world_vs_regional.pdf).
///

**Reading.** The figure makes the **channel-asymmetric global aggregation**
finding visible cell by cell. Where regional medians stack on the same side
of zero, the world aggregate inherits the regional direction (cost-channel
shifts on wind generation and emissions; both channels on electricity price
and system cost). Where regional medians span both sides of zero with the
world bracket sitting near zero, the world aggregate masks the underlying
regional shifts — the **value-channel shift on the wind–solar balance** is
the canonical case: heating-driven and cooling-driven regions push in
opposite directions and cancel at the global aggregate even when individual
regional shifts are large. Electricity price is the outcome where both
channels propagate coherently with opposite signs (down on supply, up on
temporal), making it the cleanest single-cell test of the channel
asymmetry.

## Signed structural–parametric angle + saturation sweep

[![Signed structural–parametric angle, world median + regional spread, with saturation sweep](assets/figures/world/ed_fig2_magnitude_angle.png){ loading=lazy }](assets/figures/world/ed_fig2_magnitude_angle.png)

/// caption
**ED Fig 2 (manuscript).** Signed structural–parametric angle at world
aggregate, across six outcomes (cumulative wind, solar, average electricity
price, **non-VRE capacity factor**, cumulative system cost, cumulative
CO$_2$ emissions). For each (outcome × channel × fine-endpoint) cell, the
signed angle
$\theta = \mathrm{atan2}(\text{structural shift}, |\text{parametric shift}|)$
in degrees on $[-90^\circ, +90^\circ]$. The temporal channel is shown
across its full **saturation sweep**: TS04 is held as the coarse baseline
and TS12, TS24, TS36, TS48, TS72 are compared against it in turn (colour
gradient). World median (filled dot); vertical bracket = spread of regional
medians across the 10 R10 regions (thick = p25–p75; thin = full range).
The non-VRE capacity-factor row tracks utilisation of generation capacity
that is neither wind, solar, nor storage. Anchor scenarios (C7-Base-median,
$x=0$) excluded by construction.
[Download PDF](assets/figures/world/ed_fig2_magnitude_angle.pdf).
///

**Why non-VRE CF matters.** The non-VRE capacity-factor row explains the
*regime-dependent* system-cost response visible in Fig. 5: better
supply-curve detail lowers per-unit generation cost and electricity prices
(easier renewable supply), while the additional VRE deployment lowers
utilisation of the non-VRE fleet and raises its per-unit cost. These two
effects oppose on system cost — which is why the supply-channel cost
direction is *mixed* across climate regimes rather than uniformly negative.

**Reading at world aggregate.** Headline cells (refreshed against the 2030--2050 horizon outputs):

| Cell | World θ | Regional range | Reading |
|---|---:|---|---|
| Wind C7 supply | +69° | −31° to +90° | saturation; the upper-end regions are pinned at +90° |
| Solar C7 supply | **−6°** | **−68° to +74°** | **the cancellation poster cell** — world median sits near zero while regional medians span the full sign range |
| Solar C7 temporal | −65° | −86° to +24° | strong directional consensus; world reads the central tendency |
| Price C7 supply | −30° | −68° to −7° | uniformly negative across all 10 regions (consumer-facing cost-channel signal) |
| Price C7 temporal | +55° | +19° to +67° | uniformly positive across all 10 regions (consumer-facing integration cost) |
| Cost C7 supply | +28° | −43° to +57° | sign disagreement across regions |
| Cost C7 temporal | +55° | +1° to +73° | almost all regions positive |
| Emissions C7 supply | −51° | −59° to −12° | tight bracket; world at the strong end |
| Emissions C7 temporal | +39° | −4° to +69° | predominantly positive across regions |
| Non-VRE CF C7 supply | −57° | −68° to −19° | uniform regional consensus on lower utilisation |
| Non-VRE CF C7 temporal | −72° | −88° to −47° | the strongest dominance signal in the figure |

### The rivals headline — how often is structural ≥ parametric?

The headline numbers from Methods §3.7 of the manuscript, recomputed
against R10 regional paired outcome comparisons under mitigation regimes
(C1–C4) across the six outcomes:

| Threshold | $|θ|$ ≥ | $|S|$ ≥ | Share of cells | Reading |
|---|---:|---:|---:|---|
| Rival quarter | 14.0° | 0.25 $|P|$ | **50 %** | structural reaches a quarter of parametric |
| **Rival half (headline)** | **26.6°** | **0.5 $|P|$** | **30 %** | **headline rivals threshold** |
| Rival three-quarter | 36.9° | 0.75 $|P|$ | **21 %** | structural reaches three-quarters of parametric |
| **Strict dominance** | **45.0°** | $|P|$ | **16 %** | **structural exceeds parametric outright** |

Across 30,348 paired comparisons (= 10 R10 regions × 6 outcomes × 2
channels × 36 C1–C4 scenarios × 6/2 paired-axis multiplicity),
representation-induced shifts rival the parametric channel in **30 %** of
cells and strictly dominate it in **16 %**. The result is not confined
to outliers: structural representation choices frequently enter the same
magnitude range as scenario assumptions.

The full per-outcome × climate × channel distribution at world aggregate
is released as
[Extended Data Table 2 in the manuscript](https://akanudia.github.io/vre_info_asymmetry/)
and as the
[ed_table_structural_distribution.csv](https://akanudia.github.io/vre_info_asymmetry/figures/ed_table_structural_distribution.csv)
data file (60 rows × 11 columns).

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
  range. When the 