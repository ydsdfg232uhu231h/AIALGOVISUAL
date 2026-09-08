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
    <div className="canvas-wrapper min-cost-canvas">
      {/* Metrics Row */}
      <div className="metrics-row">
        {currentI !== null && (
          <>
            <span className="metric-chip current-chip">
              Current Step: <b>Step {currentI}</b>
            </span>
            {currentI + 1 < n && (
              <span className="metric-chip opt1-chip">
                +1 Step Cost: <b>{costArray[currentI + 1]}</b>
              </span>
            )}
            {currentI + 2 < n && (
              <span className="metric-chip opt2-chip">
                +2 Steps Cost: <b>{costArray[currentI + 2]}</b>
              </span>
            )}
          </>
        )}
        {minCost !== undefined && (
          <span className="metric-chip result-chip">
            Minimum Cost to Top: <b>{minCost}</b>
          </span>
        )}
      </div>

      {/* Staircase Track */}
      <div className="stairs-track">
        {costArray.map((costVal, idx) => {
          const isCurrent = idx === currentI;
          const isJump1 = currentI !== null && idx === currentI + 1;
          const isJump2 = currentI !== null && idx === currentI + 2;
          const isOptimalStart = isComplete && costVal === minCost && (idx === 0 || idx === 1);

          return (
            <div key={`stair-${idx}`} className="stair-column">
              {/* Pointer Badges */}
              <div className="ptrs-group">
                {isCurrent && <span className="pointer-tag ptr-curr">curr (i)</span>}
                {isJump1 && <span className="pointer-tag ptr-jump1">i + 1</span>}
                {isJump2 && <span className="pointer-tag ptr-jump2">i + 2</span>}
                {isOptimalStart && <span className="pointer-tag ptr-best">BEST START</span>}
              </div>

              {/* Stair Pillar */}
              <motion.div
                className={`stair-node ${isCurrent ? "stair-curr" : ""} ${
                  isJump1 || isJump2 ? "stair-option" : ""
                } ${isOptimalStart ? "stair-optimal" : ""}`}
                style={{ height: `${60 + idx * 28}px` }}
                animate={{
                  scale: isCurrent || isOptimalStart ? 1.05 : 1
                }}
                transition={{ duration: 0.2 }}
              >
                <div className="stair-cost">${costVal}</div>
                <div className="stair-label">Step {idx}</div>
              </motion.div>
            </div>
          );
        })}

        {/* Goal / Top of Staircase Platform */}
        <div className="stair-column top-column">
          <div className="ptrs-group">
            <span className="pointer-tag ptr-goal">GOAL</span>
          </div>
          <div className="stair-node top-node" style={{ height: `${60 + n * 28}px` }}>
            <div className="stair-cost">TOP</div>
            <div className="stair-label">Floor</div>
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