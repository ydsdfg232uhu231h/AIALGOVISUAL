import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem53.css";

export default function Problem53({ stepData }) {
  const {
    array = [],
    currentIndex = 0,
    subStart = 0,
    subEnd = 0,
    state = {},
    output
  } = stepData || {};

  const { currSum = 0, maxSum = 0, status } = state;
  const isComplete = status === "COMPLETED";

  return (
    <div id="p53-kadane-canvas">
      {/* Dynamic Kadane State Cards */}
      <div id="p53-metrics-row">
        <span id="p53-metric-chip-current">
          Current Element (nums[{currentIndex}]): <b>{array[currentIndex] ?? "-"}</b>
        </span>
        <span
          id="p53-metric-chip-sum"
          data-sign={currSum < 0 ? "neg" : "pos"}
        >
          Current Window Sum: <b>{currSum}</b>
        </span>
        <span id="p53-metric-chip-max">
          Global Max Sum: <b>{maxSum}</b>
        </span>
        <span id="p53-metric-chip-window">
          Active Subarray: <b>[{subStart}..{subEnd}]</b>
        </span>
      </div>

      {/* Array Element Track */}
      <div id="p53-elements-track">
        {array.map((val, idx) => {
          const inWindow = idx >= subStart && idx <= subEnd;
          const isCurrent = idx === currentIndex;
          const isStart = idx === subStart;
          const isEnd = idx === subEnd;

          let nodeState = "idle";
          if (isComplete && inWindow) nodeState = "completed";
          else if (isCurrent) nodeState = "current";
          else if (inWindow) nodeState = "in-window";

          return (
            <div key={`p53-col-${idx}`} id={`p53-box-column-${idx}`}>
              {/* Pointer Badges */}
              <div id={`p53-ptrs-group-${idx}`}>
                <AnimatePresence mode="popLayout">
                  {isStart && (
                    <motion.span
                      key={`p53-ptr-start-${idx}`}
                      id={`p53-pointer-tag-start-${idx}`}
                      layout
                      initial={{ y: -6, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -6, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 450, damping: 25 }}
                    >
                      START
                    </motion.span>
                  )}
                  {isCurrent && (
                    <motion.span
                      key={`p53-ptr-curr-${idx}`}
                      id={`p53-pointer-tag-curr-${idx}`}
                      layout
                      initial={{ y: -6, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -6, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 450, damping: 25 }}
                    >
                      i
                    </motion.span>
                  )}
                  {isEnd && !isStart && (
                    <motion.span
                      key={`p53-ptr-end-${idx}`}
                      id={`p53-pointer-tag-end-${idx}`}
                      layout
                      initial={{ y: -6, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -6, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 450, damping: 25 }}
                    >
                      END
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Element Box */}
              <motion.div
                id={`p53-box-node-${idx}`}
                data-state={nodeState}
                layout
                animate={{
                  scale: isCurrent ? 1.12 : inWindow ? 1.05 : 0.95,
                  opacity: inWindow || isCurrent ? 1 : 0.35,
                  borderColor: isComplete && inWindow
                    ? "#22c55e"
                    : isCurrent
                    ? "#38bdf8"
                    : inWindow
                    ? "#eab308"
                    : "#27272a"
                }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                <span id={`p53-node-val-${idx}`}>{val}</span>
              </motion.div>

              <span id={`p53-idx-tag-${idx}`}>[{idx}]</span>
            </div>
          );
        })}
      </div>

      {/* Output Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p53-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div id="p53-callout-header-text">{output.label}</div>
            <div id="p53-callout-val-text">{output.value}</div>
            <div id="p53-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}