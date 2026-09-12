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
    <div id="p435-intervals-canvas">
      {/* Top Telemetry */}
      <div id="p435-metrics-bar">
        <span id="p435-metric-prev">
          prevEnd Sweep Boundary: <b>t = {prevEnd}</b>
        </span>
        <span id="p435-metric-removed">
          Removed: <b>{res} intervals</b>
        </span>
        <span id="p435-metric-total">
          Total Intervals: <b>{intervals.length}</b>
        </span>
        {currentIndex !== null && intervals[currentIndex] && (
          <span id="p435-metric-active">
            Inspecting: <b>[{intervals[currentIndex][0]}, {intervals[currentIndex][1]}]</b>
          </span>
        )}
      </div>

      {/* Main Timeline Stage */}
      <div id="p435-intervals-stage">
        <div id="p435-timeline-card">
          <div id="p435-card-header-bar">
            <span id="p435-card-title">Greedy Interval Sweep (Timeline 0 ➔ {maxTime})</span>
            <span id="p435-guideline-legend">| prevEnd boundary</span>
          </div>

          {/* Timeline Coordinate Axis */}
          <div id="p435-timeline-axis">
            {Array.from({ length: maxTime - minTime + 1 }).map((_, i) => {
              const val = minTime + i;
              return (
                <div
                  key={`p435-axis-${val}`}
                  id={`p435-axis-tick-${val}`}
                  style={{ left: toPercent(val) }}
                >
                  <span id={`p435-tick-line-${val}`} />
                  <span id={`p435-tick-val-${val}`}>{val}</span>
                </div>
              );
            })}
          </div>

          {/* Intervals Stack Track */}
          <div id="p435-intervals-track">
            {/* Continuous Sweep Guideline */}
            <motion.div
              id="p435-prev-end-line"
              animate={{ left: toPercent(prevEnd) }}
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
            >
              <span id="p435-line-tag">prevEnd = {prevEnd}</span>
            </motion.div>

            {intervals.map(([start, end], idx) => {
              const isRemoved = removedSet.has(idx);
              const isActive = idx === currentIndex;

              return (
                <div key={`p435-interval-row-${idx}`} id={`p435-interval-row-${idx}`}>
                  <motion.div
                    id={`p435-interval-bar-${idx}`}
                    data-bar-state={isRemoved ? "removed" : "kept"}
                    data-is-active={isActive ? "true" : "false"}
                    style={{
                      left: toPercent(start),
                      width: toWidth(start, end)
                    }}
                    layout
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{
                      scale: isActive ? 1.04 : 1,
                      opacity: isRemoved ? 0.35 : 1
                    }}
                    transition={{ duration: 0.22 }}
                  >
                    <span id={`p435-interval-label-${idx}`}>
                      [{start}, {end}]
                    </span>
                    {isRemoved && (
                      <span id={`p435-removed-badge-${idx}`}>✕ REMOVED</span>
                    )}
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Result Callout (Elevated safely above playback scrubber) */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p435-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div id="p435-callout-header-text">{output.label}</div>
            <div id="p435-callout-val-text">{output.value}</div>
            <div id="p435-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 