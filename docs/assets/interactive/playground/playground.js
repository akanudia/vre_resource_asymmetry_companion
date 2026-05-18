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

const OUTCOMES = ["wind", "solar", "cost", "emis"];
const OUTCOME_LABELS = {
  wind:  "Wind generation",
  solar: "Solar generation",
  cost:  "System cost (NPV)",
  emis:  "CO₂ emissions",
};
const CHANNELS = ["supply", "temporal"];
const CHANNEL_LABELS = {
  supply:   "Supply  (LoT → HiT)",
  temporal: "Temporal  (TS04 → TS72)",
};

const FILTER_AXES = ["climate", "cost", "price", "ts", "tech_gran", "spat_gran"];
const FILTER_LABELS = {
  climate:   "Climate",
  cost:      "Tech cost",
  price:     "Fuel price",
  ts:        "TS res.",
  tech_gran: "Supply curve",
  spat_gran: "Reg. agg.",
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
  climate:   { C1: "#1a9850", C2: "#91cf60", C3: "#fee08b",
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

    buildRegionCombo();
    buildEncodingCombos();
    buildFilterChips();
    attachHandlers();
    render();
  } catch (err) {
    showError(err);
    throw err;
  }
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
    lbl.title = "Click to toggle all";
    lbl.addEventListener("click", () => toggleAxisAll(axis));
    grp.appendChild(lbl);

    for (const v of DATA.scenario_axes[axis]) {
      const chip = document.createElement("label");
      chip.className = "ph-chip checked";
      chip.dataset.value = v;
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
    const ax = (r - 1) * 4 + c;
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
    margin: { l: 56, r: 28, t: 84, b: 56 },
    plot_bgcolor: "white",
    hovermode: "closest",
    autosize: true,
    shapes: [],
    annotations: [],
    legend: {
      // Colour legend: horizontal strip above the grid, anchored left.
      orientation: "h",
      title: { text: "<b>Colour:</b> " + labelOf(state.colour) + "&nbsp;&nbsp;",
               side: "left" },
      x: 0, xanchor: "left", y: 1.08, yanchor: "bottom",
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
      orientation: "h",
      title: { text: "<b>Marker:</b> " + labelOf(state.marker) + "&nbsp;&nbsp;",
               side: "left" },
      x: 1, xanchor: "right", y: 1.08, yanchor: "bottom",
      bgcolor: "rgba(255,255,255,0.95)",
      bordercolor: "#ddd", borderwidth: 1,
      font: { size: 12 },
    };
  }

  // Subplot grid with independent axes.
  // Domain per cell on the [0,1] paper. 4 cols × 2 rows.
  // No legend reservation -- the legend is now a horizontal strip above
  // the grid (see legend.orientation = "h" above).
  const colGap = 0.05, rowGap = 0.13;
  const colW = (1 - 3 * colGap) / 4;
  const rowH = (1 - rowGap) / 2;

  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 4; c++) {
      const ax = r * 4 + c + 1;
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
        ticks: "outside", title: r === 1 ? { text: "parametric %", standoff: 4 } : "",
      };
      layout[yname] = {
        domain: [y0, y1],
        anchor: xref.replace("x", "x"),
        range: [-ymag, ymag],
        zeroline: true, zerolinecolor: "#666", zerolinewidth: 1,
        gridcolor: "#eee", showline: false,
        ticks: "outside",
        title: c === 0 ? { text: ch === "supply"
                                 ? "structural % (LoT→HiT)"
                                 : "structural % (TS04→TS72)",
                             standoff: 4 } : "",
      };

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
      const subtitle = "<b>" + OUTCOME_LABELS[o] + "</b>"
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
  countEl.textContent = `${n.toLocaleString()} point${n === 1 ? "" : "s"} in plot`;
  countEl.classList.toggle("zero", n === 0);
  document.getElementById("ph-empty").hidden = (n > 0);
  document.getElementById("ph-current-region").textContent =
    REGION_LABELS[state.region] || state.region;

  const traces = buildTraces(f);
  const layout = buildLayout(f);
  Plotly.react("ph-plot", traces, layout,
    { responsive: true, displaylogo: false,
      modeBarButtonsToRemove: ["select2d", "lasso2d"] });
}

// ----------------------------------------------------------------- go

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
