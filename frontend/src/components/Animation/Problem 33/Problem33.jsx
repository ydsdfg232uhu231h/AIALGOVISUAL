import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem33.css";

export default function Problem33({ stepData }) {
  const {
    array = [],
    low = 0,
    high = 0,
    mid = 0,
    state = {},
    output
  } = stepData || {};

  const target = state.target ?? 0;
  const isComplete = state.status === "COMPLETED";
  const foundIdx = isComplete ? (state.return ?? mid) : null;

  return (
    <div id="rotated-bs-canvas">
      {/* Search State Metrics */}
      <div id="metrics-row">
        <span id="metric-chip-target">
          Target: <b>{target}</b>
        </span>
        <span id="metric-chip-range">
          Range: low = <b>{low}</b>, high = <b>{high}</b>
        </span>
        <span id="metric-chip-mid">
          mid = <b>{mid}</b> (val: {array[mid]})
        </span>
        {state.sortedHalf && (
          <span id="metric-chip-sorted">
            Sorted Half: <b>{state.sortedHalf}</b>
          </span>
        )}
      </div>

      {/* Array Elements Track */}
      <div id="elements-track">
        {array.map((val, idx) => {
          const inRange = idx >= low && idx <= high;
          const isMid = idx === mid;
          const isFound = idx === foundIdx;
          const isLow = idx === low;
          const isHigh = idx === high;

          let nodeState = "idle";
          if (isFound) nodeState = "match";
          else if (isMid) nodeState = "mid";

          return (
            <div key={`col-${idx}`} id={`box-column-${idx}`}>
              {/* Pointer Badges */}
              <div id={`ptrs-group-${idx}`}>
                {isLow && <span id={`pointer-tag-low-${idx}`}>low</span>}
                {isMid && <span id={`pointer-tag-mid-${idx}`}>mid</span>}
                {isHigh && <span id={`pointer-tag-high-${idx}`}>high</span>}
              </div>

              {/* Element Box */}
              <motion.div
                id={`box-node-${nodeState}-${idx}`}
                animate={{
                  opacity: inRange ? 1 : 0.25,
                  scale: isFound ? 1.15 : isMid ? 1.08 : 1,
                  borderColor: isFound ? "#22c55e" : isMid ? "#38bdf8" : "#27272a"
                }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                {val}
              </motion.div>

              <span id={`idx-tag-${idx}`}>[{idx}]</span>
            </div>
          );
        })}
      </div>

      {/* Output Callout */}
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