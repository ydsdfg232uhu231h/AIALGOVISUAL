import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem19.css";

export default function Problem19({ stepData }) {
  const {
    nodes = [],
    fastIdx = 0,
    slowIdx = 0,
    deletedIdx = null,
    output
  } = stepData || {};

  return (
    <div id="ll-canvas-wrapper">
      <div id="nodes-chain-container">
        {nodes.map((val, idx) => {
          const isFast = idx === fastIdx;
          const isSlow = idx === slowIdx;
          const isDummy = val === 0 && idx === 0 && nodes.length > 5;
          const isDeleted = deletedIdx === val;

          // Encode state into a semantic ID for CSS targeting
          const type = isDummy ? "dummy" : "std";
          const state = isDeleted ? "deleted" : isSlow && isFast ? "both" : isFast ? "fast" : isSlow ? "slow" : "idle";
          const circleId = `node-circle-${type}-${state}-${idx}`;

          const arrowId = isDeleted ? `arrow-sym-dimmed-${idx}` : `arrow-sym-active-${idx}`;

          return (
            <React.Fragment key={idx}>
              <motion.div
                id={`node-container-${idx}`}
                animate={{
                  scale: isFast || isSlow ? 1.15 : 1,
                  opacity: isDeleted ? 0.35 : 1
                }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              >
                {/* Pointer Badges */}
                <div id={`pointers-row-${idx}`}>
                  {isSlow && <span id={`ptr-badge-slow-${idx}`}>slow</span>}
                  {isFast && <span id={`ptr-badge-fast-${idx}`}>fast</span>}
                </div>

                <div id={circleId}>
                  {isDummy ? "D" : val}
                </div>

                <span id={`node-idx-${idx}`}>{isDummy ? "dummy" : `node ${val}`}</span>
              </motion.div>

              {idx < nodes.length - 1 && (
                <span id={arrowId}>
                  →
                </span>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Result Output Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            id="result-callout-box"
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