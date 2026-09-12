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
    <div id="p215-heap-canvas">
      {/* Top Metrics Row */}
      <div id="p215-metrics-row">
        <span id="p215-metric-k">
          Capacity Limit: <b>k = {k}</b>
        </span>
        <span id="p215-metric-size">
          Heap Size: <b>{heap.length} / {k}</b>
        </span>
        {currentNum !== null && (
          <span id="p215-metric-current">
            Streaming: <b>{currentNum}</b>
          </span>
        )}
        {popped !== null && (
          <span id="p215-metric-pop">
            Popped Min: <b>{popped}</b>
          </span>
        )}
        {minVal !== null && (
          <span id="p215-metric-root">
            Min-Heap Root: <b>{minVal}</b>
          </span>
        )}
      </div>

      <div id="p215-heap-stage">
        {/* Track 1: Input Stream */}
        <div id="p215-stream-card">
          <div id="p215-stream-card-header">
            <span id="p215-stream-header-title">1. Input Stream: nums[]</span>
            <span id="p215-stream-header-sub">Push elements into Min-Heap</span>
          </div>

          <div id="p215-array-cells-grid">
            {nums.map((val, idx) => {
              const isActive = currentNum === val && !isCompleted;
              const isCurrentlyPopped = popped === val;
              const hasBeenDiscarded = discardedList.includes(val);

              let nodeState = "idle";
              if (isActive) nodeState = "active";
              else if (isCurrentlyPopped) nodeState = "popping";
              else if (hasBeenDiscarded) nodeState = "discarded";

              return (
                <div key={`p215-stream-${idx}-${val}`} id={`p215-cell-col-${idx}`}>
                  <div id={`p215-pointer-anchor-${idx}`}>
                    <AnimatePresence mode="popLayout">
                      {isActive && (
                        <motion.span
                          key="p215-stream-ptr"
                          layoutId="p215-stream-pointer"
                          id={`p215-pointer-pill-${idx}`}
                          initial={{ y: -6, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -6, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        >
                          push({val})
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  <motion.div
                    id={`p215-num-node-${idx}`}
                    data-node-state={nodeState}
                    layout
                    animate={{ scale: isActive ? 1.08 : 1 }}
                    transition={{ type: "spring", stiffness: 350, damping: 20 }}
                  >
                    <span id={`p215-num-val-${idx}`}>{val}</span>
                    {isCurrentlyPopped && <span id={`p215-pop-badge-${idx}`}>POP</span>}
                  </motion.div>

                  <span id={`p215-idx-tag-${idx}`}>[{idx}]</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Track 2: Active Min-Heap Chamber */}
        <div id="p215-heap-card">
          <div id="p215-heap-card-header">
            <span id="p215-heap-header-title">2. Active Min-Heap Buffer (Capacity k = {k})</span>
            <span id="p215-heap-header-sub">
              {isCompleted
                ? `Root contains the ${k}th largest element`
                : "Holds current k-largest values"}
            </span>
          </div>

          <div id="p215-heap-chamber">
            <AnimatePresence mode="popLayout">
              {heap.length === 0 ? (
                <motion.div
                  key="p215-empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  id="p215-empty-state-text"
                >
                  Heap is Empty
                </motion.div>
              ) : (
                heap.map((val, pos) => {
                  const isRoot = pos === 0;

                  return (
                    <motion.div
                      key={`p215-heap-node-${val}`}
                      id={`p215-heap-node-${val}`}
                      data-root={isRoot ? "true" : "false"}
                      layout
                      initial={{ scale: 0.7, opacity: 0, y: 12 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.5, opacity: 0, y: -20, rotate: -15 }}
                      transition={{ type: "spring", stiffness: 340, damping: 22 }}
                    >
                      <div id={`p215-heap-pos-tag-${pos}`}>
                        {isRoot ? "MIN ROOT" : `NODE #${pos}`}
                      </div>
                      <div id={`p215-heap-val-${val}`}>{val}</div>
                      {isRoot && isCompleted && (
                        <div id={`p215-kth-target-tag-${val}`}>{k}th LARGEST</div>
                      )}
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Track 3: Popped / Discarded Waste Bin */}
        <div id="p215-discard-card">
          <div id="p215-discard-card-header">
            <span id="p215-discard-header-title">3. Discarded Elements (Popped Minimums)</span>
            <span id="p215-discard-header-sub">Values too small to be in the top {k}</span>
          </div>

          <div id="p215-discard-chamber">
            <AnimatePresence mode="popLayout">
              {discardedList.length === 0 ? (
                <motion.div
                  key="p215-empty-discard"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  id="p215-empty-discard-text"
                >
                  No elements discarded yet (size ≤ {k})
                </motion.div>
              ) : (
                discardedList.map((val, idx) => (
                  <motion.div
                    key={`p215-discard-${val}-${idx}`}
                    id={`p215-discard-pill-${val}-${idx}`}
                    layout
                    initial={{ scale: 0.5, opacity: 0, x: -10 }}
                    animate={{ scale: 1, opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 320, damping: 20 }}
                  >
                    <span id={`p215-discard-x-${idx}`}>✕</span>
                    <span id={`p215-discard-val-${idx}`}>{val}</span>
                    <span id={`p215-discard-tag-${idx}`}>discarded</span>
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
            id="p215-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div id="p215-callout-header-text">{output.label}</div>
            <div id="p215-callout-val-text">{output.value}</div>
            <div id="p215-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}