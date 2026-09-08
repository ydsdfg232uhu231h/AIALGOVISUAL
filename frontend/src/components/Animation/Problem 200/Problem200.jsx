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
    <div id="islands-canvas">
      {/* Top Telemetry Header */}
      <div id="metrics-bar">
        <span id="metric-grid-dim" className="metric-chip">
          Grid: <b>{grid.length} × {grid[0]?.length || 0}</b>
        </span>

        <span id="metric-scan-pos" className="metric-chip">
          Scanner: <b>[{scanPos[0]}, {scanPos[1]}]</b>
        </span>

        <span id="metric-island-count" className="metric-chip">
          Islands Found: <b>{count}</b>
        </span>

        <span
          id={activeIsland !== null ? "metric-status-flooding" : "metric-status-scanning"}
          className="metric-chip"
        >
          Status: <b>{activeIsland !== null ? `FLOOD-FILLING ISLAND #${activeIsland}` : "SCANNING FOR LAND ('1')"}</b>
        </span>
      </div>

      {/* Main Grid Stage */}
      <div id="islands-stage">
        <div id="terrain-card" className="track-card">
          <div className="card-header-bar">
            <span>2D Island Matrix & DFS Sinking</span>
            <span className="card-sub">Land '1' is flood-filled to '0' to avoid duplicate counting</span>
          </div>

          <div id="grid-viewport">
            <div
              id="cells-grid"
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

                  let stateClass = "cell-water";
                  if (isFlooding) stateClass = "cell-flooding";
                  else if (isSunk) stateClass = "cell-sunk";
                  else if (isLand) stateClass = "cell-land";

                  return (
                    <div key={`cell-${r}-${c}`} className="cell-wrapper">
                      {/* Scan Cursor Pointer */}
                      {isScanning && (
                        <motion.div
                          id="scan-cursor-badge"
                          layoutId="scan-cursor"
                          transition={{ type: "spring", stiffness: 450, damping: 28 }}
                        >
                          ▼
                        </motion.div>
                      )}

                      {/* The Grid Cell Node */}
                      <motion.div
                        id={`cell-${r}-${c}`}
                        className={`island-cell ${stateClass}`}
                        animate={{
                          scale: isFlooding ? [1, 1.12, 1] : isScanning ? 1.06 : 1
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 22,
                          scale: isFlooding ? { repeat: Infinity, duration: 1 } : undefined
                        }}
                      >
                        <span className="cell-val">{val}</span>
                        <span className="cell-coords">[{r},{c}]</span>

                        {isFlooding && <div className="cell-flood-ring" />}
                      </motion.div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Color Key */}
          <div id="islands-legend">
            <span className="legend-item"><span className="dot dot-land" /> Unvisited Land ('1')</span>
            <span className="legend-item"><span className="dot dot-flooding" /> DFS Active Flood Fill</span>
            <span className="legend-item"><span className="dot dot-sunk" /> Sunk Island Component ('0')</span>
            <span className="legend-item"><span className="dot dot-water" /> Water / Ocean ('0')</span>
          </div>
        </div>
      </div>

      {/* Result Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div id="callout-header-text">{output.label}</div>
            <div id="callout-val-text">{output.value}</div>
            <div id="callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}