/* Resource-asymmetry playground — vanilla JS state engine
 *
 * Loads data.json once, then runs all filter/recolour/remarker logic in
 * the browser. Plotly.react() handles the redraw on every state change.
 */

// ----------------------------------------------------------------- consts

const REGION_LABELS = {
  WORLD:            "World aggregate",
  R10AFRICA:        "Africa",
  "R10CHINA+":      "China+",
  R10EUROPE:        "Europe",
  "R10INDIA+":      "India+",
  R10LATIN_AM:      "Latin America",
  R10MIDDLE_EAST:   "Middle East",
  R10NORTH_AM:      "North America",
  R10PAC_OECD:      "Pacific OECD",
  R10REF_ECON:      "Reforming Economies",
  R10REST_ASIA:     "Rest of Asia",
};

const OUTCOMES = ["wind", "solar", "price", "nonvrecf", "cost", "emis"];
const OUTCOME_LABELS = {
  wind:     "Wind generation",
  solar:    "Solar generation",
  price:    "Electricity price",
  nonvrecf: "Non-VRE capacity factor",
  cost:     "System cost (NPV)",
  emis:     "CO₂ emissions",
};
const CHANNELS = ["supply", "temporal"];
const CHANNEL_LABELS = {
  supply:   "Supply  (LoT → HiT)",
  temporal: "Temporal  (TS04 → TS72)",
};

const FILTER_AXES = ["climate", "cost", "price", "ts", "tech_gran", "spat_gran"];
const FILTER_LABELS = {
  climate:   "Climate",
  cost:      "Technology cost",
  price:     "Fuel price",
  ts:        "Timeslice resolution",
  tech_gran: "Supply curve",
  spat_gran: "Regional aggregation",
};

// Tooltips shown on hover over each filter group's axis label. One-line
// explanations of the paper's nomenclature so cold-landing readers don't
// have to flip to the manuscript to interpret the chips.
const FILTER_HELP = {
  climate:
    "AR6 climate ambition: C1 (1.5°C, low overshoot) → C7 (above 2.5°C, "
    + "reference policy). Sets the carbon-price trajectory.",
  cost:
    "Technology cost level for VRE: Hi (pessimistic capex), Base (central), "
    + "Lo (optimistic).",
  price:
    "Fossil fuel price quantile: q25 (cheap fossils, fossil-favouring), "
    + "median (central), q75 (expensive fossils, VRE-favouring).",
  ts:
    "Timeslice resolution of the model run: TS04 (4 representative "
    + "timeslices, very coarse) → TS72 (72 timeslices, fine sub-daily). "
    + "Pair axis for the temporal channel; fixed within-pair for the "
    + "supply channel.",
  tech_gran:
    "Supply-curve detail per technology: LoT (coarse, 4–5 cost-ordered "
    + "tranches) vs HiT (fine, ~30 tranches exposing the high-quality "
    + "resource tail). Pair axis for the supply channel; fixed within-pair "
    + "for the temporal channel.",
  spat_gran:
    "Regional aggregation: R10 (10 IPCC AR6 macro-regions) vs R70 "
    + "(62 individually-modelled countries + 8 rest-of-region aggregates).",
};

// Tooltips for individual chip values where the abbreviation isn't
// self-explanatory.
const VALUE_HELP = {
  C1: "1.5°C, low/no overshoot",
  C2: "1.5°C, high overshoot",
  C3: "Likely below 2°C",
  C4: "Below 2°C",
  C7: "Above 2.5°C — reference (current policies)",
  Hi: "High VRE capex (pessimistic for renewables)",
  Lo: "Low VRE capex (optimistic for renewables)",
  Base: "Central technology cost assumption",
  q25: "25th-percentile fossil fuel price (cheap)",
  q75: "75th-percentile fossil fuel price (expensive)",
  median: "Median fossil fuel price",
  LoT: "Coarse supply curve (4–5 tranches per tech)",
  HiT: "Fine supply curve (~30 tranches per tech)",
  R10: "10 IPCC AR6 macro-regions",
  R70: "62 countries + 8 aggregates",
  TS04: "4 timeslices",
  TS12: "12 timeslices",
  TS24: "24 timeslices",
  TS36: "36 timeslices",
  TS48: "48 timeslices",
  TS72: "72 timeslices",
};

