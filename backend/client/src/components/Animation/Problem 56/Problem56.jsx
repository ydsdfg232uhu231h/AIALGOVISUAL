import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem56.css";

export default function Problem56({ stepData }) {
  const {
    intervals = [
      [1, 3],
      [2, 6],
      [8, 10],
      [15, 18]
    ],
    merged = [],
    currentIdx = 0,
    actionType = "IDLE",
    comparisonText = "",
    isCompleted = false,
    output
  } = stepData || {};

  let actionState = "idle";
  if (actionType === "MERGE") actionState = "merge";
  else if (actionType === "APPEND") actionState = "append";

  return (
    <div id="p56-merge-intervals-canvas">
      {/* Top Metrics Row */}
      <div id="p56-metrics-bar">
        <span id="p56-metric-current-idx">
          Pointer (`i`): <b>{currentIdx !== null ? `i = ${currentIdx}` : "Done"}</b>
        </span>

        <span id="p56-metric-incoming">
          Current Interval:{" "}
          <b>
            {currentIdx !== null && intervals[currentIdx]
              ? `[${intervals[currentIdx][0]}, ${intervals[currentIdx][1]}]`
              : "None"}
          </b>
        </span>

        <span id="p56-metric-merged-count">
          Merged Count: <b>{merged.length} intervals</b>
        </span>

        <span id={isCompleted ? "p56-metric-status-done" : "p56-metric-status-active"}>
          Status: <b>{isCompleted ? "ALL MERGED ✓" : actionType}</b>
        </span>
      </div>

      <div id="p56-merge-stage">
        {/* Track 1: Input Intervals Track */}
        <div id="p56-input-track-card">
          <div id="p56-input-card-header">
            <span id="p56-input-header-title">1. Sorted Input Intervals</span>
            <span id="p56-input-header-sub">Pre-sorted by start time: interval[0]</span>
          </div>

          <div id="p56-input-elements-track">
            {intervals.map((interval, idx) => {
              const isCurrent = idx === currentIdx && !isCompleted;
              const isProcessed = idx < currentIdx || isCompleted;

              let boxState = "idle";
              if (isCurrent) {
                boxState = "active";
              } else if (isProcessed) {
                boxState = "passed";
              }

              return (
                <motion.div
                  key={`p56-input-${idx}`}
                  id={`p56-input-col-${idx}`}
                  layout
                  animate={{
                    scale: isCurrent ? 1.08 : 1,
                    opacity: isProcessed && !isCurrent ? 0.45 : 1
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                >
                  <div id={`p56-input-box-${idx}`} data-state={boxState}>
                    [{interval[0]}, {interval[1]}]
                  </div>
                  <span id={`p56-input-idx-tag-${idx}`}>[{idx}]</span>
                  <AnimatePresence mode="popLayout">
                    {isCurrent && (
                      <motion.span
                        key={`p56-input-ptr-${idx}`}
                        id="p56-input-pointer-tag-i"
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

        {/* Track 2: Merged Result Track */}
        <div id="p56-merged-track-card">
          <div id="p56-merged-card-header">
            <span id="p56-merged-header-title">2. Merged Output Stream (`merged`)</span>
            <span id="p56-merged-header-sub">Non-overlapping intervals accumulator</span>
          </div>

          <div id="p56-merged-elements-track">
            <AnimatePresence mode="popLayout">
              {merged.length === 0 ? (
                <span id="p56-merged-empty-text">merged = [] (empty)</span>
              ) : (
                merged.map((interval, idx) => {
                  const isLast = idx === merged.length - 1;
                  let boxState = "idle";

                  if (isCompleted) {
                    boxState = "done";
                  } else if (isLast && actionType === "MERGE") {
                    boxState = "merge";
                  } else if (isLast) {
                    boxState = "active";
                  }

                  return (
                    <motion.div
                      key={`p56-merged-${idx}-${interval[0]}-${interval[1]}`}
                      id={`p56-merged-col-${idx}`}
                      layout
                      initial={{ opacity: 0, scale: 0.7, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      transition={{ type: "spring", stiffness: 350, damping: 24 }}
                    >
                      <div id={`p56-merged-box-${idx}`} data-state={boxState}>
                        [{interval[0]}, {interval[1]}]
                      </div>
                      <span id={`p56-merged-idx-tag-${idx}`}>[{idx}]</span>
                      <AnimatePresence mode="popLayout">
                        {isLast && !isCompleted && (
                          <motion.span
                            key={`p56-last-ptr-${idx}`}
                            id="p56-merged-pointer-tag-last"
                            layout
                            initial={{ y: 6, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 6, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 450, damping: 25 }}
                          >
                            LAST
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Decision Rule Inspector */}
        <div id="p56-decision-inspector-card">
          <div id="p56-decision-card-header">
            <span id="p56-decision-header-title">Overlap Decision Rule</span>
            <span id="p56-decision-header-sub">LAST(merged).end vs interval.start</span>
          </div>

          <div id="p56-decision-grid">
            <div id="p56-decision-box-rule">
              <span id="p56-decision-title-rule">Condition Check:</span>
              <span id="p56-decision-val-rule">
                {comparisonText || "Evaluating interval placement..."}
              </span>
            </div>

            <div id="p56-decision-box-action">
              <span id="p56-decision-title-action">Action:</span>
              <span id="p56-decision-val-action" data-action={actionState}>
                {actionType === "MERGE"
                  ? "EXTEND: LAST.end = max(LAST.end, curr.end)"
                  : actionType === "APPEND"
                  ? "APPEND: New non-overlapping interval"
                  : isCompleted
                  ? "FINISHED: RETURN merged"
                  : "READING NEXT INTERVAL"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Result Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p56-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div id="p56-callout-header-text">{output.label}</div>
            <div id="p56-callout-val-text">{output.value}</div>
            <div id="p56-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}