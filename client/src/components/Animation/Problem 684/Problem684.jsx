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

  let metricStatus = "init";
  if (cycleEdge) metricStatus = "cycle";
  else if (activeEdge) metricStatus = "examining";

  return (
    <div id="p684-dsu-canvas">
      {/* Top Metrics Row */}
      <div id="p684-metrics-bar">
        <span id="p684-metric-status-chip" data-status={metricStatus}>
          {activeEdge ? (
            <>
              Examining Edge: <b>[{activeEdge[0]}, {activeEdge[1]}]</b>
            </>
          ) : (
            <>
              Status: <b>Initializing DSU (5 Nodes)</b>
            </>
          )}
        </span>

        {cycleEdge && (
          <span id="p684-metric-cycle-chip">
            Redundant Edge Detected: <b>[{cycleEdge[0]}, {cycleEdge[1]}]</b>
          </span>
        )}
      </div>

      {/* Main DSU Stage */}
      <div id="p684-dsu-stage">
        {/* Graph Canvas */}
        <div id="p684-graph-card">
          <svg id="p684-dsu-svg" viewBox="0 0 400 280">
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

              let edgeState = "idle";
              if (isCycle) edgeState = "cycle";
              else if (isActive) edgeState = "active";
              else if (isEvaluated) edgeState = "evaluated";

              return (
                <g key={`p684-edge-${u}-${v}-${idx}`} id={`p684-edge-group-${u}-${v}`}>
                  <line
                    id={`p684-edge-line-${u}-${v}`}
                    data-edge-state={edgeState}
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                  />
                  {/* Midpoint Label Tag */}
                  <rect
                    id={`p684-edge-tag-bg-${u}-${v}`}
                    data-edge-state={edgeState}
                    x={(p1.x + p2.x) / 2 - 16}
                    y={(p1.y + p2.y) / 2 - 9}
                    width="32"
                    height="18"
                    rx="4"
                  />
                  <text
                    id={`p684-edge-tag-text-${u}-${v}`}
                    x={(p1.x + p2.x) / 2}
                    y={(p1.y + p2.y) / 2 + 3.5}
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
                <g key={`p684-node-${nodeId}`} id={`p684-node-group-${nodeId}`}>
                  <motion.circle
                    id={`p684-node-circle-${nodeId}`}
                    cx={pos.x}
                    cy={pos.y}
                    r="19"
                    stroke={isPushed ? "#38bdf8" : rootColors[pRoot] || "#71717a"}
                    layout
                    animate={{ scale: isPushed ? 1.12 : 1 }}
                    transition={{ type: "spring", stiffness: 350, damping: 20 }}
                  />
                  <text
                    id={`p684-node-text-val-${nodeId}`}
                    x={pos.x}
                    y={pos.y + 4.5}
                  >
                    {nodeId}
                  </text>
                  <text
                    id={`p684-node-text-root-${nodeId}`}
                    x={pos.x}
                    y={pos.y - 25}
                    fill={rootColors[pRoot] || "#a1a1aa"}
                  >
                    root: {pRoot}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* DSU Parent Array Table */}
        <div id="p684-dsu-panel">
          <div id="p684-panel-title">DSU Representative Parent Table</div>
          <div id="p684-parent-table">
            <div id="p684-table-header-row">
              <span id="p684-th-cell-label">Node (i)</span>
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={`p684-th-${i}`} id={`p684-th-val-${i}`}>
                  {i}
                </span>
              ))}
            </div>
            <div id="p684-table-data-row">
              <span id="p684-td-cell-label">parent[i]</span>
              {[1, 2, 3, 4, 5].map((i) => {
                const pVal = parent[i];
                const isUpdated = activeEdge && (activeEdge[0] === i || activeEdge[1] === i);

                return (
                  <motion.div
                    key={`p684-td-${i}`}
                    id={`p684-td-val-${i}`}
                    data-is-updated={isUpdated ? "true" : "false"}
                    layout
                    animate={{ scale: isUpdated ? 1.08 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {pVal}
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div id="p684-union-status-card">
            <span id="p684-status-label">Union Status:</span>
            <span id="p684-status-val">
              {state.union || (cycleEdge ? "CYCLE DETECTED" : "Pending")}
            </span>
          </div>
        </div>
      </div>

      {/* Output Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p684-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div id="p684-callout-header-text">{output.label}</div>
            <div id="p684-callout-val-text">{output.value}</div>
            <div id="p684-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}