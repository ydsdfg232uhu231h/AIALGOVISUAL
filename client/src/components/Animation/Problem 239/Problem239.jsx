import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem239.css";

export default function Problem239({ stepData }) {
  const {
    nums = [1, 3, -1, -3, 5, 3, 6, 7],
    left = 0,
    right = 0,
    deque = [],
    k = 3,
    state = {},
    output
  } = stepData || {};

  let outputList = [];
  try {
    if (state.output) {
      outputList = typeof state.output === "string" ? JSON.parse(state.output) : state.output;
    }
  } catch {
    outputList = [];
  }

  const windowActive = right >= k - 1;
  const maxIdx = deque.length > 0 ? deque[0] : null;

  // Grid spacing math: 8 columns with 7 gaps (gap = 8px)
  const totalCols = nums.length || 8;
  const gapPx = 8;
  const totalGapsPx = (totalCols - 1) * gapPx;
  const colWidthFormula = `(100% - ${totalGapsPx}px) / ${totalCols}`;

  const frameLeft = `calc(${left} * (${colWidthFormula}) + ${left * gapPx}px - 4px)`;
  const frameWidth = `calc(${right - left + 1} * (${colWidthFormula}) + ${(right - left) * gapPx}px + 8px)`;

  return (
    <div id="p239-deque-canvas">
      {/* Top Metrics Row */}
      <div id="p239-metrics-bar">
        <span id="p239-metric-k">
          Window Size: <b>k = {k}</b>
        </span>
        <span id="p239-metric-window">
          Window Bounds: <b>[{left} .. {right}]</b>
        </span>
        {maxIdx !== null && (
          <span id="p239-metric-max">
            Window Max: <b>nums[{maxIdx}] = {nums[maxIdx]}</b>
          </span>
        )}
      </div>

      <div id="p239-deque-stage">
        {/* Track Card with Dynamic Sliding Window Overlay */}
        <div id="p239-track-card-array">
          <div id="p239-card-header-array">
            <span id="p239-card-title-array">Array &amp; Sliding Window</span>
            <span id="p239-card-sub-array">
              {windowActive ? `Active Window [${left}..${right}]` : "Expanding initial window"}
            </span>
          </div>

          <div id="p239-array-track-container">
            {/* Sliding Window Highlight Frame (Overlaid on top of boxes) */}
            <motion.div
              id="p239-window-sliding-frame"
              initial={false}
              animate={{
                left: frameLeft,
                width: frameWidth
              }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
            >
              <div id="p239-window-frame-bar-top" />
              <div id="p239-window-frame-bar-bottom" />
              <div id="p239-window-bracket-lbl">
                WINDOW [{left}..{right}]
              </div>
            </motion.div>

            <div id="p239-cells-grid">
              {nums.map((val, idx) => {
                const inWindow = idx >= left && idx <= right;
                const isLeftEdge = idx === left;
                const isRightEdge = idx === right;
                const isMax = idx === maxIdx;

                let nodeState = "idle";
                if (isMax) nodeState = "max";
                else if (inWindow) nodeState = "inwindow";

                return (
                  <div key={`p239-cell-${idx}`} id={`p239-cell-col-${idx}`}>
                    {/* Top Pointer Anchors */}
                    <div id={`p239-pointer-anchor-${idx}`}>
                      <AnimatePresence mode="popLayout">
                        {isLeftEdge && isRightEdge ? (
                          <motion.span
                            key="both"
                            id={`p239-pointer-pill-both-${idx}`}
                            data-ptr-type="both"
                            initial={{ y: -6, opacity: 0, scale: 0.8 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: -6, opacity: 0, scale: 0.8 }}
                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                          >
                            L,R={idx}
                          </motion.span>
                        ) : (
                          <>
                            {isLeftEdge && (
                              <motion.span
                                key="l"
                                id={`p239-pointer-pill-l-${idx}`}
                                data-ptr-type="l"
                                initial={{ y: -6, opacity: 0, scale: 0.8 }}
                                animate={{ y: 0, opacity: 1, scale: 1 }}
                                exit={{ y: -6, opacity: 0, scale: 0.8 }}
                                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                              >
                                L={left}
                              </motion.span>
                            )}
                            {isRightEdge && (
                              <motion.span
                                key="r"
                                id={`p239-pointer-pill-r-${idx}`}
                                data-ptr-type="r"
                                initial={{ y: -6, opacity: 0, scale: 0.8 }}
                                animate={{ y: 0, opacity: 1, scale: 1 }}
                                exit={{ y: -6, opacity: 0, scale: 0.8 }}
                                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                              >
                                R={right}
                              </motion.span>
                            )}
                          </>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Number Node Box */}
                    <motion.div
                      id={`p239-num-node-${idx}`}
                      data-node-state={nodeState}
                      layout
                      animate={{
                        scale: isMax ? 1.08 : inWindow ? 1.02 : 1,
                        y: isMax ? -2 : 0
                      }}
                      transition={{ type: "spring", stiffness: 350, damping: 20 }}
                    >
                      <AnimatePresence mode="popLayout">
                        {isMax && (
                          <motion.span
                            key="p239-max-tag"
                            layoutId="p239-max-tag"
                            id={`p239-max-tag-pill-${idx}`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 24 }}
                          >
                            MAX
                          </motion.span>
                        )}
                      </AnimatePresence>
                      <span id={`p239-num-val-${idx}`}>{val}</span>
                    </motion.div>

                    <span id={`p239-idx-tag-${idx}`}>[{idx}]</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Monotonic Decreasing Deque */}
        <div id="p239-deque-card">
          <div id="p239-card-header-deque">
            <span id="p239-card-title-deque">Monotonic Decreasing Deque (Indices &amp; Values)</span>
            <span id="p239-card-sub-deque">Descending Order • Front always holds max</span>
          </div>

          <div id="p239-deque-stream">
            <AnimatePresence mode="popLayout">
              {deque.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  id="p239-empty-deque-text"
                >
                  Deque is Empty
                </motion.div>
              ) : (
                deque.map((idxVal, pos) => {
                  const isFront = pos === 0;

                  return (
                    <motion.div
                      key={`p239-deque-${idxVal}`}
                      id={`p239-deque-item-${idxVal}`}
                      data-is-front={isFront ? "true" : "false"}
                      layout
                      initial={{ scale: 0.7, opacity: 0, y: 12 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.7, opacity: 0, y: -12 }}
                      transition={{ type: "spring", stiffness: 340, damping: 22 }}
                    >
                      <div id={`p239-deque-pos-tag-${idxVal}`}>
                        {isFront ? "FRONT (MAX)" : `#${pos}`}
                      </div>
                      <div id={`p239-deque-value-${idxVal}`}>{nums[idxVal]}</div>
                      <div id={`p239-deque-idx-${idxVal}`}>idx: {idxVal}</div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Output Stream Card */}
        <div id="p239-output-stream-card">
          <div id="p239-card-header-output">
            <span id="p239-card-title-output">Max Output Array</span>
            <span id="p239-card-sub-output">Appended when R + 1 &gt;= k</span>
          </div>

          <div id="p239-output-stream-track">
            <AnimatePresence mode="popLayout">
              {outputList.length === 0 ? (
                <span id="p239-empty-stream-text">
                  Awaiting first window completion (r &gt;= {k - 1})...
                </span>
              ) : (
                outputList.map((val, idx) => (
                  <motion.div
                    key={`p239-out-${idx}`}
                    id={`p239-output-pill-${idx}`}
                    layout
                    initial={{ scale: 0.6, opacity: 0, y: 8 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 20 }}
                  >
                    <span id={`p239-out-val-${idx}`}>{val}</span>
                    <span id={`p239-out-sub-${idx}`}>w#{idx}</span>
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
            id="p239-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div id="p239-callout-header-text">{output.label}</div>
            <div id="p239-callout-val-text">{output.value}</div>
            <div id="p239-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}