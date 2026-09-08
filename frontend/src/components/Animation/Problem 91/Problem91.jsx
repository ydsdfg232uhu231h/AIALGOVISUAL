import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem91.css";

export default function Problem91({ stepData }) {
  const {
    s = "226",
    dp = [],
    currentIdx = 1,
    state = {},
    output
  } = stepData || {};

  const { one, two, totalWays, status } = state;
  const isComplete = status === "COMPLETED";
  const strChars = typeof s === "string" ? s.split("") : [];

  return (
    <div className="canvas-wrapper decode-canvas">
      {/* Metrics Row */}
      <div className="metrics-row">
        <span className="metric-chip str-chip">
          String (s): <b>"{s}"</b>
        </span>
        <span className="metric-chip idx-chip">
          Current Prefix: <b>s[0..{currentIdx - 1}]</b>
        </span>
        {one !== undefined && (
          <span className={`metric-chip ${one >= 1 ? "valid-chip" : "invalid-chip"}`}>
            1-Digit: <b>'{one}'</b> {one >= 1 ? "(+dp[i-1])" : "(invalid)"}
          </span>
        )}
        {two !== undefined && (
          <span className={`metric-chip ${two >= 10 && two <= 26 ? "valid-chip" : "invalid-chip"}`}>
            2-Digit: <b>'{two}'</b> {two >= 10 && two <= 26 ? "(+dp[i-2])" : "(invalid)"}
          </span>
        )}
        {totalWays !== undefined && (
          <span className="metric-chip ways-chip">
            Total Ways: <b>{totalWays}</b>
          </span>
        )}
      </div>

      {/* Synchronized String & DP Visualizer */}
      <div className="decode-track-container">
        {/* String Characters Row */}
        <div className="track-row">
          <div className="row-label">Digits (s):</div>
          <div className="cells-stream">
            {/* Empty base placeholder */}
            <div className="char-cell base-char">ε</div>
            {strChars.map((ch, idx) => {
              const strIdx = idx + 1;
              const isCurrent = strIdx === currentIdx;
              const isPrev = strIdx === currentIdx - 1;

              return (
                <div
                  key={`char-${idx}`}
                  className={`char-cell ${isCurrent ? "char-curr" : ""} ${isPrev ? "char-prev" : ""}`}
                >
                  <span className="char-val">{ch}</span>
                  <span className="char-idx">[{strIdx}]</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* DP Array Row */}
        <div className="track-row">
          <div className="row-label">dp[i]:</div>
          <div className="cells-stream">
            {dp.map((ways, idx) => {
              const isCurrent = idx === currentIdx;
              const isOneDep = currentIdx >= 1 && idx === currentIdx - 1;
              const isTwoDep = currentIdx >= 2 && idx === currentIdx - 2;
              const isTarget = isComplete && idx === dp.length - 1;

              return (
                <div key={`dp-col-${idx}`} className="dp-col">
                  {/* Dependency Badges */}
                  <div className="dp-ptr-slot">
                    {isTwoDep && <span className="dp-badge badge-two">i-2</span>}
                    {isOneDep && <span className="dp-badge badge-one">i-1</span>}
                    {isCurrent && !isComplete && <span className="dp-badge badge-curr">i</span>}
                  </div>

                  <motion.div
                    className={`dp-cell ${isCurrent ? "dp-cell-curr" : ""} ${
                      isTarget ? "dp-cell-target" : ""
                    } ${isOneDep ? "dp-cell-one" : ""} ${isTwoDep ? "dp-cell-two" : ""}`}
                    animate={{
                      scale: isTarget || isCurrent ? 1.08 : 1
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="dp-val">{ways}</span>
                    <span className="dp-sub">dp[{idx}]</span>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
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