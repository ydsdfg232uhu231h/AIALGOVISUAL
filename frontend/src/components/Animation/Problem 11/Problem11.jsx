import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem11.css";

export default function Problem11({ stepData }) {
  const {
    heights = [1, 8, 6, 2, 5, 4, 8, 3, 7],
    left = 0,
    right = heights.length - 1,
    currentWater = 0,
    state = {},
    output
  } = stepData || {};

  const { maxW = 0, area = currentWater } = state;
  const trackRef = useRef(null);
  const [waterCoords, setWaterCoords] = useState({ left: 0, width: 0 });

  const hL = heights[left] || 0;
  const hR = heights[right] || 0;
  const minH = Math.min(hL, hR);
  const widthUnits = Math.max(0, right - left);

  // Recalculate physical bounding positions for the continuous water container
  useEffect(() => {
    if (!trackRef.current) return;
    const colNodes = trackRef.current.querySelectorAll(".bar-column");
    if (colNodes[left] && colNodes[right]) {
      const leftRect = colNodes[left].getBoundingClientRect();
      const rightRect = colNodes[right].getBoundingClientRect();
      const trackRect = trackRef.current.getBoundingClientRect();

      const startX = leftRect.left + leftRect.width / 2 - trackRect.left;
      const endX = rightRect.left + rightRect.width / 2 - trackRect.left;

      setWaterCoords({
        left: startX,
        width: Math.max(0, endX - startX)
      });
    }
  }, [left, right, heights]);

  return (
    <div className="canvas-wrapper water-container-canvas">
      {/* Metrics Row */}
      <div className="metrics-row">
        <span className="metric-chip current-area-chip">
          Current Area: <b>{widthUnits} × min({hL}, {hR}) = {area} units²</b>
        </span>
        <span className="metric-chip max-water-chip">
          Max Water Tracked: <b>{maxW} units²</b>
        </span>
        <span className="metric-chip ptr-chip">
          Pointers: <b>L=[{left}] ({hL}) | R=[{right}] ({hR})</b>
        </span>
      </div>

      {/* Bars and Continuous Water Area */}
      <div className="bars-area-container" ref={trackRef}>
        {/* Continuous Fluid Pool between L and R */}
        {waterCoords.width > 0 && (
          <motion.div
            className="fluid-water-layer"
            initial={false}
            animate={{
              left: waterCoords.left,
              width: waterCoords.width,
              height: `${minH * 22}px`
            }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
          >
            <div className="water-surface-line" />
            <div className="water-inner-glow" />
          </motion.div>
        )}

        {/* Pillars */}
        {heights.map((h, idx) => {
          const isL = idx === left;
          const isR = idx === right;
          const isBoundary = isL || isR;

          return (
            <div key={idx} className="bar-column">
              {/* Pointer Badges */}
              <div className="ptrs-group">
                {isL && <span className="pointer-tag ptr-l">L: {h}</span>}
                {isR && <span className="pointer-tag ptr-r">R: {h}</span>}
              </div>

              {/* Solid Vertical Pillar */}
              <motion.div
                className={`bar-element ${isBoundary ? "boundary-pillar" : ""}`}
                animate={{
                  height: `${h * 22}px`,
                  scaleY: 1
                }}
                transition={{ duration: 0.2 }}
              >
                <span className="bar-num">{h}</span>
              </motion.div>

              <span className="idx-tag">[{idx}]</span>
            </div>
          );
        })}
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