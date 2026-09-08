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

  return (
    <div className="canvas-wrapper threesum-canvas">
      {/* Live Formula Display */}
      {i !== null && l !== null && r !== null && (
        <motion.div
          className={`sum-formula-banner ${isZeroMatch ? "banner-match" : ""}`}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="formula-terms">
            <span className="term term-i">
              nums[{i}] = <b>{vi}</b>
            </span>
            <span className="operator">+</span>
            <span className="term term-l">
              nums[{l}] = <b>{vl}</b>
            </span>
            <span className="operator">+</span>
            <span className="term term-r">
              nums[{r}] = <b>{vr}</b>
            </span>
            <span className="operator">=</span>
            <span className={`sum-result ${isZeroMatch ? "res-zero" : ""}`}>
              {currentSum}
            </span>
          </div>

          <div className="formula-decision">
            {isZeroMatch ? (
              <span className="decision-tag tag-hit">★ TARGET REACHED (sum == 0)</span>
            ) : currentSum < 0 ? (
              <span className="decision-tag tag-low">▲ Sum too small &rarr; advance L</span>
            ) : (
              <span className="decision-tag tag-high">▼ Sum too high &rarr; decrement R</span>
            )}
          </div>
        </motion.div>
      )}

      {/* Main Number Strip */}
      <div className="threesum-track">
        {array.map((val, idx) => {
          const isI = idx === i;
          const isL = idx === l;
          const isR = idx === r;
          const isSelected = isI || isL || isR;
          const isPastI = i !== null && idx < i;
          const isOutsideWindow = i !== null && l !== null && r !== null && (idx < l || idx > r) && !isI;

          return (
            <div key={idx} className="threesum-col">
              {/* Pointer Badges */}
              <div className="ptrs-slot">
                <AnimatePresence>
                  {isI && (
                    <motion.span
                      layoutId="ptr-i"
                      className="pointer-badge badge-i"
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
                      layoutId="ptr-l"
                      className="pointer-badge badge-l"
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
                      layoutId="ptr-r"
                      className="pointer-badge badge-r"
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
                className={`threesum-box ${
                  isSelected ? "box-selected" : ""
                } ${isI ? "box-anchor" : ""} ${
                  isL ? "box-left" : ""
                } ${isR ? "box-right" : ""} ${
                  isZeroMatch && isSelected ? "box-matched" : ""
                } ${isPastI || isOutsideWindow ? "box-dimmed" : ""}`}
                animate={{
                  scale: isSelected ? 1.08 : 1,
                  y: isSelected ? -4 : 0
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <span className="num-val">{val}</span>
                <span className="idx-tag">[{idx}]</span>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Discovered Triplets Feed */}
      <div className="triplets-pool-wrapper">
        <span className="pool-title">Unique Triplets Discovered:</span>
        <div className="triplets-list">
          {tripletsList.length === 0 ? (
            <span className="no-triplets-hint">No matches found yet</span>
          ) : (
            tripletsList.map((t, idx) => (
              <motion.div
                key={idx}
                className="triplet-capsule"
                initial={{ scale: 0.8, opacity: 0, y: 8 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <span className="check-icon">&#10003;</span>
                <span className="triplet-vals">[{t.join(", ")}]</span>
              </motion.div>
            ))
          )}
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