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
    <div id="p268-xor-canvas">
      {/* Top Metrics Row */}
      <div id="p268-metrics-bar">
        <span id="p268-metric-range">
          Range: <b>[0 .. {n}]</b>
        </span>
        <span id="p268-metric-xor-accum">
          Running XOR (res): <b>{xorValue}</b>
          <span id="p268-metric-binary-sub">
            ({xorValue.toString(2).padStart(3, "0")})
          </span>
        </span>
        {currentI !== null && currentI >= 0 && (
          <span id="p268-metric-active-status">
            Index: <b>i = {currentI}</b> | Value:{" "}
            <b>nums[{currentI}] = {currentNum}</b>
          </span>
        )}
      </div>

      <div id="p268-xor-stage">
        {/* Track 1: Expected Range [0 .. n] */}
        <div id="p268-track-card-expected">
          <div id="p268-track-header-expected">
            <span id="p268-track-title-expected">1. Expected Range (0 .. {n})</span>
            <span id="p268-track-hint-expected">Every value that SHOULD exist</span>
          </div>

          <div
            id="p268-range-slots-grid"
            style={{
              gridTemplateColumns: `repeat(${n + 1}, minmax(0, 1fr))`
            }}
          >
            {Array.from({ length: n + 1 }).map((_, idx) => {
              const isActive = activeComponent === "index" && currentI === idx;
              const isDone = cancelledRange.includes(idx);

              let boxState = "idle";
              if (isActive) boxState = "active";
              else if (isDone) boxState = "cancelled";

              return (
                <div key={`p268-range-${idx}`} id={`p268-range-col-${idx}`}>
                  <motion.div
                    id={`p268-expected-box-${idx}`}
                    data-track="expected"
                    data-box-state={boxState}
                    layout
                    animate={{ scale: isActive ? 1.12 : 1 }}
                    transition={{ type: "spring", stiffness: 350, damping: 20 }}
                  >
                    {idx}
                    <AnimatePresence mode="popLayout">
                      {isDone && (
                        <motion.span
                          key={`p268-slash-range-${idx}`}
                          id={`p268-cancel-slash-range-${idx}`}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 450, damping: 22 }}
                        >
                          ✕
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  <span id={`p268-range-slot-sub-${idx}`}>val={idx}</span>
                  <AnimatePresence mode="popLayout">
                    {isActive && (
                      <motion.span
                        key="p268-ptr-idx"
                        layoutId="p268-pointer-tag-idx"
                        id="p268-pointer-tag-idx"
                        data-pointer-type="idx"
                        initial={{ y: 6, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 6, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 450, damping: 26 }}
                      >
                        ▲ XOR i
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic XOR Circuit Indicator */}
        <div id="p268-xor-gate-banner">
          <div id="p268-gate-pill">
            <span id="p268-gate-symbol">⊕ (XOR)</span>
            <span id="p268-gate-desc">
              {state.operationDesc || `res = n = ${n} (initial setup)`}
            </span>
          </div>
        </div>

        {/* Track 2: Input Array nums[] */}
        <div id="p268-track-card-actual">
          <div id="p268-track-header-actual">
            <span id="p268-track-title-actual">2. Array Elements (nums[])</span>
            <span id="p268-track-hint-actual">Actual present values</span>
          </div>

          <div
            id="p268-actual-slots-grid"
            style={{
              gridTemplateColumns: `repeat(${array.length}, minmax(0, 1fr))`
            }}
          >
            {array.map((val, idx) => {
              const isActive = activeComponent === "value" && currentI === idx;
              const isDone = cancelledArray.includes(idx);

              let boxState = "idle";
              if (isActive) boxState = "active";
              else if (isDone) boxState = "cancelled";

              return (
                <div key={`p268-actual-${idx}`} id={`p268-actual-col-${idx}`}>
                  <motion.div
                    id={`p268-actual-box-${idx}`}
                    data-track="actual"
                    data-box-state={boxState}
                    layout
                    animate={{ scale: isActive ? 1.12 : 1 }}
                    transition={{ type: "spring", stiffness: 350, damping: 20 }}
                  >
                    {val}
                    <AnimatePresence mode="popLayout">
                      {isDone && (
                        <motion.span
                          key={`p268-slash-actual-${idx}`}
                          id={`p268-cancel-slash-actual-${idx}`}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 450, damping: 22 }}
                        >
                          ✕
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  <span id={`p268-actual-slot-sub-${idx}`}>nums[{idx}]</span>
                  <AnimatePresence mode="popLayout">
                    {isActive && (
                      <motion.span
                        key="p268-ptr-val"
                        layoutId="p268-pointer-tag-val"
                        id="p268-pointer-tag-val"
                        data-pointer-type="val"
                        initial={{ y: 6, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 6, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 450, damping: 26 }}
                      >
                        ▲ XOR val
                      </motion.span>
                    )}
                  </AnimatePresence>
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
            id="p268-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div id="p268-callout-header-text">{output.label}</div>
            <div id="p268-callout-val-text">{output.value}</div>
            <div id="p268-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}