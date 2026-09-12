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
    <div id="p79-word-search-canvas">
      {/* Top Metrics Row */}
      <div id="p79-metrics-row">
        <span id="p79-metric-chip-word">
          Target Word: <b>"{targetWord}"</b>
        </span>
        <span id="p79-metric-chip-match">
          Matched: <b>"{matched || targetWord.slice(0, path.length) || "Ø"}"</b> ({path.length} / {targetWord.length})
        </span>
        {r !== null && c !== null && (
          <span id="p79-metric-chip-head">
            Examining Cell: <b>({r}, {c})</b>
          </span>
        )}
      </div>

      {/* Target Word Character Tracker */}
      <div id="p79-word-tracker-bar">
        {targetWord.split("").map((ch, idx) => {
          const isMatched = idx < path.length;
          const isCurrentTarget = idx === path.length;

          let slotState = "idle";
          if (isMatched) slotState = "matched";
          else if (isCurrentTarget) slotState = "current";

          return (
            <div
              key={`p79-target-${idx}`}
              id={`p79-target-letter-slot-${idx}`}
              data-slot-state={slotState}
            >
              <span id={`p79-target-char-${idx}`}>{ch}</span>
              <span id={`p79-target-idx-${idx}`}>[{idx}]</span>
            </div>
          );
        })}
      </div>

      {/* 2D Grid Board */}
      <div id="p79-board-container">
        {grid.map((row, rIdx) => (
          <div key={`p79-row-${rIdx}`} id={`p79-board-row-${rIdx}`}>
            {row.map((val, cIdx) => {
              const isHead = headCoord && headCoord[0] === rIdx && headCoord[1] === cIdx;
              const isPath = pathSet.has(`${rIdx},${cIdx}`);
              const isCurrentCell = r === rIdx && c === cIdx;
              const pathIndex = path.findIndex(([pr, pc]) => pr === rIdx && pc === cIdx);

              let cellState = "idle";
              if (isHead) cellState = "head";
              else if (isPath) cellState = "path";
              else if (isCurrentCell && statusType === "conflict") cellState = "conflict";

              return (
                <motion.div
                  key={`p79-cell-${rIdx}-${cIdx}`}
                  id={`p79-grid-cell-${rIdx}-${cIdx}`}
                  data-state={cellState}
                  layout
                  animate={{
                    scale: isHead ? 1.08 : isPath ? 1.03 : 1
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 22 }}
                >
                  <span id={`p79-cell-letter-${rIdx}-${cIdx}`}>{val}</span>

                  <AnimatePresence mode="popLayout">
                    {isPath && (
                      <motion.span
                        key={`p79-order-${rIdx}-${cIdx}`}
                        id={`p79-cell-order-${rIdx}-${cIdx}`}
                        layout
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 22 }}
                      >
                        {pathIndex + 1}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  <span id={`p79-coord-tag-${rIdx}-${cIdx}`}>({rIdx},{cIdx})</span>
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
            id="p79-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div id="p79-callout-header-text">{output.label}</div>
            <div id="p79-callout-val-text">{output.value}</div>
            <div id="p79-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}