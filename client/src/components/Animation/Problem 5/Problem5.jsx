import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem5.css";

export default function Problem5({ stepData }) {
  const {
    chars = [],
    centerL = null,
    centerR = null,
    state = {},
    output
  } = stepData || {};

  const { i = null, res = "", p1, p2 } = state;

  return (
    <div id="p5-palindrome-canvas">
      {/* Metrics Row */}
      <div id="p5-metrics-row">
        {i !== null && (
          <span id="p5-metric-chip-center">
            Center Index (i): <b>{i} ('{chars[i]}')</b>
          </span>
        )}
        {centerL !== null && centerR !== null && (
          <span id="p5-metric-chip-span">
            Span: <b>[{centerL}..{centerR}]</b> ({centerR - centerL + 1} chars)
          </span>
        )}
        <span id="p5-metric-chip-best">
          Longest Found (res): <b>"{res || "-"}"</b>
        </span>
      </div>

      {/* String Ribbon */}
      <div id="p5-elements-track">
        {chars.map((char, idx) => {
          const inSpan = centerL !== null && centerR !== null && idx >= centerL && idx <= centerR;
          const isCenterL = idx === centerL;
          const isCenterR = idx === centerR;
          const isOrigin = idx === i;

          let nodeState = "idle";
          if (inSpan) nodeState = "span";
          else if (isOrigin) nodeState = "origin";

          return (
            <div key={`p5-col-${idx}`} id={`p5-box-column-${idx}`}>
              {/* Pointer Badges */}
              <div id={`p5-ptrs-group-${idx}`}>
                <AnimatePresence mode="popLayout">
                  {isCenterL && (
                    <motion.span
                      key={`p5-ptr-l-${idx}`}
                      id={`p5-pointer-tag-l-${idx}`}
                      layout
                      initial={{ y: -6, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -6, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 450, damping: 25 }}
                    >
                      L
                    </motion.span>
                  )}
                  {isOrigin && (
                    <motion.span
                      key={`p5-ptr-origin-${idx}`}
                      id={`p5-pointer-tag-origin-${idx}`}
                      layout
                      initial={{ y: -6, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -6, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 450, damping: 25 }}
                    >
                      C
                    </motion.span>
                  )}
                  {isCenterR && (
                    <motion.span
                      key={`p5-ptr-r-${idx}`}
                      id={`p5-pointer-tag-r-${idx}`}
                      layout
                      initial={{ y: -6, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -6, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 450, damping: 25 }}
                    >
                      R
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Character Box */}
              <motion.div
                id={`p5-box-node-${idx}`}
                data-state={nodeState}
                data-origin={isOrigin ? "true" : "false"}
                layout
                animate={{
                  scale: inSpan ? 1.08 : 0.95,
                  opacity: inSpan || isOrigin ? 1 : 0.35
                }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                <span id={`p5-node-val-${idx}`}>{char}</span>
              </motion.div>

              <span id={`p5-idx-tag-${idx}`}>[{idx}]</span>
            </div>
          );
        })}
      </div>

      {/* Substring Inspection */}
      {(p1 || p2) && (
        <div id="p5-preview-chip">
          Current Expansion: <b>"{p1 || p2}"</b>
        </div>
      )}

      {/* Output Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p5-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
          >
            <div id="p5-callout-header-text">{output.label}</div>
            <div id="p5-callout-val-text">{output.value}</div>
            <div id="p5-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}