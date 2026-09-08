import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem17.css";

const FULL_KEYPAD = [
  { num: "1", letters: "" },
  { num: "2", letters: "abc" },
  { num: "3", letters: "def" },
  { num: "4", letters: "ghi" },
  { num: "5", letters: "jkl" },
  { num: "6", letters: "mno" },
  { num: "7", letters: "pqrs" },
  { num: "8", letters: "tuv" },
  { num: "9", letters: "wxyz" },
  { num: "*", letters: "" },
  { num: "0", letters: "+" },
  { num: "#", letters: "" }
];

export default function Problem17({ stepData }) {
  const {
    digits = "23",
    currentPath = "",
    treeLevel = 0,
    activeDigit = null,
    activeChar = null,
    state = {},
    output
  } = stepData || {};

  const { res = "[]", currentStr = currentPath } = state;

  let resultsList = [];
  try {
    resultsList = typeof res === "string" ? JSON.parse(res.replace(/'/g, '"')) : res;
  } catch {
    resultsList = [];
  }

  const activeDigitsSet = new Set(digits.split(""));

  return (
    <div className="canvas-wrapper phone-keypad-canvas">
      {/* Top Telemetry Dashboard */}
      <div className="metrics-row">
        <span className="metric-chip digits-chip">
          Input Digits: <b>"{digits}"</b>
        </span>
        <span className="metric-chip path-chip">
          Current Prefix: <b>"{currentStr || "Ø"}"</b>
        </span>
        {activeChar && (
          <span className="metric-chip char-chip">
            Exploring Branch: <b>'{activeChar}' (Digit {activeDigit})</b>
          </span>
        )}
        <span className="metric-chip level-chip">
          Depth: <b>{treeLevel} / {digits.length}</b>
        </span>
      </div>

      {/* Main Interaction Stage: Full Keypad + Active Exploration Pipeline */}
      <div className="keypad-layout-stage">
        {/* Full 3x4 Phone Keypad Matrix */}
        <div className="keypad-grid">
          {FULL_KEYPAD.map((key) => {
            const isInInput = activeDigitsSet.has(key.num);
            const isCurrentlyActive = activeDigit === key.num;

            return (
              <div
                key={key.num}
                className={`keypad-button ${isInInput ? "key-in-input" : ""} ${
                  isCurrentlyActive ? "key-evaluating" : ""
                }`}
              >
                <span className="key-num-label">{key.num}</span>
                <div className="key-letters-row">
                  {key.letters.split("").map((ch) => {
                    const isLetterChosen = activeChar === ch && isCurrentlyActive;
                    return (
                      <span
                        key={ch}
                        className={`key-letter-char ${isLetterChosen ? "char-highlighted" : ""}`}
                      >
                        {ch}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Exploration Slot Trail */}
        <div className="exploration-trail-card">
          <div className="trail-title">Decision Slot Trail</div>
          <div className="trail-slots">
            {digits.split("").map((d, idx) => {
              const charAtSlot = currentStr[idx] || null;
              const isSlotActive = idx === treeLevel;

              return (
                <motion.div
                  key={`slot-${idx}`}
                  className={`trail-slot ${isSlotActive ? "slot-active" : ""} ${
                    charAtSlot ? "slot-filled" : ""
                  }`}
                  animate={{
                    scale: isSlotActive ? 1.08 : 1,
                    borderColor: isSlotActive ? "#38bdf8" : charAtSlot ? "#22c55e" : "#27272a"
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="slot-digit-tag">Digit {d}</span>
                  <span className="slot-value">{charAtSlot || "—"}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Accumulated Combinations Reel */}
      <div className="results-reel-card">
        <div className="reel-header">
          <span className="reel-title">Generated Combinations</span>
          <span className="reel-count">Total: {resultsList.length}</span>
        </div>
        <div className="reel-chips-stream">
          {resultsList.length === 0 ? (
            <span className="reel-empty-text">Backtracking in progress...</span>
          ) : (
            resultsList.map((combo, idx) => (
              <motion.span
                key={`${combo}-${idx}`}
                className="combo-chip"
                initial={{ opacity: 0, scale: 0.8, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                "{combo}"
              </motion.span>
            ))
          )}
        </div>
      </div>

      {/* Output Result Callout */}
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