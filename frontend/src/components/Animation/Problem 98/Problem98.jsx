import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem98.css";

export default function Problem98({ stepData }) {
  const {
    activeNodeId = null, // e.g., "A-node-4" or "B-node-4"
    activeBounds = ["-INF", "+INF"],
    comparisonExpr = null,
    verdict = "INSPECTING",
    validatedANodes = [], // Dynamically tracks which nodes in A passed: ["A-node-4", "A-node-2", ...]
    treeACompleted = false, // Turns the whole Tree A into finished state
    output
  } = stepData || {};

  // Valid BST (Tree A): Root 4, Left 2 (Leaves 1, 3), Right 6
  const treeANodes = [
    { id: "A-node-4", val: 4, cx: 150, cy: 40, bounds: "(-∞, +∞)" },
    { id: "A-node-2", val: 2, cx: 85, cy: 110, bounds: "(-∞, 4)" },
    { id: "A-node-6", val: 6, cx: 215, cy: 110, bounds: "(4, +∞)" },
    { id: "A-node-1", val: 1, cx: 50, cy: 180, bounds: "(-∞, 2)" },
    { id: "A-node-3", val: 3, cx: 120, cy: 180, bounds: "(2, 4)" }
  ];

  const treeAEdges = [
    { from: "A-node-4", to: "A-node-2" },
    { from: "A-node-4", to: "A-node-6" },
    { from: "A-node-2", to: "A-node-1" },
    { from: "A-node-2", to: "A-node-3" }
  ];

  // Invalid BST (Tree B): Root 5, Left 1, Right 4 (violates 4 > 5)
  const treeBNodes = [
    { id: "B-node-5", val: 5, cx: 150, cy: 40, bounds: "(-∞, +∞)" },
    { id: "B-node-1", val: 1, cx: 85, cy: 110, bounds: "(-∞, 5)" },
    { id: "B-node-4", val: 4, cx: 215, cy: 110, bounds: "(5, +∞)" },
    { id: "B-node-3", val: 3, cx: 180, cy: 180, bounds: "(5, 4)" },
    { id: "B-node-6", val: 6, cx: 250, cy: 180, bounds: "(4, +∞)" }
  ];

  const treeBEdges = [
    { from: "B-node-5", to: "B-node-1" },
    { from: "B-node-5", to: "B-node-4" },
    { from: "B-node-4", to: "B-node-3" },
    { from: "B-node-4", to: "B-node-6" }
  ];

  const renderTreeSvg = (isTreeA) => {
    const nodes = isTreeA ? treeANodes : treeBNodes;
    const edges = isTreeA ? treeAEdges : treeBEdges;
    const treeKey = isTreeA ? "A" : "B";

    return (
      <svg id={`svg-surface-${treeKey}`} viewBox="0 0 300 230">
        {/* Edges */}
        {edges.map(({ from, to }) => {
          const p1 = nodes.find((n) => n.id === from);
          const p2 = nodes.find((n) => n.id === to);
          const isEdgeViolated = !isTreeA && to === "B-node-4" && verdict === "FAIL";
          const isEdgePassed =
            isTreeA &&
            validatedANodes.includes(from) &&
            validatedANodes.includes(to);

          let lineId = `edge-normal-${from}-${to}`;
          if (isEdgeViolated) lineId = `edge-broken-${from}-${to}`;
          else if (isEdgePassed) lineId = `edge-passed-${from}-${to}`;

          return (
            <line
              key={`edge-${from}-${to}`}
              id={lineId}
              x1={p1.cx}
              y1={p1.cy}
              x2={p2.cx}
              y2={p2.cy}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const isActive = activeNodeId === node.id;
          const isPassedInA = isTreeA && validatedANodes.includes(node.id);
          const isViolated = !isTreeA && node.id === "B-node-4" && verdict === "FAIL";

          let circleId = `node-idle-${node.id}`;
          if (isViolated) {
            circleId = `node-violation-${node.id}`;
          } else if (isActive) {
            circleId = `node-active-inspect-${node.id}`;
          } else if (isPassedInA) {
            circleId = `node-pass-${node.id}`;
          }

          return (
            <g key={`g-${node.id}`} id={`g-${node.id}`}>
              {isViolated && (
                <circle id={`halo-violation-${node.id}`} cx={node.cx} cy={node.cy} r="26" />
              )}
              {isPassedInA && (
                <circle id={`halo-valid-${node.id}`} cx={node.cx} cy={node.cy} r="25" />
              )}

              <circle id={circleId} cx={node.cx} cy={node.cy} r="20" />

              <text id={`text-val-${node.id}`} x={node.cx} y={node.cy + 1}>
                {node.val}
              </text>
              <text id={`text-bounds-${node.id}`} x={node.cx} y={node.cy + 28}>
                {isActive ? `(${activeBounds[0]}, ${activeBounds[1]})` : node.bounds}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div id="dual-bst-canvas">
      {/* Top Metrics Row */}
      <div id="metrics-bar">
        <span id="metric-inspecting">
          Active Node: <b>{activeNodeId ? activeNodeId : "None"}</b>
        </span>

        <span id="metric-bounds">
          Active Interval: <b>({activeBounds[0]}, {activeBounds[1]})</b>
        </span>

        <span
          id={
            verdict === "FAIL"
              ? "metric-verdict-fail"
              : verdict === "PASS"
              ? "metric-verdict-pass"
              : "metric-verdict-active"
          }
        >
          Verdict: <b>{verdict}</b>
        </span>
      </div>

      {/* Dual Tree Comparison Grid */}
      <div id="dual-stage">
        {/* Tree A: Valid BST */}
        <div id={treeACompleted ? "tree-card-valid-complete" : "tree-card-valid"}>
          <div id="header-valid">
            <span id="title-valid">Tree A: VALID BST</span>
            <span id={treeACompleted ? "badge-valid-status-done" : "badge-valid-status-active"}>
              {treeACompleted ? "ALL NODES VALIDATED ✓" : `CHECKING (${validatedANodes.length}/5)`}
            </span>
          </div>
          <div id="viewport-valid">{renderTreeSvg(true)}</div>
          <div id="footer-valid">
            <span id="footer-valid-note">
              {treeACompleted
                ? "Every node strictly lies within its inherited range"
                : "DFS traversing & verifying (min < val < max)"}
            </span>
          </div>
        </div>

        {/* Tree B: Invalid BST */}
        <div id="tree-card-invalid">
          <div id="header-invalid">
            <span id="title-invalid">Tree B: INVALID BST</span>
            <span id={verdict === "FAIL" ? "badge-invalid-status-fail" : "badge-invalid-status-pending"}>
              {verdict === "FAIL" ? "VIOLATION DETECTED ✗" : "INSPECTING BOUNDS"}
            </span>
          </div>
          <div id="viewport-invalid">{renderTreeSvg(false)}</div>
          <div id="footer-invalid">
            <span id="footer-invalid-note">
              {verdict === "FAIL" ? "Node 4 violates right bound: 4 ≤ 5" : "Verifying right child criteria"}
            </span>
          </div>
        </div>
      </div>

      {/* Equation / Logic Monitor */}
      <div id="calc-inspector-card">
        <div id="calc-card-header">
          <span id="calc-header-title">Boundary Validation Equation</span>
          <span id="calc-header-sub">Invariant: minVal &lt; node.val &lt; maxVal</span>
        </div>

        <div id="calc-grid">
          <div id="calc-box-target">
            <span id="calc-title-target">Testing Node:</span>
            <span id="calc-val-target">{activeNodeId || "None"}</span>
          </div>

          <div id="calc-box-formula">
            <span id="calc-title-formula">Mathematical Condition:</span>
            <span id="calc-val-formula">{comparisonExpr || "Awaiting step"}</span>
          </div>

          <div id="calc-box-result">
            <span id="calc-title-result">Evaluation Result:</span>
            <span id={verdict === "FAIL" ? "calc-val-fail" : "calc-val-pass"}>
              {verdict === "FAIL"
                ? "VIOLATION (RETURN FALSE)"
                : verdict === "PASS"
                ? "SATISFIED (CONTINUE)"
                : "INSPECTING"}
            </span>
          </div>
        </div>
      </div>

      {/* Result Callout Modal */}
      <AnimatePresence>
        {output && (
          <motion.div
            id={ "result-callout-box"}
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