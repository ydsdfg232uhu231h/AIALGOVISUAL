import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem133.css";

export default function Problem133({ stepData }) {
  const {
    currentVisit = null,
    clonedNodes = [],
    visitedMap = {},
    activeEdges = [],
    clonedEdges = [],
    state = {},
    output
  } = stepData || {};

  // Strict 300x240 Cartesian center coordinates
  const nodeCoords = {
    1: { cx: 150, cy: 45 },
    2: { cx: 235, cy: 120 },
    3: { cx: 150, cy: 195 },
    4: { cx: 65, cy: 120 }
  };

  const graphEdges = [
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 1]
  ];

  const allNodeIds = [1, 2, 3, 4];
  const isCompleted = state.status === "COMPLETED";

  const renderGraphSvg = (isClonedGraph) => {
    return (
      <svg id={isClonedGraph ? "cloned-svg-surface" : "orig-svg-surface"} viewBox="0 0 300 240">
        {/* Render Edges */}
        {graphEdges.map(([u, v]) => {
          const p1 = nodeCoords[u];
          const p2 = nodeCoords[v];

          const isTraversing =
            !isClonedGraph &&
            activeEdges.some(([a, b]) => (a === u && b === v) || (a === v && b === u));

          const isEdgeBuilt =
            isClonedGraph &&
            clonedEdges.some(([a, b]) => (a === u && b === v) || (a === v && b === u));

          let edgeId = `orig-edge-${u}-${v}`;
          if (isClonedGraph) {
            edgeId = isEdgeBuilt ? `cloned-edge-solid-${u}-${v}` : `cloned-edge-ghost-${u}-${v}`;
          } else if (isTraversing) {
            edgeId = `orig-edge-active-${u}-${v}`;
          }

          return (
            <line
              key={`edge-${isClonedGraph ? "c" : "o"}-${u}-${v}`}
              id={edgeId}
              x1={p1.cx}
              y1={p1.cy}
              x2={p2.cx}
              y2={p2.cy}
            />
          );
        })}

        {/* Render Nodes */}
        {allNodeIds.map((val) => {
          const pos = nodeCoords[val];
          const isCurrent = currentVisit === val;
          const isCloned = clonedNodes.includes(val);

          if (!isClonedGraph) {
            const nodeId = isCurrent
              ? `orig-node-active-${val}`
              : isCloned
              ? `orig-node-visited-${val}`
              : `orig-node-idle-${val}`;

            return (
              <g key={`orig-group-${val}`} id={`orig-g-${val}`}>
                <circle id={nodeId} cx={pos.cx} cy={pos.cy} r="25" />
                <text id={`orig-text-val-${val}`} x={pos.cx} y={pos.cy - 1}>
                  {val}
                </text>
                <text id={`orig-text-sub-${val}`} x={pos.cx} y={pos.cy + 13}>
                  @orig_{val}
                </text>
              </g>
            );
          }

          // Cloned side
          if (!isCloned) {
            return (
              <g key={`clone-ghost-group-${val}`} id={`clone-ghost-${val}`}>
                <circle id={`ghost-circle-${val}`} cx={pos.cx} cy={pos.cy} r="25" />
                <text id={`ghost-text-${val}`} x={pos.cx} y={pos.cy + 5}>
                  {val}
                </text>
              </g>
            );
          }

          const cloneNodeId = isCurrent
            ? `cloned-node-active-${val}`
            : isCompleted
            ? `cloned-node-done-${val}`
            : `cloned-node-created-${val}`;

          return (
            <g key={`clone-solid-group-${val}`} id={`clone-g-${val}`}>
              {isCompleted && (
                <circle id={`clone-halo-${val}`} cx={pos.cx} cy={pos.cy} r="30" />
              )}
              <circle id={cloneNodeId} cx={pos.cx} cy={pos.cy} r="25" />
              <text id={`cloned-text-val-${val}`} x={pos.cx} y={pos.cy - 1}>
                {val}'
              </text>
              <text id={`cloned-text-sub-${val}`} x={pos.cx} y={pos.cy + 13}>
                @clone_{val}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div id="clone-graph-canvas">
      {/* Metrics Row */}
      <div id="metrics-bar">
        <span id="metric-current">
          DFS Pointer: <b>{currentVisit ? `Node (${currentVisit})` : "Idle"}</b>
        </span>

        <span id="metric-cloned-count">
          Cloned Nodes: <b>{clonedNodes.length} / 4</b>
        </span>

        <span id="metric-visited-count">
          Map Entries: <b>{Object.keys(visitedMap).length}</b>
        </span>

        <span id={isCompleted ? "metric-status-done" : "metric-status-active"}>
          Status: <b>{isCompleted ? "DEEP COPY FINISHED" : "RECURSIVE DFS"}</b>
        </span>
      </div>

      {/* Symmetrical Dual Graph Stage */}
      <div id="graphs-stage">
        {/* Left: Original Graph */}
        <div id="orig-graph-card">
          <div id="orig-card-header">
            <span id="orig-header-title">1. Original Graph</span>
            <span id="orig-header-sub">Adjacency: 1-[2,4], 2-[1,3], 3-[2,4], 4-[1,3]</span>
          </div>
          <div id="orig-graph-viewport">{renderGraphSvg(false)}</div>
        </div>

        {/* Right: Cloned Graph */}
        <div id="cloned-graph-card">
          <div id="cloned-card-header">
            <span id="cloned-header-title">2. Cloned Deep Copy</span>
            <span id="cloned-header-sub">New memory allocations and cloned pointers</span>
          </div>
          <div id="cloned-graph-viewport">{renderGraphSvg(true)}</div>
        </div>
      </div>

      {/* Visited Hash Map Lookups */}
      <div id="map-track-card">
        <div id="map-card-header">
          <span id="map-header-title">Visited Clone Hash Map (`visited[orig_node] ➔ copy_node`)</span>
          <span id="map-header-sub">Prevents infinite cycles on undirected edges</span>
        </div>

        <div id="clone-map-grid">
          {Object.keys(visitedMap).length === 0 ? (
            <span id="map-empty-text">Map is empty: no nodes cloned yet</span>
          ) : (
            Object.entries(visitedMap).map(([orig, copy]) => (
              <div key={`map-entry-${orig}`} id={`map-pill-${orig}`}>
                <span id={`map-token-orig-${orig}`}>Orig({orig}) [@orig_{orig}]</span>
                <span id={`map-arrow-${orig}`}>➔</span>
                <span id={`map-token-copy-${orig}`}>Copy({copy}) [@clone_{copy}]</span>
              </div>
            ))
          )}
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