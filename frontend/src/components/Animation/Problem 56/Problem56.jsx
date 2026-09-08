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

  return (
    <div id="merge-intervals-canvas">
      {/* Top Metrics Row */}
      <div id="metrics-bar">
        <span id="metric-current-idx">
          Pointer (`i`): <b>{currentIdx !== null ? `i = ${currentIdx}` : "Done"}</b>
        </span>

        <span id="metric-incoming">
          Current Interval:{" "}
          <b>
            {currentIdx !== null && intervals[currentIdx]
              ? `[${intervals[currentIdx][0]}, ${intervals[currentIdx][1]}]`
              : "None"}
          </b>
        </span>

        <span id="metric-merged-count">
          Merged Count: <b>{merged.length} intervals</b>
        </span>

        <span id={isCompleted ? "metric-status-done" : "metric-status-active"}>
          Status: <b>{isCompleted ? "ALL MERGED ✓" : actionType}</b>
        </span>
      </div>

      <div id="merge-stage">
        {/* Track 1: Input Intervals Track */}
        <div id="input-track-card">
          <div id="input-card-header">
            <span id="input-header-title">1. Sorted Input Intervals</span>
            <span id="input-header-sub">Pre-sorted by start time: interval[0]</span>
          </div>

          <div id="input-elements-track">
            {intervals.map((interval, idx) => {
              const isCurrent = idx === currentIdx && !isCompleted;
              const isProcessed = idx < currentIdx || isCompleted;

              let boxId = `input-box-idle-${idx}`;
              if (isCurrent) {
                boxId = `input-box-active-${idx}`;
              } else if (isProcessed) {
                boxId = `input-box-passed-${idx}`;
              }

              return (
                <motion.div
                  key={`input-${idx}`}
                  id={`input-col-${idx}`}
                  animate={{
                    scale: isCurrent ? 1.08 : 1,
                    opacity: isProcessed && !isCurrent ? 0.45 : 1
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                >
                  <div id={boxId}>
                    [{interval[0]}, {interval[1]}]
                  </div>
                  <span id={`input-idx-tag-${idx}`}>[{idx}]</span>
                  {isCurrent && <span id="input-pointer-tag-i">i</span>}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Track 2: Merged Result Track */}
        <div id="merged-track-card">
          <div id="merged-card-header">
            <span id="merged-header-title">2. Merged Output Stream (`merged`)</span>
            <span id="merged-header-sub">Non-overlapping intervals accumulator</span>
          </div>

          <div id="merged-elements-track">
            <AnimatePresence mode="popLayout">
              {merged.length === 0 ? (
                <span id="merged-empty-text">merged = [] (empty)</span>
              ) : (
                merged.map((interval, idx) => {
                  const isLast = idx === merged.length - 1;
                  let boxId = `merged-box-node-${idx}`;

                  if (isCompleted) {
                    boxId = `merged-box-done-${idx}`;
                  } else if (isLast && actionType === "MERGE") {
                    boxId = `merged-box-merge-${idx}`;
                  } else if (isLast) {
                    boxId = `merged-box-active-${idx}`;
                  }

                  return (
                    <motion.div
                      key={`merged-${idx}-${interval[0]}-${interval[1]}`}
                      id={`merged-col-${idx}`}
                      layout
                      initial={{ opacity: 0, scale: 0.7, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      transition={{ type: "spring", stiffness: 350, damping: 24 }}
                    >
                      <div id={boxId}>
                        [{interval[0]}, {interval[1]}]
                      </div>
                      <span id={`merged-idx-tag-${idx}`}>[{idx}]</span>
                      {isLast && !isCompleted && (
                        <span id="merged-pointer-tag-last">LAST</span>
                      )}
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Decision Rule Inspector */}
        <div id="decision-inspector-card">
          <div id="decision-card-header">
            <span id="decision-header-title">Overlap Decision Rule</span>
            <span id="decision-header-sub">LAST(merged).end vs interval.start</span>
          </div>

          <div id="decision-grid">
            <div id="decision-box-rule">
              <span id="decision-title-rule">Condition Check:</span>
              <span id="decision-val-rule">
                {comparisonText || "Evaluating interval placement..."}
              </span>
            </div>

            <div id="decision-box-action">
              <span id="decision-title-action">Action:</span>
              <span
                id={
                  actionType === "MERGE"
                    ? "decision-val-merge"
                    : actionType === "APPEND"
                    ? "decision-val-append"
                    : "decision-val-idle"
                }
              >
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