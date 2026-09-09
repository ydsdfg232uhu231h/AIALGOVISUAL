import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem704.css";

export default function Problem704({ stepData }) {
  const {
    array = [-1, 0, 3, 5, 9, 12],
    l = 0,
    r = 5,
    m = null,
    left,
    right,
    mid,
    state = {},
    output
  } = stepData || {};

  // Support both stepData schemas (l/r/m or left/right/mid)
  const low = left ?? l ?? 0;
  const high = right ?? r ?? array.length - 1;
  const currMid = mid ?? m ?? state.m ?? null;

  const target = state.target ?? 9;
  const isComplete = state.status === "COMPLETED" || !!output;
  const matchIdx = isComplete
    ? (state.return ?? (currMid !== null && array[currMid] === target ? currMid : null))
    : null;

  return (
    <div id="p704-binary-search-canvas">
      {/* Top Metrics Row */}
      <div id="p704-metrics-bar">
        <span id="p704-metric-target-val">
          Target: <b>{target}</b>
        </span>
        <span id="p704-metric-range-bounds">
          Search Window: l = <b>{low}</b>, r = <b>{high}</b>
        </span>
        {currMid !== null && (
          <span id="p704-metric-mid-val">
            mid = <b>{currMid}</b> (val: {array[currMid]})
          </span>
        )}
        <span id={isComplete ? "p704-metric-status-done" : "p704-metric-status-active"}>
          Status: <b>{isComplete ? "COMPLETED" : "SEARCHING"}</b>
        </span>
      </div>

      {/* Main Center Stage */}
      <div id="p704-search-stage-container">
        <div id="p704-elements-track">
          {array.map((val, idx) => {
            const inRange = idx >= low && idx <= high;
            const isMid = idx === currMid;
            const isLeft = idx === low;
            const isRight = idx === high;
            const isMatch = isComplete && idx === matchIdx;

            let nodeState = inRange ? "active" : "out";
            if (isMatch) nodeState = "match";
            else if (isMid) nodeState = "mid";

            return (
              <div key={`p704-col-${idx}`} id={`p704-box-column-${idx}`}>
                {/* Fixed Pointer Anchor Track */}
                <div id={`p704-ptrs-track-${idx}`}>
                  <AnimatePresence mode="popLayout">
                    {isLeft && (
                      <motion.span
                        key={`p704-ptr-l-${idx}`}
                        id={`p704-pointer-tag-l-${idx}`}
                        layout
                        initial={{ y: -8, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -8, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 450, damping: 25 }}
                      >
                        L
                      </motion.span>
                    )}
                    {isMid && (
                      <motion.span
                        key={`p704-ptr-m-${idx}`}
                        id={`p704-pointer-tag-m-${idx}`}
                        layout
                        initial={{ y: -8, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -8, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 450, damping: 25 }}
                      >
                        M
                      </motion.span>
                    )}
                    {isRight && (
                      <motion.span
                        key={`p704-ptr-r-${idx}`}
                        id={`p704-pointer-tag-r-${idx}`}
                        layout
                        initial={{ y: -8, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -8, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 450, damping: 25 }}
                      >
                        R
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                {/* Number Box with Static Scoped ID & Dynamic State Attribute */}
                <motion.div
                  id={`p704-box-node-${idx}`}
                  data-state={nodeState}
                  layout
                  animate={{
                    scale: isMatch ? 1.12 : isMid ? 1.06 : 1,
                    opacity: inRange || isMatch ? 1 : 0.28
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                >
                  <span id={`p704-box-val-${idx}`}>{val}</span>
                  <span id={`p704-box-idx-${idx}`}>[{idx}]</span>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Result Callout Box */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p704-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
          >
            <div id="p704-callout-header-text">{output.label ?? "TARGET INDEX"}</div>
            <div id="p704-callout-val-text">{output.value ?? `Index ${matchIdx}`}</div>
            <div id="p704-callout-detail-text">
              {output.detail ?? `nums[${matchIdx}] === ${target} matched successfully.`}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}