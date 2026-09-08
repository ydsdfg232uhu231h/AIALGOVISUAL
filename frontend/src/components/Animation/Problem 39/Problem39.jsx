import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem39.css";

export default function Problem39({ stepData }) {
  const {
    candidates = [2, 3, 4, 5, 6, 7],
    current = [],
    runningSum = 0,
    state = {},
    output
  } = stepData || {};

  const target = 7;
  const { sum = runningSum, res = "[]", idx: activeCandidateIdx = null, status } = state;
  const isComplete = status === "COMPLETED";

  let combinationsList = [];
  try {
    combinationsList = typeof res === "string" ? JSON.parse(res) : res;
  } catch {
    combinationsList = [];
  }

  const isExactMatch = sum === target;
  const isExceeded = sum > target;

  return (
    <div className="canvas-wrapper combo-sum-canvas">
      {/* Top Metrics Row */}
      <div className="metrics-row">
        <span className="metric-chip target-chip">
          Target Sum: <b>{target}</b>
        </span>
        <span
          className={`metric-chip sum-chip ${
            isExactMatch ? "chip-match" : isExceeded ? "chip-exceeded" : ""
          }`}
        >
          Running Sum: <b>{sum}</b> / {target}
        </span>
        {activeCandidateIdx !== null && activeCandidateIdx < candidates.length && (
          <span className="metric-chip candidate-chip">
            Active: <b>{candidates[activeCandidateIdx]} (Index {activeCandidateIdx})</b>
          </span>
        )}
      </div>

      {/* 6-Element Candidate Selection Bar */}
      <div className="candidates-selection-bar">
        <span className="bar-label">Candidates:</span>
        <div className="candidates-list">
          {candidates.map((c, idx) => {
            const isSelected = activeCandidateIdx === idx;
            return (
              <motion.div
                key={`cand-${idx}-${c}`}
                className={`candidate-badge ${isSelected ? "candidate-active" : ""}`}
                animate={{ scale: isSelected ? 1.15 : 1 }}
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
              >
                {c}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Current Branch Container */}
      <div className="current-bag-container">
        <div className="bag-header">
          <span>Current Path:</span>
          <span className="bag-equation">
            {current.length > 0 ? `${current.join(" + ")} = ${sum}` : "Empty"}
          </span>
        </div>

        <div className="bag-slots-stream">
          <AnimatePresence>
            {current.length === 0 ? (
              <span className="bag-empty-hint">No numbers chosen</span>
            ) : (
              current.map((val, i) => (
                <motion.div
                  key={`chosen-${i}-${val}`}
                  className={`chosen-chip ${isExactMatch ? "chip-success" : ""}`}
                  initial={{ scale: 0.7, opacity: 0, y: -8 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.7, opacity: 0, y: 8 }}
                  transition={{ type: "spring", stiffness: 350, damping: 22 }}
                >
                  {val}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Combinations Pool */}
      <div className="results-reel-card">
        <div className="reel-header">
          <span className="reel-title">Discovered Combinations</span>
          <span className="reel-count">Total: {combinationsList.length}</span>
        </div>
        <div className="reel-chips-stream">
          {combinationsList.length === 0 ? (
            <span className="reel-empty-text">Backtracking in progress...</span>
          ) : (
            combinationsList.map((combo, idx) => (
              <motion.span
                key={`${JSON.stringify(combo)}-${idx}`}
                className="combo-chip"
                initial={{ opacity: 0, scale: 0.8, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                [{combo.join(", ")}]
              </motion.span>
            ))
          )}
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