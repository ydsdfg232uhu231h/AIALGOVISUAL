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

  const normalizedOp = typeof currentOp === "string" ? currentOp.toLowerCase() : "init";

  return (
    <div id="p155-minstack-canvas">
      {/* Top Metrics Row */}
      <div id="p155-metrics-row">
        <span id="p155-metric-op" data-op={normalizedOp}>
          Operation: <b>{String(currentOp).toUpperCase()}</b>
        </span>

        {activeVal !== null && (
          <span id="p155-metric-val">
            Value: <b>{activeVal}</b>
          </span>
        )}

        <span id="p155-metric-min">
          Current Min: <b>{currentMin !== null ? currentMin : "None"}</b>
        </span>

        <span id="p155-metric-size">
          Stack Size: <b>{stack.length}</b>
        </span>
      </div>

      {/* Main Dual Stack Stage */}
      <div id="p155-minstack-stage">
        {/* Left Column: Primary Stack */}
        <div id="p155-primary-stack-card">
          <div id="p155-primary-card-header">
            <span id="p155-primary-header-title">1. Primary Stack (`stack`)</span>
            <span id="p155-primary-header-sub">LIFO data storage</span>
          </div>

          <div id="p155-primary-bucket-viewport">
            <div id="p155-primary-bucket-interior">
              <AnimatePresence initial={false} mode="popLayout">
                {stack.map((item, idx) => {
                  const isTop = idx === stack.length - 1;

                  return (
                    <motion.div
                      key={item.id}
                      id={`p155-stack-elem-${item.id}`}
                      data-is-top={isTop ? "true" : "false"}
                      data-is-min-stack="false"
                      layout
                      layoutId={item.id}
                      initial={{ opacity: 0, y: -40, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -40, scale: 0.7 }}
                      transition={{ type: "spring", stiffness: 350, damping: 24 }}
                    >
                      <span id={`p155-elem-val-${item.id}`}>{item.val}</span>
                      <span id={`p155-elem-idx-${item.id}`}>[{idx}]</span>
                      <AnimatePresence mode="popLayout">
                        {isTop && (
                          <motion.span
                            key="p155-top-badge"
                            layoutId="p155-ptr-top"
                            id={`p155-ptr-top-${item.id}`}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 450, damping: 26 }}
                          >
                            TOP
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {stack.length === 0 && (
                <span id="p155-empty-primary-placeholder">Stack is empty</span>
              )}
            </div>
            <div id="p155-primary-bucket-base" />
          </div>
        </div>

        {/* Right Column: Auxiliary Min Stack */}
        <div id="p155-aux-stack-card">
          <div id="p155-aux-card-header">
            <span id="p155-aux-header-title">2. Auxiliary Min Stack (`minStack`)</span>
            <span id="p155-aux-header-sub">Top element always holds min</span>
          </div>

          <div id="p155-aux-bucket-viewport">
            <div id="p155-aux-bucket-interior">
              <AnimatePresence initial={false} mode="popLayout">
                {minStack.map((item, idx) => {
                  const isTop = idx === minStack.length - 1;

                  return (
                    <motion.div
                      key={item.id}
                      id={`p155-minstack-elem-${item.id}`}
                      data-is-top={isTop ? "true" : "false"}
                      data-is-min-stack="true"
                      layout
                      layoutId={item.id}
                      initial={{ opacity: 0, y: -40, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -40, scale: 0.7 }}
                      transition={{ type: "spring", stiffness: 350, damping: 24 }}
                    >
                      <span id={`p155-min-val-${item.id}`}>{item.val}</span>
                      <span id={`p155-min-idx-${item.id}`}>[{idx}]</span>
                      <AnimatePresence mode="popLayout">
                        {isTop && (
                          <motion.span
                            key="p155-min-badge"
                            layoutId="p155-ptr-min"
                            id={`p155-ptr-min-${item.id}`}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 450, damping: 26 }}
                          >
                            MIN
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {minStack.length === 0 && (
                <span id="p155-empty-aux-placeholder">minStack is empty</span>
              )}
            </div>
            <div id="p155-aux-bucket-base" />
          </div>
        </div>
      </div>

      {/* Result Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p155-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div id="p155-callout-header-text">{output.label}</div>
            <div id="p155-callout-val-text">{output.value}</div>
            <div id="p155-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}