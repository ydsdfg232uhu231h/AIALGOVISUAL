import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem125.css";

export default function Problem125({ stepData }) {
  const {
    chars = [],
    l = null,
    r = null,
    state = {},
    output
  } = stepData || {};

  const { isPalindrome, status } = state;
  const isComplete = status === "COMPLETED";
  const charL = l !== null && l >= 0 && l < chars.length ? chars[l] : null;
  const charR = r !== null && r >= 0 && r < chars.length ? chars[r] : null;
  const isMatch = charL !== null && charR !== null && charL.toLowerCase() === charR.toLowerCase();

  return (
    <div className="canvas-wrapper palindrome-scan-canvas">
      {/* Metrics Row */}
      <div className="metrics-row">
        {l !== null && r !== null && !isComplete && (
          <span className={`metric-chip ${isMatch ? "match-chip" : "mismatch-chip"}`}>
            Comparing: <b>'{charL}'</b> (l={l}) vs <b>'{charR}'</b> (r={r}) &rarr;{" "}
            <b>{isMatch ? "MATCH (l++, r--)" : "MISMATCH (False)"}</b>
          </span>
        )}
        <span className="metric-chip ptr-chip">
          Pointers: <b>L=[{l !== null ? l : "-"}] | R=[{r !== null ? r : "-"}]</b>
        </span>
        {isPalindrome !== undefined && (
          <span className="metric-chip result-chip">
            Valid Palindrome: <b>{isPalindrome}</b>
          </span>
        )}
      </div>

      {/* Characters Track */}
      <div className="chars-track-container">
        <div className="chars-stream">
          {chars.map((ch, idx) => {
            const isL = idx === l;
            const isR = idx === r;
            const isTarget = isL || isR;
            const isVerified = (l !== null && idx < l) || (r !== null && idx > r);

            return (
              <div key={idx} className="char-col">
                {/* Pointer Badges */}
                <div className="ptrs-group">
                  {isL && isR && <span className="pointer-tag ptr-lr">L/R</span>}
                  {isL && !isR && <span className="pointer-tag ptr-l">L</span>}
                  {isR && !isL && <span className="pointer-tag ptr-r">R</span>}
                </div>

                {/* Character Node */}
                <motion.div
                  className={`char-tile ${isTarget ? "tile-active" : ""} ${
                    isVerified ? "tile-verified" : ""
                  } ${isComplete ? "tile-complete" : ""}`}
                  animate={{
                    scale: isTarget ? 1.08 : 1,
                    y: isTarget ? -3 : 0
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <span className="char-val">{ch}</span>
                  <span className="idx-tag">[{idx}]</span>
                </motion.div>
              </div>
            );
          })}
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