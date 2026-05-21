"""
Build companion-site CSV dumps for the four parametric input layers:

  1. Electricity demand (TWh) by R10 region, AR6 climate category, year
  2. Fuel prices by R10 region, AR6 climate category, year (gas, biomass; coal, oil for completeness)
  3. Carbon prices by R10 region, AR6 climate category, year
  4. Technology capex/O&M by IEA region, year (lo / mid / hi from IEA+ATB construction)

Output: docs/assets/data/inputs/*.csv  (tidy long format, CC-BY-4.0)

Source files (read-only, in the 6kinesys_development tree):
  - scenario_drivers/output/AR6_demand_downscaled_ar6r10.csv
  - scenario_drivers/output/ar6_r10_scenario_drivers.csv
  - conv_tech_characterization/unified_reference_costs.csv

Run from the companion site root:
    python scripts/build_parametric_inputs.py
"""

from pathlib import Path
import pandas as pd

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
THIS_FILE = Path(__file__).resolve()
COMPANION_ROOT = THIS_FILE.parent.parent


def _find_kin_root() -> Path:
    """
    Locate the 6kinesys_development source tree across environments.
    Tries (in order):
      - C:/Veda/VerveStacks/6kinesys_development     (native Windows layout)
      - <session mount root>/6kinesys_development    (Cowork-mode Linux mounts)
      - <COMPANION_ROOT>/../../VerveStacks/6kinesys_development
      - env var KIN_ROOT
    """
    import os
    candidates = []
    if env := os.environ.get("KIN_ROOT"):
        candidates.append(Path(env))
    # Native Windows
    candidates.append(Path("C:/Veda/VerveStacks/6kinesys_development"))
    # Sibling-mount layout (Cowork): companion root and 6kinesys_development are siblings
    candidates.append(COMPANION_ROOT.parent / "6kinesys_development")
    # ../../VerveStacks/6kinesys_development from companion root
    candidates.append(COMPANION_ROOT.parent.parent / "VerveStacks" / "6kinesys_development")
    for c in candidates:
        if (c / "scenario_drivers" / "output").exists():
            return c
    raise FileNotFoundError(
        f"Could not locate 6kinesys_development tree. Tried: {[str(c) for c in candidates]}"
    )


KIN_ROOT = _find_kin_root()
DRIVERS_OUT = KIN_ROOT / "scenario_drivers" / "output"
COSTS_FILE = KIN_ROOT / "conv_tech_characterization" / "unified_reference_costs.csv"

OUT_DIR = COMPANION_ROOT / "docs" / "assets" / "data" / "inputs"
OUT_DIR.mkdir(parents=True, exist_ok=True)

EJ_PER_YR_TO_TWH = 277.778  # 1 EJ/yr = 277.778 TWh/yr

# Climate-category descriptions, kept consistent with the methods section
CATEGORY_LABEL = {
    "C1": "1.5°C, no/limited overshoot",
    "C2": "1.5°C, high overshoot",
    "C3": "Likely below 2°C",
    "C4": "Below 2°C with lower probability",
    "C7": "High-warming weak-policy (reference)",
}

# Friendly R10 region labels (match the existing companion-site convention)
REGION_LABEL = {
    "R10AFRICA": "Africa",
    "R10CHINA+": "China",
    "R10EUROPE": "Europe",
    "R10INDIA+": "India",
    "R10LATIN_AM": "Latin America",
    "R10MIDDLE_EAST": "Middle East",
    "R10NORTH_AM": "North America",
    "R10PAC_OECD": "Pacific OECD",
    "R10REF_ECON": "Reforming Economies",
    "R10REST_ASIA": "Rest of Asia",
    "R10ROWO": "Rest of World",
}


