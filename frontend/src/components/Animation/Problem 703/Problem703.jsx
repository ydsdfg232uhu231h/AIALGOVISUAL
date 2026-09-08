import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem703.css";

export default function Problem703({ stepData }) {
  const {
    heap = [4, 5, 8],
    addedVal = null,
    k = 3,
    state = {},
    actionType = "IDLE", // "INIT", "PUSH", "POP_EXCESS", "DONE"
    comparisonText = "",
    isCompleted = false,
    output
  } = stepData || {};

  const kthLargest = state?.kthLargest ?? (heap.length > 0 ? heap[0] : null);
  const evictedVal = state?.popped ?? null;

  return (
    <div id="kth-stream-canvas">
      {/* Top Status & Metrics Row */}
      <div id="metrics-bar">
        <span id="metric-k-target">
          Holding Top: <b>k = {k} elements</b>
        </span>

        <span id="metric-heap-capacity">
          Capacity Used: <b>{heap.length} / {k}</b>
        </span>

        {addedVal !== null ? (
          <span id="metric-stream-active">
            Incoming: <b>add({addedVal})</b>
          </span>
        ) : (
          <span id="metric-stream-idle">
            Incoming: <b>None</b>
          </span>
        )}

        <span id={kthLargest !== null ? "metric-kth-result" : "metric-kth-idle"}>
          Current {k}th Largest: <b>{kthLargest !== null ? kthLargest : "---"}</b>
        </span>

        <span id={isCompleted ? "metric-status-done" : "metric-status-active"}>
          Status: <b>{isCompleted ? "STREAM FINISHED ✓" : actionType}</b>
        </span>
      </div>

      <div id="visual-flow-stage">
        {/* Left: Incoming Stream Conveyor */}
        <div id="conveyor-card">
          <div id="conveyor-card-header">
            <span id="conveyor-title">Stream Input</span>
            <span id="conveyor-sub">add(val)</span>
          </div>
          <div id="conveyor-viewport">
            <AnimatePresence mode="wait">
              {addedVal !== null ? (
                <motion.div
                  key={`stream-val-${addedVal}`}
                  id="conveyor-active-ball"
                  initial={{ x: -40, opacity: 0, scale: 0.6 }}
                  animate={{ x: 0, opacity: 1, scale: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                >
                  <span id="conveyor-val">{addedVal}</span>
                  <span id="conveyor-tag">INCOMING</span>
                </motion.div>
              ) : (
                <span id="conveyor-empty-text">No active push</span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Center: The Top-K Retention Chamber (Min-Heap) */}
        <div id="chamber-card">
          <div id="chamber-card-header">
            <span id="chamber-title">Top {k} Surviving Elements (Min-Heap)</span>
            <span id="chamber-sub">Root element [0] is the gatekeeper ({k}th largest)</span>
          </div>

          <div id="chamber-viewport">
            <AnimatePresence mode="popLayout">
              {heap.length === 0 ? (
                <span id="chamber-empty-text">Chamber empty</span>
              ) : (
                <div id="chamber-slots-grid">
                  {heap.map((val, idx) => {
                    const isGatekeeper = idx === 0;
                    const isJustAdded = val === addedVal && actionType === "PUSH";

                    let slotId = `slot-node-idle-${idx}`;
                    if (isCompleted && isGatekeeper) slotId = `slot-node-winner-${idx}`;
                    else if (isGatekeeper) slotId = `slot-node-gatekeeper-${idx}`;
                    else if (isJustAdded) slotId = `slot-node-new-${idx}`;

                    return (
                      <motion.div
                        key={`heap-node-${idx}-${val}`}
                        id={`slot-col-${idx}`}
                        layout
                        initial={{ opacity: 0, scale: 0.5, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.4, y: 30 }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      >
                        <div id={slotId}>
                          {val}
                        </div>

                        <span id={`slot-rank-tag-${idx}`}>
                          {isGatekeeper ? `★ ${k}th LARGEST` : `TOP ${idx + 1}`}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Eviction Chute (Discarded below threshold) */}
        <div id="eviction-card">
          <div id="eviction-card-header">
            <span id="eviction-title">Discard Chute</span>
            <span id="eviction-sub">Popped if size &gt; {k}</span>
          </div>
          <div id="eviction-viewport">
            <AnimatePresence mode="wait">
              {evictedVal !== null ? (
                <motion.div
                  key={`evicted-${evictedVal}`}
                  id="eviction-ball"
                  initial={{ y: -30, opacity: 0, scale: 1.1 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 30, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 360, damping: 24 }}
                >
                  <span id="eviction-val">{evictedVal}</span>
                  <span id="eviction-tag">EVICTED</span>
                </motion.div>
              ) : (
                <span id="eviction-empty-text">No evictions</span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Logic Rule Inspector */}
      <div id="decision-inspector-card">
        <div id="decision-card-header">
          <span id="decision-header-title">Stream &amp; Heap Transition Log</span>
          <span id="decision-header-sub">Algorithm Execution Step</span>
        </div>

        <div id="decision-grid">
          <div id="decision-box-rule">
            <span id="decision-title-rule">Heap Sizing Condition:</span>
            <span id="decision-val-rule">
              {comparisonText || `Heap contains ${heap.length} elements (target: ${k})`}
            </span>
          </div>

          <div id="decision-box-action">
            <span id="decision-title-action">Current Action:</span>
            <span
              id={
                actionType === "PUSH"
                  ? "decision-val-push"
                  : actionType === "POP_EXCESS"
                  ? "decision-val-pop"
                  : isCompleted
                  ? "decision-val-done"
                  : "decision-val-idle"
              }
            >
              {actionType === "PUSH" && `STREAM: Pushed ${addedVal} into the chamber.`}
              {actionType === "POP_EXCESS" && `EVICT: Chamber exceeded ${k}. Smallest element (${evictedVal}) was dropped!`}
              {actionType === "INIT" && `INIT: Loaded initial numbers and kept the top ${k}.`}
              {isCompleted && `DONE: The root element (${kthLargest}) is verified as the ${k}th largest.`}
              {actionType === "IDLE" && "WAITING FOR NEXT STREAM VALUE"}
            </span>
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