const ENCODING_OPTIONS = [
  { key: "climate",   label: "Climate ambition" },
  { key: "cost",      label: "Technology cost" },
  { key: "price",     label: "Fuel price" },
  { key: "ts",        label: "TS resolution" },
  { key: "tech_gran", label: "Supply curve" },
  { key: "spat_gran", label: "Regional aggregation" },
];

// Discrete palettes.
const PALETTES = {
  climate:   { C1: "#1a9850", C2: "#91cf60", C3: "#e0b938",
               C4: "#fc8d59", C7: "#d73027" },
  cost:      { Lo: "#1f77b4", Base: "#7f7f7f", Hi: "#d62728" },
  price:     { q25: "#1f77b4", median: "#7f7f7f", q75: "#d62728" },
  ts:        { TS04: "#440154", TS12: "#414487", TS24: "#2a788e",
               TS36: "#22a884", TS48: "#7ad151", TS72: "#fde725" },
  tech_gran: { LoT: "#1f77b4", HiT: "#d62728" },
  spat_gran: { R10: "#1976D2", R70: "#F1C40F" },
};

// Marker shape palettes. Climate, ts get many shapes; binary axes get two.
const SHAPES = {
  climate:   { C1: "circle", C2: "square", C3: "diamond",
               C4: "cross", C7: "triangle-up" },
  cost:      { Lo: "circle", Base: "square", Hi: "triangle-up" },
  price:     { q25: "circle", median: "square", q75: "triangle-up" },
  ts:        { TS04: "circle", TS12: "square", TS24: "diamond",
               TS36: "cross", TS48: "x", TS72: "triangle-up" },
  tech_gran: { LoT: "circle", HiT: "triangle-up" },
  spat_gran: { R10: "circle", R70: "triangle-up" },
};

// ----------------------------------------------------------------- state

let DATA = null;
const state = {
  region:   "WORLD",
  scaling:  "paper",
  colour:   "climate",
  marker:   "spat_gran",
  filters:  {},
};

// ----------------------------------------------------------------- URL state

// Serialise current state to a URL hash so a view is shareable by link.
// Format: #region=R10INDIA%2B&colour=cost&marker=spat_gran&scaling=auto
//         &climate=C4,C7&cost=Lo
// Filter axes are omitted from the hash when all values are selected
// (default), so the URL stays short for unfiltered views.
function stateToHash() {
  const parts = [];
  parts.push("region=" + encodeURIComponent(state.region));
  if (state.colour  !== "climate")   parts.push("colour="  + state.colour);
  if (state.marker  !== "spat_gran") parts.push("marker="  + state.marker);
  if (state.scaling !== "paper")     parts.push("scaling=" + state.scaling);
  for (const axis of FILTER_AXES) {
    const all = DATA.scenario_axes[axis];
    const sel = all.filter(v => state.filters[axis].has(v));
    if (sel.length !== all.length) {
      parts.push(axis + "=" + sel.map(encodeURIComponent).join(","));
    }
  }
  return "#" + parts.join("&");
}

