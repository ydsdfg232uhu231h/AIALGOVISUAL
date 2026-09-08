import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem84.css";

export default function Problem84({ stepData }) {
  const {
    heights = [2, 1, 5, 6, 2, 3],
    currentI = 0,
    stack = [],
    maxArea = 0,
    state = {},
    actionType = "IDLE", // "PUSH", "POP_CALC", "INIT", "DONE"
    activeRectangle = null, // e.g., { leftBound: 2, rightBound: 3, height: 5, area: 10 }
    isCompleted = false,
    output
  } = stepData || {};

  const poppedIdx = state?.popped ?? null;
  const currentCalculatedArea = state?.area ?? null;

  return (
    <div id="histogram-canvas">
      {/* Top Metrics Row */}
      <div id="metrics-bar">
        <span id="metric-pointer-i">
          Sweep Pointer: <b>{currentI < heights.length ? `i = ${currentI}` : `i = ${currentI} (Sentinel)`}</b>
        </span>

        <span id="metric-stack-size">
          Stack Size: <b>{stack.length} bars</b>
        </span>

        <span id="metric-current-area">
          Active Rect: <b>{currentCalculatedArea !== null ? `${currentCalculatedArea} units²` : "---"}</b>
        </span>

        <span id="metric-max-area">
          Max Area: <b>{maxArea} units²</b>
        </span>

        <span id={isCompleted ? "metric-status-done" : "metric-status-active"}>
          Status: <b>{isCompleted ? "MONOTONIC SWEEP COMPLETE ✓" : actionType}</b>
        </span>
      </div>

      <div id="histogram-stage">
        {/* Track 1: Interactive Histogram Area */}
        <div id="bars-track-card">
          <div id="bars-card-header">
            <span id="bars-header-title">1. Monotonic Stack Histogram Terrain</span>
            <span id="bars-header-sub">Bar heights &amp; calculated rectangle boundaries</span>
          </div>

          <div id="bars-viewport">
            <div id="bars-track-container">
              {heights.map((h, idx) => {
                const isCurrent = idx === currentI && !isCompleted;
                const isInStack = stack.includes(idx);
                const isStackTop = stack.length > 0 && stack[stack.length - 1] === idx;
                const isPopped = idx === poppedIdx;
                const isInActiveRect =
                  activeRectangle &&
                  idx >= activeRectangle.leftBound &&
                  idx <= activeRectangle.rightBound;

                let barId = `hist-bar-idle-${idx}`;
                if (isCompleted && isInActiveRect) barId = `hist-bar-winner-${idx}`;
                else if (isPopped) barId = `hist-bar-popped-${idx}`;
                else if (isInActiveRect) barId = `hist-bar-rect-${idx}`;
                else if (isStackTop) barId = `hist-bar-top-${idx}`;
                else if (isInStack) barId = `hist-bar-stacked-${idx}`;

                return (
                  <div key={`col-${idx}`} id={`hist-col-${idx}`}>
                    {/* Index tag */}
                    <span id={`idx-tag-${idx}`}>[{idx}]</span>

                    {/* Bar Pillar */}
                    <motion.div
                      id={barId}
                      style={{ height: `${h * 26}px` }}
                      animate={{ scale: isCurrent || isPopped ? 1.08 : 1 }}
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    >
                      <span id={`bar-val-${idx}`}>{h}</span>
                    </motion.div>

                    {/* Sweep Pointer i */}
                    {isCurrent && <span id="pointer-tag-i">i</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Lower Row: Monotonic Stack Chamber & Area Math */}
        <div id="middle-stage-grid">
          {/* Stack Chamber */}
          <div id="stack-chamber-card">
            <div id="stack-card-header">
              <span id="stack-header-title">2. Monotonic Increasing Stack</span>
              <span id="stack-header-sub">Maintains indices with non-decreasing heights</span>
            </div>

            <div id="stack-chamber-viewport">
              <AnimatePresence mode="popLayout">
                {stack.length === 0 ? (
                  <span id="stack-empty-text">Stack is empty</span>
                ) : (
                  stack.map((barIdx, sIdx) => {
                    const isTop = sIdx === stack.length - 1;
                    const hVal = heights[barIdx];

                    return (
                      <motion.div
                        key={`stack-node-${sIdx}-${barIdx}`}
                        id={isTop ? `stack-pill-top-${sIdx}` : `stack-pill-idle-${sIdx}`}
                        layout
                        initial={{ opacity: 0, scale: 0.6, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: -20 }}
                        transition={{ type: "spring", stiffness: 360, damping: 24 }}
                      >
                        <span id={`stack-pill-idx-${sIdx}`}>idx: <b>{barIdx}</b></span>
                        <span id={`stack-pill-h-${sIdx}`}>h: {hVal}</span>
                        {isTop && <span id="stack-top-badge">TOP</span>}
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Math Area Inspector */}
          <div id="area-inspector-card">
            <div id="area-card-header">
              <span id="area-header-title">3. Area Calculation Engine</span>
              <span id="area-header-sub">height &times; width</span>
            </div>

            <div id="area-grid">
              <div id="area-box-popped">
                <span id="area-title-popped">Popped Bar:</span>
                <span id="area-val-popped">
                  {poppedIdx !== null ? `Index ${poppedIdx} (height = ${heights[poppedIdx]})` : "None"}
                </span>
              </div>

              <div id="area-box-calc">
                <span id="area-title-calc">Formula &amp; Span:</span>
                <span id="area-val-calc">
                  {activeRectangle
                    ? `w = (${activeRectangle.rightBound} - ${activeRectangle.leftBound} + 1) = ${activeRectangle.rightBound - activeRectangle.leftBound + 1} | Area = ${activeRectangle.height} * ${activeRectangle.rightBound - activeRectangle.leftBound + 1} = ${activeRectangle.area}`
                    : "Awaiting next pop..."}
                </span>
              </div>
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