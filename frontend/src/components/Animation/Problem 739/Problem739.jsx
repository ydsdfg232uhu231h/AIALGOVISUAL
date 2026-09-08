import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem739.css";

export default function Problem739({ stepData }) {
  const {
    temperatures = [73, 74, 75, 71, 69, 72, 76, 73],
    stack = [],
    res = [0, 0, 0, 0, 0, 0, 0, 0],
    currentIndex = 0,
    state = {},
    output
  } = stepData || {};

  const stackIndices = new Set(stack.map((item) => item.idx));
  const poppedIdx = state.poppedIndex ?? null;

  return (
    <div className="canvas-wrapper daily-temp-canvas">
      {/* Top Metrics Row */}
      <div className="metrics-row">
        <span className="metric-chip current-day-chip">
          Current Day: <b>i = {currentIndex} ({temperatures[currentIndex]}°)</b>
        </span>
        <span className="metric-chip stack-size-chip">
          Monotonic Stack Size: <b>{stack.length}</b>
        </span>
        {poppedIdx !== null && (
          <span className="metric-chip resolved-chip">
            Resolved Day {poppedIdx}: <b>+{state.waitDays} day(s)</b>
          </span>
        )}
      </div>

      {/* Main Visualizer Stage */}
      <div className="temp-stage">
        {/* Left: Input Temperatures & Output Result Grid */}
        <div className="temperature-bars-card">
          <div className="card-label">Daily Temperatures & Wait Result</div>
          
          <div className="bars-track">
            {temperatures.map((temp, idx) => {
              const isCurrent = idx === currentIndex;
              const inStack = stackIndices.has(idx);
              const isPopped = idx === poppedIdx;
              const waitDays = res[idx];

              // Height normalized between 69° and 76° (base 40px, scale up to 120px)
              const minT = 68;
              const maxT = 77;
              const barHeight = 40 + ((temp - minT) / (maxT - minT)) * 80;

              return (
                <div key={`day-${idx}`} className="day-column">
                  {/* Wait Days Tag */}
                  <span className={`wait-tag ${waitDays > 0 ? "wait-resolved" : ""}`}>
                    {waitDays > 0 ? `+${waitDays}d` : "0"}
                  </span>

                  {/* Temperature Bar */}
                  <motion.div
                    className={`temp-bar ${isCurrent ? "bar-current" : inStack ? "bar-stack" : ""} ${
                      isPopped ? "bar-popped" : ""
                    }`}
                    style={{ height: `${barHeight}px` }}
                    animate={{
                      scale: isCurrent ? 1.08 : 1
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 20 }}
                  >
                    <span className="bar-temp-val">{temp}°</span>
                  </motion.div>

                  {/* Day Index */}
                  <span className="day-index-label">[{idx}]</span>
                  {isCurrent && <span className="current-arrow">▲</span>}
                </div>
              );
            })}
          </div>

          {/* Wait Days Array Output Strip */}
          <div className="res-strip">
            <span className="strip-title">res[]:</span>
            <div className="res-cells">
              {res.map((val, idx) => (
                <div
                  key={`res-cell-${idx}`}
                  className={`res-box ${idx === poppedIdx ? "res-box-highlight" : val > 0 ? "res-box-filled" : ""}`}
                >
                  {val}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Monotonic Decreasing Stack Canister */}
        <div className="stack-card">
          <div className="card-label">Monotonic Stack (Decreasing)</div>
          <div className="stack-canister">
            <AnimatePresence>
              {stack.length === 0 ? (
                <div className="stack-empty">Stack is empty</div>
              ) : (
                [...stack].reverse().map((item, reverseIdx) => {
                  const isTop = reverseIdx === 0;

                  return (
                    <motion.div
                      key={`stack-${item.idx}-${item.temp}`}
                      className={`stack-entry ${isTop ? "stack-top" : ""}`}
                      initial={{ opacity: 0, y: -20, scale: 0.85 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 20, scale: 0.8 }}
                      transition={{ duration: 0.25 }}
                    >
                      <span className="entry-temp">{item.temp}°</span>
                      <span className="entry-idx">day {item.idx}</span>
                      {isTop && <span className="top-badge">TOP</span>}
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
          <div className="stack-base">BOTTOM</div>
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