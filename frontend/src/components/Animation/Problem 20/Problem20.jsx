import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem20.css";

export default function Problem20({ stepData }) {
  const { chars = [], activeCharIdx = -1, stack = [], output } = stepData || {};

  return (
    <div className="canvas-wrapper">
      <div className="char-stream">
        {chars.map((char, idx) => (
          <div key={idx} className={`char-chip ${idx === activeCharIdx ? "active" : ""}`}>
            {char}
          </div>
        ))}
      </div>

      <div className="stack-bucket">
        <div className="bucket-well">
          <AnimatePresence>
            {stack.slice().reverse().map((item, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.5 }} className="stack-item">
                {item}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <span className="bucket-tag">Stack (LIFO)</span>
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
