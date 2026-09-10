import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem1046.css";

export default function Problem1046({ stepData }) {
  const {
    heap = [],
    smashedPair = null,
    actionType = "IDLE", // "POP_TWO", "COLLIDE", "PUSH_DIFF", "DESTROY_BOTH", "DONE"
    collisionResult = null, // e.g. { first: 8, second: 7, diff: 1 }
    isCompleted = false,
    output
  } = stepData || {};

  const topTwo = smashedPair || [];

  return (
    <div id="p1046-last-stone-canvas">
      {/* Top Metrics Header */}
      <div id="p1046-metrics-bar">
        <span id="p1046-metric-heap-count">
          Heap Size: <b>{heap.length} stones</b>
        </span>

        <span id="p1046-metric-heaviest">
          Heaviest (`Top`): <b>{heap.length > 0 ? heap[0] : "None"}</b>
        </span>

        {topTwo.length === 2 ? (
          <span id="p1046-metric-smashed-active">
            Colliding: <b>{topTwo[0]} vs {topTwo[1]}</b>
          </span>
        ) : (
          <span id="p1046-metric-smashed-idle">
            Colliding: <b>None</b>
          </span>
        )}

        <span
          id="p1046-metric-status"
          data-status={isCompleted ? "done" : "active"}
        >
          Status: <b>{isCompleted ? "SIMULATION COMPLETE" : "MAX-HEAP EXTRACTION"}</b>
        </span>
      </div>

      <div id="p1046-stone-stage">
        {/* Collision Battle Arena */}
        <div id="p1046-smash-arena-card">
          <div id="p1046-arena-card-header">
            <span id="p1046-arena-header-title">1. Smash Collision Arena</span>
            <span id="p1046-arena-header-sub">Pop top 2 heaviest stones &amp; collide</span>
          </div>

          <div id="p1046-arena-viewport">
            <AnimatePresence mode="wait">
              {topTwo.length === 2 ? (
                <div id="p1046-collision-pair-container">
                  {/* Left Stone */}
                  <motion.div
                    key={`stone-left-${topTwo[0]}`}
                    id="p1046-stone-box-first"
                    initial={{ x: -70, opacity: 0, scale: 0.8 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  >
                    <span id="p1046-stone-val-first">{topTwo[0]}</span>
                    <span id="p1046-stone-tag-first">Heavy #1</span>
                  </motion.div>

                  {/* Impact Sparks */}
                  <motion.div
                    id="p1046-smash-impact-icon"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: [1, 1.15, 1], opacity: 1 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
                  >
                    <span id="p1046-smash-symbol">💥</span>
                    <span id="p1046-smash-equation">
                      {topTwo[0] === topTwo[1]
                        ? `${topTwo[0]} == ${topTwo[1]} (Both Destroyed)`
                        : `${topTwo[0]} - ${topTwo[1]} = ${topTwo[0] - topTwo[1]}`}
                    </span>
                  </motion.div>

                  {/* Right Stone */}
                  <motion.div
                    key={`stone-right-${topTwo[1]}`}
                    id="p1046-stone-box-second"
                    initial={{ x: 70, opacity: 0, scale: 0.8 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  >
                    <span id="p1046-stone-val-second">{topTwo[1]}</span>
                    <span id="p1046-stone-tag-second">Heavy #2</span>
                  </motion.div>
                </div>
              ) : isCompleted ? (
                <span id="p1046-arena-empty-text-done">
                  Simulation Finished — Last Stone Preserved
                </span>
              ) : (
                <span id="p1046-arena-empty-text">
                  Awaiting next 2 heaviest stones from heap...
                </span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Max Heap Queue Surface */}
        <div id="p1046-heap-track-card">
          <div id="p1046-heap-card-header">
            <span id="p1046-heap-header-title">2. Max-Heap Priority Queue (`maxHeap`)</span>
            <span id="p1046-heap-header-sub">Descending priority order</span>
          </div>

          <div id="p1046-heap-elements-track">
            <AnimatePresence mode="popLayout">
              {heap.length === 0 ? (
                <span id="p1046-heap-empty-text">Heap is empty (0 stones)</span>
              ) : (
                heap.map((weight, idx) => {
                  const isTop = idx === 0;

                  let heapState = "node";
                  if (isCompleted && idx === 0) heapState = "winner";
                  else if (isTop) heapState = "top";

                  return (
                    <motion.div
                      key={`p1046-heap-item-${idx}-${weight}`}
                      id={`p1046-heap-col-${idx}`}
                      layout
                      initial={{ opacity: 0, scale: 0.6, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.5, y: -20 }}
                      transition={{ type: "spring", stiffness: 360, damping: 24 }}
                    >
                      <div
                        id={`p1046-heap-box-${idx}`}
                        data-heap-state={heapState}
                      >
                        {weight}
                      </div>
                      <span id={`p1046-heap-idx-tag-${idx}`}>[{idx}]</span>
                      {isTop && !isCompleted && (
                        <span id="p1046-heap-pointer-tag-top">TOP</span>
                      )}
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Result Callout (Elevated safely above playback controls) */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p1046-result-callout-box"
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ type: "spring", stiffness: 360, damping: 26 }}
          >
            <div id="p1046-callout-header-text">{output.label}</div>
            <div id="p1046-callout-val-text">{output.value}</div>
            <div id="p1046-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}