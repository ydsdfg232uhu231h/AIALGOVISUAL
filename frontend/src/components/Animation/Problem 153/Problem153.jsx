import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem153.css";

export default function Problem153({ stepData }) {
  const {
    array = [],
    l = 0,
    r = 0,
    m = null,
    state = {},
    output
  } = stepData || {};

  const currentRes = state.res ?? state.min ?? null;
  const isComplete = state.status === "COMPLETED";
  const minIdx = isComplete ? array.indexOf(state.min ?? currentRes) : null;

  return (
    <div id="find-min-canvas">
      {/* Metrics Header */}
      <div id="metrics-row">
        <span id="metric-chip-range">
          Search Window: l = <b>{l}</b>, r = <b>{r}</b>
        </span>
        {m !== null && (
          <span id="metric-chip-mid">
            m = <b>{m}</b> (val: {array[m]})
          </span>
        )}
        <span id="metric-chip-res">
          Current Min (res): <b>{currentRes ?? "-"}</b>
        </span>
      </div>

      {/* Elements Ribbon */}
      <div id="elements-track">
        {array.map((val, idx) => {
          const inRange = idx >= l && idx <= r;
          const isMid = idx === m;
          const isLeft = idx === l;
          const isRight = idx === r;
          const isFoundMin = isComplete && idx === minIdx;

          let nodeState = "idle";
          if (isFoundMin) nodeState = "min";
          else if (isMid) nodeState = "mid";

          return (
            <div key={`col-${idx}`} id={`box-column-${idx}`}>
              {/* Pointer Badges */}
              <div id={`ptrs-group-${idx}`}>
                {isLeft && <span id={`pointer-tag-l-${idx}`}>l</span>}
                {isMid && <span id={`pointer-tag-m-${idx}`}>m</span>}
                {isRight && <span id={`pointer-tag-r-${idx}`}>r</span>}
              </div>

              {/* Element Box */}
              <motion.div
                id={`box-node-${nodeState}-${idx}`}
                animate={{
                  opacity: inRange || isFoundMin ? 1 : 0.25,
                  scale: isFoundMin ? 1.15 : isMid ? 1.08 : 1,
                  borderColor: isFoundMin
                    ? "#22c55e"
                    : isMid
                    ? "#38bdf8"
                    : inRange
                    ? "#52525b"
                    : "#27272a"
                }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                {val}
              </motion.div>

              <span id={`idx-tag-${idx}`}>[{idx}]</span>
            </div>
          );
        })}
      </div>

      {/* Output Callout */}
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