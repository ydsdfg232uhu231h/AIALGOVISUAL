import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem152.css";

export default function Problem152({ stepData }) {
  const {
    nums = [],
    currentIndex = -1,
    state = {},
    output
  } = stepData || {};

  const { curMin = 1, curMax = 1, res = 0, n = null } = state;

  return (
    <div id="p152-kadane-prod-canvas">
      {/* Metric State Banner */}
      <div id="p152-metrics-row">
        {n !== null && (
          <span id="p152-metric-current">
            Current Num (n): <b>{n}</b>
          </span>
        )}
        <span id="p152-metric-max">
          curMax: <b>{curMax}</b>
        </span>
        <span id="p152-metric-min">
          curMin: <b>{curMin}</b>
        </span>
        <span id="p152-metric-res">
          Global Best (res): <b>{res}</b>
        </span>
      </div>

      {/* Number Array Track */}
      <div id="p152-elements-track">
        {nums.map((val, idx) => {
          const isCurrent = idx === currentIndex;
          const isPast = idx < currentIndex;
          const isNegative = val < 0;

          let nodeState = "idle";
          if (isCurrent) nodeState = "curr";
          else if (isPast) nodeState = "active";

          return (
            <div key={`p152-num-${idx}`} id={`p152-box-column-${idx}`}>
              {/* Pointer Badge */}
              <div id={`p152-ptrs-group-${idx}`}>
                <AnimatePresence mode="popLayout">
                  {isCurrent && (
                    <motion.span
                      key="p152-ptr-n"
                      layoutId="p152-curr-pointer"
                      id={`p152-pointer-tag-${idx}`}
                      initial={{ y: -6, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -6, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 450, damping: 26 }}
                    >
                      n
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Number Box */}
              <motion.div
                id={`p152-box-node-${idx}`}
                data-node-state={nodeState}
                data-sign={isNegative ? "negative" : "positive"}
                layout
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                  opacity: isPast || isCurrent ? 1 : 0.35
                }}
                transition={{ type: "spring", stiffness: 350, damping: 24 }}
              >
                {val}
              </motion.div>

              <span id={`p152-idx-tag-${idx}`}>[{idx}]</span>
            </div>
          );
        })}
      </div>

      {/* Formula Transition Callout */}
      {n !== null && (
        <div id="p152-calc-banner">
          <span>
            Candidate products: <b>{n}</b>, <b>curMax × {n}</b>, <b>curMin × {n}</b>
          </span>
        </div>
      )}

      {/* Output Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p152-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div id="p152-callout-header-text">{output.label}</div>
            <div id="p152-callout-val-text">{output.value}</div>
            <div id="p152-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}