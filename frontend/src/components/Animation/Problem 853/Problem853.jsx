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

  return (
    <div id="car-fleet-canvas">
      {/* Top Metrics Row */}
      <div id="metrics-bar">
        <span id="metric-target">
          Finish Line: <b>Target = {target}</b>
        </span>

        <span id="metric-car-count">
          Total Cars: <b>{cars.length}</b>
        </span>

        {currentCar ? (
          <span id="metric-active-car">
            Evaluating: <b>Pos {currentCar.pos} (Speed {currentCar.speed})</b>
          </span>
        ) : (
          <span id="metric-active-idle">
            Evaluating: <b>None</b>
          </span>
        )}

        <span id={stack.length > 0 ? "metric-fleet-count" : "metric-fleet-idle"}>
          Unique Fleets: <b>{stack.length}</b>
        </span>

        <span id={isCompleted ? "metric-status-done" : "metric-status-active"}>
          Status: <b>{isCompleted ? "ALL CARS ARRIVED ✓" : actionType}</b>
        </span>
      </div>

      <div id="fleet-stage">
        {/* Track 1: Highway Lane (Sorted by Position Descending) */}
        <div id="highway-track-card">
          <div id="highway-card-header">
            <span id="highway-header-title">1. Sorted Highway Track (Descending Position)</span>
            <span id="highway-header-sub">Closer cars to target (12) evaluated first</span>
          </div>

          <div id="highway-elements-track">
            {cars.map((car, idx) => {
              const isCurrent = idx === currentCarIdx && !isCompleted;
              const isProcessed = currentCarIdx !== null && idx < currentCarIdx;

              let boxId = `car-box-idle-${idx}`;
              if (isCurrent) boxId = `car-box-active-${idx}`;
              else if (isProcessed) boxId = `car-box-processed-${idx}`;

              return (
                <motion.div
                  key={`car-${car.pos}-${car.speed}`}
                  id={`car-col-${idx}`}
                  animate={{
                    scale: isCurrent ? 1.08 : 1,
                    opacity: isProcessed && !isCurrent ? 0.45 : 1
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                >
                  <div id={boxId}>
                    <span id={`car-icon-${idx}`}>🚗</span>
                    <span id={`car-pos-${idx}`}>pos: {car.pos}</span>
                    <span id={`car-spd-${idx}`}>spd: {car.speed}</span>
                    <span id={`car-time-${idx}`}>t = {car.time}h</span>
                  </div>

                  <span id={`car-idx-tag-${idx}`}>[{idx}]</span>
                  {isCurrent && <span id="car-pointer-tag">SCAN</span>}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Lower Row: Time Calculator & Fleets Stack */}
        <div id="middle-stage-grid">
          {/* Time & Collision Inspector */}
          <div id="collision-inspector-card">
            <div id="inspector-card-header">
              <span id="inspector-header-title">2. Arrival Time &amp; Catch-Up Logic</span>
              <span id="inspector-header-sub">time = (target - pos) / speed</span>
            </div>

            <div id="inspector-grid">
              <div id="box-calc-formula">
                <span id="title-calc-formula">Time to Destination:</span>
                <span id="val-calc-formula">
                  {currentCar
                    ? `(${target} - ${currentCar.pos}) / ${currentCar.speed} = ${currentCar.time} hrs`
                    : "Awaiting next car..."}
                </span>
              </div>

              <div id="box-collision-rule">
                <span id="title-collision-rule">Fleet Decision:</span>
                <span
                  id={
                    actionType === "MERGE_FLEET"
                      ? "val-rule-merge"
                      : actionType === "NEW_FLEET"
                      ? "val-rule-new"
                      : isCompleted
                      ? "val-rule-done"
                      : "val-rule-idle"
                  }
                >
                  {comparisonText || "Ready to evaluate"}
                </span>
              </div>
            </div>
          </div>

          {/* Fleets Monotonic Stack */}
          <div id="stack-card">
            <div id="stack-card-header">
              <span id="stack-header-title">3. Fleets Stack (Arrival Times)</span>
              <span id="stack-header-sub">Distinct bottleneck fleets</span>
            </div>

            <div id="stack-viewport">
              <AnimatePresence mode="popLayout">
                {stack.length === 0 ? (
                  <span id="stack-empty-text">No fleets formed yet</span>
                ) : (
                  <div id="stack-items-container">
                    {stack.map((timeVal, sIdx) => {
                      const isTop = sIdx === stack.length - 1;
                      let pillId = `fleet-pill-idle-${sIdx}`;
                      if (isCompleted) pillId = `fleet-pill-done-${sIdx}`;
                      else if (isTop) pillId = `fleet-pill-top-${sIdx}`;

                      return (
                        <motion.div
                          key={`fleet-item-${sIdx}-${timeVal}`}
                          id={pillId}
                          layout
                          initial={{ opacity: 0, scale: 0.6, y: 15 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.5, y: -15 }}
                          transition={{ type: "spring", stiffness: 360, damping: 24 }}
                        >
                          <span id={`fleet-val-${sIdx}`}>Fleet {sIdx + 1}: <b>{timeVal}h</b></span>
                          {isTop && !isCompleted && (
                            <span id="fleet-top-tag">LATEST</span>
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

      {/* Result Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div id="callout-header-text">{output.label}</div>
            <div id="callout-val-text">{output.value}</div>
            <div id="callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}