import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem543.css";

export default function Problem543({ stepData }) {
  const {
    activeNode = 1,
    leftHeight = 0,
    rightHeight = 0,
    localDiameter = 0,
    res = 0,
    heightsMap = {}, // e.g., { "4": 1, "5": 1, "2": 2, "3": 1, "1": 3 }
    winningPathNodes = [], // e.g., [4, 2, 1, 3]
    winningPathEdges = [], // e.g., [[4, 2], [2, 1], [1, 3]]
    isCompleted = false,
    output
  } = stepData || {};

  // Standard Cartesian coordinates for tree [1, 2, 3, 4, 5]
  const treeNodes = [
    { id: 1, val: 1, cx: 210, cy: 40 },
    { id: 2, val: 2, cx: 120, cy: 110 },
    { id: 3, val: 3, cx: 300, cy: 110 },
    { id: 4, val: 4, cx: 70, cy: 185 },
    { id: 5, val: 5, cx: 170, cy: 185 }
  ];

  const treeEdges = [
    { from: 1, to: 2 },
    { from: 1, to: 3 },
    { from: 2, to: 4 },
    { from: 2, to: 5 }
  ];

  const isEdgeInWinner = (u, v) =>
    winningPathEdges.some(([a, b]) => (a === u && b === v) || (a === v && b === u));

  return (
    <div id="tree-diameter-canvas">
      {/* Top Metrics Row */}
      <div id="metrics-bar">
        <span id="metric-inspecting">
          Visiting: <b>{activeNode !== null ? `Node (${activeNode})` : "None"}</b>
        </span>

        <span id="metric-depths">
          Child Depths (L / R): <b>{leftHeight} / {rightHeight}</b>
        </span>

        <span id="metric-local-dia">
          Local Arch Path: <b>{leftHeight} + {rightHeight} = {localDiameter} edges</b>
        </span>

        <span id={isCompleted ? "metric-res-done" : "metric-res-active"}>
          Global Max Diameter (`res`): <b>{res} edges</b>
        </span>
      </div>

      <div id="diameter-stage">
        {/* Main Tree Card */}
        <div id="tree-card">
          <div id="tree-card-header">
            <span id="tree-header-title">Binary Tree Diameter Traversal</span>
            <span id="tree-header-sub">Diameter = max(res, leftDepth + rightDepth)</span>
          </div>

          <div id="tree-viewport">
            <svg id="tree-svg-surface" viewBox="0 0 420 250">
              {/* Edges */}
              {treeEdges.map(({ from, to }) => {
                const p1 = treeNodes.find((n) => n.val === from);
                const p2 = treeNodes.find((n) => n.val === to);
                const isWinnerEdge = isCompleted && isEdgeInWinner(from, to);

                return (
                  <line
                    key={`edge-${from}-${to}`}
                    id={isWinnerEdge ? `edge-path-${from}-${to}` : `edge-normal-${from}-${to}`}
                    x1={p1.cx}
                    y1={p1.cy}
                    x2={p2.cx}
                    y2={p2.cy}
                  />
                );
              })}

              {/* Nodes */}
              {treeNodes.map((node) => {
                const isActive = activeNode === node.val;
                const isWinner = isCompleted && winningPathNodes.includes(node.val);
                const nodeHeight = heightsMap[node.val];

                let circleId = `node-idle-${node.val}`;
                if (isWinner) {
                  circleId = `node-winner-${node.val}`;
                } else if (isActive) {
                  circleId = `node-active-${node.val}`;
                } else if (nodeHeight !== undefined) {
                  circleId = `node-resolved-${node.val}`;
                }

                return (
                  <g key={`tree-g-${node.id}`} id={`g-${node.id}`}>
                    {isWinner && (
                      <circle id={`halo-winner-${node.val}`} cx={node.cx} cy={node.cy} r="28" />
                    )}
                    {isActive && (
                      <circle id={`halo-active-${node.val}`} cx={node.cx} cy={node.cy} r="26" />
                    )}

                    <circle id={circleId} cx={node.cx} cy={node.cy} r="21" />

                    <text id={`text-val-${node.val}`} x={node.cx} y={node.cy + 1}>
                      {node.val}
                    </text>
                    <text id={`text-sub-${node.val}`} x={node.cx} y={node.cy + 30}>
                      {nodeHeight !== undefined ? `h = ${nodeHeight}` : "h = ?"}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Calculation Inspector Dashboard */}
        <div id="inspector-card">
          <div id="inspector-card-header">
            <span id="inspector-header-title">Post-Order Telemetry</span>
            <span id="inspector-header-sub">Depth returned upward vs path through node</span>
          </div>

          <div id="inspector-grid">
            <div id="box-subtrees">
              <span id="title-subtrees">Subtree Depths:</span>
              <span id="val-subtrees">
                L: {leftHeight} | R: {rightHeight}
              </span>
            </div>

            <div id="box-local-arch">
              <span id="title-local-arch">Arch Path Length:</span>
              <span id="val-local-arch">
                {leftHeight} + {rightHeight} = {localDiameter} edges
              </span>
            </div>

            <div id="box-return-depth">
              <span id="title-return-depth">Return Upward:</span>
              <span id="val-return-depth">
                1 + max({leftHeight}, {rightHeight}) = {1 + Math.max(leftHeight, rightHeight)}
              </span>
            </div>

            <div id="box-global-res">
              <span id="title-global-res">Global Max (`res`):</span>
              <span id={isCompleted ? "val-global-res-done" : "val-global-res-active"}>
                {res} edges
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