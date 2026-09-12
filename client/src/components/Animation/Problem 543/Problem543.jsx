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
    <div id="p543-tree-diameter-canvas">
      {/* Top Metrics Row */}
      <div id="p543-metrics-bar">
        <span id="p543-metric-inspecting">
          Visiting: <b>{activeNode !== null ? `Node (${activeNode})` : "None"}</b>
        </span>

        <span id="p543-metric-depths">
          Child Depths (L / R): <b>{leftHeight} / {rightHeight}</b>
        </span>

        <span id="p543-metric-local-dia">
          Local Arch Path: <b>{leftHeight} + {rightHeight} = {localDiameter} edges</b>
        </span>

        <span
          id="p543-metric-res"
          data-status={isCompleted ? "done" : "active"}
        >
          Global Max Diameter (`res`): <b>{res} edges</b>
        </span>
      </div>

      <div id="p543-diameter-stage">
        {/* Main Tree Card */}
        <div id="p543-tree-card">
          <div id="p543-tree-card-header">
            <span id="p543-tree-header-title">Binary Tree Diameter Traversal</span>
            <span id="p543-tree-header-sub">Diameter = max(res, leftDepth + rightDepth)</span>
          </div>

          <div id="p543-tree-viewport">
            <svg id="p543-tree-svg-surface" viewBox="0 0 420 250">
              {/* Edges */}
              {treeEdges.map(({ from, to }) => {
                const p1 = treeNodes.find((n) => n.val === from);
                const p2 = treeNodes.find((n) => n.val === to);
                const isWinnerEdge = isCompleted && isEdgeInWinner(from, to);

                return (
                  <line
                    key={`p543-edge-${from}-${to}`}
                    id={`p543-edge-${from}-${to}`}
                    data-edge-state={isWinnerEdge ? "winner" : "normal"}
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

                let nodeState = "idle";
                if (isWinner) {
                  nodeState = "winner";
                } else if (isActive) {
                  nodeState = "active";
                } else if (nodeHeight !== undefined) {
                  nodeState = "resolved";
                }

                return (
                  <g key={`p543-tree-g-${node.id}`} id={`p543-tree-g-${node.id}`}>
                    <AnimatePresence>
                      {isWinner && (
                        <motion.circle
                          id={`p543-halo-winner-${node.val}`}
                          cx={node.cx}
                          cy={node.cy}
                          r={28}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 350, damping: 20 }}
                        />
                      )}
                      {isActive && !isWinner && (
                        <motion.circle
                          id={`p543-halo-active-${node.val}`}
                          cx={node.cx}
                          cy={node.cy}
                          r={26}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 350, damping: 20 }}
                        />
                      )}
                    </AnimatePresence>

                    <motion.circle
                      id={`p543-node-${node.val}`}
                      data-node-state={nodeState}
                      cx={node.cx}
                      cy={node.cy}
                      r={21}
                      layout
                      animate={{
                        scale: isWinner ? 1.08 : isActive ? 1.05 : 1
                      }}
                      transition={{ type: "spring", stiffness: 350, damping: 22 }}
                    />

                    <text
                      id={`p543-text-val-${node.val}`}
                      data-node-state={nodeState}
                      x={node.cx}
                      y={node.cy + 1}
                    >
                      {node.val}
                    </text>
                    <text
                      id={`p543-text-sub-${node.val}`}
                      data-node-state={nodeState}
                      x={node.cx}
                      y={node.cy + 30}
                    >
                      {nodeHeight !== undefined ? `h = ${nodeHeight}` : "h = ?"}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Calculation Inspector Dashboard */}
        <div id="p543-inspector-card">
          <div id="p543-inspector-card-header">
            <span id="p543-inspector-header-title">Post-Order Telemetry</span>
            <span id="p543-inspector-header-sub">Depth returned upward vs path through node</span>
          </div>

          <div id="p543-inspector-grid">
            <div id="p543-box-subtrees">
              <span id="p543-title-subtrees">Subtree Depths:</span>
              <span id="p543-val-subtrees">
                L: {leftHeight} | R: {rightHeight}
              </span>
            </div>

            <div id="p543-box-local-arch">
              <span id="p543-title-local-arch">Arch Path Length:</span>
              <span id="p543-val-local-arch">
                {leftHeight} + {rightHeight} = {localDiameter} edges
              </span>
            </div>

            <div id="p543-box-return-depth">
              <span id="p543-title-return-depth">Return Upward:</span>
              <span id="p543-val-return-depth">
                1 + max({leftHeight}, {rightHeight}) = {1 + Math.max(leftHeight, rightHeight)}
              </span>
            </div>

            <div id="p543-box-global-res">
              <span id="p543-title-global-res">Global Max (`res`):</span>
              <span
                id="p543-val-global-res"
                data-status={isCompleted ? "done" : "active"}
              >
                {res} edges
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Result Callout (Elevated safely above playback scrubber) */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p543-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div id="p543-callout-header-text">{output.label}</div>
            <div id="p543-callout-val-text">{output.value}</div>
            <div id="p543-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}