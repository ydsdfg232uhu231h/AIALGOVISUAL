import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem22.css";

export default function Problem22({ stepData }) {
  const {
    current = "",
    state = {},
    output
  } = stepData || {};

  const { openCount = 0, closeCount = 0, res = "[]", status } = state;
  const n = 3; // Fixed target for this problem instance
  const isComplete = status === "COMPLETED";

  // Parse accumulated results safely
  let resultsList = [];
  try {
    resultsList = typeof res === "string" ? JSON.parse(res.replace(/'/g, '"')) : res;
  } catch {
    resultsList = [];
  }

  // Create empty slots for the string builder
  const slots = Array.from({ length: 2 * n }, (_, i) => current[i] || null);

  const canAddOpen = openCount < n;
  const canAddClose = closeCount < openCount;

  return (
    <div className="canvas-wrapper paren-canvas">
      {/* Metrics Row */}
      <div className="metrics-row">
        <span className="metric-chip target-chip">
          Target Pairs: <b>n = {n}</b> (Length: {2 * n})
        </span>
        <span className="metric-chip count-chip open-count">
          Open '(': <b>{openCount}</b>
        </span>
        <span className="metric-chip count-chip close-count">
          Close ')': <b>{closeCount}</b>
        </span>
      </div>

      {/* Decision Rules Panel */}
      <div className="rules-panel">
        <div className={`rule-card ${canAddOpen ? "rule-valid" : "rule-invalid"}`}>
          <div className="rule-header">Can add '(' ?</div>
          <div className="rule-equation">open ({openCount}) &lt; n ({n})</div>
          <div className="rule-status">{canAddOpen ? "✔ YES" : "✖ NO"}</div>
        </div>
        <div className={`rule-card ${canAddClose ? "rule-valid" : "rule-invalid"}`}>
          <div className="rule-header">Can add ')' ?</div>
          <div className="rule-equation">close ({closeCount}) &lt; open ({openCount})</div>
          <div className="rule-status">{canAddClose ? "✔ YES" : "✖ NO"}</div>
        </div>
      </div>

      {/* String Builder Track */}
      <div className="builder-track">
        <div className="builder-title">Current String Generation</div>
        <div className="slots-container">
          {slots.map((char, idx) => {
            const isFilled = char !== null;
            const isOpenChar = char === "(";
            
            return (
              <motion.div
                key={`slot-${idx}-${char}`}
                className={`string-slot ${isFilled ? "slot-filled" : ""} ${
                  isOpenChar ? "slot-open" : char === ")" ? "slot-close" : ""
                }`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
              >
                {char || ""}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Accumulated Results Reel */}
      <div className="results-reel-card">
        <div className="reel-header">
          <span className="reel-title">Valid Combinations Found</span>
          <span className="reel-count">{resultsList.length} / 5</span>
        </div>
        <div className="reel-chips-stream">
          {resultsList.length === 0 ? (
            <span className="reel-empty-text">Backtracking in progress...</span>
          ) : (
            resultsList.map((combo, idx) => (
              <motion.span
                key={`${combo}-${idx}`}
                className="combo-chip"
                initial={{ opacity: 0, scale: 0.8, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {combo}
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