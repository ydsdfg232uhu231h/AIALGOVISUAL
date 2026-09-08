import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem70.css";

export default function Problem70({ stepData }) {
  const {
    stepsList = [],
    currentStep = 1,
    state = {},
    output
  } = stepData || {};

  const { n = 5, one = null, two = null, ways, status } = state;
  const isComplete = status === "COMPLETED";

  // Render all stair steps 1 to n
  const totalSteps = Array.from({ length: n }, (_, idx) => idx + 1);

  return (
    <div className="canvas-wrapper climb-canvas">
      {/* Dynamic Status Badges */}
      <div className="metrics-row">
        <span className="metric-chip target-chip">
          Target Stairs: <b>n = {n}</b>
        </span>
        {one !== null && (
          <span className="metric-chip one-chip">
            one (i - 2): <b>{one}</b>
          </span>
        )}
        {two !== null && (
          <span className="metric-chip two-chip">
            two (i - 1): <b>{two}</b>
          </span>
        )}
        <span className="metric-chip current-chip">
          Evaluating: <b>Step {currentStep}</b>
        </span>
        {ways && (
          <span className="metric-chip ways-chip">
            Total Ways: <b>{ways}</b>
          </span>
        )}
      </div>

      {/* Ascending Stairs Track */}
      <div className="stairs-track">
        {totalSteps.map((stepNum) => {
          const computedWays = stepsList[stepNum - 1];
          const isCurrent = stepNum === currentStep;
          const isTarget = stepNum === n;

          const isOne = !isComplete && currentStep > 2 && stepNum === currentStep - 2;
          const isTwo = !isComplete && currentStep > 2 && stepNum === currentStep - 1;

          return (
            <div key={stepNum} className="stair-column">
              {/* Pointer Badges */}
              <div className="ptrs-track">
                {isOne && <span className="ptr-pill ptr-one">one</span>}
                {isTwo && <span className="ptr-pill ptr-two">two</span>}
                {isCurrent && !isComplete && <span className="ptr-pill ptr-curr">curr</span>}
              </div>

              {/* Step Pillar */}
              <motion.div
                className={`stair-node ${computedWays ? "stair-computed" : "stair-idle"} ${
                  isTarget && isComplete ? "stair-complete" : ""
                }`}
                style={{ height: `${48 + stepNum * 26}px` }}
                animate={{
                  scale: isCurrent ? 1.05 : 1,
                  borderColor:
                    isTarget && isComplete
                      ? "#22c55e"
                      : isCurrent
                      ? "#38bdf8"
                      : computedWays
                      ? "#3f3f46"
                      : "#27272a"
                }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                <div className="stair-ways">
                  {computedWays !== undefined ? `${computedWays} ways` : "..."}
                </div>
                <div className="stair-label">Step {stepNum}</div>
              </motion.div>
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