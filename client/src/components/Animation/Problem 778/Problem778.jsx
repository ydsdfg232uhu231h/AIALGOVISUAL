import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem778.css";

export default function Problem778({ stepData }) {
  const {
    grid = [
      [0, 2, 4, 6, 8],
      [16, 18, 20, 22, 10],
      [14, 12, 24, 21, 11],
      [15, 13, 23, 17, 9],
      [19, 5, 3, 7, 1]
    ],
    visited = [],
    currentCell = [0, 0],
    currentTime = 0,
    state = {},
    output
  } = stepData || {};

  const N = grid.length;
  const targetCell = [N - 1, N - 1];

  let heapItems = [];
  try {
    heapItems = typeof state.minHeap === "string" ? JSON.parse(state.minHeap) : state.minHeap || [];
  } catch {
    heapItems = [];
  }

  const visitedSet = new Set(visited.map(([r, c]) => `${r},${c}`));
  const [currR, currC] = currentCell || [0, 0];
  const maxGridVal = Math.max(...grid.flat(), 1);

  return (
    <div id="p778-swim-canvas">
      {/* Top Telemetry */}
      <div id="p778-metrics-bar">
        <span id="p778-metric-water">
          Water Level: <b>t = {currentTime}</b>
        </span>
        <span id="p778-metric-swimmer">
          Swimmer: <b>({currR}, {currC})</b>
        </span>
        <span id="p778-metric-heap">
          Min-Heap Size: <b>{heapItems.length}</b>
        </span>
        <span id="p778-metric-target">
          Target: <b>({targetCell[0]}, {targetCell[1]})</b>
        </span>
      </div>

      {/* Main 5x5 Grid & Priority Queue Stage */}
      <div id="p778-swim-stage">
        {/* 5x5 Elevation Grid Card */}
        <div id="p778-water-grid-card">
          <div id="p778-grid-header-label">5x5 Elevation Terrain Grid</div>
          <div
            id="p778-terrain-grid"
            style={{
              gridTemplateColumns: `repeat(${N}, minmax(0, 1fr))`
            }}
          >
            {grid.map((row, r) =>
              row.map((elevation, c) => {
                const isCurrent = currR === r && currC === c;
                const isVisited = visitedSet.has(`${r},${c}`);
                const isSubmerged = elevation <= currentTime;
                const isTarget = r === targetCell[0] && c === targetCell[1];

                let cellState = "dry";
                if (isCurrent) cellState = "active";
                else if (isSubmerged) cellState = "submerged";

                return (
                  <motion.div
                    key={`p778-cell-${r}-${c}`}
                    id={`p778-terrain-cell-${r}-${c}`}
                    data-cell-state={cellState}
                    data-is-target={isTarget ? "true" : "false"}
                    layout
                    animate={{
                      scale: isCurrent ? 1.08 : 1
                    }}
                    transition={{ type: "spring", stiffness: 340, damping: 24 }}
                  >
                    {/* Water Level Rise Fill */}
                    <AnimatePresence>
                      {isSubmerged && (
                        <motion.div
                          id={`p778-water-surface-fill-${r}-${c}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "100%", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: "easeOut" }}
                        />
                      )}
                    </AnimatePresence>

                    {/* Cell Content */}
                    <div id={`p778-cell-content-${r}-${c}`}>
                      <span id={`p778-elevation-val-${r}-${c}`}>{elevation}</span>
                      <span id={`p778-cell-coord-${r}-${c}`}>({r},{c})</span>
                    </div>

                    {/* Swimmer Marker */}
                    {isCurrent && (
                      <motion.div
                        id={`p778-swimmer-pin-${r}-${c}`}
                        initial={{ scale: 0.5, y: -6 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 18 }}
                      >
                        🏊
                      </motion.div>
                    )}

                    {isTarget && !isCurrent && (
                      <span id={`p778-dest-tag-${r}-${c}`}>TARGET</span>
                    )}
                    {isVisited && !isCurrent && (
                      <span id={`p778-visited-dot-${r}-${c}`} />
                    )}
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Priority Queue (Min-Heap) Inspection */}
        <div id="p778-heap-panel">
          <div id="p778-panel-title">Min-Heap Priority Queue [t, r, c]</div>
          <div id="p778-heap-stream">
            {heapItems.length === 0 ? (
              <span id="p778-heap-empty">Queue empty / expanding...</span>
            ) : (
              heapItems.slice(0, 6).map(([timeVal, hr, hc], idx) => {
                const isNextMin = idx === 0;

                return (
                  <motion.div
                    key={`p778-heap-${hr}-${hc}-${timeVal}-${idx}`}
                    id={`p778-heap-chip-${hr}-${hc}-${idx}`}
                    data-is-min={isNextMin ? "true" : "false"}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div id={`p778-heap-min-tag-${hr}-${hc}-${idx}`}>
                      {isNextMin ? "MIN ROOT" : `#${idx + 1}`}
                    </div>
                    <div id={`p778-heap-coords-${hr}-${hc}-${idx}`}>({hr}, {hc})</div>
                    <div id={`p778-heap-time-${hr}-${hc}-${idx}`}>Req: t={timeVal}</div>
                  </motion.div>
                );
              })
            )}
          </div>

          <div id="p778-water-level-meter">
            <span id="p778-meter-label">Global Water Level ({currentTime} / {maxGridVal})</span>
            <div id="p778-meter-bar-track">
              <motion.div
                id="p778-meter-bar-fill"
                animate={{ width: `${Math.min(100, (currentTime / maxGridVal) * 100)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Output Callout (Elevated safely above playback controls) */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p778-result-callout-box"
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ type: "spring", stiffness: 360, damping: 26 }}
          >
            <div id="p778-callout-header-text">{output.label}</div>
            <div id="p778-callout-val-text">{output.value}</div>
            <div id="p778-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}