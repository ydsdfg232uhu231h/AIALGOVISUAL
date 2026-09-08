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
    <div className="canvas-wrapper swim-canvas">
      {/* Top Telemetry */}
      <div className="metrics-row">
        <span className="metric-chip water-chip">
          Water Level: <b>t = {currentTime}</b>
        </span>
        <span className="metric-chip swimmer-chip">
          Swimmer: <b>({currR}, {currC})</b>
        </span>
        <span className="metric-chip heap-chip">
          Min-Heap Size: <b>{heapItems.length}</b>
        </span>
        <span className="metric-chip target-chip">
          Target: <b>({targetCell[0]}, {targetCell[1]})</b>
        </span>
      </div>

      {/* Main 5x5 Grid & Priority Queue Stage */}
      <div className="swim-stage">
        {/* 5x5 Elevation Grid Card */}
        <div className="water-grid-card">
          <div className="grid-header-label">5x5 Elevation Terrain Grid</div>
          <div
            className="terrain-grid terrain-grid-5"
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

                return (
                  <motion.div
                    key={`cell-${r}-${c}`}
                    className={`terrain-cell ${isSubmerged ? "cell-submerged" : "cell-dry"} ${
                      isCurrent ? "cell-active-swimmer" : ""
                    } ${isTarget ? "cell-target-dest" : ""}`}
                    animate={{
                      scale: isCurrent ? 1.1 : 1
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 20 }}
                  >
                    {/* Water Level Rise Fill */}
                    <AnimatePresence>
                      {isSubmerged && (
                        <motion.div
                          className="water-surface-fill"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "100%", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: "easeOut" }}
                        />
                      )}
                    </AnimatePresence>

                    {/* Cell Content */}
                    <div className="cell-content">
                      <span className="elevation-val">{elevation}</span>
                      <span className="cell-coord">({r},{c})</span>
                    </div>

                    {/* Swimmer Marker */}
                    {isCurrent && (
                      <motion.div
                        className="swimmer-pin"
                        initial={{ scale: 0.5, y: -6 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 18 }}
                      >
                        🏊
                      </motion.div>
                    )}

                    {isTarget && !isCurrent && <span className="dest-tag">TARGET</span>}
                    {isVisited && !isCurrent && <span className="visited-dot" />}
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Priority Queue (Min-Heap) Inspection */}
        <div className="heap-panel">
          <div className="panel-title">Min-Heap Priority Queue [t, r, c]</div>
          <div className="heap-stream">
            {heapItems.length === 0 ? (
              <span className="heap-empty">Queue empty / expanding...</span>
            ) : (
              heapItems.slice(0, 6).map(([timeVal, hr, hc], idx) => {
                const isNextMin = idx === 0;

                return (
                  <motion.div
                    key={`heap-${hr}-${hc}-${timeVal}-${idx}`}
                    className={`heap-chip-item ${isNextMin ? "heap-chip-min" : ""}`}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="heap-min-tag">
                      {isNextMin ? "MIN ROOT" : `#${idx + 1}`}
                    </div>
                    <div className="heap-coords">({hr}, {hc})</div>
                    <div className="heap-time">Req: t={timeVal}</div>
                  </motion.div>
                );
              })
            )}
          </div>

          <div className="water-level-meter">
            <span className="meter-label">Global Water Level ({currentTime} / {maxGridVal})</span>
            <div className="meter-bar-track">
              <motion.div
                className="meter-bar-fill"
                animate={{ width: `${Math.min(100, (currentTime / maxGridVal) * 100)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Output Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="result-callout"
          >
            <div className="callout-header">{output.label}</div>
            <div className="callout-val">{output.value}</div>
            <div className="callout-detail">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}