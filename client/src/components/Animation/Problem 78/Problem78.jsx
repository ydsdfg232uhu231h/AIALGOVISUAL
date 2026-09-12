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
    <div id="p78-subsets-canvas">
      {/* Metrics Row */}
      <div id="p78-metrics-row">
        <span id="p78-metric-chip-index">
          Current Index: <b>{i !== null ? `i = ${i}` : "Complete"}</b>
        </span>
        <span id="p78-metric-chip-decision">
          Branch Choice: <b>{decision.replace(/_/g, " ").toUpperCase()}</b>
        </span>
        <span id="p78-metric-chip-count">
          Subsets Generated: <b>{powerSet.length} / {Math.pow(2, nums.length)}</b>
        </span>
      </div>

      {/* Decision Pipeline for Input Elements */}
      <div id="p78-elements-decision-track">
        <span id="p78-track-title">Element Inclusion Status:</span>
        <div id="p78-elements-stream">
          {nums.map((num, idx) => {
            const isEvaluating = idx === i;
            const isIncluded = currentPath.includes(num);

            return (
              <div key={`p78-elem-${idx}`} id={`p78-decision-node-${idx}`}>
                <div id={`p78-ptrs-group-${idx}`}>
                  <AnimatePresence mode="popLayout">
                    {isEvaluating && (
                      <motion.span
                        key={`p78-ptr-${idx}`}
                        id={`p78-pointer-tag-curr-${idx}`}
                        layout
                        initial={{ y: -6, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -6, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 450, damping: 25 }}
                      >
                        i = {idx}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                <motion.div
                  id={`p78-element-card-${idx}`}
                  data-status={isIncluded ? "included" : "excluded"}
                  data-evaluating={isEvaluating ? "true" : "false"}
                  layout
                  animate={{
                    scale: isEvaluating ? 1.08 : 1,
                    y: isIncluded ? -4 : 0
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <span id={`p78-elem-val-${idx}`}>{num}</span>
                  <span id={`p78-elem-status-${idx}`}>
                    {isIncluded ? "INCLUDED" : "EXCLUDED"}
                  </span>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Subset Bag */}
      <div id="p78-active-subset-container">
        <div id="p78-subset-header">
          <span id="p78-subset-title">Active Subset Path:</span>
          <span id="p78-subset-code">[{currentPath.join(", ")}]</span>
        </div>
        <div id="p78-subset-chips-row">
          <AnimatePresence mode="popLayout">
            {currentPath.length === 0 ? (
              <span id="p78-empty-subset-hint">∅ (Empty Set)</span>
            ) : (
              currentPath.map((val) => (
                <motion.span
                  key={`p78-chip-${val}`}
                  id={`p78-path-chip-${val}`}
                  layout
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
      <div id="p78-results-reel-card">
        <div id="p78-reel-header">
          <span id="p78-reel-title">Collected Power Set</span>
          <span id="p78-reel-count">{powerSet.length} sets</span>
        </div>
        <div id="p78-reel-chips-stream">
          {powerSet.length === 0 ? (
            <span id="p78-reel-empty-text">Backtracking in progress...</span>
          ) : (
            powerSet.map((s, idx) => (
              <motion.span
                key={`p78-subset-${JSON.stringify(s)}-${idx}`}
                id={`p78-subset-badge-${idx}`}
                layout
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
            id="p78-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div id="p78-callout-header-text">{output.label}</div>
            <div id="p78-callout-val-text">{output.value}</div>
            <div id="p78-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}