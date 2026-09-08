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
    <div id="tree-depth-canvas">
      {/* Top Metrics Row */}
      <div id="metrics-bar">
        <span id="metric-inspecting">
          Visiting: <b>{activeNode !== null ? `Node (${activeNode})` : "None"}</b>
        </span>

        <span id="metric-subdepths">
          Child Depths (L / R): <b>{leftDepth !== null ? leftDepth : "—"} / {rightDepth !== null ? rightDepth : "—"}</b>
        </span>

        <span id="metric-cur-depth">
          Node Depth: <b>{computedDepth !== null ? `${computedDepth}` : "Calculating"}</b>
        </span>

        <span id={isCompleted ? "metric-max-done" : "metric-max-active"}>
          Max Depth: <b>{maxDepth !== null ? `${maxDepth} levels` : "In Progress"}</b>
        </span>
      </div>

      <div id="depth-stage">
        {/* Main Tree Card */}
        <div id="tree-depth-card">
          <div id="tree-card-header">
            <span id="tree-header-title">Binary Tree Bottom-Up Depth Traversal</span>
            <span id="tree-header-sub">Formula: 1 + max(leftDepth, rightDepth)</span>
          </div>

          <div id="tree-viewport">
            <svg id="tree-svg-surface" viewBox="0 0 400 240">
              {/* Tree Edges */}
              {treeEdges.map(({ from, to }) => {
                const p1 = treeNodes.find((n) => n.val === from);
                const p2 = treeNodes.find((n) => n.val === to);
                const isPathEdge = isCompleted && isEdgeInLongest(from, to);

                return (
                  <line
                    key={`edge-${from}-${to}`}
                    id={isPathEdge ? `edge-path-${from}-${to}` : `edge-normal-${from}-${to}`}
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

                let circleId = `node-idle-${node.val}`;
                if (isLongest) {
                  circleId = `node-longest-${node.val}`;
                } else if (isActive) {
                  circleId = `node-active-${node.val}`;
                } else if (isResolved) {
                  circleId = `node-resolved-${node.val}`;
                }

                return (
                  <g key={`tree-g-${node.id}`} id={`g-${node.id}`}>
                    {isLongest && (
                      <circle id={`halo-longest-${node.val}`} cx={node.cx} cy={node.cy} r="28" />
                    )}
                    {isActive && (
                      <circle id={`halo-active-${node.val}`} cx={node.cx} cy={node.cy} r="26" />
                    )}
                    
                    <circle id={circleId} cx={node.cx} cy={node.cy} r="22" />
                    
                    <text id={`text-val-${node.val}`} x={node.cx} y={node.cy + 1}>
                      {node.val}
                    </text>
                    <text id={`text-sub-${node.val}`} x={node.cx} y={node.cy + 32}>
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
        <div id="calc-inspector-card">
          <div id="calc-card-header">
            <span id="calc-header-title">Post-Order Depth Logic</span>
            <span id="calc-header-sub">Depth calculation for current stack frame</span>
          </div>

          <div id="calc-grid">
            <div id="calc-box-left">
              <span id="calc-title-left">Left Subtree:</span>
              <span id="calc-val-left">
                {leftDepth !== null ? `depth = ${leftDepth}` : "Pending"}
              </span>
            </div>

            <div id="calc-box-right">
              <span id="calc-title-right">Right Subtree:</span>
              <span id="calc-val-right">
                {rightDepth !== null ? `depth = ${rightDepth}` : "Pending"}
              </span>
            </div>

            <div id="calc-box-formula">
              <span id="calc-title-formula">Local Calculation:</span>
              <span id="calc-val-formula">
                {leftDepth !== null && rightDepth !== null
                  ? `1 + max(${leftDepth}, ${rightDepth}) = ${1 + Math.max(leftDepth, rightDepth)}`
                  : "Traversing children"}
              </span>
            </div>

            <div id="calc-box-return">
              <span id="calc-title-return">Return Upward:</span>
              <span id={computedDepth !== null ? "calc-val-return-done" : "calc-val-return-wait"}>
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