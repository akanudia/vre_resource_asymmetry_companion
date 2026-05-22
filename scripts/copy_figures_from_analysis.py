"""Copy figures and CSV sidecars from the structural_experiment analysis tree
into the companion site's docs/assets/ folder.

Usage:
    python scripts/copy_figures_from_analysis.py \
        --src /path/to/structural_experiment/analysis_final/output \
        --dest docs/assets

Defaults assume the script is run from the repo root with the analysis tree
sitting at a sibling-of-sibling location. Override --src to point elsewhere.

Both PDF and PNG variants are copied. PNGs are embedded inline by the site;
PDFs are linked for download.
"""

from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path

REGIONS = [
    "africa", "china", "europe", "india", "latin_am",
    "middle_east", "north_am", "pac_oecd", "ref_econ", "rest_asia",
]

WORLD_FIGURES = [
    # (source filename stem, dest folder, dest filename stem, role)
    ("fig_paired_shifts_scatter_world_vs_base", "world", "hero", "hero scatter (Fig 5)"),
    ("fig_structural_shift_world_vs_regional", "world", "world_vs_regional", "world-vs-regional (Fig 6)"),
    ("ed_fig6_magnitude_angle", "world", "ed_fig2_magnitude_angle", "ED Fig 2 (signed structural-parametric angle, world + regional bracket)"),
    ("ed_fig_saturation_angle_by_climate_world", "world", "ed_fig3_saturation_by_climate", "ED Fig 3 (saturation by climate)"),
    ("ed_fig_dominance_heatmap_supply", "world", "ed_fig_dominance_heatmap_supply", "ED Fig (supply-channel angle by region)"),
    ("ed_fig_dominance_heatmap_temporal", "world", "ed_fig_dominance_heatmap_temporal", "ED Fig (temporal-channel angle by region)"),
]

WORLD_CSVS = [
    ("magnitude_angle_world_supply.csv", "world", "magnitude_angle_world_supply.csv"),
    ("magnitude_angle_world_temporal.csv", "world", "magnitude_angle_world_temporal.csv"),
    ("magnitude_angle_world_vs_regional.csv", "world", "magnitude_angle_world_vs_regional.csv"),
]


def copy_one(src: Path, dest: Path, role: str) -> bool:
    """Copy `src` to `dest`, creating parent dirs. Returns True if copied."""
    if not src.exists():
        print(f"  MISSING  {role}: {src}", file=sys.stderr)
        return False
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(src, dest)
    print(f"  ok       {role}: {dest.relative_to(dest.parents[2])}")
    return True


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--src",
        type=Path,
        required=True,
        help="Path to structural_experiment/analysis_final/output/",
    )
    parser.add_argument(
        "--dest",
        type=Path,
        default=Path("docs/assets"),
        help="Companion site assets directory (default: docs/assets)",
    )
    args = parser.parse_args()

    src_root: Path = args.src.resolve()
    dest_root: Path = args.dest.resolve()
    ed_regional = src_root / "ED_regional"

    if not src_root.exists():
        print(f"FATAL: --src does not exist: {src_root}", file=sys.stderr)
        return 2
    if not ed_regional.exists():
        print(f"FATAL: ED_regional subfolder missing under {src_root}", file=sys.stderr)
        return 2

    figures_dest = dest_root / "figures"
    data_dest = dest_root / "data"
    figures_dest.mkdir(parents=True, exist_ok=True)
    data_dest.mkdir(parents=True, exist_ok=True)

    total_ok = 0
    total_missing = 0

    print("=== World figures ===")
    for src_stem, dest_folder, dest_stem, role in WORLD_FIGURES:
        for ext in ("pdf", "png"):
            src = src_root / f"{src_stem}.{ext}"
            dest = figures_dest / dest_folder / f"{dest_stem}.{ext}"
            if copy_one(src, dest, f"{role} ({ext})"):
                total_ok += 1
            else:
                total_missing += 1

    print()
    print("=== World CSVs ===")
    for src_name, dest_folder, dest_name in WORLD_CSVS:
        src = src_root / src_name
        dest = data_dest / dest_folder / dest_name
        if copy_one(src, dest, src_name):
            total_ok += 1
        else:
            total_missing += 1

    print()
    print("=== Regional figures ===")
    for region in REGIONS:
        for src_stem, dest_stem, role in [
            (f"fig_paired_shifts_scatter_{region}_vs_base", "paired_shifts_mini_hero",
             f"{region} paired-shifts mini-hero"),
            (f"ed_fig6_magnitude_angle_{region}", "magnitude_angle",
             f"{region} signed-θ"),
        ]:
            for ext in ("pdf", "png"):
                src = ed_regional / f"{src_stem}.{ext}"
                dest = figures_dest / "regions" / region / f"{dest_stem}.{ext}"
                if copy_one(src, dest, f"{role} ({ext})"):
                    total_ok += 1
                else:
                    total_missing += 1

    print()
    print("=== Regional CSVs ===")
    for region in REGIONS:
        for channel in ("supply", "temporal"):
            name = f"magnitude_angle_{region}_{channel}.csv"
            src = ed_regional / name
            dest = data_dest / "regions" / region / name
            if copy_one(src, dest, name):
                total_ok += 1
            else:
                total_missing += 1

    print()
    print(f"DONE: {total_ok} files copied, {total_missing} missing.")
    return 0 if total_missing == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
