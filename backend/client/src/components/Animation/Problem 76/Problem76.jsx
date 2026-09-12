import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem76.css";

export default function Problem76({ stepData }) {
  const {
    s = [],
    left = 0,
    right = 0,
    windowCounts = {},
    state = {},
    output
  } = stepData || {};

  const { have = 0, need = 3, resLen = "INF", sub } = state;
  const targetChars = ["A", "B", "C"];
  const isValid = have === need;

  return (
    <div id="p76-min-window-canvas">
      {/* Metric Indicators */}
      <div id="p76-metrics-bar">
        <span
          id="p76-status-pill-match"
          data-valid={isValid ? "true" : "false"}
        >
          Match Status: <b>{have} / {need} targets</b>
        </span>
        <span id="p76-status-pill-min-len">
          Min Window Length: <b>{resLen}</b>
        </span>
        {sub && (
          <span id="p76-status-pill-best-sub">
            Current Best: <b>"{sub}"</b>
          </span>
        )}
      </div>

      {/* String Ribbon with L/R Pointers */}
      <div id="p76-string-ribbon-track">
        {s.map((char, idx) => {
          const inWindow = idx >= left && idx <= right;
          const isLeft = idx === left;
          const isRight = idx === right;
          const isTarget = targetChars.includes(char);

          return (
            <div key={`p76-cell-${idx}`} id={`p76-char-cell-${idx}`}>
              <div id={`p76-ptr-track-${idx}`}>
                <AnimatePresence mode="popLayout">
                  {isLeft && (
                    <motion.span
                      key={`p76-ptr-l-${idx}`}
                      id={`p76-ptr-badge-l-${idx}`}
                      layout
                      initial={{ y: -6, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -6, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 450, damping: 25 }}
                    >
                      L
                    </motion.span>
                  )}
                  {isRight && (
                    <motion.span
                      key={`p76-ptr-r-${idx}`}
                      id={`p76-ptr-badge-r-${idx}`}
                      layout
                      initial={{ y: -6, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -6, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 450, damping: 25 }}
                    >
                      R
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <motion.div
                id={`p76-char-tile-${idx}`}
                data-window={inWindow ? "in" : "out"}
                data-target={isTarget ? "true" : "false"}
                layout
                animate={{
                  scale: inWindow ? 1.05 : 0.95,
                  opacity: inWindow ? 1 : 0.35
                }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              >
                {char}
              </motion.div>

              <span id={`p76-idx-tag-${idx}`}>[{idx}]</span>
            </div>
          );
        })}
      </div>

      {/* Window Character Counts Inspector */}
      <div id="p76-counts-inspector-card">
        <span id="p76-inspector-title-label">Target Frequencies (t = "ABC"):</span>
        <div id="p76-counts-list-row">
          {targetChars.map((char) => {
            const count = windowCounts[char] || 0;
            const satisfied = count >= 1;

            return (
              <motion.div
                key={`p76-count-${char}`}
                id={`p76-count-chip-${char}`}
                data-satisfied={satisfied ? "true" : "false"}
                layout
                transition={{ duration: 0.2 }}
              >
                <span id={`p76-chip-char-${char}`}>{char}</span>
                <span id={`p76-chip-val-${char}`}>{count} / 1</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Output Result Card */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p76-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div id="p76-callout-header-text">{output.label}</div>
            <div id="p76-callout-val-text">{output.value}</div>
            <div id="p76-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}