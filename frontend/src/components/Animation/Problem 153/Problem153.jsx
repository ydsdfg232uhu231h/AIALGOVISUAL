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
    <div id="p153-find-min-canvas">
      {/* Metrics Header */}
      <div id="p153-metrics-row">
        <span id="p153-metric-chip-range">
          Search Window: l = <b>{l}</b>, r = <b>{r}</b>
        </span>
        {m !== null && (
          <span id="p153-metric-chip-mid">
            m = <b>{m}</b> (val: {array[m]})
          </span>
        )}
        <span id="p153-metric-chip-res">
          Current Min (res): <b>{currentRes ?? "-"}</b>
        </span>
      </div>

      {/* Elements Ribbon */}
      <div id="p153-elements-track">
        {array.map((val, idx) => {
          const inRange = idx >= l && idx <= r;
          const isMid = idx === m;
          const isLeft = idx === l;
          const isRight = idx === r;
          const isFoundMin = isComplete && idx === minIdx;

          let nodeState = "idle";
          if (isFoundMin) nodeState = "min";
          else if (isMid) nodeState = "mid";
          else if (inRange) nodeState = "in-range";

          return (
            <div key={`p153-col-${idx}`} id={`p153-box-column-${idx}`}>
              {/* Pointer Badges */}
              <div id={`p153-ptrs-group-${idx}`}>
                <AnimatePresence mode="popLayout">
                  {isLeft && (
                    <motion.span
                      key="p153-ptr-left"
                      layoutId="p153-ptr-l"
                      id={`p153-pointer-tag-l-${idx}`}
                      data-ptr="l"
                      initial={{ y: -6, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -6, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 450, damping: 26 }}
                    >
                      l
                    </motion.span>
                  )}
                  {isMid && (
                    <motion.span
                      key="p153-ptr-mid"
                      layoutId="p153-ptr-m"
                      id={`p153-pointer-tag-m-${idx}`}
                      data-ptr="m"
                      initial={{ y: -6, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -6, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 450, damping: 26 }}
                    >
                      m
                    </motion.span>
                  )}
                  {isRight && (
                    <motion.span
                      key="p153-ptr-right"
                      layoutId="p153-ptr-r"
                      id={`p153-pointer-tag-r-${idx}`}
                      data-ptr="r"
                      initial={{ y: -6, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -6, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 450, damping: 26 }}
                    >
                      r
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Element Box */}
              <motion.div
                id={`p153-box-node-${idx}`}
                data-node-state={nodeState}
                layout
                animate={{
                  opacity: inRange || isFoundMin ? 1 : 0.25,
                  scale: isFoundMin ? 1.12 : isMid ? 1.06 : 1
                }}
                transition={{ type: "spring", stiffness: 350, damping: 24 }}
              >
                {val}
              </motion.div>

              <span id={`p153-idx-tag-${idx}`}>[{idx}]</span>
            </div>
          );
        })}
      </div>

      {/* Output Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p153-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div id="p153-callout-header-text">{output.label}</div>
            <div id="p153-callout-val-text">{output.value}</div>
            <div id="p153-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}