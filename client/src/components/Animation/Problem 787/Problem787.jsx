import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem787.css";

export default function Problem787({ stepData }) {
  const {
    prices = [0, 100, 200, 350, 700],
    iteration = 0,
    activeFlight = null,
    pathHighlight = [],
    isCompleted = false,
    finalRoute = [0, 1, 2, 4],
    state = {},
    output
  } = stepData || {};

  const n = 5;
  const src = 0;
  const dst = 4;
  const k = 2;

  const nodePositions = {
    0: { x: 60, y: 150 },
    1: { x: 160, y: 70 },
    2: { x: 240, y: 220 },
    3: { x: 340, y: 80 },
    4: { x: 440, y: 150 }
  };

  const flights = [
    { from: 0, to: 1, cost: 100 },
    { from: 0, to: 2, cost: 500 },
    { from: 1, to: 2, cost: 100 },
    { from: 1, to: 3, cost: 1000 },
    { from: 1, to: 4, cost: 600 },
    { from: 2, to: 3, cost: 150 },
    { from: 2, to: 4, cost: 500 },
    { from: 3, to: 4, cost: 200 }
  ];

  const getPathD = (from, to) => {
    const p1 = nodePositions[from];
    const p2 = nodePositions[to];
    if (from === 1 && to === 4) return `M ${p1.x} ${p1.y} Q 300 110 ${p2.x} ${p2.y}`;
    if (from === 0 && to === 2) return `M ${p1.x} ${p1.y} Q 140 200 ${p2.x} ${p2.y}`;
    if (from === 2 && to === 4) return `M ${p1.x} ${p1.y} Q 350 210 ${p2.x} ${p2.y}`;
    return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;
  };

  const getPlaneAngle = (from, to) => {
    const p1 = nodePositions[from];
    const p2 = nodePositions[to];
    const angleRad = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    return (angleRad * 180) / Math.PI;
  };

  // Build keyframes for the full final route
  const finalWaypointsX = finalRoute.map((node) => nodePositions[node].x);
  const finalWaypointsY = finalRoute.map((node) => nodePositions[node].y);

  // Compute rotation angles for each path segment
  const finalRotations = finalRoute.slice(0, -1).map((node, i) =>
    getPlaneAngle(node, finalRoute[i + 1])
  );
  // Duplicate last angle for the destination landing
  finalRotations.push(finalRotations[finalRotations.length - 1]);

  return (
    <div id="p787-flights-canvas">
      {/* Top Metrics Row */}
      <div id="p787-metrics-bar">
        <span id="p787-metric-src">
          Source: <b>City {src}</b>
        </span>
        <span id="p787-metric-dst">
          Destination: <b>City {dst}</b>
        </span>
        <span id="p787-metric-stops">
          Max Stops (k): <b>{k}</b>
        </span>
        <span id="p787-metric-iter">
          Stops Used: <b>{Math.min(k, Math.max(0, iteration - 1))} / {k}</b>
        </span>
      </div>

      {/* Flight Stage */}
      <div id="p787-flights-stage">
        <div id="p787-flight-map-card">
          <svg id="p787-flight-svg" viewBox="0 0 500 280">
            <defs>
              <marker
                id="p787-arrow"
                markerWidth="8"
                markerHeight="6"
                refX="18"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#3f3f46" />
              </marker>
              <marker
                id="p787-arrow-active"
                markerWidth="8"
                markerHeight="6"
                refX="18"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#22c55e" />
              </marker>
            </defs>

            {/* Render Edge Routes */}
            {flights.map((flight, idx) => {
              const d = getPathD(flight.from, flight.to);
              const isShortestPath = pathHighlight.some(
                ([u, v]) => u === flight.from && v === flight.to
              );
              const p1 = nodePositions[flight.from];
              const p2 = nodePositions[flight.to];
              const midX = (p1.x + p2.x) / 2;
              const midY = (p1.y + p2.y) / 2;

              return (
                <g key={`p787-flight-group-${idx}`} id={`p787-flight-group-${idx}`}>
                  <path
                    id={`p787-flight-path-${idx}`}
                    d={d}
                    fill="none"
                    stroke={isShortestPath ? "#22c55e" : "#27272a"}
                    strokeWidth={isShortestPath ? "3" : "1.5"}
                    markerEnd={isShortestPath ? "url(#p787-arrow-active)" : "url(#p787-arrow)"}
                  />
                  <rect
                    id={`p787-flight-rect-${idx}`}
                    x={midX - 16}
                    y={midY - 9}
                    width="32"
                    height="16"
                    rx="4"
                    fill="#101014"
                    stroke={isShortestPath ? "#22c55e" : "#3f3f46"}
                    strokeWidth="1"
                  />
                  <text
                    id={`p787-flight-text-${idx}`}
                    x={midX}
                    y={midY + 3}
                    fill={isShortestPath ? "#86efac" : "#a1a1aa"}
                    fontSize="9"
                    fontWeight="800"
                    textAnchor="middle"
                  >
                    ${flight.cost}
                  </text>
                </g>
              );
            })}

            {/* 1. Step-by-Step Exploration Airplane */}
            {!isCompleted && activeFlight && (
              <motion.g
                id="p787-airplane-step"
                initial={{
                  x: nodePositions[activeFlight.from].x,
                  y: nodePositions[activeFlight.from].y,
                  opacity: 0
                }}
                animate={{
                  x: [
                    nodePositions[activeFlight.from].x,
                    nodePositions[activeFlight.to].x
                  ],
                  y: [
                    nodePositions[activeFlight.from].y,
                    nodePositions[activeFlight.to].y
                  ],
                  opacity: [0, 1, 1, 0.8]
                }}
                transition={{
                  duration: 1.4,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 0.4
                }}
              >
                <circle r="3" fill="#38bdf8" opacity="0.4" cx="-8" />
                <circle r="2" fill="#38bdf8" opacity="0.2" cx="-14" />
                <g transform={`rotate(${getPlaneAngle(activeFlight.from, activeFlight.to)})`}>
                  <path
                    d="M 10 0 L -6 -6 L -3 0 L -6 6 Z"
                    fill="#38bdf8"
                    stroke="#fff"
                    strokeWidth="1"
                    filter="drop-shadow(0 0 6px rgba(56, 189, 248, 0.8))"
                  />
                </g>
              </motion.g>
            )}

            {/* 2. Decided Full-Route Flyover Airplane */}
            {isCompleted && (
              <motion.g
                id="p787-airplane-final"
                initial={{
                  x: finalWaypointsX[0],
                  y: finalWaypointsY[0],
                  opacity: 0
                }}
                animate={{
                  x: finalWaypointsX,
                  y: finalWaypointsY,
                  opacity: [0, 1, 1, 1, 0]
                }}
                transition={{
                  duration: 4.5,
                  ease: "linear",
                  repeat: Infinity,
                  repeatDelay: 0.6,
                  times: [0, 0.33, 0.66, 1]
                }}
              >
                <circle r="4" fill="#22c55e" opacity="0.5" cx="-10" />
                <circle r="2.5" fill="#facc15" opacity="0.6" cx="-16" />

                <motion.g
                  animate={{
                    rotate: finalRotations
                  }}
                  transition={{
                    duration: 4.5,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 0.6,
                    times: [0, 0.33, 0.66, 1]
                  }}
                >
                  <path
                    d="M 12 0 L -7 -7 L -3 0 L -7 7 Z"
                    fill="#22c55e"
                    stroke="#fff"
                    strokeWidth="1.2"
                    filter="drop-shadow(0 0 8px rgba(34, 197, 94, 0.9))"
                  />
                </motion.g>
              </motion.g>
            )}

            {/* City Nodes */}
            {Array.from({ length: n }).map((_, idx) => {
              const pos = nodePositions[idx];
              const isSrc = idx === src;
              const isDst = idx === dst;
              const inFinalRoute = isCompleted && finalRoute.includes(idx);

              return (
                <g key={`p787-city-node-${idx}`} id={`p787-city-node-${idx}`}>
                  <motion.circle
                    id={`p787-city-circle-${idx}`}
                    cx={pos.x}
                    cy={pos.y}
                    r="18"
                    fill={isSrc ? "#1e3a8a" : isDst ? "#064e3b" : inFinalRoute ? "#14532d" : "#18181b"}
                    stroke={inFinalRoute || isDst ? "#22c55e" : isSrc ? "#38bdf8" : "#52525b"}
                    strokeWidth="2"
                    layout
                    animate={{
                      scale: inFinalRoute ? [1, 1.1, 1] : 1
                    }}
                    transition={{
                      repeat: inFinalRoute ? Infinity : 0,
                      duration: 2.2
                    }}
                  />
                  <text
                    id={`p787-city-text-${idx}`}
                    x={pos.x}
                    y={pos.y + 4}
                    fill="#fff"
                    fontSize="11"
                    fontWeight="800"
                    textAnchor="middle"
                  >
                    {idx}
                  </text>
                  <text
                    id={`p787-city-label-${idx}`}
                    x={pos.x}
                    y={pos.y - 24}
                    fill={isSrc ? "#38bdf8" : isDst ? "#86efac" : inFinalRoute ? "#4ade80" : "#71717a"}
                    fontSize="9"
                    fontWeight="800"
                    textAnchor="middle"
                  >
                    {isSrc ? "SRC" : isDst ? "DST" : `CITY ${idx}`}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* DP Prices Relaxation Array */}
        <div id="p787-prices-table-card">
          <div id="p787-table-title">Bellman-Ford Shortest Prices (k = {k} Stops)</div>
          <div id="p787-prices-grid">
            {prices.map((p, idx) => {
              const isUpdated = p !== "INF";
              const inFinalRoute = isCompleted && finalRoute.includes(idx);

              let badgeState = "inf";
              if (inFinalRoute) badgeState = "final";
              else if (isUpdated) badgeState = "updated";

              return (
                <div key={`p787-price-col-${idx}`} id={`p787-price-col-${idx}`}>
                  <span id={`p787-col-node-label-${idx}`}>City {idx}</span>
                  <motion.div
                    id={`p787-price-badge-${idx}`}
                    data-badge-state={badgeState}
                    layout
                    animate={{ scale: isUpdated ? 1.04 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {p === "INF" ? "∞" : `$${p}`}
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Output Callout (Elevated safely above playback controls) */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p787-result-callout-box"
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ type: "spring", stiffness: 360, damping: 26 }}
          >
            <div id="p787-callout-header-text">{output.label}</div>
            <div id="p787-callout-val-text">{output.value}</div>
            <div id="p787-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}