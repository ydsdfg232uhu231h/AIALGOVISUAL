import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem200.css";

export default function Problem200({ stepData }) {
  const {
    grid = [
      ["1", "1", "0", "0"],
      ["1", "1", "0", "0"],
      ["0", "0", "1", "0"],
      ["0", "0", "0", "1"]
    ],
    scanPos = [0, 0], // Current cell being evaluated by outer loop: [r, c]
    floodCells = [], // Cells currently being flooded in this DFS step: [[0,0], [0,1], ...]
    sunkIslands = [], // All cells that have been explored and sunk: [[r, c], ...]
    count = 0,
    activeIsland = null,
    output
  } = stepData || {};

  const isCellIn = (r, c, list) =>
    Array.isArray(list) && list.some(([row, col]) => row === r && col === c);

  return (
    <div id="p200-islands-canvas">
      {/* Top Telemetry Header */}
      <div id="p200-metrics-bar">
        <span id="p200-metric-grid-dim">
          Grid: <b>{grid.length} × {grid[0]?.length || 0}</b>
        </span>

        <span id="p200-metric-scan-pos">
          Scanner: <b>[{scanPos[0]}, {scanPos[1]}]</b>
        </span>

        <span id="p200-metric-island-count">
          Islands Found: <b>{count}</b>
        </span>

        <span
          id="p200-metric-status"
          data-status={activeIsland !== null ? "flooding" : "scanning"}
        >
          Status: <b>{activeIsland !== null ? `FLOOD-FILLING ISLAND #${activeIsland}` : "SCANNING FOR LAND ('1')"}</b>
        </span>
      </div>

      {/* Main Grid Stage */}
      <div id="p200-islands-stage">
        <div id="p200-terrain-card">
          <div id="p200-card-header-bar">
            <span>2D Island Matrix & DFS Sinking</span>
            <span id="p200-card-sub">Land '1' is flood-filled to '0' to avoid duplicate counting</span>
          </div>

          <div id="p200-grid-viewport">
            <div
              id="p200-cells-grid"
              style={{
                gridTemplateColumns: `repeat(${grid[0]?.length || 4}, 1fr)`
              }}
            >
              {grid.map((row, r) =>
                row.map((val, c) => {
                  const isScanning = scanPos[0] === r && scanPos[1] === c;
                  const isFlooding = isCellIn(r, c, floodCells);
                  const isSunk = isCellIn(r, c, sunkIslands);
                  const isLand = val === "1";

                  let cellState = "water";
                  if (isFlooding) cellState = "flooding";
                  else if (isSunk) cellState = "sunk";
                  else if (isLand) cellState = "land";

                  const targetScale = isFlooding ? 1.1 : isScanning ? 1.05 : 1;

                  return (
                    <div key={`p200-cell-wrap-${r}-${c}`} id={`p200-cell-wrapper-${r}-${c}`}>
                      {/* Scan Cursor Pointer */}
                      <AnimatePresence mode="popLayout">
                        {isScanning && (
                          <motion.div
                            key="p200-scan-cursor"
                            id="p200-scan-cursor-badge"
                            layoutId="p200-scan-cursor"
                            initial={{ y: -6, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -6, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 450, damping: 28 }}
                          >
                            ▼
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* The Grid Cell Node */}
                      <motion.div
                        id={`p200-cell-${r}-${c}`}
                        data-cell-state={cellState}
                        layout
                        animate={{ scale: targetScale }}
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 24
                        }}
                      >
                        <span id={`p200-cell-val-${r}-${c}`}>{val}</span>
                        <span id={`p200-cell-coords-${r}-${c}`}>[{r},{c}]</span>

                        {isFlooding && <div id={`p200-cell-flood-ring-${r}-${c}`} />}
                      </motion.div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Color Key */}
          <div id="p200-islands-legend">
            <span id="p200-legend-item-land">
              <span id="p200-dot-land" data-dot="land" /> Unvisited Land ('1')
            </span>
            <span id="p200-legend-item-flooding">
              <span id="p200-dot-flooding" data-dot="flooding" /> DFS Active Flood Fill
            </span>
            <span id="p200-legend-item-sunk">
              <span id="p200-dot-sunk" data-dot="sunk" /> Sunk Island Component ('0')
            </span>
            <span id="p200-legend-item-water">
              <span id="p200-dot-water" data-dot="water" /> Water / Ocean ('0')
            </span>
          </div>
        </div>
      </div>

      {/* Result Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p200-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div id="p200-callout-header-text">{output.label}</div>
            <div id="p200-callout-val-text">{output.value}</div>
            <div id="p200-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}