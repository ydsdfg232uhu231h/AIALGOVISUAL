import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem875.css";

export default function Problem875({ stepData }) {
  const {
    piles = [],
    k = null,
    calculatedHours = null,
    state = {},
    output
  } = stepData || {};

  const { l = 1, r = 11, res = 11, h = 8, valid } = state;
  const isValid = valid === "True";
  const isInvalid = valid === "False";

  return (
    <div className="canvas-wrapper koko-canvas">
      {/* Metrics & Speed Search Space */}
      <div className="metrics-bar">
        <span className="metric-chip target-chip">
          Target Time (h): <b>{h} hrs</b>
        </span>
        <span className="metric-chip speed-chip">
          Speed Range: l = <b>{l}</b>, r = <b>{r}</b>
        </span>
        {k !== null && (
          <span className="metric-chip test-speed-chip">
            Testing Speed (k): <b>{k} / hr</b>
          </span>
        )}
        <span className="metric-chip res-chip">
          Best Valid Speed (res): <b>{res}</b>
        </span>
      </div>

      {/* Pile Breakdown Cards */}
      <div className="piles-container">
        {piles.map((pile, idx) => {
          const hoursForPile = k ? Math.ceil(pile / k) : null;

          return (
            <motion.div
              key={idx}
              className="pile-card"
              animate={{
                scale: k ? 1.03 : 1
              }}
              transition={{ duration: 0.2 }}
            >
              <div className="pile-header">
                <span className="pile-name">Pile {idx + 1}</span>
                <span className="pile-size">🍌 {pile}</span>
              </div>

              {/* Visual Pile Bar */}
              <div className="pile-bar-bg">
                <div
                  className="pile-bar-fill"
                  style={{ width: `${Math.min(100, (pile / 11) * 100)}%` }}
                />
              </div>

              {/* Hours calculation breakdown: ceil(pile / k) */}
              <div className="hours-calc">
                {k !== null ? (
                  <span>
                    ⌈{pile} / {k}⌉ = <b>{hoursForPile}h</b>
                  </span>
                ) : (
                  <span className="calc-idle">awaiting speed</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Sum Total Verification Bar */}
      {calculatedHours !== null && (
        <div
          className={`validation-banner ${
            isValid ? "banner-valid" : isInvalid ? "banner-invalid" : ""
          }`}
        >
          <span>
            Total Time: <b>{calculatedHours} hrs</b> (Limit: {h} hrs) ➔{" "}
            {isValid
              ? "Fast enough! Try slower speed to minimize k (r = k - 1)."
              : "Too slow! Must increase speed (l = k + 1)."}
          </span>
        </div>
      )}

      {/* Output Result Callout */}
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