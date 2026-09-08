import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem72.css";

export default function Problem72({ stepData }) {
  const {
    table = [],
    currentI = 0,
    currentJ = 0,
    state = {},
    output
  } = stepData || {};

  const word1 = ["", "h", "o", "r", "s", "e"];
  const word2 = ["", "r", "o", "s"];

  const { char1, char2, val, status, minDistance } = state;
  const isComplete = status === "COMPLETED";

  return (
    <div className="canvas-wrapper edit-distance-canvas">
      {/* Metrics Row */}
      <div className="metrics-row">
        <span className="metric-chip word-chip">
          Transform: <b>"horse" ➔ "ros"</b>
        </span>
        {char1 && char2 && (
          <span className="metric-chip compare-chip">
            Comparing: <b>'{char1}' vs '{char2}'</b> {char1 === char2 ? "(Match!)" : "(Mismatch)"}
          </span>
        )}
        <span className="metric-chip cell-chip">
          Active Cell: <b>dp[{currentI}][{currentJ}] {val !== undefined ? `= ${val}` : ""}</b>
        </span>
        {minDistance !== undefined && (
          <span className="metric-chip result-chip">
            Min Operations: <b>{minDistance}</b>
          </span>
        )}
      </div>

      {/* 2D DP Levenshtein Table */}
      <div className="table-wrapper">
        {/* Column Headers: word2 */}
        <div className="table-header-row">
          <div className="header-cell corner-cell">w1 \ w2</div>
          {word2.map((ch, j) => (
            <div key={`head-${j}`} className={`header-cell col-header ${currentJ === j ? "active-header" : ""}`}>
              <span className="header-char">{ch === "" ? "ε" : ch}</span>
              <span className="header-idx">[{j}]</span>
            </div>
          ))}
        </div>

        {/* Table Body: word1 rows */}
        {table.map((row, i) => (
          <div key={`row-${i}`} className="table-data-row">
            {/* Row Header */}
            <div className={`header-cell row-header ${currentI === i ? "active-header" : ""}`}>
              <span className="header-char">{word1[i] === "" ? "ε" : word1[i]}</span>
              <span className="header-idx">[{i}]</span>
            </div>

            {/* Row Cells */}
            {row.map((cellVal, j) => {
              const isCurrent = i === currentI && j === currentJ;
              const isTarget = i === word1.length - 1 && j === word2.length - 1;
              const isTop = currentI > 0 && i === currentI - 1 && j === currentJ; // Delete
              const isLeft = currentJ > 0 && i === currentI && j === currentJ - 1; // Insert
              const isDiag = currentI > 0 && currentJ > 0 && i === currentI - 1 && j === currentJ - 1; // Replace/Match

              return (
                <motion.div
                  key={`cell-${i}-${j}`}
                  className={`dp-table-cell ${isCurrent ? "cell-current" : ""} ${
                    isDiag ? "cell-diag" : isTop ? "cell-top" : isLeft ? "cell-left" : ""
                  } ${isTarget && isComplete ? "cell-target-complete" : ""}`}
                  animate={{
                    scale: isCurrent || (isTarget && isComplete) ? 1.1 : 1
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="cell-num">{cellVal}</span>
                  {isCurrent && <span className="cell-badge">CURR</span>}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Dependency Legend */}
      <div className="dependency-legend">
        <span className="legend-item"><span className="legend-dot diag-dot" /> Diag (Replace/Match)</span>
        <span className="legend-item"><span className="legend-dot top-dot" /> Top (Delete)</span>
        <span className="legend-item"><span className="legend-dot left-dot" /> Left (Insert)</span>
      </div>

      {/* Result Callout */}
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