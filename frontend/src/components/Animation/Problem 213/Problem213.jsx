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
      <div key="p213-base-col-1" id="p213-base-column-1" data-house-state="base">
        <div id="p213-ptrs-group-base-1">
          <AnimatePresence mode="popLayout">
            {isR1AtBase1 && (
              <motion.span
                key="p213-ptr-r1-b1"
                layoutId="p213-ptr-r1"
                id="p213-pointer-tag-r1-b1"
                data-ptr="r1"
                initial={{ y: -6, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -6, opacity: 0 }}
                transition={{ type: "spring", stiffness: 450, damping: 26 }}
              >
                r1: ${r1}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <div id="p213-house-node-base-1">
          <div id="p213-roof-shape-base-1" />
          <div id="p213-house-body-base-1">
            <span id="p213-loot-val-base-1">$0</span>
            <span id="p213-house-idx-base-1">B[-2]</span>
          </div>
        </div>
      </div>,
      <div key="p213-base-col-2" id="p213-base-column-2" data-house-state="base">
        <div id="p213-ptrs-group-base-2">
          <AnimatePresence mode="popLayout">
            {isR1AtBase2 && (
              <motion.span
                key="p213-ptr-r1-b2"
                layoutId="p213-ptr-r1"
                id="p213-pointer-tag-r1-b2"
                data-ptr="r1"
                initial={{ y: -6, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -6, opacity: 0 }}
                transition={{ type: "spring", stiffness: 450, damping: 26 }}
              >
                r1: ${r1}
              </motion.span>
            )}
            {isR2AtBase2 && (
              <motion.span
                key="p213-ptr-r2-b2"
                layoutId="p213-ptr-r2"
                id="p213-pointer-tag-r2-b2"
                data-ptr="r2"
                initial={{ y: -6, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -6, opacity: 0 }}
                transition={{ type: "spring", stiffness: 450, damping: 26 }}
              >
                r2: ${r2}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <div id="p213-house-node-base-2">
          <div id="p213-roof-shape-base-2" />
          <div id="p213-house-body-base-2">
            <span id="p213-loot-val-base-2">$0</span>
            <span id="p213-house-idx-base-2">B[-1]</span>
          </div>
        </div>
      </div>
    ];
  };

  return (
    <div id="p213-circular-robber-canvas">
      {/* State & Metrics Ribbon */}
      <div id="p213-metrics-row">
        <span
          id="p213-metric-phase"
          data-pass-type={currentPass === 1 ? "one" : "two"}
        >
          Phase: <b>{isComplete ? "Completed" : `Pass ${currentPass}: Range [${rangeStart}..${rangeEnd}]`}</b>
        </span>
        {currentHouse >= 0 && val !== undefined && (
          <span id="p213-metric-curr">
            House {currentHouse}: <b>${val}</b>
          </span>
        )}
        {!isComplete && currentHouse >= 0 && (
          <>
            <span id="p213-metric-r1">
              r1 (i - 2): <b>${r1}</b>
            </span>
            <span id="p213-metric-r2">
              r2 (i - 1): <b>${r2}</b>
            </span>
          </>
        )}
        {maxPass1 !== undefined && (
          <span id="p213-metric-pass1-res">
            Pass 1 Max: <b>${maxPass1}</b>
          </span>
        )}
        {maxPass2 !== undefined && (
          <span id="p213-metric-pass2-res">
            Pass 2 Max: <b>${maxPass2}</b>
          </span>
        )}
        {maxLoot !== undefined && (
          <span id="p213-metric-total">
            Best Loot: <b>${maxLoot}</b>
          </span>
        )}
      </div>

      {/* Circular Link Indicator */}
      <div id="p213-circular-link-banner">
        <span>🔄 Circular Street: H[0] and H[{houses.length - 1}] are adjacent</span>
      </div>

      {/* Street Track */}
      <div id="p213-houses-track">
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

          let houseState = "idle";
          if (isCurrent) houseState = "curr";
          else if (isExcluded) houseState = "excluded";
          else if (inRange) houseState = "range";

          elements.push(
            <div key={`p213-house-col-${idx}`} id={`p213-house-column-${idx}`}>
              {/* Pointer Badges */}
              <div id={`p213-ptrs-group-${idx}`}>
                <AnimatePresence mode="popLayout">
                  {isR1 && inRange && (
                    <motion.span
                      key="p213-ptr-r1"
                      layoutId="p213-ptr-r1"
                      id={`p213-pointer-tag-r1-${idx}`}
                      data-ptr="r1"
                      initial={{ y: -6, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -6, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 450, damping: 26 }}
                    >
                      r1: ${r1}
                    </motion.span>
                  )}
                  {isR2 && inRange && (
                    <motion.span
                      key="p213-ptr-r2"
                      layoutId="p213-ptr-r2"
                      id={`p213-pointer-tag-r2-${idx}`}
                      data-ptr="r2"
                      initial={{ y: -6, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -6, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 450, damping: 26 }}
                    >
                      r2: ${r2}
                    </motion.span>
                  )}
                  {isCurrent && !isComplete && (
                    <motion.span
                      key="p213-ptr-curr"
                      layoutId="p213-ptr-curr"
                      id={`p213-pointer-tag-curr-${idx}`}
                      data-ptr="curr"
                      initial={{ y: -6, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -6, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 450, damping: 26 }}
                    >
                      curr
                    </motion.span>
                  )}
                  {isExcluded && (
                    <span id={`p213-pointer-tag-excl-${idx}`} data-ptr="excl">
                      EXCLUDED
                    </span>
                  )}
                </AnimatePresence>
              </div>

              {/* House Node */}
              <motion.div
                id={`p213-house-node-${idx}`}
                data-house-state={houseState}
                layout
                animate={{
                  scale: isCurrent ? 1.08 : 1,
                  opacity: isExcluded ? 0.35 : 1
                }}
                transition={{ type: "spring", stiffness: 350, damping: 24 }}
              >
                <div id={`p213-roof-shape-${idx}`} />
                <div id={`p213-house-body-${idx}`}>
                  <span id={`p213-loot-val-${idx}`}>${loot}</span>
                  <span id={`p213-house-idx-${idx}`}>H[{idx}]</span>
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
            id="p213-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div id="p213-callout-header-text">{output.label}</div>
            <div id="p213-callout-val-text">{output.value}</div>
            <div id="p213-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}