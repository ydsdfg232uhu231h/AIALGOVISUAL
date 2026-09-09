import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem42.css";

export default function Problem42({ stepData }) {
  const {
    heights = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
    waterMap = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    left = 0,
    right = 11,
    leftMax = 0,
    rightMax = 0,
    currentWater = 0,
    actionType = "IDLE", // "EVALUATE", "UPDATE_LMAX", "UPDATE_RMAX", "TRAP_L", "TRAP_R", "DONE"
    comparisonText = "",
    isCompleted = false,
    output
  } = stepData || {};

  let actionState = "idle";
  if (actionType.includes("TRAP")) actionState = "trap";
  else if (actionType.includes("UPDATE")) actionState = "update";
  else if (actionType === "DONE") actionState = "done";

  return (
    <div id="p42-trapping-water-canvas">
      {/* Top Metrics Row */}
      <div id="p42-metrics-bar">
        <span id="p42-metric-left-max">
          Left Max (`leftMax`): <b>{leftMax}</b>
        </span>

        <span id="p42-metric-right-max">
          Right Max (`rightMax`): <b>{rightMax}</b>
        </span>

        <span id="p42-metric-total-water">
          Total Water: <b>{currentWater} units</b>
        </span>

        <span id={isCompleted ? "p42-metric-status-done" : "p42-metric-status-active"}>
          Status: <b>{isCompleted ? "SWEEP COMPLETED ✓" : "TWO POINTER SWEEP"}</b>
        </span>
      </div>

      <div id="p42-water-stage">
        {/* Track 1: Elevation Map and Water */}
        <div id="p42-terrain-track-card">
          <div id="p42-terrain-card-header">
            <span id="p42-terrain-header-title">1. Elevation Map (`height`)</span>
            <span id="p42-terrain-header-sub">Water accumulates where height &lt; min(leftMax, rightMax)</span>
          </div>

          <div id="p42-terrain-viewport">
            <div id="p42-terrain-grid-container">
              {heights.map((h, idx) => {
                const isL = idx === left && !isCompleted;
                const isR = idx === right && !isCompleted;
                const waterAmount = waterMap[idx] || 0;

                let colState = "idle";
                if (isL) colState = "left";
                else if (isR) colState = "right";

                return (
                  <div
                    key={`p42-col-${idx}`}
                    id={`p42-terrain-col-${idx}`}
                    data-active={colState}
                  >
                    {/* Index Tag */}
                    <span id={`p42-idx-tag-${idx}`}>[{idx}]</span>

                    {/* Water Block (Stacked on top of terrain) */}
                    <motion.div
                      id={`p42-water-block-${idx}`}
                      initial={{ height: 0 }}
                      animate={{ height: waterAmount > 0 ? waterAmount * 24 : 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                      {waterAmount > 0 && <span id={`p42-water-val-${idx}`}>{waterAmount}w</span>}
                    </motion.div>

                    {/* Solid Terrain Block (Bottom) */}
                    <div id={`p42-terrain-block-${idx}`} style={{ height: `${h * 24}px` }}>
                      {h > 0 && <span id={`p42-terrain-val-${idx}`}>{h}</span>}
                    </div>

                    {/* Pointers */}
                    {isL && <span id="p42-pointer-tag-l">L</span>}
                    {isR && <span id="p42-pointer-tag-r">R</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pointer Logic Inspector */}
        <div id="p42-decision-inspector-card">
          <div id="p42-decision-card-header">
            <span id="p42-decision-header-title">Water Trapping Logic Engine</span>
            <span id="p42-decision-header-sub">Comparing height[l] vs height[r]</span>
          </div>

          <div id="p42-decision-grid">
            <div id="p42-decision-box-rule">
              <span id="p42-decision-title-rule">Condition Check:</span>
              <span id="p42-decision-val-rule">
                {comparisonText || "Evaluating boundary heights..."}
              </span>
            </div>

            <div id="p42-decision-box-action">
              <span id="p42-decision-title-action">Action / State:</span>
              <span id="p42-decision-val-action" data-action={actionState}>
                {actionType === "UPDATE_LMAX" && "UPDATE: New leftMax established"}
                {actionType === "UPDATE_RMAX" && "UPDATE: New rightMax established"}
                {actionType === "TRAP_L" && `TRAP WATER: leftMax - height[l]`}
                {actionType === "TRAP_R" && `TRAP WATER: rightMax - height[r]`}
                {actionType === "EVALUATE" && "EVALUATING: Checking max boundaries"}
                {actionType === "DONE" && "SUCCESS: All heights processed."}
                {actionType === "IDLE" && "READY TO SWEEP"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Result Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p42-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div id="p42-callout-header-text">{output.label}</div>
            <div id="p42-callout-val-text">{output.value}</div>
            <div id="p42-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}