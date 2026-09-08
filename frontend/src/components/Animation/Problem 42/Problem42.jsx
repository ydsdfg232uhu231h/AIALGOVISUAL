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

  return (
    <div id="trapping-water-canvas">
      {/* Top Metrics Row */}
      <div id="metrics-bar">
        <span id="metric-left-max">
          Left Max (`leftMax`): <b>{leftMax}</b>
        </span>

        <span id="metric-right-max">
          Right Max (`rightMax`): <b>{rightMax}</b>
        </span>

        <span id="metric-total-water">
          Total Water: <b>{currentWater} units</b>
        </span>

        <span id={isCompleted ? "metric-status-done" : "metric-status-active"}>
          Status: <b>{isCompleted ? "SWEEP COMPLETED ✓" : "TWO POINTER SWEEP"}</b>
        </span>
      </div>

      <div id="water-stage">
        {/* Track 1: Elevation Map and Water */}
        <div id="terrain-track-card">
          <div id="terrain-card-header">
            <span id="terrain-header-title">1. Elevation Map (`height`)</span>
            <span id="terrain-header-sub">Water accumulates where height &lt; min(leftMax, rightMax)</span>
          </div>

          <div id="terrain-viewport">
            <div id="terrain-grid-container">
              {heights.map((h, idx) => {
                const isL = idx === left && !isCompleted;
                const isR = idx === right && !isCompleted;
                const waterAmount = waterMap[idx] || 0;

                let colId = `terrain-col-idle-${idx}`;
                if (isL) colId = `terrain-col-left-${idx}`;
                else if (isR) colId = `terrain-col-right-${idx}`;

                return (
                  <div key={`col-${idx}`} id={colId}>
                    {/* Index Tag */}
                    <span id={`idx-tag-${idx}`}>[{idx}]</span>

                    {/* Water Block (Stacked on top of terrain) */}
                    <motion.div
                      id={`water-block-${idx}`}
                      initial={{ height: 0 }}
                      animate={{ height: waterAmount > 0 ? waterAmount * 24 : 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                      {waterAmount > 0 && <span id={`water-val-${idx}`}>{waterAmount}w</span>}
                    </motion.div>

                    {/* Solid Terrain Block (Bottom) */}
                    <div id={`terrain-block-${idx}`} style={{ height: `${h * 24}px` }}>
                      {h > 0 && <span id={`terrain-val-${idx}`}>{h}</span>}
                    </div>

                    {/* Pointers */}
                    {isL && <span id="pointer-tag-l">L</span>}
                    {isR && <span id="pointer-tag-r">R</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pointer Logic Inspector */}
        <div id="decision-inspector-card">
          <div id="decision-card-header">
            <span id="decision-header-title">Water Trapping Logic Engine</span>
            <span id="decision-header-sub">Comparing height[l] vs height[r]</span>
          </div>

          <div id="decision-grid">
            <div id="decision-box-rule">
              <span id="decision-title-rule">Condition Check:</span>
              <span id="decision-val-rule">
                {comparisonText || "Evaluating boundary heights..."}
              </span>
            </div>

            <div id="decision-box-action">
              <span id="decision-title-action">Action / State:</span>
              <span
                id={
                  actionType.includes("TRAP")
                    ? "decision-val-trap"
                    : actionType.includes("UPDATE")
                    ? "decision-val-update"
                    : actionType === "DONE"
                    ? "decision-val-done"
                    : "decision-val-idle"
                }
              >
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