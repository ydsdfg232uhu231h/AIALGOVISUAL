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
    <div id="twosum-canvas">
      {/* Top Metrics Row */}
      <div id="metrics-bar">
        <span id="metric-target" className="metric-chip">
          Target: <b>{target}</b>
        </span>

        <span id="metric-index" className="metric-chip">
          Index: <b>i = {currentIndex} ({currentVal})</b>
        </span>

        <span id="metric-complement" className="metric-chip">
          Complement: <b>{target} - {currentVal} = {complement}</b>
        </span>

        <span
          id={matchFound ? "metric-status-matched" : "metric-status-pending"}
          className="metric-chip"
        >
          Status: <b>{matchFound ? "MATCH FOUND IN MAP" : "SEARCHING MAP"}</b>
        </span>
      </div>

      <div id="twosum-stage">
        {/* Track 1: Array Nodes */}
        <div id="array-container" className="track-card">
          <div className="card-header-bar">
            <span>1. Array Scan (Pointer i)</span>
            <span className="card-sub">Checking each element for its complement</span>
          </div>

          <div id="array-nodes-row">
            {nums.map((val, idx) => {
              const isCurrent = currentIndex === idx;
              const isMatch = matchFound && matchPair && matchPair.includes(idx);

              const nodeId = isMatch
                ? `node-matched-${idx}`
                : isCurrent
                ? `node-current-${idx}`
                : `node-idle-${idx}`;

              return (
                <div key={`elem-${idx}`} className="cell-carrier">
                  {/* Top Pointer Badge */}
                  <div className="ptr-lane">
                    <AnimatePresence>
                      {isCurrent && (
                        <motion.div
                          id="active-i-pointer"
                          layoutId="ptr-i-tag"
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

                  {/* Array Node Box */}
                  <motion.div
                    id={nodeId}
                    className="array-node-box"
                    animate={{
                      scale: isMatch ? [1, 1.12, 1] : isCurrent ? 1.06 : 1
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 22,
                      scale: isMatch ? { repeat: Infinity, duration: 1 } : undefined
                    }}
                  >
                    <span className="node-val">{val}</span>
                    <span className="node-idx-sub">idx [{idx}]</span>

                    {isMatch && <div id="match-glow-ring" />}
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Track 2: Hash Map (Key-Value Lookups) */}
        <div id="map-container" className="track-card">
          <div className="card-header-bar">
            <span>2. Hash Map Storage (`seen[val] ➔ index`)</span>
            <span className="card-sub">Provides O(1) instantaneous complement lookup</span>
          </div>

          <div id="hashmap-grid">
            {Object.keys(hashMap).length === 0 ? (
              <span id="map-empty-text">Hash Map is currently empty</span>
            ) : (
              Object.entries(hashMap).map(([numKey, storedIdx]) => {
                const isComplementHit = matchFound && Number(numKey) === complement;
                const pillId = isComplementHit ? "map-pill-hit" : `map-pill-${numKey}`;

                return (
                  <motion.div
                    key={`map-${numKey}`}
                    id={pillId}
                    layout
                    className="map-entry-pill"
                  >
                    <span className="map-key">Key ({numKey})</span>
                    <span className="map-arrow">➔</span>
                    <span className="map-idx">Index [{storedIdx}]</span>
                    {isComplementHit && <span id="complement-hit-badge">HIT ✓</span>}
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