# Middle East

R10 macro-region covering the Arabian Peninsula, the Levant, Iraq, Iran, and
typically Egypt. The R70 model treats Saudi Arabia, Iran, Iraq, UAE, and
several others individually (see Extended Data Table 1 in the manuscript
for the exact composition).

## Physical setting

The Middle East is the **most strongly cooling-driven R10 macro-region** in
the study:

- **Demand**: Saudi Arabia has the **highest seasonal demand share of any
  R70 country at 84%**. Oman is at 82%, UAE 68%, Iraq 63%. Summer cooling
  load dominates every annual demand curve in the region.
- **Solar–demand seasonal alignment**: strongly positive. Cloudless
  summer skies coincide with peak cooling demand, giving solar the
  largest value-of-alignment of any technology in the macro-region.
- **Wind onshore**: weak resource for most member countries. Within-country
  variance composition is dominated by stochastic synoptic and day-to-day
  weather rather than aligned seasonal patterns; LoT supply curves don't
  underrepresent much.
- **Wind offshore**: Oman reaches **63% seasonal share for offshore wind**
  — the highest country-tech seasonal share in the dataset. The Gulf of
  Oman picks up the Indian-summer-monsoon signal, producing a coherent
  summer wind peak that aligns with cooling demand.
- **Solar resource**: high, comparatively homogeneous across the desert
  belt. Cherry-picking uplift is modest.

Position in the Fig 4b alignment landscape: **lower-right quadrant**
(positive solar seasonal alignment, weak or weakly-positive wind seasonal
alignment).

## Paired structural shifts (Middle East)

[![Middle East — paired structural shifts vs world anchor](../assets/figures/regions/middle_east/paired_shifts_mini_hero.png){ loading=lazy }](../assets/figures/regions/middle_east/paired_shifts_mini_hero.png)

/// caption
**Middle East paired structural shifts.** Same layout as the manuscript
hero figure. [Download PDF](../assets/figures/regions/middle_east/paired_shifts_mini_hero.pdf).
///

**Reading.** The supply-channel wind row is unusually muted — most points
sit near $y=0$ rather than along the $y=+x$ saturation diagonal that
dominates the world view. The temporal-channel wind row, by contrast, has
positive points reaching $y > +30\%$ at higher climate ambitions: Oman
offshore wind's seasonal alignment with cooling demand makes wind valuable
under finer temporal resolution even though the supply channel ignores it.

*Electricity-price row.* The electricity-price row follows the world pattern closely (no cells exceed the 20° departure threshold) — supply-curve refinement lowers prices, temporal refinement raises them.

## Signed structural–parametric angle (Middle East)

[![Middle East — signed structural–parametric angle](../assets/figures/regions/middle_east/magnitude_angle.png){ loading=lazy }](../assets/figures/regions/middle_east/magnitude_angle.png)

/// caption
**Middle East signed structural–parametric angle.**
[Download PDF](../assets/figures/regions/middle_east/magnitude_angle.pdf).
///

**Reading.**

- **Supply Wind C7 at −31°** vs world +69°: the **largest single departure
  on the entire site at 99°**. World sits at the high end of wind
  saturation; the Middle East sits in *negative* territory. Onshore wind
  isn't attractive enough in most Middle East countries for supply
  refinement to favour it, and at fossil-dominant policy the system
  doesn't build the wind that LoT-vs-HiT comparisons would normally
  expose.
- **Supply Cost C7 at −29°** vs world +28°: cost goes *down* under supply
  refinement at C7 in the Middle East, opposite to world. With wind out of
  contention, supply refinement reduces system cost by exposing high-CF
  solar tranches and leaving the cheap-fossil baseline alone.
- **Temporal Wind C7 at +45°** vs world −9°: finer timeslicing favours
  wind in the Middle East — Oman's offshore wind seasonal aligns with
  peak cooling demand, and the optimiser captures that value once
  TS04→TS72 makes it visible.
- **Supply Emissions C7 at −12°** vs world −51°: the emissions reduction
  channel is muted; the structural channel can't cut emissions much when
  wind is essentially absent from the marginal build set.

## Cells where Middle East departs from world

| Channel | Outcome | Climate | World θ | Middle East θ | Departure |
|---|---|---|---:|---:|---:|
| Supply | Wind | C7 | +69° | -31° | **-100°** |
| Supply | Cost | C7 | +28° | -29° | **-57°** |
| Temporal | Wind | C7 | -9° | +45° | **+54°** |
| Temporal | Cost | C4 | +54° | +5° | **-49°** |
| Supply | Non-VRE CF | C7 | -57° | -19° | **+38°** |
| Supply | Solar | C4 | -33° | +5° | **+37°** |
| Temporal | Non-VRE CF | C3 | -29° | -64° | **-35°** |
| Temporal | Cost | C7 | +55° | +21° | **-34°** |
| Temporal | Non-VRE CF | C1 | -37° | -67° | **-30°** |
| Supply | Wind | C4 | +30° | +5° | **-26°** |
| Temporal | Non-VRE CF | C2 | -32° | -57° | **-25°** |

The Middle East is the **canonical "supply channel rejects wind" region**.
Under fossil-dominant policy the world story is "wind saturation"; the
Middle East story is "wind exit". The 99° sign-flip on Supply Wind C7 is
the most extreme cell departure on the site, and it's the cell-level
fingerprint of the channel-asymmetric global aggregation finding — world's
+69° hides the fact that one of the ten R10 regions sits at −30° on the
same axis.

## CSV download

- [magnitude_angle_middle_east_supply.csv](../assets/data/regions/middle_east/magnitude_angle_middle_east_supply.csv)
- [magnitude_angle_middle_east_temporal.csv](../assets/data/regions/middle_east/magnitude_angle_middle_east_temporal.csv)

## See also

- [World aggregate](../world.md) — where Middle East's cells sit in the regional bracket
- [Gallery](gallery.md) — all 10 R10 regions' figures side by side
- [Africa](africa.md) — adjacent macro-region (North Africa overlaps in climate signature)
- [Methodology](../methodology.md) — for the θ definition
