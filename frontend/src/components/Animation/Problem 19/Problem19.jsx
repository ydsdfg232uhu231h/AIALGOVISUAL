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
    <div id="p19-ll-canvas-wrapper">
      <div id="p19-nodes-chain-container">
        {nodes.map((val, idx) => {
          const isFast = idx === fastIdx;
          const isSlow = idx === slowIdx;
          const isDummy = val === 0 && idx === 0 && nodes.length > 5;
          const isDeleted = deletedIdx === val;

          let state = "idle";
          if (isDeleted) state = "deleted";
          else if (isSlow && isFast) state = "both";
          else if (isFast) state = "fast";
          else if (isSlow) state = "slow";

          const nodeType = isDummy ? "dummy" : "std";

          return (
            <React.Fragment key={`p19-frag-${idx}`}>
              <motion.div
                id={`p19-node-container-${idx}`}
                layout
                animate={{
                  scale: isFast || isSlow ? 1.12 : 1,
                  opacity: isDeleted ? 0.35 : 1
                }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              >
                {/* Pointer Badges */}
                <div id={`p19-pointers-row-${idx}`}>
                  <AnimatePresence mode="popLayout">
                    {isSlow && (
                      <motion.span
                        key={`p19-ptr-slow-${idx}`}
                        id={`p19-ptr-badge-slow-${idx}`}
                        layout
                        initial={{ y: -6, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -6, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 450, damping: 25 }}
                      >
                        slow
                      </motion.span>
                    )}
                    {isFast && (
                      <motion.span
                        key={`p19-ptr-fast-${idx}`}
                        id={`p19-ptr-badge-fast-${idx}`}
                        layout
                        initial={{ y: -6, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -6, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 450, damping: 25 }}
                      >
                        fast
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                <div
                  id={`p19-node-circle-${idx}`}
                  data-type={nodeType}
                  data-state={state}
                >
                  {isDummy ? "D" : val}
                </div>

                <span id={`p19-node-idx-${idx}`}>
                  {isDummy ? "dummy" : `node ${val}`}
                </span>
              </motion.div>

              {idx < nodes.length - 1 && (
                <span
                  id={`p19-arrow-sym-${idx}`}
                  data-dimmed={isDeleted ? "true" : "false"}
                >
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
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            id="p19-result-callout-box"
          >
            <div id="p19-callout-header-text">{output.label}</div>
            <div id="p19-callout-val-text">{output.value}</div>
            <div id="p19-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}