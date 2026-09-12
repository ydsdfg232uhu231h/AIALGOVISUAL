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

  return (
    <div id="p242-anagram-canvas">
      {/* Top Metrics Row */}
      <div id="p242-metrics-row">
        <span id="p242-metric-lengths">
          Lengths: <b>|s| = {sStr.length}, |t| = {tStr.length}</b>
        </span>
        <span id="p242-metric-scan-idx">
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
          <span id="p242-metric-scanning">
            Scanning: <b id="p242-text-s">s[{currentIdx}]='{activeCharS}'</b> |{" "}
            <b id="p242-text-t">t[{currentIdx}]='{activeCharT}'</b>
          </span>
        )}
      </div>

      <div id="p242-anagram-stage">
        {/* Dual String Inspection Tracks */}
        <div id="p242-strings-card">
          <div id="p242-strings-card-header">
            <span id="p242-strings-header-title">Dual String Character Stream</span>
            <span id="p242-strings-header-sub">Parallel Left-to-Right Scan</span>
          </div>

          <div id="p242-streams-wrapper">
            {/* String S */}
            <div id="p242-stream-row-s">
              <span id="p242-stream-name-s">String s:</span>
              <div id="p242-char-cells-s">
                {sStr.split("").map((ch, idx) => {
                  const isActive = currentIdx === idx && !isVerifying;
                  const isProcessed = currentIdx !== null && idx <= currentIdx;

                  let charState = "idle";
                  if (isActive) charState = "active-s";
                  else if (isProcessed) charState = "processed";

                  return (
                    <motion.div
                      key={`p242-s-${idx}-${ch}`}
                      id={`p242-char-box-s-${idx}`}
                      data-char-state={charState}
                      layout
                      animate={{ scale: isActive ? 1.12 : 1 }}
                      transition={{ type: "spring", stiffness: 350, damping: 20 }}
                    >
                      <span id={`p242-char-val-s-${idx}`}>{ch}</span>
                      <span id={`p242-char-pos-s-${idx}`}>[{idx}]</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* String T */}
            <div id="p242-stream-row-t">
              <span id="p242-stream-name-t">String t:</span>
              <div id="p242-char-cells-t">
                {tStr.split("").map((ch, idx) => {
                  const isActive = currentIdx === idx && !isVerifying;
                  const isProcessed = currentIdx !== null && idx <= currentIdx;

                  let charState = "idle";
                  if (isActive) charState = "active-t";
                  else if (isProcessed) charState = "processed";

                  return (
                    <motion.div
                      key={`p242-t-${idx}-${ch}`}
                      id={`p242-char-box-t-${idx}`}
                      data-char-state={charState}
                      layout
                      animate={{ scale: isActive ? 1.12 : 1 }}
                      transition={{ type: "spring", stiffness: 350, damping: 20 }}
                    >
                      <span id={`p242-char-val-t-${idx}`}>{ch}</span>
                      <span id={`p242-char-pos-t-${idx}`}>[{idx}]</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Character Frequency Table */}
        <div id="p242-freq-card">
          <div id="p242-freq-card-header">
            <span id="p242-freq-header-title">Character Frequency Counters (countS vs countT)</span>
            <span id="p242-freq-header-sub">
              {isVerifying
                ? "Final comparison of letter tallies"
                : "Tracking letter tallies"}
            </span>
          </div>

          <div id="p242-freq-grid">
            {LETTERS.map((letter) => {
              const freqS = countS[letter] ?? 0;
              const freqT = countT[letter] ?? 0;
              const isMatch = freqS === freqT;
              const isTargetS = activeCharS === letter && !isVerifying;
              const isTargetT = activeCharT === letter && !isVerifying;
              const isCurrentlyActive = (isTargetS || isTargetT) && !isVerifying;

              let colState = "idle";
              if (isCurrentlyActive) colState = "active";
              else if (isVerifying && isMatch) colState = "verified";

              let badgeState = "pending";
              if (isVerifying) {
                badgeState = isMatch ? "ok" : "fail";
              } else if (isCurrentlyActive) {
                badgeState = "active";
              }

              return (
                <motion.div
                  key={`p242-freq-col-${letter}`}
                  id={`p242-freq-col-${letter}`}
                  data-col-state={colState}
                  layout
                  animate={{ scale: isCurrentlyActive ? 1.05 : 1 }}
                  transition={{ type: "spring", stiffness: 320, damping: 22 }}
                >
                  <div
                    id={`p242-freq-char-badge-${letter}`}
                    data-col-state={colState}
                  >
                    {letter}
                  </div>

                  <div id={`p242-freq-tallies-${letter}`}>
                    <div
                      id={`p242-tally-box-s-${letter}`}
                      data-bump={isTargetS ? "s" : "none"}
                    >
                      <span id={`p242-tally-tag-s-${letter}`}>s</span>
                      <span id={`p242-tally-num-s-${letter}`}>{freqS}</span>
                    </div>

                    <span id={`p242-tally-comp-${letter}`}>
                      {isVerifying ? (isMatch ? "=" : "≠") : "•"}
                    </span>

                    <div
                      id={`p242-tally-box-t-${letter}`}
                      data-bump={isTargetT ? "t" : "none"}
                    >
                      <span id={`p242-tally-tag-t-${letter}`}>t</span>
                      <span id={`p242-tally-num-t-${letter}`}>{freqT}</span>
                    </div>
                  </div>

                  {/* Bottom Indicator Badge */}
                  <span
                    id={`p242-match-badge-${letter}`}
                    data-badge-state={badgeState}
                  >
                    {isVerifying
                      ? isMatch
                        ? "MATCH"
                        : "DIFF"
                      : isTargetS && isTargetT
                      ? "+1 S & T"
                      : isTargetS
                      ? "+1 in S"
                      : isTargetT
                      ? "+1 in T"
                      : "—"}
                  </span>
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
            id="p242-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div id="p242-callout-header-text">{output.label}</div>
            <div id="p242-callout-val-text">{output.value}</div>
            <div id="p242-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}