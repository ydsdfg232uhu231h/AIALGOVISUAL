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
    <div id="p994-oranges-canvas">
      {/* Top Metrics Row */}
      <div id="p994-metrics-bar">
        <span id="p994-metric-time">
          Elapsed Time: <b>{time} min</b>
        </span>
        <span
          id="p994-metric-fresh"
          data-is-cleared={fresh === 0 ? "true" : "false"}
        >
          Fresh Remaining: <b>{fresh}</b>
        </span>
        <span id="p994-metric-queue">
          BFS Frontier: <b>{queueCoords.length} cells</b>
        </span>
      </div>

      {/* 2D Matrix Grid */}
      <div id="p994-grid-outer-card">
        {grid.map((row, rIdx) => (
          <div key={`p994-row-${rIdx}`} id={`p994-grid-row-${rIdx}`}>
            {row.map((val, cIdx) => {
              const isRotten = val === 2;
              const isFresh = val === 1;
              const isEmpty = val === 0;
              const isInQueue = queueSet.has(`${rIdx},${cIdx}`);

              let cellState = "empty";
              if (isRotten) cellState = "rotten";
              else if (isFresh) cellState = "fresh";

              return (
                <motion.div
                  key={`p994-cell-${rIdx}-${cIdx}`}
                  id={`p994-orange-cell-${rIdx}-${cIdx}`}
                  data-cell-state={cellState}
                  data-in-frontier={isInQueue ? "true" : "false"}
                  layout
                  animate={{
                    scale: isInQueue ? 1.08 : 1
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 22 }}
                >
                  <span id={`p994-cell-glyph-${rIdx}-${cIdx}`}>
                    {isRotten && "☣"}
                    {isFresh && "🍊"}
                    {isEmpty && "•"}
                  </span>
                  <span id={`p994-cell-state-label-${rIdx}-${cIdx}`}>
                    {isRotten && "ROTTEN"}
                    {isFresh && "FRESH"}
                    {isEmpty && "EMPTY"}
                  </span>
                  <span id={`p994-coord-tag-${rIdx}-${cIdx}`}>
                    ({rIdx},{cIdx})
                  </span>
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Output Callout (Elevated safely above playback controls) */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p994-result-callout-box"
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ type: "spring", stiffness: 360, damping: 26 }}
          >
            <div id="p994-callout-header-text">{output.label}</div>
            <div id="p994-callout-val-text">{output.value}</div>
            <div id="p994-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}