function applyHashToState() {
  const h = window.location.hash.replace(/^#/, "");
  if (!h) return;
  const validRegions  = new Set(DATA.regions);
  const validEncoding = new Set(["climate", "cost", "price",
                                  "ts", "tech_gran", "spat_gran"]);
  for (const pair of h.split("&")) {
    const eq = pair.indexOf("=");
    if (eq < 0) continue;
    const k = pair.slice(0, eq);
    const v = decodeURIComponent(pair.slice(eq + 1));
    if (k === "region" && validRegions.has(v))     state.region = v;
    else if (k === "colour" && validEncoding.has(v))  state.colour = v;
    else if (k === "marker"
             && (v === "none" || validEncoding.has(v))) state.marker = v;
    else if (k === "scaling" && (v === "paper" || v === "auto"))
                                                       state.scaling = v;
    else if (FILTER_AXES.includes(k)) {
      const allowed = new Set(DATA.scenario_axes[k]);
      const vals = v.split(",").map(decodeURIComponent).filter(x => allowed.has(x));
      // Only override if at least one valid value is named; an empty
      // filter would silently wipe the chart, which is worse than
      // ignoring a malformed URL.
      if (vals.length > 0) state.filters[k] = new Set(vals);
    }
  }
}

function updateUrlHash() {
  if (!DATA) return;
  const newHash = stateToHash();
  if (window.location.hash !== newHash) {
    history.replaceState(null, "", newHash);
  }
}

// ----------------------------------------------------------------- init

async function init() {
  try {
    if (typeof Plotly === "undefined") {
      throw new Error("Plotly.js failed to load from the CDN. "
        + "Check the browser console for blocked-script errors.");
    }
    const resp = await fetch("data.json");
    if (!resp.ok) {
      throw new Error("Could not load data.json "
        + `(HTTP ${resp.status}). Path looked at: ${resp.url}`);
    }
    DATA = await resp.json();

    for (const axis of FILTER_AXES) {
      state.filters[axis] = new Set(DATA.scenario_axes[axis]);
    }

    // Hydrate state from the URL hash so a reviewer can land directly on
    // a shared view (e.g. ?#region=R10INDIA%2B&colour=cost&climate=C7).
    applyHashToState();

    buildRegionCombo();
    buildEncodingCombos();
    buildFilterChips();
    attachHandlers();
    initHelpPanel();
    render();
  } catch (err) {
    showError(err);
    throw err;
  }
}

// First-visit: open the orientation panel. Subsequent visits: stay
// collapsed (the user has already read the prose). Tracked via
// localStorage; survives across browser sessions but resets if the user
// clears site data.
function initHelpPanel() {
  const help = document.getElementById("ph-help");
  if (!help) return;
  let seen = false;
  try { seen = !!localStorage.getItem("ph-help-seen"); }
  catch (_) { /* localStorage may be disabled — treat as first visit */ }
  help.open = !seen;
  help.addEventListener("toggle", () => {
    if (!help.open) {
      try { localStorage.setItem("ph-help-seen", "1"); }
      catch (_) {}
    }
  });
  // Close-on-outside-click for the orientation panel only (so it behaves
  // like a popover rather than a permanent inline section).
  document.addEventListener("click", (e) => {
    if (!help.open) return;
    if (!help.contains(e.target)) help.open = false;
  });
}

function showError(err) {
  const plot = document.getElementById("ph-plot");
  plot.innerHTML = "";
  const box = document.createElement("div");
  box.style.cssText = "margin: 24px; padding: 18px 22px; "
    + "background: #ffebee; border: 1px solid #ef9a9a; "
    + "border-radius: 4px; color: #b71c1c; font-size: 14px;";
  box.innerHTML = "<b>Playground failed to load.</b><br><br>"
    + (err && err.message ? err.message : String(err))
    + "<br><br><span style=\"font-size:12px;color:#666\">"
    + "Open the browser DevTools console (F12) for the full stack trace."
    + "</span>";
  plot.appendChild(box);
}

// ----------------------------------------------------------------- UI build

function buildRegionCombo() {
  const sel = document.getElementById("ph-region");
  for (const r of DATA.regions) {
    const opt = document.createElement("option");
    opt.value = r;
    opt.textContent = REGION_LABELS[r] || r;
    sel.appendChild(opt);
  }
  sel.value = state.region;
}

function buildEncodingCombos() {
  const fillSelect = (id, current, includeNone) => {
    const sel = document.getElementById(id);
    if (includeNone) {
      const opt = document.createElement("option");
      opt.value = "none"; opt.textContent = "(none — all same)";
      sel.appendChild(opt);
    }
    for (const o of ENCODING_OPTIONS) {
      const opt = document.createElement("option");
      opt.value = o.key; opt.textContent = o.label;
      sel.appendChild(opt);
    }
    sel.value = current;
  };
  fillSelect("ph-colour", state.colour, false);
  fillSelect("ph-marker", state.marker, true);
}

function buildFilterChips() {
  const root = document.getElementById("ph-filters");
  root.innerHTML = "";
  for (const axis of FILTER_AXES) {
    const grp = document.createElement("div");
    grp.className = "ph-fgroup";
    grp.dataset.axis = axis;

    const lbl = document.createElement("span");
    lbl.className = "ph-flabel";
    lbl.textContent = FILTER_LABELS[axis];
    // Compose tooltip: explanation + click-to-toggle-all hint.
    lbl.title = (FILTER_HELP[axis] || "") + "\n\n(Click to toggle all)";
    lbl.addEventListener("click", () => toggleAxisAll(axis));
    grp.appendChild(lbl);

    for (const v of DATA.scenario_axes[axis]) {
      const chip = document.createElement("label");
      chip.className = "ph-chip checked";
      chip.dataset.value = v;
      // Per-chip tooltip with the value's plain-language gloss.
      if (VALUE_HELP[v]) chip.title = `${v}: ${VALUE_HELP[v]}`;
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = true;
      cb.addEventListener("change", () => onChipChange(axis, v, cb.checked, chip));
      chip.appendChild(cb);
      const txt = document.createElement("span");
      txt.textContent = v;
      chip.appendChild(txt);
      grp.appendChild(chip);
    }
    root.appendChild(grp);
  }
}

function attachHandlers() {
  document.getElementById("ph-region").addEventListener("change", e => {
    state.region = e.target.value; render();
  });
  document.getElementById("ph-colour").addEventListener("change", e => {
    state.colour = e.target.value; render();
  });
  document.getElementById("ph-marker").addEventListener("change", e => {
    state.marker = e.target.value; render();
  });
  for (const radio of document.querySelectorAll("input[name='ph-scaling']")) {
    radio.addEventListener("change", e => {
      state.scaling = e.target.value; render();
    });
  }
  document.getElementById("ph-reset").addEventListener("click", resetFilters);
  window.addEventListener("resize", () => {
    if (DATA) Plotly.Plots.resize("ph-plot");
  });
}

function onChipChange(axis, value, checked, chipEl) {
  if (checked) state.filters[axis].add(value);
  else         state.filters[axis].delete(value);
  chipEl.classList.toggle("checked", checked);
  render();
}

function toggleAxisAll(axis) {
  const all = DATA.scenario_axes[axis];
  const anyOff = all.some(v => !state.filters[axis].has(v));
  // If any are unchecked, check all. Otherwise uncheck all.
  state.filters[axis] = new Set(anyOff ? all : []);
  const chips = document.querySelectorAll(`.ph-fgroup[data-axis='${axis}'] .ph-chip`);
  for (const chip of chips) {
    const on = state.filters[axis].has(chip.dataset.value);
    chip.classList.toggle("checked", on);
    chip.querySelector("input").checked = on;
  }
  render();
}

function resetFilters() {
  for (const axis of FILTER_AXES) {
    state.filters[axis] = new Set(DATA.scenario_axes[axis]);
  }
  buildFilterChips();
  render();
}

// ----------------------------------------------------------------- filtering

function filteredPoints() {
  const p = DATA.points;
  const N = p.region.length;
  const out = {}; for (const k of Object.keys(p)) out[k] = [];

  const fcl = state.filters.climate,   fco = state.filters.cost;
  const fpr = state.filters.price,     fts = state.filters.ts;
  const ftg = state.filters.tech_gran, fsg = state.filters.spat_gran;
  const region = state.region;

  // For a paired-shift point to survive, BOTH legs of the pair must be in
  // the filter set. Supply pairs need both LoT and HiT; temporal need
  // both TS04 and TS72. Pre-compute the gating once.
  const supplyOK   = ftg.has("LoT") && ftg.has("HiT");
  const temporalOK = fts.has("TS04") && fts.has("TS72");

  for (let i = 0; i < N; i++) {
    if (p.region[i] !== region) continue;
    if (!fcl.has(p.climate[i])) continue;
    if (!fco.has(p.cost[i]))    continue;
    if (!fpr.has(p.price[i]))   continue;
    if (!fsg.has(p.spat_gran[i])) continue;
    if (p.channel[i] === "supply") {
      if (!supplyOK) continue;
      // ts is the fixed within-pair value for supply pairs.
      if (!fts.has(p.ts[i])) continue;
    } else {
      if (!temporalOK) continue;
      if (!ftg.has(p.tech_gran[i])) continue;
    }
    for (const k of Object.keys(p)) out[k].push(p[k][i]);
  }
  return out;
}

// ----------------------------------------------------------------- traces

function hoverText(p, i) {
  const lines = [
    `<b>${REGION_LABELS[p.region[i]] || p.region[i]}</b>`,
    `Outcome: ${OUTCOME_LABELS[p.outcome[i]]}`,
    `Channel: ${CHANNEL_LABELS[p.channel[i]]}`,
    `Climate: ${p.climate[i]}`,
    `Cost: ${p.cost[i]}`,
    `Price: ${p.price[i]}`,
  ];
  if (p.ts[i] !== null)        lines.push(`TS: ${p.ts[i]}`);
  if (p.tech_gran[i] !== null) lines.push(`Supply curve: ${p.tech_gran[i]}`);
  lines.push(`Reg. agg.: ${p.spat_gran[i]}`);
  lines.push(`<br>parametric %: ${p.x_pct[i].toFixed(2)}`);
  lines.push(`structural %:  ${p.y_pct[i].toFixed(2)}`);
  return lines.join("<br>");
}

function buildTraces(f) {
  const N = f.region.length;
  if (N === 0) return [];

  const colourKey = state.colour;
  const markerKey = state.marker;     // may be "none"
  const palette = PALETTES[colourKey];
  const shapes  = markerKey === "none" ? null : SHAPES[markerKey];

  // Bucket by (panel × colourCat × markerCat). Key order is stable.
  const buckets = new Map();
  for (let i = 0; i < N; i++) {
    const panelKey  = f.outcome[i] + "|" + f.channel[i];
    const cVal      = f[colourKey][i] ?? "(n/a)";
    const mVal      = markerKey === "none" ? "*" : (f[markerKey][i] ?? "(n/a)");
    const key       = panelKey + "|" + cVal + "|" + mVal;
    let g = buckets.get(key);
    if (!g) {
      g = { panel: panelKey, c: cVal, m: mVal, x: [], y: [], h: [] };
      buckets.set(key, g);
    }
    g.x.push(f.x_pct[i]);
    g.y.push(f.y_pct[i]);
    g.h.push(hoverText(f, i));
  }

  // Emit traces. Legend entries: one per colour category, shown on the
  // top-left panel only, on the FIRST marker bucket for that category.
  const traces = [];
  const seenLegend = new Set();
  // Order buckets by colour category order then marker category order so
  // the legend renders categories in their natural order.
  const cOrder = Object.keys(palette);
  const mOrder = shapes ? Object.keys(shapes) : ["*"];
  const ordered = [...buckets.values()].sort((a, b) => {
    const dc = cOrder.indexOf(a.c) - cOrder.indexOf(b.c);
    if (dc !== 0) return dc;
    return mOrder.indexOf(a.m) - mOrder.indexOf(b.m);
  });

  for (const g of ordered) {
    const [o, ch] = g.panel.split("|");
    const r = ch === "supply" ? 1 : 2;
    const c = OUTCOMES.indexOf(o) + 1;
    const ax = (r - 1) * OUTCOMES.length + c;
    const xref = ax > 1 ? `x${ax}` : "x";
    const yref = ax > 1 ? `y${ax}` : "y";

    // Colour-legend entry: only on top-left panel, only on the first
    // marker variant per colour category.
    const legendKey = colourKey + "|" + g.c;
    const isLegend = (ax === 1) && !seenLegend.has(legendKey);
    if (isLegend) seenLegend.add(legendKey);

    traces.push({
      type: "scatter",
      mode: "markers",
      x: g.x, y: g.y,
      name: g.c,
      legendgroup: legendKey,
      legend: "legend",
      showlegend: isLegend,
      marker: {
        color:  palette ? (palette[g.c] || "#888") : "#888",
        symbol: shapes  ? (shapes[g.m]  || "circle") : "circle",
        size:   7,
        opacity: 0.85,
        line: { width: 0.4, color: "white" },
      },
      hovertemplate: "%{text}<extra></extra>",
      text: g.h,
      xaxis: xref, yaxis: yref,
    });
  }

  // Marker-shape legend (legend2). Build via invisible dummy traces, one
  // per marker category. Skipped when "marker by" is "none" or when
  // marker dimension equals colour dimension (the colour legend already
  // tells that story).
  if (markerKey !== "none" && markerKey !== colourKey && shapes) {
    const presentMarkers = new Set();
    for (const g of ordered) presentMarkers.add(g.m);
    for (const mCat of Object.keys(shapes)) {
      if (!presentMarkers.has(mCat)) continue;   // no data of this shape
      traces.push({
        type: "scatter",
        mode: "markers",
        x: [null], y: [null],
        name: mCat,
        legendgroup: "marker|" + mCat,
        legend: "legend2",
        showlegend: true,
        marker: {
          color: "#666",
          symbol: shapes[mCat],
          size: 8,
          opacity: 0.95,
          line: { width: 0.4, color: "white" },
        },
        hoverinfo: "skip",
        xaxis: "x", yaxis: "y",
      });
    }
  }

  return traces;
}

// ----------------------------------------------------------------- layout

// Build an SVG path string for a rounded rectangle, in paper coords.
// (x0,y0) = bottom-left, (x1,y1) = top-right. rx/ry are corner radii.
// Used for Plotly shape type "path" with xref/yref = "paper".
function roundedRectPath(x0, y0, x1, y1, rx, ry) {
  return [
    `M ${x0 + rx} ${y1}`,
    `L ${x1 - rx} ${y1}`,
    `Q ${x1} ${y1} ${x1} ${y1 - ry}`,
    `L ${x1} ${y0 + ry}`,
    `Q ${x1} ${y0} ${x1 - rx} ${y0}`,
    `L ${x0 + rx} ${y0}`,
    `Q ${x0} ${y0} ${x0} ${y0 + ry}`,
    `L ${x0} ${y1 - ry}`,
    `Q ${x0} ${y1} ${x0 + rx} ${y1}`,
    "Z",
  ].join(" ");
}

function buildLayout(f) {
  // Natural per-panel magnitudes from filtered data.
  const nat = {};
  for (const o of OUTCOMES) for (const ch of CHANNELS)
    nat[o + "|" + ch] = { xmag: 5, ymag: 5 };
  for (let i = 0; i < f.region.length; i++) {
    const k = f.outcome[i] + "|" + f.channel[i];
    const ax = Math.abs(f.x_pct[i]) * 1.10;
    const ay = Math.abs(f.y_pct[i]) * 1.15;
    if (ax > nat[k].xmag) nat[k].xmag = ax;
    if (ay > nat[k].ymag) nat[k].ymag = ay;
  }

  // Apply scaling rules.
  const final = {};
  if (state.scaling === "paper") {
    // Per-outcome column, take max across the two channel rows. Wind and
    // Solar columns share x (gen outcomes); each gets its own y.
    const colX = {}, colY = {};
    for (const o of OUTCOMES) {
      colX[o] = Math.max(nat[o + "|supply"].xmag, nat[o + "|temporal"].xmag);
      colY[o] = Math.max(nat[o + "|supply"].ymag, nat[o + "|temporal"].ymag);
    }
    const genX = Math.max(colX.wind, colX.solar);
    colX.wind = colX.solar = genX;
    for (const o of OUTCOMES) for (const ch of CHANNELS)
      final[o + "|" + ch] = { xmag: colX[o], ymag: colY[o] };
  } else {
    for (const k in nat) final[k] = nat[k];
  }

  const layout = {
    // Margins are sized so the cards can extend OUTSIDE the [0,1] paper
    // area into the left/right/top/bottom margin region, with enough
    // headroom that titles/tick labels sit comfortably INSIDE the card
    // border rather than pressed against it:
    //   l: 100 -- leftmost card hosts y-axis title with interior padding
    //   t: 72  -- top-row cards host panel-title annotation with breathing room
    //   b: 76  -- bottom-row cards host x-axis title; trimmed from 88 so the
    //            chart+controls stack fits without vertical scroll on the
    //            calibrated 540px viewport
    //   r: 36  -- modest right-edge breathing room
    margin: { l: 100, r: 36, t: 72, b: 76 },
    // Card layout: paper bg matches page bg (#fafafa), each subplot's data
    // area is transparent, and a rounded-rect "card" shape is drawn behind
    // each subplot to give the panels visible card semantics.
    plot_bgcolor: "rgba(0,0,0,0)",
    paper_bgcolor: "#fafafa",
    hovermode: "closest",
    autosize: true,
    shapes: [],
    annotations: [],
    legend: {
      // Colour legend: horizontal strip placed BETWEEN the supply and
      // temporal chart rows, anchored just left of paper centre so the
      // colour-marker pair reads as a centred row.
      orientation: "h",
      title: { text: "<b>Colour:</b> " + labelOf(state.colour) + "&nbsp;&nbsp;",
               side: "left" },
      x: 0.495, xanchor: "right", y: 0.5, yanchor: "middle",
      bgcolor: "rgba(255,255,255,0.95)",
      bordercolor: "#ddd", borderwidth: 1,
      font: { size: 12 },
    },
    font: { family: "Inter, system-ui, sans-serif", size: 12 },
  };

  // Marker legend (legend2) only when the marker dimension is set AND
  // distinct from the colour dimension. Otherwise it'd be empty or
  // redundant.
  const showMarkerLegend = state.marker !== "none"
    && state.marker !== state.colour;
  if (showMarkerLegend) {
    layout.legend2 = {
      // Sits to the right of the colour legend on the same centred row
      // between the two chart rows.
      orientation: "h",
      title: { text: "<b>Marker:</b> " + labelOf(state.marker) + "&nbsp;&nbsp;",
               side: "left" },
      x: 0.505, xanchor: "left", y: 0.5, yanchor: "middle",
      bgcolor: "rgba(255,255,255,0.95)",
      bordercolor: "#ddd", borderwidth: 1,
      font: { size: 12 },
    };
  } else {
    // No marker legend -- centre the colour legend on the page.
    layout.legend.x = 0.5;
    layout.legend.xanchor = "center";
  }

  // Subplot grid with independent axes.
  // Domain per cell on the [0,1] paper. nCols cols × 2 rows.
  // The legend strip sits BETWEEN the two rows; rowGap is sized so that
  // free space = rowGap − bottomPadRow0 − topPad ≈ 0.14 paper, of which
  // the legend box uses ~0.05, leaving ~0.045 paper above AND below the
  // legend box (symmetric breathing room, legend anchored at y=0.5).
  //
  // colGap (between subplot domains) is sized so that adjacent cards end
  // up exactly 2px apart at their OUTER edges:
  //   colGap = rightPad + leftPad(next col) + 0.0015 (= 2px @ ~1380 wide)
  //          = 0.014    + 0.038             + 0.0015
  //          = 0.0535
  const nCols = OUTCOMES.length;
  const colGap = 0.0535, rowGap = 0.26;
  const colW = (1 - (nCols - 1) * colGap) / nCols;
  const rowH = (1 - rowGap) / 2;

  // Card geometry: rounded-rect background per subplot. Cards extend
  // OUTSIDE the subplot domain on all four sides to enclose the panel
  // title (top), x-axis tick labels + axis title on the bottom row
  // (bottom), and y-axis tick labels + axis title on the first column
  // (left). The leftmost column has a wider leftPad to host the y-axis
  // title text; other columns just need room for tick labels. Same logic
  // applies bottom-up: the bottom row has wider bottomPad to host the
  // x-axis title; the top row just needs tick-label room.
  // rx/ry approximate 4px corners on a typical 1380x540 viewport.
  // Pads are deliberately generous so panel title / axis title / tick
  // labels sit COMFORTABLY inside the card border on all four sides,
  // rather than kissing the border. Bumped 2026-05-20 per visual check.
  const cardRx = 0.003, cardRy = 0.008;
  const cardFill = "#ffffff";
  const cardStroke = "#e4e4e4";
  const topPad = 0.060;         // clearance above panel title
  const bottomPadRow1 = 0.090;  // bottom row (axis title + tick labels + margin)
  const bottomPadRow0 = 0.060;  // top row (tick labels + margin only)
  const leftPadCol0 = 0.068;    // leftmost column (axis title + ticks + margin)
  const leftPadOther = 0.038;   // other columns (tick labels + margin only)
  const rightPad = 0.014;       // modest right-edge clearance

  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < nCols; c++) {
      const ax = r * nCols + c + 1;
      const xname = ax > 1 ? `xaxis${ax}` : "xaxis";
      const yname = ax > 1 ? `yaxis${ax}` : "yaxis";
      const xref  = ax > 1 ? `x${ax}` : "x";
      const yref  = ax > 1 ? `y${ax}` : "y";
      const o = OUTCOMES[c], ch = CHANNELS[r];
      const { xmag, ymag } = final[o + "|" + ch];

      const x0 = c * (colW + colGap);
      const x1 = x0 + colW;
      const y1 = 1 - r * (rowH + rowGap);
      const y0 = y1 - rowH;

      layout[xname] = {
        domain: [x0, x1],
        anchor: yref.replace("y", "y"),
        range: [-xmag, xmag],
        zeroline: true, zerolinecolor: "#666", zerolinewidth: 1,
        gridcolor: "#eee", showline: false,
        ticks: "outside",
        title: r === 1 ? {
          text: "<b>parametric %</b>",
          standoff: 4,
          font: { size: 13, color: "#1f3a93" },
        } : "",
      };
      layout[yname] = {
        domain: [y0, y1],
        anchor: xref.replace("x", "x"),
        range: [-ymag, ymag],
        zeroline: true, zerolinecolor: "#666", zerolinewidth: 1,
        gridcolor: "#eee", showline: false,
        ticks: "outside",
        title: c === 0 ? {
          text: ch === "supply"
                  ? "<b>structural % (LoT→HiT)</b>"
                  : "<b>structural % (TS04→TS72)</b>",
          standoff: 4,
          font: { size: 13, color: "#1f3a93" },
        } : "",
      };

      // Card background: rounded-rect on paper coords, layer "below" so
      // axes/diagonals/markers all draw on top. Pushed first inside the
      // cell so the diagonals (added right after) sit on top of the card.
      // Card outer bounds extend beyond the subplot domain to enclose
      // panel title (top), tick labels + axis title (bottom row), and
      // tick labels + axis title (left column). Adjacent cards end up
      // 2px apart at their outer edges by construction (see colGap).
      const bp = (r === 1) ? bottomPadRow1 : bottomPadRow0;
      const lp = (c === 0) ? leftPadCol0   : leftPadOther;
      layout.shapes.push({
        type: "path",
        path: roundedRectPath(
          x0 - lp,        y0 - bp,
          x1 + rightPad,  y1 + topPad,
          cardRx, cardRy),
        xref: "paper", yref: "paper",
        fillcolor: cardFill,
        line: { color: cardStroke, width: 1 },
        layer: "below",
      });

      // Dashed y = +/- x diagonals.
      const diag = Math.max(xmag, ymag) * 1.5;
      const dline = (x0p, y0p, x1p, y1p) => ({
        type: "line", line: { color: "#999", width: 0.7, dash: "dash" },
        xref, yref, x0: x0p, y0: y0p, x1: x1p, y1: y1p, layer: "below",
      });
      layout.shapes.push(dline(-diag, -diag, diag,  diag));
      layout.shapes.push(dline(-diag,  diag, diag, -diag));

      // Subplot title above each panel: outcome (bold) + channel
      // sub-label. Repeated on every panel so each cell self-identifies.
      // Outcome name in Kanors brand blue for visual continuity with the
      // page H1 and the axis titles; channel sub-label stays muted grey so
      // the outcome remains the visual anchor.
      const subtitle = "<span style=\"color:#1f3a93\"><b>"
        + OUTCOME_LABELS[o] + "</b></span>"
        + "<br><span style=\"font-size:10.5px;color:#666\">"
        + CHANNEL_LABELS[ch] + "</span>";
      layout.annotations.push({
        text: subtitle,
        x: (x0 + x1) / 2, y: y1 + 0.014,
        xref: "paper", yref: "paper",
        xanchor: "center", yanchor: "bottom",
        showarrow: false, font: { size: 12.5 },
      });
    }
  }

  return layout;
}

