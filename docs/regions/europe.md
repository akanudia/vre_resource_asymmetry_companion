# Europe

!!! abstract "Sources & provenance"
    **Manuscript:** Results § (Fig 5 hero scatter, Fig 6 world-vs-regional),
    Extended Data Figs 2–4 (signed structural–parametric angle), Extended
    Data Table 1 (region composition). Methods § Physical diagnostics
    (resource and demand variance decomposition, alignment landscape).  
    **External data:** [ERA5 reanalysis](../data_sources.md#era5),
    [Atlite library](../data_sources.md#atlite),
    [REZoning](../data_sources.md#rezoning),
    [IPCC AR6 WGIII Scenarios Database](../data_sources.md#ar6) (for the
    parametric envelope behind the regional shifts).  
    **Companion-only:** the Europe physical-setting prose, the
    paired-shifts mini-hero plot computed at Europe aggregate,
    the regional signed structural–parametric angle figure and the
    "cells where Europe departs from world" table extend the
    manuscript figures with reader-friendly framings; no quantitative
    claims appear here that are not derivable from the manuscript and
    the released CSVs.

R10 macro-region covering the EU, UK, EFTA, and non-EU South-Eastern Europe.
See Extended Data Table 1 in the manuscript for the exact composition.

## Physical setting

Europe is the canonical heating-driven temperate region and sits **firmly
in the upper-left quadrant of the Fig 4b alignment landscape**:

- **Demand**: heating-dominated; seasonal share runs from ~30% in
  Mediterranean members to ~52–54% in Scandinavia (Norway, Finland, Sweden
  all in the 52%+ band). Winter heating peaks dominate.
- **Wind**: positive seasonal alignment with demand. Winter Atlantic
  storm-track wind drives the temperate climate's wind season; this
  coincides with the winter heating-demand peak across the macro-region.
- **Solar**: weakly negative alignment with demand. Summer solar peaks
  during the heating-off-season; in the Nordic countries the seasonal share
  of solar variance reaches ~22% (the highest in the global dataset), and
  is essentially anti-aligned with winter heating demand.
- **Wind resource**: moderate magnitude, modest within-country
  heterogeneity. Onshore wind cherry-picking uplift sits at the lower end
  of the 1.3–3.5× global range for most member countries. Offshore wind in
  the North Sea is a significant resource.

This puts Europe at the centre of the "temporal channel favours wind" story.

## Paired structural shifts (Europe)

[![Europe — paired structural shifts vs world anchor](../assets/figures/regions/europe/paired_shifts_mini_hero.png){ loading=lazy }](../assets/figures/regions/europe/paired_shifts_mini_hero.png)

/// caption
**Europe paired structural shifts.** Same layout as the manuscript hero
figure but computed at Europe aggregate. Expressed as % of C7-Base-median
anchor. [Download PDF](../assets/figures/regions/europe/paired_shifts_mini_hero.pdf).
///

**Reading.** The temporal-channel solar row is unmistakably negative — the
cloud sits *below* $y=0$ across most parametric scenarios. Finer timeslices
expose the summer-solar-vs-winter-demand mismatch, and the optimiser shifts
generation share away from solar. The temporal wind row shows the mirror
image: positive at C7, with winter storm-track wind taking the share.

*Electricity-price row.* The electricity-price row follows the world pattern closely (no cells exceed the 20° departure threshold) — supply-curve refinement lowers prices, temporal refinement raises them.

## Signed structural–parametric angle (Europe)

[![Europe — signed structural–parametric angle](../assets/figures/regions/europe/magnitude_angle.png){ loading=lazy }](../assets/figures/regions/europe/magnitude_angle.png)

/// caption
**Europe signed structural–parametric angle.** Per (outcome × climate × channel)
cell, $\theta = \mathrm{atan2}(\text{structural shift}, |\text{parametric shift}|)$
in degrees. Median (dot) ± p25–p75 (whiskers).
[Download PDF](../assets/figures/regions/europe/magnitude_angle.pdf).
///

**Reading.**

- **Temporal Solar across C1, C2, C3** all sit at $-30°$ to $-52°$ —
  Europe is the strongest negative-$\theta$ signal of any region on solar
  under temporal refinement. Heating-driven seasonal anti-alignment with
  cooling-summer solar peaks is the physical mechanism.
- **Supply Solar across all climates** is also negative ($-42°$ to $-48°$
  at C7, C1, C2): coarse supply curves overstate solar's cost-effectiveness
  by averaging across heterogeneous Nordic-vs-Mediterranean grades, so
  refinement reallocates share to wind.
- **Temporal Wind C7 at +23°** is the canonical wind-favouring reading
  under fossil-dominant policy — the temporal channel gives wind the credit
  it earns from winter-aligned demand.

## Cells where Europe departs from world

| Channel | Outcome | Climate | World θ | Europe θ | Departure |
|---|---|---|---:|---:|---:|
| Temporal | Solar | C1 | +19° | -55° | **-73°** |
| Temporal | Solar | C2 | +13° | -53° | **-67°** |
| Temporal | Solar | C3 | +17° | -30° | **-47°** |
| Temporal | Cost | C4 | +54° | +12° | **-43°** |
| Supply | Solar | C7 | -6° | -46° | **-40°** |
| Supply | Solar | C2 | -9° | -44° | **-36°** |
| Temporal | Wind | C7 | -9° | +25° | **+34°** |
| Supply | Solar | C1 | -8° | -41° | **-33°** |
| Temporal | Solar | C4 | -5° | -36° | **-31°** |

The headline departure is **Temporal Solar C1 at −74°**: Europe is at −55°
while world is at +19°. This single cell encapsulates the resource-asymmetry
finding for the heating-driven temperate group: under the strictest climate
ambition, finer timeslicing recognises that European solar's peak-output
season has minimal demand value, and reallocates generation share toward
wind. The same signal washes out at world aggregate because cooling-driven
regions (Middle East, India, Rest of Asia) show the opposite sign and
cancel Europe's contribution.

## CSV download

- [magnitude_angle_europe_supply.csv](../assets/data/regions/europe/magnitude_angle_europe_supply.csv)
- [magnitude_angle_europe_temporal.csv](../assets/data/regions/europe/magnitude_angle_europe_temporal.csv)

## See also

- [World aggregate](../world.md) — where Europe's cells sit in the regional bracket
- [Gallery](gallery.md) — all 10 R10 regions' figures side by side
- [Reforming Economies](ref_econ.md) — adjacent heating-driven macro-region
- [Methodology](../methodology.md) — for the θ definition
