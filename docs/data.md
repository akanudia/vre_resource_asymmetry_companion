# Data

!!! abstract "Sources & provenance"
    **Manuscript:** Extended Data Figs 2–4 (signed structural–parametric
    angle, world + regional decomposition) and Extended Data Table 2
    (structural-distribution table).  
    **External data:** none.  
    **Companion-only:** every CSV here is the pre-extracted figure-level
    data sidecar for the corresponding manuscript figure. Released for
    re-analysis; the figures themselves are the canonical claim
    surface.

CSV sidecars for every cell in the signed structural–parametric angle
diagnostic ([ED Fig 2 in the manuscript](world.md)) are released on this
site alongside the figures.

## Schema

Per-region CSVs (`magnitude_angle_<region>_<channel>.csv`):

| Column | Type | Description |
|---|---|---|
| `outcome` | str | One of `cum_wind_twh`, `cum_solar_twh`, `avg_elec_price`, `nonvre_cf`, `npv_cost_bn`, `cum_emissions_mt` (six outcomes matching ED Fig 2 of the manuscript) |
| `climate` | str | C1, C2, C3, C4, C7, or `POOL` (pooled across climates) |
| `p25` | float | 25th percentile of within-cell signed-θ distribution (degrees) |
| `p50` | float | Median of within-cell signed-θ distribution (degrees) |
| `p75` | float | 75th percentile of within-cell signed-θ distribution (degrees) |
| `n` | int | Number of paired comparisons in the cell |

World vs regional spread CSV (`magnitude_angle_world_vs_regional.csv`)
additionally has `channel` (`supply` or `temporal`), `world_p50`,
`regional_min`, `regional_p25_of_p50`, `regional_median_of_p50`,
`regional_p75_of_p50`, `regional_max`, and `n_regions`.

## World

- [magnitude_angle_world_supply.csv](assets/data/world/magnitude_angle_world_supply.csv)
- [magnitude_angle_world_temporal.csv](assets/data/world/magnitude_angle_world_temporal.csv)
- [magnitude_angle_world_vs_regional.csv](assets/data/world/magnitude_angle_world_vs_regional.csv)

## Regional

| Region | Supply | Temporal |
|---|---|---|
| Africa | [supply](assets/data/regions/africa/magnitude_angle_africa_supply.csv) | [temporal](assets/data/regions/africa/magnitude_angle_africa_temporal.csv) |
| China | [supply](assets/data/regions/china/magnitude_angle_china_supply.csv) | [temporal](assets/data/regions/china/magnitude_angle_china_temporal.csv) |
| Europe | [supply](assets/data/regions/europe/magnitude_angle_europe_supply.csv) | [temporal](assets/data/regions/europe/magnitude_angle_europe_temporal.csv) |
| India | [supply](assets/data/regions/india/magnitude_angle_india_supply.csv) | [temporal](assets/data/regions/india/magnitude_angle_india_temporal.csv) |
| Latin America | [supply](assets/data/regions/latin_am/magnitude_angle_latin_am_supply.csv) | [temporal](assets/data/regions/latin_am/magnitude_angle_latin_am_temporal.csv) |
| Middle East | [supply](assets/data/regions/middle_east/magnitude_angle_middle_east_supply.csv) | [temporal](assets/data/regions/middle_east/magnitude_angle_middle_east_temporal.csv) |
| North America | [supply](assets/data/regions/north_am/magnitude_angle_north_am_supply.csv) | [temporal](assets/data/regions/north_am/magnitude_angle_north_am_temporal.csv) |
| Pacific OECD | [supply](assets/data/regions/pac_oecd/magnitude_angle_pac_oecd_supply.csv) | [temporal](assets/data/regions/pac_oecd/magnitude_angle_pac_oecd_temporal.csv) |
| Reforming Economies | [supply](assets/data/regions/ref_econ/magnitude_angle_ref_econ_supply.csv) | [temporal](assets/data/regions/ref_econ/magnitude_angle_ref_econ_temporal.csv) |
| Rest of Asia | [supply](assets/data/regions/rest_asia/magnitude_angle_rest_asia_supply.csv) | [temporal](assets/data/regions/rest_asia/magnitude_angle_rest_asia_temporal.csv) |

## Structural-distribution table (six outcomes × climate × channel × region)

The Extended Data table in the manuscript reports the full percentile
distribution of the signed structural shift $S_{s,a\rightarrow b}$ across
all paired comparisons in each (channel, climate, outcome) cell. The
full-granularity release also includes the regional decomposition (515
rows total, channel × climate × region × outcome).

- [ed_table_structural_distribution.csv](assets/data/world/ed_table_structural_distribution.csv) — full granularity (515 rows × 14 columns)

Schema:

| Column | Type | Description |
|---|---|---|
| `channel` | str | `supply` or `temporal` |
| `sg_climate` | str | AR6 climate category (C1, C2, C3, C4, C7) |
| `region` | str | `WORLD` or an R10 code |
| `outcome` | str | one of the six outcomes (see above) |
| `n` | int | paired comparisons in the cell |
| `S_p5`, `S_p25`, `S_median`, `S_p75`, `S_p95` | float | signed structural shift