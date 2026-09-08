import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem74.css";

export default function Problem74({ stepData }) {
  const {
    matrix = [],
    activeRow = null,
    activeCol = null,
    state = {},
    output
  } = stepData || {};

  const numRows = matrix.length;
  const numCols = matrix[0]?.length || 4;
  const { low = 0, high = numRows * numCols - 1, mid = null, target = 3, val, found } = state;

  return (
    <div id="matrix-bs-canvas">
      {/* Search Metrics Bar */}
      <div id="metrics-bar">
        <span id="metric-chip-target">
          Target: <b>{target}</b>
        </span>
        <span id="metric-chip-range">
          1D Range: low = <b>{low}</b>, high = <b>{high}</b>
        </span>
        {mid !== null && (
          <span id="metric-chip-mid">
            mid = <b>{mid}</b> ➔ [{activeRow}, {activeCol}] (val: {val ?? matrix[activeRow]?.[activeCol]})
          </span>
        )}
        {found && (
          <span id="metric-chip-success">
            Found: <b>True</b>
          </span>
        )}
      </div>

      {/* 2D Matrix Grid */}
      <div id="matrix-container">
        {matrix.map((row, r) => (
          <div key={`row-${r}`} id={`matrix-row-${r}`}>
            {row.map((cellVal, c) => {
              const flatIdx = r * numCols + c;
              const inRange = flatIdx >= low && flatIdx <= high;
              const isMid = r === activeRow && c === activeCol;
              const isMatch = found === "True" && isMid;

              let nodeState = inRange ? "in-range" : "out-range";
              if (isMatch) nodeState = "match";
              else if (isMid) nodeState = "mid";

              return (
                <motion.div
                  key={`cell-${r}-${c}`}
                  id={`matrix-node-${nodeState}-${r}-${c}`}
                  animate={{
                    scale: isMatch ? 1.15 : isMid ? 1.08 : 1,
                    opacity: inRange ? 1 : 0.28
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <div id={`cell-indices-${r}-${c}`}>
                    <span id={`flat-idx-${r}-${c}`}>#{flatIdx}</span>
                    <span id={`rc-idx-${r}-${c}`}>[{r},{c}]</span>
                  </div>

                  <span id={`node-val-${r}-${c}`}>{cellVal}</span>

                  {isMid && <span id={`mid-tag-${r}-${c}`}>MID</span>}
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