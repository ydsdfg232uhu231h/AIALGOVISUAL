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
      <svg id={`svg-surface-${treeKey}`} viewBox="0 0 280 210">
        {/* Edges */}
        {treeEdges.map(({ from, to }) => {
          const p1 = treeNodes.find((n) => n.id === from);
          const p2 = treeNodes.find((n) => n.id === to);
          const isEdgeMatched =
            comparedNodes.includes(Number(from)) && comparedNodes.includes(Number(to));

          return (
            <line
              key={`edge-${treeKey}-${from}-${to}`}
              id={isEdgeMatched ? `edge-matched-${treeKey}-${from}-${to}` : `edge-normal-${treeKey}-${from}-${to}`}
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

          let circleId = `node-idle-${treeKey}-${node.val}`;
          if (isActive) {
            circleId = `node-active-${treeKey}-${node.val}`;
          } else if (isPassed || isCompleted) {
            circleId = `node-matched-${treeKey}-${node.val}`;
          }

          return (
            <g key={`g-${treeKey}-${node.id}`} id={`g-${treeKey}-${node.id}`}>
              {isActive && (
                <circle id={`halo-active-${treeKey}-${node.val}`} cx={node.cx} cy={node.cy} r="28" />
              )}
              {(isPassed || isCompleted) && (
                <circle id={`halo-matched-${treeKey}-${node.val}`} cx={node.cx} cy={node.cy} r="25" />
              )}
              
              <circle id={circleId} cx={node.cx} cy={node.cy} r="21" />
              
              <text id={`text-val-${treeKey}-${node.val}`} x={node.cx} y={node.cy + 1}>
                {node.val}
              </text>
              <text id={`text-sub-${treeKey}-${node.val}`} x={node.cx} y={node.cy + 30}>
                {node.val === 1 ? "root" : node.val === 2 ? "left" : "right"}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div id="same-tree-canvas">
      {/* Top Metrics Row */}
      <div id="metrics-bar">
        <span id="metric-p-node">
          Tree P Node: <b>{activeP !== null ? `Node (${activeP})` : "None"}</b>
        </span>

        <span id="metric-q-node">
          Tree Q Node: <b>{activeQ !== null ? `Node (${activeQ})` : "None"}</b>
        </span>

        <span
          id={
            matchStatus === "MATCH"
              ? "metric-match-pass"
              : matchStatus === "MISMATCH"
              ? "metric-match-fail"
              : "metric-match-inspect"
          }
        >
          Check: <b>{matchStatus === "MATCH" ? "EQUAL (p.val == q.val)" : matchStatus === "MISMATCH" ? "MISMATCH" : "INSPECTING"}</b>
        </span>

        <span id={isCompleted ? "metric-status-done" : "metric-status-active"}>
          Status: <b>{isCompleted ? "TREES ARE IDENTICAL" : "SYNCHRONIZED DFS"}</b>
        </span>
      </div>

      {/* Dual Tree Stages */}
      <div id="dual-tree-stage">
        {/* Left Tree: P */}
        <div id="tree-p-card">
          <div id="header-tree-p">
            <span id="title-tree-p">Tree P (Target)</span>
            <span id="badge-tree-p">BINARY TREE P</span>
          </div>
          <div id="viewport-tree-p">{renderTreeSvg("P")}</div>
        </div>

        {/* Right Tree: Q */}
        <div id="tree-q-card">
          <div id="header-tree-q">
            <span id="title-tree-q">Tree Q (Candidate)</span>
            <span id="badge-tree-q">BINARY TREE Q</span>
          </div>
          <div id="viewport-tree-q">{renderTreeSvg("Q")}</div>
        </div>
      </div>

      {/* Comparison Engine Inspector */}
      <div id="comparison-card">
        <div id="comparison-card-header">
          <span id="comparison-header-title">Recursive DFS Comparison Formula</span>
          <span id="comparison-header-sub">Checks equality of structure and node values</span>
        </div>

        <div id="comparison-grid">
          <div id="comp-box-nodes">
            <span id="comp-title-nodes">Current Pair:</span>
            <span id="comp-val-nodes">
              {activeP !== null && activeQ !== null ? `p(${activeP}) vs q(${activeQ})` : "None"}
            </span>
          </div>

          <div id="comp-box-condition">
            <span id="comp-title-condition">Recursive Assertion:</span>
            <span id="comp-val-condition">{comparisonExpr || "Awaiting step"}</span>
          </div>

          <div id="comp-box-result">
            <span id="comp-title-result">Step Equality:</span>
            <span id={matchStatus === "MATCH" ? "comp-val-pass" : matchStatus === "MISMATCH" ? "comp-val-fail" : "comp-val-inspect"}>
              {matchStatus === "MATCH" ? "MATCH CONFIRMED ✓" : matchStatus === "MISMATCH" ? "MISMATCH ✗" : "COMPARING..."}
            </span>
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