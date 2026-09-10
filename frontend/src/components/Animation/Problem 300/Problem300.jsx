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
    <div id="p300-lis-canvas">
      {/* Metrics Row */}
      <div id="p300-metrics-bar">
        {i !== null && (
          <span id="p300-metric-i">
            Outer (i = {i}): <b>nums[{i}] = {nums[i]}</b>
          </span>
        )}
        {j !== null && (
          <span id="p300-metric-j">
            Comparing (j = {j}): <b>nums[{j}] = {nums[j]}</b>
          </span>
        )}
        {i !== null && j !== null && (
          <span
            id="p300-metric-check"
            data-check-valid={nums[i] < nums[j] ? "true" : "false"}
          >
            {nums[i]} &lt; {nums[j]} ?{" "}
            <b>{nums[i] < nums[j] ? `YES (1 + LIS[${j}])` : "NO (skip)"}</b>
          </span>
        )}
        {maxLIS !== undefined && (
          <span id="p300-metric-max">
            Max LIS Length: <b>{maxLIS}</b>
          </span>
        )}
      </div>

      {/* Dual Row Sequence & DP Track */}
      <div id="p300-lis-track-container">
        {/* Sequence Track (nums) */}
        <div id="p300-track-row-nums">
          <div id="p300-row-header-label-nums">nums:</div>
          <div id="p300-cells-stream-nums">
            {nums.map((val, idx) => {
              const isI = idx === i;
              const isJ = idx === j;
              const isCompatible = i !== null && j !== null && isJ && nums[i] < nums[j];

              let boxState = "idle";
              if (isCompatible) boxState = "compatible";
              else if (isI) boxState = "i";
              else if (isJ) boxState = "j";

              return (
                <div key={`p300-num-${idx}`} id={`p300-lis-col-num-${idx}`}>
                  <div id={`p300-ptrs-group-${idx}`}>
                    <AnimatePresence mode="popLayout">
                      {isI && (
                        <motion.span
                          key="p300-ptr-i"
                          layoutId="p300-ptr-i"
                          id={`p300-pointer-tag-i-${idx}`}
                          data-ptr="i"
                          initial={{ y: -6, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -6, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 450, damping: 26 }}
                        >
                          i
                        </motion.span>
                      )}
                      {isJ && (
                        <motion.span
                          key="p300-ptr-j"
                          layoutId="p300-ptr-j"
                          id={`p300-pointer-tag-j-${idx}`}
                          data-ptr="j"
                          initial={{ y: -6, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -6, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 450, damping: 26 }}
                        >
                          j
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  <motion.div
                    id={`p300-num-box-${idx}`}
                    data-box-state={boxState}
                    layout
                    animate={{
                      scale: isI || isJ ? 1.08 : 1
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 20 }}
                  >
                    <span id={`p300-num-val-${idx}`}>{val}</span>
                    <span id={`p300-idx-tag-${idx}`}>[{idx}]</span>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DP Track (LIS values) */}
        <div id="p300-track-row-lis">
          <div id="p300-row-header-label-lis">LIS[k]:</div>
          <div id="p300-cells-stream-lis">
            {lis.map((val, idx) => {
              const isI = idx === i;
              const isJ = idx === j;
              const isMax = isComplete && val === maxLIS;

              let lisState = "idle";
              if (isMax) lisState = "max";
              else if (isI) lisState = "i";
              else if (isJ) lisState = "j";

              return (
                <div key={`p300-lis-${idx}`} id={`p300-lis-col-dp-${idx}`}>
                  <motion.div
                    id={`p300-lis-box-${idx}`}
                    data-lis-state={lisState}
                    layout
                    animate={{
                      scale: isMax ? 1.1 : isI ? 1.05 : 1
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 20 }}
                  >
                    <span id={`p300-lis-val-${idx}`}>{val}</span>
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
            id="p300-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div id="p300-callout-header-text">{output.label}</div>
            <div id="p300-callout-val-text">{output.value}</div>
            <div id="p300-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}