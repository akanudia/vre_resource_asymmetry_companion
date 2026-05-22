# Code & reproducibility

This page lists everything released alongside the paper that lets a reader
inspect, reproduce, or extend the analysis. The structural-attribution
result rests on three layers — *parametric and structural inputs*, *the
1{,}080-run model archive*, and *analysis scripts that derive figures and
statistics from the archive* — and the layers released here cover the
inspection, validation and re-analysis paths a reviewer or downstream
modeller will typically want.

The boundary between what is released and what is not is described
explicitly in the [What's not released](#whats-not-released) section
below; in short, every post-run analysis artefact is open, while the
proprietary orchestration pipeline that constructs the 1{,}080-run
archive remains internal.

---

## What's released

### Data

| Layer | Where | Format | License |
|---|---|---|---|
| Parametric input data | [Inputs page](inputs.md) → linked CSVs | CSV | CC-BY 4.0 |
| Structural input data | [Structural inputs page](structural_inputs.md) → linked CSVs | CSV | CC-BY 4.0 |
| Source data references | [Data sources page](data_sources.md) | bibliographic | (each upstream source carries its own licence) |
| 1{,}080-run model input files (TIMES syntax) | Zenodo archive on publication | `.dd` / `.dds` | MIT (model files) |
| 1{,}080-run scenario output database | Zenodo archive on publication | CSV / Parquet | CC-BY 4.0 |
| Companion-site CSV sidecars (figure-level data) | [Data tables page](data.md) | CSV | CC-BY 4.0 |
| Companion-site figures | this site | PNG + PDF | CC-BY 4.0 |

!!! note "Compact input footprint"
    The four base TIMES models that VS-G builds for the
    R10/R70 × LoT/HiT structural-axis combinations are each fully
    specified by 4–5 Excel input files. The entire 1,080-run
    experimental archive is therefore parameterised by ~20 input
    spreadsheets in total — a deliberately economical surface designed
    to keep the controlled-factorial design auditable end-to-end.
    VEDA then orchestrates the 45-scenario parametric envelope on top
    of those base models.

### Code

All analysis scripts that produce the figures and statistics in the
paper are released. The index in the next section names each script and
what it does.

The proprietary model-generation pipeline is described conceptually on
the [methodology](methodology.md) and [structural inputs](structural_inputs.md)
pages, but its source is not part of this release.
[Why](#whats-not-released).

---

## Analysis script index

All scripts below run against the released 1{,}080-run scenario outputs
(or, for the physical diagnostics, against ERA5 reanalysis through
Atlite). None of them call into the model-generation pipeline.

### Physical diagnostics (Section 1 of the paper)

| Script | Produces | One-line description |
|---|---|---|
| `band_palette.py` | shared module | Five-band frequency decomposition primitive consumed by all band-aware scripts. |
| `fig_spatial_cv_raincloud.py` | Fig 1 | Per-country, per-year KDE of cell-CF coefficient of variation, with 2013 reference highlighted. |
| `variance_composition_country_bars.py` | Fig 2 | Stacked five-band variance composition for solar, wind onshore, wind offshore, and electricity demand across the R70 country sample. |
| `demand_resource_alignment.py` | Fig 3 sidecar | Per-country, per-band Pearson correlations between demand and renewable capacity factors. |
| `alignment_physics_scatter.py` | Fig 4 | Demand-resource alignment landscape: diurnal-band and seasonal-band scatter of (solar, wind onshore) Pearson correlations. |
| `alignment_mechanism_full.py` | Fig 4 supplementary | Country × year robustness scatter of the alignment landscape across ERA5 weather years. |
| `demand_variance_decomposition.py` | Fig 2 demand panel | Five-band decomposition applied directly to country-level demand series. |

### Structural-attribution results (Section 2 of the paper)

| Script | Produces | One-line description |
|---|---|---|
| `export_costs_emissions.py` | `horizon_metrics_regional.csv` | Aggregate the 1{,}080-run scenario outputs to the 2030--2050 horizon: cumulative wind, cumulative solar, NPV cost, cumulative emissions. |
| `export_elec_prices.py` | `elec_prices_regional.csv` | Production-weighted average electricity prices per region × scenario × structural variant. |
| `export_nonvre_cf.py` | `nonvre_cf_regional.csv` | Non-VRE capacity-factor utilisation diagnostic for the residual non-wind, non-solar, non-storage fleet. |
| `export_quant_headline.py` | `quant_headline_long.csv`, summary CSVs | Build the long-form paired-comparison table that feeds the rivals/dominance headline numbers (30% / 16%) and the dominance-heatmap figures. |
| `fig_paired_shifts_scatter_world_vs_base.py` | Fig 5 (hero), regional companions | Paired structural-vs-parametric scatter for the five Fig 5 outcomes, at world aggregate and for each R10 region. |
| `fig_structural_shift_world_vs_regional.py` | Fig 6 | World-row + 10 regional rows of within-cell structural-shift distributions, per outcome × channel. |
| `fig_validation.py` | Fig 7 | Benchmark of VS-G R70 generation by technology against the AR6 ensemble at 2035 and 2050. |
| `make_ed_regional_figures.py` | Extended Data, 10× regional figure pairs | Driver that wraps the world-vs-base scatter and the angle diagnostic to emit one figure set per R10 region. |

### Signed structural-parametric angle diagnostics (Extended Data)

| Script | Produces | One-line description |
|---|---|---|
| `fig_magnitude_angle_world.py` | ED Fig 2 | World-aggregate signed structural-parametric angle θ for each (outcome × channel × climate) cell, with regional spread bracket. |
| `fig_magnitude_angle_temporal_saturation.py` | ED Fig 5 | Same angle diagnostic stratified by climate ambition, with the full TS04→TS72 saturation sweep. |
| `fig_dominance_heatmap.py` | ED Figs 3, 4 | Regional decomposition of the angle diagnostic: one box-whisker per (region × climate × outcome) cell, one figure per channel. |
| `fig_cherry_picking_uplift.py` | ED Fig 1 | Top-10% / mean cell-CF uplift for solar and wind across ERA5 weather years; the falsification-test exhibit. |
| `fig_paired_shifts_scatter_vre_nonvrecf_world.py` | ED non-VRE CF panel | Companion scatter that adds non-VRE capacity factor to the Fig 5 outcome set. |

### Companion-site build scripts

| Script | Produces | One-line description |
|---|---|---|
| `build_parametric_inputs.py` | CSVs in `docs/assets/data/inputs/` | Reformats the upstream AR6 + IEA + ATB parametric inputs into the tidy-long CSVs released on the [inputs page](inputs.md). |
| `build_structural_inputs.py` | CSVs in `docs/assets/data/structural/` | Reformats the pipeline's structural-axis outputs (supply-curve bins, timeslice partitions, validation scores, DEF convergence) into companion-site CSVs. |
| `build_input_plots.py` | PNGs in `docs/assets/figures/inputs/` | Renders the parametric-input embed plots used on the [inputs page](inputs.md). |
| `copy_figures_from_analysis.py` | refreshes `docs/assets/figures/` | Pulls figure outputs from the analysis tree into the companion-site asset folders. |

---

## How to reproduce a specific result

A worked example. Reproducing the hero figure (Fig 5) at world aggregate:

```bash
# 1. Download the consolidated scenario output table from Zenodo:
wget https://zenodo.org/.../quant_headline_long.csv  # (DOI placeholder)

# 2. Clone the analysis bundle:
git clone https://github.com/akanudia/structural_experiment.git
cd structural_experiment/analysis_final

# 3. Run the figure script:
python fig_paired_shifts_scatter_world_vs_base.py
# Output: output/fig_paired_shifts_scatter_world_vs_base.pdf
```

The same pattern applies to every script in the index above: the
analysis bundle plus the released CSV outputs are sufficient to
regenerate every figure and statistic in the paper.

The rivals/dominance headline numbers (30 % at $|\theta| \ge 26.6^\circ$,
16 % at $|\theta| > 45^\circ$ across mitigation-regime R10 cells) are
emitted by `export_quant_headline.py` from the same `horizon_metrics_regional.csv`
input and printed to `quant_headline.md` for inspection.

---

## What's not released

The companion-site contents, the released model input files (TIMES
syntax) and the released scenario outputs are *sufficient to reproduce
any specific run*. They are not sufficient to *rebuild the 1{,}080-run
factorial from scratch*, because that requires the proprietary
KanORS-EMR orchestration pipeline (VEDA / VEDA-Online), which is not
part of this release.

The boundary is:

- **Released** — every post-run analysis script that operates on the
  scenario outputs (the analysis bundle in this page's index), every
  model input file generated by the pipeline (TIMES syntax for each of
  the 24 structural variants), and every released CSV / figure on this
  companion site.
- **Not released** — the orchestration code that ingests source data,
  constructs the supply-curve bins, assembles the timeslice partitions,
  emits the 24 structural variants, and dispatches the 1{,}080-run
  factorial.

The reasoning: the model itself is fully inspectable and runnable
through public TIMES tools using the released model files; what is
proprietary is the workflow that scales the construction of variants
across the full experimental cube. The orchestration pipeline is
available on commercial terms from
[KanORS-EMR](https://www.kanors-emr.org/).

The same boundary is stated in the manuscript's Data Availability
section; this page restates it for the general companion-site reader.

---

## Bundling

When the paper is accepted:

- The full analysis bundle will be released as a tagged GitHub release
  (`structural_experiment` repo on
  [github.com/akanudia](https://github.com/akanudia)).
- The 1{,}080-run model input files (TIMES syntax) and scenario output
  database will be deposited on Zenodo with a permanent DOI.
- The companion-site source (this Markdown + assets + build scripts)
  will be released as a separate GitHub repository
  ([vre_resource_asymmetry_companion](https://github.com/akanudia/vre_resource_asymmetry_companion)).

Pre-acceptance, contact the corresponding author for working snapshots
of any of the above.

---

## Licence

Analysis code is MIT-licensed; released data and figures are
CC-BY 4.0-licensed (see `LICENSE` and `LICENSE-CONTENT` in the
[companion-site GitHub repo](https://github.com/akanudia/vre_resource_asymmetry_companion)).
Upstream source-data citations carry the licences of their respective
providers; see the [Data sources](data_sources.md) page for a full
acknowledgement list.
