import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem125.css";

export default function Problem125({ stepData }) {
  const {
    chars: rawChars,
    cleanedStr,
    s,
    l,
    r,
    left: propLeft,
    right: propRight,
    isMatch: propMatch,
    isCompleted: propCompleted,
    state = {},
    output
  } = stepData || {};

  // Normalize string/chars array across data formats
  const stringSource = rawChars || cleanedStr || s || state.chars || ["r", "a", "c", "e", "c", "a", "r"];
  const chars = Array.isArray(stringSource) ? stringSource : String(stringSource).split("");

  // Normalize pointer indices
  const left = l ?? propLeft ?? state.l ?? 0;
  const right = r ?? propRight ?? state.r ?? (chars.length > 0 ? chars.length - 1 : 0);

  // Normalize status flags
  const isComplete = propCompleted || state.status === "COMPLETED" || output !== null;
  const isMatch = propMatch ?? (state.isPalindrome !== "False" && chars[left] === chars[right]);
  const isMismatch = isMatch === false || state.isPalindrome === "False";

  let matchState = "eval";
  if (isComplete || isMatch === true) matchState = "match";
  else if (isMismatch) matchState = "mismatch";

  return (
    <div id="p125-palindrome-scan-canvas">
      {/* Top Metrics Row */}
      <div id="p125-metrics-row">
        <span id="p125-metric-ptrs">
          Pointers: <b>L: {left} | R: {right}</b>
        </span>

        <span
          id="p125-metric-match"
          data-match={matchState}
        >
          Characters:{" "}
          <b>
            {chars[left] !== undefined && chars[right] !== undefined
              ? `'${chars[left]}' vs '${chars[right]}'`
              : "Complete"}
          </b>
        </span>

        <span id="p125-metric-result">
          Status: <b>{isComplete ? "VALID PALINDROME ✓" : isMismatch ? "MISMATCH FOUND ✗" : "TWO-POINTER SCAN"}</b>
        </span>
      </div>

      {/* Synchronized Character Scan Ribbon */}
      <div id="p125-chars-track-container">
        <div id="p125-chars-stream">
          {chars.map((ch, idx) => {
            const isLeft = idx === left;
            const isRight = idx === right;
            const isBoth = isLeft && isRight;
            const isActive = (isLeft || isRight) && !isComplete;
            const isVerified = (idx < left || idx > right) && !isComplete;

            let tileState = "idle";
            if (isComplete) {
              tileState = "complete";
            } else if (isActive) {
              tileState = "active";
            } else if (isVerified) {
              tileState = "verified";
            }

            return (
              <div key={`p125-col-${idx}`} id={`p125-char-col-${idx}`}>
                {/* Pointer Badges with Sliding Layout Animation */}
                <div id={`p125-ptrs-group-${idx}`}>
                  <AnimatePresence mode="popLayout">
                    {isBoth && !isComplete && (
                      <motion.span
                        key="p125-ptr-both"
                        layoutId="p125-shared-ptr-lr"
                        id={`p125-pointer-tag-lr-${idx}`}
                        data-ptr="lr"
                        initial={{ y: -8, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -8, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 450, damping: 28 }}
                      >
                        L &amp; R
                      </motion.span>
                    )}
                    {isLeft && !isBoth && !isComplete && (
                      <motion.span
                        key="p125-ptr-left"
                        layoutId="p125-shared-ptr-l"
                        id={`p125-pointer-tag-l-${idx}`}
                        data-ptr="l"
                        initial={{ y: -8, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -8, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 450, damping: 28 }}
                      >
                        L
                      </motion.span>
                    )}
                    {isRight && !isBoth && !isComplete && (
                      <motion.span
                        key="p125-ptr-right"
                        layoutId="p125-shared-ptr-r"
                        id={`p125-pointer-tag-r-${idx}`}
                        data-ptr="r"
                        initial={{ y: -8, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -8, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 450, damping: 28 }}
                      >
                        R
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                {/* Character Tile */}
                <motion.div
                  id={`p125-char-tile-${idx}`}
                  data-scan-state={tileState}
                  layout
                  animate={{
                    scale: isComplete || isActive ? 1.08 : 1
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 24 }}
                >
                  <span id={`p125-char-val-${idx}`}>{ch}</span>
                  <span id={`p125-idx-tag-${idx}`}>[{idx}]</span>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Result Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p125-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div id="p125-callout-header-text">{output.label}</div>
            <div id="p125-callout-val-text">{output.value}</div>
            <div id="p125-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}