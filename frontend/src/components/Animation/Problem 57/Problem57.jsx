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

  return (
    <div id="insert-interval-canvas">
      {/* Top Metrics Row */}
      <div id="metrics-bar">
        <span id="metric-pointer">
          Pointer (`i`): <b>{i !== null && i < intervals.length ? `i = ${i}` : "Done"}</b>
        </span>

        <span id="metric-new-interval">
          `newInterval`: <b>[{newInterval[0]}, {newInterval[1]}]</b>
        </span>

        <span id="metric-res-count">
          `res` Count: <b>{res.length}</b>
        </span>

        <span id={isCompleted ? "metric-status-done" : "metric-status-active"}>
          Phase: <b>{isCompleted ? "COMPLETED" : phase}</b>
        </span>
      </div>

      <div id="insert-stage">
        {/* Track 1: Original Sorted Intervals */}
        <div id="input-track-card">
          <div id="input-card-header">
            <span id="input-header-title">1. Original Intervals (`intervals`)</span>
            <span id="input-header-sub">Non-overlapping and sorted by start time</span>
          </div>

          <div id="input-elements-track">
            {intervals.map((inv, idx) => {
              const isCurrent = idx === i && !isCompleted;
              const isProcessed = idx < i || isCompleted;

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
                    opacity: isProcessed && !isCurrent ? 0.35 : 1
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                >
                  <div id={boxId}>
                    [{inv[0]}, {inv[1]}]
                  </div>
                  <span id={`input-idx-tag-${idx}`}>[{idx}]</span>
                  {isCurrent && <span id="input-pointer-tag-i">i</span>}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Middle Row: The Mutating newInterval & Decision Logic */}
        <div id="middle-row-stage">
          {/* Floating newInterval Card */}
          <div id="new-interval-card">
            <div id="new-interval-header">
              <span id="new-interval-title">2. Target `newInterval`</span>
              <span id="new-interval-sub">Absorbs overlaps</span>
            </div>
            <div id="new-interval-viewport">
              <motion.div
                id={phase === "MERGE" && actionType === "EXPAND" ? "new-box-expand" : "new-box-idle"}
                key={`new-inv-${newInterval[0]}-${newInterval[1]}`}
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: 1, opacity: phase === "INSERT" || phase === "RIGHT" || isCompleted ? 0.3 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                [{newInterval[0]}, {newInterval[1]}]
              </motion.div>
            </div>
          </div>

          {/* Decision Inspector */}
          <div id="decision-inspector-card">
            <div id="decision-card-header">
              <span id="decision-header-title">Sweep Logic Engine</span>
              <span id="decision-header-sub">Evaluating intervals[i] against newInterval</span>
            </div>

            <div id="decision-grid">
              <div id="decision-box-rule">
                <span id="decision-title-rule">Condition Check:</span>
                <span id="decision-val-rule">
                  {comparisonText || "Evaluating..."}
                </span>
              </div>

              <div id="decision-box-action">
                <span id="decision-title-action">Sweep Action:</span>
                <span
                  id={
                    actionType === "EXPAND"
                      ? "decision-val-expand"
                      : actionType.includes("APPEND")
                      ? "decision-val-append"
                      : "decision-val-idle"
                  }
                >
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
        <div id="res-track-card">
          <div id="res-card-header">
            <span id="res-header-title">3. Output Array (`res`)</span>
            <span id="res-header-sub">Final merged intervals accumulator</span>
          </div>

          <div id="res-elements-track">
            <AnimatePresence mode="popLayout">
              {res.length === 0 ? (
                <span id="res-empty-text">res = [] (empty)</span>
              ) : (
                res.map((inv, idx) => {
                  let boxId = `res-box-node-${idx}`;
                  if (isCompleted) {
                    boxId = `res-box-done-${idx}`;
                  } else if (idx === res.length - 1) {
                    boxId = `res-box-active-${idx}`;
                  }

                  return (
                    <motion.div
                      key={`res-${idx}-${inv[0]}-${inv[1]}`}
                      id={`res-col-${idx}`}
                      layout
                      initial={{ opacity: 0, scale: 0.7, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      transition={{ type: "spring", stiffness: 350, damping: 24 }}
                    >
                      <div id={boxId}>
                        [{inv[0]}, {inv[1]}]
                      </div>
                      <span id={`res-idx-tag-${idx}`}>[{idx}]</span>
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