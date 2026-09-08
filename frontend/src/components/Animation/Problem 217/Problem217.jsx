import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem217.css";

export default function Problem217({ stepData }) {
  const {
    array = [1, 2, 3, 1],
    currentIndex = null,
    seenSet = [],
    duplicateVal = null,
    output
  } = stepData || {};

  const currentVal = currentIndex !== null && currentIndex >= 0 ? array[currentIndex] : null;

  return (
    <div id="contains-dup-canvas">
      {/* Top Metrics Row */}
      <div id="metrics-bar">
        <span id="metric-size">
          Array Size: <b>{array.length}</b>
        </span>
        <span id="metric-set-count">
          Hash Set Count: <b>{seenSet.length} elements</b>
        </span>
        {currentVal !== null ? (
          <span id={duplicateVal !== null ? "metric-active-val-dup" : "metric-active-val"}>
            Inspecting: <b>nums[{currentIndex}] = {currentVal}</b>
          </span>
        ) : (
          <span id="metric-active-idle">
            Inspecting: <b>None</b>
          </span>
        )}
      </div>

      <div id="hashset-stage">
        {/* Array Track Container */}
        <div id="array-track-card">
          <div id="array-card-header">
            <span id="array-header-title">1. Input Array (`nums`)</span>
            <span id="array-header-sub">Sequential Left-to-Right Scan</span>
          </div>

          <div id="array-elements-track">
            {array.map((val, idx) => {
              const isActive = currentIndex === idx;
              const isDuplicate = duplicateVal === val && (output || isActive);
              const isProcessed = currentIndex !== null && idx < currentIndex;

              let boxId = `array-box-idle-${idx}`;
              if (isDuplicate) boxId = `array-box-duplicate-${idx}`;
              else if (isActive) boxId = `array-box-active-${idx}`;
              else if (isProcessed) boxId = `array-box-processed-${idx}`;

              return (
                <div key={`elem-${idx}`} id={`array-col-${idx}`}>
                  <motion.div
                    id={boxId}
                    animate={{ scale: isActive || isDuplicate ? 1.08 : 1 }}
                    transition={{ type: "spring", stiffness: 350, damping: 20 }}
                  >
                    <span id={`array-val-${idx}`}>{val}</span>
                    {isDuplicate && <span id="dup-badge">DUP</span>}
                  </motion.div>

                  <span id={`idx-tag-${idx}`}>[{idx}]</span>
                  
                  {isActive && (
                    <motion.span
                      layoutId="activePointer"
                      id="pointer-tag-i"
                      initial={{ y: -6, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    >
                      i
                    </motion.span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Hash Set Chamber */}
        <div id="set-track-card">
          <div id="set-card-header">
            <span id="set-header-title">2. Hash Set (`seen`)</span>
            <span id="set-header-sub">O(1) Unique Element Cache</span>
          </div>

          <div id="set-elements-track">
            <AnimatePresence mode="popLayout">
              {seenSet.length === 0 ? (
                <motion.span
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  id="set-empty-text"
                >
                  seen = &#123; &#125; (Empty)
                </motion.span>
              ) : (
                seenSet.map((val) => {
                  const isConflict = val === currentVal && duplicateVal === val;
                  const pillId = isConflict ? `set-pill-conflict-${val}` : `set-pill-idle-${val}`;

                  return (
                    <motion.div
                      key={`set-val-${val}`}
                      id={pillId}
                      layout
                      initial={{ scale: 0.6, opacity: 0, y: 10 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.6, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 360, damping: 22 }}
                    >
                      <span id={`set-dot-${val}`}>•</span>
                      <span id={`set-val-${val}`}>{val}</span>
                      {isConflict && <span id={`collision-tag-${val}`}>MATCH</span>}
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
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