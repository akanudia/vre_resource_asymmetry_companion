# Structural inputs

This page releases the data behind the two structural axes that drive
the representational channels analysed in the manuscript: supply-curve
detail and temporal resolution. Regional aggregation (R10 vs R70) is
the third structural axis; it is described in the [methodology](methodology.md)
page and its region-mapping table is released in Extended Data Table 1.

| Layer | Levels in experiment | CSV |
|---|---|---|
| Supply-curve bins | LoT (n=0.2) vs HiT (n=0.45) | [supply_curve_bins_r10.csv](assets/data/structural/supply_curve_bins_r10.csv) |
| Supply-curve uplift | LoT vs HiT cherry-picking ratio per region | [supply_curve_uplift_r10.csv](assets/data/structural/supply_curve_uplift_r10.csv) |
| Timeslice definitions | TS04 / TS12 / TS24 / TS36 / TS48 / TS72 | [timeslice_definitions_all_levels.csv](assets/data/structural/timeslice_definitions_all_levels.csv) |
| Template validation scores | 6 calendar templates vs k-means benchmark | [timeslice_template_scores.csv](assets/data/structural/timeslice_template_scores.csv) |
| DEF convergence by ISO | Solar PV and wind onshore, 210 countries | [timeslice_def_convergence_by_iso.csv](assets/data/structural/timeslice_def_convergence_by_iso.csv) |

All five CSVs are released as the pipeline's structural-axis outputs;
see the [Code & data page](code_and_reproducibility.md) for the bundling
context and the boundary between released analysis code and the
proprietary model-generation pipeline.

---

## Supply-curve detail

### What LoT and HiT represent

Within each active model region, renewable-resource gridcells are
clustered into supply-curve bins. LoT is the coarse endpoint;
HiT is the fine endpoint. Both configurations use identical resource
data, exclusion filters and aggregation rules — only the binning
resolution changes. The released
[supply_curve_bins_r10.csv](assets/data/structural/supply_curve_bins_r10.csv)
quantifies the difference: in R70, LoT produces a median of 2 solar PV
and 2 wind-onshore bins per country (range 2–5), while HiT produces a
median of 12 solar PV and 10 wind-onshore bins per country (range 3–41).
The two endpoints span the range of supply-curve resolutions typical of
production global energy-system models.

The effect is technology-asymmetric. Solar capacity factors are
spatially smooth (within-region CV ≈ 0.07–0.11); adding bins reveals
almost no additional quality variation. Wind capacity factors are
spatially heterogeneous (within-region CV ≈ 0.22–0.27); finer bins
expose a high-CF tail that the coarse binning averages away. The
`hit_top_vs_lot_mean` column in the uplift table quantifies this: it
is the ratio of the best HiT bin's CF to the LoT mean CF, measuring
how much resource quality the optimizer gains access to when moving
from LoT to HiT.

### `supply_curve_bins_r10.csv`

One row per (config, R10 region, technology, bin rank). Bins are ranked
1 = highest CF within the config–region–technology group.

| Column | Type | Description |
|---|---|---|
| `config` | str | `LoT` (n=0.2) or `HiT` (n=0.45) |
| `r10_region` | str | AR6 R10 region code (e.g. `R10EUROPE`) |
| `region_label` | str | Plain-English label |
| `technology` | str | `solar`, `wind_onshore`, `wind_offshore` |
| `technology_label` | str | Plain-English label |
| `bin_rank` | int | 1 = best resource within config–region–technology |
| `n_cells` | int | Number of 50 × 50 km gridcells in this bin |
| `avg_cf` | float | Average annual capacity factor across cells in bin |
| `std_cf` | float | Standard deviation of CF within the bin |
| `total_capacity_gw` | float | Installable potential in GW (before exclusions) |

### `supply_curve_uplift_r10.csv`

One row per (R10 region, technology). Summarises the change in
accessible resource quality between LoT and HiT.

