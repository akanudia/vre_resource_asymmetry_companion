# China

R10 macro-region covering mainland China and adjacent entities (see Extended
Data Table 1 in the manuscript for the exact composition; in R70, China is
treated individually as a single national model with provincial-level
resolution where data permit).

## Physical setting

China is the **exception within the heating-driven Northern Hemisphere
group**, and that exception is what makes the region distinctive in the
demand-alignment landscape:

- **Demand**: ~39% seasonal share. Heating in the northern provinces,
  cooling in the south; the aggregate is moderately seasonal.
- **Wind seasonal alignment**: weak to negative. Most heating-driven
  temperate regions (Europe, North America's northeast, Reforming
  Economies) get a winter storm-track wind boost that aligns with winter
  heating demand. In China, the East-Asian monsoon system **damps the
  mid-latitude winter wind** that would otherwise produce that alignment.
- **Position in Fig 4b alignment landscape**: lower-left quadrant, rather
  than upper-left where the rest of the heating-driven group sits.
- **Within-region heterogeneity**: large. China is one of the ~130-cluster
  countries, with high-CF wind corridors (Inner Mongolia, Xinjiang, Gansu)
  geographically distant from cooling-demand load centres on the eastern
  seaboard.

This combination — heating-driven aggregate demand but cooling-driven wind
alignment — drives most of China's distinctive structural-shift behaviour.

## Paired structural shifts (China)

[![China — paired structural shifts vs world anchor](../assets/figures/regions/china/paired_shifts_mini_hero.png){ loading=lazy }](../assets/figures/regions/china/paired_shifts_mini_hero.png)

/// caption
**China paired structural shifts.** Same layout as the manuscript hero
figure but computed at China aggregate. Expressed as % of C7-Base-median
anchor. [Download PDF](../assets/figures/regions/china/paired_shifts_mini_hero.pdf).
///

**Reading.** The temporal-channel column shows a wider upward cost shift
than the world view, and the solar column is unusually positive — both
consistent with the East-Asian-monsoon story: when the optimiser sees the
hourly mismatch between wind and demand, it substitutes toward solar plus
storage, which is costlier than the wind-driven world-aggregate trade-off.

## Signed structural dominance angle (China)

[![China — signed structural dominance angle](../assets/figures/regions/china/magnitude_angle.png){ loading=lazy }](../assets/figures/regions/china/magnitude_angle.png)

/// caption
**China signed structural dominance angle.** Per (outcome × climate × channel)
cell, $\theta = \mathrm{atan2}(\text{structural shift}, |\text{parametric shift}|)$
in degrees. Median (dot) ± p25–p75 (whiskers).
[Download PDF](../assets/figures/regions/china/magnitude_angle.pdf).
///

**Reading.**

- **Temporal Solar C4 at +39°** vs world −8°: under deep-decarbonisation
  policy, finer timeslices favour solar in China — the temporal-value
  signal redirects from wind (which has weak demand alignment) to solar
  (which has a clearer daytime-cooling overlap in southern provinces).
- **Temporal Cost C3 at +65°** vs world +24°: cost goes up more aggressively
  under finer timeslicing in China. The monsoon-damped winter wind leaves
  less low-cost generation visible to the coarse-TS optimiser; finer TS
  exposes the mismatch and forces a costlier substitution.
- **Supply Wind C7 at +90°** (saturation): under fossil-dominant policy,
  China's high-quality wind tail in Inner Mongolia and the northwest gets
  fully exploited; the LoT→HiT structural channel is essentially the only
  thing that matters at the margin.

## Cells where China departs from world

| Channel | Outcome | Climate | World θ | Region θ | Departure |
|---|---|---|---:|---:|---:|
| Temporal | Solar | C4 | −8° | +39° | **+47°** |
| Temporal | Cost | C3 | +24° | **+65°** | +41° |
| Supply | Solar | C7 | −5° | +34° | +39° |
| Supply | Wind | C4 | +33° | **+71°** | +38° |
| Temporal | Solar | C2 | +12° | **+47°** | +35° |
| Temporal | Cost | C2 | +20° | **+53°** | +33° |
| Temporal | Cost | C4 | **+48°** | **+76°** | +28° |
| Supply | Cost | C4 | +8° | +34° | +26° |
| Temporal | Solar | C1 | +18° | **+43°** | +25° |
| Supply | Wind | C7 | **+69°** | **+90°** | +21° |

The headline reading is that **China's temporal channel is consistently
more positive than world's across both Solar and Cost outcomes**. The
East-Asian monsoon damping of winter wind is the physical signature; it
shows up as the optimiser preferring solar + storage over wind whenever the
temporal channel gives it more information about hourly alignment.

## CSV download

- [magnitude_angle_china_supply.csv](../assets/data/regions/china/magnitude_angle_china_supply.csv)
- [magnitude_angle_china_temporal.csv](../assets/data/regions/china/magnitude_angle_china_temporal.csv)

## See also

- [World aggregate](../world.md) — where China's cells sit in the regional bracket
- [Gallery](gallery.md) — all 10 R10 regions' figures side by side
- [India](india.md) — adjacent regional context (South Asian monsoon)
- [Methodology](../methodology.md) — for the θ definition
