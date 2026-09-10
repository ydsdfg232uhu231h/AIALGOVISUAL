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
    <div id="p230-kth-bst-canvas">
      {/* Top Metrics Row */}
      <div id="p230-metrics-bar">
        <span id="p230-metric-pointer">
          Pointer (`curr`): <b>{curr !== null ? `Node (${curr})` : "NULL"}</b>
        </span>

        <span id="p230-metric-counter">
          In-order Count (`n`): <b>{n} / target k={k}</b>
        </span>

        <span id="p230-metric-stack-len">
          Stack Depth: <b>{stack.length}</b>
        </span>

        <span
          id="p230-metric-status"
          data-status={kthFound ? "done" : "active"}
        >
          Status: <b>{kthFound ? `FOUND K=${k} SMALLEST: ${activePop}` : "IN-ORDER DFS"}</b>
        </span>
      </div>

      {/* Main Stage */}
      <div id="p230-kth-stage">
        {/* Left: Expanded BST */}
        <div id="p230-tree-card">
          <div id="p230-tree-card-header">
            <span id="p230-tree-header-title">1. Binary Search Tree (6 Nodes)</span>
            <span id="p230-tree-header-sub">Left &lt; Root &lt; Right (Target k = {k})</span>
          </div>

          <div id="p230-tree-viewport">
            <svg id="p230-tree-svg-surface" viewBox="0 0 420 260">
              {/* Edges */}
              {treeEdges.map(({ from, to }) => {
                const p1 = treeNodes.find((node) => node.val === from);
                const p2 = treeNodes.find((node) => node.val === to);
                const isTraversed = visitedOrder.includes(from) || stack.includes(to);

                return (
                  <line
                    key={`p230-edge-${from}-${to}`}
                    id={`p230-edge-${from}-${to}`}
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
                const isCurr = curr === node.val;
                const isStacked = stack.includes(node.val);
                const isPopped = visitedOrder.includes(node.val);
                const isWinner = kthFound && activePop === node.val;

                let nodeState = "idle";
                if (isWinner) nodeState = "winner";
                else if (isCurr) nodeState = "curr";
                else if (isStacked) nodeState = "stacked";
                else if (isPopped) nodeState = "popped";

                return (
                  <g key={`p230-g-node-${node.id}`} id={`p230-g-node-${node.id}`}>
                    {isWinner && (
                      <circle id={`p230-halo-winner-${node.val}`} cx={node.cx} cy={node.cy} r="26" />
                    )}
                    {isCurr && (
                      <circle id={`p230-halo-curr-${node.val}`} cx={node.cx} cy={node.cy} r="24" />
                    )}

                    <circle
                      id={`p230-node-circle-${node.val}`}
                      data-node-state={nodeState}
                      cx={node.cx}
                      cy={node.cy}
                      r="19"
                    />

                    <text
                      id={`p230-text-val-${node.val}`}
                      data-node-state={nodeState}
                      x={node.cx}
                      y={node.cy + 1}
                    >
                      {node.val}
                    </text>
                    <text
                      id={`p230-text-sub-${node.val}`}
                      data-node-state={nodeState}
                      x={node.cx}
                      y={node.cy + 27}
                    >
                      {isWinner ? "K-TH SMALLEST" : isPopped ? "VISITED" : isStacked ? "ON STACK" : ""}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right: Runtime State (Stack + Stream) */}
        <div id="p230-data-stage">
          {/* LIFO Call Stack */}
          <div id="p230-stack-card">
            <div id="p230-stack-card-header">
              <span id="p230-stack-header-title">2. LIFO Traversal Stack</span>
              <span id="p230-stack-header-sub">Drill left: push; Pop on NULL</span>
            </div>

            <div id="p230-stack-viewport">
              <AnimatePresence mode="popLayout">
                {stack.length === 0 ? (
                  <span id="p230-stack-empty-text">Stack is empty</span>
                ) : (
                  <div id="p230-stack-column">
                    {[...stack].reverse().map((val, revIdx) => {
                      const isTop = revIdx === 0;
                      return (
                        <motion.div
                          key={`p230-stack-item-${val}`}
                          id={`p230-stack-cell-${val}`}
                          data-is-top={isTop ? "true" : "false"}
                          layout
                          initial={{ opacity: 0, y: -15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        >
                          <span id={`p230-stack-token-val-${val}`}>Node ({val})</span>
                          {isTop && <span id="p230-stack-top-badge">TOP</span>}
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Ascending In-Order Stream */}
          <div id="p230-order-card">
            <div id="p230-order-card-header">
              <span id="p230-order-header-title">3. Sorted In-Order Stream</span>
              <span id="p230-order-header-sub">Checks n == k on each pop</span>
            </div>

            <div id="p230-order-viewport">
              {visitedOrder.length === 0 ? (
                <span id="p230-order-empty-text">No elements popped yet</span>
              ) : (
                <div id="p230-order-row">
                  {visitedOrder.map((val, idx) => {
                    const isKth = kthFound && val === activePop;
                    return (
                      <motion.div
                        key={`p230-order-pill-${val}`}
                        id={`p230-order-pill-${val}`}
                        data-is-kth={isKth ? "true" : "false"}
                        layout
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 350, damping: 22 }}
                      >
                        <span id={`p230-order-val-${val}`}>{val}</span>
                        <span id={`p230-order-counter-${val}`}>n={idx + 1}</span>
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
            id="p230-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div id="p230-callout-header-text">{output.label}</div>
            <div id="p230-callout-val-text">{output.value}</div>
            <div id="p230-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}