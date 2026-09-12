import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem746.css";

export default function Problem746({ stepData }) {
  const {
    costArray = [],
    currentI = null,
    state = {},
    output
  } = stepData || {};

  const { minCost, status } = state;
  const isComplete = status === "COMPLETED";
  const n = costArray.length;

  return (
    <div id="p746-min-cost-canvas">
      {/* Metrics Row */}
      <div id="p746-metrics-bar">
        {currentI !== null && (
          <>
            <span id="p746-metric-current">
              Current Step: <b>Step {currentI}</b>
            </span>
            {currentI + 1 < n && (
              <span id="p746-metric-opt1">
                +1 Step Cost: <b>{costArray[currentI + 1]}</b>
              </span>
            )}
            {currentI + 2 < n && (
              <span id="p746-metric-opt2">
                +2 Steps Cost: <b>{costArray[currentI + 2]}</b>
              </span>
            )}
          </>
        )}
        {minCost !== undefined && (
          <span id="p746-metric-result">
            Minimum Cost to Top: <b>{minCost}</b>
          </span>
        )}
      </div>

      {/* Staircase Track */}
      <div id="p746-stairs-track">
        {costArray.map((costVal, idx) => {
          const isCurrent = idx === currentI;
          const isJump1 = currentI !== null && idx === currentI + 1;
          const isJump2 = currentI !== null && idx === currentI + 2;
          const isOptimalStart = isComplete && costVal === minCost && (idx === 0 || idx === 1);

          let stairState = "idle";
          if (isOptimalStart) stairState = "optimal";
          else if (isCurrent) stairState = "curr";
          else if (isJump1 || isJump2) stairState = "option";

          return (
            <div key={`p746-stair-col-${idx}`} id={`p746-stair-col-${idx}`}>
              {/* Pointer Badges */}
              <div id={`p746-ptrs-group-${idx}`}>
                <AnimatePresence mode="popLayout">
                  {isCurrent && (
                    <motion.span
                      key="p746-ptr-curr"
                      id={`p746-ptr-badge-curr-${idx}`}
                      data-ptr-type="curr"
                      initial={{ y: -6, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -6, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 450, damping: 26 }}
                    >
                      curr (i)
                    </motion.span>
                  )}
                  {isJump1 && (
                    <motion.span
                      key="p746-ptr-j1"
                      id={`p746-ptr-badge-j1-${idx}`}
                      data-ptr-type="jump1"
                      initial={{ y: -6, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -6, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 450, damping: 26 }}
                    >
                      i + 1
                    </motion.span>
                  )}
                  {isJump2 && (
                    <motion.span
                      key="p746-ptr-j2"
                      id={`p746-ptr-badge-j2-${idx}`}
                      data-ptr-type="jump2"
                      initial={{ y: -6, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -6, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 450, damping: 26 }}
                    >
                      i + 2
                    </motion.span>
                  )}
                  {isOptimalStart && (
                    <motion.span
                      key="p746-ptr-best"
                      id={`p746-ptr-badge-best-${idx}`}
                      data-ptr-type="best"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 24 }}
                    >
                      BEST START
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Stair Pillar */}
              <motion.div
                id={`p746-stair-node-${idx}`}
                data-stair-state={stairState}
                style={{ height: `${60 + idx * 28}px` }}
                layout
                animate={{
                  scale: isCurrent || isOptimalStart ? 1.05 : 1
                }}
                transition={{ type: "spring", stiffness: 320, damping: 24 }}
              >
                <div id={`p746-stair-cost-${idx}`}>${costVal}</div>
                <div id={`p746-stair-label-${idx}`}>Step {idx}</div>
              </motion.div>
            </div>
          );
        })}

        {/* Goal / Top of Staircase Platform */}
        <div id="p746-stair-col-top">
          <div id="p746-ptrs-group-top">
            <span id="p746-ptr-badge-goal" data-ptr-type="goal">
              GOAL
            </span>
          </div>
          <div
            id="p746-stair-node-top"
            data-is-goal="true"
            style={{ height: `${60 + n * 28}px` }}
          >
            <div id="p746-stair-cost-top">TOP</div>
            <div id="p746-stair-label-top">Floor</div>
          </div>
        </div>
      </div>

      {/* Output Callout (Elevated safely above playback controls) */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p746-result-callout-box"
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ type: "spring", stiffness: 360, damping: 26 }}
          >
            <div id="p746-callout-header-text">{output.label}</div>
            <div id="p746-callout-val-text">{output.value}</div>
            <div id="p746-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}