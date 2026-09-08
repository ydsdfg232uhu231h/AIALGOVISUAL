import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem424.css";

export default function Problem424({ stepData }) {
  const {
    chars = [],
    left = 0,
    right = 0,
    state = {},
    output,
    initialData
  } = stepData || {};

  const { maxF = 0, res = 0, window: windowStr, maxLen } = state;
  const windowLen = Math.max(0, right - left + 1);
  const replacementsNeeded = Math.max(0, windowLen - maxF);
  const k = stepData?.k ?? initialData?.k ?? 1;
  const isDanger = replacementsNeeded > k;
  const isCompleted = !!output || state.status === "COMPLETED";

  return (
    <div id="char-replace-canvas">
      {/* Metrics Row */}
      <div id="metrics-bar">
        <span id="status-pill-window-size">
          Window Size: <b>{windowLen}</b>
        </span>
        <span id="status-pill-max-f">
          Max Frequency (maxF): <b>{maxF}</b>
        </span>
        <span
          id={
            isDanger
              ? "status-pill-replacements-danger"
              : isCompleted
              ? "status-pill-replacements-done"
              : "status-pill-replacements-checking"
          }
        >
          Replacements Needed (len - maxF):{" "}
          <b>
            {replacementsNeeded} / {k}
          </b>
        </span>
        <span id="status-pill-best">
          Longest Valid: <b>{maxLen ?? res}</b>
        </span>
      </div>

      {/* Characters Track */}
      <div id="chars-ribbon-track">
        {chars.map((char, idx) => {
          const inWindow = idx >= left && idx <= right;
          const isLeft = idx === left;
          const isRight = idx === right;

          // State determination:
          // 1. Outside window -> "out"
          // 2. Completed final answer -> "complete" (Green)
          // 3. Invalid (needs > k replacements) -> "danger" (Red)
          // 4. In active window -> "checking" (Yellow)
          let boxState = "out";
          if (inWindow) {
            if (isCompleted) boxState = "complete";
            else if (isDanger) boxState = "danger";
            else boxState = "checking";
          }

          return (
            <div key={`char-col-${idx}`} id={`char-col-${idx}`}>
              {/* Pointer Badges */}
              <div id={`ptrs-track-${idx}`}>
                <AnimatePresence>
                  {isLeft && (
                    <motion.span
                      layoutId="ptr-left"
                      id={`ptr-badge-l-${idx}`}
                      initial={{ y: -8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -8, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      L
                    </motion.span>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {isRight && (
                    <motion.span
                      layoutId="ptr-right"
                      id={`ptr-badge-r-${idx}`}
                      initial={{ y: -8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -8, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      R
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Character Box */}
              <motion.div
                id={`char-box-${boxState}-${idx}`}
                animate={{
                  scale: inWindow ? 1.08 : 0.95,
                  opacity: inWindow ? 1 : 0.35
                }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
              >
                {char}
                {isCompleted && inWindow && (
                  <span id={`complete-tag-${idx}`}>BEST</span>
                )}
              </motion.div>

              <span id={`idx-tag-${idx}`}>[{idx}]</span>
            </div>
          );
        })}
      </div>

      {/* Substring Preview */}
      {windowStr && (
        <div
          id={
            isCompleted
              ? "window-preview-box-complete"
              : "window-preview-box-checking"
          }
        >
          {isCompleted ? "Optimal Result Substring: " : "Active Window Substring: "}
          <b>"{windowStr}"</b>
        </div>
      )}

      {/* Output Result Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
          >
            <div id="callout-header-text">{output.label}</div>
            <div id="callout-val-text">{output.value}</div>
            <div id="callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}