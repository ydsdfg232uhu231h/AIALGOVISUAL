import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem242.css";

const LETTERS = ["a", "g", "m", "n", "r"];

export default function Problem242({ stepData }) {
  const {
    countS = {},
    countT = {},
    currentIdx = null,
    activeCharS = null,
    activeCharT = null,
    state = {},
    output
  } = stepData || {};

  const sStr = state.s || "anagram";
  const tStr = state.t || "nagaram";

  const isVerifying = state.status === "VERIFYING_TALLIES" || state.status === "COMPLETED";
  const isFinished = Boolean(output);

  return (
    <div className="canvas-wrapper anagram-canvas">
      {/* Top Metrics Row */}
      <div className="metrics-row">
        <span className="metric-chip str-chip">
          Lengths: <b>|s| = {sStr.length}, |t| = {tStr.length}</b>
        </span>
        <span className="metric-chip idx-chip">
          Scan Index:{" "}
          <b>
            {currentIdx !== null && currentIdx >= 0 && !isVerifying
              ? `i = ${currentIdx}`
              : isVerifying
              ? "Verifying Counts"
              : "Ready"}
          </b>
        </span>
        {activeCharS && activeCharT && !isVerifying && (
          <span className="metric-chip chars-chip">
            Scanning: <b className="text-s">s[{currentIdx}]='{activeCharS}'</b> |{" "}
            <b className="text-t">t[{currentIdx}]='{activeCharT}'</b>
          </span>
        )}
      </div>

      <div className="anagram-stage">
        {/* Dual String Inspection Tracks */}
        <div className="strings-card">
          <div className="card-header-bar">
            <span>Dual String Character Stream</span>
            <span className="card-sub">Parallel Left-to-Right Scan</span>
          </div>

          <div className="streams-wrapper">
            {/* String S */}
            <div className="stream-row">
              <span className="stream-name">String s:</span>
              <div className="char-cells">
                {sStr.split("").map((ch, idx) => {
                  const isActive = currentIdx === idx && !isVerifying;
                  const isProcessed = currentIdx !== null && idx <= currentIdx;

                  return (
                    <motion.div
                      key={`s-${idx}-${ch}`}
                      className={`char-box ${
                        isActive
                          ? "char-active-s"
                          : isProcessed
                          ? "char-processed"
                          : ""
                      }`}
                      animate={{ scale: isActive ? 1.15 : 1 }}
                      transition={{ type: "spring", stiffness: 350, damping: 20 }}
                    >
                      <span className="char-val">{ch}</span>
                      <span className="char-pos">[{idx}]</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* String T */}
            <div className="stream-row">
              <span className="stream-name">String t:</span>
              <div className="char-cells">
                {tStr.split("").map((ch, idx) => {
                  const isActive = currentIdx === idx && !isVerifying;
                  const isProcessed = currentIdx !== null && idx <= currentIdx;

                  return (
                    <motion.div
                      key={`t-${idx}-${ch}`}
                      className={`char-box ${
                        isActive
                          ? "char-active-t"
                          : isProcessed
                          ? "char-processed"
                          : ""
                      }`}
                      animate={{ scale: isActive ? 1.15 : 1 }}
                      transition={{ type: "spring", stiffness: 350, damping: 20 }}
                    >
                      <span className="char-val">{ch}</span>
                      <span className="char-pos">[{idx}]</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Character Frequency Table */}
        <div className="freq-card">
          <div className="card-header-bar">
            <span>Character Frequency Counters (countS vs countT)</span>
            <span className="card-sub">
              {isVerifying
                ? "Final comparison of letter tallies"
                : "Tracking letter tallies"}
            </span>
          </div>

          <div className="freq-grid">
            {LETTERS.map((letter) => {
              const freqS = countS[letter] ?? 0;
              const freqT = countT[letter] ?? 0;
              const isMatch = freqS === freqT;
              const isTargetS = activeCharS === letter && !isVerifying;
              const isTargetT = activeCharT === letter && !isVerifying;
              const isCurrentlyActive = (isTargetS || isTargetT) && !isVerifying;

              return (
                <motion.div
                  key={`freq-col-${letter}`}
                  className={`freq-col ${
                    isCurrentlyActive ? "freq-col-active-yellow" : ""
                  } ${isVerifying && isMatch ? "freq-col-verified" : ""}`}
                  animate={{ scale: isCurrentlyActive ? 1.06 : 1 }}
                  transition={{ type: "spring", stiffness: 320, damping: 22 }}
                >
                  <div className={`freq-char-badge ${isCurrentlyActive ? "char-badge-yellow" : ""}`}>
                    {letter}
                  </div>

                  <div className="freq-tallies">
                    <div className={`tally-box tally-s ${isTargetS ? "tally-bump-s" : ""}`}>
                      <span className="tally-tag">s</span>
                      <span className="tally-num">{freqS}</span>
                    </div>

                    <span className="tally-comp">
                      {isVerifying ? (isMatch ? "=" : "≠") : "•"}
                    </span>

                    <div className={`tally-box tally-t ${isTargetT ? "tally-bump-t" : ""}`}>
                      <span className="tally-tag">t</span>
                      <span className="tally-num">{freqT}</span>
                    </div>
                  </div>

                  {/* Bottom Indicator Badge */}
                  {isVerifying ? (
                    <motion.span
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`match-badge ${isMatch ? "match-ok" : "match-fail"}`}
                    >
                      {isMatch ? "MATCH" : "DIFF"}
                    </motion.span>
                  ) : (
                    <span className={`match-badge ${isCurrentlyActive ? "match-active-pill" : "match-pending"}`}>
                      {isTargetS && isTargetT
                        ? "+1 S & T"
                        : isTargetS
                        ? "+1 in S"
                        : isTargetT
                        ? "+1 in T"
                        : "—"}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Result Callout */}
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