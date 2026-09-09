import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem34.css";

export default function Problem34({ stepData }) {
  const {
    array = [],
    low = 0,
    high = 0,
    mid = 0,
    state = {},
    output
  } = stepData || {};

  const target = state.target ?? 8;
  const phase = state.phase ?? (state.last !== undefined ? "findLast" : "findFirst");
  const firstIdx = state.first !== undefined && state.first !== -1 ? state.first : null;
  const lastIdx = state.last !== undefined && state.last !== -1 ? state.last : null;
  const isComplete = state.status === "COMPLETED";

  return (
    <div id="p34-double-bs-canvas">
      {/* Metric Badges */}
      <div id="p34-metrics-row">
        <span id="p34-metric-chip-target">
          Target: <b>{target}</b>
        </span>
        <span id="p34-phase-chip" data-phase={phase}>
          Phase: <b>{phase === "findFirst" ? "1. Find First (Left Bound)" : "2. Find Last (Right Bound)"}</b>
        </span>
        <span id="p34-metric-chip-range">
          low = <b>{low}</b>, high = <b>{high}</b>
        </span>
        <span id="p34-metric-chip-mid">
          mid = <b>{mid}</b> (val: {array[mid]})
        </span>
        <span id="p34-metric-chip-bound">
          Bounds: <b>[{firstIdx ?? "-"}, {lastIdx ?? "-"}]</b>
        </span>
      </div>

      {/* Elements Ribbon */}
      <div id="p34-elements-track">
        {array.map((val, idx) => {
          const inRange = idx >= low && idx <= high;
          const isMid = idx === mid;
          const isLow = idx === low;
          const isHigh = idx === high;
          const isFirstMatch = idx === firstIdx;
          const isLastMatch = idx === lastIdx;
          const inConfirmedRange =
            firstIdx !== null &&
            lastIdx !== null &&
            idx >= firstIdx &&
            idx <= lastIdx;

          let nodeState = "idle";
          if (inConfirmedRange) nodeState = "confirmed-range";
          else if (isMid) nodeState = "mid";
          else if (isFirstMatch || isLastMatch) nodeState = "partial-match";

          return (
            <div key={`p34-col-${idx}`} id={`p34-box-column-${idx}`}>
              {/* Pointer Badges */}
              <div id={`p34-ptrs-group-${idx}`}>
                <AnimatePresence mode="popLayout">
                  {isLow && (
                    <motion.span
                      key={`p34-ptr-low-${idx}`}
                      id={`p34-pointer-tag-low-${idx}`}
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
                      key={`p34-ptr-mid-${idx}`}
                      id={`p34-pointer-tag-mid-${idx}`}
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
                      key={`p34-ptr-high-${idx}`}
                      id={`p34-pointer-tag-high-${idx}`}
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
                id={`p34-box-node-${idx}`}
                data-state={nodeState}
                layout
                animate={{
                  opacity: inRange || inConfirmedRange ? 1 : 0.25,
                  scale: isMid || inConfirmedRange ? 1.08 : 1
                }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                <span id={`p34-node-val-${idx}`}>{val}</span>
              </motion.div>

              <span id={`p34-idx-tag-${idx}`}>[{idx}]</span>
            </div>
          );
        })}
      </div>

      {/* Output Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p34-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div id="p34-callout-header-text">{output.label}</div>
            <div id="p34-callout-val-text">{output.value}</div>
            <div id="p34-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}