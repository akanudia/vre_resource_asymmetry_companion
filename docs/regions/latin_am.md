# Latin America

R10 macro-region covering Mexico, Central America, the Caribbean, and South
America. The R70 model treats Brazil, Mexico, Argentina, Chile, Colombia,
Peru, Venezuela individually; smaller countries are aggregated into
rest-of-region nodes (see Extended Data Table 1 in the manuscript for the
exact composition).

## Physical setting

Latin America's distinctive physical signature is **trade-wind and ITCZ
migration** driving an unusually coherent wind seasonality along the
Pacific coast:

- **Pacific coast countries** (Venezuela, Colombia, Ecuador): seasonal
  share of wind variance reaches **35–46%** — among the highest globally.
  The Caribbean trade-wind belt and ITCZ migration produce a strong
  northern-hemisphere-winter wind peak that overlaps with cooling-demand.
- **Brazil**: extreme within-country resource heterogeneity. Wind onshore
  CF ranges from 9% (interior) to 35% (Nordeste coast) — a ~4× range, the
  widest of any country in the dataset. Solar is moderate at 16–23%.
- **Mexico and Central America**: cooling-driven with strong solar resource
  and high mountain-wind potential in Oaxaca and southern Mexico.
- **The Southern Cone** (Argentina, Chile): temperate cooling-driven, with
  Patagonia and the Andes hosting high-quality wind.
- **Hemispheric span**: from ~30°N (Mexico) to ~55°S (southern Chile), so
  R10 aggregation combines seasonal patterns from both hemispheres.

The macro-region is **dominantly cooling-driven** at aggregate, but with
much stronger wind seasonality than the world average.

## Paired structural shifts (Latin America)

[![Latin America — paired structural shifts vs world anchor](../assets/figures/regions/latin_am/paired_shifts_mini_hero.png){ loading=lazy }](../assets/figures/regions/latin_am/paired_shifts_mini_hero.png)

/// caption
**Latin America paired structural shifts.** Same layout as the manuscript
hero figure. [Download PDF](../assets/figures/regions/latin_am/paired_shifts_mini_hero.pdf).
///

**Reading.** Both channels show strong reactions, but they go in different
directions:

- The temporal-wind row is unusually *positive*: trade-wind seasonal
  alignment with cooling demand makes wind valuable once timeslicing is
  fine enough to see it.
- The supply-cost column has clusters *below* $y=0$, meaning supply
  refinement *reduces* system cost. Brazil's high-quality wind tail at the
  Nordeste coast unlocks ultra-cheap generation that LoT averages away.

*Electricity-price row.* The electricity-price row reads as the strongest consumer-facing channel signature on the site. Supply-curve refinement drives prices down much more aggressively than at world aggregate (Δθ of −33° to −46° across climates), while temporal refinement raises them more steeply (Δθ of +28° to +41°). The vast within-region wind heterogeneity in Brazil's Nordeste and the seasonal misalignment between solar and demand both make the price signal larger here than for any other R10 region.

## Signed structural dominance angle (Latin America)

[![Latin America — signed structural dominance angle](../assets/figures/regions/latin_am/magnitude_angle.png){ loading=lazy }](../assets/figures/regions/latin_am/magnitude_angle.png)

/// caption
**Latin America signed structural dominance angle.**
[Download PDF](../assets/figures/regions/latin_am/magnitude_angle.pdf).
///

**Reading.**

- **Supply Cost C7 at −45°** vs world +31°: a striking sign flip. Latin
  America gets *cheaper* under supply refinement at fossil-dominant policy
  — Brazil's Nordeste corridor is the principal driver.
- **Temporal Wind C7 at +60°** vs world −10°: another sign flip. Trade-wind
  seasonal alignment makes wind valuable; finer timeslicing rewards it.
- **Supply Solar C7 at −74°**: solar takes the deepest cut of any region
  under supply refinement at C7. Latin American solar is comparatively
  uniform (no high tail), so refinement doesn't help — wind wins the
  trade-off.

## Cells where Latin America departs from world

| Channel | Outcome | Climate | World θ | Latin America θ | Departure |
|---|---|---|---:|---:|---:|
| Supply | Cost | C7 | +31° | −45° | **−76°** |
| Temporal | Wind | C7 | −10° | +60° | **+69°** |
| Supply | Solar | C7 | −5° | −74° | **−69°** |
| Supply | Price | C2 | −18° | −64° | **−46°** |
| Supply | Cost | C3 | −3° | −47° | **−44°** |
| Temporal | Price | C2 | +22° | +63° | **+41°** |
| Supply | Price | C4 | −27° | −68° | **−41°** |
| Supply | Price | C7 | −29° | −69° | **−40°** |
| Temporal | Price | C1 | +19° | +57° | **+39°** |
| Temporal | Cost | C3 | +24° | +62° | **+39°** |
| Supply | Cost | C4 | +8° | −28° | **−36°** |
| Temporal | Wind | C3 | −1° | +35° | **+36°** |
| Supply | Cost | C2 | −6° | −41° | **−35°** |
| Supply | Price | C3 | −21° | −56° | **−35°** |
| Supply | Solar | C2 | −9° | −42° | **−33°** |
| Supply | Price | C1 | −17° | −51° | **−33°** |
| Temporal | Solar | C2 | +12° | −21° | **−33°** |
| Temporal | Wind | C2 | +1° | +34° | **+33°** |
| Temporal | Solar | C3 | +15° | −18° | **−33°** |
| Temporal | Price | C3 | +24° | +56° | **+32°** |
| Supply | Cost | C1 | −7° | −37° | **−30°** |
| Temporal | Cost | C4 | +48° | +18° | **−30°** |
| Supply | Solar | C3 | −13° | −42° | **−29°** |
| Temporal | Price | C4 | +33° | +61° | **+28°** |
| Supply | Solar | C1 | −9° | −34° | **−25°** |
| Temporal | Solar | C4 | −8° | −33° | **−25°** |
| Temporal | Wind | C1 | +1° | +26° | **+25°** |
| Temporal | Cost | C1 | +17° | +42° | **+25°** |
| Temporal | Solar | C7 | −63° | −85° | **−22°** |
| Temporal | Wind | C4 | −3° | +18° | **+21°** |

Latin America has the **most cells with large departures** of any region —
21 cells exceed the 20° threshold. The cost column is especially
distinctive: supply refinement makes the Latin American system cheaper at
*every* climate ambition (C1 through C7 all have negative departures),
while world is near zero or slightly positive. The Brazil Nordeste wind
corridor is the principal physical driver — refining the supply curve
exposes a top decile of wind cells whose LCOE is well below the
country-average LoT tranche, and the optimiser rebuilds the system around
that cheap resource.

## CSV download

- [magnitude_angle_latin_am_supply.csv](../assets/data/regions/latin_am/magnitude_angle_latin_am_supply.csv)
- [magnitude_angle_latin_am_temporal.csv](../assets/data/regions/latin_am/magnitude_angle_latin_am_temporal.csv)

## See also

- [World aggregate](../world.md) — where Latin America's cells sit in the regional bracket
- [Gallery](gallery.md) — all 10 R10 regions' figures side by side
- [Africa](africa.md) — adjacent regional context (ITCZ-influenced wind)
- [Methodology](../methodology.md) — for the θ definition
