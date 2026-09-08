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
    <div id="reorder-list-canvas">
      {/* Top Metrics Row */}
      <div id="metrics-bar">
        <span id="metric-phase">
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
          <span id="metric-pointers-mid">
            Pointers: <b>slow={firstList[slowIdx]}</b> | <b>fast={firstList[fastIdx] ?? "NULL"}</b>
          </span>
        )}

        <span id={isCompleted ? "metric-status-done" : "metric-status-active"}>
          Status: <b>{isCompleted ? "COMPLETED" : "IN PROGRESS"}</b>
        </span>
      </div>

      <div id="reorder-stage">
        {/* Track 1: First Half / Active Source List */}
        {firstList.length > 0 && (
          <div id="first-track-card">
            <div id="first-card-header">
              <span id="first-header-title">
                {secondList.length > 0 ? "First Half (L0)" : "Initial List Track"}
              </span>
              <span id="first-header-sub">Original forward chain</span>
            </div>

            <div id="first-viewport">
              <div id="first-chain">
                {firstList.map((val, idx) => {
                  const isSlow = idx === slowIdx;
                  const isFast = idx === fastIdx;
                  const isPtr = idx === firstPtrIdx;

                  let nodeId = `first-node-idle-${idx}`;
                  if (isSlow) nodeId = `first-node-slow-${idx}`;
                  else if (isFast) nodeId = `first-node-fast-${idx}`;
                  else if (isPtr) nodeId = `first-node-ptr-${idx}`;

                  return (
                    <React.Fragment key={`first-node-${idx}-${val}`}>
                      <div id={`first-col-${idx}`}>
                        <div id={`tag-anchor-${idx}`}>
                          {isSlow && <span id="tag-slow">SLOW</span>}
                          {isFast && <span id="tag-fast">FAST</span>}
                          {isPtr && <span id="tag-first-ptr">FIRST</span>}
                        </div>

                        <motion.div
                          id={nodeId}
                          animate={{ scale: isSlow || isFast || isPtr ? 1.12 : 1 }}
                          transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        >
                          {val}
                        </motion.div>
                      </div>

                      {idx < firstList.length - 1 && (
                        <span id={`first-arrow-${idx}`}>&rarr;</span>
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
          <div id="second-track-card">
            <div id="second-card-header">
              <span id="second-header-title">
                {phase.includes("REVERS") ? "Reversing Second Half" : "Second Half (L1)"}
              </span>
              <span id="second-header-sub">
                {phase === "REVERSED" ? "Reversed and ready for merge" : "Bypassed list"}
              </span>
            </div>

            <div id="second-viewport">
              <div id="second-chain">
                {secondList.map((val, idx) => {
                  const isPtr = idx === secondPtrIdx;

                  return (
                    <React.Fragment key={`second-node-${idx}-${val}`}>
                      <div id={`second-col-${idx}`}>
                        <div id={`second-tag-anchor-${idx}`}>
                          {isPtr && <span id="tag-second-ptr">SECOND</span>}
                        </div>

                        <motion.div
                          id={isPtr ? `second-node-ptr-${idx}` : `second-node-idle-${idx}`}
                          animate={{ scale: isPtr ? 1.12 : 1 }}
                          transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        >
                          {val}
                        </motion.div>
                      </div>

                      {idx < secondList.length - 1 && (
                        <span id={`second-arrow-${idx}`}>&rarr;</span>
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
          <div id="merged-track-card">
            <div id="merged-card-header">
              <span id="merged-header-title">Interleaved Reordered List</span>
              <span id="merged-header-sub">Alternate merge: First &harr; Second</span>
            </div>

            <div id="merged-viewport">
              <div id="merged-chain">
                {mergedList.map((val, idx) => {
                  const isLatest = idx === mergedList.length - 1 && !isCompleted;

                  return (
                    <React.Fragment key={`merged-node-${idx}-${val}`}>
                      <motion.div
                        id={
                          isCompleted
                            ? `merged-node-done-${idx}`
                            : isLatest
                            ? `merged-node-latest-${idx}`
                            : `merged-node-idle-${idx}`
                        }
                        layout
                        initial={{ scale: 0.6, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 350, damping: 22 }}
                      >
                        {val}
                      </motion.div>

                      {idx < mergedList.length - 1 && (
                        <span id={`merged-arrow-${idx}`}>&rarr;</span>
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