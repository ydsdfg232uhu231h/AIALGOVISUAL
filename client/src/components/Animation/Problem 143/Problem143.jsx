import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem143.css";

export default function Problem143({ stepData }) {
  const {
    firstList = [1, 2, 3, 4, 5],
    secondList = [],
    mergedList = [],
    slowIdx = null,
    fastIdx = null,
    firstPtrIdx = null,
    secondPtrIdx = null,
    state = {},
    output
  } = stepData || {};

  const { phase = "FIND_MID" } = state;
  const isCompleted = state.status === "COMPLETED" || !!output;

  return (
    <div id="p143-reorder-list-canvas">
      {/* Top Metrics Row */}
      <div id="p143-metrics-bar">
        <span id="p143-metric-phase">
          Phase:{" "}
          <b>
            {phase === "FIND_MID" && "1. Find Middle (Fast / Slow)"}
            {phase === "MID_FOUND" && "1. Middle Located"}
            {phase === "SPLIT" && "2. Split into Two Halves"}
            {phase === "REVERSING" && "3. Reverse Second Half"}
            {phase === "REVERSED" && "3. Second Half Reversed"}
            {phase === "START_MERGE" && "4. Begin Alternating Merge"}
            {phase === "MERGING" && "4. Interleaving Nodes"}
            {isCompleted && "REORDER COMPLETE ✓"}
          </b>
        </span>

        {slowIdx !== null && (
          <span id="p143-metric-pointers-mid">
            Pointers: <b>slow={firstList[slowIdx]}</b> | <b>fast={firstList[fastIdx] ?? "NULL"}</b>
          </span>
        )}

        <span
          id="p143-metric-status"
          data-status={isCompleted ? "done" : "active"}
        >
          Status: <b>{isCompleted ? "COMPLETED" : "IN PROGRESS"}</b>
        </span>
      </div>

      <div id="p143-reorder-stage">
        {/* Track 1: First Half / Active Source List */}
        {firstList.length > 0 && (
          <div id="p143-first-track-card">
            <div id="p143-first-card-header">
              <span id="p143-first-header-title">
                {secondList.length > 0 ? "First Half (L0)" : "Initial List Track"}
              </span>
              <span id="p143-first-header-sub">Original forward chain</span>
            </div>

            <div id="p143-first-viewport">
              <div id="p143-first-chain">
                {firstList.map((val, idx) => {
                  const isSlow = idx === slowIdx;
                  const isFast = idx === fastIdx;
                  const isPtr = idx === firstPtrIdx;

                  let nodeState = "idle";
                  if (isSlow) nodeState = "slow";
                  else if (isFast) nodeState = "fast";
                  else if (isPtr) nodeState = "ptr";

                  return (
                    <React.Fragment key={`p143-first-node-${idx}-${val}`}>
                      <div id={`p143-first-col-${idx}`}>
                        <div id={`p143-tag-anchor-${idx}`}>
                          <AnimatePresence mode="popLayout">
                            {isSlow && (
                              <motion.span
                                key="p143-slow-ptr"
                                layoutId="p143-slow-pointer"
                                id={`p143-tag-slow-${idx}`}
                                data-ptr="slow"
                                initial={{ y: -6, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -6, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 450, damping: 26 }}
                              >
                                SLOW
                              </motion.span>
                            )}
                            {isFast && (
                              <motion.span
                                key="p143-fast-ptr"
                                layoutId="p143-fast-pointer"
                                id={`p143-tag-fast-${idx}`}
                                data-ptr="fast"
                                initial={{ y: -6, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -6, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 450, damping: 26 }}
                              >
                                FAST
                              </motion.span>
                            )}
                            {isPtr && (
                              <motion.span
                                key="p143-first-ptr"
                                layoutId="p143-first-pointer"
                                id={`p143-tag-first-ptr-${idx}`}
                                data-ptr="first"
                                initial={{ y: -6, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -6, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 450, damping: 26 }}
                              >
                                FIRST
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </div>

                        <motion.div
                          id={`p143-first-node-${idx}`}
                          data-node-state={nodeState}
                          layout
                          animate={{ scale: isSlow || isFast || isPtr ? 1.12 : 1 }}
                          transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        >
                          {val}
                        </motion.div>
                      </div>

                      {idx < firstList.length - 1 && (
                        <span id={`p143-first-arrow-${idx}`}>&rarr;</span>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Track 2: Second Half (Splitting & Reversing) */}
        {secondList.length > 0 && (
          <div id="p143-second-track-card">
            <div id="p143-second-card-header">
              <span id="p143-second-header-title">
                {phase.includes("REVERS") ? "Reversing Second Half" : "Second Half (L1)"}
              </span>
              <span id="p143-second-header-sub">
                {phase === "REVERSED" ? "Reversed and ready for merge" : "Bypassed list"}
              </span>
            </div>

            <div id="p143-second-viewport">
              <div id="p143-second-chain">
                {secondList.map((val, idx) => {
                  const isPtr = idx === secondPtrIdx;

                  return (
                    <React.Fragment key={`p143-second-node-${idx}-${val}`}>
                      <div id={`p143-second-col-${idx}`}>
                        <div id={`p143-second-tag-anchor-${idx}`}>
                          <AnimatePresence mode="popLayout">
                            {isPtr && (
                              <motion.span
                                key="p143-second-ptr"
                                layoutId="p143-second-pointer"
                                id={`p143-tag-second-ptr-${idx}`}
                                data-ptr="second"
                                initial={{ y: -6, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -6, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 450, damping: 26 }}
                              >
                                SECOND
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </div>

                        <motion.div
                          id={`p143-second-node-${idx}`}
                          data-node-state={isPtr ? "ptr" : "idle"}
                          layout
                          animate={{ scale: isPtr ? 1.12 : 1 }}
                          transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        >
                          {val}
                        </motion.div>
                      </div>

                      {idx < secondList.length - 1 && (
                        <span id={`p143-second-arrow-${idx}`}>&rarr;</span>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Track 3: Interleaved Result Chain */}
        {mergedList.length > 0 && (
          <div id="p143-merged-track-card">
            <div id="p143-merged-card-header">
              <span id="p143-merged-header-title">Interleaved Reordered List</span>
              <span id="p143-merged-header-sub">Alternate merge: First &harr; Second</span>
            </div>

            <div id="p143-merged-viewport">
              <div id="p143-merged-chain">
                {mergedList.map((val, idx) => {
                  const isLatest = idx === mergedList.length - 1 && !isCompleted;

                  let nodeState = "idle";
                  if (isCompleted) nodeState = "done";
                  else if (isLatest) nodeState = "latest";

                  return (
                    <React.Fragment key={`p143-merged-node-${idx}-${val}`}>
                      <motion.div
                        id={`p143-merged-node-${idx}`}
                        data-node-state={nodeState}
                        layout
                        initial={{ scale: 0.6, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 350, damping: 22 }}
                      >
                        {val}
                      </motion.div>

                      {idx < mergedList.length - 1 && (
                        <span id={`p143-merged-arrow-${idx}`}>&rarr;</span>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Result Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p143-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div id="p143-callout-header-text">{output.label}</div>
            <div id="p143-callout-val-text">{output.value}</div>
            <div id="p143-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}