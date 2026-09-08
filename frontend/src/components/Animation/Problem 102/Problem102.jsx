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
    <div id="levelorder-canvas">
      {/* Top Metrics Row */}
      <div id="metrics-bar">
        <span id="metric-level">
          Current Level: <b>Level {currentLevelIndex}</b>
        </span>

        <span id="metric-queue-size">
          Queue Size: <b>{queue.length}</b>
        </span>

        <span id="metric-active-node">
          Processing: <b>{activeNode !== null ? `Node (${activeNode})` : "Idle"}</b>
        </span>

        <span id={isCompleted ? "metric-status-done" : "metric-status-active"}>
          Status: <b>{isCompleted ? "TRAVERSAL FINISHED" : "BFS IN PROGRESS"}</b>
        </span>
      </div>

      <div id="levelorder-stage">
        {/* Left Card: Tree Visualization with Level Bands */}
        <div id="tree-card">
          <div id="tree-card-header">
            <span id="tree-header-title">Binary Tree & BFS Level Scan</span>
            <span id="tree-header-sub">Level-by-level horizontal traversal</span>
          </div>

          <div id="tree-viewport">
            <svg id="tree-svg-surface" viewBox="0 0 400 240">
              {/* Level Boundary Guide Lines */}
              <line id="level-guide-0" x1="10" y1="85" x2="390" y2="85" />
              <line id="level-guide-1" x1="10" y1="165" x2="390" y2="165" />

              <text id="level-tag-0" x="20" y="45">Level 0</text>
              <text id="level-tag-1" x="20" y="125">Level 1</text>
              <text id="level-tag-2" x="20" y="200">Level 2</text>

              {/* Tree Edges */}
              {treeEdges.map(({ from, to }) => {
                const p1 = treeNodes.find((n) => n.id === from);
                const p2 = treeNodes.find((n) => n.id === to);
                const isEdgeTraversed =
                  processedNodes.includes(p1.val) &&
                  (processedNodes.includes(p2.val) || queue.includes(p2.val));

                return (
                  <line
                    key={`edge-${from}-${to}`}
                    id={isEdgeTraversed ? `edge-active-${from}-${to}` : `edge-idle-${from}-${to}`}
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

                let circleId = `node-idle-${node.val}`;
                if (isCompleted || isProcessed) {
                  circleId = `node-done-${node.val}`;
                } else if (isActive) {
                  circleId = `node-active-${node.val}`;
                } else if (isCurrentLevel) {
                  circleId = `node-level-${node.val}`;
                } else if (isEnqueued) {
                  circleId = `node-queued-${node.val}`;
                }

                return (
                  <g key={`tree-g-${node.id}`} id={`g-${node.id}`}>
                    {isCompleted && (
                      <circle id={`halo-${node.val}`} cx={node.cx} cy={node.cy} r="28" />
                    )}
                    <circle id={circleId} cx={node.cx} cy={node.cy} r="22" />
                    <text id={`text-val-${node.val}`} x={node.cx} y={node.cy + 1}>
                      {node.val}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right Column: Queue & Result State */}
        <div id="data-stage">
          {/* Track 2: FIFO BFS Queue */}
          <div id="queue-card">
            <div id="queue-card-header">
              <span id="queue-header-title">BFS Queue (`queue`)</span>
              <span id="queue-header-sub">FIFO order [Front ➔ Back]</span>
            </div>

            <div id="queue-viewport">
              <div id="queue-elements-row">
                <span id="queue-side-front">FRONT</span>
                <AnimatePresence mode="popLayout">
                  {queue.length === 0 ? (
                    <span id="queue-empty-text">Queue is empty</span>
                  ) : (
                    queue.map((val, idx) => (
                      <motion.div
                        key={`queue-item-${val}`}
                        id={`queue-pill-${val}`}
                        layout
                        initial={{ scale: 0.6, opacity: 0, x: 20 }}
                        animate={{ scale: 1, opacity: 1, x: 0 }}
                        exit={{ scale: 0.6, opacity: 0, y: -20 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        <span id={`queue-val-${val}`}>{val}</span>
                        <span id={`queue-idx-${val}`}>[{idx}]</span>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
                <span id="queue-side-back">BACK</span>
              </div>
            </div>
          </div>

          {/* Track 3: Final 2D Result Matrix */}
          <div id="result-matrix-card">
            <div id="result-card-header">
              <span id="result-header-title">Level Order Matrix (`res`)</span>
              <span id="result-header-sub">Grouped by tree level</span>
            </div>

            <div id="matrix-viewport">
              {res.length === 0 ? (
                <span id="matrix-empty-text">No levels appended yet</span>
              ) : (
                res.map((lvlArr, idx) => (
                  <motion.div
                    key={`res-level-${idx}`}
                    id={`res-level-row-${idx}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <span id={`res-level-tag-${idx}`}>L{idx}:</span>
                    <span id={`res-level-data-${idx}`}>
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