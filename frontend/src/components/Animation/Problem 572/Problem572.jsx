import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem572.css";

export default function Problem572({ stepData }) {
  const {
    activeMainNode = 3,
    activeSubNode = 4,
    comparisonFormula = "3 != 4",
    matchedNodes = [], // Nodes confirmed matching progressively: e.g. [4], [4, 1], [4, 1, 2]
    isSubtreeConfirmed = false,
    equalityStatus = "MISMATCH", // "INSPECTING", "MATCH", "MISMATCH"
    isCompleted = false,
    output
  } = stepData || {};

  // Main Tree Cartesian coordinates: 3 (root), 4 (left), 5 (right), 1 (left-left), 2 (left-right)
  const mainTreeNodes = [
    { id: "main-3", val: 3, cx: 160, cy: 38 },
    { id: "main-4", val: 4, cx: 90, cy: 105 },
    { id: "main-5", val: 5, cx: 230, cy: 105 },
    { id: "main-1", val: 1, cx: 50, cy: 175 },
    { id: "main-2", val: 2, cx: 130, cy: 175 }
  ];

  const mainTreeEdges = [
    { from: "main-3", to: "main-4", fromVal: 3, toVal: 4 },
    { from: "main-3", to: "main-5", fromVal: 3, toVal: 5 },
    { from: "main-4", to: "main-1", fromVal: 4, toVal: 1 },
    { from: "main-4", to: "main-2", fromVal: 4, toVal: 2 }
  ];

  // Target SubRoot Cartesian coordinates: 4 (root), 1 (left), 2 (right)
  const subTreeNodes = [
    { id: "sub-4", val: 4, cx: 120, cy: 55 },
    { id: "sub-1", val: 1, cx: 70, cy: 145 },
    { id: "sub-2", val: 2, cx: 170, cy: 145 }
  ];

  const subTreeEdges = [
    { from: "sub-4", to: "sub-1", fromVal: 4, toVal: 1 },
    { from: "sub-4", to: "sub-2", fromVal: 4, toVal: 2 }
  ];

  return (
    <div id="subtree-match-canvas">
      {/* Top Telemetry Header */}
      <div id="metrics-bar">
        <span id="metric-main-curr">
          Main Tree Candidate: <b>{activeMainNode !== null ? `Node (${activeMainNode})` : "None"}</b>
        </span>

        <span id="metric-sub-root">
          Target SubRoot: <b>Node ({activeSubNode})</b>
        </span>

        <span
          id={
            equalityStatus === "MATCH"
              ? "metric-match-pass"
              : equalityStatus === "MISMATCH"
              ? "metric-match-fail"
              : "metric-match-inspect"
          }
        >
          Check: <b>{equalityStatus === "MATCH" ? "IDENTICAL SUBTREE ✓" : equalityStatus === "MISMATCH" ? "ROOT MISMATCH" : "EVALUATING EQUALITY"}</b>
        </span>

        <span id={isCompleted ? "metric-status-done" : "metric-status-active"}>
          Status: <b>{isCompleted ? "SUBTREE DETECTED" : "DFS RECURSIVE SCAN"}</b>
        </span>
      </div>

      {/* Side-by-Side Dual Tree Stage */}
      <div id="subtree-stage">
        {/* Left: Main Tree (Candidate Host) */}
        <div id="main-tree-card">
          <div id="main-tree-header">
            <span id="main-header-title">1. Main Binary Tree (`root`)</span>
            <span id="main-header-sub">Progressive node verification</span>
          </div>

          <div id="main-tree-viewport">
            <svg id="main-tree-svg" viewBox="0 0 320 220">
              {/* Optional dynamic boundary contour when fully confirmed */}
              {isSubtreeConfirmed && (
                <path
                  id="subtree-contour-box"
                  d="M 90 80 C 20 80, 20 205, 90 205 C 160 205, 160 80, 90 80 Z"
                />
              )}

              {/* Main Tree Edges */}
              {mainTreeEdges.map(({ from, to, fromVal, toVal }) => {
                const p1 = mainTreeNodes.find((n) => n.id === from);
                const p2 = mainTreeNodes.find((n) => n.id === to);
                // Highlight edge progressively as both parent and child are verified in matchedNodes
                const isProgressiveEdge =
                  matchedNodes.includes(fromVal) && matchedNodes.includes(toVal);

                return (
                  <line
                    key={`edge-${from}-${to}`}
                    id={isProgressiveEdge ? `edge-sub-active-${from}-${to}` : `edge-idle-${from}-${to}`}
                    x1={p1.cx}
                    y1={p1.cy}
                    x2={p2.cx}
                    y2={p2.cy}
                  />
                );
              })}

              {/* Main Tree Nodes */}
              {mainTreeNodes.map((node) => {
                const isCurrentCandidate = activeMainNode === node.val;
                const isMatched = matchedNodes.includes(node.val);

                let circleId = `main-node-idle-${node.val}`;
                if (isSubtreeConfirmed) {
                  circleId = `main-node-winner-${node.val}`;
                } else if (isMatched) {
                  circleId = `main-node-matched-progressive-${node.val}`;
                } else if (isCurrentCandidate) {
                  circleId = `main-node-inspect-${node.val}`;
                }

                return (
                  <g key={`g-main-${node.id}`} id={`g-main-${node.id}`}>
                    {isMatched && (
                      <circle id={`halo-progressive-${node.val}`} cx={node.cx} cy={node.cy} r="25" />
                    )}
                    {isCurrentCandidate && !isMatched && (
                      <circle id={`halo-inspect-${node.val}`} cx={node.cx} cy={node.cy} r="25" />
                    )}

                    <circle id={circleId} cx={node.cx} cy={node.cy} r="20" />

                    <text id={`main-text-val-${node.val}`} x={node.cx} y={node.cy + 1}>
                      {node.val}
                    </text>
                    <text id={`main-text-sub-${node.val}`} x={node.cx} y={node.cy + 29}>
                      {isMatched ? "MATCH" : isCurrentCandidate ? "CURR" : ""}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right: Target SubTree (`subRoot`) */}
        <div id="sub-tree-card">
          <div id="sub-tree-header">
            <span id="sub-header-title">2. Target Subtree (`subRoot`)</span>
            <span id="sub-header-sub">Structure to locate: [4, 1, 2]</span>
          </div>

          <div id="sub-tree-viewport">
            <svg id="sub-tree-svg" viewBox="0 0 240 220">
              {/* SubTree Edges - highlight progressively if subRoot nodes match */}
              {subTreeEdges.map(({ from, to, fromVal, toVal }) => {
                const p1 = subTreeNodes.find((n) => n.id === from);
                const p2 = subTreeNodes.find((n) => n.id === to);
                // Map subRoot node values (4, 1, 2) back to main tree matched nodes for synchronized lighting
                const mappedFromVal = fromVal === 4 ? activeMainNode : fromVal === 1 ? 1 : 2;
                const isMatchedEdge = matchedNodes.length > 0;

                return (
                  <line
                    key={`edge-sub-${from}-${to}`}
                    id={isMatchedEdge ? `edge-target-done-${from}-${to}` : `edge-target-normal-${from}-${to}`}
                    x1={p1.cx}
                    y1={p1.cy}
                    x2={p2.cx}
                    y2={p2.cy}
                  />
                );
              })}

              {/* SubTree Nodes */}
              {subTreeNodes.map((node) => {
                let circleId = matchedNodes.length > 0
                  ? `sub-node-winner-${node.val}`
                  : `sub-node-idle-${node.val}`;

                return (
                  <g key={`g-sub-${node.id}`} id={`g-sub-${node.id}`}>
                    {matchedNodes.length > 0 && (
                      <circle id={`halo-sub-winner-${node.val}`} cx={node.cx} cy={node.cy} r="25" />
                    )}

                    <circle id={circleId} cx={node.cx} cy={node.cy} r="20" />

                    <text id={`sub-text-val-${node.val}`} x={node.cx} y={node.cy + 1}>
                      {node.val}
                    </text>
                    <text id={`sub-text-sub-${node.val}`} x={node.cx} y={node.cy + 29}>
                      {node.val === 4 ? "root" : "leaf"}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* Comparison Engine Card */}
      <div id="comparison-card">
        <div id="comparison-card-header">
          <span id="comparison-header-title">Subtree Equality Formula</span>
          <span id="comparison-header-sub">isSameTree(candidateSubtree, targetSubtree)</span>
        </div>

        <div id="comparison-grid">
          <div id="comp-box-candidate">
            <span id="comp-title-candidate">Testing Candidate:</span>
            <span id="comp-val-candidate">
              {activeMainNode !== null ? `Subtree at Node (${activeMainNode})` : "None"}
            </span>
          </div>

          <div id="comp-box-equation">
            <span id="comp-title-equation">Tree Match Equation:</span>
            <span id="comp-val-equation">{comparisonFormula || "Awaiting step"}</span>
          </div>

          <div id="comp-box-verdict">
            <span id="comp-title-verdict">Evaluation Status:</span>
            <span id={equalityStatus === "MATCH" ? "comp-val-pass" : equalityStatus === "MISMATCH" ? "comp-val-fail" : "comp-val-inspect"}>
              {equalityStatus === "MATCH" ? "SUBTREE MATCH CONFIRMED ✓" : equalityStatus === "MISMATCH" ? "NOT EQUAL (RECURSE) ✗" : "COMPARING..."}
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