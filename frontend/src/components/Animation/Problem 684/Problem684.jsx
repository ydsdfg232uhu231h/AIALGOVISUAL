import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem684.css";

export default function Problem684({ stepData }) {
  const {
    parent = [0, 1, 2, 3, 4, 5],
    edges = [
      [1, 2],
      [2, 3],
      [3, 4],
      [1, 4],
      [1, 5]
    ],
    activeEdge = null,
    cycleEdge = null,
    evaluatedEdges = [],
    state = {},
    output
  } = stepData || {};

  // Pentagon coordinates for 5 nodes
  const nodePositions = {
    1: { x: 200, y: 40 },
    2: { x: 320, y: 120 },
    3: { x: 275, y: 235 },
    4: { x: 125, y: 235 },
    5: { x: 80, y: 120 }
  };

  const rootColors = {
    1: "#38bdf8",
    2: "#a855f7",
    3: "#22c55e",
    4: "#f59e0b",
    5: "#ec4899"
  };

  return (
    <div className="canvas-wrapper dsu-canvas">
      {/* Top Metrics Row */}
      <div className="metrics-row">
        {activeEdge ? (
          <span className={`metric-chip ${cycleEdge ? "chip-cycle" : "chip-edge"}`}>
            Examining Edge: <b>[{activeEdge[0]}, {activeEdge[1]}]</b>
          </span>
        ) : (
          <span className="metric-chip chip-edge">
            Status: <b>Initializing DSU (5 Nodes)</b>
          </span>
        )}
        {cycleEdge && (
          <span className="metric-chip chip-cycle-warning">
            Redundant Edge Detected: <b>[{cycleEdge[0]}, {cycleEdge[1]}]</b>
          </span>
        )}
      </div>

      {/* Main DSU Stage */}
      <div className="dsu-stage">
        {/* Graph Canvas */}
        <div className="graph-card">
          <svg viewBox="0 0 400 280" className="dsu-svg">
            {/* Render Edges */}
            {edges.map(([u, v], idx) => {
              const p1 = nodePositions[u];
              const p2 = nodePositions[v];

              const isActive =
                activeEdge &&
                ((activeEdge[0] === u && activeEdge[1] === v) ||
                  (activeEdge[0] === v && activeEdge[1] === u));

              const isCycle =
                cycleEdge &&
                ((cycleEdge[0] === u && cycleEdge[1] === v) ||
                  (cycleEdge[0] === v && cycleEdge[1] === u));

              const isEvaluated = evaluatedEdges.some(
                ([eu, ev]) => (eu === u && ev === v) || (eu === v && ev === u)
              );

              let strokeColor = "#27272a";
              let strokeWidth = 2;
              let strokeDash = "none";

              if (isCycle) {
                strokeColor = "#ef4444";
                strokeWidth = 3.5;
                strokeDash = "6,6";
              } else if (isActive) {
                strokeColor = "#38bdf8";
                strokeWidth = 3;
              } else if (isEvaluated) {
                strokeColor = "#22c55e";
                strokeWidth = 2.5;
              }

              return (
                <g key={`edge-${u}-${v}-${idx}`}>
                  <motion.line
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDash}
                    animate={{ stroke: strokeColor }}
                    transition={{ duration: 0.25 }}
                  />
                  {/* Midpoint Label Tag */}
                  <rect
                    x={(p1.x + p2.x) / 2 - 16}
                    y={(p1.y + p2.y) / 2 - 9}
                    width="32"
                    height="18"
                    rx="4"
                    fill="#101014"
                    stroke={strokeColor}
                    strokeWidth="1"
                  />
                  <text
                    x={(p1.x + p2.x) / 2}
                    y={(p1.y + p2.y) / 2 + 3.5}
                    fill="#e4e4e7"
                    fontSize="9"
                    fontWeight="800"
                    textAnchor="middle"
                  >
                    [{u},{v}]
                  </text>
                </g>
              );
            })}

            {/* Render 5 Nodes */}
            {[1, 2, 3, 4, 5].map((nodeId) => {
              const pos = nodePositions[nodeId];
              const pRoot = parent[nodeId] || nodeId;
              const isPushed = activeEdge && (activeEdge[0] === nodeId || activeEdge[1] === nodeId);

              return (
                <g key={`node-${nodeId}`}>
                  <motion.circle
                    cx={pos.x}
                    cy={pos.y}
                    r="19"
                    fill="#18181b"
                    stroke={isPushed ? "#38bdf8" : rootColors[pRoot] || "#71717a"}
                    strokeWidth="2.5"
                    animate={{ scale: isPushed ? 1.12 : 1 }}
                    transition={{ type: "spring", stiffness: 350, damping: 20 }}
                  />
                  <text
                    x={pos.x}
                    y={pos.y + 4.5}
                    fill="#fff"
                    fontSize="13"
                    fontWeight="800"
                    textAnchor="middle"
                  >
                    {nodeId}
                  </text>
                  <text
                    x={pos.x}
                    y={pos.y - 25}
                    fill={rootColors[pRoot] || "#a1a1aa"}
                    fontSize="9"
                    fontWeight="800"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    root: {pRoot}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* DSU Parent Array Table */}
        <div className="dsu-panel">
          <div className="panel-title">DSU Representative Parent Table</div>
          <div className="parent-table">
            <div className="table-header-row">
              <span className="th-cell">Node (i)</span>
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={`th-${i}`} className="td-cell th-val">
                  {i}
                </span>
              ))}
            </div>
            <div className="table-data-row">
              <span className="th-cell">parent[i]</span>
              {[1, 2, 3, 4, 5].map((i) => {
                const pVal = parent[i];
                const isUpdated = activeEdge && (activeEdge[0] === i || activeEdge[1] === i);

                return (
                  <motion.div
                    key={`td-${i}`}
                    className={`td-cell td-val ${isUpdated ? "cell-updated" : ""}`}
                    animate={{ scale: isUpdated ? 1.08 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {pVal}
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="union-status-card">
            <span className="status-label">Union Status:</span>
            <span className="status-val">
              {state.union || (cycleEdge ? "CYCLE DETECTED" : "Pending")}
            </span>
          </div>
        </div>
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