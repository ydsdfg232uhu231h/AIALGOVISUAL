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
    <div className="canvas-wrapper permute-canvas">
      {/* Top Metrics Row */}
      <div className="metrics-row">
        <span className="metric-chip start-chip">
          Fixed Prefix Window: <b>start = {start}</b>
        </span>
        {isSwapping ? (
          <span className="metric-chip swap-chip">
            Swapping: <b>nums[{swapA}] &harr; nums[{swapB}]</b>
          </span>
        ) : (
          <span className="metric-chip idle-chip">
            State: <b>{swapA === swapB && swapA !== -1 ? "Self-swap (identity)" : "Traversing"}</b>
          </span>
        )}
        <span className="metric-chip count-chip">
          Permutations Found: <b>{permutationsList.length} / 6</b>
        </span>
      </div>

      {/* Main Array Strip with Swap Arc */}
      <div className="permute-track-container">
        <div className="permute-stream">
          {currentArray.map((val, idx) => {
            const isSwapTarget = idx === swapA || idx === swapB;
            const isFixedPrefix = idx < start;

            return (
              <div key={`idx-${idx}`} className="permute-col">
                {/* Pointer Tag */}
                <div className="ptrs-group">
                  {idx === swapA && <span className="pointer-tag ptr-swapa">A</span>}
                  {idx === swapB && <span className="pointer-tag ptr-swapb">B</span>}
                  {idx === start && !isSwapTarget && <span className="pointer-tag ptr-start">start</span>}
                </div>

                {/* Number Card */}
                <motion.div
                  layout
                  className={`permute-box ${isSwapTarget ? "box-swapping" : ""} ${
                    isFixedPrefix ? "box-fixed" : ""
                  }`}
                  animate={{
                    scale: isSwapTarget ? 1.12 : 1,
                    y: isSwapTarget ? -6 : 0
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 22 }}
                >
                  <span className="num-val">{val}</span>
                  <span className="idx-tag">[{idx}]</span>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Discovered Permutations Reel */}
      <div className="results-reel-card">
        <div className="reel-header">
          <span className="reel-title">Generated Permutations</span>
          <span className="reel-count">Total: {permutationsList.length}</span>
        </div>
        <div className="reel-chips-stream">
          {permutationsList.length === 0 ? (
            <span className="reel-empty-text">Backtracking in progress...</span>
          ) : (
            permutationsList.map((perm, idx) => (
              <motion.span
                key={`${JSON.stringify(perm)}-${idx}`}
                className="combo-chip"
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