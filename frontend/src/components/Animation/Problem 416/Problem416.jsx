import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem416.css";

export default function Problem416({ stepData }) {
  const {
    nums = [],
    dpSet = [0],
    target = 11,
    currentIdx = null,
    addedSums = [],
    state = {},
    output
  } = stepData || {};

  const { totalSum = 22, canPartition, status } = state;
  const isComplete = status === "COMPLETED";
  const hasHitTarget = dpSet.includes(target);

  return (
    <div className="canvas-wrapper subset-sum-canvas">
      {/* Metrics Header */}
      <div className="metrics-row">
        <span className="metric-chip sum-chip">
          Total Sum: <b>{totalSum}</b> {totalSum % 2 === 0 ? "(Even ✓)" : "(Odd ✗)"}
        </span>
        <span className="metric-chip target-chip">
          Target Subset Sum: <b>{target}</b>
        </span>
        {currentIdx !== null && (
          <span className="metric-chip current-chip">
            Active Num: <b>nums[{currentIdx}] = {nums[currentIdx]}</b>
          </span>
        )}
        {hasHitTarget && (
          <span className="metric-chip hit-chip">
            Target Reached! <b>{target} ∈ dp</b>
          </span>
        )}
      </div>

      {/* Numbers Array Track */}
      <div className="nums-track-container">
        <div className="track-title">Numbers:</div>
        <div className="nums-stream">
          {nums.map((val, idx) => {
            const isCurrent = idx === currentIdx;

            return (
              <div key={`num-${idx}`} className="num-col">
                <div className="ptrs-group">
                  {isCurrent && <span className="pointer-tag ptr-curr">curr</span>}
                </div>

                <motion.div
                  className={`num-box ${isCurrent ? "num-active" : ""}`}
                  animate={{ scale: isCurrent ? 1.08 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="num-val">{val}</span>
                  <span className="idx-tag">[{idx}]</span>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reachable Subset Sums Pool (DP Set) */}
      <div className="dp-set-container">
        <div className="set-header">
          <span className="set-title">Reachable Subset Sums (dp set):</span>
          <span className="set-count">{dpSet.length} sums formed</span>
        </div>

        <div className="set-chips-stream">
          {dpSet.map((sumVal) => {
            const isTarget = sumVal === target;
            const isJustAdded = addedSums.includes(sumVal);

            return (
              <motion.div
                key={`sum-${sumVal}`}
                className={`sum-badge ${isTarget ? "badge-target" : ""} ${
                  isJustAdded ? "badge-new" : ""
                }`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: isTarget ? 1.15 : 1, opacity: 1 }}
                transition={{ duration: 0.25 }}
              >
                <span className="badge-val">{sumVal}</span>
                {isTarget && <span className="target-star">★ GOAL</span>}
              </motion.div>
            );
          })}
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