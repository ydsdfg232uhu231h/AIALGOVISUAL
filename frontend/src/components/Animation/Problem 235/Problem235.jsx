import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem235.css";

export default function Problem235({ stepData }) {
  const {
    activeNode = 3,
    p = 5,
    q = 1,
    leftResult = null,
    rightResult = null,
    foundNodes = [],
    isCompleted = false,
    output
  } = stepData || {};

  // Cartesian coordinates for the 9-node tree (viewBox="0 0 460 260")
  const treeNodes = [
    { id: 3, val: 3, cx: 230, cy: 38 },
    // Level 1
    { id: 5, val: 5, cx: 130, cy: 95 },
    { id: 1, val: 1, cx: 330, cy: 95 },
    // Level 2
    { id: 6, val: 6, cx: 80, cy: 155 },
    { id: 2, val: 2, cx: 180, cy: 155 },
    { id: 0, val: 0, cx: 280, cy: 155 },
    { id: 8, val: 8, cx: 380, cy: 155 },
    // Level 3 (children of 2)
    { id: 7, val: 7, cx: 150, cy: 215 },
    { id: 4, val: 4, cx: 210, cy: 215 }
  ];

  const treeEdges = [
    { from: 3, to: 5 },
    { from: 3, to: 1 },
    { from: 5, to: 6 },
    { from: 5, to: 2 },
    { from: 1, to: 0 },
    { from: 1, to: 8 },
    { from: 2, to: 7 },
    { from: 2, to: 4 }
  ];

  return (
    <div id="p235-lca-canvas">
      {/* Top Metrics Row */}
      <div id="p235-metrics-bar">
        <span id="p235-metric-pointer">
          Inspecting: <b>{activeNode !== null ? `Node (${activeNode})` : "NULL"}</b>
        </span>

        <span id="p235-metric-target-p">
          Target p: <b>Node ({p})</b>
        </span>

        <span id="p235-metric-target-q">
          Target q: <b>Node ({q})</b>
        </span>

        <span
          id="p235-metric-status"
          data-status={isCompleted ? "done" : "active"}
        >
          Status: <b>{isCompleted ? `LCA CONFIRMED: NODE ${activeNode}` : "POST-ORDER DFS SEARCH"}</b>
        </span>
      </div>

      <div id="p235-lca-stage">
        {/* Main Tree Card */}
        <div id="p235-tree-card">
          <div id="p235-tree-card-header">
            <span id="p235-tree-header-title">Binary Tree Lowest Common Ancestor</span>
            <span id="p235-tree-header-sub">Targets: p={p}, q={q} | Fork condition: leftFound &amp;&amp; rightFound</span>
          </div>

          <div id="p235-tree-viewport">
            <svg id="p235-tree-svg-surface" viewBox="0 0 460 260">
              {/* Edges */}
              {treeEdges.map(({ from, to }) => {
                const p1 = treeNodes.find((n) => n.val === from);
                const p2 = treeNodes.find((n) => n.val === to);
                const isTraversed =
                  isCompleted && from === activeNode && (to === p || to === q);

                return (
                  <line
                    key={`p235-edge-${from}-${to}`}
                    id={`p235-edge-${from}-${to}`}
                    data-edge-state={isTraversed ? "active" : "normal"}
                    x1={p1.cx}
                    y1={p1.cy}
                    x2={p2.cx}
                    y2={p2.cy}
                  />
                );
              })}

              {/* Nodes */}
              {treeNodes.map((node) => {
                const isCurr = activeNode === node.val;
                const isP = p === node.val;
                const isQ = q === node.val;
                const isLCA = isCompleted && activeNode === node.val;

                let nodeState = "idle";
                if (isLCA) {
                  nodeState = "lca";
                } else if (isCurr) {
                  nodeState = "curr";
                } else if (isP) {
                  nodeState = "target-p";
                } else if (isQ) {
                  nodeState = "target-q";
                }

                return (
                  <g key={`p235-g-node-${node.id}`} id={`p235-g-node-${node.id}`}>
                    {isLCA && (
                      <circle id={`p235-halo-lca-${node.val}`} cx={node.cx} cy={node.cy} r="26" />
                    )}
                    {isCurr && !isLCA && (
                      <circle id={`p235-halo-curr-${node.val}`} cx={node.cx} cy={node.cy} r="24" />
                    )}

                    <circle
                      id={`p235-node-circle-${node.val}`}
                      data-node-state={nodeState}
                      cx={node.cx}
                      cy={node.cy}
                      r="18"
                    />

                    <text
                      id={`p235-text-val-${node.val}`}
                      data-node-state={nodeState}
                      x={node.cx}
                      y={node.cy + 1}
                    >
                      {node.val}
                    </text>

                    <text
                      id={`p235-text-sub-${node.val}`}
                      data-node-state={nodeState}
                      x={node.cx}
                      y={node.cy + 27}
                    >
                      {isLCA ? "LCA" : isP ? "TARGET p" : isQ ? "TARGET q" : isCurr ? "CURR" : ""}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Post-Order Return Telemetry */}
        <div id="p235-inspector-card">
          <div id="p235-inspector-card-header">
            <span id="p235-inspector-header-title">Subtree Return Verification</span>
            <span id="p235-inspector-header-sub">Evaluates whether targets return from opposing branches</span>
          </div>

          <div id="p235-inspector-grid">
            <div id="p235-box-left-res">
              <span id="p235-title-left-res">Left Subtree Return:</span>
              <span id="p235-val-left-res">
                {leftResult !== null ? `Found Node (${leftResult})` : "Pending"}
              </span>
            </div>

            <div id="p235-box-right-res">
              <span id="p235-title-right-res">Right Subtree Return:</span>
              <span id="p235-val-right-res">
                {rightResult !== null ? `Found Node (${rightResult})` : "Pending"}
              </span>
            </div>

            <div id="p235-box-decision">
              <span id="p235-title-decision">Fork Status:</span>
              <span
                id="p235-val-decision"
                data-verdict={isCompleted ? "lca" : "search"}
              >
                {isCompleted
                  ? `BOTH RETURNED ➔ NODE (${activeNode}) IS LCA`
                  : "TRAVERSING TREE SUBTREES"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Result Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p235-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div id="p235-callout-header-text">{output.label}</div>
            <div id="p235-callout-val-text">{output.value}</div>
            <div id="p235-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}