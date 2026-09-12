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

  const { res = totalCount, found = [] } = state;

  let parsedFound = [];
  try {
    if (Array.isArray(found)) {
      parsedFound = found;
    } else if (typeof found === "string") {
      parsedFound = JSON.parse(found.replace(/'/g, '"'));
    }
  } catch {
    parsedFound = [];
  }

  return (
    <div id="p647-palindrome-canvas">
      {/* Metric State Header */}
      <div id="p647-metrics-bar">
        <span id="p647-metric-count">
          Total Palindromes: <b>{res}</b>
        </span>
        {center !== null && (
          <span id="p647-metric-center">
            Center: <b>Index {center} ('{chars[center]}')</b>
          </span>
        )}
        {expandType && (
          <span
            id="p647-metric-expand"
            data-expand-type={expandType}
          >
            Type: <b>{expandType === "odd" ? "Odd (i, i)" : "Even (i, i+1)"}</b>
          </span>
        )}
        {matchedSubstring && (
          <span id="p647-metric-match">
            Found: <b>"{matchedSubstring}" (+1)</b>
          </span>
        )}
      </div>

      {/* Characters Track with Left & Right Expansion Pointers */}
      <div id="p647-palindrome-track-container">
        <div id="p647-chars-track">
          {chars.map((ch, idx) => {
            const isCenter = idx === center;
            const isL = left !== null && idx === left;
            const isR = right !== null && idx === right;
            const inSpan = left !== null && right !== null && idx >= left && idx <= right;

            let tileState = "idle";
            if (inSpan) tileState = "span";
            else if (isCenter) tileState = "center";

            return (
              <div key={`p647-char-${idx}`} id={`p647-char-col-${idx}`}>
                {/* Pointer Badges */}
                <div id={`p647-ptrs-group-${idx}`}>
                  <AnimatePresence mode="popLayout">
                    {isL && isR ? (
                      <motion.span
                        key="p647-ptr-lr"
                        layoutId="p647-ptr-lr"
                        id={`p647-ptr-badge-lr-${idx}`}
                        data-ptr-type="lr"
                        initial={{ y: -6, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -6, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 450, damping: 26 }}
                      >
                        L/R
                      </motion.span>
                    ) : (
                      <>
                        {isL && (
                          <motion.span
                            key="p647-ptr-l"
                            layoutId="p647-ptr-l"
                            id={`p647-ptr-badge-l-${idx}`}
                            data-ptr-type="l"
                            initial={{ y: -6, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -6, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 450, damping: 26 }}
                          >
                            L
                          </motion.span>
                        )}
                        {isR && (
                          <motion.span
                            key="p647-ptr-r"
                            layoutId="p647-ptr-r"
                            id={`p647-ptr-badge-r-${idx}`}
                            data-ptr-type="r"
                            initial={{ y: -6, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -6, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 450, damping: 26 }}
                          >
                            R
                          </motion.span>
                        )}
                        {isCenter && !isL && !isR && (
                          <motion.span
                            key="p647-ptr-c"
                            layoutId="p647-ptr-c"
                            id={`p647-ptr-badge-c-${idx}`}
                            data-ptr-type="c"
                            initial={{ y: -6, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -6, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 450, damping: 26 }}
                          >
                            C
                          </motion.span>
                        )}
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* Character Tile */}
                <motion.div
                  id={`p647-char-tile-${idx}`}
                  data-tile-state={tileState}
                  layout
                  animate={{
                    scale: inSpan ? 1.08 : 1
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 22 }}
                >
                  <span id={`p647-char-val-${idx}`}>{ch}</span>
                  <span id={`p647-idx-tag-${idx}`}>[{idx}]</span>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Substring Findings Tag List */}
      {parsedFound.length > 0 && (
        <div id="p647-found-pool-container">
          <span id="p647-pool-label">Discovered Substrings:</span>
          <div id="p647-found-chips">
            {parsedFound.map((sub, i) => (
              <span key={`p647-chip-${i}`} id={`p647-found-chip-${i}`}>
                "{sub}"
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Output Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p647-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div id="p647-callout-header-text">{output.label}</div>
            <div id="p647-callout-val-text">{output.value}</div>
            <div id="p647-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}