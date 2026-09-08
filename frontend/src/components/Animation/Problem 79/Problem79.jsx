import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem79.css";

export default function Problem79({ stepData }) {
  const {
    grid = [
      ["A", "B", "C", "E"],
      ["S", "F", "C", "S"],
      ["A", "D", "E", "E"]
    ],
    path = [],
    state = {},
    statusType = "normal", // "normal" | "conflict" | "found"
    output
  } = stepData || {};

  const targetWord = "ABCCED";
  const { r = null, c = null, i = path.length, matched = "" } = state;

  const pathSet = new Set(path.map(([pr, pc]) => `${pr},${pc}`));
  const headCoord = path.length > 0 ? path[path.length - 1] : null;

  return (
    <div className="canvas-wrapper word-search-canvas">
      {/* Top Metrics Row */}
      <div className="metrics-row">
        <span className="metric-chip word-chip">
          Target Word: <b>"{targetWord}"</b>
        </span>
        <span className="metric-chip match-chip">
          Matched: <b>"{matched || targetWord.slice(0, path.length) || "Ø"}"</b> ({path.length} / {targetWord.length})
        </span>
        {r !== null && c !== null && (
          <span className="metric-chip head-chip">
            Examining Cell: <b>({r}, {c})</b>
          </span>
        )}
      </div>

      {/* Target Word Character Tracker */}
      <div className="word-tracker-bar">
        {targetWord.split("").map((ch, idx) => {
          const isMatched = idx < path.length;
          const isCurrentTarget = idx === path.length;

          return (
            <div
              key={`target-${idx}`}
              className={`target-letter-slot ${isMatched ? "slot-matched" : ""} ${
                isCurrentTarget ? "slot-current" : ""
              }`}
            >
              <span className="target-char">{ch}</span>
              <span className="target-idx">[{idx}]</span>
            </div>
          );
        })}
      </div>

      {/* 2D Grid Board (Larger Size) */}
      <div className="board-container">
        {grid.map((row, rIdx) => (
          <div key={`row-${rIdx}`} className="board-row">
            {row.map((val, cIdx) => {
              const isHead = headCoord && headCoord[0] === rIdx && headCoord[1] === cIdx;
              const isPath = pathSet.has(`${rIdx},${cIdx}`);
              const isCurrentCell = r === rIdx && c === cIdx;
              const pathIndex = path.findIndex(([pr, pc]) => pr === rIdx && pc === cIdx);

              let cellClass = "grid-cell";
              if (isHead) cellClass += " cell-head";
              else if (isPath) cellClass += " cell-path";
              else if (isCurrentCell && statusType === "conflict") cellClass += " cell-conflict";

              return (
                <motion.div
                  key={`cell-${rIdx}-${cIdx}`}
                  className={cellClass}
                  animate={{
                    scale: isHead ? 1.08 : isPath ? 1.03 : 1
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 22 }}
                >
                  <span className="cell-letter">{val}</span>
                  {isPath && <span className="cell-order">{pathIndex + 1}</span>}
                  <span className="coord-tag">({rIdx},{cIdx})</span>
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