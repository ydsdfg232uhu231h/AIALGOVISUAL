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
    <div id="p22-paren-canvas">
      {/* Metrics Row */}
      <div id="p22-metrics-row">
        <span id="p22-metric-target">
          Target Pairs: <b>n = {n}</b> (Length: {2 * n})
        </span>
        <span id="p22-metric-open-count">
          Open '(': <b>{openCount}</b>
        </span>
        <span id="p22-metric-close-count">
          Close ')': <b>{closeCount}</b>
        </span>
      </div>

      {/* Decision Rules Panel */}
      <div id="p22-rules-panel">
        <div
          id="p22-rule-card-open"
          data-valid={canAddOpen ? "true" : "false"}
        >
          <div id="p22-rule-header-open">Can add '(' ?</div>
          <div id="p22-rule-equation-open">open ({openCount}) &lt; n ({n})</div>
          <div id="p22-rule-status-open">{canAddOpen ? "✔ YES" : "✖ NO"}</div>
        </div>
        <div
          id="p22-rule-card-close"
          data-valid={canAddClose ? "true" : "false"}
        >
          <div id="p22-rule-header-close">Can add ')' ?</div>
          <div id="p22-rule-equation-close">close ({closeCount}) &lt; open ({openCount})</div>
          <div id="p22-rule-status-close">{canAddClose ? "✔ YES" : "✖ NO"}</div>
        </div>
      </div>

      {/* String Builder Track */}
      <div id="p22-builder-track">
        <div id="p22-builder-title">Current String Generation</div>
        <div id="p22-slots-container">
          {slots.map((char, idx) => {
            let slotState = "empty";
            if (char === "(") slotState = "open";
            else if (char === ")") slotState = "close";

            return (
              <motion.div
                key={`p22-slot-${idx}`}
                id={`p22-string-slot-${idx}`}
                data-state={slotState}
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
              >
                <span id={`p22-slot-char-${idx}`}>{char || ""}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Accumulated Results Reel */}
      <div id="p22-results-reel-card">
        <div id="p22-reel-header">
          <span id="p22-reel-title">Valid Combinations Found</span>
          <span id="p22-reel-count">{resultsList.length} / 5</span>
        </div>
        <div id="p22-reel-chips-stream">
          {resultsList.length === 0 ? (
            <span id="p22-reel-empty-text">Backtracking in progress...</span>
          ) : (
            resultsList.map((combo, idx) => (
              <motion.span
                key={`p22-combo-${combo}-${idx}`}
                id={`p22-combo-chip-${idx}`}
                layout
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
            id="p22-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div id="p22-callout-header-text">{output.label}</div>
            <div id="p22-callout-val-text">{output.value}</div>
            <div id="p22-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}