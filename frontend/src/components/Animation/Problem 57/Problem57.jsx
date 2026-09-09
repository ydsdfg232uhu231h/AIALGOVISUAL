import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem57.css";

export default function Problem57({ stepData }) {
  const {
    intervals = [
      [1, 2],
      [3, 5],
      [6, 7],
      [8, 10],
      [12, 16]
    ],
    newInterval = [4, 8],
    res = [],
    i = 0,
    phase = "LEFT", // "LEFT", "MERGE", "INSERT", "RIGHT", "DONE"
    actionType = "IDLE", // "APPEND_LEFT", "EXPAND", "APPEND_NEW", "APPEND_RIGHT", "DONE"
    comparisonText = "",
    isCompleted = false,
    output
  } = stepData || {};

  let actionState = "idle";
  if (actionType === "EXPAND") actionState = "expand";
  else if (actionType.includes("APPEND")) actionState = "append";

  const isNewExpanded = phase === "MERGE" && actionType === "EXPAND";

  return (
    <div id="p57-insert-interval-canvas">
      {/* Top Metrics Row */}
      <div id="p57-metrics-bar">
        <span id="p57-metric-pointer">
          Pointer (`i`): <b>{i !== null && i < intervals.length ? `i = ${i}` : "Done"}</b>
        </span>

        <span id="p57-metric-new-interval">
          `newInterval`: <b>[{newInterval[0]}, {newInterval[1]}]</b>
        </span>

        <span id="p57-metric-res-count">
          `res` Count: <b>{res.length}</b>
        </span>

        <span id={isCompleted ? "p57-metric-status-done" : "p57-metric-status-active"}>
          Phase: <b>{isCompleted ? "COMPLETED" : phase}</b>
        </span>
      </div>

      <div id="p57-insert-stage">
        {/* Track 1: Original Sorted Intervals */}
        <div id="p57-input-track-card">
          <div id="p57-input-card-header">
            <span id="p57-input-header-title">1. Original Intervals (`intervals`)</span>
            <span id="p57-input-header-sub">Non-overlapping and sorted by start time</span>
          </div>

          <div id="p57-input-elements-track">
            {intervals.map((inv, idx) => {
              const isCurrent = idx === i && !isCompleted;
              const isProcessed = idx < i || isCompleted;

              let boxState = "idle";
              if (isCurrent) {
                boxState = "active";
              } else if (isProcessed) {
                boxState = "passed";
              }

              return (
                <motion.div
                  key={`p57-input-${idx}`}
                  id={`p57-input-col-${idx}`}
                  layout
                  animate={{
                    scale: isCurrent ? 1.08 : 1,
                    opacity: isProcessed && !isCurrent ? 0.35 : 1
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                >
                  <div id={`p57-input-box-${idx}`} data-state={boxState}>
                    [{inv[0]}, {inv[1]}]
                  </div>
                  <span id={`p57-input-idx-tag-${idx}`}>[{idx}]</span>
                  <AnimatePresence mode="popLayout">
                    {isCurrent && (
                      <motion.span
                        key={`p57-input-ptr-${idx}`}
                        id="p57-input-pointer-tag-i"
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
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Middle Row: The Mutating newInterval & Decision Logic */}
        <div id="p57-middle-row-stage">
          {/* Floating newInterval Card */}
          <div id="p57-new-interval-card">
            <div id="p57-new-interval-header">
              <span id="p57-new-interval-title">2. Target `newInterval`</span>
              <span id="p57-new-interval-sub">Absorbs overlaps</span>
            </div>
            <div id="p57-new-interval-viewport">
              <motion.div
                id="p57-new-box"
                data-state={isNewExpanded ? "expand" : "idle"}
                key={`p57-new-inv-${newInterval[0]}-${newInterval[1]}`}
                layout
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{
                  scale: 1,
                  opacity: phase === "INSERT" || phase === "RIGHT" || isCompleted ? 0.3 : 1
                }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                [{newInterval[0]}, {newInterval[1]}]
              </motion.div>
            </div>
          </div>

          {/* Decision Inspector */}
          <div id="p57-decision-inspector-card">
            <div id="p57-decision-card-header">
              <span id="p57-decision-header-title">Sweep Logic Engine</span>
              <span id="p57-decision-header-sub">Evaluating intervals[i] against newInterval</span>
            </div>

            <div id="p57-decision-grid">
              <div id="p57-decision-box-rule">
                <span id="p57-decision-title-rule">Condition Check:</span>
                <span id="p57-decision-val-rule">
                  {comparisonText || "Evaluating..."}
                </span>
              </div>

              <div id="p57-decision-box-action">
                <span id="p57-decision-title-action">Sweep Action:</span>
                <span id="p57-decision-val-action" data-action={actionState}>
                  {actionType === "APPEND_LEFT" && "APPEND: Strictly left (no overlap)"}
                  {actionType === "EXPAND" && "MERGE: newInterval expands to absorb overlap"}
                  {actionType === "APPEND_NEW" && "INSERT: Append the finalized newInterval"}
                  {actionType === "APPEND_RIGHT" && "APPEND: Strictly right (no overlap)"}
                  {isCompleted && "FINISHED: RETURN res"}
                  {actionType === "IDLE" && "READING NEXT INTERVAL"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Track 3: Result Array */}
        <div id="p57-res-track-card">
          <div id="p57-res-card-header">
            <span id="p57-res-header-title">3. Output Array (`res`)</span>
            <span id="p57-res-header-sub">Final merged intervals accumulator</span>
          </div>

          <div id="p57-res-elements-track">
            <AnimatePresence mode="popLayout">
              {res.length === 0 ? (
                <span id="p57-res-empty-text">res = [] (empty)</span>
              ) : (
                res.map((inv, idx) => {
                  let boxState = "idle";
                  if (isCompleted) {
                    boxState = "done";
                  } else if (idx === res.length - 1) {
                    boxState = "active";
                  }

                  return (
                    <motion.div
                      key={`p57-res-${idx}-${inv[0]}-${inv[1]}`}
                      id={`p57-res-col-${idx}`}
                      layout
                      initial={{ opacity: 0, scale: 0.7, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      transition={{ type: "spring", stiffness: 350, damping: 24 }}
                    >
                      <div id={`p57-res-box-${idx}`} data-state={boxState}>
                        [{inv[0]}, {inv[1]}]
                      </div>
                      <span id={`p57-res-idx-tag-${idx}`}>[{idx}]</span>
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
            id="p57-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div id="p57-callout-header-text">{output.label}</div>
            <div id="p57-callout-val-text">{output.value}</div>
            <div id="p57-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}