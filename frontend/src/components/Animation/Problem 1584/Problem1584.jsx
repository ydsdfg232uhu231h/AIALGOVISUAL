import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem1584.css";

export default function Problem1584({ stepData }) {
  const {
    points = [
      [0, 0],
      [2, 2],
      [3, 10],
      [5, 2],
      [7, 0],
      [3, 5],
      [6, 7],
      [1, 8]
    ],
    visited = [],
    connectedEdges = [],
    state = {},
    output
  } = stepData || {};

  const { res = 0, edgeCost = null, addedEdge = null } = state;
  const visitedSet = new Set(visited);

  const width = 560;
  const height = 320;
  const padX = 50;
  const padY = 45;

  // Auto-calculate bounds for dynamic point arrays
  const xValues = points.map((p) => p[0]);
  const yValues = points.map((p) => p[1]);
  const minX = Math.min(...xValues, 0);
  const maxX = Math.max(...xValues, 1);
  const minY = Math.min(...yValues, 0);
  const maxY = Math.max(...yValues, 1);

  const scaleX = (x) => padX + ((x - minX) / (maxX - minX || 1)) * (width - 2 * padX);
  const scaleY = (y) => height - padY - ((y - minY) / (maxY - minY || 1)) * (height - 2 * padY);

  return (
    <div className="canvas-wrapper mst-canvas">
      {/* Top Metrics Row */}
      <div className="metrics-row">
        <span className="metric-chip cost-chip">
          Total MST Cost: <b>{res}</b>
        </span>
        <span className="metric-chip visited-chip">
          Connected Points: <b>{visited.length} / {points.length}</b>
        </span>
        {addedEdge && (
          <span className="metric-chip added-chip">
            Added Edge: <b>{addedEdge}</b> (+{edgeCost})
          </span>
        )}
      </div>

      {/* SVG 2D Coordinate Plane */}
      <div className="plane-card">
        <svg viewBox={`0 0 ${width} ${height}`} className="mst-svg">
          <defs>
            <pattern id="grid8" width="28" height="28" patternUnits="userSpaceOnUse">
              <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#22232a" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width={width} height={height} fill="url(#grid8)" />

          {/* Connected MST Edges */}
          {connectedEdges.map(([u, v], idx) => {
            const p1 = points[u];
            const p2 = points[v];
            const x1 = scaleX(p1[0]);
            const y1 = scaleY(p1[1]);
            const x2 = scaleX(p2[0]);
            const y2 = scaleY(p2[1]);
            const weight = Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);

            return (
              <g key={`edge-${idx}-${u}-${v}`}>
                <motion.line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#22c55e"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <rect
                  x={(x1 + x2) / 2 - 11}
                  y={(y1 + y2) / 2 - 9}
                  width="22"
                  height="16"
                  rx="4"
                  fill="#111215"
                  stroke="#22c55e"
                  strokeWidth="1"
                />
                <text
                  x={(x1 + x2) / 2}
                  y={(y1 + y2) / 2 + 3}
                  fill="#86efac"
                  fontSize="10"
                  fontWeight="800"
                  textAnchor="middle"
                >
                  {weight}
                </text>
              </g>
            );
          })}

          {/* Point Nodes */}
          {points.map(([px, py], idx) => {
            const cx = scaleX(px);
            const cy = scaleY(py);
            const isVisited = visitedSet.has(idx);

            return (
              <g key={`pt-${idx}`}>
                {isVisited && (
                  <circle cx={cx} cy={cy} r="16" fill="rgba(34, 197, 94, 0.2)" />
                )}
                <motion.circle
                  cx={cx}
                  cy={cy}
                  r="11"
                  fill={isVisited ? "#22c55e" : "#18181b"}
                  stroke={isVisited ? "#86efac" : "#52525b"}
                  strokeWidth="2.5"
                  animate={{ scale: isVisited ? 1.08 : 1 }}
                  transition={{ type: "spring", stiffness: 350, damping: 20 }}
                />
                <text
                  x={cx}
                  y={cy + 4}
                  fill={isVisited ? "#000" : "#a1a1aa"}
                  fontSize="11"
                  fontWeight="800"
                  textAnchor="middle"
                >
                  {idx}
                </text>
                <text
                  x={cx}
                  y={cy - 15}
                  fill="#71717a"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  ({px},{py})
                </text>
              </g>
            );
          })}
        </svg>
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