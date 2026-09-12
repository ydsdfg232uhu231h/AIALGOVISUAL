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
    <div id="p297-tree-ser-canvas">
      {/* Top Metrics Row */}
      <div id="p297-metrics-bar">
        <span id="p297-metric-phase" data-phase={phase.toLowerCase()}>
          Phase: <b>{phase.toUpperCase()}</b>
        </span>
        <span id="p297-metric-stream">
          Stream: <b>{serializedTokens.length} Tokens</b>
        </span>
        <span id="p297-metric-pointer">
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

      <div id="p297-tree-ser-stage">
        {/* Main Tree Visual Canvas */}
        <div id="p297-tree-card">
          <div id="p297-tree-card-header">
            <span id="p297-tree-header-title">
              {isDeserializing
                ? "Deserializing Stream In-Place"
                : "DFS Preorder Serialization"}
            </span>
            <span
              id="p297-tree-mode-pill"
              data-phase={isDeserializing ? "deserialize" : "serialize"}
            >
              {isDeserializing ? "DESERIALIZE (REBUILD)" : "SERIALIZE (TRAVERSE)"}
            </span>
          </div>

          <svg id="p297-tree-svg" viewBox="0 0 500 310">
            {/* LAYER 1: Background Branch Edges */}
            <g id="p297-edges-layer">
              {TREE_EDGES.map((edge, idx) => {
                const src = TREE_NODES[edge.from];
                const dst = TREE_NODES[edge.to];
                const coords = getEdgeCoords(src, dst, NODE_RADIUS);
                const edgeKey = `${edge.from}-${edge.to}`;
                const isRestored = restoredEdges.includes(edgeKey);
                const isTraversing =
                  !isDeserializing &&
                  (treeNode === edge.to || (edge.from === 3 && (treeNode === 4 || treeNode === 5)));

                let edgeState = "idle";
                if (isRestored) edgeState = "restored";
                else if (isTraversing) edgeState = "active";
                else if (isDeserializing) edgeState = "ghost";

                return (
                  <line
                    key={`p297-edge-${idx}`}
                    id={`p297-edge-${edge.from}-${edge.to}`}
                    data-edge-state={edgeState}
                    x1={coords.x1}
                    y1={coords.y1}
                    x2={coords.x2}
                    y2={coords.y2}
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
                    key={`p297-null-edge-${leaf.id}`}
                    id={`p297-null-edge-${leaf.id}`}
                    data-null-active={isChecked ? "true" : "false"}
                    x1={coords.x1}
                    y1={coords.y1}
                    x2={leaf.x}
                    y2={leaf.y}
                  />
                );
              })}
            </g>

            {/* LAYER 2: Null Leaf Markers */}
            <g id="p297-null-markers-layer">
              {Object.values(NULL_SLOTS).map((leaf) => {
                const isChecked = activeNullSlot === leaf.id;

                return (
                  <g key={`p297-null-leaf-${leaf.id}`} id={`p297-null-leaf-g-${leaf.id}`}>
                    <circle
                      id={`p297-null-dot-${leaf.id}`}
                      data-null-active={isChecked ? "true" : "false"}
                      cx={leaf.x}
                      cy={leaf.y}
                      r={isChecked ? 11 : 7}
                    />
                    <text
                      id={`p297-null-text-${leaf.id}`}
                      x={leaf.x}
                      y={leaf.y + 3.5}
                      textAnchor="middle"
                    >
                      N
                    </text>
                  </g>
                );
              })}
            </g>

            {/* LAYER 3: Tree Nodes */}
            <g id="p297-nodes-layer">
              {Object.values(TREE_NODES).map((node) => {
                const isInspecting = treeNode === node.id;
                const isRestored = isDeserializing && restoredNodes.includes(node.id);
                const isGhost = isDeserializing && !isRestored;

                let nodeState = "idle";
                if (isRestored) nodeState = "restored";
                else if (isInspecting) nodeState = "inspecting";
                else if (isGhost) nodeState = "ghost";

                return (
                  <g key={`p297-node-g-${node.id}`} id={`p297-node-g-${node.id}`}>
                    <motion.circle
                      id={`p297-node-circle-${node.id}`}
                      data-node-state={nodeState}
                      cx={node.x}
                      cy={node.y}
                      r={NODE_RADIUS}
                      layout
                      animate={{
                        scale: isInspecting || (isRestored && treeNode === node.id) ? 1.15 : 1
                      }}
                      transition={{ type: "spring", stiffness: 360, damping: 20 }}
                    />
                    <text
                      id={`p297-node-label-${node.id}`}
                      data-node-state={nodeState}
                      x={node.x}
                      y={node.y + 6}
                      textAnchor="middle"
                    >
                      {isGhost ? "?" : node.val}
                    </text>

                    {isInspecting && (
                      <g id={`p297-badge-group-${node.id}`}>
                        <rect
                          id={`p297-badge-rect-${node.id}`}
                          data-phase={isDeserializing ? "deserialize" : "serialize"}
                          x={node.x - 28}
                          y={node.y - 44}
                          width={56}
                          height={18}
                          rx={4}
                        />
                        <text
                          id={`p297-badge-text-${node.id}`}
                          data-phase={isDeserializing ? "deserialize" : "serialize"}
                          x={node.x}
                          y={node.y - 31}
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
        <div id="p297-tokens-stream-card">
          <div id="p297-stream-header-row">
            <span id="p297-stream-title">
              {isDeserializing ? "Deserializer Cursor (Index i)" : "Preorder Output Buffer"}
            </span>
            <span id="p297-stream-sub">
              {isDeserializing ? "Parsing Stream to Nodes" : "N = Null Pointer"}
            </span>
          </div>

          <div id="p297-tokens-track">
            {serializedTokens.length === 0 ? (
              <span id="p297-empty-stream-text">Buffer Empty — Awaiting DFS...</span>
            ) : (
              serializedTokens.map((tok, idx) => {
                const isNull = tok === "N";
                const isCurrentToken = activeTokenIdx === idx;
                const isConsumed = isDeserializing && activeTokenIdx !== null && idx <= activeTokenIdx;

                let tokenState = "normal";
                if (isCurrentToken) tokenState = "focused";
                else if (isConsumed) tokenState = "consumed";

                return (
                  <motion.div
                    key={`p297-tok-${idx}-${tok}`}
                    id={`p297-token-cell-${idx}`}
                    data-token-type={isNull ? "null" : "val"}
                    data-token-state={tokenState}
                    layout
                    animate={{ scale: isCurrentToken ? 1.14 : 1 }}
                    transition={{ type: "spring", stiffness: 350, damping: 20 }}
                  >
                    <span id={`p297-tok-val-${idx}`}>{tok}</span>
                    <span id={`p297-tok-idx-${idx}`}>i={idx}</span>
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
            id="p297-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div id="p297-callout-header-text">{output.label}</div>
            <div id="p297-callout-val-text">{output.value}</div>
            <div id="p297-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}