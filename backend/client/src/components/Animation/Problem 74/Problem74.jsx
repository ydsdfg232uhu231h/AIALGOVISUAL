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
    <div id="p74-matrix-bs-canvas">
      {/* Search Metrics Bar */}
      <div id="p74-metrics-bar">
        <span id="p74-metric-chip-target">
          Target: <b>{target}</b>
        </span>
        <span id="p74-metric-chip-range">
          1D Range: low = <b>{low}</b>, high = <b>{high}</b>
        </span>
        {mid !== null && (
          <span id="p74-metric-chip-mid">
            mid = <b>{mid}</b> ➔ [{activeRow}, {activeCol}] (val: {val ?? matrix[activeRow]?.[activeCol]})
          </span>
        )}
        {found && (
          <span id="p74-metric-chip-success">
            Found: <b>True</b>
          </span>
        )}
      </div>

      {/* 2D Matrix Grid */}
      <div id="p74-matrix-container">
        {matrix.map((row, r) => (
          <div key={`p74-row-${r}`} id={`p74-matrix-row-${r}`}>
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
                  key={`p74-cell-${r}-${c}`}
                  id={`p74-matrix-node-${r}-${c}`}
                  data-state={nodeState}
                  layout
                  animate={{
                    scale: isMatch ? 1.15 : isMid ? 1.08 : 1,
                    opacity: inRange ? 1 : 0.28
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <div id={`p74-cell-indices-${r}-${c}`}>
                    <span id={`p74-flat-idx-${r}-${c}`}>#{flatIdx}</span>
                    <span id={`p74-rc-idx-${r}-${c}`}>[{r},{c}]</span>
                  </div>

                  <span id={`p74-node-val-${r}-${c}`}>{cellVal}</span>

                  <AnimatePresence mode="popLayout">
                    {isMid && (
                      <motion.span
                        key={`p74-mid-${r}-${c}`}
                        id={`p74-mid-tag-${r}-${c}`}
                        layout
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        transition={{ type: "spring", stiffness: 450, damping: 25 }}
                      >
                        MID
                      </motion.span>
                    )}
                  </AnimatePresence>
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
            id="p74-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div id="p74-callout-header-text">{output.label}</div>
            <div id="p74-callout-val-text">{output.value}</div>
            <div id="p74-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}