function labelOf(key) {
  const o = ENCODING_OPTIONS.find(x => x.key === key);
  return o ? o.label : key;
}

// ----------------------------------------------------------------- render

function render() {
  const f = filteredPoints();
  const n = f.region.length;
  const countEl = document.getElementById("ph-count");
  countEl.textContent = `${n.toLocaleString()} point${n === 1 ? "" : "s"}`;
  // Tier the count's colour treatment by how heavily the filters cut the
  // plot. Default n per region is 2,880; 0 = zero (red), <1,440 (half of
  // default) = filtered (amber), otherwise = primary accent.
  countEl.classList.toggle("zero",     n === 0);
  countEl.classList.toggle("filtered", n > 0 && n < 1440);
  document.getElementById("ph-empty").hidden = (n > 0);
  document.getElementById("ph-current-region").textContent =
    REGION_LABELS[state.region] || state.region;

  const traces = buildTraces(f);
  const layout = buildLayout(f);
  Plotly.react("ph-plot", traces, layout,
    { responsive: true, displaylogo: false,
      modeBarButtonsToRemove: ["select2d", "lasso2d"] });

  // Reflect every state change in the URL hash so the current view is
  // copy-pasteable as a shareable link.
  updateUrlHash();
}

// ----------------------------------------------------------------- go

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
