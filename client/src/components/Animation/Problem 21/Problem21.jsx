import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem21.css";

export default function Problem21({ stepData }) {
  const {
    l1 = [],
    l2 = [],
    merged = [],
    l1Idx = 0,
    l2Idx = 0,
    state = {},
    output
  } = stepData || {};

  const renderSourceList = (nodes, activeIdx, label, ptrName, colorClass) => (
    <div className="list-row">
      <span className="list-label">{label}:</span>
      <div className="nodes-chain">
        {nodes.map((val, idx) => {
          const isActive = idx === activeIdx;
          const isAttached = idx < activeIdx;

          return (
            <React.Fragment key={idx}>
              <motion.div
                className="node-wrapper"
                animate={{
                  scale: isActive ? 1.15 : 1,
                  opacity: isAttached ? 0.35 : 1
                }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              >
                {isActive && (
                  <span className={`ptr-badge ${colorClass}`}>{ptrName}</span>
                )}
                <div
                  className={`node-circle ${
                    isActive ? `active-${colorClass}` : ""
                  } ${isAttached ? "attached-node" : ""}`}
                >
                  {val}
                </div>
                <span className="node-idx">[{idx}]</span>
              </motion.div>
              {idx < nodes.length - 1 && (
                <span className={`arrow-sym ${isAttached ? "dimmed-arrow" : ""}`}>
                  →
                </span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="canvas-wrapper merge-canvas">
      {/* Action Indicator Bar */}
      {state.attached !== undefined && (
        <div className="status-banner">
          Attached node <b>{state.attached}</b> from <b>{state.from}</b>
        </div>
      )}

      {/* Input Lists */}
      <div className="source-lists">
        {renderSourceList(l1, l1Idx, "List 1", "l1", "l1-ptr")}
        {renderSourceList(l2, l2Idx, "List 2", "l2", "l2-ptr")}
      </div>

      <div className="separator-divider" />

      {/* Merged Target List */}
      <div className="merged-track">
        <span className="list-label merged-label">Merged:</span>
        <div className="nodes-chain">
          {merged.length === 0 ? (
            <span className="empty-hint">dummy (head)</span>
          ) : (
            merged.map((val, idx) => (
              <React.Fragment key={idx}>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="node-wrapper"
                >
                  <div className="node-circle merged-node">{val}</div>
                  <span className="node-idx">[{idx}]</span>
                </motion.div>
                {idx < merged.length - 1 && <span className="arrow-sym">→</span>}
              </React.Fragment>
            ))
          )}
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