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
    <div id="p33-rotated-bs-canvas">
      {/* Search State Metrics */}
      <div id="p33-metrics-row">
        <span id="p33-metric-chip-target">
          Target: <b>{target}</b>
        </span>
        <span id="p33-metric-chip-range">
          Range: low = <b>{low}</b>, high = <b>{high}</b>
        </span>
        <span id="p33-metric-chip-mid">
          mid = <b>{mid}</b> (val: {array[mid]})
        </span>
        {state.sortedHalf && (
          <span id="p33-metric-chip-sorted">
            Sorted Half: <b>{state.sortedHalf}</b>
          </span>
        )}
      </div>

      {/* Array Elements Track */}
      <div id="p33-elements-track">
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
            <div key={`p33-col-${idx}`} id={`p33-box-column-${idx}`}>
              {/* Pointer Badges */}
              <div id={`p33-ptrs-group-${idx}`}>
                <AnimatePresence mode="popLayout">
                  {isLow && (
                    <motion.span
                      key={`p33-ptr-low-${idx}`}
                      id={`p33-pointer-tag-low-${idx}`}
                      layout
                      initial={{ y: -6, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -6, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 450, damping: 25 }}
                    >
                      low
                    </motion.span>
                  )}
                  {isMid && (
                    <motion.span
                      key={`p33-ptr-mid-${idx}`}
                      id={`p33-pointer-tag-mid-${idx}`}
                      layout
                      initial={{ y: -6, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -6, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 450, damping: 25 }}
                    >
                      mid
                    </motion.span>
                  )}
                  {isHigh && (
                    <motion.span
                      key={`p33-ptr-high-${idx}`}
                      id={`p33-pointer-tag-high-${idx}`}
                      layout
                      initial={{ y: -6, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -6, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 450, damping: 25 }}
                    >
                      high
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Element Box with Stable ID & Dynamic Data-State */}
              <motion.div
                id={`p33-box-node-${idx}`}
                data-state={nodeState}
                layout
                animate={{
                  opacity: inRange ? 1 : 0.25,
                  scale: isFound ? 1.15 : isMid ? 1.08 : 1
                }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                <span id={`p33-node-val-${idx}`}>{val}</span>
              </motion.div>

              <span id={`p33-idx-tag-${idx}`}>[{idx}]</span>
            </div>
          );
        })}
      </div>

      {/* Output Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p33-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div id="p33-callout-header-text">{output.label}</div>
            <div id="p33-callout-val-text">{output.value}</div>
            <div id="p33-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}