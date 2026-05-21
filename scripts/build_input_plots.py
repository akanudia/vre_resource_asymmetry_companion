"""
Generate publication-quality plots of the parametric input spreads for
the companion site. Each figure shows the q25/median/q75 envelope (for
AR6-sourced layers) or the lo/mid/hi envelope (for IEA+ATB tech costs).

Inputs:  docs/assets/data/inputs/*.csv
Outputs: docs/assets/figures/inputs/*.png  (300 dpi)

Run from the companion root:
    python scripts/build_input_plots.py
"""

from pathlib import Path
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib as mpl

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
THIS_FILE = Path(__file__).resolve()
COMPANION_ROOT = THIS_FILE.parent.parent
INPUTS_DIR = COMPANION_ROOT / "docs" / "assets" / "data" / "inputs"
FIG_DIR = COMPANION_ROOT / "docs" / "assets" / "figures" / "inputs"
FIG_DIR.mkdir(parents=True, exist_ok=True)

# ---------------------------------------------------------------------------
# Style
# ---------------------------------------------------------------------------
mpl.rcParams.update({
    "figure.dpi": 110,
    "savefig.dpi": 300,
    "savefig.bbox": "tight",
    "axes.spines.top": False,
    "axes.spines.right": False,
    "axes.grid": True,
    "grid.alpha": 0.25,
    "grid.linewidth": 0.5,
    "font.size": 10,
    "axes.titlesize": 11,
    "axes.titleweight": "bold",
    "legend.frameon": False,
})

# AR6 climate-category colors — cool (ambitious) to warm (weak policy)
CATEGORY_COLORS = {
    "C1": "#1f4e79",   # deep blue
    "C2": "#3b8ea5",   # teal
    "C3": "#7fa86d",   # green
    "C4": "#d8a247",   # amber
    "C7": "#a8322d",   # red
}
CATEGORY_LABEL = {
    "C1": "C1 · 1.5°C, no/limited overshoot",
    "C2": "C2 · 1.5°C, high overshoot",
    "C3": "C3 · likely <2°C",
    "C4": "C4 · <2°C, lower probability",
    "C7": "C7 · weak policy (reference)",
}
CATEGORY_ORDER = ["C1", "C2", "C3", "C4", "C7"]

# Lo / mid / hi technology cost styling
COST_STYLE = {
    "capex_lo":  {"color": "#3b8ea5", "label": "Low (ATB Advanced × IEA mid)"},
    "capex_mid": {"color": "#1f1f1f", "label": "Mid (IEA GEC)"},
    "capex_hi":  {"color": "#a8322d", "label": "High (ATB Conservative × IEA mid)"},
}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def _global_band(df, value_col, q25_col, q75_col):
    """Aggregate across R10 regions: mean of medians and of quartiles."""
    g = df.groupby(["ar6_category", "year"], as_index=False).agg(
        median=(value_col, "mean"),
        q25=(q25_col, "mean"),
        q75=(q75_col, "mean"),
    )
    return g


def _draw_category_bands(ax, df, value_col, q25_col, q75_col, ylabel, title, log=False):
    g = _global_band(df, value_col, q25_col, q75_col)
    for cat in CATEGORY_ORDER:
        sub = g[g["ar6_category"] == cat].sort_values("year")
        color = CATEGORY_COLORS[cat]
        ax.fill_between(sub["year"], sub["q25"], sub["q75"], color=color, alpha=0.15)
        ax.plot(sub["year"], sub["median"], color=color, linewidth=2.0,
                label=CATEGORY_LABEL[cat])
    ax.set_xlabel("Year")
    ax.set_ylabel(ylabel)
    ax.set_title(title, loc="left")
    if log:
        ax.set_yscale("log")
    ax.margins(x=0.02)


# ---------------------------------------------------------------------------
# 1. Carbon prices
# ---------------------------------------------------------------------------
def plot_carbon_prices():
    df = pd.read_csv(INPUTS_DIR / "carbon_prices_by_region_scenario.csv")
    fig, ax = plt.subplots(figsize=(8.5, 5.0))
    _draw_category_bands(
        ax, df, "median_price", "q25_price", "q75_price",
        ylabel="Carbon price (USD2010 / tCO2)",
        title="Carbon-price trajectories — AR6 climate categories\nshaded: cross-region mean of q25–q75; line: cross-region mean of medians",
    )
    ax.legend(loc="upper left", fontsize=8.5)
    out = FIG_DIR / "carbon_prices.png"
    fig.savefig(out)
    plt.close(fig)
    return out


