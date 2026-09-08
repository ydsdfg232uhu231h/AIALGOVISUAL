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

  return (
    <div id="deque-canvas">
      {/* Top Metrics Row */}
      <div id="metrics-bar">
        <span id="metric-k">
          Window Size: <b>k = {k}</b>
        </span>
        <span id="metric-window">
          Window Bounds: <b>[{left} .. {right}]</b>
        </span>
        {maxIdx !== null && (
          <span id="metric-max">
            Window Max: <b>nums[{maxIdx}] = {nums[maxIdx]}</b>
          </span>
        )}
      </div>

      <div id="deque-stage">
        {/* Track Card with Dynamic Sliding Window Overlay */}
        <div id="track-card-array">
          <div id="card-header-array">
            <span id="card-title-array">Array &amp; Sliding Window</span>
            <span id="card-sub-array">
              {windowActive ? `Active Window [${left}..${right}]` : "Expanding initial window"}
            </span>
          </div>

          <div id="array-track-container">
            {/* Sliding Glass Bracket calculated from L and R */}
            <motion.div
              id="window-sliding-frame"
              initial={false}
              animate={{
                left: `calc(${(left / nums.length) * 100}% + 2px)`,
                width: `calc(${((right - left + 1) / nums.length) * 100}% - 4px)`
              }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
            >
              <div id="window-frame-bar-top" />
              <div id="window-frame-bar-bottom" />
            </motion.div>

            <div id="cells-grid">
              {nums.map((val, idx) => {
                const inWindow = idx >= left && idx <= right;
                const isLeftEdge = idx === left;
                const isRightEdge = idx === right;
                const isMax = idx === maxIdx;

                let nodeState = "idle";
                if (isMax) nodeState = "max";
                else if (inWindow) nodeState = "inwindow";

                return (
                  <div key={`cell-${idx}`} id={`cell-col-${idx}`}>
                    {/* Top Pointer Anchors */}
                    <div id={`pointer-anchor-${idx}`}>
                      <AnimatePresence mode="popLayout">
                        {isLeftEdge && isRightEdge ? (
                          <motion.span
                            key="both"
                            initial={{ y: -6, opacity: 0, scale: 0.8 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: -6, opacity: 0, scale: 0.8 }}
                            id={`pointer-pill-both-${idx}`}
                          >
                            L,R={idx}
                          </motion.span>
                        ) : (
                          <>
                            {isLeftEdge && (
                              <motion.span
                                key="l"
                                initial={{ y: -6, opacity: 0, scale: 0.8 }}
                                animate={{ y: 0, opacity: 1, scale: 1 }}
                                exit={{ y: -6, opacity: 0, scale: 0.8 }}
                                id={`pointer-pill-l-${idx}`}
                              >
                                L={left}
                              </motion.span>
                            )}
                            {isRightEdge && (
                              <motion.span
                                key="r"
                                initial={{ y: -6, opacity: 0, scale: 0.8 }}
                                animate={{ y: 0, opacity: 1, scale: 1 }}
                                exit={{ y: -6, opacity: 0, scale: 0.8 }}
                                id={`pointer-pill-r-${idx}`}
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
                      id={`num-node-${nodeState}-${idx}`}
                      animate={{
                        scale: isMax ? 1.08 : inWindow ? 1.02 : 1,
                        y: isMax ? -2 : 0
                      }}
                      transition={{ type: "spring", stiffness: 350, damping: 20 }}
                    >
                      {isMax && (
                        <motion.span
                          layoutId="maxTag"
                          id={`max-tag-pill-${idx}`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          MAX
                        </motion.span>
                      )}
                      <span id={`num-val-${idx}`}>{val}</span>
                    </motion.div>

                    <span id={`idx-tag-${idx}`}>[{idx}]</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Monotonic Decreasing Deque */}
        <div id="deque-card">
          <div id="card-header-deque">
            <span id="card-title-deque">Monotonic Decreasing Deque (Indices &amp; Values)</span>
            <span id="card-sub-deque">Descending Order • Front always holds max</span>
          </div>

          <div id="deque-stream">
            <AnimatePresence mode="popLayout">
              {deque.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  id="empty-deque-text"
                >
                  Deque is Empty
                </motion.div>
              ) : (
                deque.map((idxVal, pos) => {
                  const isFront = pos === 0;

                  return (
                    <motion.div
                      key={`deque-${idxVal}`}
                      layout
                      initial={{ scale: 0.7, opacity: 0, y: 12 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.7, opacity: 0, y: -12 }}
                      transition={{ type: "spring", stiffness: 340, damping: 22 }}
                      id={isFront ? `deque-item-front-${idxVal}` : `deque-item-node-${idxVal}`}
                    >
                      <div id={`deque-pos-tag-${idxVal}`}>
                        {isFront ? "FRONT (MAX)" : `#${pos}`}
                      </div>
                      <div id={`deque-value-${idxVal}`}>{nums[idxVal]}</div>
                      <div id={`deque-idx-${idxVal}`}>idx: {idxVal}</div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Output Stream Card */}
        <div id="output-stream-card">
          <div id="card-header-output">
            <span id="card-title-output">Max Output Array</span>
            <span id="card-sub-output">Appended when R + 1 &gt;= k</span>
          </div>

          <div id="output-stream-track">
            <AnimatePresence mode="popLayout">
              {outputList.length === 0 ? (
                <span id="empty-stream-text">
                  Awaiting first window completion (r &gt;= {k - 1})...
                </span>
              ) : (
                outputList.map((val, idx) => (
                  <motion.div
                    key={`out-${idx}`}
                    layout
                    initial={{ scale: 0.6, opacity: 0, y: 8 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 20 }}
                    id={`output-pill-${idx}`}
                  >
                    <span id={`out-val-${idx}`}>{val}</span>
                    <span id={`out-sub-${idx}`}>w#{idx}</span>
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