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
    <div id="min-window-canvas">
      {/* Metric Indicators */}
      <div id="metrics-bar">
        <span id={isValid ? "status-pill-match-valid" : "status-pill-match-idle"}>
          Match Status: <b>{have} / {need} targets</b>
        </span>
        <span id="status-pill-min-len">
          Min Window Length: <b>{resLen}</b>
        </span>
        {sub && (
          <span id="status-pill-best-sub">
            Current Best: <b>"{sub}"</b>
          </span>
        )}
      </div>

      {/* String Ribbon with L/R Pointers */}
      <div id="string-ribbon-track">
        {s.map((char, idx) => {
          const inWindow = idx >= left && idx <= right;
          const isLeft = idx === left;
          const isRight = idx === right;
          const isTarget = targetChars.includes(char);

          // Semantic ID encoding for state isolation
          const windowState = inWindow ? "in" : "out";
          const targetState = isTarget ? "target" : "norm";
          const tileId = `char-tile-${windowState}-${targetState}-${idx}`;

          return (
            <div key={`cell-${idx}`} id={`char-cell-${idx}`}>
              <div id={`ptr-track-${idx}`}>
                {isLeft && <span id={`ptr-badge-l-${idx}`}>L</span>}
                {isRight && <span id={`ptr-badge-r-${idx}`}>R</span>}
              </div>

              <motion.div
                id={tileId}
                animate={{
                  scale: inWindow ? 1.05 : 0.95,
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

      {/* Window Character Counts Inspector */}
      <div id="counts-inspector-card">
        <span id="inspector-title-label">Target Frequencies (t = "ABC"):</span>
        <div id="counts-list-row">
          {targetChars.map((char) => {
            const count = windowCounts[char] || 0;
            const satisfied = count >= 1;
            const chipId = satisfied ? `count-chip-satisfied-${char}` : `count-chip-idle-${char}`;

            return (
              <div key={`count-${char}`} id={chipId}>
                <span id={`chip-char-${char}`}>{char}</span>
                <span id={`chip-val-${char}`}>{count} / 1</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Output Result Card */}
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