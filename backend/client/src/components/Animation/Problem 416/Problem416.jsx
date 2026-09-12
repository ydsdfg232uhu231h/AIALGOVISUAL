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
    <div id="p416-subset-sum-canvas">
      {/* Metrics Header */}
      <div id="p416-metrics-row">
        <span
          id="p416-metric-sum"
          data-is-even={totalSum % 2 === 0 ? "true" : "false"}
        >
          Total Sum: <b>{totalSum}</b> {totalSum % 2 === 0 ? "(Even ✓)" : "(Odd ✗)"}
        </span>
        <span id="p416-metric-target">
          Target Subset Sum: <b>{target}</b>
        </span>
        {currentIdx !== null && (
          <span id="p416-metric-current">
            Active Num: <b>nums[{currentIdx}] = {nums[currentIdx]}</b>
          </span>
        )}
        {hasHitTarget && (
          <span id="p416-metric-hit">
            Target Reached! <b>{target} ∈ dp</b>
          </span>
        )}
      </div>

      {/* Numbers Array Track */}
      <div id="p416-nums-track-container">
        <div id="p416-track-title">Numbers:</div>
        <div id="p416-nums-stream">
          {nums.map((val, idx) => {
            const isCurrent = idx === currentIdx;

            return (
              <div key={`p416-num-${idx}`} id={`p416-num-col-${idx}`}>
                <div id={`p416-ptrs-group-${idx}`}>
                  <AnimatePresence mode="popLayout">
                    {isCurrent && (
                      <motion.span
                        key="p416-ptr-curr"
                        layoutId="p416-pointer-tag-curr"
                        id={`p416-pointer-tag-curr-${idx}`}
                        initial={{ y: -6, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -6, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 450, damping: 26 }}
                      >
                        curr
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                <motion.div
                  id={`p416-num-box-${idx}`}
                  data-is-active={isCurrent ? "true" : "false"}
                  layout
                  animate={{ scale: isCurrent ? 1.08 : 1 }}
                  transition={{ type: "spring", stiffness: 350, damping: 20 }}
                >
                  <span id={`p416-num-val-${idx}`}>{val}</span>
                  <span id={`p416-idx-tag-${idx}`}>[{idx}]</span>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reachable Subset Sums Pool (DP Set) */}
      <div id="p416-dp-set-container">
        <div id="p416-set-header">
          <span id="p416-set-title">Reachable Subset Sums (dp set):</span>
          <span id="p416-set-count">{dpSet.length} sums formed</span>
        </div>

        <div id="p416-set-chips-stream">
          {dpSet.map((sumVal) => {
            const isTarget = sumVal === target;
            const isJustAdded = addedSums.includes(sumVal);

            let badgeState = "idle";
            if (isTarget) badgeState = "target";
            else if (isJustAdded) badgeState = "new";

            return (
              <motion.div
                key={`p416-sum-${sumVal}`}
                id={`p416-sum-badge-${sumVal}`}
                data-badge-state={badgeState}
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: isTarget ? 1.15 : 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
              >
                <span id={`p416-badge-val-${sumVal}`}>{sumVal}</span>
                {isTarget && <span id="p416-target-star">★ GOAL</span>}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Output Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p416-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div id="p416-callout-header-text">{output.label}</div>
            <div id="p416-callout-val-text">{output.value}</div>
            <div id="p416-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}