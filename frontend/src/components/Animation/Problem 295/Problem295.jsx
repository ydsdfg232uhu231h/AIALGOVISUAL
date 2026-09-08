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

  const smallTop = smallHeap.length > 0 ? smallHeap[0] : null;
  const largeTop = largeHeap.length > 0 ? largeHeap[0] : null;

  return (
    <div id="two-heaps-canvas">
      {/* Top Metrics Row */}
      <div id="metrics-bar">
        <span id="metric-small-count">
          Max-Heap (`small`): <b>{smallHeap.length} elements</b>
        </span>

        <span id="metric-large-count">
          Min-Heap (`large`): <b>{largeHeap.length} elements</b>
        </span>

        <span id="metric-median-val">
          Current Median: <b>{currentMedian !== null ? currentMedian : "Pending Query"}</b>
        </span>

        <span id={isCompleted ? "metric-status-done" : "metric-status-active"}>
          Status: <b>{isCompleted ? "STREAM FINISHED ✓" : actionType}</b>
        </span>
      </div>

      <div id="heaps-stage">
        {/* Dual Heap Chambers Stage */}
        <div id="heaps-dual-grid">
          {/* Left Chamber: Max-Heap (Lower Half) */}
          <div id="small-heap-card">
            <div id="small-card-header">
              <span id="small-header-title">1. Max-Heap: Lower Half (`small`)</span>
              <span id="small-header-sub">Stores values &le; median</span>
            </div>

            <div id="small-heap-viewport">
              <AnimatePresence mode="popLayout">
                {smallHeap.length === 0 ? (
                  <span id="small-empty-text">Max-Heap is empty</span>
                ) : (
                  smallHeap.map((val, idx) => {
                    const isTop = idx === 0;
                    const isIncoming = val === activeVal && actionType === "ADD_NUM";
                    let pillId = `small-node-idle-${idx}`;
                    if (isTop) pillId = `small-node-top-${idx}`;
                    if (isIncoming) pillId = `small-node-active-${idx}`;

                    return (
                      <motion.div
                        key={`small-node-${idx}-${val}`}
                        id={pillId}
                        layout
                        initial={{ opacity: 0, scale: 0.6, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: -15 }}
                        transition={{ type: "spring", stiffness: 350, damping: 24 }}
                      >
                        <span id={`small-val-${idx}`}>{val}</span>
                        {isTop && <span id="small-top-tag">TOP (MAX)</span>}
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Chamber: Min-Heap (Upper Half) */}
          <div id="large-heap-card">
            <div id="large-card-header">
              <span id="large-header-title">2. Min-Heap: Upper Half (`large`)</span>
              <span id="large-header-sub">Stores values &gt; median</span>
            </div>

            <div id="large-heap-viewport">
              <AnimatePresence mode="popLayout">
                {largeHeap.length === 0 ? (
                  <span id="large-empty-text">Min-Heap is empty</span>
                ) : (
                  largeHeap.map((val, idx) => {
                    const isTop = idx === 0;
                    const isIncoming = val === activeVal && actionType === "REBALANCE";
                    let pillId = `large-node-idle-${idx}`;
                    if (isTop) pillId = `large-node-top-${idx}`;
                    if (isIncoming) pillId = `large-node-active-${idx}`;

                    return (
                      <motion.div
                        key={`large-node-${idx}-${val}`}
                        id={pillId}
                        layout
                        initial={{ opacity: 0, scale: 0.6, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: -15 }}
                        transition={{ type: "spring", stiffness: 350, damping: 24 }}
                      >
                        <span id={`large-val-${idx}`}>{val}</span>
                        {isTop && <span id="large-top-tag">TOP (MIN)</span>}
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Median Calculation Inspector */}
        <div id="median-inspector-card">
          <div id="median-card-header">
            <span id="median-header-title">Median Calculation Engine</span>
            <span id="median-header-sub">O(1) direct top retrieval</span>
          </div>

          <div id="median-grid">
            <div id="median-box-balance">
              <span id="median-title-balance">Size Comparison:</span>
              <span id="median-val-balance">
                small.size ({smallHeap.length}) vs large.size ({largeHeap.length})
              </span>
            </div>

            <div id="median-box-formula">
              <span id="median-title-formula">Active Formula:</span>
              <span id="median-val-formula">
                {formulaText || "Awaiting operation..."}
              </span>
            </div>

            <div id="median-box-result">
              <span id="median-title-result">Instant Median:</span>
              <span id={currentMedian !== null ? "median-result-ready" : "median-result-idle"}>
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