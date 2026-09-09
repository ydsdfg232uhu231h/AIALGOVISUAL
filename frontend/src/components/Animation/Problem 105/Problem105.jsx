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
    <div id="p105-construct-tree-canvas">
      {/* Top Metrics Row */}
      <div id="p105-metrics-bar">
        <span id="p105-metric-current-root">
          Active Root: <b>{currentRoot !== null ? `Node (${currentRoot})` : "None"}</b>
        </span>

        <span id="p105-metric-inorder-pivot">
          Inorder Pivot Index: <b>{activeMid !== null ? `mid = ${activeMid}` : "—"}</b>
        </span>

        <span id="p105-metric-built-count">
          Nodes Built: <b>{builtNodes.length} / {treeNodes.length}</b>
        </span>

        <span
          id="p105-metric-status"
          data-status={isCompleted ? "done" : "active"}
        >
          Status: <b>{isCompleted ? "RECONSTRUCTION COMPLETED" : "DIVIDE & CONQUER"}</b>
        </span>
      </div>

      {/* Main Reconstruction Stage */}
      <div id="p105-construct-stage">
        {/* Left: Dual Array Slice View */}
        <div id="p105-arrays-card">
          <div id="p105-arrays-card-header">
            <span id="p105-arrays-header-title">1. Traversal Array Partitions</span>
            <span id="p105-arrays-header-sub">Preorder picks root; Inorder splits left & right</span>
          </div>

          <div id="p105-arrays-viewport">
            {/* Preorder Array */}
            <div id="p105-preorder-strip-wrapper">
              <span id="p105-preorder-label">PREORDER:</span>
              <div id="p105-preorder-cells-row">
                {preorder.map((val, idx) => {
                  const isRoot = currentRoot === val;
                  const isBuilt = builtNodes.includes(val);

                  let cellState = "idle";
                  if (isRoot) cellState = "root";
                  else if (isBuilt) cellState = "built";

                  return (
                    <div
                      key={`p105-pre-${val}`}
                      id={`p105-pre-cell-${val}`}
                      data-cell-state={cellState}
                    >
                      <span id={`p105-pre-val-${val}`}>{val}</span>
                      <span id={`p105-pre-idx-${val}`}>[{idx}]</span>
                      <AnimatePresence mode="popLayout">
                        {isRoot && (
                          <motion.span
                            key={`p105-root-badge-${val}`}
                            id="p105-pre-root-badge"
                            layout
                            initial={{ scale: 0.6, opacity: 0, y: -4 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.6, opacity: 0, y: -4 }}
                            transition={{ type: "spring", stiffness: 450, damping: 25 }}
                          >
                            ROOT
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Inorder Array */}
            <div id="p105-inorder-strip-wrapper">
              <span id="p105-inorder-label">INORDER:</span>
              <div id="p105-inorder-cells-row">
                {inorder.map((val, idx) => {
                  const isMid = currentRoot === val;
                  const isLeftSlice = leftSubInorder.includes(val);
                  const isRightSlice = rightSubInorder.includes(val);
                  const isBuilt = builtNodes.includes(val);

                  let cellState = "idle";
                  if (isMid) cellState = "mid";
                  else if (isLeftSlice) cellState = "left";
                  else if (isRightSlice) cellState = "right";
                  else if (isBuilt) cellState = "built";

                  return (
                    <div
                      key={`p105-in-${val}`}
                      id={`p105-in-cell-${val}`}
                      data-cell-state={cellState}
                    >
                      <span id={`p105-in-val-${val}`}>{val}</span>
                      <span id={`p105-in-idx-${val}`}>[{idx}]</span>
                      <AnimatePresence mode="popLayout">
                        {isMid && (
                          <motion.span
                            key={`p105-mid-badge-${val}`}
                            id="p105-in-mid-badge"
                            layout
                            initial={{ scale: 0.6, opacity: 0, y: -4 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.6, opacity: 0, y: -4 }}
                            transition={{ type: "spring", stiffness: 450, damping: 25 }}
                          >
                            MID
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Array Legend */}
            <div id="p105-arrays-legend">
              <span id="p105-legend-item-root">
                <span id="p105-dot-root" data-dot="root" /> Current Root (`preorder[0]`)
              </span>
              <span id="p105-legend-item-left">
                <span id="p105-dot-left" data-dot="left" /> Left Subtree Slice
              </span>
              <span id="p105-legend-item-right">
                <span id="p105-dot-right" data-dot="right" /> Right Subtree Slice
              </span>
              <span id="p105-legend-item-built">
                <span id="p105-dot-built" data-dot="built" /> Attached to Tree
              </span>
            </div>
          </div>
        </div>

        {/* Right: Progressive Tree Assembly */}
        <div id="p105-tree-assembly-card">
          <div id="p105-tree-assembly-header">
            <span id="p105-tree-assembly-title">2. Assembled Binary Tree</span>
            <span id="p105-tree-assembly-sub">Root attaches left and right recursive returns</span>
          </div>

          <div id="p105-tree-viewport">
            <svg id="p105-tree-svg-surface" viewBox="0 0 400 240">
              {/* Edges */}
              {treeEdges.map(({ from, to }) => {
                const p1 = treeNodes.find((n) => n.id === from);
                const p2 = treeNodes.find((n) => n.id === to);
                const built = isEdgeBuilt(from, to);

                return (
                  <line
                    key={`p105-edge-${from}-${to}`}
                    id={`p105-edge-${from}-${to}`}
                    data-edge-state={built ? "built" : "ghost"}
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

                let nodeState = "ghost";
                if (isCompleted || (isBuilt && !isCurrent)) {
                  nodeState = "built";
                } else if (isCurrent) {
                  nodeState = "active";
                }

                return (
                  <g key={`p105-g-node-${node.id}`} id={`p105-g-node-${node.id}`}>
                    <AnimatePresence mode="popLayout">
                      {isCompleted && (
                        <circle
                          key={`p105-halo-complete-${node.val}`}
                          id={`p105-halo-complete-${node.val}`}
                          cx={node.cx}
                          cy={node.cy}
                          r="28"
                        />
                      )}
                      {isCurrent && !isCompleted && (
                        <circle
                          key={`p105-halo-active-${node.val}`}
                          id={`p105-halo-active-${node.val}`}
                          cx={node.cx}
                          cy={node.cy}
                          r="26"
                        />
                      )}
                    </AnimatePresence>

                    <circle
                      id={`p105-node-${node.val}`}
                      data-node-state={nodeState}
                      cx={node.cx}
                      cy={node.cy}
                      r="21"
                    />

                    <text id={`p105-text-val-${node.val}`} x={node.cx} y={node.cy + 1}>
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
            id="p105-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div id="p105-callout-header-text">{output.label}</div>
            <div id="p105-callout-val-text">{output.value}</div>
            <div id="p105-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}