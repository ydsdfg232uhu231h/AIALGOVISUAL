import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem230.css";

export default function Problem230({ stepData }) {
  const {
    curr = 5,
    n = 0,
    k = 3,
    stack = [],
    visitedOrder = [],
    activePop = null,
    kthFound = false,
    output
  } = stepData || {};

  // Standard 6-node Cartesian layout in viewBox="0 0 420 260"
  const treeNodes = [
    { id: 5, val: 5, cx: 230, cy: 40 },
    { id: 3, val: 3, cx: 130, cy: 100 },
    { id: 6, val: 6, cx: 330, cy: 100 },
    { id: 2, val: 2, cx: 80, cy: 165 },
    { id: 4, val: 4, cx: 180, cy: 165 },
    { id: 1, val: 1, cx: 45, cy: 225 }
  ];

  const treeEdges = [
    { from: 5, to: 3 },
    { from: 5, to: 6 },
    { from: 3, to: 2 },
    { from: 3, to: 4 },
    { from: 2, to: 1 }
  ];

  return (
    <div id="kth-bst-canvas">
      {/* Top Metrics Row */}
      <div id="metrics-bar">
        <span id="metric-pointer">
          Pointer (`curr`): <b>{curr !== null ? `Node (${curr})` : "NULL"}</b>
        </span>

        <span id="metric-counter">
          In-order Count (`n`): <b>{n} / target k={k}</b>
        </span>

        <span id="metric-stack-len">
          Stack Depth: <b>{stack.length}</b>
        </span>

        <span id={kthFound ? "metric-status-done" : "metric-status-active"}>
          Status: <b>{kthFound ? `FOUND K=${k} SMALLEST: ${activePop}` : "IN-ORDER DFS"}</b>
        </span>
      </div>

      {/* Main Stage */}
      <div id="kth-stage">
        {/* Left: Expanded BST */}
        <div id="tree-card">
          <div id="tree-card-header">
            <span id="tree-header-title">1. Binary Search Tree (6 Nodes)</span>
            <span id="tree-header-sub">Left &lt; Root &lt; Right (Target k = {k})</span>
          </div>

          <div id="tree-viewport">
            <svg id="tree-svg-surface" viewBox="0 0 420 260">
              {/* Edges */}
              {treeEdges.map(({ from, to }) => {
                const p1 = treeNodes.find((node) => node.val === from);
                const p2 = treeNodes.find((node) => node.val === to);
                const isTraversed = visitedOrder.includes(from) || stack.includes(to);

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
                const isCurr = curr === node.val;
                const isStacked = stack.includes(node.val);
                const isPopped = visitedOrder.includes(node.val);
                const isWinner = kthFound && activePop === node.val;

                let circleId = `node-idle-${node.val}`;
                if (isWinner) {
                  circleId = `node-winner-${node.val}`;
                } else if (isCurr) {
                  circleId = `node-curr-${node.val}`;
                } else if (isStacked) {
                  circleId = `node-stacked-${node.val}`;
                } else if (isPopped) {
                  circleId = `node-popped-${node.val}`;
                }

                return (
                  <g key={`g-node-${node.id}`} id={`g-node-${node.id}`}>
                    {isWinner && (
                      <circle id={`halo-winner-${node.val}`} cx={node.cx} cy={node.cy} r="26" />
                    )}
                    {isCurr && (
                      <circle id={`halo-curr-${node.val}`} cx={node.cx} cy={node.cy} r="24" />
                    )}

                    <circle id={circleId} cx={node.cx} cy={node.cy} r="19" />

                    <text id={`text-val-${node.val}`} x={node.cx} y={node.cy + 1}>
                      {node.val}
                    </text>
                    <text id={`text-sub-${node.val}`} x={node.cx} y={node.cy + 27}>
                      {isWinner ? "K-TH SMALLEST" : isPopped ? "VISITED" : isStacked ? "ON STACK" : ""}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right: Runtime State (Stack + Stream) */}
        <div id="data-stage">
          {/* LIFO Call Stack */}
          <div id="stack-card">
            <div id="stack-card-header">
              <span id="stack-header-title">2. LIFO Traversal Stack</span>
              <span id="stack-header-sub">Drill left: push; Pop on NULL</span>
            </div>

            <div id="stack-viewport">
              <AnimatePresence mode="popLayout">
                {stack.length === 0 ? (
                  <span id="stack-empty-text">Stack is empty</span>
                ) : (
                  <div id="stack-column">
                    {[...stack].reverse().map((val, revIdx) => {
                      const isTop = revIdx === 0;
                      return (
                        <motion.div
                          key={`stack-item-${val}`}
                          id={isTop ? `stack-cell-top-${val}` : `stack-cell-${val}`}
                          layout
                          initial={{ opacity: 0, y: -15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        >
                          <span id={`stack-token-val-${val}`}>Node ({val})</span>
                          {isTop && <span id="stack-top-badge">TOP</span>}
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Ascending In-Order Stream */}
          <div id="order-card">
            <div id="order-card-header">
              <span id="order-header-title">3. Sorted In-Order Stream</span>
              <span id="order-header-sub">Checks n == k on each pop</span>
            </div>

            <div id="order-viewport">
              {visitedOrder.length === 0 ? (
                <span id="order-empty-text">No elements popped yet</span>
              ) : (
                <div id="order-row">
                  {visitedOrder.map((val, idx) => {
                    const isKth = kthFound && val === activePop;
                    return (
                      <motion.div
                        key={`order-pill-${val}`}
                        id={isKth ? `order-pill-kth-${val}` : `order-pill-${val}`}
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 350, damping: 22 }}
                      >
                        <span id={`order-val-${val}`}>{val}</span>
                        <span id={`order-counter-${val}`}>n={idx + 1}</span>
                      </motion.div>
                    );
                  })}
                </div>
              )}
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