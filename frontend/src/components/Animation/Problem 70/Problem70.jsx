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
    <div id="p70-climb-canvas">
      {/* Dynamic Status Badges */}
      <div id="p70-metrics-row">
        <span id="p70-metric-chip-target">
          Target Stairs: <b>n = {n}</b>
        </span>
        {one !== null && (
          <span id="p70-metric-chip-one">
            one (i - 2): <b>{one}</b>
          </span>
        )}
        {two !== null && (
          <span id="p70-metric-chip-two">
            two (i - 1): <b>{two}</b>
          </span>
        )}
        <span id="p70-metric-chip-current">
          Evaluating: <b>Step {currentStep}</b>
        </span>
        {ways && (
          <span id="p70-metric-chip-ways">
            Total Ways: <b>{ways}</b>
          </span>
        )}
      </div>

      {/* Ascending Stairs Track */}
      <div id="p70-stairs-track">
        {totalSteps.map((stepNum) => {
          const computedWays = stepsList[stepNum - 1];
          const isCurrent = stepNum === currentStep;
          const isTarget = stepNum === n;

          const isOne = !isComplete && currentStep > 2 && stepNum === currentStep - 2;
          const isTwo = !isComplete && currentStep > 2 && stepNum === currentStep - 1;

          let nodeState = "idle";
          if (isTarget && isComplete) nodeState = "complete";
          else if (computedWays !== undefined) nodeState = "computed";

          return (
            <div key={`p70-col-${stepNum}`} id={`p70-stair-column-${stepNum}`}>
              {/* Pointer Badges */}
              <div id={`p70-ptrs-track-${stepNum}`}>
                <AnimatePresence mode="popLayout">
                  {isOne && (
                    <motion.span
                      key={`p70-ptr-one-${stepNum}`}
                      id={`p70-ptr-pill-one-${stepNum}`}
                      data-ptr="one"
                      layout
                      initial={{ y: -6, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -6, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 450, damping: 25 }}
                    >
                      one
                    </motion.span>
                  )}
                  {isTwo && (
                    <motion.span
                      key={`p70-ptr-two-${stepNum}`}
                      id={`p70-ptr-pill-two-${stepNum}`}
                      data-ptr="two"
                      layout
                      initial={{ y: -6, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -6, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 450, damping: 25 }}
                    >
                      two
                    </motion.span>
                  )}
                  {isCurrent && !isComplete && (
                    <motion.span
                      key={`p70-ptr-curr-${stepNum}`}
                      id={`p70-ptr-pill-curr-${stepNum}`}
                      data-ptr="curr"
                      layout
                      initial={{ y: -6, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -6, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 450, damping: 25 }}
                    >
                      curr
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Step Pillar */}
              <motion.div
                id={`p70-stair-node-${stepNum}`}
                data-state={nodeState}
                data-active={isCurrent ? "true" : "false"}
                layout
                style={{ "--step-index": stepNum }}
                animate={{
                  scale: isCurrent ? 1.05 : 1,
                  borderColor:
                    isTarget && isComplete
                      ? "#22c55e"
                      : isCurrent
                      ? "#38bdf8"
                      : computedWays !== undefined
                      ? "#3f3f46"
                      : "#27272a"
                }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                <div id={`p70-stair-ways-${stepNum}`}>
                  {computedWays !== undefined ? `${computedWays} ways` : "..."}
                </div>
                <div id={`p70-stair-label-${stepNum}`}>Step {stepNum}</div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Output Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p70-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div id="p70-callout-header-text">{output.label}</div>
            <div id="p70-callout-val-text">{output.value}</div>
            <div id="p70-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}