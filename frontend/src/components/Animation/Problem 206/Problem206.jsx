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
    <div className="canvas-wrapper reverse-canvas">
      {/* State Inspector Badges */}
      <div className="state-badge-row">
        <span className="state-chip prev-chip">prev: <b>{String(prev)}</b></span>
        <span className="state-chip curr-chip">curr: <b>{String(curr)}</b></span>
      </div>

      {/* Nodes Chain */}
      <div className="nodes-chain">
        {nodes.map((val, idx) => {
          const isCurr = currIdx !== -1 && idx === currIdx;
          const isPrev = prev !== "NULL" && val === prev;

          return (
            <React.Fragment key={`${val}-${idx}`}>
              <motion.div
                layout
                className="node-container"
                animate={{ scale: isCurr || isPrev ? 1.15 : 1 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              >
                {/* Pointer Tags */}
                <div className="pointers-row">
                  {isPrev && <span className="ptr-badge prev-badge">prev</span>}
                  {isCurr && <span className="ptr-badge curr-badge">curr</span>}
                </div>

                <div
                  className={`node-circle ${isPrev ? "active-prev" : ""} ${
                    isCurr ? "active-curr" : ""
                  }`}
                >
                  {val}
                </div>
                <span className="node-idx">[{idx}]</span>
              </motion.div>

              {/* Edge Arrow: Flips to ← once recorded in reversedEdges */}
              {idx < nodes.length - 1 && (
                <span
                  className={`arrow-sym ${
                    reversedEdges.includes(idx) ? "reversed-arrow" : ""
                  }`}
                >
                  {reversedEdges.includes(idx) ? "←" : "→"}
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