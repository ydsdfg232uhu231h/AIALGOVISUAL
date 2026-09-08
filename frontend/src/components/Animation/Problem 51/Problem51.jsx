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
    <div className="canvas-wrapper nqueens-canvas">
      {/* Metrics Row */}
      <div className="metrics-row">
        <span className="metric-chip row-chip">
          Evaluating Row: <b>{r !== null ? `r = ${r}` : "Complete"}</b>
        </span>
        <span className="metric-chip col-chip">
          Blocked Cols: <b>{cols}</b>
        </span>
        <span className="metric-chip diag-chip">
          Pos Diags (r+c): <b>{posDiag}</b>
        </span>
        <span className="metric-chip diag-chip">
          Neg Diags (r-c): <b>{negDiag}</b>
        </span>
      </div>

      {/* Action Banner */}
      <div className="action-feedback-bar">
        {action === "conflict" && (
          <span className="feedback-tag tag-conflict">
            ✖ Conflict at ({activeRow}, {activeCol}): {conflict || "Attacked by existing queen"}
          </span>
        )}
        {action === "placed" && (
          <span className="feedback-tag tag-placed">
            ✔ Safe cell! Placed Queen at ({activeRow}, {activeCol})
          </span>
        )}
        {action === "backtracking" && (
          <span className="feedback-tag tag-backtrack">
            ↺ Backtrack: Removed Queen at ({activeRow}, {activeCol})
          </span>
        )}
        {action === "testing" && activeRow !== null && (
          <span className="feedback-tag tag-testing">
            Testing square ({activeRow}, {activeCol})...
          </span>
        )}
      </div>

      {/* Chessboard Container */}
      <div className="board-outer-card">
        {/* Column Index Markers */}
        <div className="board-col-indices">
          <div className="corner-spacer" />
          {Array.from({ length: n }).map((_, cIdx) => (
            <span
              key={`col-idx-${cIdx}`}
              className={`col-idx-label ${c === cIdx ? "active-idx" : ""}`}
            >
              c{cIdx}
            </span>
          ))}
        </div>

        {/* Board Rows */}
        <div className="board-grid">
          {board.map((row, rIdx) => {
            const isCurrentRow = r === rIdx;

            return (
              <div key={`row-${rIdx}`} className="board-row">
                {/* Row Index Marker */}
                <span className={`row-idx-label ${isCurrentRow ? "active-idx" : ""}`}>
                  r{rIdx}
                </span>

                {/* Cells */}
                {row.map((cell, cIdx) => {
                  const isDarkSquare = (rIdx + cIdx) % 2 === 1;
                  const hasQueen = cell === "Q";
                  const isCurrentSquare = activeRow === rIdx && activeCol === cIdx;
                  const isConflictSquare = isCurrentSquare && action === "conflict";

                  return (
                    <motion.div
                      key={`cell-${rIdx}-${cIdx}`}
                      className={`chess-square ${isDarkSquare ? "sq-dark" : "sq-light"} ${
                        hasQueen ? "sq-queen" : ""
                      } ${isCurrentSquare && !hasQueen ? "sq-candidate" : ""} ${
                        isConflictSquare ? "sq-conflict" : ""
                      }`}
                      animate={{
                        scale: hasQueen || isCurrentSquare ? 1.06 : 1
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <AnimatePresence>
                        {hasQueen && (
                          <motion.div
                            key={`queen-${rIdx}-${cIdx}`}
                            className="queen-piece"
                            initial={{ scale: 0, rotate: -20 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0 }}
                            transition={{ type: "spring", stiffness: 350, damping: 20 }}
                          >
                            ♛
                          </motion.div>
                        )}
                        {isConflictSquare && (
                          <motion.span
                            key={`conflict-${rIdx}-${cIdx}`}
                            className="conflict-marker"
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0 }}
                          >
                            ✕
                          </motion.span>
                        )}
                        {isCurrentSquare && !hasQueen && !isConflictSquare && (
                          <motion.span
                            key={`dot-${rIdx}-${cIdx}`}
                            className="candidate-marker"
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