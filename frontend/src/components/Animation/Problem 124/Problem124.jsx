import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem124.css";

export default function Problem124({ stepData }) {
  const {
    activeNodeId = null, // e.g. "node-20"
    leftGain = null,
    rightGain = null,
    localPathSum = null,
    returnedGain = null,
    maxSum = "-INF",
    winningPathNodes = [], // e.g. ["node-15", "node-20", "node-7"]
    winningPathEdges = [], // e.g. [["node-20", "node-15"], ["node-20", "node-7"]]
    state = {},
    output
  } = stepData || {};

  // Cartesian coordinates for a balanced 3-level binary tree: viewBox="0 0 400 240"
  const treeNodes = [
    { id: "node-root", val: -10, cx: 200, cy: 45, label: "root (-10)" },
    { id: "node-9", val: 9, cx: 100, cy: 125, label: "left (9)" },
    { id: "node-20", val: 20, cx: 300, cy: 125, label: "right (20)" },
    { id: "node-15", val: 15, cx: 240, cy: 200, label: "leaf (15)" },
    { id: "node-7", val: 7, cx: 360, cy: 200, label: "leaf (7)" }
  ];

  const treeEdges = [
    { from: "node-root", to: "node-9" },
    { from: "node-root", to: "node-20" },
    { from: "node-20", to: "node-15" },
    { from: "node-20", to: "node-7" }
  ];

  const isCompleted = state.status === "COMPLETED";

  const isEdgeInWinningPath = (u, v) =>
    winningPathEdges.some(([a, b]) => (a === u && b === v) || (a === v && b === u));

  return (
    <div id="tree-path-canvas">
      {/* Top Metrics Row */}
      <div id="metrics-bar">
        <span id="metric-active-node">
          Visiting: <b>{activeNodeId ? activeNodeId.replace("node-", "Node ") : "None"}</b>
        </span>

        <span id="metric-gains">
          Gains (L / R): <b>{leftGain !== null ? leftGain : "—"} / {rightGain !== null ? rightGain : "—"}</b>
        </span>

        <span id="metric-local-sum">
          Local Path: <b>{localPathSum !== null ? localPathSum : "—"}</b>
        </span>

        <span id={isCompleted ? "metric-max-done" : "metric-max-active"}>
          Global Max: <b>{maxSum}</b>
        </span>
      </div>

      <div id="tree-stage">
        {/* Main Tree Card */}
        <div id="tree-visual-card">
          <div id="tree-card-header">
            <span id="tree-header-title">Post-Order Traversal & Maximum Path Tree</span>
            <span id="tree-header-sub">Local Arch = val + max(L, 0) + max(R, 0)</span>
          </div>

          <div id="tree-viewport">
            <svg id="tree-svg-surface" viewBox="0 0 400 240">
              {/* Tree Edges */}
              {treeEdges.map(({ from, to }) => {
                const p1 = treeNodes.find((n) => n.id === from);
                const p2 = treeNodes.find((n) => n.id === to);
                const isWinner = isEdgeInWinningPath(from, to);

                return (
                  <line
                    key={`edge-${from}-${to}`}
                    id={isWinner ? `edge-winner-${from}-${to}` : `edge-normal-${from}-${to}`}
                    x1={p1.cx}
                    y1={p1.cy}
                    x2={p2.cx}
                    y2={p2.cy}
                  />
                );
              })}

              {/* Tree Nodes */}
              {treeNodes.map((node) => {
                const isActive = activeNodeId === node.id;
                const isWinner = winningPathNodes.includes(node.id);

                let circleId = `node-idle-${node.val}`;
                if (isWinner) {
                  circleId = `node-winner-${node.val}`;
                } else if (isActive) {
                  circleId = `node-active-${node.val}`;
                }

                return (
                  <g key={`tree-g-${node.id}`} id={`g-${node.id}`}>
                    {isWinner && (
                      <circle id={`halo-${node.val}`} cx={node.cx} cy={node.cy} r="28" />
                    )}
                    <circle id={circleId} cx={node.cx} cy={node.cy} r="22" />
                    <text id={`text-val-${node.val}`} x={node.cx} y={node.cy + 1}>
                      {node.val}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Recursive Evaluation Trace */}
        <div id="trace-calc-card">
          <div id="trace-card-header">
            <span id="trace-header-title">Post-Order Math Inspector</span>
            <span id="trace-header-sub">Calculates sub-tree contribution vs global path</span>
          </div>

          <div id="calc-readout-grid">
            <div id="calc-box-left">
              <span id="calc-title-left">Max Left Gain:</span>
              <span id="calc-val-left">
                {leftGain !== null ? `max(0, ${leftGain}) = ${Math.max(0, leftGain)}` : "Pending"}
              </span>
            </div>

            <div id="calc-box-right">
              <span id="calc-title-right">Max Right Gain:</span>
              <span id="calc-val-right">
                {rightGain !== null ? `max(0, ${rightGain}) = ${Math.max(0, rightGain)}` : "Pending"}
              </span>
            </div>

            <div id="calc-box-arch">
              <span id="calc-title-arch">Arch Path Sum (Local Root):</span>
              <span id="calc-val-arch">
                {localPathSum !== null ? `${localPathSum}` : "Pending"}
              </span>
            </div>

            <div id="calc-box-return">
              <span id="calc-title-return">Return Gain Upward:</span>
              <span id="calc-val-return">
                {returnedGain !== null ? `${returnedGain}` : "Pending"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Result Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div id="callout-header-text">{output.label}</div>
            <div id="callout-val-text">{output.value}</div>
            <div id="callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}