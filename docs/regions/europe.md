# Europe

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

## Signed structural dominance angle (Europe)

[![Europe — signed structural dominance angle](../assets/figures/regions/europe/magnitude_angle.png){ loading=lazy }](../assets/figures/regions/europe/magnitude_angle.png)

/// caption
**Europe signed structural dominance angle.** Per (outcome × climate × channel)
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

| Channel | Outcome | Climate | World θ | Region θ | Departure |
|---|---|---|---:|---:|---:|
| Temporal | Solar | C1 | +18° | **−52°** | **−70°** |
| Temporal | Solar | C2 | +12° | **−49°** | **−62°** |
| Temporal | Solar | C3 | +15° | −30° | **−45°** |
| Supply | Solar | C7 | −5° | **−48°** | −43° |
| Supply | Solar | C1 | −9° | **−47°** | −38° |
| Temporal | Cost | C4 | **+48°** | +11° | −37° |
| Supply | Solar | C2 | −9° | −42° | −33° |
| Temporal | Wind | C7 | −10° | +23° | +33° |
| Temporal | Solar | C4 | −8° | −36° | −28° |
| Temporal | Emissions | C7 | +41° | +20° | −22° |
| Supply | Wind | C4 | +33° | +12° | −20° |

The headline departure is **Temporal Solar C1 at −70°**: Europe is at −52°
while world is at +18°. This single cell encapsulates the resource-asymmetry
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
