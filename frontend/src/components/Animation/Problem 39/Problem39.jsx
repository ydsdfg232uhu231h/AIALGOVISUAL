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

  let sumState = "idle";
  if (isExactMatch) sumState = "match";
  else if (isExceeded) sumState = "exceeded";

  return (
    <div id="p39-combo-sum-canvas">
      {/* Top Metrics Row */}
      <div id="p39-metrics-row">
        <span id="p39-metric-chip-target">
          Target Sum: <b>{target}</b>
        </span>
        <span id="p39-metric-chip-sum" data-state={sumState}>
          Running Sum: <b>{sum}</b> / {target}
        </span>
        {activeCandidateIdx !== null && activeCandidateIdx < candidates.length && (
          <span id="p39-metric-chip-candidate">
            Active: <b>{candidates[activeCandidateIdx]} (Index {activeCandidateIdx})</b>
          </span>
        )}
      </div>

      {/* 6-Element Candidate Selection Bar */}
      <div id="p39-candidates-selection-bar">
        <span id="p39-bar-label">Candidates:</span>
        <div id="p39-candidates-list">
          {candidates.map((c, idx) => {
            const isSelected = activeCandidateIdx === idx;
            return (
              <motion.div
                key={`p39-cand-${idx}-${c}`}
                id={`p39-candidate-badge-${idx}`}
                data-selected={isSelected ? "true" : "false"}
                layout
                animate={{ scale: isSelected ? 1.15 : 1 }}
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
              >
                <span id={`p39-candidate-val-${idx}`}>{c}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Current Branch Container */}
      <div id="p39-current-bag-container">
        <div id="p39-bag-header">
          <span id="p39-bag-title">Current Path:</span>
          <span id="p39-bag-equation">
            {current.length > 0 ? `${current.join(" + ")} = ${sum}` : "Empty"}
          </span>
        </div>

        <div id="p39-bag-slots-stream">
          <AnimatePresence mode="popLayout">
            {current.length === 0 ? (
              <span id="p39-bag-empty-hint">No numbers chosen</span>
            ) : (
              current.map((val, i) => (
                <motion.div
                  key={`p39-chosen-${i}-${val}`}
                  id={`p39-chosen-chip-${i}`}
                  data-state={isExactMatch ? "match" : "idle"}
                  layout
                  initial={{ scale: 0.7, opacity: 0, y: -8 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.7, opacity: 0, y: 8 }}
                  transition={{ type: "spring", stiffness: 350, damping: 22 }}
                >
                  <span id={`p39-chosen-val-${i}`}>{val}</span>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Combinations Pool */}
      <div id="p39-results-reel-card">
        <div id="p39-reel-header">
          <span id="p39-reel-title">Discovered Combinations</span>
          <span id="p39-reel-count">Total: {combinationsList.length}</span>
        </div>
        <div id="p39-reel-chips-stream">
          {combinationsList.length === 0 ? (
            <span id="p39-reel-empty-text">Backtracking in progress...</span>
          ) : (
            combinationsList.map((combo, idx) => (
              <motion.span
                key={`p39-combo-${JSON.stringify(combo)}-${idx}`}
                id={`p39-combo-chip-${idx}`}
                layout
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
            id="p39-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div id="p39-callout-header-text">{output.label}</div>
            <div id="p39-callout-val-text">{output.value}</div>
            <div id="p39-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}