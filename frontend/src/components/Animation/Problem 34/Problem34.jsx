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
    <div id="double-bs-canvas">
      {/* Metric Badges */}
      <div id="metrics-row">
        <span id="metric-chip-target">
          Target: <b>{target}</b>
        </span>
        <span id={phase === "findFirst" ? "phase-chip-left" : "phase-chip-right"}>
          Phase: <b>{phase === "findFirst" ? "1. Find First (Left Bound)" : "2. Find Last (Right Bound)"}</b>
        </span>
        <span id="metric-chip-range">
          low = <b>{low}</b>, high = <b>{high}</b>
        </span>
        <span id="metric-chip-mid">
          mid = <b>{mid}</b> (val: {array[mid]})
        </span>
        <span id="metric-chip-bound">
          Bounds: <b>[{firstIdx ?? "-"}, {lastIdx ?? "-"}]</b>
        </span>
      </div>

      {/* Elements Ribbon */}
      <div id="elements-track">
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
                  opacity: inRange || inConfirmedRange ? 1 : 0.25,
                  scale: isMid || inConfirmedRange ? 1.08 : 1,
                  borderColor: inConfirmedRange
                    ? "#22c55e"
                    : isMid
                    ? "#38bdf8"
                    : isFirstMatch || isLastMatch
                    ? "#eab308"
                    : "#27272a"
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