# North America

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

## Signed structural dominance angle (North America)

[![North America — signed structural dominance angle](../assets/figures/regions/north_am/magnitude_angle.png){ loading=lazy }](../assets/figures/regions/north_am/magnitude_angle.png)

/// caption
**North America signed structural dominance angle.**
[Download PDF](../assets/figures/regions/north_am/magnitude_angle.pdf).
///

**Reading.**

- **Supply Cost C4 at −42°** vs world +8°: cost goes down strongly under
  supply refinement at C4 in North America. Texas-Oklahoma wind plus
  Southwest solar dominate the high-quality tail of both resources.
- **Supply Solar C7 at −48°** vs world −5°: under fossil-dominant policy,
  supply refinement reallocates share away from solar (toward cheap wind
  from the Plains and toward fossils with cheap fuel prices).
- **Supply Cost C7 at −12°** vs world +31°: another sign flip. The world
  story at C7 supply is "cost goes up because finer supply curves favour
  wind which is more expensive than fossil at q25"; North America's story
  is "wind is so cheap in the Plains that finer supply curves *reduce*
  cost even at C7".
- **Supply Wind C4 at +63°** vs world +33°: strong wind dominance under
  intermediate climate ambition, well above world.

## Cells where North America departs from world

| Channel | Outcome | Climate | World θ | Region θ | Departure |
|---|---|---|---:|---:|---:|
| Supply | Cost | C4 | +8° | −42° | **−50°** |
| Supply | Solar | C7 | −5° | **−48°** | −44° |
| Supply | Cost | C7 | +31° | −12° | −43° |
| Supply | Cost | C3 | −3° | −41° | −37° |
| Supply | Wind | C4 | +33° | **+63°** | +30° |
| Supply | Cost | C2 | −6° | −34° | −28° |
| Supply | Cost | C1 | −7° | −34° | −27° |
| Temporal | Wind | C7 | −10° | +14° | +24° |
| Temporal | Solar | C2 | +12° | −12° | −24° |
| Supply | Solar | C2 | −9° | −33° | −24° |
| Supply | Solar | C4 | −34° | **−57°** | −22° |
| Temporal | Solar | C7 | **−63°** | **−85°** | −22° |
| Supply | Solar | C3 | −13° | −34° | −21° |
| Supply | Solar | C1 | −9° | −29° | −20° |

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

- [World aggregate](../world.md) — where North America's cells sit in the regional bracket
- [Gallery](gallery.md) — all 10 R10 regions' figures side by side
- [Europe](europe.md) — the comparison heating-driven OECD macro-region
- [Methodology](../methodology.md) — for the θ definition
