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

  let validityState = "idle";
  if (isValid) validityState = "valid";
  else if (isInvalid) validityState = "invalid";

  return (
    <div id="p875-koko-canvas">
      {/* Metrics & Speed Search Space */}
      <div id="p875-metrics-bar">
        <span id="p875-metric-target">
          Target Time (h): <b>{h} hrs</b>
        </span>
        <span id="p875-metric-speed">
          Speed Range: l = <b>{l}</b>, r = <b>{r}</b>
        </span>
        {k !== null && (
          <span id="p875-metric-test-speed">
            Testing Speed (k): <b>{k} / hr</b>
          </span>
        )}
        <span id="p875-metric-res">
          Best Valid Speed (res): <b>{res}</b>
        </span>
      </div>

      {/* Pile Breakdown Cards */}
      <div id="p875-piles-container">
        {piles.map((pile, idx) => {
          const hoursForPile = k ? Math.ceil(pile / k) : null;

          return (
            <motion.div
              key={`p875-pile-${idx}`}
              id={`p875-pile-card-${idx}`}
              data-is-testing={k !== null ? "true" : "false"}
              layout
              animate={{
                scale: k ? 1.03 : 1
              }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
            >
              <div id={`p875-pile-header-${idx}`}>
                <span id={`p875-pile-name-${idx}`}>Pile {idx + 1}</span>
                <span id={`p875-pile-size-${idx}`}>🍌 {pile}</span>
              </div>

              {/* Visual Pile Bar */}
              <div id={`p875-pile-bar-bg-${idx}`}>
                <motion.div
                  id={`p875-pile-bar-fill-${idx}`}
                  animate={{
                    width: `${Math.min(100, (pile / 11) * 100)}%`
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>

              {/* Hours calculation breakdown: ceil(pile / k) */}
              <div id={`p875-hours-calc-${idx}`}>
                {k !== null ? (
                  <span>
                    ⌈{pile} / {k}⌉ = <b>{hoursForPile}h</b>
                  </span>
                ) : (
                  <span id={`p875-calc-idle-${idx}`}>awaiting speed</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Sum Total Verification Bar */}
      {calculatedHours !== null && (
        <motion.div
          id="p875-validation-banner"
          data-validity={validityState}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <span>
            Total Time: <b>{calculatedHours} hrs</b> (Limit: {h} hrs) ➔{" "}
            {isValid
              ? "Fast enough! Try slower speed to minimize k (r = k - 1)."
              : "Too slow! Must increase speed (l = k + 1)."}
          </span>
        </motion.div>
      )}

      {/* Output Result Callout (Elevated safely above playback controls) */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p875-result-callout-box"
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ type: "spring", stiffness: 360, damping: 26 }}
          >
            <div id="p875-callout-header-text">{output.label}</div>
            <div id="p875-callout-val-text">{output.value}</div>
            <div id="p875-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}