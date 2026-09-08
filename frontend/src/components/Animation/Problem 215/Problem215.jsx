import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem215.css";

export default function Problem215({ stepData }) {
  const {
    nums = [3, 2, 1, 5, 6, 4],
    k = 2,
    heap = [],
    currentNum = null,
    popped = null,
    discarded = [], // Array of all values popped so far
    state = {},
    output
  } = stepData || {};

  const minVal = heap.length > 0 ? heap[0] : null;
  const isCompleted = state.status === "COMPLETED";

  // Derive all discarded elements up to current step
  const discardedList = discarded || (state.popped ? [state.popped] : []);

  return (
    <div className="canvas-wrapper heap-canvas">
      {/* Top Metrics Row */}
      <div className="metrics-row">
        <span className="metric-chip k-chip">
          Capacity Limit: <b>k = {k}</b>
        </span>
        <span className="metric-chip heap-size-chip">
          Heap Size: <b>{heap.length} / {k}</b>
        </span>
        {currentNum !== null && (
          <span className="metric-chip current-chip">
            Streaming: <b>{currentNum}</b>
          </span>
        )}
        {popped !== null && (
          <span className="metric-chip pop-chip">
            Popped Min: <b>{popped}</b>
          </span>
        )}
        {minVal !== null && (
          <span className="metric-chip root-chip">
            Min-Heap Root: <b>{minVal}</b>
          </span>
        )}
      </div>

      <div className="heap-stage">
        {/* Track 1: Input Stream */}
        <div className="track-card">
          <div className="card-header-bar">
            <span>1. Input Stream: nums[]</span>
            <span className="card-sub">Push elements into Min-Heap</span>
          </div>

          <div className="array-cells-grid">
            {nums.map((val, idx) => {
              const isActive = currentNum === val && !isCompleted;
              const isCurrentlyPopped = popped === val;
              const hasBeenDiscarded = discardedList.includes(val);

              return (
                <div key={`stream-${idx}-${val}`} className="cell-col">
                  <div className="pointer-anchor">
                    {isActive && (
                      <motion.span
                        layoutId="streamPointer"
                        className="pointer-pill"
                        initial={{ y: -6, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      >
                        push({val})
                      </motion.span>
                    )}
                  </div>

                  <motion.div
                    className={`num-node ${isActive ? "node-active" : ""} ${
                      isCurrentlyPopped ? "node-popping" : hasBeenDiscarded ? "node-discarded" : ""
                    }`}
                    animate={{ scale: isActive ? 1.08 : 1 }}
                    transition={{ type: "spring", stiffness: 350, damping: 20 }}
                  >
                    <span className="num-val">{val}</span>
                    {isCurrentlyPopped && <span className="pop-badge">POP</span>}
                  </motion.div>

                  <span className="idx-tag">[{idx}]</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Track 2: Active Min-Heap Chamber */}
        <div className="track-card heap-card">
          <div className="card-header-bar">
            <span>2. Active Min-Heap Buffer (Capacity k = {k})</span>
            <span className="card-sub">
              {isCompleted
                ? `Root contains the ${k}th largest element`
                : "Holds current k-largest values"}
            </span>
          </div>

          <div className="heap-chamber">
            <AnimatePresence mode="popLayout">
              {heap.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="empty-state-text"
                >
                  Heap is Empty
                </motion.div>
              ) : (
                heap.map((val, pos) => {
                  const isRoot = pos === 0;

                  return (
                    <motion.div
                      key={`heap-node-${val}`}
                      layout
                      initial={{ scale: 0.7, opacity: 0, y: 12 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.5, opacity: 0, y: -20, rotate: -15 }}
                      transition={{ type: "spring", stiffness: 340, damping: 22 }}
                      className={`heap-node-pill ${isRoot ? "heap-root" : ""}`}
                    >
                      <div className="heap-pos-tag">
                        {isRoot ? "MIN ROOT" : `NODE #${pos}`}
                      </div>
                      <div className="heap-val">{val}</div>
                      {isRoot && isCompleted && (
                        <div className="kth-target-tag">{k}th LARGEST</div>
                      )}
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Track 3: Popped / Discarded Waste Bin */}
        <div className="track-card discard-card">
          <div className="card-header-bar">
            <span>3. Discarded Elements (Popped Minimums)</span>
            <span className="card-sub">Values too small to be in the top {k}</span>
          </div>

          <div className="discard-chamber">
            <AnimatePresence mode="popLayout">
              {discardedList.length === 0 ? (
                <motion.div
                  key="empty-discard"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="empty-state-text text-dim"
                >
                  No elements discarded yet (size ≤ {k})
                </motion.div>
              ) : (
                discardedList.map((val, idx) => (
                  <motion.div
                    key={`discard-${val}-${idx}`}
                    layout
                    initial={{ scale: 0.5, opacity: 0, x: -10 }}
                    animate={{ scale: 1, opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 320, damping: 20 }}
                    className="discard-pill"
                  >
                    <span className="discard-x">✕</span>
                    <span className="discard-val">{val}</span>
                    <span className="discard-tag">discarded</span>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Result Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="result-callout"
          >
            <div className="callout-header">{output.label}</div>
            <div className="callout-val">{output.value}</div>
            <div className="callout-detail">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}