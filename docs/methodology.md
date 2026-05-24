# Methodology

!!! abstract "Sources & provenance"
    **Manuscript:** Methods § all subsections (experimental design,
    parametric envelope, structural variants, physical diagnostics,
    paired-shift diagnostics, signed structural–parametric angle).  
    **External data:** [IPCC AR6 WGIII Scenarios Database](data_sources.md#ar6),
    [IEA GEC (WEO 2023)](data_sources.md#iea-gec),
    [NREL ATB 2024 v3](data_sources.md#nrel-atb),
    [ERA5 reanalysis](data_sources.md#era5),
    [Atlite library](data_sources.md#atlite).  
    **Companion-only:** the experiment-design narrative, the
    threshold-convention reading guide for the signed
    structural–parametric angle, and the cross-references to per-figure
    pages on this site extend the manuscript Methods with
    reader-friendly framings; no quantitative claims appear here that
    are not derivable from the manuscript and the listed sources.

This page sketches the experimental design, the two structural channels, and
the diagnostic used to summarise structural-shift behaviour cell-by-cell. The
manuscript Methods section is the authoritative reference; this is a reader's
companion to the figures hosted on this site.

## The 1,080-instance controlled factorial

This study regenerates 24 structurally distinct global power-sector
representations from a common source-data base covering 155+ countries
(atmospheric resources, technology costs, fuel prices, demand drivers,
climate-policy trajectories), following the global-scale extension of
the
[VerveStacks](https://vervestacks.readthedocs.io/en/latest/index.html)
methodology and run here in **power-sector-isolated** configuration.
[VEDA](https://kanors-emr.github.io/Veda-documentation/) manages the
parametric scenario envelope on each variant, producing the **1,080-run
experimental archive**. The resulting global power-sector model archive
and workspace — the 24 generated structural variants together with
their scenario outputs — is what we refer to in this paper as
**VerveStacks-G** (VS-G):

- **Parametric scenarios** vary external assumptions: 5 climate ambition
  levels (C1, C2, C3, C4, C7, corresponding to carbon-price trajectories) ×
  3 technology costs (Hi, Base, Lo) × 3 fuel prices (q25, median, q75) =
  **45 parametric scenarios**.
- **Structural variants** vary model representation choices: 6 timeslice
  resolutions (TS04, TS12, TS24, TS36, TS48, TS72) × 2 supply-curve detail
  levels (LoT with 4–5 cost-ordered tranches per technology per country, HiT
  with ~30 tranches) × 2 regional aggregations (R10 macro-regions following
  IPCC AR6 WGIII; R70 with 62 modelled countries + 8 rest-of-region
  aggregates) = **24 structural variants**.
- All combinations are filled: 45 × 24 = **1,080 model runs**, balanced, with
  no confounding.

Because every run is generated from the same repository, **structural axes
are isolated from cross-framework data drift by construction**: any two runs
in the design differ only in the structural factor under test. This is the
methodological move that makes the channel signatures identifiable.

## The two structural channels

This site centres on two structural axes that act as primary channels through
which resource asymmetry biases modelled outcomes:

**Supply-curve detail (LoT → HiT).** Coarse supply curves underrepresent the
high-quality tail of within-country resource distributions. Refining the
supply-curve structure exposes the tail and reshuffles the wind–solar cost
balance. The signature is **consistent in sign across regions** because wind
typically has wider within-country resource-quality dispersion than solar
(cherry-picking uplift 1.3–3.5× for onshore wind vs 1.0–1.3× for solar): finer
supply curves favour wind almost everywhere with active deployment headroom.

**Temporal resolution (TS04 → TS72).** Coarse timeslice schemes underrepresent
the value of resources whose hourly profile is well-aligned with hourly
demand. Refining the temporal scheme exposes this value-of-alignment signal,
which is **region-dependent in sign**: in heating-driven regions, demand
peaks coincide with low-solar / high-wind seasons and finer timeslices favour
wind; in cooling-driven regions, demand peaks coincide with high-solar
seasons and finer timeslices favour solar.

The **third axis** in the factorial — regional aggregation (R10 vs R70) — is
included as a *robustness dimension* rather than a primary channel: it tests
whether the two channels operate consistently across the regional-aggregation
scales typical of integrated assessment modelling (R10) and detailed national
modelling (R70).

## The signed structural–parametric angle

Each model run is paired with a sibling that differs only in the structural
axis under test (LoT vs HiT for the supply channel, TS04 vs TS72 for the
temporal channel). The shift is measured as % of the C7-Base-median anchor
to make it commensurable across outcomes and regions.

For each pair we compute a single scalar that summarises **how large the
structural shift is, relative to the parametric distance of the same point
from the C7-Base-median anchor**, and **which direction it goes**:

$$
\theta = \mathrm{atan2}\bigl(\text{structural shift},\ |\text{parametric shift}|\bigr)
\quad\in [-90^\circ, +90^\circ]
$$

The angle is bounded, robust at $|x|=0$, and has the readings:

- $|\theta| \ge 26.57^\circ$ → structural shift reaches at least half the
  corresponding parametric shift in magnitude (the **structural-rival
  threshold**, $|S| \ge 0.5\,|P|$; this is the headline rivals
  convention used in the manuscript).
- $|\theta| > 45^\circ$ → structural shift strictly exceeds the
  parametric shift in magnitude (**strict structural dominance**,
  $|S| > |P|$).
- $\theta > 0$ → structural shift is in the positive direction for that
  outcome (e.g., wind up, cost up).
- $\theta < 0$ → structural shift is in the negative direction.
- $\theta = 0$ → no structural shift; the parametric-only landscape.

"Dominance" is reserved here for the strict case $|\theta| > 45^\circ$;
the broader $|\theta| \ge 26.57^\circ$ band is the "rival" range where
the structural channel reaches a substantial fraction of the parametric
channel without overpowering it. The two thresholds correspond to the
$k = 0.5$ and $k = 1.0$ values defined in the manuscript's
[Methods §3.7](https://akanudia.github.io/vre_info_asymmetry/).

Per (outcome × climate × channel) cell, we summarise the within-cell θ
distribution by median + p25–p75. The world figure ([ED Fig 2](world.md))
layers a regional bracket on each cell: world median (filled dot), regional
p25–p75 of regional medians (thick), regional full range across the 10 R10
regions (thin). The width of the regional bracket is the diagnostic for
channel-asymmetric global aggregation: a tight bracket means the world
median represents the regional signature; a wide bracket means regional
signals are cancelling at world aggregate.

## Reading the figures on this site

Both the paired-shifts hero scatter (Fig 5) and the signed-θ diagnostic
(ED Fig 2) use the same axes and si