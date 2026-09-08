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
    <div id="consecutive-canvas">
      {/* Top Metrics Row */}
      <div id="metrics-bar">
        <span id="metric-current-num">
          Inspecting: <b>{currentNum !== null ? currentNum : "None"}</b>
        </span>

        <span id="metric-check-status">
          {currentNum !== null ? (
            <>
              Has (num - 1 = {currentNum - 1})?{" "}
              <b>{numSet.includes(currentNum - 1) ? "YES (Skip)" : "NO (Sequence Start)"}</b>
            </>
          ) : (
            <b>Initializing Set</b>
          )}
        </span>

        <span id="metric-chain-len">
          Current Streak: <b>{currentChain.length}</b>
        </span>

        <span id={isCompleted ? "metric-best-done" : "metric-best-active"}>
          Max Longest: <b>{longest}</b>
        </span>
      </div>

      <div id="consecutive-stage">
        {/* Track 1: Hash Set Pool */}
        <div id="hashset-card">
          <div id="set-card-header">
            <span id="set-header-title">1. Hash Set Pool (`numSet`)</span>
            <span id="set-header-sub">O(1) lookups for (num - 1) and (num + length)</span>
          </div>

          <div id="hashset-pool-grid">
            {numSet.map((val) => {
              const isCurrent = currentNum === val;
              const isInActiveChain = currentChain.includes(val);
              const isInBest = isCompleted && bestChain.includes(val);

              let nodeId = `set-node-idle-${val}`;
              if (isInBest) {
                nodeId = `set-node-best-${val}`;
              } else if (isInActiveChain) {
                nodeId = `set-node-chain-${val}`;
              } else if (isCurrent) {
                nodeId = `set-node-active-${val}`;
              }

              return (
                <motion.div
                  key={`numset-cell-${val}`}
                  id={nodeId}
                  animate={{
                    scale: isInBest ? [1, 1.1, 1] : isCurrent || isInActiveChain ? 1.08 : 1
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 22,
                    scale: isInBest ? { repeat: Infinity, duration: 1.2 } : undefined
                  }}
                >
                  <span id={`set-val-${val}`}>{val}</span>
                  <span id={`set-tag-${val}`}>
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
        <div id="chain-card">
          <div id="chain-card-header">
            <span id="chain-header-title">2. Active Consecutive Sequence Builder</span>
            <span id="chain-header-sub">
              {currentChain.length > 0
                ? `Extending from start node: ${currentChain[0]}`
                : "Awaiting sequence start element"}
            </span>
          </div>

          <div id="chain-viewport">
            <AnimatePresence mode="popLayout">
              {currentChain.length === 0 ? (
                <span id="chain-empty-text">
                  {checkType === "SKIPPED"
                    ? `(num - 1 = ${currentNum - 1}) exists in set. Not a sequence root, skipping!`
                    : "No active streak being built"}
                </span>
              ) : (
                <div id="chain-nodes-row">
                  {currentChain.map((num, idx) => {
                    const isLastAdded = idx === currentChain.length - 1;
                    const isWinner = isCompleted;

                    return (
                      <React.Fragment key={`chain-elem-${num}`}>
                        <motion.div
                          id={isWinner ? `chain-node-winner-${num}` : `chain-node-${num}`}
                          initial={{ opacity: 0, scale: 0.6, y: 15 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.6 }}
                          transition={{ type: "spring", stiffness: 400, damping: 24 }}
                        >
                          <span id={`chain-val-${num}`}>{num}</span>
                          <span id={`chain-seq-idx-${num}`}>+{idx}</span>
                          {isWinner && <div id={`chain-halo-${num}`} />}
                        </motion.div>

                        {idx < currentChain.length - 1 && (
                          <motion.div
                            id={`chain-arrow-${num}`}
                            initial={{ opacity: 0, scaleX: 0 }}
                            animate={{ opacity: 1, scaleX: 1 }}
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