import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem371.css";

const BITS_COUNT = 8;

const toBitArray = (num) => {
  const val = (num ?? 0) & 0xff;
  return Array.from({ length: BITS_COUNT }, (_, idx) => (val >> (BITS_COUNT - 1 - idx)) & 1);
};

export default function Problem371({ stepData }) {
  const {
    a = 0,
    b = 0,
    carry = 0,
    activePhase = "INIT", // "INIT", "AND_CARRY", "SHIFT", "XOR_SUM", "TRANSFER", "DONE"
    round = 1,
    highlightCols = [], // Array of bit indices currently involved
    explanationText = "",
    output
  } = stepData || {};

  const bitsA = toBitArray(a);
  const bitsB = toBitArray(b);
  const bitsCarry = toBitArray(carry);

  let gatePhase = "idle";
  if (activePhase.includes("XOR")) gatePhase = "xor";
  else if (activePhase.includes("SHIFT")) gatePhase = "shift";
  else if (activePhase.includes("AND")) gatePhase = "and";

  return (
    <div id="p371-alu-canvas">
      {/* Top Status & Telemetry Strip */}
      <div id="p371-metrics-row">
        <span id="p371-metric-round">
          Cycle Round: <b>#{round}</b>
        </span>
        <span
          id="p371-metric-loop"
          data-is-running={b !== 0 ? "true" : "false"}
        >
          Loop Check: <b>b {b !== 0 ? "!= 0 (Continue)" : "== 0 (Halt)"}</b>
        </span>
        <span id="p371-metric-phase">
          ALU Gate: <b>{activePhase}</b>
        </span>
      </div>

      {/* Main ALU Chassis */}
      <div id="p371-alu-chassis">
        {/* Bit Column Weights Header (2^7 down to 2^0) */}
        <div id="p371-bit-column-headers">
          <span id="p371-reg-id-label">REG</span>
          <div id="p371-bit-cells-weights">
            {Array.from({ length: BITS_COUNT }).map((_, i) => (
              <span
                key={`p371-weight-${i}`}
                id={`p371-weight-${i}`}
                data-is-lit={highlightCols.includes(i) ? "true" : "false"}
              >
                {Math.pow(2, 7 - i)}
              </span>
            ))}
          </div>
          <span id="p371-dec-val-label">DEC</span>
        </div>

        {/* Register A: Input / Partial Sum */}
        <div id="p371-register-lane-a" data-lane-type="a">
          <div id="p371-lane-meta-a">
            <span id="p371-lane-tag-a">A</span>
            <span id="p371-lane-role-a">Partial Sum</span>
          </div>
          <div id="p371-bit-cells-row-a">
            {bitsA.map((bit, idx) => {
              const isColLit = highlightCols.includes(idx);
              return (
                <motion.div
                  key={`p371-bit-a-${idx}-${bit}`}
                  id={`p371-bit-a-${idx}`}
                  data-lane-type="a"
                  data-bit-val={bit}
                  data-is-lit={isColLit ? "true" : "false"}
                  layout
                  animate={{ scale: isColLit ? 1.08 : 1 }}
                  transition={{ type: "spring", stiffness: 350, damping: 20 }}
                >
                  {bit}
                </motion.div>
              );
            })}
          </div>
          <span id="p371-lane-decimal-a">{a}</span>
        </div>

        {/* Dynamic Silicon Logic Gate Layer */}
        <div id="p371-circuit-bus-layer">
          <svg id="p371-bus-svg" viewBox="0 0 460 70">
            <defs>
              <linearGradient id="p371-wireActiveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#22c55e" stopOpacity="1" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.3" />
              </linearGradient>

              <filter id="p371-electronGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur1" />
                <feGaussianBlur stdDeviation="6" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Vertical Wire Conduits */}
            {Array.from({ length: BITS_COUNT }).map((_, idx) => {
              const colX = 72 + idx * 46;
              const isHot = highlightCols.includes(idx);

              return (
                <g
                  key={`p371-wire-${idx}`}
                  id={`p371-wire-g-${idx}`}
                  data-is-lit={isHot ? "true" : "false"}
                >
                  <line
                    id={`p371-wire-line-${idx}`}
                    x1={colX}
                    y1={0}
                    x2={colX}
                    y2={70}
                    stroke={isHot ? "url(#p371-wireActiveGrad)" : "#1f1f23"}
                    strokeWidth={isHot ? 2.5 : 1}
                    strokeDasharray={isHot ? "3,2" : "none"}
                  />

                  {isHot && (
                    <motion.g
                      key={`p371-pulse-${idx}`}
                      initial={{ y: 5 }}
                      animate={{ y: [5, 60, 5] }}
                      transition={{
                        duration: 1.1,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: idx * 0.08
                      }}
                    >
                      <circle
                        cx={colX}
                        cy={0}
                        r={7}
                        fill="#22c55e"
                        opacity={0.35}
                        filter="url(#p371-electronGlow)"
                      />
                      <line
                        x1={colX}
                        y1={-6}
                        x2={colX}
                        y2={6}
                        stroke="#86efac"
                        strokeWidth={2}
                        opacity={0.7}
                        strokeLinecap="round"
                      />
                      <circle
                        cx={colX}
                        cy={0}
                        r={3}
                        fill="#ffffff"
                        filter="url(#p371-electronGlow)"
                      />
                    </motion.g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Realtime ALU Gate Card */}
          <div id="p371-alu-microcode-banner">
            <div id="p371-gate-core" data-gate-phase={gatePhase}>
              <span id="p371-core-operator">
                {activePhase.includes("XOR")
                  ? "⊕ (XOR)"
                  : activePhase.includes("SHIFT")
                  ? "≪ 1 (SHIFT)"
                  : activePhase.includes("AND")
                  ? "& (AND)"
                  : "ALU IDLE"}
              </span>
              <span id="p371-core-desc">
                {explanationText || "Processing bitwise logic"}
              </span>
            </div>
          </div>
        </div>

        {/* Register B: Carry Input / Shifter Target */}
        <div id="p371-register-lane-b" data-lane-type="b">
          <div id="p371-lane-meta-b">
            <span id="p371-lane-tag-b">B</span>
            <span id="p371-lane-role-b">Carry Source</span>
          </div>
          <div id="p371-bit-cells-row-b">
            {bitsB.map((bit, idx) => {
              const isColLit = highlightCols.includes(idx);
              return (
                <motion.div
                  key={`p371-bit-b-${idx}-${bit}`}
                  id={`p371-bit-b-${idx}`}
                  data-lane-type="b"
                  data-bit-val={bit}
                  data-is-lit={isColLit ? "true" : "false"}
                  layout
                  animate={{ scale: isColLit ? 1.08 : 1 }}
                  transition={{ type: "spring", stiffness: 350, damping: 20 }}
                >
                  {bit}
                </motion.div>
              );
            })}
          </div>
          <span id="p371-lane-decimal-b">{b}</span>
        </div>

        {/* Shifted Carry Vector (a & b) << 1 */}
        <div id="p371-register-lane-carry" data-lane-type="carry">
          <div id="p371-lane-meta-carry">
            <span id="p371-lane-tag-carry">(A&amp;B)≪1</span>
            <span id="p371-lane-role-carry">Next Carry</span>
          </div>
          <div id="p371-bit-cells-row-carry">
            {bitsCarry.map((bit, idx) => {
              const isColLit = highlightCols.includes(idx);
              return (
                <motion.div
                  key={`p371-bit-c-${idx}-${bit}`}
                  id={`p371-bit-c-${idx}`}
                  data-lane-type="carry"
                  data-bit-val={bit}
                  data-is-lit={isColLit ? "true" : "false"}
                  layout
                  animate={{ scale: bit === 1 && isColLit ? 1.08 : 1 }}
                  transition={{ type: "spring", stiffness: 350, damping: 20 }}
                >
                  {bit}
                </motion.div>
              );
            })}
          </div>
          <span id="p371-lane-decimal-carry">{carry}</span>
        </div>
      </div>

      {/* Output Result Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p371-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div id="p371-callout-header-text">{output.label}</div>
            <div id="p371-callout-val-text">{output.value}</div>
            <div id="p371-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}