| Column | Type | Description |
|---|---|---|
| `r10_region` | str | AR6 R10 region code |
| `region_label` | str | Plain-English label |
| `technology` | str | `solar`, `wind_onshore`, `wind_offshore` |
| `technology_label` | str | Plain-English label |
| `lot_n_bins` | int | Number of bins under LoT |
| `hit_n_bins` | int | Number of bins under HiT |
| `lot_mean_cf` | float | Mean CF across all LoT bins (capacity-unweighted) |
| `hit_mean_cf` | float | Mean CF across all HiT bins (same resource base — should be close to LoT) |
| `lot_top_bin_cf` | float | CF of the highest-CF bin under LoT |
| `hit_top_bin_cf` | float | CF of the highest-CF bin under HiT |
| `hit_top_vs_lot_mean` | float | `hit_top_bin_cf / lot_mean_cf` — the cherry-picking uplift from supply-curve refinement |

**Reading the uplift column.** For wind onshore, `hit_top_vs_lot_mean`
ranges from 1.27 (Reforming Economies, where LoT already captures
near-best resources) to 2.41 (India+, where the HiT top bin is more
than twice the LoT mean CF). For solar, the same ratio stays in the
1.0–1.2 range across all regions — confirming the spatial-uniformity
claim in the manuscript.

---

## Temporal resolution

### Timeslice family design

The six temporal configurations (TS04–TS72) are generated from a
single calendar-based partition family released as
[timeslice_definitions_all_levels.csv](assets/data/structural/timeslice_definitions_all_levels.csv).
Each TS level maps calendar months (1–12) and clock hours (1–24) to a
set of season codes (S1–S6) and time-of-day codes (H1–H8). The
timeslice label for each (month, hour) is the concatenation of its
season and ToD code.

The partition family was selected after a systematic evaluation of six
calendar templates against an unconstrained k-means clustering
benchmark, using ERA5-derived demand and Atlite-derived capacity-factor
profiles for 14 major electricity systems representing 74% of global
demand. The best calendar template (36_detailed, composite score 0.843)
exceeded the 40-slice k-means benchmark (0.823), confirming that
domain-knowledge-based season × time-of-day boundaries match or
outperform data-driven clustering at practical resolutions.

The validated template family was then extended to the full TS04–TS72
ladder by varying the number of season and ToD subdivisions while
preserving the same month → season and hour → ToD logic.

### `timeslice_definitions_all_levels.csv`

One row per (TS level, timeslice ID). The full season × ToD partition
for all six experimental resolutions.

| Column | Type | Description |
|---|---|---|
| `ts_level` | str | `ts_4`, `ts_12`, `ts_24`, `ts_36`, `ts_48`, `ts_72` |
| `ts_label` | str | Manuscript label (`TS04` … `TS72`) |
| `timeslice_id` | str | `{season_code}_{tod_code}` (e.g. `S1_H1`) |
| `season_code` | str | Season identifier within this TS level |
| `tod_code` | str | Time-of-day identifier within this TS level |
| `n_seasons` | int | Total number of seasons at this TS level |
| `n_tod_blocks` | int | Total number of ToD blocks at this TS level |
| `months` | str | List of calendar months (1–12) in this season |
| `hours_1indexed` | str | List of clock hours (1–24) in this ToD block |
| `n_hours_per_day` | int | Hours per day spanned by this ToD block |
| `n_days_in_season` | int | Total calendar days in this season |
| `annual_hours` | int | `n_hours_per_day × n_days_in_season` |
| `fraction_of_year` | float | `annual_hours / 8760` |

### `timeslice_template_scores.csv`

One row per calendar template. Composite and component validation
scores from the systematic evaluation described in the Methods.

