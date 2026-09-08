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

  return (
    <div className="canvas-wrapper alu-canvas">
      {/* Top Status & Telemetry Strip */}
      <div className="metrics-row">
        <span className="metric-chip round-chip">
          Cycle Round: <b>#{round}</b>
        </span>
        <span className={`metric-chip loop-chip ${b !== 0 ? "chip-running" : "chip-halted"}`}>
          Loop Check: <b>b {b !== 0 ? "!= 0 (Continue)" : "== 0 (Halt)"}</b>
        </span>
        <span className="metric-chip phase-chip">
          ALU Gate: <b>{activePhase}</b>
        </span>
      </div>

      {/* Main ALU Chassis */}
      <div className="alu-chassis">
        {/* Bit Column Weights Header (2^7 down to 2^0) */}
        <div className="bit-column-headers">
          <span className="reg-id-label">REG</span>
          <div className="bit-cells-row">
            {Array.from({ length: BITS_COUNT }).map((_, i) => (
              <span key={`weight-${i}`} className={`bit-weight ${highlightCols.includes(i) ? "weight-lit" : ""}`}>
                {Math.pow(2, 7 - i)}
              </span>
            ))}
          </div>
          <span className="dec-val-label">DEC</span>
        </div>

        {/* Register A: Input / Partial Sum */}
        <div className="register-lane lane-a">
          <div className="lane-meta">
            <span className="lane-tag tag-a">A</span>
            <span className="lane-role">Partial Sum</span>
          </div>
          <div className="bit-cells-row">
            {bitsA.map((bit, idx) => {
              const isColLit = highlightCols.includes(idx);
              return (
                <motion.div
                  key={`bit-a-${idx}-${bit}`}
                  className={`bit-box ${bit === 1 ? "bit-high high-a" : "bit-low"} ${isColLit ? "col-focus" : ""}`}
                  animate={{ scale: isColLit ? 1.08 : 1 }}
                >
                  {bit}
                </motion.div>
              );
            })}
          </div>
          <span className="lane-decimal">{a}</span>
        </div>

        {/* Dynamic Silicon Logic Gate Layer */}
        {/* Dynamic Silicon Logic Gate Layer */}
<div className="circuit-bus-layer">
  <svg viewBox="0 0 460 70" className="bus-svg">
    <defs>
      {/* High-Voltage Active Wire Gradient */}
      <linearGradient id="wireActiveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
        <stop offset="50%" stopColor="#22c55e" stopOpacity="1" />
        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.3" />
      </linearGradient>

      {/* Radiant Glow Filter for the Electric Pulses */}
      <filter id="electronGlow" x="-50%" y="-50%" width="200%" height="200%">
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
        <g key={`wire-${idx}`} className={`circuit-conduit ${isHot ? "conduit-hot" : ""}`}>
          {/* Base Wire Track */}
          <line
            x1={colX}
            y1={0}
            x2={colX}
            y2={70}
            stroke={isHot ? "url(#wireActiveGrad)" : "#1f1f23"}
            strokeWidth={isHot ? 2.5 : 1}
            strokeDasharray={isHot ? "3,2" : "none"}
          />

          {/* Glowing Current Pulse */}
          {isHot && (
            <motion.g
              initial={{ y: 5 }}
              animate={{ y: [5, 60, 5] }}
              transition={{
                duration: 1.1,
                repeat: Infinity,
                ease: "easeInOut",
                delay: idx * 0.08 // Cascading wave stagger
              }}
            >
              {/* Diffuse Outer Glow Halo */}
              <circle
                cx={colX}
                cy={0}
                r={7}
                fill="#22c55e"
                opacity={0.35}
                filter="url(#electronGlow)"
              />
              {/* Photon Trailing Tail */}
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
              {/* Hot White Plasma Core */}
              <circle
                cx={colX}
                cy={0}
                r={3}
                fill="#ffffff"
                filter="url(#electronGlow)"
              />
            </motion.g>
          )}
        </g>
      );
    })}
  </svg>

  {/* Realtime ALU Gate Card */}
  <div className="alu-microcode-banner">
    <div
      className={`gate-core ${
        activePhase.includes("XOR")
          ? "core-xor"
          : activePhase.includes("AND") || activePhase.includes("SHIFT")
          ? "core-and"
          : "core-idle"
      }`}
    >
      <span className="core-operator">
        {activePhase.includes("XOR")
          ? "⊕ (XOR)"
          : activePhase.includes("SHIFT")
          ? "≪ 1 (SHIFT)"
          : activePhase.includes("AND")
          ? "& (AND)"
          : "ALU IDLE"}
      </span>
      <span className="core-desc">{explanationText || "Processing bitwise logic"}</span>
    </div>
  </div>
</div>

        {/* Register B: Carry Input / Shifter Target */}
        <div className="register-lane lane-b">
          <div className="lane-meta">
            <span className="lane-tag tag-b">B</span>
            <span className="lane-role">Carry Source</span>
          </div>
          <div className="bit-cells-row">
            {bitsB.map((bit, idx) => {
              const isColLit = highlightCols.includes(idx);
              return (
                <motion.div
                  key={`bit-b-${idx}-${bit}`}
                  className={`bit-box ${bit === 1 ? "bit-high high-b" : "bit-low"} ${isColLit ? "col-focus" : ""}`}
                  animate={{ scale: isColLit ? 1.08 : 1 }}
                >
                  {bit}
                </motion.div>
              );
            })}
          </div>
          <span className="lane-decimal">{b}</span>
        </div>

        {/* Shifted Carry Vector (a & b) << 1 */}
        <div className="register-lane lane-carry">
          <div className="lane-meta">
            <span className="lane-tag tag-carry">(A&amp;B)≪1</span>
            <span className="lane-role">Next Carry</span>
          </div>
          <div className="bit-cells-row">
            {bitsCarry.map((bit, idx) => {
              const isColLit = highlightCols.includes(idx);
              return (
                <motion.div
                  key={`bit-c-${idx}-${bit}`}
                  className={`bit-box ${bit === 1 ? "bit-high high-carry" : "bit-low"} ${isColLit ? "col-focus" : ""}`}
                  animate={{ scale: bit === 1 ? [1, 1.06, 1] : 1 }}
                  transition={{ duration: 0.8, repeat: bit === 1 ? Infinity : 0 }}
                >
                  {bit}
                </motion.div>
              );
            })}
          </div>
          <span className="lane-decimal">{carry}</span>
        </div>
      </div>

      {/* Output Result Callout */}
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