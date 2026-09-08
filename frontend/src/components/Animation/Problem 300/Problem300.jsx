import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem300.css";

export default function Problem300({ stepData }) {
  const {
    nums = [],
    lis = [],
    i = null,
    j = null,
    state = {},
    output
  } = stepData || {};

  const { maxLIS, status } = state;
  const isComplete = status === "COMPLETED";

  return (
    <div className="canvas-wrapper lis-canvas">
      {/* Metrics Row */}
      <div className="metrics-row">
        {i !== null && (
          <span className="metric-chip i-chip">
            Outer (i = {i}): <b>nums[{i}] = {nums[i]}</b>
          </span>
        )}
        {j !== null && (
          <span className="metric-chip j-chip">
            Comparing (j = {j}): <b>nums[{j}] = {nums[j]}</b>
          </span>
        )}
        {i !== null && j !== null && (
          <span className={`metric-chip ${nums[i] < nums[j] ? "valid-chip" : "invalid-chip"}`}>
            {nums[i]} &lt; {nums[j]} ? <b>{nums[i] < nums[j] ? `YES (1 + LIS[${j}])` : "NO (skip)"}</b>
          </span>
        )}
        {maxLIS !== undefined && (
          <span className="metric-chip max-chip">
            Max LIS Length: <b>{maxLIS}</b>
          </span>
        )}
      </div>

      {/* Dual Row Sequence & DP Track */}
      <div className="lis-track-container">
        {/* Sequence Track (nums) */}
        <div className="track-row">
          <div className="row-header-label">nums:</div>
          <div className="cells-stream">
            {nums.map((val, idx) => {
              const isI = idx === i;
              const isJ = idx === j;
              const isCompatible = i !== null && j !== null && isJ && nums[i] < nums[j];

              return (
                <div key={`num-${idx}`} className="lis-column">
                  <div className="ptrs-group">
                    {isI && <span className="pointer-tag ptr-i">i</span>}
                    {isJ && <span className="pointer-tag ptr-j">j</span>}
                  </div>

                  <motion.div
                    className={`num-box ${isI ? "box-i" : ""} ${isJ ? "box-j" : ""} ${
                      isCompatible ? "box-compatible" : ""
                    }`}
                    animate={{
                      scale: isI || isJ ? 1.08 : 1
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="num-val">{val}</span>
                    <span className="idx-tag">[{idx}]</span>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DP Track (LIS values) */}
        <div className="track-row">
          <div className="row-header-label">LIS[k]:</div>
          <div className="cells-stream">
            {lis.map((val, idx) => {
              const isI = idx === i;
              const isJ = idx === j;
              const isMax = isComplete && val === maxLIS;

              return (
                <div key={`lis-${idx}`} className="lis-column">
                  <motion.div
                    className={`lis-box ${isI ? "lis-box-i" : ""} ${
                      isJ ? "lis-box-j" : ""
                    } ${isMax ? "lis-box-max" : ""}`}
                    animate={{
                      scale: isMax ? 1.1 : isI ? 1.05 : 1
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="lis-val">{val}</span>
                  </motion.div>
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