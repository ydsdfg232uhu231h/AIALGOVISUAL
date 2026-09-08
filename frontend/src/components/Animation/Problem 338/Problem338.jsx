import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem338.css";

export default function Problem338({ stepData }) {
  const {
    dp = [0, 0, 0, 0, 0, 0],
    currentI = null,
    state = {},
    output
  } = stepData || {};

  const offset = state.offset ?? 1;

  return (
    <div className="canvas-wrapper bits-canvas">
      {/* Top Metrics Row */}
      <div className="metrics-row">
        <span className="metric-chip offset-chip">
          Power-of-2 Offset: <b>{offset}</b>
        </span>
        {currentI !== null && (
          <span className="metric-chip active-chip">
            Inspecting: <b>i = {currentI}</b>
          </span>
        )}
        <span className="metric-chip formula-chip">
          Relation: <b>dp[i] = 1 + dp[i - {offset}]</b>
        </span>
      </div>

      <div className="bits-stage">
        <div className="dp-grid-card">
          <div className="card-header-bar">
            <span>DP Bit-Count Array & Binary Representation</span>
            <span className="sub-tag">0 ➔ {dp.length - 1}</span>
          </div>

          <div className="dp-cells-track">
            {dp.map((count, idx) => {
              const isActive = idx === currentI;
              const isSource = currentI !== null && idx === currentI - offset;
              const binaryStr = idx.toString(2).padStart(3, "0");

              return (
                <div key={`dp-col-${idx}`} className="dp-cell-column">
                  {/* Binary string tag */}
                  <span className={`binary-tag ${isActive ? "bin-active" : ""}`}>
                    {binaryStr}
                  </span>

                  {/* DP Count Box */}
                  <motion.div
                    className={`dp-box ${isActive ? "box-target" : ""} ${
                      isSource ? "box-source" : ""
                    }`}
                    animate={{ scale: isActive ? 1.08 : 1 }}
                    transition={{ type: "spring", stiffness: 350, damping: 20 }}
                  >
                    {count}
                  </motion.div>

                  {/* Subtitle labels */}
                  <span className="idx-tag">i={idx}</span>
                  {isActive && <span className="pointer-pill pill-target">TARGET</span>}
                  {isSource && <span className="pointer-pill pill-source">i - {offset}</span>}
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