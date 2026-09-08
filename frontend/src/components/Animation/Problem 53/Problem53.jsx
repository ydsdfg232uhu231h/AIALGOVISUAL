import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem53.css";

export default function Problem53({ stepData }) {
  const {
    array = [],
    currentIndex = 0,
    subStart = 0,
    subEnd = 0,
    state = {},
    output
  } = stepData || {};

  const { currSum = 0, maxSum = 0, status } = state;
  const isComplete = status === "COMPLETED";

  return (
    <div className="canvas-wrapper kadane-canvas">
      {/* Dynamic Kadane State Cards */}
      <div className="metrics-row">
        <span className="metric-chip current-chip">
          Current Element (nums[{currentIndex}]): <b>{array[currentIndex] ?? "-"}</b>
        </span>
        <span className={`metric-chip sum-chip ${currSum < 0 ? "neg-chip" : "pos-chip"}`}>
          Current Window Sum: <b>{currSum}</b>
        </span>
        <span className="metric-chip max-chip">
          Global Max Sum: <b>{maxSum}</b>
        </span>
        <span className="metric-chip window-chip">
          Active Subarray: <b>[{subStart}..{subEnd}]</b>
        </span>
      </div>

      {/* Array Element Track */}
      <div className="elements-track">
        {array.map((val, idx) => {
          const inWindow = idx >= subStart && idx <= subEnd;
          const isCurrent = idx === currentIndex;
          const isStart = idx === subStart;
          const isEnd = idx === subEnd;

          return (
            <div key={idx} className="box-column">
              {/* Pointer Badges */}
              <div className="ptrs-group">
                {isStart && <span className="pointer-tag ptr-start">START</span>}
                {isCurrent && <span className="pointer-tag ptr-curr">i</span>}
                {isEnd && !isStart && <span className="pointer-tag ptr-end">END</span>}
              </div>

              {/* Element Box */}
              <motion.div
                className={`box-node ${inWindow ? "box-in-window" : "box-out"} ${
                  isCurrent ? "box-current" : ""
                } ${isComplete && inWindow ? "box-completed" : ""}`}
                animate={{
                  scale: isCurrent ? 1.12 : inWindow ? 1.05 : 0.95,
                  opacity: inWindow || isCurrent ? 1 : 0.35,
                  borderColor: isComplete && inWindow
                    ? "#22c55e"
                    : isCurrent
                    ? "#38bdf8"
                    : inWindow
                    ? "#eab308"
                    : "#27272a"
                }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                {val}
              </motion.div>

              <span className="idx-tag">[{idx}]</span>
            </div>
          );
        })}
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