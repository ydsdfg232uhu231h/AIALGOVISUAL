import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem102.css";

export default function Problem102({ stepData }) {
  const {
    queue = [], // e.g., [9, 20]
    currentLevelNodes = [], // e.g., [3]
    activeNode = null, // currently dequeued node
    currentLevelIndex = 0,
    res = [], // e.g., [[3], [9, 20]]
    state = {},
    output
  } = stepData || {};

  // Standard 3-level tree layout: root (3), children (9, 20), leaves (15, 7)
  const treeNodes = [
    { id: "node-3", val: 3, level: 0, cx: 200, cy: 45 },
    { id: "node-9", val: 9, level: 1, cx: 100, cy: 125 },
    { id: "node-20", val: 20, level: 1, cx: 300, cy: 125 },
    { id: "node-15", val: 15, level: 2, cx: 240, cy: 200 },
    { id: "node-7", val: 7, level: 2, cx: 360, cy: 200 }
  ];

  const treeEdges = [
    { from: "node-3", to: "node-9" },
    { from: "node-3", to: "node-20" },
    { from: "node-20", to: "node-15" },
    { from: "node-20", to: "node-7" }
  ];

  const isCompleted = state.status === "COMPLETED";
  const processedNodes = res.flat();

  return (
    <div id="p102-levelorder-canvas">
      {/* Top Metrics Row */}
      <div id="p102-metrics-bar">
        <span id="p102-metric-level">
          Current Level: <b>Level {currentLevelIndex}</b>
        </span>

        <span id="p102-metric-queue-size">
          Queue Size: <b>{queue.length}</b>
        </span>

        <span id="p102-metric-active-node">
          Processing: <b>{activeNode !== null ? `Node (${activeNode})` : "Idle"}</b>
        </span>

        <span
          id="p102-metric-status"
          data-status={isCompleted ? "done" : "active"}
        >
          Status: <b>{isCompleted ? "TRAVERSAL FINISHED" : "BFS IN PROGRESS"}</b>
        </span>
      </div>

      <div id="p102-levelorder-stage">
        {/* Left Card: Tree Visualization with Level Bands */}
        <div id="p102-tree-card">
          <div id="p102-tree-card-header">
            <span id="p102-tree-header-title">Binary Tree & BFS Level Scan</span>
            <span id="p102-tree-header-sub">Level-by-level horizontal traversal</span>
          </div>

          <div id="p102-tree-viewport">
            <svg id="p102-tree-svg-surface" viewBox="0 0 400 240">
              {/* Level Boundary Guide Lines */}
              <line id="p102-level-guide-0" x1="10" y1="85" x2="390" y2="85" />
              <line id="p102-level-guide-1" x1="10" y1="165" x2="390" y2="165" />

              <text id="p102-level-tag-0" x="20" y="45">Level 0</text>
              <text id="p102-level-tag-1" x="20" y="125">Level 1</text>
              <text id="p102-level-tag-2" x="20" y="200">Level 2</text>

              {/* Tree Edges */}
              {treeEdges.map(({ from, to }) => {
                const p1 = treeNodes.find((n) => n.id === from);
                const p2 = treeNodes.find((n) => n.id === to);
                const isEdgeTraversed =
                  processedNodes.includes(p1.val) &&
                  (processedNodes.includes(p2.val) || queue.includes(p2.val));

                return (
                  <line
                    key={`p102-edge-${from}-${to}`}
                    id={`p102-edge-${from}-${to}`}
                    data-edge-state={isEdgeTraversed ? "active" : "idle"}
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
                const isEnqueued = queue.includes(node.val);
                const isProcessed = processedNodes.includes(node.val);
                const isCurrentLevel = currentLevelNodes.includes(node.val);

                let nodeState = "idle";
                if (isCompleted || isProcessed) {
                  nodeState = "done";
                } else if (isActive) {
                  nodeState = "active";
                } else if (isCurrentLevel) {
                  nodeState = "level";
                } else if (isEnqueued) {
                  nodeState = "queued";
                }

                return (
                  <g key={`p102-tree-g-${node.id}`} id={`p102-g-${node.id}`}>
                    {isCompleted && (
                      <circle
                        id={`p102-halo-${node.val}`}
                        cx={node.cx}
                        cy={node.cy}
                        r="28"
                      />
                    )}
                    <circle
                      id={`p102-node-${node.val}`}
                      data-node-state={nodeState}
                      cx={node.cx}
                      cy={node.cy}
                      r="22"
                    />
                    <text
                      id={`p102-text-val-${node.val}`}
                      x={node.cx}
                      y={node.cy + 1}
                    >
                      {node.val}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right Column: Queue & Result State */}
        <div id="p102-data-stage">
          {/* Track 2: FIFO BFS Queue */}
          <div id="p102-queue-card">
            <div id="p102-queue-card-header">
              <span id="p102-queue-header-title">BFS Queue (`queue`)</span>
              <span id="p102-queue-header-sub">FIFO order [Front ➔ Back]</span>
            </div>

            <div id="p102-queue-viewport">
              <div id="p102-queue-elements-row">
                <span id="p102-queue-side-front">FRONT</span>
                <AnimatePresence mode="popLayout">
                  {queue.length === 0 ? (
                    <span id="p102-queue-empty-text">Queue is empty</span>
                  ) : (
                    queue.map((val, idx) => (
                      <motion.div
                        key={`p102-queue-item-${val}`}
                        id={`p102-queue-pill-${val}`}
                        layout
                        initial={{ scale: 0.6, opacity: 0, x: 20 }}
                        animate={{ scale: 1, opacity: 1, x: 0 }}
                        exit={{ scale: 0.6, opacity: 0, y: -20 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        <span id={`p102-queue-val-${val}`}>{val}</span>
                        <span id={`p102-queue-idx-${val}`}>[{idx}]</span>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
                <span id="p102-queue-side-back">BACK</span>
              </div>
            </div>
          </div>

          {/* Track 3: Final 2D Result Matrix */}
          <div id="p102-result-matrix-card">
            <div id="p102-result-card-header">
              <span id="p102-result-header-title">Level Order Matrix (`res`)</span>
              <span id="p102-result-header-sub">Grouped by tree level</span>
            </div>

            <div id="p102-matrix-viewport">
              {res.length === 0 ? (
                <span id="p102-matrix-empty-text">No levels appended yet</span>
              ) : (
                res.map((lvlArr, idx) => (
                  <motion.div
                    key={`p102-res-level-${idx}`}
                    id={`p102-res-level-row-${idx}`}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span id={`p102-res-level-tag-${idx}`}>L{idx}:</span>
                    <span id={`p102-res-level-data-${idx}`}>
                      [{lvlArr.join(", ")}]
                    </span>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Result Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p102-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div id="p102-callout-header-text">{output.label}</div>
            <div id="p102-callout-val-text">{output.value}</div>
            <div id="p102-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}