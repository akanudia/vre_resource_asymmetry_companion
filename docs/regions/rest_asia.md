# Rest of Asia

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
    **Companion-only:** the Rest of Asia physical-setting prose, the
    paired-shifts mini-hero plot computed at Rest of Asia aggregate,
    the regional signed structural–parametric angle figure and the
    "cells where Rest of Asia departs from world" table extend the
    manuscript figures with reader-friendly framings; no quantitative
    claims appear here that are not derivable from the manuscript and
    the released CSVs.

R10 macro-region covering South-East Asia, Mongolia, and the Pacific
island states. Indonesia, Thailand, Vietnam, the Philippines, Malaysia
are typically treated individually in the R70 model; smaller members
are aggregated into rest-of-region nodes (see Extended Data Table 1 in
the manuscript for the exact composition). Note: Pakistan and Bangladesh
sit in the **India** macro-region under standard IPCC R10 conventions,
not here.

## Physical setting

Rest of Asia is dominantly tropical and **strongly cooling-driven**:

- **Demand**: cooling load tracks daytime temperatures, so demand
  variance is dominantly diurnal. Seasonal demand shares run ~15–25%
  across most member countries — modest compared with the Middle East or
  Northern Europe.
- **Wind seasonality**: ITCZ-influenced. The South-East Asian monsoon
  and the position of the Inter-Tropical Convergence Zone drive coherent
  seasonal patterns in coastal wind (Vietnam, Philippines, Indonesia's
  outer islands), though magnitudes are smaller than the trade-wind
  signature in Latin American Pacific countries.
- **Solar**: tropical with significant cloud cover during the wet monsoon
  (May–October in much of the region), giving solar a modest seasonal
  dip rather than the strong positive seasonal alignment seen in the
  desert-belt Middle East.
- **Wind onshore resource**: highly heterogeneous within the macro-region
  but mostly modest in absolute magnitude. Coastal corridors in the
  Philippines and central Vietnam have the highest CFs.
- **Mongolia** is the continental-interior outlier in an otherwise
  tropical/maritime ensemble — heating-driven, with high wind potential
  in the Gobi.

The R10 aggregation combines tropical-cooling members (the majority) with
Mongolia, but the cooling signature dominates at aggregate.

## Paired structural shifts (Rest of Asia)

[![Rest of Asia — paired structural shifts vs world anchor](../assets/figures/regions/rest_asia/paired_shifts_mini_hero.png){ loading=lazy }](../assets/figures/regions/rest_asia/paired_shifts_mini_hero.png)

/// caption
**Rest of Asia paired structural shifts.** Same layout as the manuscript
hero figure.
[Download PDF](../assets/figures/regions/rest_asia/paired_shifts_mini_hero.pdf).
///

**Reading.** The supply-channel wind row dominates the picture — points
sit along the $y=+x$ diagonal at almost every climate ambition, reaching
$y > +80\%$ at the high-VRE end. The region's wind resource is highly
heterogeneous within countries, and refining supply curves uncovers the
high-CF coastal tail that LoT averaging hides.

*Electricity-price row.* The electricity-price row mutes the supply-channel signature at C7 (Δθ +22°): supply-curve refinement lowers prices less aggressively than at world aggregate, consistent with the wind-saturation regime visible in the signed-θ diagnostic.

## Signed structural–parametric angle (Rest of Asia)

[![Rest of Asia — signed structural–parametric angle](../assets/figures/regions/rest_asia/magnitude_angle.png){ loading=lazy }](../assets/figures/regions/rest_asia/magnitude_angle.png)

/// caption
**Rest of Asia signed structural–parametric angle.**
[Download PDF](../assets/figures/regions/rest_asia/magnitude_angle.pdf).
///

**Reading.**

- **Supply Wind across C2, C3, C4 saturates at +86°–+90°**: the
  structural channel almost entirely determines how much wind is built
  in this region. Within-country wind heterogeneity is so large that LoT
  badly underestimates the cheap-wind tranche; HiT exposes it and the
  optimiser builds the available potential to its ceiling.
- **Supply Wind C7 at +90°**: full saturation. The cell sits at the upper
  bound of the diagnostic.
- **Temporal Wind C3 at −36°** vs world −1°: finer timeslicing pulls wind
  *down* sharply in Rest of Asia at intermediate climate ambition, the
  opposite of the (essentially zero) world signal. The ITCZ-driven
  seasonal wind signal misaligns with demand seasonality in many of the
  region's countries, so exposing intra-year variability via finer
  timeslices makes wind look less valuable to the optimiser. Same
  mechanism applies at C1, C2 and C4 — wind is systematically
  disadvantaged by temporal refinement across the mitigation regimes.
- **Supply Cost C7 at +5°** vs world +28°: cost barely shifts in Rest
  of Asia under fossil-dominant policy, well below world. The supply-
  curve channel does its work on wind generation (saturating at +90°)
  without flowing through to large system-cost changes — the additional
  wind comes in at low cost from previously-hidden tranches.

## Cells where Rest of Asia departs from world

| Channel | Outcome | Climate | World θ | Rest Asia θ | Departure |
|---|---|---|---:|---:|---:|
| Supply | Wind | C3 | +21° | +88° | **+67°** |
| Supply | Wind | C2 | +19° | +85° | **+67°** |
| Temporal | Wind | C7 | -9° | -72° | **-63°** |
| Supply | Wind | C4 | +30° | +90° | **+60°** |
| Temporal | Cost | C4 | +54° | +5° | **-50°** |
| Temporal | Wind | C4 | -3° | -52° | **-49°** |
| Supply | Wind | C1 | +16° | +65° | **+49°** |
| Temporal | Wind | C3 | -1° | -36° | **-34°** |
| Temporal | Wind | C2 | +1° | -30° | **-31°** |
| Temporal | Wind | C1 | +2° | -29° | **-30°** |
| Supply | Non-VRE CF | C7 | -57° | -29° | **+27°** |
| Supply | Solar | C4 | -33° | -8° | **+25°** |
| Supply | Price | C7 | -30° | -7° | **+23°** |
| Supply | Cost | C7 | +28° | +5° | **-23°** |
| Supply | Wind | C7 | +69° | +90° | **+21°** |

The headline reading is **wind saturation across every climate**: Rest of
Asia is the cleanest example of a region where the supply channel runs to
its empirical ceiling without much help from the temporal channel.
Within-country wind heterogeneity in the Philippines, Vietnam, and
Indonesia is the physical mechanism — these are the cells whose LoT
representation most badly underestimates the deployable resource.

## CSV download

- [magnitude_angle_rest_asia_supply.csv](../assets/data/regions/rest_asia/magnitude_angle_rest_asia_supply.csv)
- [magnitude_angle_rest_asia_tem