# ---------------------------------------------------------------------------
# 2. Fuel prices (gas + biomass side by side)
# ---------------------------------------------------------------------------
def plot_fuel_prices():
    df = pd.read_csv(INPUTS_DIR / "fuel_prices_by_region_scenario.csv")
    fig, axes = plt.subplots(1, 2, figsize=(12.5, 5.0), sharey=False)
    for ax, fuel in zip(axes, ["gas", "biomass"]):
        sub = df[df["fuel"] == fuel]
        _draw_category_bands(
            ax, sub, "median_price", "q25_price", "q75_price",
            ylabel="Fuel price (USD2010 / GJ)",
            title=f"{fuel.title()} — AR6 climate categories",
        )
    axes[0].legend(loc="upper left", fontsize=8.5)
    fig.suptitle("Fuel-price trajectories", y=1.02, x=0.5, fontsize=12, fontweight="bold")
    out = FIG_DIR / "fuel_prices.png"
    fig.savefig(out)
    plt.close(fig)
    return out


# ---------------------------------------------------------------------------
# 3. Demand (elec_total, global sum across R10)
# ---------------------------------------------------------------------------
def plot_demand():
    df = pd.read_csv(INPUTS_DIR / "demands_twh_by_region_scenario.csv")
    df = df[df["demand_variable"] == "elec_total"]
    # Global sum across regions (per category × year)
    g = df.groupby(["ar6_category", "year"], as_index=False).agg(
        median=("median_twh", "sum"),
        q25=("q25_twh", "sum"),
        q75=("q75_twh", "sum"),
    )

    fig, ax = plt.subplots(figsize=(8.5, 5.0))
    for cat in CATEGORY_ORDER:
        sub = g[g["ar6_category"] == cat].sort_values("year")
        color = CATEGORY_COLORS[cat]
        ax.fill_between(sub["year"], sub["q25"], sub["q75"], color=color, alpha=0.15)
        ax.plot(sub["year"], sub["median"], color=color, linewidth=2.0,
                label=CATEGORY_LABEL[cat])
    ax.set_xlabel("Year")
    ax.set_ylabel("Global electricity demand (TWh / yr)")
    ax.set_title("Global total electricity demand — AR6 climate categories\n"
                 "shaded: sum-of-regional q25–q75; line: sum of regional medians",
                 loc="left")
    ax.legend(loc="upper left", fontsize=8.5)
    ax.margins(x=0.02)
    out = FIG_DIR / "demand_electricity.png"
    fig.savefig(out)
    plt.close(fig)
    return out


# ---------------------------------------------------------------------------
# 4. Tech costs — 2x2 grid of representative technologies (US region)
# ---------------------------------------------------------------------------
def plot_tech_costs():
    df = pd.read_csv(INPUTS_DIR / "tech_costs_by_region_year.csv")

    techs = [
        ("en_solar_pv",     "Solar PV (utility-scale)"),
        ("en_wind_onshore", "Wind onshore"),
        ("en_gas_ccgt",     "Gas CCGT"),
        ("en_battery_4h",   "Battery storage (4-hour)"),
    ]
    fig, axes = plt.subplots(2, 2, figsize=(12.5, 8.5), sharex=False)
    for ax, (tech, label) in zip(axes.flat, techs):
        sub = df[df["technology"] == tech]
        # Plot all 9 IEA regions in light grey for "mid"
        for reg in sub["iea_region"].unique():
            r = sub[sub["iea_region"] == reg].sort_values("year")
            ax.plot(r["year"], r["capex_mid"], color="#bbbbbb", linewidth=1.0, alpha=0.7)
        # Highlight US lo/mid/hi
        us = sub[sub["iea_region"] == "ieapg_united_states"].sort_values("year")
        if not us.empty:
            ax.fill_between(us["year"], us["capex_lo"], us["capex_hi"],
                             color=COST_STYLE["capex_mid"]["color"], alpha=0.12,
                             label="US lo–hi envelope")
            ax.plot(us["year"], us["capex_mid"], color=COST_STYLE["capex_mid"]["color"],
                    linewidth=2.2, label="US mid (IEA GEC)")
            ax.plot(us["year"], us["capex_lo"], color=COST_STYLE["capex_lo"]["color"],
                    linewidth=1.3, linestyle="--", label="US low (ATB Advanced)")
            ax.plot(us["year"], us["capex_hi"], color=COST_STYLE["capex_hi"]["color"],
                    linewidth=1.3, linestyle="--", label="US high (ATB Conservative)")
        ax.set_title(label, loc="left")
        ax.set_xlabel("Year")
        ax.set_ylabel("Capex (USD2022 / kW)")
        ax.margins(x=0.02)
        ax.set_ylim(bottom=0)

    axes[0, 0].legend(loc="upper right", fontsize=8.0)
    fig.suptitle("Technology capex — IEA GEC (regional mid) + ATB (US lo/hi)\n"
                 "grey lines: nine IEA regions, mid cost",
                 y=1.00, fontsize=12, fontweight="bold")
    fig.tight_layout()
    out = FIG_DIR / "tech_costs.png"
    fig.savefig(out)
    plt.close(fig)
    return out


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    print(f"Output: {FIG_DIR}\n")
    for fn in (plot_carbon_prices, plot_fuel_prices, plot_demand, plot_tech_costs):
        out = fn()
        print(f"  wrote {out.name}")
    print("\nDone.")


if __name__ == "__main__":
    main()