| Column | Type | Description |
|---|---|---|
| `template_name` | str | Short template identifier |
| `template_label` | str | Plain-English description |
| `resolution` | int | Number of timeslices |
| `composite_score` | float | Equally weighted average of demand, solar, wind and combined scores |
| `demand_score` | float | Demand-representation sub-score (peak capture, LDC error, shape correlation) |
| `solar_score` | float | Solar-reconstruction sub-score (production correlation, duck curve, seasonal variance) |
| `wind_score` | float | Wind-reconstruction sub-score (production correlation, diurnal/seasonal variance) |
| `combined_score` | float | Combined sub-score (net load, ramping, timeslice balance) |
| `demand_hourly_correlation` | float | Pearson r between hourly and aggregated demand |
| `demand_seasonal_shape_corr` | float | Correlation of monthly-average demand profiles |
| `solar_solar_correlation` | float | Pearson r between hourly and aggregated solar CF |
| `wind_wind_correlation` | float | Pearson r between hourly and aggregated wind CF |
| `wind_seasonal_wind_corr` | float | Correlation of monthly-average wind CF |
| `combined_net_load_correlation` | float | Pearson r between hourly and aggregated net load |

The paper-cited composite scores (36_detailed = 0.843, k-means
benchmark = 0.823) are from the ERA5 local-time corrected run
documented in
`timeslice_design/global_design/FINAL_SUMMARY.md`. The k-means
benchmark is not included in this CSV (it is produced by
`cluster_major_countries.py`); regenerate both to update
the scores.

### `timeslice_def_convergence_by_iso.csv`

One row per (ISO3, technology). Shows how the DEF share — the fraction
of each technology's temporal variability that is invisible to any
representative-timeslice formulation — changes from an annual single
slice (TS01) through TS12 and a near-hourly benchmark (TS288). This
quantifies the practical limit of timeslice refinement.

| Column | Type | Description |
|---|---|---|
| `iso3` | str | ISO 3166-1 alpha-3 country code |
| `technology` | str | `spv` (solar PV) or `won` (wind onshore) |
| `technology_label` | str | Plain-English label |
| `annual_mean_cf` | float | Long-run mean capacity factor |
| `def_ts01` | float | DEF share at annual resolution (TS01) — all variability invisible |
| `def_ts12` | float | DEF share remaining after TS12 aggregation |
| `def_ts288` | float | DEF share at near-hourly resolution (practical lower bound) |
| `def_reduction_pct_ts01_to_ts288` | float | Total DEF reduction achievable from TS01 to TS288 (%) |
| `def_reduction_pct_ts01_to_ts12` | float | DEF reduction achieved by TS12 alone (%) |
| `pct_of_total_improvement_captured_by_ts12` | float | `def_reduction_pct_ts01_to_ts12 / def_reduction_pct_ts01_to_ts288` × 100 |

**Reading the convergence column.** The last column answers: "of all
the DEF improvement that timeslice refinement can ever deliver, how
much does TS12 already capture?" For solar PV, this is typically
70–80% — most of solar's representable temporal structure is captured
at TS12. For wind onshore it is 25–40%, and the absolute DEF level
at TS288 remains high (≥ 0.20 for most countries), confirming that
a large fraction of wind's variability is synoptic-scale and
irrecoverable by any calendar-based representative-period approach.

---

## Usage example (Python / pandas)

```python
import pandas as pd

base = ("https://akanudia.github.io/vre_resource_asymmetry_companion/"
        "assets/data/structural/")

# Wind onshore cherry-picking uplift by R10 region
uplift = pd.read_csv(base + "supply_curve_uplift_r10.csv")
wind   = uplift[uplift.technology == "wind_onshore"]
print(wind[["region_label", "lot_n_bins", "hit_n_bins",
            "hit_top_vs_lot_mean"]].to_string(index=False))

# DEF convergence: median solar vs wind across all ISOs
conv  = pd.read_csv(base + "timeslice_def_convergence_by_iso.csv")
print(conv.groupby("technology")[
    ["def_ts01", "def_ts12", "def_ts288",
     "pct_of_total_improvement_captured_by_ts12"]
].median().round(3))
```

---

## License

All CSVs are released under CC-BY 4.0 (see `LICENSE-CONTENT` in the
[GitHub repo](https://github.com/akanudia/vre_resource_asymmetry_companion)).
Attribution: "Companion site data for Kanudia, A., 2026,
*Wind–solar resource asymmetry…*, Nature Energy."
