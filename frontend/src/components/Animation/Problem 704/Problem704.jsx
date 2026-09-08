import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem704.css";

export default function Problem704({ stepData }) {
  const { array = [], left = 0, right = 0, mid = 0, foundIdx = null, output } = stepData || {};

  return (
    <div className="canvas-wrapper">
      <div className="elements-track">
        {array.map((val, idx) => {
          const inRange = idx >= left && idx <= right;
          const isMid = idx === mid;
          const isFound = idx === foundIdx;

          return (
            <motion.div key={idx} className="box-column" animate={{ opacity: inRange ? 1 : 0.25, scale: isMid ? 1.08 : 1 }}>
              <div className={`box-node ${isMid ? "mid-node" : ""} ${isFound ? "match" : ""}`}>
                {val}
              </div>
              <span className="idx-tag">[{idx}]</span>
              <div className="ptrs-group">
                {idx === left && <span className="pointer-tag ptr-l">L</span>}
                {isMid && <span className="pointer-tag ptr-m">M</span>}
                {idx === right && <span className="pointer-tag ptr-r">R</span>}
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {output && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="result-callout">
            <div className="callout-header">{output.label}</div>
            <div className="callout-val">{output.value}</div>
            <div className="callout-detail">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
