import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem297.css";

const NODE_RADIUS = 22;

const TREE_NODES = {
  1: { id: 1, val: "1", x: 240, y: 48 },
  2: { id: 2, val: "2", x: 120, y: 130 },
  3: { id: 3, val: "3", x: 360, y: 130 },
  4: { id: 4, val: "4", x: 295, y: 212 },
  5: { id: 5, val: "5", x: 425, y: 212 }
};

const NULL_SLOTS = {
  "2-L": { id: "2-L", parent: 2, x: 75, y: 200 },
  "2-R": { id: "2-R", parent: 2, x: 165, y: 200 },
  "4-L": { id: "4-L", parent: 4, x: 260, y: 275 },
  "4-R": { id: "4-R", parent: 4, x: 330, y: 275 },
  "5-L": { id: "5-L", parent: 5, x: 390, y: 275 },
  "5-R": { id: "5-R", parent: 5, x: 460, y: 275 }
};

const TREE_EDGES = [
  { from: 1, to: 2 },
  { from: 1, to: 3 },
  { from: 3, to: 4 },
  { from: 3, to: 5 }
];

// Computes perimeter touch-points so lines start/end strictly on circle borders
function getEdgeCoords(src, dst, r = NODE_RADIUS) {
  const dx = dst.x - src.x;
  const dy = dst.y - src.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist === 0) return { x1: src.x, y1: src.y, x2: dst.x, y2: dst.y };
  return {
    x1: src.x + (dx / dist) * r,
    y1: src.y + (dy / dist) * r,
    x2: dst.x - (dx / dist) * r,
    y2: dst.y - (dy / dist) * r
  };
}

