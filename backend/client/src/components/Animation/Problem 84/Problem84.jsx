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
    <div id="p84-histogram-canvas">
      {/* Top Metrics Row */}
      <div id="p84-metrics-bar">
        <span id="p84-metric-pointer-i">
          Sweep Pointer: <b>{currentI < heights.length ? `i = ${currentI}` : `i = ${currentI} (Sentinel)`}</b>
        </span>

        <span id="p84-metric-stack-size">
          Stack Size: <b>{stack.length} bars</b>
        </span>

        <span id="p84-metric-current-area">
          Active Rect: <b>{currentCalculatedArea !== null ? `${currentCalculatedArea} units²` : "---"}</b>
        </span>

        <span id="p84-metric-max-area">
          Max Area: <b>{maxArea} units²</b>
        </span>

        <span id={isCompleted ? "p84-metric-status-done" : "p84-metric-status-active"}>
          Status: <b>{isCompleted ? "MONOTONIC SWEEP COMPLETE ✓" : actionType}</b>
        </span>
      </div>

      <div id="p84-histogram-stage">
        {/* Track 1: Interactive Histogram Area */}
        <div id="p84-bars-track-card">
          <div id="p84-bars-card-header">
            <span id="p84-bars-header-title">1. Monotonic Stack Histogram Terrain</span>
            <span id="p84-bars-header-sub">Bar heights &amp; calculated rectangle boundaries</span>
          </div>

          <div id="p84-bars-viewport">
            <div id="p84-bars-track-container">
              {heights.map((h, idx) => {
                const isCurrent = idx === currentI && !isCompleted;
                const isInStack = stack.includes(idx);
                const isStackTop = stack.length > 0 && stack[stack.length - 1] === idx;
                const isPopped = idx === poppedIdx;
                const isInActiveRect =
                  activeRectangle &&
                  idx >= activeRectangle.leftBound &&
                  idx <= activeRectangle.rightBound;

                let barState = "idle";
                if (isCompleted && isInActiveRect) barState = "winner";
                else if (isPopped) barState = "popped";
                else if (isInActiveRect) barState = "rect";
                else if (isStackTop) barState = "top";
                else if (isInStack) barState = "stacked";

                return (
                  <div key={`p84-col-${idx}`} id={`p84-hist-col-${idx}`}>
                    {/* Index tag */}
                    <span id={`p84-idx-tag-${idx}`}>[{idx}]</span>

                    {/* Bar Pillar */}
                    <motion.div
                      id={`p84-hist-bar-${idx}`}
                      data-bar-state={barState}
                      layout
                      style={{ height: `${h * 26}px` }}
                      animate={{ scale: isCurrent || isPopped ? 1.08 : 1 }}
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    >
                      <span id={`p84-bar-val-${idx}`}>{h}</span>
                    </motion.div>

                    {/* Sweep Pointer i */}
                    <AnimatePresence mode="popLayout">
                      {isCurrent && (
                        <motion.span
                          key={`p84-ptr-${idx}`}
                          id="p84-pointer-tag-i"
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
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Lower Row: Monotonic Stack Chamber & Area Math */}
        <div id="p84-middle-stage-grid">
          {/* Stack Chamber */}
          <div id="p84-stack-chamber-card">
            <div id="p84-stack-card-header">
              <span id="p84-stack-header-title">2. Monotonic Increasing Stack</span>
              <span id="p84-stack-header-sub">Maintains indices with non-decreasing heights</span>
            </div>

            <div id="p84-stack-chamber-viewport">
              <AnimatePresence mode="popLayout">
                {stack.length === 0 ? (
                  <span id="p84-stack-empty-text">Stack is empty</span>
                ) : (
                  stack.map((barIdx, sIdx) => {
                    const isTop = sIdx === stack.length - 1;
                    const hVal = heights[barIdx];

                    return (
                      <motion.div
                        key={`p84-stack-node-${sIdx}-${barIdx}`}
                        id={`p84-stack-pill-${sIdx}`}
                        data-top={isTop ? "true" : "false"}
                        layout
                        initial={{ opacity: 0, scale: 0.6, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: -20 }}
                        transition={{ type: "spring", stiffness: 360, damping: 24 }}
                      >
                        <span id={`p84-stack-pill-idx-${sIdx}`}>idx: <b>{barIdx}</b></span>
                        <span id={`p84-stack-pill-h-${sIdx}`}>h: {hVal}</span>
                        {isTop && <span id="p84-stack-top-badge">TOP</span>}
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Math Area Inspector */}
          <div id="p84-area-inspector-card">
            <div id="p84-area-card-header">
              <span id="p84-area-header-title">3. Area Calculation Engine</span>
              <span id="p84-area-header-sub">height &times; width</span>
            </div>

            <div id="p84-area-grid">
              <div id="p84-area-box-popped">
                <span id="p84-area-title-popped">Popped Bar:</span>
                <span id="p84-area-val-popped">
                  {poppedIdx !== null ? `Index ${poppedIdx} (height = ${heights[poppedIdx]})` : "None"}
                </span>
              </div>

              <div id="p84-area-box-calc">
                <span id="p84-area-title-calc">Formula &amp; Span:</span>
                <span id="p84-area-val-calc">
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
            id="p84-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div id="p84-callout-header-text">{output.label}</div>
            <div id="p84-callout-val-text">{output.value}</div>
            <div id="p84-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}