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

  let statusState = "checking";
  if (isDanger) statusState = "danger";
  else if (isCompleted) statusState = "done";

  return (
    <div id="p424-char-replace-canvas">
      {/* Metrics Top Bar */}
      <div id="p424-metrics-bar">
        <span id="p424-status-pill-window-size">
          Window Size: <b>{windowLen}</b>
        </span>
        <span id="p424-status-pill-max-f">
          Max Frequency (maxF): <b>{maxF}</b>
        </span>
        <span
          id="p424-status-pill-replacements"
          data-status={statusState}
        >
          Replacements Needed (len - maxF):{" "}
          <b>
            {replacementsNeeded} / {k}
          </b>
        </span>
        <span id="p424-status-pill-best">
          Longest Valid: <b>{maxLen ?? res}</b>
        </span>
      </div>

      {/* Characters Track */}
      <div id="p424-chars-ribbon-track">
        {chars.map((char, idx) => {
          const inWindow = idx >= left && idx <= right;
          const isLeft = idx === left;
          const isRight = idx === right;

          let boxState = "out";
          if (inWindow) {
            if (isCompleted) boxState = "complete";
            else if (isDanger) boxState = "danger";
            else boxState = "checking";
          }

          return (
            <div key={`p424-char-col-${idx}`} id={`p424-char-col-${idx}`}>
              {/* Pointer Badges */}
              <div id={`p424-ptrs-track-${idx}`}>
                <AnimatePresence mode="popLayout">
                  {isLeft && (
                    <motion.span
                      key="p424-ptr-l"
                      layoutId="p424-ptr-l"
                      id={`p424-ptr-badge-l-${idx}`}
                      initial={{ y: -8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -8, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 450, damping: 26 }}
                    >
                      L
                    </motion.span>
                  )}
                  {isRight && (
                    <motion.span
                      key="p424-ptr-r"
                      layoutId="p424-ptr-r"
                      id={`p424-ptr-badge-r-${idx}`}
                      initial={{ y: -8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -8, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 450, damping: 26 }}
                    >
                      R
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Character Box */}
              <motion.div
                id={`p424-char-box-${idx}`}
                data-box-state={boxState}
                layout
                animate={{
                  scale: inWindow ? 1.08 : 0.95,
                  opacity: inWindow ? 1 : 0.35
                }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
              >
                {char}
                {isCompleted && inWindow && (
                  <span id={`p424-complete-tag-${idx}`}>BEST</span>
                )}
              </motion.div>

              <span id={`p424-idx-tag-${idx}`}>[{idx}]</span>
            </div>
          );
        })}
      </div>

      {/* Substring Preview */}
      {windowStr && (
        <div
          id="p424-window-preview-box"
          data-preview-state={isCompleted ? "complete" : "checking"}
        >
          {isCompleted ? "Optimal Result Substring: " : "Active Window Substring: "}
          <b>"{windowStr}"</b>
        </div>
      )}

      {/* Output Result Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p424-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div id="p424-callout-header-text">{output.label}</div>
            <div id="p424-callout-val-text">{output.value}</div>
            <div id="p424-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}