export default function Problem297({ stepData }) {
  const {
    serializedTokens = [],
    activeTokenIdx = null,
    treeNode = null,
    activeNullSlot = null,
    restoredNodes = [],
    restoredEdges = [],
    state = {},
    output
  } = stepData || {};

  const phase = state.phase || (output ? "Completed" : "Serialize");
  const isDeserializing = phase === "Deserialize" || phase === "Completed";

  return (
    <div className="canvas-wrapper tree-ser-canvas">
      {/* Top Metrics Row */}
      <div className="metrics-row">
        <span className={`metric-chip phase-chip ${phase.toLowerCase()}-phase`}>
          Phase: <b>{phase.toUpperCase()}</b>
        </span>
        <span className="metric-chip token-count-chip">
          Stream: <b>{serializedTokens.length} Tokens</b>
        </span>
        <span className="metric-chip active-chip">
          Pointer:{" "}
          <b>
            {treeNode !== null
              ? `Node (${treeNode})`
              : activeNullSlot
              ? `Null (${activeNullSlot})`
              : activeTokenIdx !== null
              ? `Token[${activeTokenIdx}]`
              : "Idle"}
          </b>
        </span>
      </div>

      <div className="tree-ser-stage">
        {/* Main Tree Visual Canvas */}
        <div className="tree-card">
          <div className="card-header-bar">
            <span>
              {isDeserializing
                ? "Deserializing Stream In-Place"
                : "DFS Preorder Serialization"}
            </span>
            <span className={`tree-mode-pill ${isDeserializing ? "pill-deser" : "pill-ser"}`}>
              {isDeserializing ? "DESERIALIZE (REBUILD)" : "SERIALIZE (TRAVERSE)"}
            </span>
          </div>

          <svg viewBox="0 0 500 310" className="tree-svg">
            {/* LAYER 1: Background Branch Edges (renders behind circles) */}
            <g className="edges-layer">
              {TREE_EDGES.map((edge, idx) => {
                const src = TREE_NODES[edge.from];
                const dst = TREE_NODES[edge.to];
                const coords = getEdgeCoords(src, dst, NODE_RADIUS);
                const edgeKey = `${edge.from}-${edge.to}`;
                const isRestored = restoredEdges.includes(edgeKey);
                const isTraversing =
                  !isDeserializing &&
                  (treeNode === edge.to || (edge.from === 3 && (treeNode === 4 || treeNode === 5)));

                return (
                  <line
                    key={`edge-${idx}`}
                    x1={coords.x1}
                    y1={coords.y1}
                    x2={coords.x2}
                    y2={coords.y2}
                    className={`tree-edge ${
                      isRestored
                        ? "edge-restored"
                        : isTraversing
                        ? "edge-active"
                        : isDeserializing
                        ? "edge-ghost"
                        : "edge-idle"
                    }`}
                  />
                );
              })}

              {/* Null Leaf Connecting Lines */}
              {Object.values(NULL_SLOTS).map((leaf) => {
                const parent = TREE_NODES[leaf.parent];
                const coords = getEdgeCoords(parent, leaf, NODE_RADIUS);
                const isChecked = activeNullSlot === leaf.id;

                return (
                  <line
                    key={`null-edge-${leaf.id}`}
                    x1={coords.x1}
                    y1={coords.y1}
                    x2={leaf.x}
                    y2={leaf.y}
                    className={`null-edge ${isChecked ? "null-edge-active" : ""}`}
                  />
                );
              })}
            </g>

            {/* LAYER 2: Null Leaf Markers */}
            <g className="null-markers-layer">
              {Object.values(NULL_SLOTS).map((leaf) => {
                const isChecked = activeNullSlot === leaf.id;

                return (
                  <g key={`null-leaf-${leaf.id}`}>
                    <circle
                      cx={leaf.x}
                      cy={leaf.y}
                      r={isChecked ? 11 : 7}
                      className={`null-dot ${isChecked ? "null-dot-active" : ""}`}
                    />
                    <text x={leaf.x} y={leaf.y + 3.5} className="null-text" textAnchor="middle">
                      N
                    </text>
                  </g>
                );
              })}
            </g>

            {/* LAYER 3: Tree Nodes (rendered cleanly on top) */}
            <g className="nodes-layer">
              {Object.values(TREE_NODES).map((node) => {
                const isInspecting = treeNode === node.id;
                const isRestored = isDeserializing && restoredNodes.includes(node.id);
                const isGhost = isDeserializing && !isRestored;

                return (
                  <g key={`node-${node.id}`}>
                    <motion.circle
                      cx={node.x}
                      cy={node.y}
                      r={NODE_RADIUS}
                      className={`node-circle ${
                        isRestored
                          ? "node-restored"
                          : isInspecting
                          ? "node-inspecting"
                          : isGhost
                          ? "node-ghost"
                          : "node-idle"
                      }`}
                      animate={{
                        scale: isInspecting || (isRestored && treeNode === node.id) ? 1.15 : 1
                      }}
                      transition={{ type: "spring", stiffness: 360, damping: 20 }}
                    />
                    <text
                      x={node.x}
                      y={node.y + 6}
                      className={`node-label ${isGhost ? "label-ghost" : ""}`}
                      textAnchor="middle"
                    >
                      {isGhost ? "?" : node.val}
                    </text>
                   {/* Replace the badge inside Layer 3 of Problem297.jsx */}
{isInspecting && (
  <g className="node-badge-group">
    <rect
      x={node.x - 28}
      y={node.y - 44}
      width={56}
      height={18}
      rx={4}
      fill="#09090b"
      stroke={isDeserializing ? "#22c55e" : "#38bdf8"}
      strokeWidth={1}
    />
    <text
      x={node.x}
      y={node.y - 31}
      className={`node-badge ${isDeserializing ? "badge-deser" : "badge-ser"}`}
      textAnchor="middle"
    >
      {isDeserializing ? "REBUILT" : "VISIT"}
    </text>
  </g>
)}
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Token Buffer Card */}
        <div className="tokens-stream-card">
          <div className="stream-header-row">
            <span className="stream-title">
              {isDeserializing ? "Deserializer Cursor (Index i)" : "Preorder Output Buffer"}
            </span>
            <span className="stream-sub">
              {isDeserializing ? "Parsing Stream to Nodes" : "N = Null Pointer"}
            </span>
          </div>

          <div className="tokens-track">
            {serializedTokens.length === 0 ? (
              <span className="empty-stream-text">Buffer Empty — Awaiting DFS...</span>
            ) : (
              serializedTokens.map((tok, idx) => {
                const isNull = tok === "N";
                const isCurrentToken = activeTokenIdx === idx;
                const isConsumed = isDeserializing && activeTokenIdx !== null && idx <= activeTokenIdx;

                return (
                  <motion.div
                    key={`tok-${idx}-${tok}`}
                    className={`token-cell ${isNull ? "token-null" : "token-val"} ${
                      isCurrentToken ? "token-focused" : isConsumed ? "token-consumed" : ""
                    }`}
                    animate={{ scale: isCurrentToken ? 1.14 : 1 }}
                  >
                    <span className="tok-val">{tok}</span>
                    <span className="tok-idx">i={idx}</span>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Result Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="result-callout"
          >
            <div className="callout-header">{output.label}</div>
            <div className="callout-val">{output.value}</div>
            <div className="callout-detail">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}