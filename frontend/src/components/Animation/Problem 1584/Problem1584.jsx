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
    <div id="p1584-mst-canvas">
      {/* Top Metrics Row */}
      <div id="p1584-metrics-bar">
        <span id="p1584-metric-cost">
          Total MST Cost: <b>{res}</b>
        </span>
        <span id="p1584-metric-visited">
          Connected Points: <b>{visited.length} / {points.length}</b>
        </span>
        {addedEdge && (
          <span id="p1584-metric-added">
            Added Edge: <b>{addedEdge}</b> (+{edgeCost})
          </span>
        )}
      </div>

      {/* SVG 2D Coordinate Plane */}
      <div id="p1584-plane-card">
        <svg id="p1584-mst-svg" viewBox={`0 0 ${width} ${height}`}>
          <defs>
            <pattern id="p1584-grid8" width="28" height="28" patternUnits="userSpaceOnUse">
              <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#22232a" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width={width} height={height} fill="url(#p1584-grid8)" />

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
              <g key={`p1584-edge-${idx}-${u}-${v}`} id={`p1584-edge-group-${u}-${v}`}>
                <motion.line
                  id={`p1584-edge-line-${u}-${v}`}
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
                  id={`p1584-edge-rect-${u}-${v}`}
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
                  id={`p1584-edge-text-${u}-${v}`}
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
              <g key={`p1584-pt-${idx}`} id={`p1584-pt-group-${idx}`}>
                {isVisited && (
                  <circle
                    id={`p1584-pt-halo-${idx}`}
                    cx={cx}
                    cy={cy}
                    r="16"
                    fill="rgba(34, 197, 94, 0.2)"
                  />
                )}
                <motion.circle
                  id={`p1584-pt-circle-${idx}`}
                  data-is-visited={isVisited ? "true" : "false"}
                  cx={cx}
                  cy={cy}
                  r="11"
                  strokeWidth="2.5"
                  layout
                  animate={{ scale: isVisited ? 1.08 : 1 }}
                  transition={{ type: "spring", stiffness: 350, damping: 20 }}
                />
                <text
                  id={`p1584-pt-label-${idx}`}
                  data-is-visited={isVisited ? "true" : "false"}
                  x={cx}
                  y={cy + 4}
                  fontSize="11"
                  fontWeight="800"
                  textAnchor="middle"
                >
                  {idx}
                </text>
                <text
                  id={`p1584-pt-coords-${idx}`}
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

      {/* Output Callout (Elevated safely above playback controls) */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p1584-result-callout-box"
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ type: "spring", stiffness: 360, damping: 26 }}
          >
            <div id="p1584-callout-header-text">{output.label}</div>
            <div id="p1584-callout-val-text">{output.value}</div>
            <div id="p1584-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}