import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem994.css";

export default function Problem994({ stepData }) {
  const {
    grid = [],
    minutes = 0,
    state = {},
    output
  } = stepData || {};

  const { fresh = 0, time = minutes, q = "[]" } = state;

  let queueCoords = [];
  try {
    queueCoords = typeof q === "string" ? JSON.parse(q) : q;
  } catch {
    queueCoords = [];
  }

  const queueSet = new Set(queueCoords.map(([r, c]) => `${r},${c}`));

  return (
    <div className="canvas-wrapper oranges-canvas">
      {/* Top Metrics Row */}
      <div className="metrics-row">
        <span className="metric-chip time-chip">
          Elapsed Time: <b>{time} min</b>
        </span>
        <span className={`metric-chip fresh-chip ${fresh === 0 ? "chip-cleared" : ""}`}>
          Fresh Remaining: <b>{fresh}</b>
        </span>
        <span className="metric-chip queue-chip">
          BFS Frontier: <b>{queueCoords.length} cells</b>
        </span>
      </div>

      {/* 2D Matrix Grid */}
      <div className="grid-outer-card">
        {grid.map((row, rIdx) => (
          <div key={`row-${rIdx}`} className="grid-row">
            {row.map((val, cIdx) => {
              const isRotten = val === 2;
              const isFresh = val === 1;
              const isEmpty = val === 0;
              const isInQueue = queueSet.has(`${rIdx},${cIdx}`);

              let cellStyle = "cell-empty";
              if (isRotten) cellStyle = "cell-rotten";
              else if (isFresh) cellStyle = "cell-fresh";

              return (
                <motion.div
                  key={`cell-${rIdx}-${cIdx}`}
                  className={`orange-cell ${cellStyle} ${isInQueue ? "cell-frontier" : ""}`}
                  animate={{
                    scale: isInQueue ? 1.08 : 1
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 22 }}
                >
                  <span className="cell-glyph">
                    {isRotten && "☣"}
                    {isFresh && "🍊"}
                    {isEmpty && "•"}
                  </span>
                  <span className="cell-state-label">
                    {isRotten && "ROTTEN"}
                    {isFresh && "FRESH"}
                    {isEmpty && "EMPTY"}
                  </span>
                  <span className="coord-tag">
                    ({rIdx},{cIdx})
                  </span>
                </motion.div>
              );
            })}
          </div>
        ))}
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