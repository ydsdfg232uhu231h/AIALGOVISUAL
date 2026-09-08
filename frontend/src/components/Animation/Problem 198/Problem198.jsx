import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem198.css";

export default function Problem198({ stepData }) {
  const {
    houses = [],
    currentHouse = -1,
    state = {},
    output
  } = stepData || {};

  const { rob1 = 0, rob2 = 0, val, status, maxRobbed } = state;
  const isComplete = status === "COMPLETED";

  return (
    <div className="canvas-wrapper house-robber-canvas">
      {/* Metrics Row */}
      <div className="metrics-row">
        {val !== undefined && (
          <span className="metric-chip curr-house-chip">
            Current: <b>House {currentHouse} (${val})</b>
          </span>
        )}
        <span className="metric-chip rob1-chip">
          rob1 (i - 2): <b>${rob1}</b>
        </span>
        <span className="metric-chip rob2-chip">
          rob2 (i - 1): <b>${rob2}</b>
        </span>
        {val !== undefined && (
          <span className="metric-chip formula-chip">
            max(${val} + {rob1}, {rob2}) = <b>${Math.max(val + rob1, rob2)}</b>
          </span>
        )}
        {maxRobbed !== undefined && (
          <span className="metric-chip total-chip">
            Max Stolen: <b>${maxRobbed}</b>
          </span>
        )}
      </div>

      {/* Houses Strip */}
      <div className="houses-track">
        {/* Virtual Base Anchor for i - 2 when at House 0 or House 1 */}
        {currentHouse <= 1 && currentHouse >= 0 && (
          <div className="house-column base-column">
            <div className="ptrs-group">
              {currentHouse === 0 && <span className="pointer-tag ptr-rob1">rob1</span>}
              {currentHouse === 1 && <span className="pointer-tag ptr-rob1">rob1</span>}
            </div>
            <div className="house-node house-base-node">
              <div className="roof-shape base-roof" />
              <div className="house-body base-body">
                <span className="loot-val">$0</span>
                <span className="house-idx">base</span>
              </div>
            </div>
          </div>
        )}

        {houses.map((loot, idx) => {
          const isCurrent = idx === currentHouse;
          // rob2 is ALWAYS 1 house back (i - 1)
          const isRob2 = currentHouse >= 1 && idx === currentHouse - 1;
          // rob1 is ALWAYS 2 houses back (i - 2)
          const isRob1 = currentHouse >= 2 && idx === currentHouse - 2;
          const isEvaluated = idx <= currentHouse;

          return (
            <div key={idx} className="house-column">
              {/* Pointer Badges */}
              <div className="ptrs-group">
                {isRob1 && <span className="pointer-tag ptr-rob1">rob1</span>}
                {isRob2 && <span className="pointer-tag ptr-rob2">rob2</span>}
                {isCurrent && !isComplete && <span className="pointer-tag ptr-curr">curr</span>}
              </div>

              {/* House Card */}
              <motion.div
                className={`house-node ${isCurrent ? "house-curr" : ""} ${
                  isEvaluated ? "house-active" : "house-pending"
                }`}
                animate={{
                  scale: isCurrent ? 1.1 : 1
                }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                <div className="roof-shape" />
                <div className="house-body">
                  <span className="loot-val">${loot}</span>
                  <span className="house-idx">H[{idx}]</span>
                </div>
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