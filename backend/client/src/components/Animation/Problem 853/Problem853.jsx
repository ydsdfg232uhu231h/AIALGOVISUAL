import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem853.css";

export default function Problem853({ stepData }) {
  const {
    target = 12,
    cars = [
      { pos: 10, speed: 2, time: 1 },
      { pos: 8, speed: 4, time: 1 },
      { pos: 5, speed: 1, time: 7 },
      { pos: 3, speed: 3, time: 3 },
      { pos: 0, speed: 1, time: 12 }
    ],
    currentCarIdx = null,
    stack = [],
    actionType = "IDLE", // "INIT", "PROCESS_CAR", "MERGE_FLEET", "NEW_FLEET", "DONE"
    comparisonText = "",
    isCompleted = false,
    output
  } = stepData || {};

  const currentCar =
    currentCarIdx !== null && currentCarIdx >= 0 && currentCarIdx < cars.length
      ? cars[currentCarIdx]
      : null;

  let ruleState = "idle";
  if (actionType === "MERGE_FLEET") ruleState = "merge";
  else if (actionType === "NEW_FLEET") ruleState = "new";
  else if (isCompleted) ruleState = "done";

  return (
    <div id="p853-car-fleet-canvas">
      {/* Top Metrics Row */}
      <div id="p853-metrics-bar">
        <span id="p853-metric-target">
          Finish Line: <b>Target = {target}</b>
        </span>

        <span id="p853-metric-car-count">
          Total Cars: <b>{cars.length}</b>
        </span>

        {currentCar ? (
          <span id="p853-metric-active-car">
            Evaluating: <b>Pos {currentCar.pos} (Speed {currentCar.speed})</b>
          </span>
        ) : (
          <span id="p853-metric-active-idle">
            Evaluating: <b>None</b>
          </span>
        )}

        <span id={stack.length > 0 ? "p853-metric-fleet-count" : "p853-metric-fleet-idle"}>
          Unique Fleets: <b>{stack.length}</b>
        </span>

        <span
          id="p853-metric-status"
          data-status={isCompleted ? "done" : "active"}
        >
          Status: <b>{isCompleted ? "ALL CARS ARRIVED ✓" : actionType}</b>
        </span>
      </div>

      <div id="p853-fleet-stage">
        {/* Track 1: Highway Lane (Sorted by Position Descending) */}
        <div id="p853-highway-track-card">
          <div id="p853-highway-card-header">
            <span id="p853-highway-header-title">1. Sorted Highway Track (Descending Position)</span>
            <span id="p853-highway-header-sub">Closer cars to target ({target}) evaluated first</span>
          </div>

          <div id="p853-highway-elements-track">
            {cars.map((car, idx) => {
              const isCurrent = idx === currentCarIdx && !isCompleted;
              const isProcessed = currentCarIdx !== null && idx < currentCarIdx;

              let carState = "idle";
              if (isCurrent) carState = "active";
              else if (isProcessed) carState = "processed";

              return (
                <motion.div
                  key={`p853-car-${car.pos}-${car.speed}`}
                  id={`p853-car-col-${idx}`}
                  layout
                  animate={{
                    scale: isCurrent ? 1.08 : 1,
                    opacity: isProcessed && !isCurrent ? 0.45 : 1
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                >
                  <div
                    id={`p853-car-box-${idx}`}
                    data-car-state={carState}
                  >
                    <span id={`p853-car-icon-${idx}`}>🚗</span>
                    <span id={`p853-car-pos-${idx}`}>pos: {car.pos}</span>
                    <span id={`p853-car-spd-${idx}`}>spd: {car.speed}</span>
                    <span id={`p853-car-time-${idx}`}>t = {car.time}h</span>
                  </div>

                  <span id={`p853-car-idx-tag-${idx}`}>[{idx}]</span>
                  {isCurrent && <span id="p853-car-pointer-tag">SCAN</span>}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Lower Row: Time Calculator & Fleets Stack */}
        <div id="p853-middle-stage-grid">
          {/* Time & Collision Inspector */}
          <div id="p853-collision-inspector-card">
            <div id="p853-inspector-card-header">
              <span id="p853-inspector-header-title">2. Arrival Time &amp; Catch-Up Logic</span>
              <span id="p853-inspector-header-sub">time = (target - pos) / speed</span>
            </div>

            <div id="p853-inspector-grid">
              <div id="p853-box-calc-formula">
                <span id="p853-title-calc-formula">Time to Destination:</span>
                <span id="p853-val-calc-formula">
                  {currentCar
                    ? `(${target} - ${currentCar.pos}) / ${currentCar.speed} = ${currentCar.time} hrs`
                    : "Awaiting next car..."}
                </span>
              </div>

              <div id="p853-box-collision-rule">
                <span id="p853-title-collision-rule">Fleet Decision:</span>
                <span
                  id="p853-val-collision-rule"
                  data-rule-state={ruleState}
                >
                  {comparisonText || "Ready to evaluate"}
                </span>
              </div>
            </div>
          </div>

          {/* Fleets Monotonic Stack */}
          <div id="p853-stack-card">
            <div id="p853-stack-card-header">
              <span id="p853-stack-header-title">3. Fleets Stack (Arrival Times)</span>
              <span id="p853-stack-header-sub">Distinct bottleneck fleets</span>
            </div>

            <div id="p853-stack-viewport">
              <AnimatePresence mode="popLayout">
                {stack.length === 0 ? (
                  <span id="p853-stack-empty-text">No fleets formed yet</span>
                ) : (
                  <div id="p853-stack-items-container">
                    {stack.map((timeVal, sIdx) => {
                      const isTop = sIdx === stack.length - 1;

                      let pillState = "idle";
                      if (isCompleted) pillState = "done";
                      else if (isTop) pillState = "top";

                      return (
                        <motion.div
                          key={`p853-fleet-item-${sIdx}-${timeVal}`}
                          id={`p853-fleet-pill-${sIdx}`}
                          data-pill-state={pillState}
                          layout
                          initial={{ opacity: 0, scale: 0.6, y: 15 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.5, y: -15 }}
                          transition={{ type: "spring", stiffness: 360, damping: 24 }}
                        >
                          <span id={`p853-fleet-val-${sIdx}`}>
                            Fleet {sIdx + 1}: <b>{timeVal}h</b>
                          </span>
                          {isTop && !isCompleted && (
                            <span id="p853-fleet-top-tag">LATEST</span>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Result Callout (Elevated safely above playback controls) */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p853-result-callout-box"
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ type: "spring", stiffness: 360, damping: 26 }}
          >
            <div id="p853-callout-header-text">{output.label}</div>
            <div id="p853-callout-val-text">{output.value}</div>
            <div id="p853-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}