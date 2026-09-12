import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem295.css";

export default function Problem295({ stepData }) {
  const {
    smallHeap = [],
    largeHeap = [],
    currentMedian = null,
    actionType = "IDLE", // "ADD_NUM", "REBALANCE", "CALC_MEDIAN", "DONE"
    activeVal = null,
    formulaText = "",
    isCompleted = false,
    output
  } = stepData || {};

  return (
    <div id="p295-two-heaps-canvas">
      {/* Top Metrics Row */}
      <div id="p295-metrics-bar">
        <span id="p295-metric-small-count">
          Max-Heap (`small`): <b>{smallHeap.length} elements</b>
        </span>

        <span id="p295-metric-large-count">
          Min-Heap (`large`): <b>{largeHeap.length} elements</b>
        </span>

        <span id="p295-metric-median-val">
          Current Median: <b>{currentMedian !== null ? currentMedian : "Pending Query"}</b>
        </span>

        <span
          id="p295-metric-status"
          data-status={isCompleted ? "done" : "active"}
        >
          Status: <b>{isCompleted ? "STREAM FINISHED ✓" : actionType}</b>
        </span>
      </div>

      <div id="p295-heaps-stage">
        {/* Dual Heap Chambers Stage */}
        <div id="p295-heaps-dual-grid">
          {/* Left Chamber: Max-Heap (Lower Half) */}
          <div id="p295-small-heap-card">
            <div id="p295-small-card-header">
              <span id="p295-small-header-title">1. Max-Heap: Lower Half (`small`)</span>
              <span id="p295-small-header-sub">Stores values &le; median</span>
            </div>

            <div id="p295-small-heap-viewport">
              <AnimatePresence mode="popLayout">
                {smallHeap.length === 0 ? (
                  <span id="p295-small-empty-text">Max-Heap is empty</span>
                ) : (
                  smallHeap.map((val, idx) => {
                    const isTop = idx === 0;
                    const isIncoming = val === activeVal && actionType === "ADD_NUM";

                    let nodeState = "idle";
                    if (isIncoming) nodeState = "active";
                    else if (isTop) nodeState = "top";

                    return (
                      <motion.div
                        key={`p295-small-node-${idx}-${val}`}
                        id={`p295-small-node-${idx}`}
                        data-chamber="small"
                        data-node-state={nodeState}
                        layout
                        initial={{ opacity: 0, scale: 0.6, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: -15 }}
                        transition={{ type: "spring", stiffness: 350, damping: 24 }}
                      >
                        <span id={`p295-small-val-${idx}`}>{val}</span>
                        {isTop && (
                          <span id={`p295-small-top-tag-${idx}`}>TOP (MAX)</span>
                        )}
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Chamber: Min-Heap (Upper Half) */}
          <div id="p295-large-heap-card">
            <div id="p295-large-card-header">
              <span id="p295-large-header-title">2. Min-Heap: Upper Half (`large`)</span>
              <span id="p295-large-header-sub">Stores values &gt; median</span>
            </div>

            <div id="p295-large-heap-viewport">
              <AnimatePresence mode="popLayout">
                {largeHeap.length === 0 ? (
                  <span id="p295-large-empty-text">Min-Heap is empty</span>
                ) : (
                  largeHeap.map((val, idx) => {
                    const isTop = idx === 0;
                    const isIncoming = val === activeVal && actionType === "REBALANCE";

                    let nodeState = "idle";
                    if (isIncoming) nodeState = "active";
                    else if (isTop) nodeState = "top";

                    return (
                      <motion.div
                        key={`p295-large-node-${idx}-${val}`}
                        id={`p295-large-node-${idx}`}
                        data-chamber="large"
                        data-node-state={nodeState}
                        layout
                        initial={{ opacity: 0, scale: 0.6, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: -15 }}
                        transition={{ type: "spring", stiffness: 350, damping: 24 }}
                      >
                        <span id={`p295-large-val-${idx}`}>{val}</span>
                        {isTop && (
                          <span id={`p295-large-top-tag-${idx}`}>TOP (MIN)</span>
                        )}
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Median Calculation Inspector */}
        <div id="p295-median-inspector-card">
          <div id="p295-median-card-header">
            <span id="p295-median-header-title">Median Calculation Engine</span>
            <span id="p295-median-header-sub">O(1) direct top retrieval</span>
          </div>

          <div id="p295-median-grid">
            <div id="p295-median-box-balance">
              <span id="p295-median-title-balance">Size Comparison:</span>
              <span id="p295-median-val-balance">
                small.size ({smallHeap.length}) vs large.size ({largeHeap.length})
              </span>
            </div>

            <div id="p295-median-box-formula">
              <span id="p295-median-title-formula">Active Formula:</span>
              <span id="p295-median-val-formula">
                {formulaText || "Awaiting operation..."}
              </span>
            </div>

            <div id="p295-median-box-result">
              <span id="p295-median-title-result">Instant Median:</span>
              <span
                id="p295-median-result-display"
                data-median-state={currentMedian !== null ? "ready" : "idle"}
              >
                {currentMedian !== null ? `= ${currentMedian}` : "---"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Result Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p295-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div id="p295-callout-header-text">{output.label}</div>
            <div id="p295-callout-val-text">{output.value}</div>
            <div id="p295-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}