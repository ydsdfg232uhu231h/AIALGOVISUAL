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
    <div id="p17-phone-keypad-canvas">
      {/* Top Telemetry Dashboard */}
      <div id="p17-metrics-row">
        <span id="p17-metric-digits">
          Input Digits: <b>"{digits}"</b>
        </span>
        <span id="p17-metric-path">
          Current Prefix: <b>"{currentStr || "Ø"}"</b>
        </span>
        {activeChar && (
          <span id="p17-metric-char">
            Exploring Branch: <b>'{activeChar}' (Digit {activeDigit})</b>
          </span>
        )}
        <span id="p17-metric-level">
          Depth: <b>{treeLevel} / {digits.length}</b>
        </span>
      </div>

      {/* Main Interaction Stage */}
      <div id="p17-keypad-layout-stage">
        {/* Full 3x4 Phone Keypad Matrix */}
        <div id="p17-keypad-grid">
          {FULL_KEYPAD.map((key) => {
            const isInInput = activeDigitsSet.has(key.num);
            const isCurrentlyActive = activeDigit === key.num;

            return (
              <div
                key={`p17-key-${key.num}`}
                id={`p17-keypad-button-${key.num}`}
                data-in-input={isInInput ? "true" : "false"}
                data-active={isCurrentlyActive ? "true" : "false"}
              >
                <span id={`p17-key-num-label-${key.num}`}>{key.num}</span>
                <div id={`p17-key-letters-row-${key.num}`}>
                  {key.letters.split("").map((ch) => {
                    const isLetterChosen = activeChar === ch && isCurrentlyActive;
                    return (
                      <span
                        key={`p17-ch-${key.num}-${ch}`}
                        id={`p17-key-letter-char-${key.num}-${ch}`}
                        data-highlighted={isLetterChosen ? "true" : "false"}
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
        <div id="p17-exploration-trail-card">
          <div id="p17-trail-title">Decision Slot Trail</div>
          <div id="p17-trail-slots">
            {digits.split("").map((d, idx) => {
              const charAtSlot = currentStr[idx] || null;
              const isSlotActive = idx === treeLevel;

              let slotState = "idle";
              if (isSlotActive) slotState = "active";
              else if (charAtSlot) slotState = "filled";

              return (
                <motion.div
                  key={`p17-slot-${idx}`}
                  id={`p17-trail-slot-${idx}`}
                  data-state={slotState}
                  layout
                  animate={{
                    scale: isSlotActive ? 1.08 : 1,
                    borderColor: isSlotActive ? "#38bdf8" : charAtSlot ? "#22c55e" : "#27272a"
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <span id={`p17-slot-digit-tag-${idx}`}>Digit {d}</span>
                  <span id={`p17-slot-value-${idx}`}>{charAtSlot || "—"}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Accumulated Combinations Reel */}
      <div id="p17-results-reel-card">
        <div id="p17-reel-header">
          <span id="p17-reel-title">Generated Combinations</span>
          <span id="p17-reel-count">Total: {resultsList.length}</span>
        </div>
        <div id="p17-reel-chips-stream">
          {resultsList.length === 0 ? (
            <span id="p17-reel-empty-text">Backtracking in progress...</span>
          ) : (
            resultsList.map((combo, idx) => (
              <motion.span
                key={`p17-combo-${combo}-${idx}`}
                id={`p17-combo-chip-${idx}`}
                layout
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
            id="p17-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
          >
            <div id="p17-callout-header-text">{output.label}</div>
            <div id="p17-callout-val-text">{output.value}</div>
            <div id="p17-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}