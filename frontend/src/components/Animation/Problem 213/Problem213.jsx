import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem213.css";

export default function Problem213({ stepData }) {
  const {
    houses = [],
    activeRange = [],
    state = {},
    output
  } = stepData || {};

  const {
    currentPass = 1,
    currentHouse = -1,
    val,
    r1 = 0,
    r2 = 0,
    maxPass1,
    maxPass2,
    maxLoot,
    status
  } = state;

  const isComplete = status === "COMPLETED";
  const [rangeStart, rangeEnd] = activeRange.length === 2 ? activeRange : [-1, -1];

  // Helper to render the two base columns (i - 2 and i - 1) before the active pass starts
  const renderVirtualBases = () => {
    // Relative offset of currentHouse from start of the range
    const relIndex = currentHouse - rangeStart;

    // r1 is at Base 1 when relIndex === 0, and at Base 2 when relIndex === 1
    const isR1AtBase1 = !isComplete && relIndex === 0;
    const isR1AtBase2 = !isComplete && relIndex === 1;

    // r2 is at Base 2 when relIndex === 0
    const isR2AtBase2 = !isComplete && relIndex === 0;

    return [
      <div key="base-col-1" className="house-column base-column">
        <div className="ptrs-group">
          {isR1AtBase1 && <span className="pointer-tag ptr-r1">r1: ${r1}</span>}
        </div>
        <div className="house-node house-base-node">
          <div className="roof-shape base-roof" />
          <div className="house-body base-body">
            <span className="loot-val">$0</span>
            <span className="house-idx">B[-2]</span>
          </div>
        </div>
      </div>,
      <div key="base-col-2" className="house-column base-column">
        <div className="ptrs-group">
          {isR1AtBase2 && <span className="pointer-tag ptr-r1">r1: ${r1}</span>}
          {isR2AtBase2 && <span className="pointer-tag ptr-r2">r2: ${r2}</span>}
        </div>
        <div className="house-node house-base-node">
          <div className="roof-shape base-roof" />
          <div className="house-body base-body">
            <span className="loot-val">$0</span>
            <span className="house-idx">B[-1]</span>
          </div>
        </div>
      </div>
    ];
  };

  return (
    <div className="canvas-wrapper circular-robber-canvas">
      {/* State & Metrics Ribbon */}
      <div className="metrics-row">
        <span className={`metric-chip pass-chip ${currentPass === 1 ? "pass-one" : "pass-two"}`}>
          Phase: <b>{isComplete ? "Completed" : `Pass ${currentPass}: Range [${rangeStart}..${rangeEnd}]`}</b>
        </span>
        {currentHouse >= 0 && val !== undefined && (
          <span className="metric-chip curr-chip">
            House {currentHouse}: <b>${val}</b>
          </span>
        )}
        {!isComplete && currentHouse >= 0 && (
          <>
            <span className="metric-chip r1-chip">
              r1 (i - 2): <b>${r1}</b>
            </span>
            <span className="metric-chip r2-chip">
              r2 (i - 1): <b>${r2}</b>
            </span>
          </>
        )}
        {maxPass1 !== undefined && (
          <span className="metric-chip pass1-res-chip">
            Pass 1 Max: <b>${maxPass1}</b>
          </span>
        )}
        {maxPass2 !== undefined && (
          <span className="metric-chip pass2-res-chip">
            Pass 2 Max: <b>${maxPass2}</b>
          </span>
        )}
        {maxLoot !== undefined && (
          <span className="metric-chip total-chip">
            Best Loot: <b>${maxLoot}</b>
          </span>
        )}
      </div>

      {/* Circular Link Indicator */}
      <div className="circular-link-banner">
        <span>🔄 Circular Street: H[0] and H[{houses.length - 1}] are adjacent</span>
      </div>

      {/* Street Track */}
      <div className="houses-track">
        {houses.map((loot, idx) => {
          const inRange = rangeStart !== -1 && idx >= rangeStart && idx <= rangeEnd;
          const isCurrent = idx === currentHouse;
          const isExcluded = rangeStart !== -1 && !inRange;

          // r1 is at a real house only when currentHouse is >= 2 houses past rangeStart
          const isR1 =
            !isComplete &&
            currentHouse - rangeStart >= 2 &&
            idx === currentHouse - 2;

          // r2 is at a real house only when currentHouse is >= 1 house past rangeStart
          const isR2 =
            !isComplete &&
            currentHouse - rangeStart >= 1 &&
            idx === currentHouse - 1;

          const elements = [];

          // Inject the 2 virtual base houses directly before the active range begins
          if (idx === rangeStart) {
            elements.push(...renderVirtualBases());
          }

          elements.push(
            <div key={idx} className="house-column">
              {/* Pointer Badges */}
              <div className="ptrs-group">
                {isR1 && inRange && <span className="pointer-tag ptr-r1">r1: ${r1}</span>}
                {isR2 && inRange && <span className="pointer-tag ptr-r2">r2: ${r2}</span>}
                {isCurrent && !isComplete && <span className="pointer-tag ptr-curr">curr</span>}
                {isExcluded && <span className="pointer-tag ptr-excl">EXCLUDED</span>}
              </div>

              {/* House Node */}
              <motion.div
                className={`house-node ${isCurrent ? "house-curr" : ""} ${
                  isExcluded ? "house-excluded" : inRange ? "house-in-range" : ""
                }`}
                animate={{
                  scale: isCurrent ? 1.08 : 1,
                  opacity: isExcluded ? 0.35 : 1
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

          return elements;
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