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

  return (
    <div id="jump-game-canvas">
      {/* Top Metrics Row */}
      <div id="metrics-bar">
        <span id="metric-pointer">
          Pointer (`i`): <b>{currentIndex !== null && currentIndex < array.length ? `i = ${currentIndex}` : "Done"}</b>
        </span>

        <span id="metric-val">
          Jump Power (`nums[i]`): <b>{currentIndex !== null && array[currentIndex] !== undefined ? array[currentIndex] : "None"}</b>
        </span>

        <span id="metric-max-reach">
          Furthest Reach (`maxReach`): <b>Index {maxReach}</b>
        </span>

        <span id={isCompleted ? (output?.value === "True" ? "metric-status-done" : "metric-status-fail") : "metric-status-active"}>
          Status: <b>{isCompleted ? "SWEEP COMPLETED" : "GREEDY SCAN"}</b>
        </span>
      </div>

      <div id="jump-stage">
        {/* Track 1: Jump Array Track */}
        <div id="array-track-card">
          <div id="array-card-header">
            <span id="array-header-title">1. Jump Array (`nums`)</span>
            <span id="array-header-sub">Tracking the maximum reachable index</span>
          </div>

          <div id="array-elements-track">
            {array.map((val, idx) => {
              const isCurrent = idx === currentIndex && !isCompleted;
              const isReachable = idx <= maxReach;
              const isMaxBoundary = idx === maxReach;
              
              let boxId = `box-unreachable-${idx}`;
              if (isCompleted && output?.value === "True") {
                boxId = `box-done-${idx}`;
              } else if (isCompleted && output?.value === "False") {
                boxId = isReachable ? `box-reachable-${idx}` : `box-fail-${idx}`;
              } else if (isCurrent) {
                boxId = `box-active-${idx}`;
              } else if (isReachable) {
                boxId = `box-reachable-${idx}`;
              }

              return (
                <motion.div
                  key={`jump-${idx}`}
                  id={`jump-col-${idx}`}
                  animate={{
                    scale: isCurrent ? 1.08 : 1,
                    opacity: isReachable ? 1 : 0.3
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                >
                  {/* Top Pointer for Max Reach Boundary */}
                  {isMaxBoundary && (
                    <span id="pointer-tag-max">MAX REACH</span>
                  )}

                  <div id={boxId}>
                    {val}
                  </div>
                  
                  <span id={`idx-tag-${idx}`}>[{idx}]</span>
                  
                  {/* Bottom Pointer for Current Index */}
                  {isCurrent && <span id="pointer-tag-i">i</span>}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Greedy Logic Inspector */}
        <div id="decision-inspector-card">
          <div id="decision-card-header">
            <span id="decision-header-title">Greedy Reach Logic</span>
            <span id="decision-header-sub">maxReach = MAX(maxReach, i + nums[i])</span>
          </div>

          <div id="decision-grid">
            <div id="decision-box-rule">
              <span id="decision-title-rule">Current Reach Evaluation:</span>
              <span id="decision-val-rule">
                {comparisonText || "Evaluating jump range..."}
              </span>
            </div>

            <div id="decision-box-action">
              <span id="decision-title-action">Action / State:</span>
              <span
                id={
                  actionType === "UPDATE_MAX"
                    ? "decision-val-expand"
                    : actionType === "FAIL"
                    ? "decision-val-fail"
                    : actionType === "DONE"
                    ? "decision-val-done"
                    : "decision-val-idle"
                }
              >
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
            id="result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div id="callout-header-text">{output.label}</div>
            <div id="callout-val-text">{output.value}</div>
            <div id="callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}