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
    <div className="canvas-wrapper palindrome-canvas">
      {/* Metrics Row */}
      <div className="metrics-row">
        {i !== null && (
          <span className="metric-chip center-chip">
            Center Index (i): <b>{i} ('{chars[i]}')</b>
          </span>
        )}
        {centerL !== null && centerR !== null && (
          <span className="metric-chip window-chip">
            Span: <b>[{centerL}..{centerR}]</b> ({centerR - centerL + 1} chars)
          </span>
        )}
        <span className="metric-chip best-chip">
          Longest Found (res): <b>"{res || "-"}"</b>
        </span>
      </div>

      {/* String Ribbon */}
      <div className="elements-track">
        {chars.map((char, idx) => {
          const inSpan = centerL !== null && centerR !== null && idx >= centerL && idx <= centerR;
          const isCenterL = idx === centerL;
          const isCenterR = idx === centerR;
          const isOrigin = idx === i;

          return (
            <div key={idx} className="box-column">
              {/* Pointer Badges */}
              <div className="ptrs-group">
                {isCenterL && <span className="pointer-tag ptr-l">L</span>}
                {isOrigin && <span className="pointer-tag ptr-origin">C</span>}
                {isCenterR && <span className="pointer-tag ptr-r">R</span>}
              </div>

              {/* Character Box */}
              <motion.div
                className={`box-node ${inSpan ? "span-node" : ""} ${
                  isOrigin ? "origin-node" : ""
                }`}
                animate={{
                  scale: inSpan ? 1.08 : 0.95,
                  opacity: inSpan ? 1 : 0.35,
                  borderColor: inSpan ? "#22c55e" : isOrigin ? "#38bdf8" : "#27272a"
                }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                {char}
              </motion.div>

              <span className="idx-tag">[{idx}]</span>
            </div>
          );
        })}
      </div>

      {/* Substring Inspection */}
      {(p1 || p2) && (
        <div className="preview-chip">
          Current Expansion: <b>"{p1 || p2}"</b>
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