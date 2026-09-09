import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem138.css";

export default function Problem138({ stepData }) {
  const {
    nodes = [],
    clonedNodes = [],
    pass = 1,
    state = {},
    output
  } = stepData || {};

  // Random pointer targets mapped by node index according to problem data
  const randomPointerMap = {
    1: "7",
    2: "1",
    3: "11",
    4: "7"
  };

  const renderChain = (nodeList, title, isCloned = false) => {
    const chainType = isCloned ? "clone" : "orig";

    return (
      <div id={`p138-list-row-${chainType}`}>
        <span id={`p138-list-title-${chainType}`}>{title}:</span>
        <div id={`p138-nodes-chain-${chainType}`}>
          {nodeList.map((val, idx) => {
            const randomTarget = randomPointerMap[idx];
            // Use state.curr to detect if the pointer is currently on this node
            const isCurrent = !isCloned && state.curr === val;
            const isLinkedRandom = isCloned && state.pass === 2;

            return (
              <React.Fragment key={`p138-chain-${chainType}-${idx}`}>
                <motion.div
                  id={`p138-node-container-${chainType}-${idx}`}
                  layout
                  initial={isCloned ? { scale: 0, opacity: 0 } : false}
                  animate={{ scale: isCurrent ? 1.1 : 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                >
                  {/* Active Traversal Pointer from state.curr */}
                  <AnimatePresence mode="popLayout">
                    {isCurrent && (
                      <motion.span
                        key="p138-active-ptr"
                        layoutId="p138-curr-pointer"
                        id={`p138-curr-pointer-badge-${idx}`}
                        initial={{ y: -8, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -8, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 450, damping: 26 }}
                      >
                        curr
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Random Pointer Tag */}
                  {randomTarget && (
                    <span
                      id={`p138-random-badge-${chainType}-${idx}`}
                      data-linked={isLinkedRandom ? "true" : "false"}
                    >
                      rnd ➔ [{randomTarget}]
                    </span>
                  )}

                  <div
                    id={`p138-node-${chainType}-${idx}`}
                    data-cloned={isCloned ? "true" : "false"}
                    data-current={isCurrent ? "true" : "false"}
                  >
                    <span id={`p138-node-val-${chainType}-${idx}`}>{val}</span>
                  </div>

                  <span id={`p138-node-idx-${chainType}-${idx}`}>[{idx}]</span>
                </motion.div>

                {idx < nodeList.length - 1 && (
                  <span id={`p138-arrow-sym-${chainType}-${idx}`}>→</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  const statusText = state.links
    ? state.links
    : state.clonedCount
    ? `Cloned ${state.clonedCount} nodes into map`
    : state.curr !== undefined
    ? `Visiting Node ${state.curr}`
    : "Cloning in progress";

  return (
    <div id="p138-random-ll-canvas">
      {/* Top Metrics Row */}
      <div id="p138-metrics-bar">
        <span id="p138-status-badge">
          Pass {state.pass ?? pass}: <b>{statusText}</b>
        </span>
      </div>

      {/* Main Lists Track */}
      <div id="p138-lists-track">
        {renderChain(nodes, "Original List", false)}

        <div id="p138-vertical-divider" />

        {clonedNodes.length === 0 ? (
          <div id="p138-placeholder-box">
            <span>Pass 1 executing: Cloned nodes will appear in hash map...</span>
          </div>
        ) : (
          renderChain(clonedNodes, "Cloned List", true)
        )}
      </div>

      {/* Output Banner */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p138-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div id="p138-callout-header-text">{output.label}</div>
            <div id="p138-callout-val-text">{output.value}</div>
            <div id="p138-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}