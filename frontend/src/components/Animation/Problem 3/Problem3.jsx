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

  return (
    <div id="window-canvas-wrapper">
      {/* Metrics Row */}
      <div id="metrics-bar">
        <span id="metric-window-len">
          Current Window Length: <b>{Math.max(0, right - left + 1)}</b>
        </span>
        <span id="metric-max-len">
          Max Length: <b>{maxLength}</b>
        </span>
        {duplicate && (
          <span id="metric-duplicate-alert">
            Duplicate Detected: <b>'{duplicate}'</b>
          </span>
        )}
      </div>

      {/* Characters Ribbon with Sliding Window */}
      <div id="string-track-container">
        {string.map((char, idx) => {
          const inWindow = idx >= left && idx <= right;
          const isLeft = idx === left;
          const isRight = idx === right;

          // Semantic state ID encoding
          const windowState = inWindow ? "in" : "out";
          const tileId = `char-tile-${windowState}-${idx}`;

          return (
            <div key={`char-${idx}`} id={`char-column-${idx}`}>
              {/* Pointer Indicators */}
              <div id={`ptrs-track-${idx}`}>
                {isLeft && <span id={`ptr-pill-l-${idx}`}>L</span>}
                {isRight && <span id={`ptr-pill-r-${idx}`}>R</span>}
              </div>

              <motion.div
                id={tileId}
                animate={{
                  scale: inWindow ? 1.08 : 0.95,
                  opacity: inWindow ? 1 : 0.35
                }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              >
                {char}
              </motion.div>

              <span id={`idx-tag-${idx}`}>[{idx}]</span>
            </div>
          );
        })}
      </div>

      {/* Set Inspector */}
      <div id="set-inspector-card">
        <span id="set-label-title">Visited Character Set:</span>
        <div id="set-chip-display">{charSet}</div>
      </div>

      {/* Result Output Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
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