import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem567.css";

export default function Problem567({ stepData }) {
  const {
    s2 = [],
    left = 0,
    right = 0,
    state = {},
    output
  } = stepData || {};

  const { c1 = "{a:1, b:1}", c2 = "{}", match, window: windowStr } = state;
  const isMatch = match === "True";

  return (
    <div id="p567-fixed-window-canvas">
      {/* Top Target & Status Bar */}
      <div id="p567-status-header">
        <div id="p567-target-card">
          <span id="p567-target-card-label">Target Permutation (s1):</span>
          <span id="p567-target-card-val">"ab" (size 2)</span>
          <span id="p567-target-card-freq">c1: {c1}</span>
        </div>

        <div
          id="p567-window-card"
          data-window-state={isMatch ? "matched" : "idle"}
        >
          <span id="p567-window-card-label">Current Window (c2):</span>
          <span id="p567-window-card-val">{windowStr ? `"${windowStr}"` : "sliding..."}</span>
          <span id="p567-window-card-freq">c2: {c2}</span>
        </div>

        {match && (
          <div
            id="p567-match-badge"
            data-match-state={isMatch ? "matched" : "mismatch"}
          >
            {isMatch ? "MATCH FOUND (c1 == c2)" : "NO MATCH"}
          </div>
        )}
      </div>

      {/* Characters Stream s2 */}
      <div id="p567-s2-track">
        {s2.map((char, idx) => {
          const inWindow = idx >= left && idx <= right;
          const isLeft = idx === left;
          const isRight = idx === right;

          let tileState = "out";
          if (inWindow && isMatch) tileState = "matched";
          else if (inWindow) tileState = "in";

          return (
            <div key={`p567-node-${idx}`} id={`p567-char-node-col-${idx}`}>
              {/* Pointer Badges */}
              <div id={`p567-ptrs-track-${idx}`}>
                <AnimatePresence mode="popLayout">
                  {isLeft && (
                    <motion.span
                      key="p567-ptr-l"
                      layoutId="p567-ptr-l"
                      id={`p567-ptr-badge-l-${idx}`}
                      initial={{ y: -6, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -6, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 450, damping: 26 }}
                    >
                      L
                    </motion.span>
                  )}
                  {isRight && (
                    <motion.span
                      key="p567-ptr-r"
                      layoutId="p567-ptr-r"
                      id={`p567-ptr-badge-r-${idx}`}
                      initial={{ y: -6, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -6, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 450, damping: 26 }}
                    >
                      R
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Animated Character Tile */}
              <motion.div
                id={`p567-char-tile-${idx}`}
                data-tile-state={tileState}
                layout
                animate={{
                  scale: inWindow ? 1.08 : 0.95,
                  opacity: inWindow ? 1 : 0.35
                }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              >
                {char}
              </motion.div>

              <span id={`p567-idx-tag-${idx}`}>[{idx}]</span>
            </div>
          );
        })}
      </div>

      {/* Output Result Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p567-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div id="p567-callout-header-text">{output.label}</div>
            <div id="p567-callout-val-text">{output.value}</div>
            <div id="p567-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}