import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem104.css";

export default function Problem104({ stepData }) {
  const {
    activeNode = 3,
    leftDepth = null,
    rightDepth = null,
    computedDepth = null,
    maxDepth = null,
    calculatedNodes = {}, // e.g. { "9": 1, "15": 1, "7": 1, "20": 2, "3": 3 }
    longestPathNodes = [], // e.g. [3, 20, 15]
    longestPathEdges = [], // e.g. [[3, 20], [20, 15]]
    isCompleted = false,
    output
  } = stepData || {};

  // Standard 3-level tree coordinates: root (3), children (9, 20), leaves (15, 7)
  const treeNodes = [
    { id: "node-3", val: 3, cx: 200, cy: 45 },
    { id: "node-9", val: 9, cx: 100, cy: 125 },
    { id: "node-20", val: 20, cx: 300, cy: 125 },
    { id: "node-15", val: 15, cx: 240, cy: 200 },
    { id: "node-7", val: 7, cx: 360, cy: 200 }
  ];

  const treeEdges = [
    { from: 3, to: 9 },
    { from: 3, to: 20 },
    { from: 20, to: 15 },
    { from: 20, to: 7 }
  ];

  const isEdgeInLongest = (u, v) =>
    longestPathEdges.some(([a, b]) => (a === u && b === v) || (a === v && b === u));

  return (
    <div id="p104-tree-depth-canvas">
      {/* Top Metrics Row */}
      <div id="p104-metrics-bar">
        <span id="p104-metric-inspecting">
          Visiting: <b>{activeNode !== null ? `Node (${activeNode})` : "None"}</b>
        </span>

        <span id="p104-metric-subdepths">
          Child Depths (L / R): <b>{leftDepth !== null ? leftDepth : "—"} / {rightDepth !== null ? rightDepth : "—"}</b>
        </span>

        <span id="p104-metric-cur-depth">
          Node Depth: <b>{computedDepth !== null ? `${computedDepth}` : "Calculating"}</b>
        </span>

        <span
          id="p104-metric-max"
          data-status={isCompleted ? "done" : "active"}
        >
          Max Depth: <b>{maxDepth !== null ? `${maxDepth} levels` : "In Progress"}</b>
        </span>
      </div>

      <div id="p104-depth-stage">
        {/* Main Tree Card */}
        <div id="p104-tree-depth-card">
          <div id="p104-tree-card-header">
            <span id="p104-tree-header-title">Binary Tree Bottom-Up Depth Traversal</span>
            <span id="p104-tree-header-sub">Formula: 1 + max(leftDepth, rightDepth)</span>
          </div>

          <div id="p104-tree-viewport">
            <svg id="p104-tree-svg-surface" viewBox="0 0 400 240">
              {/* Tree Edges */}
              {treeEdges.map(({ from, to }) => {
                const p1 = treeNodes.find((n) => n.val === from);
                const p2 = treeNodes.find((n) => n.val === to);
                const isPathEdge = isCompleted && isEdgeInLongest(from, to);

                return (
                  <line
                    key={`p104-edge-${from}-${to}`}
                    id={`p104-edge-${from}-${to}`}
                    data-edge-state={isPathEdge ? "path" : "normal"}
                    x1={p1.cx}
                    y1={p1.cy}
                    x2={p2.cx}
                    y2={p2.cy}
                  />
                );
              })}

              {/* Tree Nodes */}
              {treeNodes.map((node) => {
                const isActive = activeNode === node.val;
                const isResolved = calculatedNodes[node.val] !== undefined;
                const isLongest = isCompleted && longestPathNodes.includes(node.val);

                let nodeState = "idle";
                if (isLongest) {
                  nodeState = "longest";
                } else if (isActive) {
                  nodeState = "active";
                } else if (isResolved) {
                  nodeState = "resolved";
                }

                return (
                  <g key={`p104-tree-g-${node.id}`} id={`p104-g-${node.id}`}>
                    <AnimatePresence mode="popLayout">
                      {isLongest && (
                        <circle
                          key={`p104-halo-longest-${node.val}`}
                          id={`p104-halo-longest-${node.val}`}
                          cx={node.cx}
                          cy={node.cy}
                          r="28"
                        />
                      )}
                      {isActive && !isLongest && (
                        <circle
                          key={`p104-halo-active-${node.val}`}
                          id={`p104-halo-active-${node.val}`}
                          cx={node.cx}
                          cy={node.cy}
                          r="26"
                        />
                      )}
                    </AnimatePresence>

                    <circle
                      id={`p104-node-${node.val}`}
                      data-node-state={nodeState}
                      cx={node.cx}
                      cy={node.cy}
                      r="22"
                    />

                    <text id={`p104-text-val-${node.val}`} x={node.cx} y={node.cy + 1}>
                      {node.val}
                    </text>
                    <text id={`p104-text-sub-${node.val}`} x={node.cx} y={node.cy + 32}>
                      {calculatedNodes[node.val] !== undefined
                        ? `d = ${calculatedNodes[node.val]}`
                        : "d = ?"}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Calculation Inspector Dashboard */}
        <div id="p104-calc-inspector-card">
          <div id="p104-calc-card-header">
            <span id="p104-calc-header-title">Post-Order Depth Logic</span>
            <span id="p104-calc-header-sub">Depth calculation for current stack frame</span>
          </div>

          <div id="p104-calc-grid">
            <div id="p104-calc-box-left">
              <span id="p104-calc-title-left">Left Subtree:</span>
              <span id="p104-calc-val-left">
                {leftDepth !== null ? `depth = ${leftDepth}` : "Pending"}
              </span>
            </div>

            <div id="p104-calc-box-right">
              <span id="p104-calc-title-right">Right Subtree:</span>
              <span id="p104-calc-val-right">
                {rightDepth !== null ? `depth = ${rightDepth}` : "Pending"}
              </span>
            </div>

            <div id="p104-calc-box-formula">
              <span id="p104-calc-title-formula">Local Calculation:</span>
              <span id="p104-calc-val-formula">
                {leftDepth !== null && rightDepth !== null
                  ? `1 + max(${leftDepth}, ${rightDepth}) = ${1 + Math.max(leftDepth, rightDepth)}`
                  : "Traversing children"}
              </span>
            </div>

            <div id="p104-calc-box-return">
              <span id="p104-calc-title-return">Return Upward:</span>
              <span
                id="p104-calc-val-return"
                data-state={computedDepth !== null ? "done" : "wait"}
              >
                {computedDepth !== null ? `Depth = ${computedDepth}` : "Pending"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Result Callout Modal */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p104-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div id="p104-callout-header-text">{output.label}</div>
            <div id="p104-callout-val-text">{output.value}</div>
            <div id="p104-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}