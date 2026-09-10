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

  const matchStatusLower = equalityStatus.toLowerCase();

  return (
    <div id="p572-subtree-match-canvas">
      {/* Top Telemetry Header */}
      <div id="p572-metrics-bar">
        <span id="p572-metric-main-curr">
          Main Tree Candidate: <b>{activeMainNode !== null ? `Node (${activeMainNode})` : "None"}</b>
        </span>

        <span id="p572-metric-sub-root">
          Target SubRoot: <b>Node ({activeSubNode})</b>
        </span>

        <span
          id="p572-metric-match"
          data-match-status={matchStatusLower}
        >
          Check: <b>{equalityStatus === "MATCH" ? "IDENTICAL SUBTREE ✓" : equalityStatus === "MISMATCH" ? "ROOT MISMATCH" : "EVALUATING EQUALITY"}</b>
        </span>

        <span
          id="p572-metric-status"
          data-status={isCompleted ? "done" : "active"}
        >
          Status: <b>{isCompleted ? "SUBTREE DETECTED" : "DFS RECURSIVE SCAN"}</b>
        </span>
      </div>

      {/* Side-by-Side Dual Tree Stage */}
      <div id="p572-subtree-stage">
        {/* Left: Main Tree (Candidate Host) */}
        <div id="p572-main-tree-card">
          <div id="p572-main-tree-header">
            <span id="p572-main-header-title">1. Main Binary Tree (`root`)</span>
            <span id="p572-main-header-sub">Progressive node verification</span>
          </div>

          <div id="p572-main-tree-viewport">
            <svg id="p572-main-tree-svg" viewBox="0 0 320 220">
              {/* Boundary contour when fully confirmed */}
              {isSubtreeConfirmed && (
                <path
                  id="p572-subtree-contour-box"
                  d="M 90 80 C 20 80, 20 205, 90 205 C 160 205, 160 80, 90 80 Z"
                />
              )}

              {/* Main Tree Edges */}
              {mainTreeEdges.map(({ from, to, fromVal, toVal }) => {
                const p1 = mainTreeNodes.find((n) => n.id === from);
                const p2 = mainTreeNodes.find((n) => n.id === to);
                const isProgressiveEdge =
                  matchedNodes.includes(fromVal) && matchedNodes.includes(toVal);

                return (
                  <line
                    key={`p572-edge-main-${from}-${to}`}
                    id={`p572-edge-main-${fromVal}-${toVal}`}
                    data-edge-state={isProgressiveEdge ? "active" : "idle"}
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

                let nodeState = "idle";
                if (isSubtreeConfirmed) nodeState = "winner";
                else if (isMatched) nodeState = "progressive";
                else if (isCurrentCandidate) nodeState = "inspect";

                return (
                  <g key={`p572-g-main-${node.id}`} id={`p572-g-main-${node.id}`}>
                    <AnimatePresence>
                      {isMatched && (
                        <motion.circle
                          key={`p572-halo-prog-${node.val}`}
                          id={`p572-halo-main-${node.val}`}
                          data-node-state="progressive"
                          cx={node.cx}
                          cy={node.cy}
                          r={26}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 0.8 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 350, damping: 20 }}
                        />
                      )}
                      {isCurrentCandidate && !isMatched && (
                        <motion.circle
                          key={`p572-halo-ins-${node.val}`}
                          id={`p572-halo-main-${node.val}`}
                          data-node-state="inspect"
                          cx={node.cx}
                          cy={node.cy}
                          r={25}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 0.85 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 350, damping: 20 }}
                        />
                      )}
                    </AnimatePresence>

                    <motion.circle
                      id={`p572-node-main-${node.val}`}
                      data-node-state={nodeState}
                      cx={node.cx}
                      cy={node.cy}
                      r={20}
                      layout
                      animate={{
                        scale: nodeState === "winner" ? 1.08 : nodeState !== "idle" ? 1.04 : 1
                      }}
                      transition={{ type: "spring", stiffness: 350, damping: 22 }}
                    />

                    <text
                      id={`p572-main-text-val-${node.val}`}
                      data-node-state={nodeState}
                      x={node.cx}
                      y={node.cy + 1}
                    >
                      {node.val}
                    </text>
                    <text
                      id={`p572-main-text-sub-${node.val}`}
                      data-node-state={nodeState}
                      x={node.cx}
                      y={node.cy + 29}
                    >
                      {isMatched ? "MATCH" : isCurrentCandidate ? "CURR" : ""}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right: Target SubTree (`subRoot`) */}
        <div id="p572-sub-tree-card">
          <div id="p572-sub-tree-header">
            <span id="p572-sub-header-title">2. Target Subtree (`subRoot`)</span>
            <span id="p572-sub-header-sub">Structure to locate: [4, 1, 2]</span>
          </div>

          <div id="p572-sub-tree-viewport">
            <svg id="p572-sub-tree-svg" viewBox="0 0 240 220">
              {/* SubTree Edges */}
              {subTreeEdges.map(({ from, to, fromVal, toVal }) => {
                const p1 = subTreeNodes.find((n) => n.id === from);
                const p2 = subTreeNodes.find((n) => n.id === to);
                const isMatchedEdge = matchedNodes.length > 0;

                return (
                  <line
                    key={`p572-edge-sub-${from}-${to}`}
                    id={`p572-edge-sub-${fromVal}-${toVal}`}
                    data-edge-state={isMatchedEdge ? "done" : "normal"}
                    x1={p1.cx}
                    y1={p1.cy}
                    x2={p2.cx}
                    y2={p2.cy}
                  />
                );
              })}

              {/* SubTree Nodes */}
              {subTreeNodes.map((node) => {
                const isSubMatched = matchedNodes.length > 0;
                const nodeState = isSubMatched ? "winner" : "idle";

                return (
                  <g key={`p572-g-sub-${node.id}`} id={`p572-g-sub-${node.id}`}>
                    <AnimatePresence>
                      {isSubMatched && (
                        <motion.circle
                          key={`p572-halo-sub-${node.val}`}
                          id={`p572-halo-sub-${node.val}`}
                          cx={node.cx}
                          cy={node.cy}
                          r={25}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 0.8 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 350, damping: 20 }}
                        />
                      )}
                    </AnimatePresence>

                    <motion.circle
                      id={`p572-node-sub-${node.val}`}
                      data-node-state={nodeState}
                      cx={node.cx}
                      cy={node.cy}
                      r={20}
                      layout
                      animate={{ scale: isSubMatched ? 1.06 : 1 }}
                      transition={{ type: "spring", stiffness: 350, damping: 22 }}
                    />

                    <text
                      id={`p572-sub-text-val-${node.val}`}
                      data-node-state={nodeState}
                      x={node.cx}
                      y={node.cy + 1}
                    >
                      {node.val}
                    </text>
                    <text
                      id={`p572-sub-text-sub-${node.val}`}
                      data-node-state={nodeState}
                      x={node.cx}
                      y={node.cy + 29}
                    >
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
      <div id="p572-comparison-card">
        <div id="p572-comparison-card-header">
          <span id="p572-comparison-header-title">Subtree Equality Formula</span>
          <span id="p572-comparison-header-sub">isSameTree(candidateSubtree, targetSubtree)</span>
        </div>

        <div id="p572-comparison-grid">
          <div id="p572-comp-box-candidate">
            <span id="p572-comp-title-candidate">Testing Candidate:</span>
            <span id="p572-comp-val-candidate">
              {activeMainNode !== null ? `Subtree at Node (${activeMainNode})` : "None"}
            </span>
          </div>

          <div id="p572-comp-box-equation">
            <span id="p572-comp-title-equation">Tree Match Equation:</span>
            <span id="p572-comp-val-equation">{comparisonFormula || "Awaiting step"}</span>
          </div>

          <div id="p572-comp-box-verdict">
            <span id="p572-comp-title-verdict">Evaluation Status:</span>
            <span
              id="p572-comp-val-verdict"
              data-match-status={matchStatusLower}
            >
              {equalityStatus === "MATCH" ? "SUBTREE MATCH CONFIRMED ✓" : equalityStatus === "MISMATCH" ? "NOT EQUAL (RECURSE) ✗" : "COMPARING..."}
            </span>
          </div>
        </div>
      </div>

      {/* Result Callout (Elevated safely above playback controls) */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p572-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div id="p572-callout-header-text">{output.label}</div>
            <div id="p572-callout-val-text">{output.value}</div>
            <div id="p572-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}