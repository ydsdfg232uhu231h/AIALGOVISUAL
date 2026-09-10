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
    <div id="p739-daily-temp-canvas">
      {/* Top Metrics Row */}
      <div id="p739-metrics-bar">
        <span id="p739-metric-current-day">
          Current Day: <b>i = {currentIndex} ({temperatures[currentIndex]}°)</b>
        </span>
        <span id="p739-metric-stack-size">
          Monotonic Stack Size: <b>{stack.length}</b>
        </span>
        {poppedIdx !== null && (
          <motion.span
            id="p739-metric-resolved"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 350, damping: 22 }}
          >
            Resolved Day {poppedIdx}: <b>+{state.waitDays} day(s)</b>
          </motion.span>
        )}
      </div>

      {/* Main Visualizer Stage */}
      <div id="p739-temp-stage">
        {/* Left: Input Temperatures & Output Result Grid */}
        <div id="p739-temperature-bars-card">
          <div id="p739-card-label">Daily Temperatures &amp; Wait Result</div>

          <div id="p739-bars-track">
            {temperatures.map((temp, idx) => {
              const isCurrent = idx === currentIndex;
              const inStack = stackIndices.has(idx);
              const isPopped = idx === poppedIdx;
              const waitDays = res[idx];

              let barState = "idle";
              if (isPopped) barState = "popped";
              else if (isCurrent) barState = "current";
              else if (inStack) barState = "stack";

              // Height normalized between 68° and 77° (base 42px, max 125px)
              const minT = 68;
              const maxT = 77;
              const barHeight = 42 + ((temp - minT) / (maxT - minT)) * 82;

              return (
                <div key={`p739-day-${idx}`} id={`p739-day-col-${idx}`}>
                  {/* Wait Days Tag */}
                  <span
                    id={`p739-wait-tag-${idx}`}
                    data-is-resolved={waitDays > 0 ? "true" : "false"}
                  >
                    {waitDays > 0 ? `+${waitDays}d` : "0"}
                  </span>

                  {/* Temperature Bar */}
                  <motion.div
                    id={`p739-temp-bar-${idx}`}
                    data-bar-state={barState}
                    style={{ height: `${barHeight}px` }}
                    layout
                    animate={{
                      scaleY: isCurrent ? 1.05 : 1,
                      scaleX: isCurrent ? 1.04 : 1
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  >
                    <span id={`p739-bar-temp-val-${idx}`}>{temp}°</span>
                  </motion.div>

                  {/* Day Index */}
                  <span id={`p739-day-index-label-${idx}`}>[{idx}]</span>
                  <AnimatePresence>
                    {isCurrent && (
                      <motion.span
                        key="p739-arrow"
                        id={`p739-current-arrow-${idx}`}
                        initial={{ opacity: 0, y: 3 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 3 }}
                        transition={{ duration: 0.18 }}
                      >
                        ▲
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Wait Days Array Output Strip */}
          <div id="p739-res-strip">
            <span id="p739-strip-title">res[]:</span>
            <div id="p739-res-cells">
              {res.map((val, idx) => {
                let resState = "idle";
                if (idx === poppedIdx) resState = "highlight";
                else if (val > 0) resState = "filled";

                return (
                  <motion.div
                    key={`p739-res-cell-${idx}`}
                    id={`p739-res-box-${idx}`}
                    data-res-state={resState}
                    animate={{
                      scale: idx === poppedIdx ? [1, 1.08, 1] : 1
                    }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                  >
                    {val}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Monotonic Decreasing Stack Canister */}
        <div id="p739-stack-card">
          <div id="p739-card-label-stack">Monotonic Stack (Decreasing)</div>
          <div id="p739-stack-canister">
            <AnimatePresence mode="popLayout">
              {stack.length === 0 ? (
                <motion.div
                  key="empty"
                  id="p739-stack-empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Stack is empty
                </motion.div>
              ) : (
                [...stack].reverse().map((item, reverseIdx) => {
                  const isTop = reverseIdx === 0;

                  return (
                    <motion.div
                      key={`p739-stack-${item.idx}-${item.temp}`}
                      id={`p739-stack-entry-${item.idx}`}
                      data-is-top={isTop ? "true" : "false"}
                      layout
                      initial={{ opacity: 0, y: -16, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 24, scale: 0.88 }}
                      transition={{ type: "spring", stiffness: 320, damping: 26 }}
                    >
                      <span id={`p739-entry-temp-${item.idx}`}>{item.temp}°</span>
                      <span id={`p739-entry-idx-${item.idx}`}>day {item.idx}</span>
                      {isTop && <span id={`p739-top-badge-${item.idx}`}>TOP</span>}
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
          <div id="p739-stack-base">CANISTER BASE</div>
        </div>
      </div>

      {/* Output Callout (Elevated safely above playback controls) */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p739-result-callout-box"
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ type: "spring", stiffness: 360, damping: 26 }}
          >
            <div id="p739-callout-header-text">{output.label}</div>
            <div id="p739-callout-val-text">{output.value}</div>
            <div id="p739-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}