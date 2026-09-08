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
    <div id="last-stone-canvas">
      {/* Top Metrics Header */}
      <div id="metrics-bar">
        <span id="metric-heap-count">
          Heap Size: <b>{heap.length} stones</b>
        </span>

        <span id="metric-heaviest">
          Heaviest (`Top`): <b>{heap.length > 0 ? heap[0] : "None"}</b>
        </span>

        {topTwo.length === 2 ? (
          <span id="metric-smashed-active">
            Colliding: <b>{topTwo[0]} vs {topTwo[1]}</b>
          </span>
        ) : (
          <span id="metric-smashed-idle">
            Colliding: <b>None</b>
          </span>
        )}

        <span id={isCompleted ? "metric-status-done" : "metric-status-active"}>
          Status: <b>{isCompleted ? "SIMULATION COMPLETE" : "MAX-HEAP EXTRACTION"}</b>
        </span>
      </div>

      <div id="stone-stage">
        {/* Collision Battle Arena */}
        <div id="smash-arena-card">
          <div id="arena-card-header">
            <span id="arena-header-title">1. Smash Collision Arena</span>
            <span id="arena-header-sub">Pop top 2 heaviest stones & collide</span>
          </div>

          <div id="arena-viewport">
            <AnimatePresence mode="wait">
              {topTwo.length === 2 ? (
                <div id="collision-pair-container">
                  {/* Left Stone */}
                  <motion.div
                    key={`stone-left-${topTwo[0]}`}
                    id="stone-box-first"
                    initial={{ x: -70, opacity: 0, scale: 0.8 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  >
                    <span id="stone-val-first">{topTwo[0]}</span>
                    <span id="stone-tag-first">Heavy #1</span>
                  </motion.div>

                  {/* Impact Sparks */}
                  <div id="smash-impact-icon">
                    <span id="smash-symbol">💥</span>
                    <span id="smash-equation">
                      {topTwo[0] === topTwo[1]
                        ? `${topTwo[0]} == ${topTwo[1]} (Both Destroyed)`
                        : `${topTwo[0]} - ${topTwo[1]} = ${topTwo[0] - topTwo[1]}`}
                    </span>
                  </div>

                  {/* Right Stone */}
                  <motion.div
                    key={`stone-right-${topTwo[1]}`}
                    id="stone-box-second"
                    initial={{ x: 70, opacity: 0, scale: 0.8 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  >
                    <span id="stone-val-second">{topTwo[1]}</span>
                    <span id="stone-tag-second">Heavy #2</span>
                  </motion.div>
                </div>
              ) : isCompleted ? (
                <span id="arena-empty-text-done">
                  Simulation Finished — Last Stone Preserved
                </span>
              ) : (
                <span id="arena-empty-text">
                  Awaiting next 2 heaviest stones from heap...
                </span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Max Heap Queue Surface */}
        <div id="heap-track-card">
          <div id="heap-card-header">
            <span id="heap-header-title">2. Max-Heap Priority Queue (`maxHeap`)</span>
            <span id="heap-header-sub">Descending priority order</span>
          </div>

          <div id="heap-elements-track">
            <AnimatePresence mode="popLayout">
              {heap.length === 0 ? (
                <span id="heap-empty-text">Heap is empty (0 stones)</span>
              ) : (
                heap.map((weight, idx) => {
                  const isTop = idx === 0;
                  let boxId = `heap-box-node-${idx}`;
                  if (isCompleted && idx === 0) boxId = `heap-box-winner-${idx}`;
                  else if (isTop) boxId = `heap-box-top-${idx}`;

                  return (
                    <motion.div
                      key={`heap-item-${idx}-${weight}`}
                      id={`heap-col-${idx}`}
                      layout
                      initial={{ opacity: 0, scale: 0.6, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.5, y: -20 }}
                      transition={{ type: "spring", stiffness: 360, damping: 24 }}
                    >
                      <div id={boxId}>
                        {weight}
                      </div>
                      <span id={`heap-idx-tag-${idx}`}>[{idx}]</span>
                      {isTop && !isCompleted && (
                        <span id="heap-pointer-tag-top">TOP</span>
                      )}
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