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
    <div id="p238-prod-canvas">
      {/* Top Metrics Row */}
      <div id="p238-metrics-row">
        <span id="p238-metric-pass" data-pass-type={pass}>
          Pass:{" "}
          <b>
            {pass === "prefix"
              ? "Prefix (Left ➔ Right)"
              : pass === "postfix"
              ? "Postfix (Right ➔ Left)"
              : "Complete"}
          </b>
        </span>
        <span id="p238-metric-prefix">
          Running Prefix: <b>{prefixVal}</b>
        </span>
        <span id="p238-metric-postfix">
          Running Postfix: <b>{postfixVal}</b>
        </span>
        {currentIdx !== null && (
          <span id="p238-metric-active-idx">
            Current Index: <b>i = {currentIdx}</b>
          </span>
        )}
      </div>

      <div id="p238-prod-stage">
        {/* Input Array Track */}
        <div id="p238-array-card-nums">
          <div id="p238-track-title-row-nums">
            <span id="p238-track-title-nums">Input Array: nums[]</span>
            <span id="p238-track-sub-nums">Source Factors</span>
          </div>
          <div id="p238-array-cells-track-nums">
            {array.map((val, idx) => {
              const isActive = idx === currentIdx;
              return (
                <div key={`p238-nums-${idx}`} id={`p238-cell-col-nums-${idx}`}>
                  <motion.div
                    id={`p238-num-box-${idx}`}
                    data-is-active={isActive ? "true" : "false"}
                    layout
                    animate={{ scale: isActive ? 1.1 : 1 }}
                    transition={{ type: "spring", stiffness: 350, damping: 20 }}
                  >
                    {val}
                  </motion.div>
                  <span id={`p238-idx-tag-nums-${idx}`}>[{idx}]</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Sweep Direction Vector */}
        <div id="p238-pass-direction-banner">
          {pass === "prefix" && (
            <div id="p238-dir-indicator" data-pass-type="prefix">
              <span>➔ PREFIX PASS (res[i] = prefix; prefix *= nums[i]) ➔</span>
            </div>
          )}
          {pass === "postfix" && (
            <div id="p238-dir-indicator" data-pass-type="postfix">
              <span>⬅ POSTFIX PASS (res[i] *= postfix; postfix *= nums[i]) ⬅</span>
            </div>
          )}
          {pass === "done" && (
            <div id="p238-dir-indicator" data-pass-type="done">
              <span>✔ ALL PASSES FINISHED — NO DIVISION USED</span>
            </div>
          )}
        </div>

        {/* Target Result Array Track */}
        <div id="p238-array-card-res">
          <div id="p238-track-title-row-res">
            <span id="p238-track-title-res">Output Array: res[]</span>
            <span id="p238-track-sub-res">Cumulative Product Vector</span>
          </div>
          <div id="p238-array-cells-track-res">
            {res.map((val, idx) => {
              const isActive = idx === currentIdx;
              return (
                <div key={`p238-res-${idx}`} id={`p238-cell-col-res-${idx}`}>
                  <motion.div
                    id={`p238-res-box-${idx}`}
                    data-is-active={isActive ? "true" : "false"}
                    layout
                    animate={{ scale: isActive ? 1.12 : 1 }}
                    transition={{ type: "spring", stiffness: 350, damping: 20 }}
                  >
                    {val}
                  </motion.div>
                  <span id={`p238-idx-tag-res-${idx}`}>res[{idx}]</span>
                  <AnimatePresence mode="popLayout">
                    {isActive && (
                      <motion.span
                        key="p238-target-ptr"
                        layoutId="p238-active-target-ptr"
                        id={`p238-active-arrow-tag-${idx}`}
                        initial={{ y: 6, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 6, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 450, damping: 26 }}
                      >
                        ▲ TARGET
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
            id="p238-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div id="p238-callout-header-text">{output.label}</div>
            <div id="p238-callout-val-text">{output.value}</div>
            <div id="p238-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}