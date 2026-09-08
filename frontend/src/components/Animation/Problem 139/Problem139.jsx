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
    <div className="canvas-wrapper word-break-canvas">
      {/* Metrics Row */}
      <div className="metrics-row">
        <span className="metric-chip str-chip">
          String: <b>"{s}"</b> (len: {s.length})
        </span>
        <span className="metric-chip dict-chip">
          Dict: <b>[{wordDict.map((w) => `"${w}"`).join(", ")}]</b>
        </span>
        {i !== undefined && (
          <span className="metric-chip idx-chip">
            Checking Index: <b>i = {i}</b>
          </span>
        )}
        {matchedWord ? (
          <span className="metric-chip match-chip">
            Matched: <b>"{matchedWord}"</b> ➔ dp[{i}] = dp[{i + matchLen}] ({String(dp[i + matchLen])})
          </span>
        ) : checkedWord ? (
          <span className="metric-chip test-chip">
            Testing: <b>"{checkedWord}"</b> (Mismatch)
          </span>
        ) : null}
        {canSegment !== undefined && (
          <span className="metric-chip success-chip">
            Segmentable: <b>{canSegment}</b>
          </span>
        )}
      </div>

      {/* String & DP Track Container */}
      <div className="word-break-container">
        {/* String Characters Track */}
        <div className="track-row">
          <div className="row-title">s[k]:</div>
          <div className="cells-stream">
            {strChars.map((ch, idx) => {
              const inMatchSpan =
                i !== undefined && matchLen > 0 && idx >= i && idx < i + matchLen;

              return (
                <div
                  key={`char-${idx}`}
                  className={`wb-char-box ${inMatchSpan ? (matchedWord ? "char-match" : "char-test") : ""}`}
                >
                  <span className="char-val">{ch}</span>
                  <span className="char-idx">[{idx}]</span>
                </div>
              );
            })}
            {/* Virtual end-of-string cell for n */}
            <div className="wb-char-box end-anchor">
              <span className="char-val">ε</span>
              <span className="char-idx">[{s.length}]</span>
            </div>
          </div>
        </div>

        {/* DP Array Track */}
        <div className="track-row">
          <div className="row-title">dp[k]:</div>
          <div className="cells-stream">
            {dp.map((val, idx) => {
              const isCurrent = idx === currentIdx;
              const isJumpTarget =
                i !== undefined && matchLen > 0 && idx === i + matchLen;
              const isTarget = isComplete && idx === 0;

              return (
                <div key={`dp-node-${idx}`} className="dp-col">
                  <div className="dp-ptr-slot">
                    {isCurrent && !isComplete && <span className="dp-badge badge-curr">i</span>}
                    {isJumpTarget && <span className="dp-badge badge-jump">i+len</span>}
                  </div>

                  <motion.div
                    className={`wb-dp-box ${val ? "dp-true" : "dp-false"} ${
                      isCurrent ? "dp-current" : ""
                    } ${isTarget ? "dp-complete" : ""}`}
                    animate={{
                      scale: isCurrent || isTarget ? 1.08 : 1
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="dp-val">{val ? "T" : "F"}</span>
                    <span className="dp-sub">dp[{idx}]</span>
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