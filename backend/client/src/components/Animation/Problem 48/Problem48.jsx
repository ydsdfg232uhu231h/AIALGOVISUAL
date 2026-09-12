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
  
  const isTransposePhase = phase === "initial" || phase === "transposed";

  // Determine user-friendly phase description
  let displayPhase = "1. Transpose Across Main Diagonal";
  if (isCompleted) displayPhase = "ROTATION COMPLETED ✓";
  else if (phase === "transposed") displayPhase = "TRANSPOSE COMPLETED";
  else if (phase === "reversing_rows") displayPhase = "2. Reverse Each Row Horizontally";

  const isCellActive = (r, c) =>
    activeCells.some(([ar, ac]) => ar === r && ac === c);

  return (
    <div id="p48-rotate-image-canvas">
      {/* Top Metrics Row */}
      <div id="p48-metrics-bar">
        <span id="p48-metric-phase">
          Phase: <b>{displayPhase}</b>
        </span>

        <span id="p48-metric-size">
          Matrix Size: <b>{matrix.length} x {matrix.length}</b>
        </span>

        {swapped ? (
          <span id="p48-metric-swap-active">
            Active Swap: <b>{swapped}</b>
          </span>
        ) : (
          <span id="p48-metric-swap-idle">
            Active Swap: <b>None</b>
          </span>
        )}
      </div>

      <div id="p48-rotate-stage">
        {/* Main Matrix Board */}
        <div id="p48-matrix-card">
          <div id="p48-matrix-card-header">
            <span id="p48-matrix-header-title">In-Place 2D Matrix (`matrix`)</span>
            <span id="p48-matrix-header-sub">Time: O(n²) | Space: O(1)</span>
          </div>

          <div id="p48-matrix-viewport">
            <div id="p48-matrix-grid">
              {matrix.map((row, r) => (
                <div key={`p48-row-${r}`} id={`p48-matrix-row-${r}`}>
                  {row.map((val, c) => {
                    const isActive = isCellActive(r, c);
                    const isDiagonal = r === c;

                    let cellState = "idle";
                    if (isCompleted) {
                      cellState = "done";
                    } else if (isActive) {
                      cellState = "active";
                    } else if (isDiagonal && isTransposePhase) {
                      cellState = "diagonal";
                    }

                    return (
                      <motion.div
                        key={`p48-cell-${r}-${c}`}
                        id={`p48-cell-${r}-${c}`}
                        data-state={cellState}
                        layout
                        animate={{
                          scale: isActive ? 1.12 : 1,
                        }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      >
                        <span id={`p48-coord-tag-${r}-${c}`}>
                          [{r},{c}]
                        </span>
                        <span id={`p48-val-text-${r}-${c}`}>{val}</span>
                      </motion.div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Algorithm Inspector */}
        <div id="p48-inspector-card">
          <div id="p48-inspector-card-header">
            <span id="p48-inspector-header-title">Rotation Algorithm Logic</span>
            <span id="p48-inspector-header-sub">Mathematical 90° equivalent</span>
          </div>

          <div id="p48-inspector-grid">
            <div id="p48-box-step-1">
              <span id="p48-title-step-1">Step 1: Transpose</span>
              <span
                id="p48-val-step-1"
                data-active={isTransposePhase ? "true" : "false"}
              >
                SWAP( matrix[i][j], matrix[j][i] )
              </span>
            </div>

            <div id="p48-box-step-2">
              <span id="p48-title-step-2">Step 2: Reverse Rows</span>
              <span
                id="p48-val-step-2"
                data-active={phase === "reversing_rows" ? "true" : "false"}
              >
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
            id="p48-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div id="p48-callout-header-text">{output.label}</div>
            <div id="p48-callout-val-text">{output.value}</div>
            <div id="p48-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}