# ---------------------------------------------------------------------------
# 1. Electricity demand (TWh)
# ---------------------------------------------------------------------------
def build_demands() -> pd.DataFrame:
    src = pd.read_csv(DRIVERS_OUT / "AR6_demand_downscaled_ar6r10.csv")

    # Keep electricity-related variables only.
    keep_vars = [
        "elec_total",
        "elec_buildings",
        "elec_industry",
        "elec_transport",
        "h2_from_electrolysis",
    ]
    src = src[src["variable"].isin(keep_vars)].copy()

    # Filter to the 5 climate categories used in the experiment.
    src = src[src["category"].isin(CATEGORY_LABEL)].copy()

    # Convert EJ/yr -> TWh/yr for elec / hydrogen variables.
    for col in ["median", "q25", "q75", "mean"]:
        src[col] = (src[col] * EJ_PER_YR_TO_TWH).round(2)

    out = src.rename(columns={
        "variable": "demand_variable",
        "region": "r10_region",
        "category": "ar6_category",
        "median": "median_twh",
        "q25": "q25_twh",
        "q75": "q75_twh",
        "count_clean": "n_scenarios",
    })[[
        "demand_variable", "r10_region", "ar6_category", "year",
        "median_twh", "q25_twh", "q75_twh", "n_scenarios",
    ]]

    out["region_label"] = out["r10_region"].map(REGION_LABEL)
    out["category_label"] = out["ar6_category"].map(CATEGORY_LABEL)
    out["unit"] = "TWh/yr"

    out = out[[
        "demand_variable", "r10_region", "region_label",
        "ar6_category", "category_label", "year",
        "median_twh", "q25_twh", "q75_twh", "unit", "n_scenarios",
    ]].sort_values([
        "demand_variable", "r10_region", "ar6_category", "year",
    ]).reset_index(drop=True)

    return out


# ---------------------------------------------------------------------------
# 2. Fuel prices (gas, biomass; coal, oil for completeness)
# ---------------------------------------------------------------------------
def build_fuel_prices() -> pd.DataFrame:
    src = pd.read_csv(DRIVERS_OUT / "ar6_r10_scenario_drivers.csv")

    fuel_map = {
        "Gas price": "gas",
        "Biomass price": "biomass",
        "Coal price": "coal",        # included for completeness; not varied as a parametric axis
        "Oil price": "oil",          # included for completeness; not varied as a parametric axis
    }
    src = src[src["attribute"].isin(fuel_map)].copy()
    src = src[src["Category"].isin(CATEGORY_LABEL)].copy()
    src["fuel"] = src["attribute"].map(fuel_map)

    out = src.rename(columns={
        "Region": "r10_region",
        "Category": "ar6_category",
        "Year": "year",
        "median": "median_price",
        "q25": "q25_price",
        "q75": "q75_price",
        "count": "n_scenarios",
    })[[
        "fuel", "r10_region", "ar6_category", "year",
        "median_price", "q25_price", "q75_price", "n_scenarios",
    ]]

    out["region_label"] = out["r10_region"].map(REGION_LABEL)
    out["category_label"] = out["ar6_category"].map(CATEGORY_LABEL)
    out["unit"] = "USD2010/GJ"

    out = out[[
        "fuel", "r10_region", "region_label",
        "ar6_category", "category_label", "year",
        "median_price", "q25_price", "q75_price", "unit", "n_scenarios",
    ]].sort_values([
        "fuel", "r10_region", "ar6_category", "year",
    ]).reset_index(drop=True)

    return out


# ---------------------------------------------------------------------------
# 3. Carbon prices
# ---------------------------------------------------------------------------
def build_carbon_prices() -> pd.DataFrame:
    src = pd.read_csv(DRIVERS_OUT / "ar6_r10_scenario_drivers.csv")
    src = src[src["attribute"] == "CO2 price"].copy()
    src = src[src["Category"].isin(CATEGORY_LABEL)].copy()

    out = src.rename(columns={
        "Region": "r10_region",
        "Category": "ar6_category",
        "Year": "year",
        "median": "median_price",
        "q25": "q25_price",
        "q75": "q75_price",
        "count": "n_scenarios",
    })[[
        "r10_region", "ar6_category", "year",
        "median_price", "q25_price", "q75_price", "n_scenarios",
    ]]

    out["region_label"] = out["r10_region"].map(REGION_LABEL)
    out["category_label"] = out["ar6_category"].map(CATEGORY_LABEL)
    out["unit"] = "USD2010/tCO2"

    out = out[[
        "r10_region", "region_label",
        "ar6_category", "category_label", "year",
        "median_price", "q25_price", "q75_price", "unit", "n_scenarios",
    ]].sort_values([
        "r10_region", "ar6_category", "year",
    ]).reset_index(drop=True)

    return out


