# Data sources

This page documents all external data sources ingested by the
KiNESYS pipeline to produce the 1,080-run archive. Sources are
organised by function. For each, the version used in this study,
the provider, the content consumed, and the pipeline stage are
listed.

---

## Summary table

| # | Dataset | Version used | Provider | Pipeline stage |
|---|---------|-------------|----------|----------------|
| 1 | [Global Integrated Power](#gem) | Sep 2025 II | Global Energy Monitor | Existing fleet |
| 2 | [S&P Global Platts](#platts) | Feb 2023 | S&P Global | Existing fleet (CHP override) |
| 3 | [IEA World Energy Balances](#iea-balances) | 2025 extract | IEA | Fleet CHP/losses; demand profiles; CO₂ weights |
| 4 | [IRENA IRENASTAT](#irena) | 2024 | IRENA | Fleet calibration; hydro AF weights |
| 5 | [EMBER yearly release](#ember) | 2024 | EMBER | Fleet calibration; demand base-year |
| 6 | [REZoning](#rezoning) | Global static | World Bank/ESMAP | RE resource potential and cell geometry |
| 7 | [Atlite gridded CFs](#atlite) | 2010, 2013, 2016, 2019 | ERA5 via Atlite | RE hourly capacity factors per grid cell |
| 8 | [ERA5 demand profiles](#era5) | 2013 primary | ECMWF / Copernicus | Country hourly demand |
| 9 | [China actual load](#china-load) | Wu Haochi dataset | Research | China hourly demand override |
| 10 | [India actual load](#india-load) | 2024 | Grid/national data | India hourly demand override |
| 11 | [IPCC AR6 Scenarios DB](#ar6) | R10 v1.1 | IPCC WGIII / IAMC | Carbon prices, fuel prices, demand trajectories |
| 12 | [SSP Basic Drivers](#ssp) | v3.0 | SSP / IIASA | Country population and GDP for demand downscaling |
| 13 | [IEA GEC power costs](#iea-gec) | WEO 2023 | IEA | Regional technology capex/FOM (central level) |
| 14 | [NREL ATB](#nrel-atb) | 2024 v3 | NREL | Hi/lo spread multipliers for technology costs |
| 15 | [ETSAP-TIAM CO₂ storage](#co2-storage) | TIAM release | ETSAP | CO₂ storage potentials and transport costs |
| 16 | [World Bank WDI](#wdi) | WDI CSV | World Bank | Land area and CO₂ emissions for carbon budgets |
| 17 | [Hoes et al. hydro potential](#hydro) | project version | Hoes et al. | Hydro-capable ISO list for availability factors |
| 18 | [Natural Earth](#ne) | 10m admin-1 | Natural Earth | Province geometry (optional RE cell attribution) |

---

## Power plant fleet

### Global Integrated Power (GEM) {#gem}

**Provider:** Global Energy Monitor  
**Version:** September 2025 II  
**Access:** [https://globalenergymonitor.org/projects/global-integrated-power/](https://globalenergymonitor.org/projects/global-integrated-power/)

The Global Integrated Power tracker is the primary source for the
existing generation fleet. Each record covers a single power unit with
plant name, country, fuel type, generating technology, capacity (MW),
operating status, commissioning year, and coordinates. The pipeline
filters to operating and mothballed units, applies technology
mappings to KiNESYS technology codes, and resolves captive/CHP
flags using the Platts comparison (below). VRE units are linked to
the nearest REZoning grid cells via a pre-computed coordinate-match
table; thermal units are assigned to model regions via the
TIAM_RegionMap lookup.

**Used in:** `existing_fleet/global_power_plants_processor.py`

---

### S&P Global Platts {#platts}

**Provider:** S&P Global  
**Version:** February 2023 extract  
**Access:** Licensed; not redistributed

Used exclusively to produce a CHP/captive override table
(`gem_platts_chp_comparison.csv`) by matching GEM unit IDs to
Platts records. The resulting override flags are applied to the
GEM dataset before model assembly. No Platts data appears in any
released pipeline output.

**Used in:** `existing_fleet/match_gem_platts.py`

---

### IEA World Energy Balances {#iea-balances}

**Provider:** International Energy Agency  
**Version:** 2025 extract (`iea_balances_2025.csv`)  
**Access:** Licensed; IEA data subscribers. Public edition available at
[https://www.iea.org/data-and-statistics/data-product/world-energy-balances](https://www.iea.org/data-and-statistics/data-product/world-energy-balances)

Used in three separate pipeline stages:

1. **CHP and losses** — electricity from CHP plants, distribution
   losses, own use (PJ), by country and fuel, to build the
   `fleet_reference_tables` CHP sheet.
2. **Demand profile scaling** — IEA sectoral electricity shares
   (industry, commercial, residential) to weight ERA5 load shapes
   before aggregation.
3. **CO₂ storage weighting** — fossil fuel production volumes
   (coal, oil, gas) used as proxy weights when distributing ETSAP-TIAM
   CO₂ storage potentials to model regions.

**Used in:** `existing_fleet/compute_iea_chp_and_losses.py`,
`timeslice_pipeline/generate_load_shapes.py`,
`existing_fleet/co2_storage_from_etsap_tiam.py`

---

### IRENA IRENASTAT {#irena}

**Provider:** International Renewable Energy Agency  
**Version:** 2024 (capacity `IRENASTAT-C`; generation `IRENASTAT-G`)  
**Access:** [https://www.irena.org/Data/Downloads/IRENASTAT](https://www.irena.org/Data/Downloads/IRENASTAT)

Provides country-level installed capacity by technology (MW) and
generation (GWh), used in two roles:

1. **Fleet gap-fill** — where GEM records are absent or
   aggregation mismatches arise, IRENA capacity totals are used to
   rescale the GEM-derived fleet for calibration consistency.
2. **Hydro availability factor weights** — IRENA hydro installed
   capacity by country is used to aggregate ISO-level hydro
   availability factors to model regions.

**Used in:** `existing_fleet/global_power_plants_processor.py`,
`timeslice_pipeline/assemble_ts_parameters.py`

---

### EMBER yearly release {#ember}

**Provider:** EMBER  
**Version:** 2024 release  
**Access:** [https://ember-energy.org/data/yearly-electricity-data/](https://ember-energy.org/data/yearly-electricity-data/) (CC-BY)

Country-level electricity generation by technology (TWh) and
installed capacity (GW), primarily at monthly and annual resolution.
Used for three purposes:

1. **Fleet calibration** — base-year generation and capacity
   by fuel to reconcile GEM unit-level aggregates against
   observed statistics.
2. **Thermal utilization factors** — implied capacity factors
   per technology per country feed the `Thermal UF` sheet
   of `fleet_reference_tables`.
3. **AR6 demand downscaling base-year calibration** — observed
   2020 electricity consumption by country anchors the SSP-share
   downscaling to actual outturns.

**Used in:** `existing_fleet/global_power_plants_processor.py`,
`existing_fleet/thermal_utilization_factors.py`,
`scenario_drivers/scripts/downscale_ar6_demand_to_r70.py`

---

## Renewable resource

### REZoning {#rezoning}

**Provider:** World Bank / ESMAP, processed through the REZoning tool  
**Access:** [https://rezoning.energydata.info/](https://rezoning.energydata.info/)

REZoning provides the **spatial** layer of the renewable resource
representation: a global grid of ~50 × 50 km cells with estimated
installable potential (MW), land exclusion flags, and a
pre-computed LCOE ordering. Three technology tracks are used:
solar PV, wind onshore, wind offshore. In the KiNESYS pipeline,
each cell is further enhanced with Atlite-derived capacity factors
(see below), producing a combined resource dataset per cell that
carries both the potential size and the temporal CF profile. The
clustering algorithm (`global_renewable_processor.py`) reads the
enhanced REZoning file as its cell inventory.

**Files:** `data/REZoning/REZoning_Solar_atlite_cf.csv`,
`REZoning_WindOnshore_atlite_cf.csv`,
`REZoning_WindOffshore_atlite_cf.csv`

**Used in:** `re_characterization/global_renewable_processor.py`

---

### Atlite gridded capacity factors {#atlite}

**Provider:** ERA5 reanalysis (ECMWF / Copernicus) processed via
[Atlite](https://atlite.readthedocs.io/) (Hofmann et al. 2021)  
**Weather years used:** 2010, 2013, 2016, 2019 (default 2013)  
**Access:** ERA5 raw data is freely available from the
[Copernicus Climate Data Store](https://cds.climate.copernicus.eu/).
The processed Atlite parquet files were generated upstream and are
not redistributed on this site.

Hourly capacity factor time series (8,760 values per year) for
solar PV, wind onshore and wind offshore at each REZoning grid cell.
These are the **temporal** layer of the renewable resource
representation. The supply-curve clustering algorithm
(`global_renewable_processor.py`) reads these parquets to compute
representative cluster capacity factors and to build the
`cluster_profiles.parquet` files consumed by the timeslice pipeline.
Multiple weather years are used to produce multi-year COM_FR
averages; the 2013 weather year is the default single-year reference.

**Files:** `data/hourly_profiles/Atlite_data_grid_cell/{ISO}_{YEAR}.parquet`

**Used in:** `re_characterization/global_renewable_processor.py`,
`timeslice_pipeline/assemble_ts_parameters.py`

---

## Demand profiles

### ERA5 demand profiles {#era5}

**Provider:** ECMWF ERA5 reanalysis (Copernicus Climate Change Service),
combined into country-level demand profiles by a separate upstream
script (`shared_data_loader.py`)  
**Weather years:** 2011, 2013, 2018 in the validation dataset;
2013 is the default for model assembly  
**Access:** ERA5 raw data: [Copernicus CDS](https://cds.climate.copernicus.eu/).
The combined demand CSV is a derived product; not redistributed.

Country-level hourly electricity demand profiles for 212 countries,
derived from ERA5 temperature, humidity and solar radiation through
calibrated degree-day and luminance-demand functions. Profiles are
in local time (UTC offset applied per country). Sectoral shares
from the IEA World Energy Balances are used to weight industry,
commercial and residential sub-profiles before aggregating to total
demand.

All ERA5-derived demand data enters the pipeline via
`shared_data_loader.get_era5_demand_data()`, which applies the
UTC-to-local-time conversion uniformly.

**File:** `data/hourly_profiles/era5_combined_data_2030.csv`

**Used in:** `timeslice_pipeline/generate_load_shapes.py`,
`timeslice_design/global_design/` (template evaluation)

---

### China hourly load (Wu Haochi dataset) {#china-load}

**Provider:** Wu Haochi (research dataset)  
**Access:** Not publicly redistributed; contact corresponding author

Observed hourly electricity load for mainland China, used to
replace ERA5-derived demand for the China region.
ERA5 demand for China is considered less reliable because the
country's load is shaped by industrial-sector dominance and
provincial grid diversity not well captured by temperature-based
demand functions. The actual load dataset provides a more accurate
temporal profile for China, and is used when available.

**File:** `data/hourly_profiles/WuHaochi_China_Hourly electric power load final.csv`

**Used in:** `timeslice_pipeline/generate_load_shapes.py`

---

### India actual load {#india-load}

**Provider:** Indian national grid/utility data  
**Version:** 2024  
**Access:** Derived from publicly available grid data; specific source
documented in the pipeline configuration.

Observed hourly electricity load for India, used in place of ERA5
for the same reasons as the China override: India's load curve is
dominated by agricultural pumping, high cooling demand, and
significant unserved demand that the ERA5 temperature proxy
does not capture.

**File:** `data/hourly_profiles/india_load_curve_2024.csv`

**Used in:** `timeslice_pipeline/generate_load_shapes.py`

---

## Scenario drivers

### IPCC AR6 Scenarios Database {#ar6}

**Provider:** IPCC Working Group III; hosted by IIASA  
**Version:** R10 regional aggregation, v1.1 (Chapter 3 vetted subset;
1,202 model–scenario combinations from 44 IAMs)  
**Access:** [https://data.ece.iiasa.ac.at/ar6/](https://data.ece.iiasa.ac.at/ar6/)

The primary source for all externally-varying scenario assumptions
in the experiment. Three independent layers are derived:

**Carbon prices** — median AR6 carbon price trajectory per
R10 macro-region for each of five climate categories (C1, C2, C3,
C4, C7). Outliers beyond 3×IQR are excluded before computing
statistics.

**Fuel prices** — q25, median and q75 of natural gas and biomass
price trajectories per region and category. Coal and oil prices are
also compiled but not varied as independent parametric axes (their
use is largely governed by the carbon-price trajectory).

**Electricity demand** — median regional electricity demand
projections by sector (residential, industry, commercial, transport,
hydrogen from electrolysis) for each climate category. These are
downscaled to country level using SSP2 demographic shares (see
below) for R70 model instances.

Outlier detection uses a 3×IQR threshold applied separately to each
region × fuel/variable × year cell.

**Files:** `data/ipcc_iamc/AR6_R10_v1.1/`

**Used in:** `scenario_drivers/scripts/compile_ar6_*.py`,
`downscale_ar6_demand_to_r70.py`

---

### SSP Basic Drivers {#ssp}

**Provider:** SSP project / IIASA (models: IIASA GDP 2023,
IIASA-WiC POP 2023)  
**Version:** v3.0  
**Access:** [https://tntcat.iiasa.ac.at/SspDb/](https://tntcat.iiasa.ac.at/SspDb/)

Country-level population and GDP (PPP) trajectories from the
SSP2 (middle-of-the-road) scenario, used to downscale AR6 R10
electricity-demand projections to country level. Shares are
computed dynamically per year so that faster-growing economies
absorb a larger fraction of regional demand over time.
Downscaling rules: residential demand → population share;
industry, commercial, transport and hydrogen → GDP share.

**File:** `data/ipcc_iamc/ssp_basic_drivers_release_3.0_full.xlsx`
(cached to `ssp_basic_drivers_ssp2_pop_gdp.csv` after first run)

**Used in:** `scenario_drivers/scripts/downscale_ar6_demand_to_r70.py`

---

## Technology costs

### IEA Global Energy and Climate Model power costs {#iea-gec}

**Provider:** International Energy Agency  
**Version:** WEO 2023 STEPS scenario  
**Access:** Licensed; available through IEA data subscription.
[https://www.iea.org/data-and-statistics/data-product/world-energy-model](https://www.iea.org/data-and-statistics/data-product/world-energy-model)

Regional overnight capital costs and fixed O&M for 27 power-sector
technologies across **nine IEA regions** (United States, European
Union, Japan, Russia, China, India, Middle East, Africa, Brazil) at
three time points (2022, 2030, 2050), denominated in USD 2022.
These values form the **central (`capex_mid`)** level in the
technology-cost axis of the experiment. The IEA GEC dataset was
chosen over AR6 capital cost entries because AR6 values mix
heterogeneous model conventions and contain implausible entries for
several technologies, notably offshore wind.

Technologies covered include gas (OCGT, CCGT, CCGT-CCS), coal
(USC, USC-CCS), oil, nuclear (large + SMR), biomass (with and
without CCS), hydro, pumped storage, solar PV, onshore wind,
offshore wind, concentrating solar (CSP), geothermal, and
waste-to-energy.

**File:** `data/technologies/GEC Model power generation technology costs dataset.xlsb`

**Used in:** `conv_tech_characterization/compile_unified_reference.py`

---

### NREL Annual Technology Baseline {#nrel-atb}

**Provider:** National Renewable Energy Laboratory (NREL)  
**Version:** 2024 v3  
**Access:** [https://atb.nrel.gov/](https://atb.nrel.gov/) (public)

US capital cost trajectories for power generation and storage
technologies under three technology scenarios: Conservative,
Moderate and Advanced. Used in two roles:

1. **Spread multipliers** — the Conservative-to-Moderate and
   Advanced-to-Moderate ratios at each time point are applied to
   the IEA GEC central values to produce the `capex_hi` and
   `capex_lo` levels for all technologies and regions. This
   preserves IEA's regional differentiation while using NREL's
   published learning-uncertainty range.
2. **Battery storage (absolute)** — 4-hour utility-scale battery
   costs are taken directly from ATB (USD/kW, all three scenarios),
   applied globally, because IEA GEC does not cover battery storage.
   Nuclear SMR costs follow ATB for the United States and are scaled
   to other regions using IEA large-nuclear regional cost ratios.

**File:** `data/technologies/ATB_2024_v3_Workbook.xlsx`

**Used in:** `conv_tech_characterization/compile_unified_reference.py`

---

## Supporting reference data

### ETSAP-TIAM CO₂ storage {#co2-storage}

**Provider:** ETSAP (Energy Technology Systems Analysis Programme);
TIAM (TIMES Integrated Assessment Model)  
**Access:** Part of the KiNESYS framework; not publicly redistributed
as a standalone file.

Geological CO₂ storage potentials (Gt CO₂) and pipeline transport
costs by country, plus bio-energy CCS breakthrough-point costs.
These drive the CO₂ storage and CO₂ transport sheets of
`fleet_reference_tables`. Storage potentials are distributed to
model regions using weights derived from fossil fuel production
volumes (IEA balances), land area (World Bank WDI), and coastline
length proxy.

**File:** KiNESYS framework `etsap-tiam storage potentials and costs.xlsx`

**Used in:** `existing_fleet/co2_storage_from_etsap_tiam.py`

---

### World Bank World Development Indicators {#wdi}

**Provider:** World Bank  
**Access:** [https://datacatalog.worldbank.org/search/dataset/0037712](https://datacatalog.worldbank.org/search/dataset/0037712) (public)

Country-level land area (circa 2000) and CO₂ emissions (2019) used
as proxy weights when distributing ETSAP-TIAM CO₂ storage potentials
and computing regional carbon budgets.

**File:** `data/WorldBank/WDICSV.csv`

**Used in:** `existing_fleet/co2_storage_from_etsap_tiam.py`

---

### Hoes et al. hydro potential {#hydro}

**Provider:** Hoes et al. (project-specific processed version)  
**Access:** Based on: Hoes, O.A.C. et al. (2017). *Systematic high-resolution
assessment of global hydropower potential.* PLoS ONE 12(2): e0171844.
DOI: [10.1371/journal.pone.0171844](https://doi.org/10.1371/journal.pone.0171844)

Identifies which countries have material hydro resources and thus
require seasonal hydro availability factors in the model. Used as a
filter: only ISOs appearing in this dataset receive hydro AF
timeslice parameters in `Scen_TSParameters`.

**File:** `data/Hoes_global_hydro/hydro_potential_kinesys.xlsx`

**Used in:** `timeslice_pipeline/assemble_ts_parameters.py`

---

### Natural Earth admin-1 boundaries {#ne}

**Provider:** Natural Earth  
**Version:** 10m resolution  
**Access:** [https://www.naturalearthdata.com/downloads/10m-cultural-vectors/](https://www.naturalearthdata.com/downloads/10m-cultural-vectors/) (public domain)

Province and state geometries used optionally to attribute REZoning
grid cells to sub-national administrative units. Used to label
supply-curve clusters with a representative administrative region
name (`admin_region` column in `cluster_summary_*.csv`), which aids
interpretation and validation but does not affect any model parameter.

**File:** `data/country_data/naturalearth/ne_10m_admin_1_states_provinces.shp`

**Used in:** `re_characterization/global_renewable_processor.py`

---

## Data availability notes

**Freely available and redistributable:** IRENA IRENASTAT, EMBER
yearly release, IPCC AR6 Scenarios Database, SSP Basic Drivers,
NREL ATB, World Bank WDI, Natural Earth, ERA5 raw reanalysis.

**Licensed (not redistributed here):** IEA World Energy Balances,
IEA GEC power costs, S&P Global Platts. Researchers with IEA data
access can regenerate the pipeline outputs from the source files
using the build scripts released alongside the manuscript.

**Derived or research-origin (contact corresponding author):** China
actual load (Wu Haochi), India actual load, Atlite grid-cell
parquet files, REZoning Atlite-enhanced CSVs.

**Part of the KiNESYS framework (available on request):** ETSAP-TIAM
CO₂ storage potentials, TIAM_RegionMap, KiNESYS mappings workbook.

The [Inputs page](inputs.md) releases the four parametric input
layers (carbon prices, fuel prices, electricity demand, technology
costs) in their pipeline-ready form under CC-BY 4.0.
The [Structural inputs page](structural_inputs.md) releases the
supply-curve bin tables and timeslice partition definitions.
