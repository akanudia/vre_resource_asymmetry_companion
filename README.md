# Wind–solar resource asymmetry — companion site

Companion site for the Nature Energy manuscript
*"Wind–solar resource asymmetry: how model resolution choices shape technology mix, cost and emissions"*.

This site hosts the full regional evidentiary base behind the manuscript's
hero figure (Fig 5) and ED Fig 2 (signed structural dominance angle, world vs
regional spread), released alongside the code and data.

## Before deploying

Replace `akanudia` with your actual GitHub handle in:

- `mkdocs.yml` — `site_url` and `repo_url` fields
- this README

A quick find-and-replace across the tree:

```bash
grep -rl "akanudia" . | xargs sed -i 's/akanudia/your-handle/g'
```

## Build locally

```bash
pip install -r requirements.txt
mkdocs serve
```

Open <http://127.0.0.1:8000>.

## Deploy

Push to the `main` branch of `github.com/akanudia/vre_resource_asymmetry_companion`;
the GitHub Actions workflow at `.github/workflows/build.yml` will build and
deploy to the `gh-pages` branch automatically. GitHub Pages must be enabled
in the repo settings (Pages → Source → `gh-pages` branch, root).

## Sync figures from the analysis tree

Figures and CSV sidecars live in the `structural_experiment` source tree
(not in this repo). To pull in the latest renders:

```bash
python scripts/copy_figures_from_analysis.py \
  --src /path/to/structural_experiment/analysis_final/output \
  --dest docs/assets
```

The script copies the world figures, the 10 regional mini-hero scatters, the
10 regional signed-θ figures, and the CSV sidecars into the right
subfolders under `docs/assets/`.

## Layout

```
docs/
├── index.md                              landing
├── methodology.md                        experimental design + how to read θ
├── world.md                              world hero + ED Fig 2
├── regions/
│   ├── index.md                          regional overview / nav
│   ├── gallery.md                        flat gallery of all 20 regional figures
│   ├── india.md                          worked example (full prose)
│   └── {africa,china,europe,...}.md      stubs for Phase 2
├── data.md                               CSV index
├── cite.md                               citation block
└── assets/
    ├── figures/{world,regions/<region>}/   PNG + PDF for each figure
    ├── data/{world,regions/<region>}/      CSV sidecars
    └── css/custom.css                      minor theme tweaks
```

## License

- Build code (`scripts/`, `mkdocs.yml`, workflow): MIT (`LICENSE`).
- Content (prose, figures, captions): CC-BY 4.0 (`LICENSE-CONTENT`).
- Data (CSVs): same DOI as the manuscript supplementary; treat as CC-BY 4.0 with attribution.
