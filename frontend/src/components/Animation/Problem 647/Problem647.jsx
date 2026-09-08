import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem647.css";

export default function Problem647({ stepData }) {
  const {
    chars = [],
    center = null,
    left = null,
    right = null,
    totalCount = 0,
    expandType = null,
    matchedSubstring = null,
    state = {},
    output
  } = stepData || {};

  const { res = totalCount, found = [], status } = state;
  const isComplete = status === "COMPLETED";

  return (
    <div className="canvas-wrapper palindrome-canvas">
      {/* Metric State Header */}
      <div className="metrics-row">
        <span className="metric-chip count-chip">
          Total Palindromes: <b>{res}</b>
        </span>
        {center !== null && (
          <span className="metric-chip center-chip">
            Center: <b>Index {center} ('{chars[center]}')</b>
          </span>
        )}
        {expandType && (
          <span className={`metric-chip ${expandType === "odd" ? "odd-chip" : "even-chip"}`}>
            Type: <b>{expandType === "odd" ? "Odd (i, i)" : "Even (i, i+1)"}</b>
          </span>
        )}
        {matchedSubstring && (
          <span className="metric-chip match-chip">
            Found: <b>"{matchedSubstring}" (+1)</b>
          </span>
        )}
      </div>

      {/* Characters Track with Left & Right Expansion Pointers */}
      <div className="palindrome-track-container">
        <div className="chars-track">
          {chars.map((ch, idx) => {
            const isCenter = idx === center;
            const isL = left !== null && idx === left;
            const isR = right !== null && idx === right;
            const inSpan = left !== null && right !== null && idx >= left && idx <= right;

            return (
              <div key={`char-${idx}`} className="char-col">
                {/* Pointer Badges */}
                <div className="ptrs-group">
                  {isL && isR && <span className="pointer-tag ptr-lr">L/R</span>}
                  {isL && !isR && <span className="pointer-tag ptr-l">L</span>}
                  {isR && !isL && <span className="pointer-tag ptr-r">R</span>}
                  {isCenter && !isL && !isR && <span className="pointer-tag ptr-c">C</span>}
                </div>

                {/* Character Tile */}
                <motion.div
                  className={`char-tile ${inSpan ? "tile-in-span" : ""} ${
                    isCenter ? "tile-center" : ""
                  }`}
                  animate={{
                    scale: inSpan ? 1.08 : 1,
                    borderColor: inSpan ? "#22c55e" : isCenter ? "#38bdf8" : "#27272a"
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="char-val">{ch}</span>
                  <span className="idx-tag">[{idx}]</span>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Substring Findings Tag List */}
      {found && found.length > 0 && (
        <div className="found-pool-container">
          <span className="pool-label">Discovered Substrings:</span>
          <div className="found-chips">
            {(Array.isArray(found) ? found : JSON.parse(found.replace(/'/g, '"'))).map(
              (sub, i) => (
                <span key={i} className="found-chip">
                  "{sub}"
                </span>
              )
            )}
          </div>
        </div>
      )}

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