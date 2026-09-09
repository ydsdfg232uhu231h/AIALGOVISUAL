import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem206.css";

export default function Problem206({ stepData }) {
  const {
    nodes = [],
    reversedEdges = [],
    currIdx = -1,
    state = {},
    output
  } = stepData || {};

  const { prev = "NULL", curr = "NULL" } = state;

  return (
    <div id="p206-reverse-canvas">
      {/* State Inspector Badges */}
      <div id="p206-state-badge-row">
        <span id="p206-prev-chip">
          prev: <b>{String(prev)}</b>
        </span>
        <span id="p206-curr-chip">
          curr: <b>{String(curr)}</b>
        </span>
      </div>

      {/* Nodes Chain */}
      <div id="p206-nodes-chain">
        {nodes.map((val, idx) => {
          const isCurr = currIdx !== -1 && idx === currIdx;
          const isPrev = prev !== "NULL" && val === prev;
          const isReversed = reversedEdges.includes(idx);

          let nodeState = "idle";
          if (isCurr) nodeState = "curr";
          else if (isPrev) nodeState = "prev";

          return (
            <React.Fragment key={`p206-node-${val}-${idx}`}>
              <motion.div
                id={`p206-node-container-${idx}`}
                layout
                animate={{ scale: isCurr || isPrev ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              >
                {/* Pointer Tags */}
                <div id={`p206-pointers-row-${idx}`}>
                  <AnimatePresence mode="popLayout">
                    {isPrev && (
                      <motion.span
                        key="p206-ptr-prev"
                        layoutId="p206-ptr-prev"
                        id={`p206-ptr-badge-prev-${idx}`}
                        data-ptr="prev"
                        initial={{ y: -6, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -6, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 450, damping: 26 }}
                      >
                        prev
                      </motion.span>
                    )}
                    {isCurr && (
                      <motion.span
                        key="p206-ptr-curr"
                        layoutId="p206-ptr-curr"
                        id={`p206-ptr-badge-curr-${idx}`}
                        data-ptr="curr"
                        initial={{ y: -6, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -6, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 450, damping: 26 }}
                      >
                        curr
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                <div
                  id={`p206-node-circle-${idx}`}
                  data-node-state={nodeState}
                >
                  {val}
                </div>
                <span id={`p206-node-idx-${idx}`}>[{idx}]</span>
              </motion.div>

              {/* Edge Arrow: Flips to ← once recorded in reversedEdges */}
              {idx < nodes.length - 1 && (
                <span
                  id={`p206-arrow-sym-${idx}`}
                  data-reversed={isReversed ? "true" : "false"}
                >
                  {isReversed ? "←" : "→"}
                </span>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Output Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p206-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div id="p206-callout-header-text">{output.label}</div>
            <div id="p206-callout-val-text">{output.value}</div>
            <div id="p206-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}