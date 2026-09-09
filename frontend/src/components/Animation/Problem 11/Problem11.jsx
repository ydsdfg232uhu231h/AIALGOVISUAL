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
    const colNodes = trackRef.current.querySelectorAll('[id^="p11-bar-column-"]');
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
    <div id="p11-water-container-canvas">
      {/* Metrics Row */}
      <div id="p11-metrics-row">
        <span id="p11-metric-current-area">
          Current Area: <b>{widthUnits} × min({hL}, {hR}) = {area} units²</b>
        </span>
        <span id="p11-metric-max-water">
          Max Water Tracked: <b>{maxW} units²</b>
        </span>
        <span id="p11-metric-ptr-info">
          Pointers: <b>L=[{left}] ({hL}) | R=[{right}] ({hR})</b>
        </span>
      </div>

      {/* Bars and Continuous Water Area */}
      <div id="p11-bars-area-container" ref={trackRef}>
        {/* Continuous Fluid Pool between L and R */}
        {waterCoords.width > 0 && (
          <motion.div
            id="p11-fluid-water-layer"
            initial={false}
            animate={{
              left: waterCoords.left,
              width: waterCoords.width,
              height: `${minH * 22}px`
            }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
          >
            <div id="p11-water-surface-line" />
            <div id="p11-water-inner-glow" />
          </motion.div>
        )}

        {/* Pillars */}
        {heights.map((h, idx) => {
          const isL = idx === left;
          const isR = idx === right;
          const isBoundary = isL || isR;

          return (
            <div key={`p11-col-${idx}`} id={`p11-bar-column-${idx}`}>
              {/* Pointer Badges */}
              <div id={`p11-ptrs-group-${idx}`}>
                <AnimatePresence mode="popLayout">
                  {isL && (
                    <motion.span
                      key={`p11-ptr-l-${idx}`}
                      id={`p11-pointer-tag-l-${idx}`}
                      layout
                      initial={{ y: -6, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -6, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 450, damping: 25 }}
                    >
                      L: {h}
                    </motion.span>
                  )}
                  {isR && (
                    <motion.span
                      key={`p11-ptr-r-${idx}`}
                      id={`p11-pointer-tag-r-${idx}`}
                      layout
                      initial={{ y: -6, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -6, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 450, damping: 25 }}
                    >
                      R: {h}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Solid Vertical Pillar */}
              <motion.div
                id={`p11-bar-element-${idx}`}
                data-boundary={isBoundary ? "true" : "false"}
                layout
                animate={{
                  height: `${h * 22}px`,
                  scaleY: 1
                }}
                transition={{ duration: 0.2 }}
              >
                <span id={`p11-bar-num-${idx}`}>{h}</span>
              </motion.div>

              <span id={`p11-idx-tag-${idx}`}>[{idx}]</span>
            </div>
          );
        })}
      </div>

      {/* Output Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p11-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
          >
            <div id="p11-callout-header-text">{output.label}</div>
            <div id="p11-callout-val-text">{output.value}</div>
            <div id="p11-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}