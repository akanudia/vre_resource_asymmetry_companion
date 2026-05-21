"""
Build companion-site CSV dumps for the two structural input layers:

  1. Supply-curve bins — LoT (n=0.2) vs HiT (n=0.45) cluster summaries
     per R10 region and technology, plus cherry-picking uplift table.

  2. Timeslice definitions — season × hour partition for each TS level
     (TS04, TS12, TS24, TS36, TS48, TS72) plus template validation scores.

Outputs: docs/assets/data/structural/*.csv  (tidy long format, CC-BY-4.0)

Source files (read-only, in the 6kinesys_development tree):
  - re_characterization/output/n0.2_AR6R10/{region}/cluster_summary_{tech}.csv
  - re_characterization/output/n0.45_AR6R10/{region}/cluster_summary_{tech}.csv
  - kinesys_mappings.xlsx  (base_ts_design sheet)
  - timeslice_design/global_design/output/template_evaluation_scores.csv
  - re_characterization/output/country_timeslice_sensitivity.csv

Run from the companion site root:
    python scripts/build_structural_inputs.py
"""

from pathlib import Path
import pandas as pd
import numpy as np

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
THIS_FILE = Path(__file__).resolve()
COMPANION_ROOT = THIS_FILE.parent.parent


def _find_kin_root() -> Path:
    import os
    candidates = []
    if env := os.environ.get("KIN_ROOT"):
        candidates.append(Path(env))
    candidates.append(Path("C:/Veda/VerveStacks/6kinesys_development"))
    candidates.append(COMPANION_ROOT.parent / "6kinesys_development")
    candidates.append(COMPANION_ROOT.parent.parent / "VerveStacks" / "6kinesys_development")
    for c in candidates:
        if (c / "re_characterization" / "output").exists():
            return c
    raise FileNotFoundError(
        f"Could not locate 6kinesys_development tree. "
        f"Tried: {[str(c) for c in candidates]}"
    )


KIN_ROOT = _find_kin_root()
RE_OUT   = KIN_ROOT / "re_characterization" / "output"
TS_DESIGN_OUT = KIN_ROOT / "timeslice_design" / "global_design" / "output"
MAPPINGS = KIN_ROOT / "kinesys_mappings.xlsx"

OUT_DIR = COMPANION_ROOT / "docs" / "assets" / "data" / "structural"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# R10 region plain-English labels (matching the parametric inputs convention)
REGION_LABELS = {
    "R10AFRICA":     "Africa",
    "R10CHINA+":     "China+",
    "R10EUROPE":     "Europe",
    "R10INDIA+":     "India+",
    "R10LATIN_AM":   "Latin America",
    "R10MIDDLE_EAST":"Middle East",
    "R10NORTH_AM":   "North America",
    "R10PAC_OECD":   "Pacific OECD",
    "R10REF_ECON":   "Reforming Economies",
    "R10REST_ASIA":  "Rest of Asia",
}

TECH_LABELS = {
    "solar":         "Solar PV",
    "wind_onshore":  "Wind onshore",
    "wind_offshore": "Wind offshore",
}

TS_LABELS = {
    "ts_4":  "TS04",
    "ts_12": "TS12",
    "ts_24": "TS24",
    "ts_36": "TS36",
    "ts_48": "TS48",
    "ts_72": "TS72",
}


# ===========================================================================
# 1. SUPPLY-CURVE BINS
# ===========================================================================

