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
    <div id="lca-canvas">
      {/* Top Metrics Row */}
      <div id="metrics-bar">
        <span id="metric-pointer">
          Inspecting: <b>{activeNode !== null ? `Node (${activeNode})` : "NULL"}</b>
        </span>

        <span id="metric-target-p">
          Target p: <b>Node ({p})</b>
        </span>

        <span id="metric-target-q">
          Target q: <b>Node ({q})</b>
        </span>

        <span id={isCompleted ? "metric-status-done" : "metric-status-active"}>
          Status: <b>{isCompleted ? `LCA CONFIRMED: NODE ${activeNode}` : "POST-ORDER DFS SEARCH"}</b>
        </span>
      </div>

      <div id="lca-stage">
        {/* Main Tree Card */}
        <div id="tree-card">
          <div id="tree-card-header">
            <span id="tree-header-title">Binary Tree Lowest Common Ancestor</span>
            <span id="tree-header-sub">Targets: p={p}, q={q} | Fork condition: leftFound &amp;&amp; rightFound</span>
          </div>

          <div id="tree-viewport">
            <svg id="tree-svg-surface" viewBox="0 0 460 260">
              {/* Edges */}
              {treeEdges.map(({ from, to }) => {
                const p1 = treeNodes.find((n) => n.val === from);
                const p2 = treeNodes.find((n) => n.val === to);
                const isTraversed =
                  isCompleted && from === activeNode && (to === p || to === q);

                return (
                  <line
                    key={`edge-${from}-${to}`}
                    id={isTraversed ? `edge-active-${from}-${to}` : `edge-normal-${from}-${to}`}
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

                let circleId = `node-idle-${node.val}`;
                if (isLCA) {
                  circleId = `node-lca-${node.val}`;
                } else if (isCurr) {
                  circleId = `node-curr-${node.val}`;
                } else if (isP) {
                  circleId = `node-target-p-${node.val}`;
                } else if (isQ) {
                  circleId = `node-target-q-${node.val}`;
                }

                return (
                  <g key={`g-node-${node.id}`} id={`g-node-${node.id}`}>
                    {isLCA && (
                      <circle id={`halo-lca-${node.val}`} cx={node.cx} cy={node.cy} r="26" />
                    )}
                    {isCurr && !isLCA && (
                      <circle id={`halo-curr-${node.val}`} cx={node.cx} cy={node.cy} r="24" />
                    )}

                    <circle id={circleId} cx={node.cx} cy={node.cy} r="18" />

                    <text id={`text-val-${node.val}`} x={node.cx} y={node.cy + 1}>
                      {node.val}
                    </text>

                    <text id={`text-sub-${node.val}`} x={node.cx} y={node.cy + 27}>
                      {isLCA ? "LCA" : isP ? "TARGET p" : isQ ? "TARGET q" : isCurr ? "CURR" : ""}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Post-Order Return Telemetry */}
        <div id="inspector-card">
          <div id="inspector-card-header">
            <span id="inspector-header-title">Subtree Return Verification</span>
            <span id="inspector-header-sub">Evaluates whether targets return from opposing branches</span>
          </div>

          <div id="inspector-grid">
            <div id="box-left-res">
              <span id="title-left-res">Left Subtree Return:</span>
              <span id="val-left-res">
                {leftResult !== null ? `Found Node (${leftResult})` : "Pending"}
              </span>
            </div>

            <div id="box-right-res">
              <span id="title-right-res">Right Subtree Return:</span>
              <span id="val-right-res">
                {rightResult !== null ? `Found Node (${rightResult})` : "Pending"}
              </span>
            </div>

            <div id="box-decision">
              <span id="title-decision">Fork Status:</span>
              <span id={isCompleted ? "val-verdict-lca" : "val-verdict-search"}>
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