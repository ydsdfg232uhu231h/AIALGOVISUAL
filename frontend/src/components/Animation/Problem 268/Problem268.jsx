import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem268.css";

export default function Problem268({ stepData }) {
  const {
    array = [3, 0, 1, 6, 4, 2],
    currentI = null,
    xorValue = 6,
    activeComponent = null, // "index" or "value"
    cancelledRange = [],    // Indices cancelled in the range track [0..n]
    cancelledArray = [],    // Indices cancelled in the nums[] array
    state = {},
    output
  } = stepData || {};

  const n = state.n ?? array.length;
  const currentNum =
    state["nums[i]"] ??
    (currentI !== null && currentI >= 0 ? array[currentI] : null);

  return (
    <div id="xor-canvas">
      {/* Top Metrics Row */}
      <div id="metrics-bar">
        <span id="metric-range">
          Range: <b>[0 .. {n}]</b>
        </span>
        <span id="metric-xor-accum">
          Running XOR (res): <b>{xorValue}</b>
          <span id="metric-binary-sub">
            ({xorValue.toString(2).padStart(3, "0")})
          </span>
        </span>
        {currentI !== null && currentI >= 0 && (
          <span id="metric-active-status">
            Index: <b>i = {currentI}</b> | Value:{" "}
            <b>nums[{currentI}] = {currentNum}</b>
          </span>
        )}
      </div>

      <div id="xor-stage">
        {/* Track 1: Expected Range [0 .. n] */}
        <div id="track-card-expected">
          <div id="track-header-expected">
            <span id="track-title-expected">1. Expected Range (0 .. {n})</span>
            <span id="track-hint-expected">Every value that SHOULD exist</span>
          </div>

          <div id="range-slots-grid">
            {Array.from({ length: n + 1 }).map((_, idx) => {
              const isActive = activeComponent === "index" && currentI === idx;
              const isDone = cancelledRange.includes(idx);

              let boxId = `expected-box-idle-${idx}`;
              if (isActive) boxId = `expected-box-active-${idx}`;
              else if (isDone) boxId = `expected-box-cancelled-${idx}`;

              return (
                <div key={`range-${idx}`} id={`range-col-${idx}`}>
                  <motion.div
                    id={boxId}
                    animate={{ scale: isActive ? 1.15 : 1 }}
                    transition={{ type: "spring", stiffness: 350, damping: 20 }}
                  >
                    {idx}
                    {isDone && <span id={`cancel-slash-range-${idx}`}>✕</span>}
                  </motion.div>
                  <span id={`range-slot-sub-${idx}`}>val={idx}</span>
                  {isActive && <span id="pointer-tag-idx">▲ XOR i</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic XOR Circuit Indicator */}
        <div id="xor-gate-banner">
          <div id="gate-pill">
            <span id="gate-symbol">⊕ (XOR)</span>
            <span id="gate-desc">
              {state.operationDesc || `res = n = ${n} (initial setup)`}
            </span>
          </div>
        </div>

        {/* Track 2: Input Array nums[] */}
        <div id="track-card-actual">
          <div id="track-header-actual">
            <span id="track-title-actual">2. Array Elements (nums[])</span>
            <span id="track-hint-actual">Actual present values</span>
          </div>

          <div id="actual-slots-grid">
            {array.map((val, idx) => {
              const isActive = activeComponent === "value" && currentI === idx;
              const isDone = cancelledArray.includes(idx);

              let boxId = `actual-box-idle-${idx}`;
              if (isActive) boxId = `actual-box-active-${idx}`;
              else if (isDone) boxId = `actual-box-cancelled-${idx}`;

              return (
                <div key={`actual-${idx}`} id={`actual-col-${idx}`}>
                  <motion.div
                    id={boxId}
                    animate={{ scale: isActive ? 1.15 : 1 }}
                    transition={{ type: "spring", stiffness: 350, damping: 20 }}
                  >
                    {val}
                    {isDone && <span id={`cancel-slash-actual-${idx}`}>✕</span>}
                  </motion.div>
                  <span id={`actual-slot-sub-${idx}`}>nums[{idx}]</span>
                  {isActive && <span id="pointer-tag-val">▲ XOR val</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Result Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div id="callout-header-text">{output.label}</div>
            <div id="callout-val-text">{output.value}</div>
            <div id="callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}