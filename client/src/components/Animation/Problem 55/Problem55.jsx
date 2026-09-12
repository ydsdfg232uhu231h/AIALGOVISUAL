import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem55.css";

export default function Problem55({ stepData }) {
  const {
    array = [2, 3, 1, 1, 4],
    currentIndex = 0,
    maxReach = 0,
    actionType = "IDLE", // "EVALUATE", "UPDATE_MAX", "FAIL", "DONE"
    comparisonText = "",
    isCompleted = false,
    output
  } = stepData || {};

  let statusType = "active";
  if (isCompleted) {
    statusType = output?.value === "True" ? "done" : "fail";
  }

  let actionState = "idle";
  if (actionType === "UPDATE_MAX") actionState = "expand";
  else if (actionType === "FAIL") actionState = "fail";
  else if (actionType === "DONE") actionState = "done";

  return (
    <div id="p55-jump-game-canvas">
      {/* Top Metrics Row */}
      <div id="p55-metrics-bar">
        <span id="p55-metric-pointer">
          Pointer (`i`): <b>{currentIndex !== null && currentIndex < array.length ? `i = ${currentIndex}` : "Done"}</b>
        </span>

        <span id="p55-metric-val">
          Jump Power (`nums[i]`): <b>{currentIndex !== null && array[currentIndex] !== undefined ? array[currentIndex] : "None"}</b>
        </span>

        <span id="p55-metric-max-reach">
          Furthest Reach (`maxReach`): <b>Index {maxReach}</b>
        </span>

        <span id="p55-metric-status" data-status={statusType}>
          Status: <b>{isCompleted ? "SWEEP COMPLETED" : "GREEDY SCAN"}</b>
        </span>
      </div>

      <div id="p55-jump-stage">
        {/* Track 1: Jump Array Track */}
        <div id="p55-array-track-card">
          <div id="p55-array-card-header">
            <span id="p55-array-header-title">1. Jump Array (`nums`)</span>
            <span id="p55-array-header-sub">Tracking the maximum reachable index</span>
          </div>

          <div id="p55-array-elements-track">
            {array.map((val, idx) => {
              const isCurrent = idx === currentIndex && !isCompleted;
              const isReachable = idx <= maxReach;
              const isMaxBoundary = idx === maxReach;

              let boxState = "unreachable";
              if (isCompleted && output?.value === "True") {
                boxState = "done";
              } else if (isCompleted && output?.value === "False") {
                boxState = isReachable ? "reachable" : "fail";
              } else if (isCurrent) {
                boxState = "active";
              } else if (isReachable) {
                boxState = "reachable";
              }

              return (
                <motion.div
                  key={`p55-jump-${idx}`}
                  id={`p55-jump-col-${idx}`}
                  layout
                  animate={{
                    scale: isCurrent ? 1.08 : 1,
                    opacity: isReachable ? 1 : 0.3
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                >
                  {/* Top Pointer for Max Reach Boundary */}
                  <AnimatePresence mode="popLayout">
                    {isMaxBoundary && (
                      <motion.span
                        key={`p55-max-ptr-${idx}`}
                        id={`p55-pointer-tag-max-${idx}`}
                        layout
                        initial={{ y: -6, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -6, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 450, damping: 25 }}
                      >
                        MAX REACH
                      </motion.span>
                    )}
                  </AnimatePresence>

                  <div id={`p55-jump-box-${idx}`} data-state={boxState}>
                    {val}
                  </div>

                  <span id={`p55-idx-tag-${idx}`}>[{idx}]</span>

                  {/* Bottom Pointer for Current Index */}
                  <AnimatePresence mode="popLayout">
                    {isCurrent && (
                      <motion.span
                        key={`p55-curr-ptr-${idx}`}
                        id={`p55-pointer-tag-i-${idx}`}
                        layout
                        initial={{ y: 6, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 6, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 450, damping: 25 }}
                      >
                        i
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Greedy Logic Inspector */}
        <div id="p55-decision-inspector-card">
          <div id="p55-decision-card-header">
            <span id="p55-decision-header-title">Greedy Reach Logic</span>
            <span id="p55-decision-header-sub">maxReach = MAX(maxReach, i + nums[i])</span>
          </div>

          <div id="p55-decision-grid">
            <div id="p55-decision-box-rule">
              <span id="p55-decision-title-rule">Current Reach Evaluation:</span>
              <span id="p55-decision-val-rule">
                {comparisonText || "Evaluating jump range..."}
              </span>
            </div>

            <div id="p55-decision-box-action">
              <span id="p55-decision-title-action">Action / State:</span>
              <span id="p55-decision-val-action" data-action={actionState}>
                {actionType === "UPDATE_MAX" && "EXPAND: Furthest reach updated!"}
                {actionType === "EVALUATE" && "CONTINUE: Within reachable zone."}
                {actionType === "FAIL" && "TRAPPED: i > maxReach. Cannot proceed."}
                {actionType === "DONE" && "SUCCESS: Array traversal completed."}
                {actionType === "IDLE" && "READING NEXT INDEX"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Result Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p55-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div id="p55-callout-header-text">{output.label}</div>
            <div id="p55-callout-val-text">{output.value}</div>
            <div id="p55-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}