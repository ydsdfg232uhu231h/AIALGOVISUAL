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

  let metricActiveState = "idle";
  if (duplicateVal !== null) metricActiveState = "dup";
  else if (currentVal !== null) metricActiveState = "inspecting";

  return (
    <div id="p217-contains-dup-canvas">
      {/* Top Metrics Row */}
      <div id="p217-metrics-bar">
        <span id="p217-metric-size">
          Array Size: <b>{array.length}</b>
        </span>
        <span id="p217-metric-set-count">
          Hash Set Count: <b>{seenSet.length} elements</b>
        </span>
        <span id="p217-metric-active-val" data-metric-state={metricActiveState}>
          {currentVal !== null ? (
            <>
              Inspecting: <b>nums[{currentIndex}] = {currentVal}</b>
            </>
          ) : (
            <>
              Inspecting: <b>None</b>
            </>
          )}
        </span>
      </div>

      <div id="p217-hashset-stage">
        {/* Array Track Container */}
        <div id="p217-array-track-card">
          <div id="p217-array-card-header">
            <span id="p217-array-header-title">1. Input Array (`nums`)</span>
            <span id="p217-array-header-sub">Sequential Left-to-Right Scan</span>
          </div>

          <div id="p217-array-elements-track">
            {array.map((val, idx) => {
              const isActive = currentIndex === idx;
              const isDuplicate = duplicateVal === val && (output || isActive);
              const isProcessed = currentIndex !== null && idx < currentIndex;

              let boxState = "idle";
              if (isDuplicate) boxState = "duplicate";
              else if (isActive) boxState = "active";
              else if (isProcessed) boxState = "processed";

              return (
                <div key={`p217-elem-${idx}`} id={`p217-array-col-${idx}`}>
                  <motion.div
                    id={`p217-array-box-${idx}`}
                    data-box-state={boxState}
                    layout
                    animate={{ scale: isActive || isDuplicate ? 1.08 : 1 }}
                    transition={{ type: "spring", stiffness: 350, damping: 20 }}
                  >
                    <span id={`p217-array-val-${idx}`}>{val}</span>
                    {isDuplicate && <span id={`p217-dup-badge-${idx}`}>DUP</span>}
                  </motion.div>

                  <span id={`p217-idx-tag-${idx}`}>[{idx}]</span>

                  <AnimatePresence mode="popLayout">
                    {isActive && (
                      <motion.span
                        key="p217-active-ptr"
                        layoutId="p217-active-pointer"
                        id={`p217-pointer-tag-i-${idx}`}
                        initial={{ y: -6, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -6, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
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

        {/* Dynamic Hash Set Chamber */}
        <div id="p217-set-track-card">
          <div id="p217-set-card-header">
            <span id="p217-set-header-title">2. Hash Set (`seen`)</span>
            <span id="p217-set-header-sub">O(1) Unique Element Cache</span>
          </div>

          <div id="p217-set-elements-track">
            <AnimatePresence mode="popLayout">
              {seenSet.length === 0 ? (
                <motion.span
                  key="p217-set-empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  id="p217-set-empty-text"
                >
                  seen = &#123; &#125; (Empty)
                </motion.span>
              ) : (
                seenSet.map((val) => {
                  const isConflict = val === currentVal && duplicateVal === val;

                  return (
                    <motion.div
                      key={`p217-set-val-${val}`}
                      id={`p217-set-pill-${val}`}
                      data-pill-state={isConflict ? "conflict" : "idle"}
                      layout
                      initial={{ scale: 0.6, opacity: 0, y: 10 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.6, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 360, damping: 22 }}
                    >
                      <span id={`p217-set-dot-${val}`}>•</span>
                      <span id={`p217-set-val-txt-${val}`}>{val}</span>
                      {isConflict && (
                        <span id={`p217-collision-tag-${val}`}>MATCH</span>
                      )}
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
            id="p217-result-callout-box"
            data-callout-state={output.value === "true" || output.value === "True" ? "dup" : "unique"}
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div id="p217-callout-header-text">{output.label}</div>
            <div id="p217-callout-val-text">{output.value}</div>
            <div id="p217-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}