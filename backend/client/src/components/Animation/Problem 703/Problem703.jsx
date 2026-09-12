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

  let actionLower = "idle";
  if (actionType === "PUSH") actionLower = "push";
  else if (actionType === "POP_EXCESS") actionLower = "pop";
  else if (isCompleted) actionLower = "done";

  return (
    <div id="p703-kth-stream-canvas">
      {/* Top Status & Metrics Row */}
      <div id="p703-metrics-bar">
        <span id="p703-metric-k-target">
          Holding Top: <b>k = {k} elements</b>
        </span>

        <span id="p703-metric-heap-capacity">
          Capacity Used: <b>{heap.length} / {k}</b>
        </span>

        {addedVal !== null ? (
          <span id="p703-metric-stream-active">
            Incoming: <b>add({addedVal})</b>
          </span>
        ) : (
          <span id="p703-metric-stream-idle">
            Incoming: <b>None</b>
          </span>
        )}

        <span id={kthLargest !== null ? "p703-metric-kth-result" : "p703-metric-kth-idle"}>
          Current {k}th Largest: <b>{kthLargest !== null ? kthLargest : "---"}</b>
        </span>

        <span
          id="p703-metric-status"
          data-status={isCompleted ? "done" : "active"}
        >
          Status: <b>{isCompleted ? "STREAM FINISHED ✓" : actionType}</b>
        </span>
      </div>

      <div id="p703-visual-flow-stage">
        {/* Left: Incoming Stream Conveyor */}
        <div id="p703-conveyor-card">
          <div id="p703-conveyor-card-header">
            <span id="p703-conveyor-title">Stream Input</span>
            <span id="p703-conveyor-sub">add(val)</span>
          </div>
          <div id="p703-conveyor-viewport">
            <AnimatePresence mode="wait">
              {addedVal !== null ? (
                <motion.div
                  key={`p703-stream-val-${addedVal}`}
                  id="p703-conveyor-active-ball"
                  initial={{ x: -40, opacity: 0, scale: 0.6 }}
                  animate={{ x: 0, opacity: 1, scale: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                >
                  <span id="p703-conveyor-val">{addedVal}</span>
                  <span id="p703-conveyor-tag">INCOMING</span>
                </motion.div>
              ) : (
                <span id="p703-conveyor-empty-text">No active push</span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Center: The Top-K Retention Chamber (Min-Heap) */}
        <div id="p703-chamber-card">
          <div id="p703-chamber-card-header">
            <span id="p703-chamber-title">Top {k} Surviving Elements (Min-Heap)</span>
            <span id="p703-chamber-sub">Root element [0] is the gatekeeper ({k}th largest)</span>
          </div>

          <div id="p703-chamber-viewport">
            <AnimatePresence mode="popLayout">
              {heap.length === 0 ? (
                <span id="p703-chamber-empty-text">Chamber empty</span>
              ) : (
                <div id="p703-chamber-slots-grid">
                  {heap.map((val, idx) => {
                    const isGatekeeper = idx === 0;
                    const isJustAdded = val === addedVal && actionType === "PUSH";

                    let slotState = "idle";
                    if (isCompleted && isGatekeeper) slotState = "winner";
                    else if (isGatekeeper) slotState = "gatekeeper";
                    else if (isJustAdded) slotState = "new";

                    return (
                      <motion.div
                        key={`p703-heap-node-${idx}-${val}`}
                        id={`p703-slot-col-${idx}`}
                        layout
                        initial={{ opacity: 0, scale: 0.5, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.4, y: 30 }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      >
                        <div
                          id={`p703-slot-node-${idx}`}
                          data-slot-state={slotState}
                        >
                          {val}
                        </div>

                        <span
                          id={`p703-slot-rank-tag-${idx}`}
                          data-is-gatekeeper={isGatekeeper ? "true" : "false"}
                        >
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
        <div id="p703-eviction-card">
          <div id="p703-eviction-card-header">
            <span id="p703-eviction-title">Discard Chute</span>
            <span id="p703-eviction-sub">Popped if size &gt; {k}</span>
          </div>
          <div id="p703-eviction-viewport">
            <AnimatePresence mode="wait">
              {evictedVal !== null ? (
                <motion.div
                  key={`p703-evicted-${evictedVal}`}
                  id="p703-eviction-ball"
                  initial={{ y: -30, opacity: 0, scale: 1.1 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 30, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 360, damping: 24 }}
                >
                  <span id="p703-eviction-val">{evictedVal}</span>
                  <span id="p703-eviction-tag">EVICTED</span>
                </motion.div>
              ) : (
                <span id="p703-eviction-empty-text">No evictions</span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Logic Rule Inspector */}
      <div id="p703-decision-inspector-card">
        <div id="p703-decision-card-header">
          <span id="p703-decision-header-title">Stream &amp; Heap Transition Log</span>
          <span id="p703-decision-header-sub">Algorithm Execution Step</span>
        </div>

        <div id="p703-decision-grid">
          <div id="p703-decision-box-rule">
            <span id="p703-decision-title-rule">Heap Sizing Condition:</span>
            <span id="p703-decision-val-rule">
              {comparisonText || `Heap contains ${heap.length} elements (target: ${k})`}
            </span>
          </div>

          <div id="p703-decision-box-action">
            <span id="p703-decision-title-action">Current Action:</span>
            <span
              id="p703-decision-val"
              data-action-type={actionLower}
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

      {/* Result Callout (Elevated safely above playback controls) */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p703-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div id="p703-callout-header-text">{output.label}</div>
            <div id="p703-callout-val-text">{output.value}</div>
            <div id="p703-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}