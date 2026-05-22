# North America

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
    **Companion-only:** the North America physical-setting prose, the
    paired-shifts mini-hero plot computed at North America aggregate,
    the regional signed structural–parametric angle figure and the
    "cells where North America departs from world" table extend the
    manuscript figures with reader-friendly framings; no quantitative
    claims appear here that are not derivable from the manuscript and
    the released CSVs.

R10 macro-region covering the USA, Canada, and (per IPCC AR6 WGIII
convention) Mexico. The R70 model treats USA and Canada individually
(both very large countries with ~130 cluster cells each in the
variance-decomposition setup); Mexico's exact aggregation depends on the
R10 definition used — see Extended Data Table 1 in the manuscript for the
exact composition.

## Physical setting

North America combines climate signatures from low temperate to Arctic:

- **USA**: mixed heating/cooling by region. Northeast and Upper Midwest are
  heating-dominated; the South and Southwest are cooling-dominated;
  California spans both. Aggregate USA demand has modest seasonal share
  with both winter and summer peaks.
- **Canada**: strongly heating-driven, with northern provinces approaching
  Scandinavian seasonal patterns.
- **Mexico**: subtropical cooling-driven (similar to the Latin America
  macro-region in seasonal signature).
- **Wind resource heterogeneity is the largest of any country in the
  dataset**: the USA spans the Great Plains wind corridor (Texas, Oklahoma,
  Iowa, Kansas) with onshore CFs in the 35–45% range, alongside low-wind
  Southeast cells with CFs near 15%. Cherry-picking uplift sits near the
  upper end of the 1.3–3.5× global range for onshore wind.
- **Solar resource**: also heterogeneous, with the Southwest deserts in
  the top decile globally and the Pacific Northwest near the bottom.
- **Wind–demand seasonal alignment**: positive in the heating-driven
  northern interior; weakly negative in the cooling-driven South. Aggregate:
  weakly positive.

## Paired structural shifts (North America)

[![North America — paired structural shifts vs world anchor](../assets/figures/regions/north_am/paired_shifts_mini_hero.png){ loading=lazy }](../assets/figures/regions/north_am/paired_shifts_mini_hero.png)

/// caption
**North America paired structural shifts.** Same layout as the manuscript
hero figure. [Download PDF](../assets/figures/regions/north_am/paired_shifts_mini_hero.pdf).
///

**Reading.** The supply-channel cost row has clusters *below* $y=0$ across
intermediate climate ambitions — supply refinement makes the North American
system cheaper. The Great Plains wind corridor is the principal driver:
LoT averages it with low-CF cells, HiT exposes the cheap-wind tail.

*Electricity-price row.* The electricity-price row tracks the system-cost channel signatures — supply-curve refinement drives prices down more aggressively than at world aggregate at C7 (Δθ −35°), and temporal refinement raises them more at low-ambition C2 (Δθ +20°). USA Great Plains wind heterogeneity is the dominant driver of the supply-channel signal.

## Signed structural–parametric angle (North America)

[![North America — signed structural–parametric angle](../assets/figures/regions/north_am/magnitude_angle.png){ loading=lazy }](../assets/figures/regions/north_am/magnitude_angle.png)

/// caption
**North America signed structural–parametric angle.**
[Download PDF](../assets/figures/regions/north_am/magnitude_angle.pdf).
///

**Reading.**

- **Supply Cost C4 at −46°** vs world +6°: cost goes down strongly under
  supply refinement at C4 in North America. Texas-Oklahoma wind plus
  Southwest solar dominate the high-quality tail of both resources.
- **Supply Solar C7 at −48°** vs world −6°: under fossil-dominant policy,
  supply refinement reallocates share away from solar (toward cheap wind
  from the Plains and toward fossils with cheap fuel prices).
- **Supply Cost C7 at +2°** vs world +28°: cost barely shifts in North
  America under fossil-dominant policy, well below world. The world story
  at C7 supply is "cost goes up because finer supply curves favour wind
  which is more expensive than fossil at q25"; in North America the cheap
  Plains wind almost neutralises the supply-channel cost effect.
- **Supply Wind C4 at +10°** vs world +30°: wind-favouring shift under
  intermediate climate ambition is muted in North America relative to
  world. Texas–Oklahoma wind is already mostly visible at LoT, so finer
  supply curves add less marginal headroom here than in regions with
  bigger LoT–HiT gaps.

## Cells where North America departs from world

| Channel | Outcome | Climate | World θ | North Am. θ | Departure |
|---|---|---|---:|---:|---:|
| Supply | Cost | C4 | +6° | -46° | **-52°** |
| Supply | Cost | C2 | -6° | -53° | **-46°** |
| Temporal | Cost | C2 | +22° | +66° | **+44°** |
| Supply | Solar | C7 | -6° | -48° | **-42°** |
| Temporal | Solar | C2 | +13° | -25° | **-39°** |
| Supply | Price | C7 | -30° | -68° | **-38°** |
| Temporal | Price | C2 | +19° | +53° | **+34°** |
| Supply | Cost | C7 | +28° | +2° | **-26°** |
| Temporal | Wind | C2 | +1° | +27° | **+26°** |
| Temporal | Non-VRE CF | C7 | -72° | -47° | **+25°** |
| Temporal | Solar | C3 | +17° | -8° | **-25°** |
| Temporal | Solar | C1 | +19° | -5° | **-24°** |
| Supply | Solar | C4 | -33° | -10° | **+23°** |
| Temporal | Solar | C4 | -5° | -27° | **-22°** |
| Supply | Wind | C4 | +30° | +10° | **-21°** |

The headline reading: **North America is the "supply channel makes
everything cheaper" region**. Every climate ambition shows negative cost
departures under supply refinement. The USA Great Plains wind corridor is
unmatched in its combination of high CF and large installable potential
within a single country — once supply refinement exposes that tail, the
system rebuilds around it at significantly lower total cost. The companion
reading is the corresponding solar negative — wind eats solar's share
under supply refinement in North America.

## CSV download

- [magnitude_angle_north_am_supply.csv](../assets/data/regions/north_am/magnitude_angle_north_am_supply.csv)
- [magnitude_angle_north_am_temporal.csv](../assets/data/regions/north_am/magnitude_angle_north_am_temporal.csv)

## See also

- [World aggregate](../world.md) — where North America's cells sit