import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem128.css";

export default function Problem128({ stepData }) {
  const {
    numSet = [1, 2, 3, 4, 100, 200],
    currentNum = null,
    currentChain = [], // Numbers currently forming the active streak: e.g. [1, 2, 3, 4]
    bestChain = [], // Longest streak identified so far
    longest = 0,
    checkType = "IDLE", // "START_CHECK", "SKIPPED", "BUILDING", "COMPLETED"
    output
  } = stepData || {};

  const isCompleted = checkType === "COMPLETED";

  return (
    <div id="p128-consecutive-canvas">
      {/* Top Metrics Row */}
      <div id="p128-metrics-bar">
        <span id="p128-metric-current-num">
          Inspecting: <b>{currentNum !== null ? currentNum : "None"}</b>
        </span>

        <span id="p128-metric-check-status">
          {currentNum !== null ? (
            <>
              Has (num - 1 = {currentNum - 1})?{" "}
              <b>{numSet.includes(currentNum - 1) ? "YES (Skip)" : "NO (Sequence Start)"}</b>
            </>
          ) : (
            <b>Initializing Set</b>
          )}
        </span>

        <span id="p128-metric-chain-len">
          Current Streak: <b>{currentChain.length}</b>
        </span>

        <span
          id="p128-metric-best"
          data-status={isCompleted ? "done" : "active"}
        >
          Max Longest: <b>{longest}</b>
        </span>
      </div>

      <div id="p128-consecutive-stage">
        {/* Track 1: Hash Set Pool */}
        <div id="p128-hashset-card">
          <div id="p128-set-card-header">
            <span id="p128-set-header-title">1. Hash Set Pool (`numSet`)</span>
            <span id="p128-set-header-sub">O(1) lookups for (num - 1) and (num + length)</span>
          </div>

          <div id="p128-hashset-pool-grid">
            {numSet.map((val) => {
              const isCurrent = currentNum === val;
              const isInActiveChain = currentChain.includes(val);
              const isInBest = isCompleted && bestChain.includes(val);

              let nodeState = "idle";
              if (isInBest) {
                nodeState = "best";
              } else if (isInActiveChain) {
                nodeState = "chain";
              } else if (isCurrent) {
                nodeState = "active";
              }

              const targetScale = isInBest ? 1.08 : isCurrent || isInActiveChain ? 1.04 : 1;

              return (
                <motion.div
                  key={`p128-numset-cell-${val}`}
                  id={`p128-set-node-${val}`}
                  data-node-state={nodeState}
                  layout
                  animate={{ scale: targetScale }}
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 24
                  }}
                >
                  <span id={`p128-set-val-${val}`}>{val}</span>
                  <span id={`p128-set-tag-${val}`}>
                    {isInBest
                      ? "WINNER"
                      : isInActiveChain
                      ? "IN CHAIN"
                      : isCurrent
                      ? "CHECKING"
                      : "IN SET"}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Track 2: Consecutive Sequence Chain Builder */}
        <div id="p128-chain-card">
          <div id="p128-chain-card-header">
            <span id="p128-chain-header-title">2. Active Consecutive Sequence Builder</span>
            <span id="p128-chain-header-sub">
              {currentChain.length > 0
                ? `Extending from start node: ${currentChain[0]}`
                : "Awaiting sequence start element"}
            </span>
          </div>

          <div id="p128-chain-viewport">
            <AnimatePresence mode="popLayout">
              {currentChain.length === 0 ? (
                <span id="p128-chain-empty-text">
                  {checkType === "SKIPPED"
                    ? `(num - 1 = ${currentNum - 1}) exists in set. Not a sequence root, skipping!`
                    : "No active streak being built"}
                </span>
              ) : (
                <div id="p128-chain-nodes-row">
                  {currentChain.map((num, idx) => {
                    const isWinner = isCompleted;

                    return (
                      <React.Fragment key={`p128-chain-elem-${num}`}>
                        <motion.div
                          id={`p128-chain-node-${num}`}
                          data-winner={isWinner ? "true" : "false"}
                          layout
                          initial={{ opacity: 0, scale: 0.6, y: 15 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.6 }}
                          transition={{ type: "spring", stiffness: 400, damping: 24 }}
                        >
                          <span id={`p128-chain-val-${num}`}>{num}</span>
                          <span id={`p128-chain-seq-idx-${num}`}>+{idx}</span>
                          {isWinner && <div id={`p128-chain-halo-${num}`} />}
                        </motion.div>

                        {idx < currentChain.length - 1 && (
                          <motion.div
                            id={`p128-chain-arrow-${num}`}
                            layout
                            initial={{ opacity: 0, scaleX: 0 }}
                            animate={{ opacity: 1, scaleX: 1 }}
                            exit={{ opacity: 0, scaleX: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            ➔
                          </motion.div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Result Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p128-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div id="p128-callout-header-text">{output.label}</div>
            <div id="p128-callout-val-text">{output.value}</div>
            <div id="p128-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}