def build_supply_curve_bins() -> tuple[pd.DataFrame, pd.DataFrame]:
    """
    Read cluster_summary_{tech}.csv for every (config, region, technology)
    and return:
      bins_df  — one row per (config, region, technology, bin_rank)
      uplift_df — one row per (region, technology) with LoT/HiT comparison
    """
    configs = {
        "LoT": RE_OUT / "n0.2_AR6R10",
        "HiT": RE_OUT / "n0.45_AR6R10",
    }
    techs = ["solar", "wind_onshore", "wind_offshore"]

    rows_bins   = []
    rows_uplift = []

    for region_dir in sorted((configs["LoT"]).iterdir()):
        region = region_dir.name

        for tech in techs:
            tech_file_name = f"cluster_summary_{tech}.csv"
            per_config = {}

            for config_label, base_dir in configs.items():
                f = base_dir / region / tech_file_name
                if not f.exists():
                    continue
                df = pd.read_csv(f)
                per_config[config_label] = df

                # Sort by descending avg_re_cf to assign bin_rank 1 = best resource
                df_sorted = df.sort_values("avg_re_cf", ascending=False).reset_index(drop=True)

                for rank, row in df_sorted.iterrows():
                    rows_bins.append({
                        "config":           config_label,
                        "r10_region":       region,
                        "region_label":     REGION_LABELS.get(region, region),
                        "technology":       tech,
                        "technology_label": TECH_LABELS.get(tech, tech),
                        "bin_rank":         rank + 1,
                        "n_cells":          int(row["n_cells"]),
                        "avg_cf":           round(row["avg_re_cf"], 4),
                        "std_cf":           round(row["std_re_cf"], 4),
                        "total_capacity_gw": round(row["total_re_capacity_mw"] / 1000, 2),
                    })

            # Compute uplift: top-bin CF of HiT vs mean CF of LoT
            if "LoT" in per_config and "HiT" in per_config:
                lot = per_config["LoT"]
                hit = per_config["HiT"]
                lot_mean_cf   = lot["avg_re_cf"].mean()
                hit_top_cf    = hit["avg_re_cf"].max()
                lot_top_cf    = lot["avg_re_cf"].max()
                hit_mean_cf   = hit["avg_re_cf"].mean()
                uplift_vs_lot_mean = (
                    round(hit_top_cf / lot_mean_cf, 3) if lot_mean_cf > 0 else None
                )
                rows_uplift.append({
                    "r10_region":         region,
                    "region_label":       REGION_LABELS.get(region, region),
                    "technology":         tech,
                    "technology_label":   TECH_LABELS.get(tech, tech),
                    "lot_n_bins":         len(lot),
                    "hit_n_bins":         len(hit),
                    "lot_mean_cf":        round(lot_mean_cf, 4),
                    "hit_mean_cf":        round(hit_mean_cf, 4),
                    "lot_top_bin_cf":     round(lot_top_cf, 4),
                    "hit_top_bin_cf":     round(hit_top_cf, 4),
                    "hit_top_vs_lot_mean": uplift_vs_lot_mean,
                })

    bins_df   = pd.DataFrame(rows_bins)
    uplift_df = pd.DataFrame(rows_uplift)
    return bins_df, uplift_df


# ===========================================================================
# 2. TIMESLICE DEFINITIONS  (from kinesys_mappings.xlsx base_ts_design)
# ===========================================================================

def build_timeslice_definitions() -> pd.DataFrame:
    """
    Parse base_ts_design sheet to produce a long-form timeslice definition
    table with one row per (ts_level, timeslice_id).
    Columns: ts_level, ts_label, timeslice_id, season_code, tod_code,
             months (list), hours_0indexed (list), n_hours, fraction_of_year.
    """
    df = pd.read_excel(MAPPINGS, sheet_name="base_ts_design")
    months_df = df[df["description"] == "month"].copy()
    hours_df  = df[df["description"] == "hour"].copy()

    ts_cols = ["ts_4", "ts_12", "ts_24", "ts_36", "ts_48", "ts_72"]
    rows = []

    for ts_col in ts_cols:
        ts_label = TS_LABELS.get(ts_col, ts_col.upper())

        # Map month -> season code
        month_to_season = dict(
            zip(months_df["sourcevalue"].astype(int), months_df[ts_col])
        )
        # Map hour (1-24) -> tod code
        hour_to_tod = dict(
            zip(hours_df["sourcevalue"].astype(int), hours_df[ts_col])
        )

        seasons = sorted(set(month_to_season.values()))
        tods    = sorted(set(hour_to_tod.values()))

        for season in seasons:
            months_in_season = sorted(
                m for m, s in month_to_season.items() if s == season
            )
            for tod in tods:
                hours_in_tod = sorted(
                    h for h, t in hour_to_tod.items() if t == tod
                )
                # n_hours = hours per day × days per year for this season
                # Approximate: count unique (month, hour) combinations × days
                days_in_season = sum(
                    [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1]
                    for m in months_in_season
                )
                n_hours = len(hours_in_tod) * days_in_season
                fraction = round(n_hours / 8760, 6)

                rows.append({
                    "ts_level":          ts_col,
                    "ts_label":          ts_label,
                    "timeslice_id":      f"{season}_{tod}",
                    "season_code":       season,
                    "tod_code":          tod,
                    "n_seasons":         len(seasons),
                    "n_tod_blocks":      len(tods),
                    "months":            str(months_in_season),
                    "hours_1indexed":    str(hours_in_tod),
                    "n_hours_per_day":   len(hours_in_tod),
                    "n_days_in_season":  days_in_season,
                    "annual_hours":      n_hours,
                    "fraction_of_year":  fraction,
                })

    return pd.DataFrame(rows)


# ===========================================================================
# 3. TIMESLICE TEMPLATE VALIDATION SCORES
# ===========================================================================

