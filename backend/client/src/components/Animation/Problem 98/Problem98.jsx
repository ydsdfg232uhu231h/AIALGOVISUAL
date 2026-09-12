import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem98.css";

export default function Problem98({ stepData }) {
  const {
    activeNodeId = null, // e.g., "A-node-4" or "B-node-4"
    activeBounds = ["-INF", "+INF"],
    comparisonExpr = null,
    verdict = "INSPECTING",
    validatedANodes = [], // Dynamically tracks which nodes in A passed
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
      <svg id={`p98-svg-surface-${treeKey}`} viewBox="0 0 300 230">
        {/* Edges */}
        {edges.map(({ from, to }) => {
          const p1 = nodes.find((n) => n.id === from);
          const p2 = nodes.find((n) => n.id === to);
          const isEdgeViolated = !isTreeA && to === "B-node-4" && verdict === "FAIL";
          const isEdgePassed =
            isTreeA &&
            validatedANodes.includes(from) &&
            validatedANodes.includes(to);

          let edgeState = "normal";
          if (isEdgeViolated) edgeState = "broken";
          else if (isEdgePassed) edgeState = "passed";

          return (
            <line
              key={`p98-edge-${from}-${to}`}
              id={`p98-edge-${from}-${to}`}
              data-edge-state={edgeState}
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

          let nodeState = "idle";
          if (isViolated) nodeState = "violation";
          else if (isActive) nodeState = "active";
          else if (isPassedInA) nodeState = "pass";

          return (
            <g key={`p98-g-${node.id}`} id={`p98-g-${node.id}`}>
              {isViolated && (
                <circle
                  id={`p98-halo-violation-${node.id}`}
                  cx={node.cx}
                  cy={node.cy}
                  r="26"
                />
              )}
              {isPassedInA && (
                <circle
                  id={`p98-halo-valid-${node.id}`}
                  cx={node.cx}
                  cy={node.cy}
                  r="25"
                />
              )}

              <circle
                id={`p98-node-${node.id}`}
                data-state={nodeState}
                cx={node.cx}
                cy={node.cy}
                r="20"
              />

              <text id={`p98-text-val-${node.id}`} x={node.cx} y={node.cy + 1}>
                {node.val}
              </text>
              <text id={`p98-text-bounds-${node.id}`} x={node.cx} y={node.cy + 28}>
                {isActive ? `(${activeBounds[0]}, ${activeBounds[1]})` : node.bounds}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div id="p98-dual-bst-canvas">
      {/* Top Metrics Row */}
      <div id="p98-metrics-bar">
        <span id="p98-metric-inspecting">
          Active Node: <b>{activeNodeId ? activeNodeId : "None"}</b>
        </span>

        <span id="p98-metric-bounds">
          Active Interval: <b>({activeBounds[0]}, {activeBounds[1]})</b>
        </span>

        <span id="p98-metric-verdict" data-verdict={verdict}>
          Verdict: <b>{verdict}</b>
        </span>
      </div>

      {/* Dual Tree Comparison Grid */}
      <div id="p98-dual-stage">
        {/* Tree A: Valid BST */}
        <div id="p98-tree-card-valid" data-complete={treeACompleted ? "true" : "false"}>
          <div id="p98-header-valid">
            <span id="p98-title-valid">Tree A: VALID BST</span>
            <span id="p98-badge-valid-status" data-complete={treeACompleted ? "true" : "false"}>
              {treeACompleted ? "ALL NODES VALIDATED ✓" : `CHECKING (${validatedANodes.length}/5)`}
            </span>
          </div>
          <div id="p98-viewport-valid">{renderTreeSvg(true)}</div>
          <div id="p98-footer-valid">
            <span id="p98-footer-valid-note">
              {treeACompleted
                ? "Every node strictly lies within its inherited range"
                : "DFS traversing & verifying (min < val < max)"}
            </span>
          </div>
        </div>

        {/* Tree B: Invalid BST */}
        <div id="p98-tree-card-invalid">
          <div id="p98-header-invalid">
            <span id="p98-title-invalid">Tree B: INVALID BST</span>
            <span id="p98-badge-invalid-status" data-verdict={verdict}>
              {verdict === "FAIL" ? "VIOLATION DETECTED ✗" : "INSPECTING BOUNDS"}
            </span>
          </div>
          <div id="p98-viewport-invalid">{renderTreeSvg(false)}</div>
          <div id="p98-footer-invalid">
            <span id="p98-footer-invalid-note">
              {verdict === "FAIL" ? "Node 4 violates right bound: 4 ≤ 5" : "Verifying right child criteria"}
            </span>
          </div>
        </div>
      </div>

      {/* Equation / Logic Monitor */}
      <div id="p98-calc-inspector-card">
        <div id="p98-calc-card-header">
          <span id="p98-calc-header-title">Boundary Validation Equation</span>
          <span id="p98-calc-header-sub">Invariant: minVal &lt; node.val &lt; maxVal</span>
        </div>

        <div id="p98-calc-grid">
          <div id="p98-calc-box-target">
            <span id="p98-calc-title-target">Testing Node:</span>
            <span id="p98-calc-val-target">{activeNodeId || "None"}</span>
          </div>

          <div id="p98-calc-box-formula">
            <span id="p98-calc-title-formula">Mathematical Condition:</span>
            <span id="p98-calc-val-formula">{comparisonExpr || "Awaiting step"}</span>
          </div>

          <div id="p98-calc-box-result">
            <span id="p98-calc-title-result">Evaluation Result:</span>
            <span id="p98-calc-val-result" data-verdict={verdict}>
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
            id="p98-result-callout-box"
            data-verdict={verdict}
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div id="p98-callout-header-text">{output.label}</div>
            <div id="p98-callout-val-text">{output.value}</div>
            <div id="p98-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}