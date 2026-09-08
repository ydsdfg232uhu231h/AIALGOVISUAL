import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem155.css";

export default function Problem155({ stepData }) {
  const {
    stack = [], // Array of objects with unique IDs: [{ id: "s-0", val: -2 }, ...]
    minStack = [], // Array of objects with unique IDs: [{ id: "m-0", val: -2 }, ...]
    currentOp = "init",
    activeVal = null,
    currentMin = null,
    output
  } = stepData || {};

  return (
    <div className="canvas-wrapper minstack-canvas">
      {/* Top Metrics Row */}
      <div className="metrics-row">
        <span className={`metric-chip op-chip op-${currentOp}`}>
          Operation: <b>{currentOp.toUpperCase()}</b>
        </span>

        {activeVal !== null && (
          <span className="metric-chip val-chip">
            Value: <b>{activeVal}</b>
          </span>
        )}

        <span className="metric-chip min-chip">
          Current Min: <b>{currentMin !== null ? currentMin : "None"}</b>
        </span>

        <span className="metric-chip size-chip">
          Stack Size: <b>{stack.length}</b>
        </span>
      </div>

      {/* Main Dual Stack Stage */}
      <div className="minstack-stage">
        {/* Left Column: Primary Stack */}
        <div className="track-card stack-column-card">
          <div className="card-header-bar">
            <span>1. Primary Stack (`stack`)</span>
            <span className="card-sub">LIFO data storage</span>
          </div>

          <div className="stack-bucket-viewport">
            <div className="stack-bucket-rim" />
            <div className="stack-bucket-interior">
              <AnimatePresence initial={false}>
                {stack.map((item, idx) => {
                  const isTop = idx === stack.length - 1;

                  return (
                    <motion.div
                      key={item.id}
                      layoutId={item.id}
                      initial={{ opacity: 0, y: -40, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -40, scale: 0.7 }}
                      transition={{ type: "spring", stiffness: 350, damping: 24 }}
                      className={`stack-element-block ${isTop ? "element-top" : ""}`}
                    >
                      <span className="element-val">{item.val}</span>
                      <span className="element-idx">[{idx}]</span>
                      {isTop && <span className="pointer-tag tag-top">TOP</span>}
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {stack.length === 0 && (
                <span className="empty-stack-placeholder">Stack is empty</span>
              )}
            </div>
            <div className="stack-bucket-base" />
          </div>
        </div>

        {/* Right Column: Auxiliary Min Stack */}
        <div className="track-card minstack-column-card">
          <div className="card-header-bar">
            <span>2. Auxiliary Min Stack (`minStack`)</span>
            <span className="card-sub">Top element always holds min</span>
          </div>

          <div className="stack-bucket-viewport">
            <div className="stack-bucket-rim" />
            <div className="stack-bucket-interior">
              <AnimatePresence initial={false}>
                {minStack.map((item, idx) => {
                  const isTop = idx === minStack.length - 1;

                  return (
                    <motion.div
                      key={item.id}
                      layoutId={item.id}
                      initial={{ opacity: 0, y: -40, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -40, scale: 0.7 }}
                      transition={{ type: "spring", stiffness: 350, damping: 24 }}
                      className={`stack-element-block min-element-block ${
                        isTop ? "element-min-top" : ""
                      }`}
                    >
                      <span className="element-val">{item.val}</span>
                      <span className="element-idx">[{idx}]</span>
                      {isTop && <span className="pointer-tag tag-min">MIN</span>}
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {minStack.length === 0 && (
                <span className="empty-stack-placeholder">minStack is empty</span>
              )}
            </div>
            <div className="stack-bucket-base" />
          </div>
        </div>
      </div>

      {/* Result Callout */}
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