def build_template_scores() -> pd.DataFrame:
    """
    Read and clean the template evaluation scores from the timeslice_design
    analysis. Returns one row per template with composite and component scores.
    """
    src = TS_DESIGN_OUT / "template_evaluation_scores.csv"
    df = pd.read_csv(src)

    # Keep only the columns we want to release
    keep = [
        "template_name", "resolution",
        "composite_score", "demand_score", "solar_score", "wind_score",
        "combined_score",
        "demand_hourly_correlation", "demand_seasonal_shape_corr",
        "solar_solar_correlation", "wind_wind_correlation",
        "wind_seasonal_wind_corr",
        "combined_net_load_correlation",
    ]
    keep = [c for c in keep if c in df.columns]
    df = df[keep].copy()

    # Round scores
    score_cols = [c for c in df.columns if c not in ("template_name", "resolution")]
    df[score_cols] = df[score_cols].round(4)

    # Add plain-English label
    label_map = {
        "36_detailed":    "36-slice detailed (6 seasons × 6 ToD)",
        "12_equal":       "12-slice equal seasons (4 seasons × 3 ToD)",
        "24_bimonthly":   "24-slice bimonthly (6 seasons × 4 ToD)",
        "24_renewable":   "24-slice renewable-optimised (6 seasons × 4 ToD)",
        "12_load_driven": "12-slice load-driven (4 seasons × 3 ToD)",
        "12_solstice":    "12-slice solstice-based (4 seasons × 3 ToD)",
        "clustered_40":   "40-slice k-means clustering (benchmark)",
    }
    df.insert(1, "template_label", df["template_name"].map(label_map))
    df = df.sort_values("composite_score", ascending=False).reset_index(drop=True)
    return df


# ===========================================================================
# 4. TIMESLICE DEF CONVERGENCE  (per-ISO DEF share vs TS level)
# ===========================================================================

def build_def_convergence() -> pd.DataFrame:
    """
    Read country_timeslice_sensitivity.csv and return a tidy version
    showing how the DEF share (temporal-variability invisible to the
    optimizer) changes from annual (TS01) through TS12 and TS288 for
    solar and wind onshore per ISO.
    """
    src = RE_OUT / "country_timeslice_sensitivity.csv"
    df = pd.read_csv(src)
    df = df.rename(columns={
        "iso":                    "iso3",
        "technology":             "technology",
        "avg_cf":                 "annual_mean_cf",
        "annual_def":             "def_ts01",
        "ts12_def":               "def_ts12",
        "ts288_def":              "def_ts288",
        "total_improvement_pct":  "def_reduction_pct_ts01_to_ts288",
        "improvement_to_ts12_pct":"def_reduction_pct_ts01_to_ts12",
        "saturation_at_ts12_pct": "pct_of_total_improvement_captured_by_ts12",
    })
    df["technology_label"] = df["technology"].map({"spv": "Solar PV", "won": "Wind onshore"})

    numeric_cols = [
        "annual_mean_cf", "def_ts01", "def_ts12", "def_ts288",
        "def_reduction_pct_ts01_to_ts288", "def_reduction_pct_ts01_to_ts12",
        "pct_of_total_improvement_captured_by_ts12",
    ]
    df[numeric_cols] = df[numeric_cols].round(4)
    return df[[
        "iso3", "technology", "technology_label", "annual_mean_cf",
        "def_ts01", "def_ts12", "def_ts288",
        "def_reduction_pct_ts01_to_ts288",
        "def_reduction_pct_ts01_to_ts12",
        "pct_of_total_improvement_captured_by_ts12",
    ]]


# ===========================================================================
# MAIN
# ===========================================================================

def main():
    print("Building structural input CSVs...")

    print("  1/4  Supply-curve bins (LoT vs HiT)...")
    bins_df, uplift_df = build_supply_curve_bins()
    bins_path   = OUT_DIR / "supply_curve_bins_r10.csv"
    uplift_path = OUT_DIR / "supply_curve_uplift_r10.csv"
    bins_df.to_csv(bins_path,   index=False)
    uplift_df.to_csv(uplift_path, index=False)
    print(f"     -> {bins_path.name}   ({len(bins_df)} rows)")
    print(f"     -> {uplift_path.name} ({len(uplift_df)} rows)")

    print("  2/4  Timeslice definitions (TS04–TS72)...")
    ts_defs = build_timeslice_definitions()
    ts_defs_path = OUT_DIR / "timeslice_definitions_all_levels.csv"
    ts_defs.to_csv(ts_defs_path, index=False)
    print(f"     -> {ts_defs_path.name} ({len(ts_defs)} rows)")

    print("  3/4  Template validation scores...")
    scores_df = build_template_scores()
    scores_path = OUT_DIR / "timeslice_template_scores.csv"
    scores_df.to_csv(scores_path, index=False)
    print(f"     -> {scores_path.name} ({len(scores_df)} rows)")
    print("     NOTE: scores are from the version of example_with_real_data.py last run.")
    print("     The paper-cited composite scores (36_detailed=0.843, k-means=0.823)")
    print("     reflect the corrected ERA5 local-time run documented in FINAL_SUMMARY.md.")
    print("     Regenerate by re-running timeslice_design/global_design/cluster_major_countries.py")

    print("  4/4  DEF convergence by ISO and technology...")
    conv_df = build_def_convergence()
    conv_path = OUT_DIR / "timeslice_def_convergence_by_iso.csv"
    conv_df.to_csv(conv_path, index=False)
    print(f"     -> {conv_path.name} ({len(conv_df)} rows)")

    print("\nDone. Output directory:", OUT_DIR)


if __name__ == "__main__":
    main()
