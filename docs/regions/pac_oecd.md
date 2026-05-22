# Pacific OECD

R10 macro-region covering Japan, South Korea, Australia, and New Zealand.
All four countries are treated individually in the R70 model (see Extended
Data Table 1 in the manuscript for the exact composition).

## Physical setting

Pacific OECD is the only R10 macro-region in the study that **combines
both hemispheres**, which is the dominant fact for interpreting its
aggregate signatures:

- **Japan and South Korea**: mid-latitude Northern Hemisphere; heating-
  driven with East-Asian monsoon overlay (similar to China but with
  smaller within-country resource heterogeneity).
- **Australia**: spans roughly 10°S to 40°S, from tropical north to
  temperate south. Aggregate is **cooling-driven**, with one of the
  highest solar resources globally (country-mean CF in the upper band)
  and significant wind heterogeneity along the Great Australian Bight
  and Bass Strait. Offshore wind in coastal Australia shows a small but
  visible diurnal component from sea-breeze cycles.
- **New Zealand**: temperate cooling-driven; smaller in load but high
  per-capita renewable share.
- **Hemispheric aggregation**: summer in Australia/NZ coincides with
  winter in Japan/Korea. R10-aggregate seasonal demand and resource
  signatures partially cancel.

The dominant story for Pacific OECD's structural-shift behaviour is
**aggregation-driven cancellation** — the macro-region is the cleanest
in-region analogue of the channel-asymmetric global aggregation finding.

## Paired structural shifts (Pacific OECD)

[![Pacific OECD — paired structural shifts vs world anchor](../assets/figures/regions/pac_oecd/paired_shifts_mini_hero.png){ loading=lazy }](../assets/figures/regions/pac_oecd/paired_shifts_mini_hero.png)

/// caption
**Pacific OECD paired structural shifts.** Same layout as the manuscript
hero figure. [Download PDF](../assets/figures/regions/pac_oecd/paired_shifts_mini_hero.pdf).
///

**Reading.** Both channels show muted point clouds relative to the world
view — the structural shifts are present but less directionally coherent
than at world or in any of the more homogeneous regions. This is the
visual signature of intra-region cancellation.

*Solar under supply refinement is the striking exception.* In the
[playground](../playground.md) view of Pac OECD, almost all solar points
line up tightly along the south-east 45° locus ($y = -x$). Geometrically
that line is the **structural cancellation line**: $x + y = 0$, so the
HiT solar outcome lands exactly at the C7-Base-median baseline value
regardless of the scenario run. The mechanism is wind displacement —
detailed supply curves expose Australia's high-quality wind tail (Bass
Strait, Great Australian Bight, Eastern Seaboard), wind crowds out
solar across every (climate, technology cost, fuel price) combination,
and the model rebuilds the same ~5,800 TWh solar floor every time. In
Pac OECD, the *representation choice* — not the scenario assumptions —
determines how much solar gets built. This is structural dominance at
the boundary ($|\theta| = 45^\circ$ exactly), and it's the clearest
visible saturation pattern in any R10 region.

*Electricity-price row.* The electricity-price row shows the in-region analogue of channel cancellation: temporal refinement raises prices less aggressively than at world aggregate (Δθ −33° at C7, Δθ −23° at C4), and supply refinement lowers prices less (Δθ +21° at C7). The mixed hemispheres of Pacific OECD dilute the channel signatures relative to a single-climate aggregate.

## Signed structural–parametric angle (Pacific OECD)

[![Pacific OECD — signed structural–parametric angle](../assets/figures/regions/pac_oecd/magnitude_angle.png){ loading=lazy }](../assets/figures/regions/pac_oecd/magnitude_angle.png)

/// caption
**Pacific OECD signed structural–parametric angle.**
[Download PDF](../assets/figures/regions/pac_oecd/magnitude_angle.pdf).
///

**Reading.**

- **Temporal Emissions C7 at −3°** vs world +39°: emissions barely
  shift under temporal refinement in Pacific OECD, opposite the strong
  world signal. Japan/Korea's heating-driven temporal-favours-wind story
  and Australia's cooling-driven temporal-favours-solar story largely
  cancel at R10 aggregate.
- **Temporal Cost C4 at +7°** vs world +54°: cost shift under temporal
  refinement is similarly muted.
- **Temporal Solar C7 at −32°** vs world −65°: still negative, but less
  so than world. Australia's positive solar–demand alignment partially
  offsets Japan/Korea's negative alignment.
- **Supply Cost C7 at +5°** vs world +28°: supply-channel cost reaction
  is muted too.

This is **the within-region analogue of the channel-asymmetric global
aggregation finding**: Pacific OECD's aggregation cancels the same way
world aggregation cancels Solar C7 (−5° world, with ±74° regional spread).
At Pacific OECD's smaller scale, the same cancellation arithmetic operates
over 4 countries rather than 10 regions.

## Cells where Pacific OECD departs from world

| Channel | Outcome | Climate | World θ | Pac OECD θ | Departure |
|---|---|---|---:|---:|---:|
| Temporal | Cost | C4 | +54° | +7° | **-47°** |
| Temporal | Solar | C7 | -65° | -32° | **+33°** |
| Temporal | Price | C7 | +55° | +23° | **-31°** |
| Temporal | Non-VRE CF | C4 | -35° | -66° | **-31°** |
| Temporal | Solar | C3 | +17° | -12° | **-30°** |
| Supply | Wind | C1 | +16° | +43° | **+27°** |
| Temporal | Solar | C2 | +13° | -13° | **-26°** |
| Temporal | Non-VRE CF | C1 | -37° | -62° | **-26°** |
| Supply | Cost | C1 | -7° | +18° | **+25°** |
| Supply | Cost | C2 | -6° | +18° | **+24°** |
| Temporal | Solar | C1 | +19° | -5° | **-24°** |
| Temporal | Non-VRE CF | C3 | -29° | -52° | **-23°** |
| Supply | Cost | C7 | +28° | +5° | **-23°** |
| Supply | Wind | C2 | +19° | +41° | **+22°** |
| Temporal | Price | C4 | +32° | +11° | **-21°** |

The pattern across the table: **Pacific OECD's departures are almo