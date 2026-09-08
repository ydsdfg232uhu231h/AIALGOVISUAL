import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem78.css";

export default function Problem78({ stepData }) {
  const {
    nums = [1, 2, 3],
    currentPath = [],
    decision = "root",
    state = {},
    output
  } = stepData || {};

  const { i = null, curr = "[]", res = "[]", status } = state;
  const isComplete = status === "COMPLETED";

  // Safely parse power set list
  let powerSet = [];
  try {
    powerSet = typeof res === "string" ? JSON.parse(res.replace(/'/g, '"')) : res;
  } catch {
    powerSet = [];
  }

  return (
    <div className="canvas-wrapper subsets-canvas">
      {/* Metrics Row */}
      <div className="metrics-row">
        <span className="metric-chip index-chip">
          Current Index: <b>{i !== null ? `i = ${i}` : "Complete"}</b>
        </span>
        <span className="metric-chip decision-chip">
          Branch Choice: <b>{decision.replace(/_/g, " ").toUpperCase()}</b>
        </span>
        <span className="metric-chip count-chip">
          Subsets Generated: <b>{powerSet.length} / {Math.pow(2, nums.length)}</b>
        </span>
      </div>

      {/* Decision Pipeline for Input Elements */}
      <div className="elements-decision-track">
        <span className="track-title">Element Inclusion Status:</span>
        <div className="elements-stream">
          {nums.map((num, idx) => {
            const isEvaluating = idx === i;
            const isIncluded = currentPath.includes(num);

            return (
              <div key={`elem-${idx}`} className="decision-node">
                <div className="ptrs-group">
                  {isEvaluating && <span className="pointer-tag ptr-curr">i = {idx}</span>}
                </div>

                <motion.div
                  className={`element-card ${isIncluded ? "card-included" : "card-excluded"} ${
                    isEvaluating ? "card-active" : ""
                  }`}
                  animate={{
                    scale: isEvaluating ? 1.08 : 1,
                    y: isIncluded ? -4 : 0
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <span className="elem-val">{num}</span>
                  <span className="elem-status">
                    {isIncluded ? "INCLUDED" : "EXCLUDED"}
                  </span>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Subset Bag */}
      <div className="active-subset-container">
        <div className="subset-header">
          <span>Active Subset Path:</span>
          <span className="subset-code">[{currentPath.join(", ")}]</span>
        </div>
        <div className="subset-chips-row">
          <AnimatePresence>
            {currentPath.length === 0 ? (
              <span className="empty-subset-hint">∅ (Empty Set)</span>
            ) : (
              currentPath.map((val) => (
                <motion.span
                  key={`chip-${val}`}
                  className="path-chip"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {val}
                </motion.span>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Discovered Power Set Reel */}
      <div className="results-reel-card">
        <div className="reel-header">
          <span className="reel-title">Collected Power Set</span>
          <span className="reel-count">{powerSet.length} sets</span>
        </div>
        <div className="reel-chips-stream">
          {powerSet.length === 0 ? (
            <span className="reel-empty-text">Backtracking in progress...</span>
          ) : (
            powerSet.map((s, idx) => (
              <motion.span
                key={`${JSON.stringify(s)}-${idx}`}
                className="subset-badge"
                initial={{ opacity: 0, scale: 0.8, y: 3 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                [{Array.isArray(s) ? s.join(", ") : s}]
              </motion.span>
            ))
          )}
        </div>
      </div>

      {/* Output Result Callout */}
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