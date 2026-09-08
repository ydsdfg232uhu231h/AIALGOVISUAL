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

  const { curMin = 1, curMax = 1, res = 0, n = null, status } = state;
  const isComplete = status === "COMPLETED";

  return (
    <div className="canvas-wrapper kadane-prod-canvas">
      {/* Metric State Banner */}
      <div className="metrics-row">
        {n !== null && (
          <span className="metric-chip current-chip">
            Current Num (n): <b>{n}</b>
          </span>
        )}
        <span className="metric-chip max-chip">
          curMax: <b>{curMax}</b>
        </span>
        <span className="metric-chip min-chip">
          curMin: <b>{curMin}</b>
        </span>
        <span className="metric-chip res-chip">
          Global Best (res): <b>{res}</b>
        </span>
      </div>

      {/* Number Array Track */}
      <div className="elements-track">
        {nums.map((val, idx) => {
          const isCurrent = idx === currentIndex;
          const isPast = idx < currentIndex;
          const isNegative = val < 0;

          return (
            <div key={idx} className="box-column">
              {/* Pointer Badge */}
              <div className="ptrs-group">
                {isCurrent && <span className="pointer-tag ptr-curr">n</span>}
              </div>

              {/* Number Box */}
              <motion.div
                className={`box-node ${isCurrent ? "node-curr" : ""} ${
                  isNegative ? "node-neg" : ""
                } ${isPast || isCurrent ? "node-active" : "node-idle"}`}
                animate={{
                  scale: isCurrent ? 1.12 : 1,
                  opacity: isPast || isCurrent ? 1 : 0.35,
                  borderColor: isCurrent
                    ? "#38bdf8"
                    : isNegative
                    ? "#f87171"
                    : "#27272a"
                }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                {val}
              </motion.div>

              <span className="idx-tag">[{idx}]</span>
            </div>
          );
        })}
      </div>

      {/* Formula Transition Callout */}
      {n !== null && (
        <div className="calc-banner">
          <span>
            Candidate products: <b>{n}</b>, <b>curMax × {n}</b>, <b>curMin × {n}</b>
          </span>
        </div>
      )}

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