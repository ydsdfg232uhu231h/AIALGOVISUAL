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
    <div className="canvas-wrapper grid-paths-canvas">
      {/* Metrics Row */}
      <div className="metrics-row">
        <span className="metric-chip size-chip">
          Grid Size: <b>{numRows} × {numCols}</b>
        </span>
        {currentRow !== null && (
          <span className="metric-chip row-chip">
            Active DP Row: <b>Row {currentRow}</b>
          </span>
        )}
        {dpRowStr && (
          <span className="metric-chip dp-chip">
            1D DP Array: <b>{dpRowStr}</b>
          </span>
        )}
        {uniquePaths && (
          <span className="metric-chip paths-chip">
            Total Paths: <b>{uniquePaths}</b>
          </span>
        )}
      </div>

      {/* 2D Grid Representation */}
      <div className="dp-grid-container">
        {grid.map((row, r) => (
          <div key={`row-${r}`} className="dp-grid-row">
            {row.map((val, c) => {
              const isStart = r === 0 && c === 0;
              const isTarget = r === numRows - 1 && c === numCols - 1;
              const isActiveRow = r === currentRow;
              const hasComputed = val > 0;

              return (
                <motion.div
                  key={`cell-${r}-${c}`}
                  className={`dp-cell ${isActiveRow ? "active-row-cell" : ""} ${
                    hasComputed ? "computed-cell" : "uncomputed-cell"
                  } ${isTarget && isComplete ? "target-complete" : ""}`}
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
                  <div className="cell-badges">
                    <span className="coord-tag">
                      {r},{c}
                    </span>
                    {isStart && <span className="role-tag start-tag">START</span>}
                    {isTarget && <span className="role-tag end-tag">GOAL</span>}
                  </div>

                  <span className="dp-value">{val > 0 ? val : "·"}</span>
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