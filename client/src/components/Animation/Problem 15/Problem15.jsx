import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem15.css";

export default function Problem15({ stepData }) {
  const {
    array = [],
    i = null,
    l = null,
    r = null,
    state = {},
    output
  } = stepData || {};

  const { sum = null, res = "[]" } = state;

  const vi = i !== null ? array[i] : null;
  const vl = l !== null ? array[l] : null;
  const vr = r !== null ? array[r] : null;
  const currentSum = vi !== null && vl !== null && vr !== null ? vi + vl + vr : null;
  const isZeroMatch = currentSum === 0;

  let tripletsList = [];
  try {
    tripletsList = typeof res === "string" ? JSON.parse(res) : res;
  } catch {
    tripletsList = [];
  }

  let decisionStatus = "none";
  if (isZeroMatch) decisionStatus = "hit";
  else if (currentSum !== null && currentSum < 0) decisionStatus = "low";
  else if (currentSum !== null && currentSum > 0) decisionStatus = "high";

  return (
    <div id="p15-threesum-canvas">
      {/* Live Formula Display */}
      {i !== null && l !== null && r !== null && (
        <motion.div
          id="p15-sum-formula-banner"
          data-match={isZeroMatch ? "true" : "false"}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div id="p15-formula-terms">
            <span id="p15-term-i">
              nums[{i}] = <b>{vi}</b>
            </span>
            <span id="p15-operator-plus-1">+</span>
            <span id="p15-term-l">
              nums[{l}] = <b>{vl}</b>
            </span>
            <span id="p15-operator-plus-2">+</span>
            <span id="p15-term-r">
              nums[{r}] = <b>{vr}</b>
            </span>
            <span id="p15-operator-equals">=</span>
            <span id="p15-sum-result" data-zero={isZeroMatch ? "true" : "false"}>
              {currentSum}
            </span>
          </div>

          <div id="p15-formula-decision">
            {isZeroMatch ? (
              <span id="p15-decision-tag" data-status="hit">
                ★ TARGET REACHED (sum == 0)
              </span>
            ) : currentSum < 0 ? (
              <span id="p15-decision-tag" data-status="low">
                ▲ Sum too small &rarr; advance L
              </span>
            ) : (
              <span id="p15-decision-tag" data-status="high">
                ▼ Sum too high &rarr; decrement R
              </span>
            )}
          </div>
        </motion.div>
      )}

      {/* Main Number Strip */}
      <div id="p15-threesum-track">
        {array.map((val, idx) => {
          const isI = idx === i;
          const isL = idx === l;
          const isR = idx === r;
          const isSelected = isI || isL || isR;
          const isPastI = i !== null && idx < i;
          const isOutsideWindow = i !== null && l !== null && r !== null && (idx < l || idx > r) && !isI;
          const isDimmed = isPastI || isOutsideWindow;

          let nodeState = "idle";
          if (isZeroMatch && isSelected) nodeState = "matched";
          else if (isI) nodeState = "anchor";
          else if (isL) nodeState = "left";
          else if (isR) nodeState = "right";

          return (
            <div key={`p15-col-${idx}`} id={`p15-col-${idx}`}>
              {/* Pointer Badges */}
              <div id={`p15-ptrs-slot-${idx}`}>
                <AnimatePresence mode="popLayout">
                  {isI && (
                    <motion.span
                      key={`p15-ptr-i-${idx}`}
                      id={`p15-pointer-badge-i-${idx}`}
                      layout
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    >
                      i
                    </motion.span>
                  )}
                  {isL && (
                    <motion.span
                      key={`p15-ptr-l-${idx}`}
                      id={`p15-pointer-badge-l-${idx}`}
                      layout
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    >
                      L
                    </motion.span>
                  )}
                  {isR && (
                    <motion.span
                      key={`p15-ptr-r-${idx}`}
                      id={`p15-pointer-badge-r-${idx}`}
                      layout
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    >
                      R
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Box Element */}
              <motion.div
                id={`p15-box-${idx}`}
                data-state={nodeState}
                data-dimmed={isDimmed ? "true" : "false"}
                layout
                animate={{
                  scale: isSelected ? 1.08 : 1,
                  y: isSelected ? -4 : 0
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <span id={`p15-num-val-${idx}`}>{val}</span>
                <span id={`p15-idx-tag-${idx}`}>[{idx}]</span>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Discovered Triplets Feed */}
      <div id="p15-triplets-pool-wrapper">
        <span id="p15-pool-title">Unique Triplets Discovered:</span>
        <div id="p15-triplets-list">
          {tripletsList.length === 0 ? (
            <span id="p15-no-triplets-hint">No matches found yet</span>
          ) : (
            tripletsList.map((t, idx) => (
              <motion.div
                key={`p15-triplet-${idx}`}
                id={`p15-triplet-capsule-${idx}`}
                layout
                initial={{ scale: 0.8, opacity: 0, y: 8 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <span id={`p15-check-icon-${idx}`}>&#10003;</span>
                <span id={`p15-triplet-vals-${idx}`}>[{t.join(", ")}]</span>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Output Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p15-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
          >
            <div id="p15-callout-header-text">{output.label}</div>
            <div id="p15-callout-val-text">{output.value}</div>
            <div id="p15-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}