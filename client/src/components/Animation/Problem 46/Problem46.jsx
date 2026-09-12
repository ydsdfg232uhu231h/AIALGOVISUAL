import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem46.css";

export default function Problem46({ stepData }) {
  const {
    currentArray = [1, 2, 3],
    swapA = -1,
    swapB = -1,
    state = {},
    output
  } = stepData || {};

  const { start = 0, res = "[]", status } = state;
  const isComplete = status === "COMPLETED";

  // Safely parse accumulated results
  let permutationsList = [];
  try {
    permutationsList = typeof res === "string" ? JSON.parse(res.replace(/'/g, '"')) : res;
  } catch {
    permutationsList = [];
  }

  const isSwapping = swapA !== -1 && swapB !== -1 && swapA !== swapB;

  return (
    <div id="p46-permute-canvas">
      {/* Top Metrics Row */}
      <div id="p46-metrics-row">
        <span id="p46-metric-chip-start">
          Fixed Prefix Window: <b>start = {start}</b>
        </span>
        {isSwapping ? (
          <span id="p46-metric-chip-state" data-type="swap">
            Swapping: <b>nums[{swapA}] &harr; nums[{swapB}]</b>
          </span>
        ) : (
          <span id="p46-metric-chip-state">
            State: <b>{swapA === swapB && swapA !== -1 ? "Self-swap (identity)" : "Traversing"}</b>
          </span>
        )}
        <span id="p46-metric-chip-count">
          Permutations Found: <b>{permutationsList.length} / 6</b>
        </span>
      </div>

      {/* Main Array Strip with Swap Arc */}
      <div id="p46-permute-track-container">
        <div id="p46-permute-stream">
          {currentArray.map((val, idx) => {
            const isSwapTarget = idx === swapA || idx === swapB;
            const isFixedPrefix = idx < start;

            let nodeState = "idle";
            if (isSwapTarget) nodeState = "swapping";
            else if (isFixedPrefix) nodeState = "fixed";

            return (
              <div key={`p46-col-${idx}`} id={`p46-permute-col-${idx}`}>
                {/* Pointer Tag */}
                <div id={`p46-ptrs-group-${idx}`}>
                  <AnimatePresence mode="popLayout">
                    {idx === swapA && (
                      <motion.span
                        key={`p46-ptr-swapa-${idx}`}
                        id={`p46-pointer-tag-swapa-${idx}`}
                        layout
                        initial={{ y: -6, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -6, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 450, damping: 25 }}
                      >
                        A
                      </motion.span>
                    )}
                    {idx === swapB && (
                      <motion.span
                        key={`p46-ptr-swapb-${idx}`}
                        id={`p46-pointer-tag-swapb-${idx}`}
                        layout
                        initial={{ y: -6, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -6, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 450, damping: 25 }}
                      >
                        B
                      </motion.span>
                    )}
                    {idx === start && !isSwapTarget && (
                      <motion.span
                        key={`p46-ptr-start-${idx}`}
                        id={`p46-pointer-tag-start-${idx}`}
                        layout
                        initial={{ y: -6, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -6, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 450, damping: 25 }}
                      >
                        start
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                {/* Number Card */}
                <motion.div
                  id={`p46-permute-box-${idx}`}
                  data-state={nodeState}
                  layout
                  animate={{
                    scale: isSwapTarget ? 1.12 : 1,
                    y: isSwapTarget ? -6 : 0
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 22 }}
                >
                  <span id={`p46-num-val-${idx}`}>{val}</span>
                  <span id={`p46-idx-tag-${idx}`}>[{idx}]</span>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Discovered Permutations Reel */}
      <div id="p46-results-reel-card">
        <div id="p46-reel-header">
          <span id="p46-reel-title">Generated Permutations</span>
          <span id="p46-reel-count">Total: {permutationsList.length}</span>
        </div>
        <div id="p46-reel-chips-stream">
          {permutationsList.length === 0 ? (
            <span id="p46-reel-empty-text">Backtracking in progress...</span>
          ) : (
            permutationsList.map((perm, idx) => (
              <motion.span
                key={`p46-perm-${JSON.stringify(perm)}-${idx}`}
                id={`p46-combo-chip-${idx}`}
                layout
                initial={{ opacity: 0, scale: 0.8, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                [{perm.join(", ")}]
              </motion.span>
            ))
          )}
        </div>
      </div>

      {/* Output Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p46-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div id="p46-callout-header-text">{output.label}</div>
            <div id="p46-callout-val-text">{output.value}</div>
            <div id="p46-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}