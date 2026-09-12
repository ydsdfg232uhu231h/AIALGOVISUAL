import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem51.css";

export default function Problem51({ stepData }) {
  const {
    board = [
      [".", ".", ".", "."],
      [".", ".", ".", "."],
      [".", ".", ".", "."],
      [".", ".", ".", "."]
    ],
    activeRow = null,
    activeCol = null,
    conflict = null,
    action = "testing", // "testing" | "conflict" | "placed" | "backtracking"
    state = {},
    output
  } = stepData || {};

  const { r = activeRow, c = activeCol, cols = "{}", posDiag = "{}", negDiag = "{}" } = state;
  const n = board.length;

  return (
    <div id="p51-nqueens-canvas">
      {/* Metrics Row */}
      <div id="p51-metrics-row">
        <span id="p51-metric-chip-row">
          Evaluating Row: <b>{r !== null ? `r = ${r}` : "Complete"}</b>
        </span>
        <span id="p51-metric-chip-col">
          Blocked Cols: <b>{cols}</b>
        </span>
        <span id="p51-metric-chip-posdiag">
          Pos Diags (r+c): <b>{posDiag}</b>
        </span>
        <span id="p51-metric-chip-negdiag">
          Neg Diags (r-c): <b>{negDiag}</b>
        </span>
      </div>

      {/* Action Banner */}
      <div id="p51-action-feedback-bar">
        {action === "conflict" && (
          <span id="p51-feedback-tag-conflict">
            ✖ Conflict at ({activeRow}, {activeCol}): {conflict || "Attacked by existing queen"}
          </span>
        )}
        {action === "placed" && (
          <span id="p51-feedback-tag-placed">
            ✔ Safe cell! Placed Queen at ({activeRow}, {activeCol})
          </span>
        )}
        {action === "backtracking" && (
          <span id="p51-feedback-tag-backtrack">
            ↺ Backtrack: Removed Queen at ({activeRow}, {activeCol})
          </span>
        )}
        {action === "testing" && activeRow !== null && (
          <span id="p51-feedback-tag-testing">
            Testing square ({activeRow}, {activeCol})...
          </span>
        )}
      </div>

      {/* Chessboard Container */}
      <div id="p51-board-outer-card">
        {/* Column Index Markers */}
        <div id="p51-board-col-indices">
          <div id="p51-corner-spacer" />
          {Array.from({ length: n }).map((_, cIdx) => (
            <span
              key={`p51-col-idx-${cIdx}`}
              id={`p51-col-idx-label-${cIdx}`}
              data-active={c === cIdx ? "true" : "false"}
            >
              c{cIdx}
            </span>
          ))}
        </div>

        {/* Board Rows */}
        <div id="p51-board-grid">
          {board.map((row, rIdx) => {
            const isCurrentRow = r === rIdx;

            return (
              <div key={`p51-row-${rIdx}`} id={`p51-board-row-${rIdx}`}>
                {/* Row Index Marker */}
                <span
                  id={`p51-row-idx-label-${rIdx}`}
                  data-active={isCurrentRow ? "true" : "false"}
                >
                  r{rIdx}
                </span>

                {/* Cells */}
                {row.map((cell, cIdx) => {
                  const isDarkSquare = (rIdx + cIdx) % 2 === 1;
                  const hasQueen = cell === "Q";
                  const isCurrentSquare = activeRow === rIdx && activeCol === cIdx;
                  const isConflictSquare = isCurrentSquare && action === "conflict";

                  let squareState = "empty";
                  if (hasQueen) squareState = "queen";
                  else if (isConflictSquare) squareState = "conflict";
                  else if (isCurrentSquare) squareState = "candidate";

                  return (
                    <motion.div
                      key={`p51-cell-${rIdx}-${cIdx}`}
                      id={`p51-cell-${rIdx}-${cIdx}`}
                      data-theme={isDarkSquare ? "dark" : "light"}
                      data-state={squareState}
                      layout
                      animate={{
                        scale: hasQueen || isCurrentSquare ? 1.06 : 1
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <AnimatePresence mode="popLayout">
                        {hasQueen && (
                          <motion.span
                            key={`p51-queen-${rIdx}-${cIdx}`}
                            id={`p51-queen-piece-${rIdx}-${cIdx}`}
                            initial={{ scale: 0, rotate: -20 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0 }}
                            transition={{ type: "spring", stiffness: 350, damping: 20 }}
                          >
                            ♛
                          </motion.span>
                        )}
                        {isConflictSquare && (
                          <motion.span
                            key={`p51-conflict-${rIdx}-${cIdx}`}
                            id={`p51-conflict-marker-${rIdx}-${cIdx}`}
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0 }}
                          >
                            ✕
                          </motion.span>
                        )}
                        {isCurrentSquare && !hasQueen && !isConflictSquare && (
                          <motion.span
                            key={`p51-dot-${rIdx}-${cIdx}`}
                            id={`p51-candidate-marker-${rIdx}-${cIdx}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            •
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Output Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p51-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div id="p51-callout-header-text">{output.label}</div>
            <div id="p51-callout-val-text">{output.value}</div>
            <div id="p51-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}