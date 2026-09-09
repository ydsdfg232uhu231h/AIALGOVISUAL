import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem62.css";

export default function Problem62({ stepData }) {
  const {
    grid = [],
    currentRow = null,
    state = {},
    output
  } = stepData || {};

  const numRows = grid.length;
  const numCols = grid[0]?.length || 0;
  const { row: dpRowStr, uniquePaths, status } = state;
  const isComplete = status === "COMPLETED";

  return (
    <div id="p62-grid-paths-canvas">
      {/* Metrics Row */}
      <div id="p62-metrics-row">
        <span id="p62-metric-chip-size">
          Grid Size: <b>{numRows} × {numCols}</b>
        </span>
        {currentRow !== null && (
          <span id="p62-metric-chip-row">
            Active DP Row: <b>Row {currentRow}</b>
          </span>
        )}
        {dpRowStr && (
          <span id="p62-metric-chip-dp">
            1D DP Array: <b>{dpRowStr}</b>
          </span>
        )}
        {uniquePaths && (
          <span id="p62-metric-chip-paths">
            Total Paths: <b>{uniquePaths}</b>
          </span>
        )}
      </div>

      {/* 2D Grid Representation */}
      <div id="p62-dp-grid-container">
        {grid.map((row, r) => (
          <div key={`p62-row-${r}`} id={`p62-dp-grid-row-${r}`}>
            {row.map((val, c) => {
              const isStart = r === 0 && c === 0;
              const isTarget = r === numRows - 1 && c === numCols - 1;
              const isActiveRow = r === currentRow;
              const hasComputed = val > 0;

              return (
                <motion.div
                  key={`p62-cell-${r}-${c}`}
                  id={`p62-cell-${r}-${c}`}
                  data-state={hasComputed ? "computed" : "uncomputed"}
                  data-active-row={isActiveRow ? "true" : "false"}
                  data-target-complete={isTarget && isComplete ? "true" : "false"}
                  layout
                  animate={{
                    scale: isTarget && isComplete ? 1.12 : isActiveRow && val > 0 ? 1.05 : 1,
                    borderColor:
                      isTarget && isComplete
                        ? "#22c55e"
                        : isActiveRow
                        ? "#38bdf8"
                        : hasComputed
                        ? "#3f3f46"
                        : "#27272a"
                  }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <div id={`p62-cell-badges-${r}-${c}`}>
                    <span id={`p62-coord-tag-${r}-${c}`}>
                      {r},{c}
                    </span>
                    {isStart && (
                      <span id={`p62-role-tag-${r}-${c}`} data-role="start">
                        START
                      </span>
                    )}
                    {isTarget && (
                      <span id={`p62-role-tag-${r}-${c}`} data-role="end">
                        GOAL
                      </span>
                    )}
                  </div>

                  <span id={`p62-dp-value-${r}-${c}`}>
                    {val > 0 ? val : "·"}
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
            id="p62-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div id="p62-callout-header-text">{output.label}</div>
            <div id="p62-callout-val-text">{output.value}</div>
            <div id="p62-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}