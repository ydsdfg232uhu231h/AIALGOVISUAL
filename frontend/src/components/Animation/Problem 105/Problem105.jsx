import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem105.css";

export default function Problem105({ stepData }) {
  const {
    preorder = [3, 9, 20, 15, 7],
    inorder = [9, 3, 15, 20, 7],
    currentRoot = 3,
    activeMid = 1,
    leftSubInorder = [],
    rightSubInorder = [],
    builtNodes = [], // e.g., [3, 9, 20, 15, 7]
    builtEdges = [], // e.g., [[3, 9], [3, 20], [20, 15], [20, 7]]
    isCompleted = false,
    output
  } = stepData || {};

  // Standard 3-level tree coordinates: root (3), left (9), right (20), leaves (15, 7)
  const treeNodes = [
    { id: 3, val: 3, cx: 200, cy: 45 },
    { id: 9, val: 9, cx: 100, cy: 125 },
    { id: 20, val: 20, cx: 300, cy: 125 },
    { id: 15, val: 15, cx: 240, cy: 200 },
    { id: 7, val: 7, cx: 360, cy: 200 }
  ];

  const treeEdges = [
    { from: 3, to: 9 },
    { from: 3, to: 20 },
    { from: 20, to: 15 },
    { from: 20, to: 7 }
  ];

  const isEdgeBuilt = (u, v) =>
    builtEdges.some(([a, b]) => (a === u && b === v) || (a === v && b === u));

  return (
    <div id="construct-tree-canvas">
      {/* Top Metrics Row */}
      <div id="metrics-bar">
        <span id="metric-current-root">
          Active Root: <b>{currentRoot !== null ? `Node (${currentRoot})` : "None"}</b>
        </span>

        <span id="metric-inorder-pivot">
          Inorder Pivot Index: <b>{activeMid !== null ? `mid = ${activeMid}` : "—"}</b>
        </span>

        <span id="metric-built-count">
          Nodes Built: <b>{builtNodes.length} / {treeNodes.length}</b>
        </span>

        <span id={isCompleted ? "metric-status-done" : "metric-status-active"}>
          Status: <b>{isCompleted ? "RECONSTRUCTION COMPLETED" : "DIVIDE & CONQUER"}</b>
        </span>
      </div>

      {/* Main Reconstruction Stage */}
      <div id="construct-stage">
        {/* Left: Dual Array Slice View */}
        <div id="arrays-card">
          <div id="arrays-card-header">
            <span id="arrays-header-title">1. Traversal Array Partitions</span>
            <span id="arrays-header-sub">Preorder picks root; Inorder splits left & right</span>
          </div>

          <div id="arrays-viewport">
            {/* Preorder Array */}
            <div id="preorder-strip-wrapper">
              <span id="preorder-label">PREORDER:</span>
              <div id="preorder-cells-row">
                {preorder.map((val, idx) => {
                  const isRoot = currentRoot === val;
                  const isBuilt = builtNodes.includes(val);

                  let cellId = `pre-cell-idle-${val}`;
                  if (isRoot) cellId = `pre-cell-root-${val}`;
                  else if (isBuilt) cellId = `pre-cell-built-${val}`;

                  return (
                    <div key={`pre-${val}`} id={cellId} className="traversal-cell">
                      <span className="cell-val-text">{val}</span>
                      <span className="cell-idx-sub">[{idx}]</span>
                      {isRoot && <span id="pre-root-badge">ROOT</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Inorder Array */}
            <div id="inorder-strip-wrapper">
              <span id="inorder-label">INORDER:</span>
              <div id="inorder-cells-row">
                {inorder.map((val, idx) => {
                  const isMid = currentRoot === val;
                  const isLeftSlice = leftSubInorder.includes(val);
                  const isRightSlice = rightSubInorder.includes(val);
                  const isBuilt = builtNodes.includes(val);

                  let cellId = `in-cell-idle-${val}`;
                  if (isMid) cellId = `in-cell-mid-${val}`;
                  else if (isLeftSlice) cellId = `in-cell-left-${val}`;
                  else if (isRightSlice) cellId = `in-cell-right-${val}`;
                  else if (isBuilt) cellId = `in-cell-built-${val}`;

                  return (
                    <div key={`in-${val}`} id={cellId} className="traversal-cell">
                      <span className="cell-val-text">{val}</span>
                      <span className="cell-idx-sub">[{idx}]</span>
                      {isMid && <span id="in-mid-badge">MID</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Array Legend */}
            <div id="arrays-legend">
              <span className="legend-item"><span className="dot dot-root" /> Current Root (`preorder[0]`)</span>
              <span className="legend-item"><span className="dot dot-left" /> Left Subtree Slice</span>
              <span className="legend-item"><span className="dot dot-right" /> Right Subtree Slice</span>
              <span className="legend-item"><span className="dot dot-built" /> Attached to Tree</span>
            </div>
          </div>
        </div>

        {/* Right: Progressive Tree Assembly */}
        <div id="tree-assembly-card">
          <div id="tree-assembly-header">
            <span id="tree-assembly-title">2. Assembled Binary Tree</span>
            <span id="tree-assembly-sub">Root attaches left and right recursive returns</span>
          </div>

          <div id="tree-viewport">
            <svg id="tree-svg-surface" viewBox="0 0 400 240">
              {/* Edges */}
              {treeEdges.map(({ from, to }) => {
                const p1 = treeNodes.find((n) => n.id === from);
                const p2 = treeNodes.find((n) => n.id === to);
                const built = isEdgeBuilt(from, to);

                return (
                  <line
                    key={`edge-${from}-${to}`}
                    id={built ? `edge-built-${from}-${to}` : `edge-ghost-${from}-${to}`}
                    x1={p1.cx}
                    y1={p1.cy}
                    x2={p2.cx}
                    y2={p2.cy}
                  />
                );
              })}

              {/* Nodes */}
              {treeNodes.map((node) => {
                const isCurrent = currentRoot === node.val;
                const isBuilt = builtNodes.includes(node.val);

                let circleId = `node-ghost-${node.val}`;
                if (isCompleted || (isBuilt && !isCurrent)) {
                  circleId = `node-built-${node.val}`;
                } else if (isCurrent) {
                  circleId = `node-active-${node.val}`;
                }

                return (
                  <g key={`g-node-${node.id}`} id={`g-node-${node.id}`}>
                    {isCompleted && (
                      <circle id={`halo-complete-${node.val}`} cx={node.cx} cy={node.cy} r="28" />
                    )}
                    {isCurrent && (
                      <circle id={`halo-active-${node.val}`} cx={node.cx} cy={node.cy} r="26" />
                    )}

                    <circle id={circleId} cx={node.cx} cy={node.cy} r="21" />

                    <text id={`text-val-${node.val}`} x={node.cx} y={node.cy + 1}>
                      {node.val}
                    </text>
                  </g>
                );
              })}
            </svg>
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