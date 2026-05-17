# Data

CSV sidecars for every cell in the signed structural dominance angle
diagnostic ([ED Fig 2 in the manuscript](world.md)) are released on this
site alongside the figures.

## Schema

Per-region CSVs (`magnitude_angle_<region>_<channel>.csv`):

| Column | Type | Description |
|---|---|---|
| `outcome` | str | One of `cum_wind_twh`, `cum_solar_twh`, `npv_cost_bn`, `cum_emissions_mt` |
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

## Usage example (Python / pandas)

```python
import pandas as pd

india_supply = pd.read_csv(
    "https://akanudia.github.io/vre_resource_asymmetry_companion/"
    "assets/data/regions/india/magnitude_angle_india_supply.csv"
)
print(india_supply.query("climate == 'C7'"))
```

## What's not on this site

The full 1,080-run scenario output database (generation, capacity, cost,
emissions trajectories by country/region/year for every model run) and the
raw analysis scripts that produced these figures live in the
`structural_experiment` source tree released alongside the manuscript per the
journal's Data Availability policy. Pre-acceptance, contact the corresponding
author for access. Post-acceptance, the archived snapshot will be linked
from the [cite page](cite.md).

## License

All CSVs are released under CC-BY 4.0 (see `LICENSE-CONTENT` in the
[GitHub repo](https://github.com/akanudia/vre_resource_asymmetry_companion)).
Attribution: "Companion site data for [Authors], 2026, *Wind–solar resource
asymmetry...*, Nature Energy."
