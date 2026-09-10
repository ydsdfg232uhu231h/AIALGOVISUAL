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
    <div id="p338-bits-canvas">
      {/* Top Metrics Row */}
      <div id="p338-metrics-bar">
        <span id="p338-metric-offset">
          Power-of-2 Offset: <b>{offset}</b>
        </span>
        {currentI !== null && (
          <span id="p338-metric-active">
            Inspecting: <b>i = {currentI}</b>
          </span>
        )}
        <span id="p338-metric-formula">
          Relation: <b>dp[i] = 1 + dp[i - {offset}]</b>
        </span>
      </div>

      <div id="p338-bits-stage">
        <div id="p338-dp-grid-card">
          <div id="p338-card-header-bar">
            <span id="p338-card-header-title">DP Bit-Count Array &amp; Binary Representation</span>
            <span id="p338-sub-tag">0 ➔ {dp.length - 1}</span>
          </div>

          <div
            id="p338-dp-cells-track"
            style={{
              gridTemplateColumns: `repeat(${dp.length}, minmax(0, 1fr))`
            }}
          >
            {dp.map((count, idx) => {
              const isActive = idx === currentI;
              const isSource = currentI !== null && idx === currentI - offset;
              const binaryStr = idx.toString(2).padStart(3, "0");

              let boxState = "idle";
              if (isActive) boxState = "target";
              else if (isSource) boxState = "source";

              return (
                <div key={`p338-dp-col-${idx}`} id={`p338-dp-col-${idx}`}>
                  {/* Binary string tag */}
                  <span
                    id={`p338-binary-tag-${idx}`}
                    data-is-active={isActive ? "true" : "false"}
                  >
                    {binaryStr}
                  </span>

                  {/* DP Count Box */}
                  <motion.div
                    id={`p338-dp-box-${idx}`}
                    data-box-state={boxState}
                    layout
                    animate={{ scale: isActive ? 1.08 : 1 }}
                    transition={{ type: "spring", stiffness: 350, damping: 20 }}
                  >
                    {count}
                  </motion.div>

                  {/* Subtitle labels */}
                  <span id={`p338-idx-tag-${idx}`}>i={idx}</span>

                  <AnimatePresence mode="popLayout">
                    {isActive && (
                      <motion.span
                        key="p338-ptr-target"
                        layoutId="p338-pointer-pill-target"
                        id={`p338-pointer-pill-target-${idx}`}
                        data-pill-type="target"
                        initial={{ y: 6, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 6, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 450, damping: 26 }}
                      >
                        TARGET
                      </motion.span>
                    )}
                    {isSource && (
                      <motion.span
                        key="p338-ptr-source"
                        layoutId="p338-pointer-pill-source"
                        id={`p338-pointer-pill-source-${idx}`}
                        data-pill-type="source"
                        initial={{ y: 6, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 6, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 450, damping: 26 }}
                      >
                        i - {offset}
                      </motion.span>
                    )}
                  </AnimatePresence>
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
            id="p338-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div id="p338-callout-header-text">{output.label}</div>
            <div id="p338-callout-val-text">{output.value}</div>
            <div id="p338-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}