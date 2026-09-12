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
    <div id="p72-edit-distance-canvas">
      {/* Metrics Row */}
      <div id="p72-metrics-row">
        <span id="p72-metric-chip-word">
          Transform: <b>"horse" ➔ "ros"</b>
        </span>
        {char1 && char2 && (
          <span id="p72-metric-chip-compare">
            Comparing: <b>'{char1}' vs '{char2}'</b> {char1 === char2 ? "(Match!)" : "(Mismatch)"}
          </span>
        )}
        <span id="p72-metric-chip-cell">
          Active Cell: <b>dp[{currentI}][{currentJ}] {val !== undefined ? `= ${val}` : ""}</b>
        </span>
        {minDistance !== undefined && (
          <span id="p72-metric-chip-result">
            Min Operations: <b>{minDistance}</b>
          </span>
        )}
      </div>

      {/* 2D DP Levenshtein Table */}
      <div id="p72-table-wrapper">
        {/* Column Headers: word2 */}
        <div id="p72-table-header-row">
          <div id="p72-header-cell-corner">w1 \ w2</div>
          {word2.map((ch, j) => (
            <div
              key={`p72-head-${j}`}
              id={`p72-col-header-${j}`}
              data-active={currentJ === j ? "true" : "false"}
            >
              <span id={`p72-col-header-char-${j}`}>{ch === "" ? "ε" : ch}</span>
              <span id={`p72-col-header-idx-${j}`}>[{j}]</span>
            </div>
          ))}
        </div>

        {/* Table Body: word1 rows */}
        {table.map((row, i) => (
          <div key={`p72-row-${i}`} id={`p72-table-data-row-${i}`}>
            {/* Row Header */}
            <div
              id={`p72-row-header-${i}`}
              data-active={currentI === i ? "true" : "false"}
            >
              <span id={`p72-row-header-char-${i}`}>{word1[i] === "" ? "ε" : word1[i]}</span>
              <span id={`p72-row-header-idx-${i}`}>[{i}]</span>
            </div>

            {/* Row Cells */}
            {row.map((cellVal, j) => {
              const isCurrent = i === currentI && j === currentJ;
              const isTarget = i === word1.length - 1 && j === word2.length - 1;
              const isTop = currentI > 0 && i === currentI - 1 && j === currentJ; // Delete
              const isLeft = currentJ > 0 && i === currentI && j === currentJ - 1; // Insert
              const isDiag = currentI > 0 && currentJ > 0 && i === currentI - 1 && j === currentJ - 1; // Replace/Match

              let cellState = "idle";
              if (isTarget && isComplete) cellState = "target-complete";
              else if (isCurrent) cellState = "current";
              else if (isDiag) cellState = "diag";
              else if (isTop) cellState = "top";
              else if (isLeft) cellState = "left";

              return (
                <motion.div
                  key={`p72-cell-${i}-${j}`}
                  id={`p72-dp-table-cell-${i}-${j}`}
                  data-cell-state={cellState}
                  layout
                  animate={{
                    scale: isCurrent || (isTarget && isComplete) ? 1.1 : 1
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <span id={`p72-cell-num-${i}-${j}`}>{cellVal}</span>
                  <AnimatePresence mode="popLayout">
                    {isCurrent && (
                      <motion.span
                        key={`p72-badge-${i}-${j}`}
                        id={`p72-cell-badge-${i}-${j}`}
                        layout
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                      >
                        CURR
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Dependency Legend */}
      <div id="p72-dependency-legend">
        <span id="p72-legend-item-diag">
          <span id="p72-legend-dot-diag" data-dot="diag" /> Diag (Replace/Match)
        </span>
        <span id="p72-legend-item-top">
          <span id="p72-legend-dot-top" data-dot="top" /> Top (Delete)
        </span>
        <span id="p72-legend-item-left">
          <span id="p72-legend-dot-left" data-dot="left" /> Left (Insert)
        </span>
      </div>

      {/* Result Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p72-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div id="p72-callout-header-text">{output.label}</div>
            <div id="p72-callout-val-text">{output.value}</div>
            <div id="p72-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}