# ---------------------------------------------------------------------------
# 4. Technology costs (IEA + ATB)
# ---------------------------------------------------------------------------
def build_tech_costs() -> pd.DataFrame:
    src = pd.read_csv(COSTS_FILE)

    # Pivot capex_lo/mid/hi to columns, keep fixed_om/efficiency/capacity_factor as separate rows.
    capex = src[src["parameter"].isin(["capex_lo", "capex_mid", "capex_hi"])].copy()
    capex_wide = capex.pivot_table(
        index=["variable", "region", "year", "unit"],
        columns="parameter",
        values="value",
        aggfunc="first",
    ).reset_index()
    capex_wide = capex_wide.rename(columns={
        "variable": "technology",
        "region": "iea_region",
        "capex_lo": "capex_lo",
        "capex_mid": "capex_mid",
        "capex_hi": "capex_hi",
    })
    capex_wide["parameter"] = "capex"

    # Bring in operational parameters as a separate frame, pivoted into named columns.
    op = src[src["parameter"].isin(["fixed_om", "efficiency", "capacity_factor"])].copy()
    op_wide = op.pivot_table(
        index=["variable", "region", "year"],
        columns="parameter",
        values="value",
        aggfunc="first",
    ).reset_index().rename(columns={"variable": "technology", "region": "iea_region"})

    out = capex_wide.merge(op_wide, on=["technology", "iea_region", "year"], how="left")

    # Friendly columns first
    out = out[[
        "technology", "iea_region", "year",
        "capex_lo", "capex_mid", "capex_hi",
        "fixed_om", "efficiency", "capacity_factor",
        "unit",
    ]].sort_values(["technology", "iea_region", "year"]).reset_index(drop=True)

    return out


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    print(f"Source dir : {DRIVERS_OUT}")
    print(f"Costs file : {COSTS_FILE}")
    print(f"Output dir : {OUT_DIR}")
    print()

    demands = build_demands()
    demands.to_csv(OUT_DIR / "demands_twh_by_region_scenario.csv", index=False)
    print(f"  demands           : {len(demands):>6,} rows  -> demands_twh_by_region_scenario.csv")

    fuels = build_fuel_prices()
    fuels.to_csv(OUT_DIR / "fuel_prices_by_region_scenario.csv", index=False)
    print(f"  fuel prices       : {len(fuels):>6,} rows  -> fuel_prices_by_region_scenario.csv")

    co2 = build_carbon_prices()
    co2.to_csv(OUT_DIR / "carbon_prices_by_region_scenario.csv", index=False)
    print(f"  carbon prices     : {len(co2):>6,} rows  -> carbon_prices_by_region_scenario.csv")

    costs = build_tech_costs()
    costs.to_csv(OUT_DIR / "tech_costs_by_region_year.csv", index=False)
    print(f"  technology costs  : {len(costs):>6,} rows  -> tech_costs_by_region_year.csv")

    print("\nDone.")


if __name__ == "__main__":
    main()
def main():
    print(f"Source dir : {DRIVERS_OUT}")
    print(f"Costs file : {COSTS_FILE}")
    print(f"Output dir : {OUT_DIR}")
    print()

    demands = build_demands()
    demands.to_csv(OUT_DIR / "demands_twh_by_region_scenario.csv", index=False)
    print(f"  demands           : {len(demands):>6,} rows  -> demands_twh_by_region_scenario.csv")

    fuels = build_fuel_prices()
    fuels.to_csv(OUT_DIR / "fuel_prices_by_region_scenario.csv", index=False)
    print(f"  fuel prices       : {len(fuels):>6,} rows  -> fuel_prices_by_region_scenario.csv")

    co2 = build_carbon_prices()
    co2.to_csv(OUT_DIR / "carbon_prices_by_region_scenario.csv", index=False)
    print(f"  carbon prices     : {len(co2):>6,} rows  -> carbon_prices_by_region_scenario.csv")

    costs = build_tech_costs()
    costs.to_csv(OUT_DIR / "tech_costs_by_region_year.csv", index=False)
    print(f"  technology costs  : {len(costs):>6,} rows  -> tech_costs_by_region_year.csv")

    print("\nDone.")


if __name__ == "__main__":
    main()
