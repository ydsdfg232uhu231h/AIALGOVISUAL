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
    <div id="p91-decode-canvas">
      {/* Metrics Row */}
      <div id="p91-metrics-row">
        <span id="p91-metric-chip-str">
          String (s): <b>"{s}"</b>
        </span>
        <span id="p91-metric-chip-idx">
          Current Prefix: <b>s[0..{currentIdx - 1}]</b>
        </span>
        {one !== undefined && (
          <span
            id="p91-metric-chip-one"
            data-validity={one >= 1 ? "valid" : "invalid"}
          >
            1-Digit: <b>'{one}'</b> {one >= 1 ? "(+dp[i-1])" : "(invalid)"}
          </span>
        )}
        {two !== undefined && (
          <span
            id="p91-metric-chip-two"
            data-validity={two >= 10 && two <= 26 ? "valid" : "invalid"}
          >
            2-Digit: <b>'{two}'</b> {two >= 10 && two <= 26 ? "(+dp[i-2])" : "(invalid)"}
          </span>
        )}
        {totalWays !== undefined && (
          <span id="p91-metric-chip-ways">
            Total Ways: <b>{totalWays}</b>
          </span>
        )}
      </div>

      {/* Synchronized String & DP Visualizer */}
      <div id="p91-decode-track-container">
        {/* String Characters Row */}
        <div id="p91-track-row-digits">
          <div id="p91-row-label-digits">Digits (s):</div>
          <div id="p91-cells-stream-digits">
            {/* Empty base placeholder */}
            <div id="p91-char-cell-base" data-state="base">ε</div>
            {strChars.map((ch, idx) => {
              const strIdx = idx + 1;
              const isCurrent = strIdx === currentIdx;
              const isPrev = strIdx === currentIdx - 1;

              let cellState = "idle";
              if (isCurrent) cellState = "curr";
              else if (isPrev) cellState = "prev";

              return (
                <div
                  key={`p91-char-${idx}`}
                  id={`p91-char-cell-${idx}`}
                  data-state={cellState}
                >
                  <span id={`p91-char-val-${idx}`}>{ch}</span>
                  <span id={`p91-char-idx-${idx}`}>[{strIdx}]</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* DP Array Row */}
        <div id="p91-track-row-dp">
          <div id="p91-row-label-dp">dp[i]:</div>
          <div id="p91-cells-stream-dp">
            {dp.map((ways, idx) => {
              const isCurrent = idx === currentIdx;
              const isOneDep = currentIdx >= 1 && idx === currentIdx - 1;
              const isTwoDep = currentIdx >= 2 && idx === currentIdx - 2;
              const isTarget = isComplete && idx === dp.length - 1;

              let cellState = "idle";
              if (isTarget) cellState = "target";
              else if (isCurrent) cellState = "curr";
              else if (isOneDep) cellState = "one";
              else if (isTwoDep) cellState = "two";

              return (
                <div key={`p91-dp-col-${idx}`} id={`p91-dp-col-${idx}`}>
                  {/* Dependency Badges */}
                  <div id={`p91-dp-ptr-slot-${idx}`}>
                    <AnimatePresence mode="popLayout">
                      {isTwoDep && (
                        <motion.span
                          key={`p91-ptr-two-${idx}`}
                          id={`p91-dp-badge-two-${idx}`}
                          data-ptr="two"
                          layout
                          initial={{ y: -6, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -6, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 450, damping: 25 }}
                        >
                          i-2
                        </motion.span>
                      )}
                      {isOneDep && (
                        <motion.span
                          key={`p91-ptr-one-${idx}`}
                          id={`p91-dp-badge-one-${idx}`}
                          data-ptr="one"
                          layout
                          initial={{ y: -6, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -6, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 450, damping: 25 }}
                        >
                          i-1
                        </motion.span>
                      )}
                      {isCurrent && !isComplete && (
                        <motion.span
                          key={`p91-ptr-curr-${idx}`}
                          id={`p91-dp-badge-curr-${idx}`}
                          data-ptr="curr"
                          layout
                          initial={{ y: -6, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -6, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 450, damping: 25 }}
                        >
                          i
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  <motion.div
                    id={`p91-dp-cell-${idx}`}
                    data-cell-state={cellState}
                    layout
                    animate={{
                      scale: isTarget || isCurrent ? 1.08 : 1
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <span id={`p91-dp-val-${idx}`}>{ways}</span>
                    <span id={`p91-dp-sub-${idx}`}>dp[{idx}]</span>
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
            id="p91-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div id="p91-callout-header-text">{output.label}</div>
            <div id="p91-callout-val-text">{output.value}</div>
            <div id="p91-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}