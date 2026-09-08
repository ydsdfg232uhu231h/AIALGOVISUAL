import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem2.css";

export default function Problem2({ stepData }) {
  const {
    l1 = [],
    l2 = [],
    resultList = [],
    l1Idx = 0,
    l2Idx = 0,
    state = {},
    output
  } = stepData || {};

  const renderLinkedList = (nodes, activeIdx, label, ptrName) => (
    <div className="list-row">
      <span className="list-label">{label}:</span>
      <div className="nodes-chain">
        {nodes.map((val, idx) => {
          const isActive = idx === activeIdx;
          return (
            <React.Fragment key={idx}>
              <motion.div
                className="node-container"
                animate={{ scale: isActive ? 1.15 : 1 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              >
                <div className={`node-circle ${isActive ? "active-node" : ""}`}>
                  {val}
                </div>
                <span className="node-idx">[{idx}]</span>
                {isActive && <span className="ptr-pill">{ptrName}</span>}
              </motion.div>
              {idx < nodes.length - 1 && <span className="arrow-sym">→</span>}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="canvas-wrapper ll-canvas">
      {/* Carry Indicator */}
      <div className="carry-container">
        Carry: <span className="carry-value">{state.carry ?? 0}</span>
      </div>

      {/* Linked Lists Track */}
      <div className="lists-track">
        {renderLinkedList(l1, l1Idx, "List 1", "l1")}
        {renderLinkedList(l2, l2Idx, "List 2", "l2")}

        <div className="separator-line" />

        {/* Sum Result List */}
        <div className="list-row">
          <span className="list-label">Result:</span>
          <div className="nodes-chain">
            {resultList.length === 0 ? (
              <span className="empty-hint">Waiting for first sum...</span>
            ) : (
              resultList.map((val, idx) => (
                <React.Fragment key={idx}>
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="node-container"
                  >
                    <div className="node-circle result-node">{val}</div>
                    <span className="node-idx">[{idx}]</span>
                  </motion.div>
                  {idx < resultList.length - 1 && <span className="arrow-sym">→</span>}
                </React.Fragment>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Output Card */}
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