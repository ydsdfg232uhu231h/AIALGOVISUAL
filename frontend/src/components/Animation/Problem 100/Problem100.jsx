import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem100.css";

export default function Problem100({ stepData }) {
  const {
    activeP = null,
    activeQ = null,
    comparedNodes = [], // Nodes confirmed matched so far: e.g. [1, 2]
    matchStatus = "INSPECTING", // "MATCH", "MISMATCH", "INSPECTING"
    comparisonExpr = null,
    isCompleted = false,
    output
  } = stepData || {};

  // Standard 3-node binary tree coordinates for 280x210 SVG
  const treeNodes = [
    { id: "1", val: 1, cx: 140, cy: 45 },
    { id: "2", val: 2, cx: 75, cy: 135 },
    { id: "3", val: 3, cx: 205, cy: 135 }
  ];

  const treeEdges = [
    { from: "1", to: "2" },
    { from: "1", to: "3" }
  ];

  const renderTreeSvg = (treeKey) => {
    const activeVal = treeKey === "P" ? activeP : activeQ;

    return (
      <svg id={`p100-svg-surface-${treeKey}`} viewBox="0 0 280 210">
        {/* Edges */}
        {treeEdges.map(({ from, to }) => {
          const p1 = treeNodes.find((n) => n.id === from);
          const p2 = treeNodes.find((n) => n.id === to);
          const isEdgeMatched =
            comparedNodes.includes(Number(from)) && comparedNodes.includes(Number(to));

          return (
            <line
              key={`p100-edge-${treeKey}-${from}-${to}`}
              id={`p100-edge-${treeKey}-${from}-${to}`}
              data-edge-state={isEdgeMatched ? "matched" : "normal"}
              x1={p1.cx}
              y1={p1.cy}
              x2={p2.cx}
              y2={p2.cy}
            />
          );
        })}

        {/* Nodes */}
        {treeNodes.map((node) => {
          const isActive = activeVal === node.val;
          const isPassed = comparedNodes.includes(node.val);

          let nodeState = "idle";
          if (isActive) {
            nodeState = "active";
          } else if (isPassed || isCompleted) {
            nodeState = "matched";
          }

          return (
            <g key={`p100-g-${treeKey}-${node.id}`} id={`p100-g-${treeKey}-${node.id}`}>
              {isActive && (
                <circle
                  id={`p100-halo-active-${treeKey}-${node.val}`}
                  cx={node.cx}
                  cy={node.cy}
                  r="28"
                />
              )}
              {(isPassed || isCompleted) && (
                <circle
                  id={`p100-halo-matched-${treeKey}-${node.val}`}
                  cx={node.cx}
                  cy={node.cy}
                  r="25"
                />
              )}

              <circle
                id={`p100-node-${treeKey}-${node.val}`}
                data-node-state={nodeState}
                cx={node.cx}
                cy={node.cy}
                r="21"
              />

              <text id={`p100-text-val-${treeKey}-${node.val}`} x={node.cx} y={node.cy + 1}>
                {node.val}
              </text>
              <text id={`p100-text-sub-${treeKey}-${node.val}`} x={node.cx} y={node.cy + 30}>
                {node.val === 1 ? "root" : node.val === 2 ? "left" : "right"}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div id="p100-same-tree-canvas">
      {/* Top Metrics Row */}
      <div id="p100-metrics-bar">
        <span id="p100-metric-p-node">
          Tree P Node: <b>{activeP !== null ? `Node (${activeP})` : "None"}</b>
        </span>

        <span id="p100-metric-q-node">
          Tree Q Node: <b>{activeQ !== null ? `Node (${activeQ})` : "None"}</b>
        </span>

        <span
          id="p100-metric-match"
          data-match-status={matchStatus}
        >
          Check: <b>{matchStatus === "MATCH" ? "EQUAL (p.val == q.val)" : matchStatus === "MISMATCH" ? "MISMATCH" : "INSPECTING"}</b>
        </span>

        <span
          id="p100-metric-status"
          data-status={isCompleted ? "done" : "active"}
        >
          Status: <b>{isCompleted ? "TREES ARE IDENTICAL" : "SYNCHRONIZED DFS"}</b>
        </span>
      </div>

      {/* Dual Tree Stages */}
      <div id="p100-dual-tree-stage">
        {/* Left Tree: P */}
        <div id="p100-tree-p-card">
          <div id="p100-header-tree-p">
            <span id="p100-title-tree-p">Tree P (Target)</span>
            <span id="p100-badge-tree-p">BINARY TREE P</span>
          </div>
          <div id="p100-viewport-tree-p">{renderTreeSvg("P")}</div>
        </div>

        {/* Right Tree: Q */}
        <div id="p100-tree-q-card">
          <div id="p100-header-tree-q">
            <span id="p100-title-tree-q">Tree Q (Candidate)</span>
            <span id="p100-badge-tree-q">BINARY TREE Q</span>
          </div>
          <div id="p100-viewport-tree-q">{renderTreeSvg("Q")}</div>
        </div>
      </div>

      {/* Comparison Engine Inspector */}
      <div id="p100-comparison-card">
        <div id="p100-comparison-card-header">
          <span id="p100-comparison-header-title">Recursive DFS Comparison Formula</span>
          <span id="p100-comparison-header-sub">Checks equality of structure and node values</span>
        </div>

        <div id="p100-comparison-grid">
          <div id="p100-comp-box-nodes">
            <span id="p100-comp-title-nodes">Current Pair:</span>
            <span id="p100-comp-val-nodes">
              {activeP !== null && activeQ !== null ? `p(${activeP}) vs q(${activeQ})` : "None"}
            </span>
          </div>

          <div id="p100-comp-box-condition">
            <span id="p100-comp-title-condition">Recursive Assertion:</span>
            <span id="p100-comp-val-condition">{comparisonExpr || "Awaiting step"}</span>
          </div>

          <div id="p100-comp-box-result">
            <span id="p100-comp-title-result">Step Equality:</span>
            <span
              id="p100-comp-val-result"
              data-match-status={matchStatus}
            >
              {matchStatus === "MATCH" ? "MATCH CONFIRMED ✓" : matchStatus === "MISMATCH" ? "MISMATCH ✗" : "COMPARING..."}
            </span>
          </div>
        </div>
      </div>

      {/* Result Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p100-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div id="p100-callout-header-text">{output.label}</div>
            <div id="p100-callout-val-text">{output.value}</div>
            <div id="p100-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}