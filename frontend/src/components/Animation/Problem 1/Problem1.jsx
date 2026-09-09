import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem1.css";

export default function Problem1({ stepData }) {
  const {
    nums = [2, 7, 11, 15],
    target = 9,
    currentIndex = 0,
    complement = 7,
    hashMap = {}, // e.g. { "2": 0 }
    matchPair = null, // e.g. [0, 1]
    matchFound = false,
    output
  } = stepData || {};

  const currentVal = nums[currentIndex];

  return (
    <div id="p1-twosum-canvas">
      {/* Top Metrics Row */}
      <div id="p1-metrics-bar">
        <span id="p1-metric-target">
          Target: <b>{target}</b>
        </span>

        <span id="p1-metric-index">
          Index: <b>i = {currentIndex} ({currentVal})</b>
        </span>

        <span id="p1-metric-complement">
          Complement: <b>{target} - {currentVal} = {complement}</b>
        </span>

        <span
          id={matchFound ? "p1-metric-status-matched" : "p1-metric-status-pending"}
        >
          Status: <b>{matchFound ? "MATCH FOUND IN MAP" : "SEARCHING MAP"}</b>
        </span>
      </div>

      <div id="p1-twosum-stage">
        {/* Track 1: Array Nodes */}
        <div id="p1-array-container">
          <div id="p1-array-card-header">
            <span id="p1-array-card-title">1. Array Scan (Pointer i)</span>
            <span id="p1-array-card-sub">Checking each element for its complement</span>
          </div>

          <div id="p1-array-nodes-row">
            {nums.map((val, idx) => {
              const isCurrent = currentIndex === idx;
              const isMatch = matchFound && matchPair && matchPair.includes(idx);

              let nodeState = "idle";
              if (isMatch) nodeState = "matched";
              else if (isCurrent) nodeState = "current";

              return (
                <div key={`p1-elem-${idx}`} id={`p1-cell-carrier-${idx}`}>
                  {/* Top Pointer Badge */}
                  <div id={`p1-ptr-lane-${idx}`}>
                    <AnimatePresence mode="popLayout">
                      {isCurrent && (
                        <motion.div
                          id={`p1-active-i-pointer-${idx}`}
                          layout
                          initial={{ y: -8, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -8, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 450, damping: 28 }}
                        >
                          <span>i ➔ [{idx}]</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Array Node Box with Stable Scoped ID & Dynamic data-state */}
                  <motion.div
                    id={`p1-node-box-${idx}`}
                    data-state={nodeState}
                    layout
                    animate={{
                      scale: isMatch ? [1, 1.1, 1] : isCurrent ? 1.05 : 1
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 22,
                      scale: isMatch ? { repeat: Infinity, duration: 1.2 } : undefined
                    }}
                  >
                    <span id={`p1-node-val-${idx}`}>{val}</span>
                    <span id={`p1-node-idx-sub-${idx}`}>idx [{idx}]</span>

                    {isMatch && <div id={`p1-match-glow-ring-${idx}`} />}
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Track 2: Hash Map (Key-Value Lookups) */}
        <div id="p1-map-container">
          <div id="p1-map-card-header">
            <span id="p1-map-card-title">2. Hash Map Storage (seen[val] ➔ index)</span>
            <span id="p1-map-card-sub">Provides O(1) instantaneous complement lookup</span>
          </div>

          <div id="p1-hashmap-grid">
            {Object.keys(hashMap).length === 0 ? (
              <span id="p1-map-empty-text">Hash Map is currently empty</span>
            ) : (
              Object.entries(hashMap).map(([numKey, storedIdx]) => {
                const isComplementHit = matchFound && Number(numKey) === complement;
                const hitState = isComplementHit ? "hit" : "idle";

                return (
                  <motion.div
                    key={`p1-map-${numKey}`}
                    id={`p1-map-entry-pill-${numKey}`}
                    data-hit={hitState}
                    layout
                  >
                    <span id={`p1-map-key-${numKey}`}>Key ({numKey})</span>
                    <span id={`p1-map-arrow-${numKey}`}>➔</span>
                    <span id={`p1-map-idx-${numKey}`}>Index [{storedIdx}]</span>
                    {isComplementHit && <span id={`p1-complement-hit-badge-${numKey}`}>HIT ✓</span>}
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Result Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p1-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
          >
            <div id="p1-callout-header-text">{output.label}</div>
            <div id="p1-callout-val-text">{output.value}</div>
            <div id="p1-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}