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
    <div className="canvas-wrapper wordsearch-canvas">
      {/* Top Status Metrics */}
      <div className="metrics-row">
        <span className="metric-chip trie-chip">
          Target Words: <b>{targetWords.length}</b>
        </span>
        {activeCell ? (
          <span className="metric-chip active-chip">
            Exploring Cell: <b>({activeRow}, {activeCol}) = '{grid[activeRow][activeCol]}'</b>
          </span>
        ) : (
          <span className="metric-chip idle-chip">Status: <b>Idle / Traversal Done</b></span>
        )}
        <span className="metric-chip path-chip">
          Current Prefix: <b>"{currentWord}"</b>
        </span>
        <span className="metric-chip found-chip">
          Found: <b>{foundWords.length}</b>
        </span>
        <span className="metric-chip failed-chip">
          Pruned/Failed: <b>{failedWords.length}</b>
        </span>
      </div>

      <div className="wordsearch-stage">
        {/* 2D Board Section */}
        <div className="track-card grid-card">
          <div className="card-header-bar">
            <span>2D Board (4×4 DFS Traversal)</span>
            <span className="card-sub">
              {path.length > 0 ? `Stack Depth: ${path.length}` : "Grid ready"}
            </span>
          </div>

          <div className="board-grid">
            {grid.map((row, rIdx) =>
              row.map((ch, cIdx) => {
                const isActiveHead = activeRow === rIdx && activeCol === cIdx;
                const inCurrentPath = isCellInPath(rIdx, cIdx);
                const isPruned = prunedRow === rIdx && prunedCol === cIdx;
                const pathIndex = path.findIndex(([pr, pc]) => pr === rIdx && pc === cIdx);

                return (
                  <motion.div
                    key={`cell-${rIdx}-${cIdx}`}
                    className={`board-cell ${
                      isPruned
                        ? "cell-pruned"
                        : isActiveHead
                        ? "cell-head"
                        : inCurrentPath
                        ? "cell-in-path"
                        : ""
                    }`}
                    animate={{
                      scale: isPruned || isActiveHead ? 1.12 : inCurrentPath ? 1.04 : 1,
                      y: isPruned || isActiveHead ? -2 : 0
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 20 }}
                  >
                    <span className="cell-char">{ch}</span>
                    <span className="cell-pos">{rIdx},{cIdx}</span>
                    {inCurrentPath && !isPruned && (
                      <span className="path-order-tag">#{pathIndex + 1}</span>
                    )}
                    {isPruned && <span className="dead-end-tag">PRUNED</span>}
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Dictionary Word Status Track */}
        <div className="track-card side-card">
          <div className="card-header-bar">
            <span>Trie Target Words Verification</span>
            <span className="card-sub">{targetWords.length} dictionary words</span>
          </div>

          <div className="words-stream">
            {targetWords.map((word) => {
              const isFound = foundWords.includes(word);
              const isFailed = failedWords.includes(word);
              const isMatching = currentWord === word && !isFound;

              return (
                <motion.div
                  key={`dict-${word}`}
                  layout
                  className={`dict-pill ${
                    isFound
                      ? "pill-found"
                      : isFailed
                      ? "pill-failed"
                      : isMatching
                      ? "pill-current"
                      : ""
                  }`}
                  animate={{ scale: isFound || isFailed ? 1.03 : 1 }}
                >
                  <div className="word-meta">
                    <span className="word-text">{word}</span>
                    {isFailed && <span className="reason-hint">not constructible</span>}
                  </div>
                  <span className="word-status">
                    {isFound ? "✓ FOUND" : isFailed ? "✕ NO MATCH" : isMatching ? "MATCHING..." : "PENDING"}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Current Search Path Tracker */}
          <div className="prefix-tracker">
            <span className="tracker-label">Active DFS Search Chain:</span>
            <div className="tracker-path">
              {path.length > 0 ? (
                path.map(([pr, pc], idx) => (
                  <span key={idx} className="path-letter">
                    {grid[pr][pc]}
                    <span className="path-coord">({pr},{pc})</span>
                    {idx < path.length - 1 && <span className="path-sep">➔</span>}
                  </span>
                ))
              ) : (
                <span className="empty-state-text">No active branch (at root)</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Result Callout */}
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