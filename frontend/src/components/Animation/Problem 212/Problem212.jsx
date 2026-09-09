import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem212.css";

export default function Problem212({ stepData }) {
  const {
    grid = [
      ["o", "a", "a", "n"],
      ["e", "t", "a", "e"],
      ["i", "h", "k", "r"],
      ["i", "f", "l", "v"]
    ],
    path = [], // Array of [r, c] coordinates in the active recursion branch
    activeCell = null,
    foundWords = [],
    failedWords = [], // Dictionary words verified to NOT exist / pruned
    prunedCell = null, // [r, c] that caused an invalid trie mismatch
    state = {},
    output
  } = stepData || {};

  const activeRow = activeCell ? activeCell[0] : null;
  const activeCol = activeCell ? activeCell[1] : null;
  const prunedRow = prunedCell ? prunedCell[0] : null;
  const prunedCol = prunedCell ? prunedCell[1] : null;
  const currentWord = state.word || "";
  const targetWords = ["oath", "pea", "eat", "rain"];

  const isCellInPath = (r, c) => path.some(([pr, pc]) => pr === r && pc === c);

  return (
    <div id="p212-wordsearch-canvas">
      {/* Top Status Metrics */}
      <div id="p212-metrics-row">
        <span id="p212-metric-target-words">
          Target Words: <b>{targetWords.length}</b>
        </span>

        {activeCell ? (
          <span id="p212-metric-exploring">
            Exploring Cell: <b>({activeRow}, {activeCol}) = '{grid[activeRow][activeCol]}'</b>
          </span>
        ) : (
          <span id="p212-metric-idle">
            Status: <b>Idle / Traversal Done</b>
          </span>
        )}

        <span id="p212-metric-prefix">
          Current Prefix: <b>"{currentWord}"</b>
        </span>

        <span id="p212-metric-found">
          Found: <b>{foundWords.length}</b>
        </span>

        <span id="p212-metric-failed">
          Pruned/Failed: <b>{failedWords.length}</b>
        </span>
      </div>

      <div id="p212-wordsearch-stage">
        {/* 2D Board Section */}
        <div id="p212-grid-card">
          <div id="p212-grid-card-header">
            <span id="p212-grid-header-title">2D Board (4×4 DFS Traversal)</span>
            <span id="p212-grid-header-sub">
              {path.length > 0 ? `Stack Depth: ${path.length}` : "Grid ready"}
            </span>
          </div>

          <div id="p212-board-grid">
            {grid.map((row, rIdx) =>
              row.map((ch, cIdx) => {
                const isActiveHead = activeRow === rIdx && activeCol === cIdx;
                const inCurrentPath = isCellInPath(rIdx, cIdx);
                const isPruned = prunedRow === rIdx && prunedCol === cIdx;
                const pathIndex = path.findIndex(([pr, pc]) => pr === rIdx && pc === cIdx);

                let cellState = "idle";
                if (isPruned) cellState = "pruned";
                else if (isActiveHead) cellState = "head";
                else if (inCurrentPath) cellState = "path";

                const targetScale = isPruned || isActiveHead ? 1.1 : inCurrentPath ? 1.04 : 1;

                return (
                  <motion.div
                    key={`p212-cell-${rIdx}-${cIdx}`}
                    id={`p212-board-cell-${rIdx}-${cIdx}`}
                    data-cell-state={cellState}
                    layout
                    animate={{
                      scale: targetScale,
                      y: isPruned || isActiveHead ? -2 : 0
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 20 }}
                  >
                    <span id={`p212-cell-char-${rIdx}-${cIdx}`}>{ch}</span>
                    <span id={`p212-cell-pos-${rIdx}-${cIdx}`}>{rIdx},{cIdx}</span>
                    {inCurrentPath && !isPruned && (
                      <span id={`p212-path-order-tag-${rIdx}-${cIdx}`}>#{pathIndex + 1}</span>
                    )}
                    {isPruned && (
                      <span id={`p212-dead-end-tag-${rIdx}-${cIdx}`}>PRUNED</span>
                    )}
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Dictionary Word Status Track */}
        <div id="p212-side-card">
          <div id="p212-side-card-header">
            <span id="p212-side-header-title">Trie Target Words Verification</span>
            <span id="p212-side-header-sub">{targetWords.length} dictionary words</span>
          </div>

          <div id="p212-words-stream">
            {targetWords.map((word) => {
              const isFound = foundWords.includes(word);
              const isFailed = failedWords.includes(word);
              const isMatching = currentWord === word && !isFound;

              let wordState = "pending";
              if (isFound) wordState = "found";
              else if (isFailed) wordState = "failed";
              else if (isMatching) wordState = "current";

              return (
                <motion.div
                  key={`p212-dict-${word}`}
                  id={`p212-dict-pill-${word}`}
                  data-word-state={wordState}
                  layout
                  animate={{ scale: isFound || isFailed ? 1.03 : 1 }}
                  transition={{ type: "spring", stiffness: 350, damping: 24 }}
                >
                  <div id={`p212-word-meta-${word}`}>
                    <span id={`p212-word-text-${word}`}>{word}</span>
                    {isFailed && (
                      <span id={`p212-reason-hint-${word}`}>not constructible</span>
                    )}
                  </div>
                  <span id={`p212-word-status-${word}`}>
                    {isFound ? "✓ FOUND" : isFailed ? "✕ NO MATCH" : isMatching ? "MATCHING..." : "PENDING"}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Current Search Path Tracker */}
          <div id="p212-prefix-tracker">
            <span id="p212-tracker-label">Active DFS Search Chain:</span>
            <div id="p212-tracker-path">
              {path.length > 0 ? (
                path.map(([pr, pc], idx) => (
                  <span key={`p212-path-${pr}-${pc}-${idx}`} id={`p212-path-letter-${idx}`}>
                    {grid[pr][pc]}
                    <span id={`p212-path-coord-${idx}`}>({pr},{pc})</span>
                    {idx < path.length - 1 && (
                      <span id={`p212-path-sep-${idx}`}>➔</span>
                    )}
                  </span>
                ))
              ) : (
                <span id="p212-empty-state-text">No active branch (at root)</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Result Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p212-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div id="p212-callout-header-text">{output.label}</div>
            <div id="p212-callout-val-text">{output.value}</div>
            <div id="p212-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 