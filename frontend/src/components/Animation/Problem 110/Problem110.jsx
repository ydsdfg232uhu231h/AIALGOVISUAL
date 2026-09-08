import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem110.css";

export default function Problem110({ stepData }) {
  const {
    activeNode = 3,
    leftH = null,
    rightH = null,
    heightsMap = {}, // e.g. { "9": 1, "15": 1, "7": 1, "20": 2, "3": 3 }
    diff = null,
    isBalanced = true,
    isCompleted = false,
    output
  } = stepData || {};

  // Standard 3-level tree coordinates: root (3), left (9), right (20), leaves (15, 7)
 const treeNodes = [
  { id: 1, val: 1, cx: 200, cy: 45 },
  { id: 2, val: 2, cx: 120, cy: 120 },
  { id: 3, val: 3, cx: 280, cy: 120 },
  { id: 4, val: 4, cx: 70, cy: 195 },
  { id: 5, val: 5, cx: 170, cy: 195 }
];

const treeEdges = [
  { from: 1, to: 2 },
  { from: 1, to: 3 },
  { from: 2, to: 4 },
  { from: 2, to: 5 }
];

  return (
    <div id="balanced-tree-canvas">
      {/* Top Metrics Row */}
      <div id="metrics-bar">
        <span id="metric-inspecting">
          Visiting: <b>{activeNode !== null ? `Node (${activeNode})` : "None"}</b>
        </span>

        <span id="metric-heights">
          Heights (L / R): <b>{leftH !== null ? leftH : "—"} / {rightH !== null ? rightH : "—"}</b>
        </span>

        <span id="metric-diff">
          |L - R| Diff: <b>{diff !== null ? diff : "—"} {diff !== null && (diff <= 1 ? "(≤ 1 ✓)" : "(> 1 ✗)")}</b>
        </span>

        <span id={isCompleted ? "metric-status-done" : "metric-status-active"}>
          Status: <b>{isCompleted ? "BALANCED TREE ✓" : "CHECKING HEIGHTS"}</b>
        </span>
      </div>

      <div id="balanced-stage">
        {/* Main Tree Card */}
        <div id="tree-card">
          <div id="tree-card-header">
            <span id="tree-header-title">Binary Tree & Subtree Height Verification</span>
            <span id="tree-header-sub">Invariant: |leftHeight - rightHeight| &le; 1</span>
          </div>

          <div id="tree-viewport">
            <svg id="tree-svg-surface" viewBox="0 0 400 240">
              {/* Edges */}
              {treeEdges.map(({ from, to }) => {
                const p1 = treeNodes.find((n) => n.val === from);
                const p2 = treeNodes.find((n) => n.val === to);
                const isEdgePassed =
                  heightsMap[from] !== undefined && heightsMap[to] !== undefined;

                return (
                  <line
                    key={`edge-${from}-${to}`}
                    id={isCompleted || isEdgePassed ? `edge-passed-${from}-${to}` : `edge-normal-${from}-${to}`}
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
                const nodeHeight = heightsMap[node.val];
                const isResolved = nodeHeight !== undefined;

                let circleId = `node-idle-${node.val}`;
                if (isCompleted) {
                  circleId = `node-complete-${node.val}`;
                } else if (isActive) {
                  circleId = `node-active-${node.val}`;
                } else if (isResolved) {
                  circleId = `node-resolved-${node.val}`;
                }

                return (
                  <g key={`tree-g-${node.id}`} id={`g-${node.id}`}>
                    {isCompleted && (
                      <circle id={`halo-complete-${node.val}`} cx={node.cx} cy={node.cy} r="28" />
                    )}
                    {isActive && (
                      <circle id={`halo-active-${node.val}`} cx={node.cx} cy={node.cy} r="26" />
                    )}

                    <circle id={circleId} cx={node.cx} cy={node.cy} r="22" />

                    <text id={`text-val-${node.val}`} x={node.cx} y={node.cy + 1}>
                      {node.val}
                    </text>
                    <text id={`text-height-${node.val}`} x={node.cx} y={node.cy + 32}>
                      {nodeHeight !== undefined ? `h = ${nodeHeight}` : "h = ?"}
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
            <span id="calc-header-title">Balance Evaluation Formula</span>
            <span id="calc-header-sub">Height = 1 + max(leftH, rightH)</span>
          </div>

          <div id="calc-grid">
            <div id="calc-box-left">
              <span id="calc-title-left">Left Height:</span>
              <span id="calc-val-left">
                {leftH !== null ? `leftH = ${leftH}` : "Pending"}
              </span>
            </div>

            <div id="calc-box-right">
              <span id="calc-title-right">Right Height:</span>
              <span id="calc-val-right">
                {rightH !== null ? `rightH = ${rightH}` : "Pending"}
              </span>
            </div>

            <div id="calc-box-diff">
              <span id="calc-title-diff">Height Differential:</span>
              <span id="calc-val-diff">
                {leftH !== null && rightH !== null
                  ? `|${leftH} - ${rightH}| = ${Math.abs(leftH - rightH)}`
                  : "Traversing"}
              </span>
            </div>

            <div id="calc-box-verdict">
              <span id="calc-title-verdict">Subtree Balance:</span>
              <span id={isBalanced ? "calc-val-pass" : "calc-val-fail"}>
                {leftH !== null && rightH !== null
                  ? Math.abs(leftH - rightH) <= 1
                    ? "BALANCED (≤ 1)"
                    : "UNBALANCED (> 1)"
                  : "CALCULATING"}
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