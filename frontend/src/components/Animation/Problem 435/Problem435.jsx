import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem435.css";

export default function Problem435({ stepData }) {
  const {
    intervals = [],
    removed = [],
    currentIndex = null,
    state = {},
    output
  } = stepData || {};

  const { prevEnd = 0, res = 0 } = state;
  const removedSet = new Set(removed);

  // Full timeline scale from 0 to 11
  const minTime = 0;
  const maxTime = 11;
  const totalUnits = maxTime - minTime;

  const toPercent = (t) => `${((t - minTime) / totalUnits) * 100}%`;
  const toWidth = (start, end) => `${((end - start) / totalUnits) * 100}%`;

  return (
    <div className="canvas-wrapper intervals-canvas">
      {/* Top Telemetry */}
      <div className="metrics-row">
        <span className="metric-chip prev-chip">
          prevEnd Sweep Boundary: <b>t = {prevEnd}</b>
        </span>
        <span className="metric-chip removed-chip">
          Removed: <b>{res} intervals</b>
        </span>
        <span className="metric-chip total-chip">
          Total Intervals: <b>{intervals.length}</b>
        </span>
        {currentIndex !== null && intervals[currentIndex] && (
          <span className="metric-chip active-chip">
            Inspecting: <b>[{intervals[currentIndex][0]}, {intervals[currentIndex][1]}]</b>
          </span>
        )}
      </div>

      {/* Main Timeline Stage */}
      <div className="intervals-stage">
        <div className="timeline-card">
          <div className="card-header-bar">
            <span>Greedy Interval Sweep (Full Timeline 0 ➔ {maxTime})</span>
            <span className="guideline-legend">| prevEnd boundary</span>
          </div>

          {/* Timeline Coordinate Axis */}
          <div className="timeline-axis">
            {Array.from({ length: maxTime - minTime + 1 }).map((_, i) => {
              const val = minTime + i;
              return (
                <div
                  key={`axis-${val}`}
                  className="axis-tick"
                  style={{ left: toPercent(val) }}
                >
                  <span className="tick-line" />
                  <span className="tick-val">{val}</span>
                </div>
              );
            })}
          </div>

          {/* Intervals Stack Track */}
          <div className="intervals-track intervals-track-8">
            {/* Continuous Sweep Guideline */}
            <motion.div
              className="prev-end-line"
              animate={{ left: toPercent(prevEnd) }}
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
            >
              <span className="line-tag">prevEnd = {prevEnd}</span>
            </motion.div>

            {intervals.map(([start, end], idx) => {
              const isRemoved = removedSet.has(idx);
              const isActive = idx === currentIndex;

              return (
                <div key={`interval-${idx}-${start}-${end}`} className="interval-row">
                  <motion.div
                    className={`interval-bar ${isRemoved ? "bar-removed" : "bar-kept"} ${
                      isActive ? "bar-active" : ""
                    }`}
                    style={{
                      left: toPercent(start),
                      width: toWidth(start, end)
                    }}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{
                      scale: isActive ? 1.04 : 1,
                      opacity: isRemoved ? 0.35 : 1
                    }}
                    transition={{ duration: 0.22 }}
                  >
                    <span className="interval-label">[{start}, {end}]</span>
                    {isRemoved && <span className="removed-badge">✕ REMOVED</span>}
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Result Callout */}
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