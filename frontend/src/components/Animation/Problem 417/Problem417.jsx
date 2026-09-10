import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem417.css";

export default function Problem417({ stepData }) {
  const {
    heights = [
      [1, 2, 2, 3, 5],
      [3, 2, 3, 4, 4],
      [2, 4, 5, 3, 1],
      [6, 7, 1, 4, 5],
      [5, 1, 1, 2, 4]
    ],
    pacificCells = [],
    atlanticCells = [],
    intersectCells = [],
    state = {},
    output
  } = stepData || {};

  const numCols = heights[0]?.length || 5;
  const isCellIn = (r, c, list) => list.some(([row, col]) => row === r && col === c);

  return (
    <div id="p417-pacific-atlantic-canvas">
      {/* Top Telemetry Header */}
      <div id="p417-metrics-bar">
        <span id="p417-metric-grid-dim">
          Grid: <b>{heights.length} × {numCols}</b>
        </span>

        <span id="p417-metric-pac-count">
          Pacific Reached: <b>{pacificCells.length} cells</b>
        </span>

        <span id="p417-metric-atl-count">
          Atlantic Reached: <b>{atlanticCells.length} cells</b>
        </span>

        <span id="p417-metric-overlap-count">
          Intersection (Both): <b>{intersectCells.length} cells</b>
        </span>
      </div>

      <div id="p417-matrix-stage">
        <div id="p417-terrain-card">
          <div id="p417-card-header-bar">
            <span id="p417-card-title">2D Elevation Map &amp; Reverse Ocean Flow</span>
            <span id="p417-card-sub">Pacific: Top / Left ➔ Atlantic: Bottom / Right</span>
          </div>

          {/* Coastal Matrix Enclosure */}
          <div id="p417-coastal-matrix-enclosure">
            {/* Row 1: Top Ocean Bar */}
            <div id="p417-corner-top-left" data-ocean="pacific" />
            <div id="p417-coastal-rail-top" data-ocean="pacific">
              ▲ PACIFIC OCEAN (NORTH) ▲
            </div>
            <div id="p417-corner-top-right" />

            {/* Row 2: Left Rail + Grid + Right Rail */}
            <div id="p417-coastal-rail-left" data-ocean="pacific">
              <span>◄ PACIFIC (WEST)</span>
            </div>

            <div
              id="p417-elevation-cells-grid"
              style={{
                gridTemplateColumns: `repeat(${numCols}, minmax(0, 1fr))`
              }}
            >
              {heights.map((row, r) =>
                row.map((val, c) => {
                  const inPac = isCellIn(r, c, pacificCells);
                  const inAtl = isCellIn(r, c, atlanticCells);
                  const inIntersect = isCellIn(r, c, intersectCells) || (inPac && inAtl);

                  let cellState = "idle";
                  if (inIntersect) cellState = "both";
                  else if (inPac) cellState = "pacific";
                  else if (inAtl) cellState = "atlantic";

                  return (
                    <motion.div
                      key={`p417-cell-${r}-${c}`}
                      id={`p417-cell-${r}-${c}`}
                      data-cell-state={cellState}
                      layout
                      animate={{
                        scale: inIntersect ? 1.06 : inPac || inAtl ? 1.03 : 1
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 22
                      }}
                    >
                      {inIntersect && <span id={`p417-beacon-${r}-${c}`}>★</span>}
                      <span id={`p417-elevation-val-${r}-${c}`}>{val}</span>
                      <span id={`p417-cell-coords-${r}-${c}`}>[{r},{c}]</span>
                    </motion.div>
                  );
                })
              )}
            </div>

            <div id="p417-coastal-rail-right" data-ocean="atlantic">
              <span>ATLANTIC (EAST) ►</span>
            </div>

            {/* Row 3: Bottom Ocean Bar */}
            <div id="p417-corner-bottom-left" />
            <div id="p417-coastal-rail-bottom" data-ocean="atlantic">
              ▼ ATLANTIC OCEAN (SOUTH) ▼
            </div>
            <div id="p417-corner-bottom-right" data-ocean="atlantic" />
          </div>

          {/* Color Legend */}
          <div id="p417-ocean-legend">
            <span id="p417-legend-item-pac">
              <span id="p417-dot-pac" /> Pacific Flow
            </span>
            <span id="p417-legend-item-atl">
              <span id="p417-dot-atl" /> Atlantic Flow
            </span>
            <span id="p417-legend-item-both">
              <span id="p417-dot-both" /> Flows to BOTH (Solution)
            </span>
          </div>
        </div>
      </div>

      {/* Result Callout (Elevated safely above bottom controls) */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p417-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div id="p417-callout-header-text">{output.label}</div>
            <div id="p417-callout-val-text">{output.value}</div>
            <div id="p417-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}