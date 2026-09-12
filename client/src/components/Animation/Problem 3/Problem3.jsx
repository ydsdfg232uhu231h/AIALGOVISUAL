import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem3.css";

export default function Problem3({ stepData }) {
  const {
    string = [],
    left = 0,
    right = 0,
    state = {},
    output
  } = stepData || {};

  const { charSet = "{}", maxLength = 0, duplicate } = state;
  const windowLen = Math.max(0, right - left + 1);

  return (
    <div id="p3-window-canvas-wrapper">
      {/* Metrics Row */}
      <div id="p3-metrics-bar">
        <span id="p3-metric-window-len">
          Current Window Length: <b>{windowLen}</b>
        </span>
        <span id="p3-metric-max-len">
          Max Length: <b>{maxLength}</b>
        </span>
        {duplicate && (
          <span id="p3-metric-duplicate-alert">
            Duplicate Detected: <b>'{duplicate}'</b>
          </span>
        )}
      </div>

      {/* Characters Ribbon with Sliding Window */}
      <div id="p3-string-track-container">
        {string.map((char, idx) => {
          const inWindow = idx >= left && idx <= right;
          const isLeft = idx === left;
          const isRight = idx === right;
          const windowState = inWindow ? "in" : "out";

          return (
            <div key={`p3-char-col-${idx}`} id={`p3-char-column-${idx}`}>
              {/* Pointer Indicators */}
              <div id={`p3-ptrs-track-${idx}`}>
                <AnimatePresence mode="popLayout">
                  {isLeft && (
                    <motion.span
                      key={`p3-ptr-l-${idx}`}
                      id={`p3-ptr-pill-l-${idx}`}
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
                      key={`p3-ptr-r-${idx}`}
                      id={`p3-ptr-pill-r-${idx}`}
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

              {/* Character Tile with Static Scoped ID and State Attribute */}
              <motion.div
                id={`p3-char-tile-${idx}`}
                data-state={windowState}
                layout
                animate={{
                  scale: inWindow ? 1.08 : 0.95,
                  opacity: inWindow ? 1 : 0.35
                }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              >
                {char}
              </motion.div>

              <span id={`p3-idx-tag-${idx}`}>[{idx}]</span>
            </div>
          );
        })}
      </div>

      {/* Set Inspector */}
      <div id="p3-set-inspector-card">
        <span id="p3-set-label-title">Visited Character Set:</span>
        <div id="p3-set-chip-display">{charSet}</div>
      </div>

      {/* Result Output Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p3-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
          >
            <div id="p3-callout-header-text">{output.label}</div>
            <div id="p3-callout-val-text">{output.value}</div>
            <div id="p3-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}