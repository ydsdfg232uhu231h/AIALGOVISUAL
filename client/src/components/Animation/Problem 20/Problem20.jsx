import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem20.css";

export default function Problem20({ stepData }) {
  const { chars = [], activeCharIdx = -1, stack = [], output } = stepData || {};

  return (
    <div id="p20-canvas-wrapper">
      {/* Input Character Stream */}
      <div id="p20-char-stream">
        {chars.map((char, idx) => {
          const isActive = idx === activeCharIdx;

          return (
            <div
              key={`p20-char-${idx}`}
              id={`p20-char-chip-${idx}`}
              data-active={isActive ? "true" : "false"}
            >
              <span id={`p20-char-val-${idx}`}>{char}</span>
            </div>
          );
        })}
      </div>

      {/* LIFO Stack Bucket */}
      <div id="p20-stack-bucket">
        <div id="p20-bucket-well">
          <AnimatePresence mode="popLayout">
            {stack
              .slice()
              .reverse()
              .map((item, idx) => {
                const stackDepth = stack.length - 1 - idx;

                return (
                  <motion.div
                    key={`p20-stack-${stackDepth}-${item}`}
                    id={`p20-stack-item-${stackDepth}`}
                    layout
                    initial={{ opacity: 0, y: -24, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.15 } }}
                    transition={{ type: "spring", stiffness: 450, damping: 25 }}
                  >
                    <span id={`p20-stack-val-${stackDepth}`}>{item}</span>
                  </motion.div>
                );
              })}
          </AnimatePresence>
        </div>
        <span id="p20-bucket-tag">Stack (LIFO)</span>
      </div>

      {/* Output Result Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p20-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
          >
            <div id="p20-callout-header-text">{output.label}</div>
            <div id="p20-callout-val-text">{output.value}</div>
            <div id="p20-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}