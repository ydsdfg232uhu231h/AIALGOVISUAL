import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem48.css";

export default function Problem48({ stepData }) {
  const {
    matrix = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ],
    activeCells = [],
    state = {},
    output
  } = stepData || {};

  const { phase = "initial", swapped, status } = state;
  const isCompleted = status === "COMPLETED" || !!output;
  
  // FIX: Hoisted to the component scope so both the Matrix and Inspector can read it
  const isTransposePhase = phase === "initial" || phase === "transposed";

  // Determine user-friendly phase description
  let displayPhase = "1. Transpose Across Main Diagonal";
  if (isCompleted) displayPhase = "ROTATION COMPLETED ✓";
  else if (phase === "transposed") displayPhase = "TRANSPOSE COMPLETED";
  else if (phase === "reversing_rows") displayPhase = "2. Reverse Each Row Horizontally";

  const isCellActive = (r, c) =>
    activeCells.some(([ar, ac]) => ar === r && ac === c);

  return (
    <div id="rotate-image-canvas">
      {/* Top Metrics Row */}
      <div id="metrics-bar">
        <span id="metric-phase">
          Phase: <b>{displayPhase}</b>
        </span>

        <span id="metric-size">
          Matrix Size: <b>{matrix.length} x {matrix.length}</b>
        </span>

        {swapped ? (
          <span id="metric-swap-active">
            Active Swap: <b>{swapped}</b>
          </span>
        ) : (
          <span id="metric-swap-idle">
            Active Swap: <b>None</b>
          </span>
        )}
      </div>

      <div id="rotate-stage">
        {/* Main Matrix Board */}
        <div id="matrix-card">
          <div id="matrix-card-header">
            <span id="matrix-header-title">In-Place 2D Matrix (`matrix`)</span>
            <span id="matrix-header-sub">Time: O(n²) | Space: O(1)</span>
          </div>

          <div id="matrix-viewport">
            <div id="matrix-grid">
              {matrix.map((row, r) => (
                <div key={`row-${r}`} id={`matrix-row-${r}`}>
                  {row.map((val, c) => {
                    const isActive = isCellActive(r, c);
                    const isDiagonal = r === c;

                    // Determine Cell ID for styling
                    let cellId = `cell-idle-${r}-${c}`;
                    if (isCompleted) {
                      cellId = `cell-done-${r}-${c}`;
                    } else if (isActive) {
                      cellId = `cell-active-${r}-${c}`;
                    } else if (isDiagonal && isTransposePhase) {
                      cellId = `cell-diagonal-${r}-${c}`;
                    }

                    return (
                      <motion.div
                        key={`cell-${r}-${c}`}
                        id={cellId}
                        animate={{
                          scale: isActive ? 1.12 : 1,
                        }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      >
                        <span id={`coord-tag-${r}-${c}`}>
                          [{r},{c}]
                        </span>
                        <span id={`val-text-${r}-${c}`}>{val}</span>
                      </motion.div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Algorithm Inspector */}
        <div id="inspector-card">
          <div id="inspector-card-header">
            <span id="inspector-header-title">Rotation Algorithm Logic</span>
            <span id="inspector-header-sub">Mathematical 90° equivalent</span>
          </div>

          <div id="inspector-grid">
            <div id="box-step-1">
              <span id="title-step-1">Step 1: Transpose</span>
              <span id={isTransposePhase ? "val-step-1-active" : "val-step-1-idle"}>
                SWAP( matrix[i][j], matrix[j][i] )
              </span>
            </div>

            <div id="box-step-2">
              <span id="title-step-2">Step 2: Reverse Rows</span>
              <span id={phase === "reversing_rows" ? "val-step-2-active" : "val-step-2-idle"}>
                REVERSE( matrix[i] )
              </span>
            </div>
          </div>
        </div>
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