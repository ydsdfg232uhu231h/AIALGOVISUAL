import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem139.css";

export default function Problem139({ stepData }) {
  const {
    s = "leetcode",
    dp = [],
    currentIdx = 8,
    state = {},
    output
  } = stepData || {};

  const { i, matchedWord, checkedWord, wordDict = ["leet", "code"], canSegment, status } = state;
  const isComplete = status === "COMPLETED";
  const strChars = typeof s === "string" ? s.split("") : [];
  const matchLen = matchedWord ? matchedWord.length : checkedWord ? checkedWord.length : 0;

  return (
    <div id="p139-word-break-canvas">
      {/* Top Metrics Row */}
      <div id="p139-metrics-row">
        <span id="p139-metric-chip-str">
          String: <b>"{s}"</b> (len: {s.length})
        </span>
        <span id="p139-metric-chip-dict">
          Dict: <b>[{wordDict.map((w) => `"${w}"`).join(", ")}]</b>
        </span>
        {i !== undefined && (
          <span id="p139-metric-chip-idx">
            Checking Index: <b>i = {i}</b>
          </span>
        )}
        {matchedWord ? (
          <span id="p139-metric-chip-match">
            Matched: <b>"{matchedWord}"</b> ➔ dp[{i}] = dp[{i + matchLen}] ({String(dp[i + matchLen])})
          </span>
        ) : checkedWord ? (
          <span id="p139-metric-chip-test">
            Testing: <b>"{checkedWord}"</b> (Mismatch)
          </span>
        ) : null}
        {canSegment !== undefined && (
          <span id="p139-metric-chip-success">
            Segmentable: <b>{canSegment}</b>
          </span>
        )}
      </div>

      {/* String & DP Track Container */}
      <div id="p139-word-break-container">
        {/* String Characters Track */}
        <div id="p139-track-row-chars">
          <div id="p139-row-title-chars">s[k]:</div>
          <div id="p139-cells-stream-chars">
            {strChars.map((ch, idx) => {
              const inMatchSpan =
                i !== undefined && matchLen > 0 && idx >= i && idx < i + matchLen;

              let charState = "idle";
              if (inMatchSpan) {
                charState = matchedWord ? "match" : "test";
              }

              return (
                <div
                  key={`p139-char-${idx}`}
                  id={`p139-char-box-${idx}`}
                  data-char-state={charState}
                >
                  <span id={`p139-char-val-${idx}`}>{ch}</span>
                  <span id={`p139-char-idx-${idx}`}>[{idx}]</span>
                </div>
              );
            })}
            {/* Virtual end-of-string cell for n */}
            <div id="p139-char-box-anchor" data-char-state="anchor">
              <span id="p139-char-val-anchor">ε</span>
              <span id="p139-char-idx-anchor">[{s.length}]</span>
            </div>
          </div>
        </div>

        {/* DP Array Track */}
        <div id="p139-track-row-dp">
          <div id="p139-row-title-dp">dp[k]:</div>
          <div id="p139-cells-stream-dp">
            {dp.map((val, idx) => {
              const isCurrent = idx === currentIdx;
              const isJumpTarget =
                i !== undefined && matchLen > 0 && idx === i + matchLen;
              const isTarget = isComplete && idx === 0;

              let activeState = "idle";
              if (isTarget) activeState = "complete";
              else if (isCurrent) activeState = "current";

              return (
                <div key={`p139-dp-col-${idx}`} id={`p139-dp-col-${idx}`}>
                  <div id={`p139-dp-ptr-slot-${idx}`}>
                    <AnimatePresence mode="popLayout">
                      {isCurrent && !isComplete && (
                        <motion.span
                          key={`p139-badge-curr-${idx}`}
                          id={`p139-dp-badge-curr-${idx}`}
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
                      {isJumpTarget && (
                        <motion.span
                          key={`p139-badge-jump-${idx}`}
                          id={`p139-dp-badge-jump-${idx}`}
                          data-ptr="jump"
                          layout
                          initial={{ y: -6, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -6, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 450, damping: 25 }}
                        >
                          i+len
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  <motion.div
                    id={`p139-dp-box-${idx}`}
                    data-dp-state={val ? "true" : "false"}
                    data-active-state={activeState}
                    layout
                    animate={{
                      scale: isCurrent || isTarget ? 1.08 : 1
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 24 }}
                  >
                    <span id={`p139-dp-val-${idx}`}>{val ? "T" : "F"}</span>
                    <span id={`p139-dp-sub-${idx}`}>dp[{idx}]</span>
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
            id="p139-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div id="p139-callout-header-text">{output.label}</div>
            <div id="p139-callout-val-text">{output.value}</div>
            <div id="p139-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}