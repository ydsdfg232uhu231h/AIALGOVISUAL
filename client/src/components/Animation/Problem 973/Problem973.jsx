import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem973.css";

export default function Problem973({ stepData }) {
  const {
    points = [],
    heap = [],
    res = [],
    activePoint = null,
    activeRadius = 0,
    state = {},
    output
  } = stepData || {};

  const { k = 2 } = state;
  const resSet = new Set(res.map(([x, y]) => `${x},${y}`));

  // Viewport Dimensions
  const width = 480;
  const height = 320;
  const originX = width / 2;
  const originY = height / 2;

  // Auto-fit scale to prevent circles from breaching boundary
  const allCoords = points.map((p) => p.coords || [0, 0]);
  const maxCoord = Math.max(
    ...allCoords.map(([x, y]) => Math.max(Math.abs(x), Math.abs(y))),
    Math.sqrt(activeRadius) || 0,
    3 // Minimum boundary fallback
  );

  // Leave a 40px safe margin around the outer edge
  const safeMargin = 40;
  const availableRadius = Math.min(originX, originY) - safeMargin;
  const dynamicScale = availableRadius / maxCoord;

  const toSvgX = (x) => originX + x * dynamicScale;
  const toSvgY = (y) => originY - y * dynamicScale;

  const sweepRadiusPx = Math.sqrt(activeRadius) * dynamicScale;

  return (
    <div id="p973-kclosest-canvas">
      {/* Metrics Row */}
      <div id="p973-metrics-bar">
        <span id="p973-metric-k-target">
          Target Closest: <b>k = {k}</b>
        </span>

        <span id="p973-metric-heap-count">
          Min-Heap Size: <b>{heap.length} points</b>
        </span>

        <span id="p973-metric-res-count">
          Extracted: <b>{res.length} / {k}</b>
        </span>

        {activeRadius > 0 ? (
          <span id="p973-metric-radius-active">
            Threshold Radius: <b>r ≈ {Math.sqrt(activeRadius).toFixed(2)}</b> (d²={activeRadius})
          </span>
        ) : (
          <span id="p973-metric-radius-idle">
            Threshold Radius: <b>r = 0.00</b>
          </span>
        )}
      </div>

      <div id="p973-kclosest-stage">
        {/* Radar Cartesian Plane */}
        <div id="p973-cartesian-card">
          <svg id="p973-radar-plane-svg" viewBox={`0 0 ${width} ${height}`}>
            <defs>
              <pattern id="p973-radarGrid" width="16" height="16" patternUnits="userSpaceOnUse">
                <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#22232a" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width={width} height={height} fill="url(#p973-radarGrid)" />

            {/* Concentric Guide Rings */}
            {[1, 2, 3, 4, 5].map((multiplier) => {
              const ringRadius = (maxCoord / 3) * multiplier * dynamicScale;
              if (ringRadius > availableRadius + 20) return null;

              return (
                <circle
                  key={`p973-guide-ring-${multiplier}`}
                  cx={originX}
                  cy={originY}
                  r={ringRadius}
                  fill="none"
                  stroke="#27272a"
                  strokeDasharray="2,4"
                />
              );
            })}

            {/* Dynamic Sweep Radius Circle */}
            {activeRadius > 0 && (
              <motion.circle
                id="p973-sweep-radius-circle"
                cx={originX}
                cy={originY}
                r={sweepRadiusPx}
                fill="rgba(56, 189, 248, 0.08)"
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="4,4"
                initial={{ r: 0 }}
                animate={{ r: sweepRadiusPx }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            )}

            {/* Axes */}
            <line x1={0} y1={originY} x2={width} y2={originY} stroke="#3f3f46" strokeWidth="1.5" />
            <line x1={originX} y1={0} x2={originX} y2={height} stroke="#3f3f46" strokeWidth="1.5" />

            {/* Center Origin (0,0) */}
            <circle cx={originX} cy={originY} r="5" fill="#facc15" />
            <text x={originX + 8} y={originY + 14} fill="#e4e4e7" fontSize="10" fontWeight="700">
              (0,0)
            </text>

            {/* Candidate Points */}
            {points.map((p, idx) => {
              const [px, py] = p.coords || [0, 0];
              const cx = toSvgX(px);
              const cy = toSvgY(py);
              const isSelected = resSet.has(`${px},${py}`);
              const isActive = activePoint && activePoint[0] === px && activePoint[1] === py;

              return (
                <g key={`p973-point-group-${idx}-${px}-${py}`} id={`p973-point-group-${idx}`}>
                  {/* Distance Vector to Origin */}
                  <motion.line
                    id={`p973-vector-line-${idx}`}
                    x1={originX}
                    y1={originY}
                    x2={cx}
                    y2={cy}
                    stroke={isSelected ? "#22c55e" : isActive ? "#38bdf8" : "#52525b"}
                    strokeWidth={isSelected ? "2.5" : isActive ? "2" : "1"}
                    strokeDasharray={isSelected ? "none" : "3,3"}
                  />

                  {/* Highlight Halo */}
                  {isSelected && (
                    <motion.circle
                      id={`p973-point-halo-${idx}`}
                      cx={cx}
                      cy={cy}
                      r="14"
                      fill="rgba(34, 197, 94, 0.25)"
                      initial={{ scale: 0.6 }}
                      animate={{ scale: [1, 1.25, 1] }}
                      transition={{ repeat: Infinity, duration: 1.8 }}
                    />
                  )}

                  {/* Marker Node */}
                  <motion.circle
                    id={`p973-point-node-${idx}`}
                    cx={cx}
                    cy={cy}
                    r={isActive ? 7 : 5.5}
                    fill={isSelected ? "#22c55e" : isActive ? "#38bdf8" : "#818cf8"}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    animate={{ scale: isActive ? 1.2 : 1 }}
                    transition={{ type: "spring", stiffness: 350, damping: 20 }}
                  />

                  {/* Point Coordinate Tag */}
                  <text
                    id={`p973-point-coord-text-${idx}`}
                    x={cx + 8}
                    y={cy - 6}
                    fill="#ffffff"
                    fontSize="10"
                    fontWeight="800"
                    fontFamily="monospace"
                  >
                    [{px}, {py}]
                  </text>
                  {p.dist !== undefined && (
                    <text
                      id={`p973-point-dist-text-${idx}`}
                      x={cx + 8}
                      y={cy + 8}
                      fill="#a1a1aa"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      d²={p.dist}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Min-Heap Priority Queue & Extracted Results */}
        <div id="p973-heap-panel">
          <div id="p973-heap-panel-header">
            <span id="p973-heap-title">Min-Heap State (Ordered by d²)</span>
            <span id="p973-heap-sub">Root holds minimum Euclidean distance</span>
          </div>

          <div id="p973-heap-list-viewport">
            <AnimatePresence mode="popLayout">
              {heap.length === 0 ? (
                <span id="p973-heap-empty-text">Heap is empty</span>
              ) : (
                heap.map((item, idx) => {
                  const [x, y] = item.point || [0, 0];
                  const isRoot = idx === 0;

                  return (
                    <motion.div
                      key={`p973-heap-item-${x}-${y}-${idx}`}
                      id={`p973-heap-card-${idx}`}
                      data-card-state={isRoot ? "root" : "idle"}
                      layout
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ type: "spring", stiffness: 350, damping: 24 }}
                    >
                      <span id={`p973-heap-order-badge-${idx}`}>#{idx}</span>
                      <span id={`p973-heap-pt-val-${idx}`}>[{x}, {y}]</span>
                      <span id={`p973-heap-dist-tag-${idx}`}>d² = {item.dist}</span>
                      {isRoot && <span id="p973-heap-root-pill">ROOT MIN</span>}
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>

          <div id="p973-res-panel-header">
            <span id="p973-res-title">Extracted Closest Array</span>
            <span id="p973-res-sub">Top {k} points</span>
          </div>

          <div id="p973-res-list-viewport">
            <AnimatePresence mode="popLayout">
              {res.length === 0 ? (
                <span id="p973-res-empty-text">Awaiting heap extract...</span>
              ) : (
                res.map(([rx, ry], idx) => (
                  <motion.span
                    key={`p973-res-chip-${rx}-${ry}-${idx}`}
                    id={`p973-res-chip-item-${idx}`}
                    layout
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    #{idx + 1}: [{rx}, {ry}]
                  </motion.span>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Output Callout (Elevated safely above playback controls) */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p973-result-callout-box"
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ type: "spring", stiffness: 360, damping: 26 }}
          >
            <div id="p973-callout-header-text">{output.label}</div>
            <div id="p973-callout-val-text">{output.value}</div>
            <div id="p973-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}