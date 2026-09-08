import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem238.css";

export default function Problem238({ stepData }) {
  const {
    array = [1, 2, 3, 4],
    res = [1, 1, 1, 1],
    currentIdx = null,
    pass = "prefix", // "prefix", "postfix", "done"
    state = {},
    output
  } = stepData || {};

  const prefixVal = state.prefix ?? 1;
  const postfixVal = state.postfix ?? 1;

  return (
    <div className="canvas-wrapper prod-canvas">
      {/* Top Metrics Row */}
      <div className="metrics-row">
        <span className={`metric-chip pass-chip ${pass === "postfix" ? "chip-postfix" : pass === "done" ? "chip-done" : "chip-prefix"}`}>
          Pass: <b>{pass === "prefix" ? "Prefix (Left ➔ Right)" : pass === "postfix" ? "Postfix (Right ➔ Left)" : "Complete"}</b>
        </span>
        <span className="metric-chip prefix-chip">
          Running Prefix: <b>{prefixVal}</b>
        </span>
        <span className="metric-chip postfix-chip">
          Running Postfix: <b>{postfixVal}</b>
        </span>
        {currentIdx !== null && (
          <span className="metric-chip active-chip">
            Current Index: <b>i = {currentIdx}</b>
          </span>
        )}
      </div>

      <div className="prod-stage">
        {/* Input Array Track */}
        <div className="array-card">
          <div className="track-title-row">
            <span className="track-title">Input Array: nums[]</span>
            <span className="track-sub">Source Factors</span>
          </div>
          <div className="array-cells-track">
            {array.map((val, idx) => {
              const isActive = idx === currentIdx;
              return (
                <div key={`nums-${idx}`} className="cell-column">
                  <motion.div
                    className={`num-box ${isActive ? "box-highlight" : ""}`}
                    animate={{ scale: isActive ? 1.1 : 1 }}
                  >
                    {val}
                  </motion.div>
                  <span className="idx-tag">[{idx}]</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Sweep Direction Vector */}
        <div className="pass-direction-banner">
          {pass === "prefix" && (
            <div className="dir-indicator prefix-dir">
              <span>➔ PREFIX PASS (res[i] = prefix; prefix *= nums[i]) ➔</span>
            </div>
          )}
          {pass === "postfix" && (
            <div className="dir-indicator postfix-dir">
              <span>⬅ POSTFIX PASS (res[i] *= postfix; postfix *= nums[i]) ⬅</span>
            </div>
          )}
          {pass === "done" && (
            <div className="dir-indicator done-dir">
              <span>✔ ALL PASSES FINISHED — NO DIVISION USED</span>
            </div>
          )}
        </div>

        {/* Target Result Array Track */}
        <div className="array-card result-track-card">
          <div className="track-title-row">
            <span className="track-title">Output Array: res[]</span>
            <span className="track-sub">Cumulative Product Vector</span>
          </div>
          <div className="array-cells-track">
            {res.map((val, idx) => {
              const isActive = idx === currentIdx;
              return (
                <div key={`res-${idx}`} className="cell-column">
                  <motion.div
                    className={`num-box res-box ${isActive ? "res-box-active" : ""}`}
                    animate={{ scale: isActive ? 1.12 : 1 }}
                    transition={{ type: "spring", stiffness: 350, damping: 20 }}
                  >
                    {val}
                  </motion.div>
                  <span className="idx-tag">res[{idx}]</span>
                  {isActive && <span className="active-arrow-tag">▲ TARGET</span>}
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