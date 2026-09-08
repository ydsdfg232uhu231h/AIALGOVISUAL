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

  const renderChain = (nodeList, title, isCloned = false) => (
    <div className="list-row">
      <span className="list-title">{title}:</span>
      <div className="nodes-chain">
        {nodeList.map((val, idx) => {
          const randomTarget = randomPointerMap[idx];
          // Use state.curr to detect if the pointer is currently on this node
          const isCurrent = !isCloned && state.curr === val;

          return (
            <React.Fragment key={idx}>
              <motion.div
                className="node-container"
                initial={isCloned ? { scale: 0, opacity: 0 } : false}
                animate={{ scale: isCurrent ? 1.15 : 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              >
                {/* Active Traversal Pointer from state.curr */}
                {isCurrent && <span className="curr-pointer-badge">curr</span>}

                {/* Random Pointer Tag */}
                {randomTarget && (
                  <span
                    className={`random-badge ${
                      isCloned && state.pass === 2 ? "linked-random" : ""
                    }`}
                  >
                    rnd ➔ [{randomTarget}]
                  </span>
                )}

                <div
                  className={`node-circle ${
                    isCloned ? "cloned-node" : "orig-node"
                  } ${isCurrent ? "active-curr" : ""}`}
                >
                  {val}
                </div>
                <span className="node-idx">[{idx}]</span>
              </motion.div>

              {idx < nodeList.length - 1 && <span className="arrow-sym">→</span>}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="canvas-wrapper random-ll-canvas">
      {/* Dynamic Status Bar using state properties */}
      <div className="status-badge">
        <span>Pass {state.pass ?? pass}:</span>{" "}
        <b>
          {state.links
            ? state.links
            : state.clonedCount
            ? `Cloned ${state.clonedCount} nodes into map`
            : state.curr !== undefined
            ? `Visiting Node ${state.curr}`
            : "Cloning in progress"}
        </b>
      </div>

      {/* Main Lists Track */}
      <div className="lists-track">
        {renderChain(nodes, "Original List")}

        <div className="vertical-divider" />

        {clonedNodes.length === 0 ? (
          <div className="placeholder-box">
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
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="result-callout"
          >
            <div className="callout-header">{output.label}</div>
            <div className="callout-val">{output.value}</div>
            <div className="callout-detail">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}