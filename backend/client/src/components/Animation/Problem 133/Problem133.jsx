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
      <svg
        id={isClonedGraph ? "p133-cloned-svg-surface" : "p133-orig-svg-surface"}
        viewBox="0 0 300 240"
      >
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

          let edgeState = "normal";
          if (isClonedGraph) {
            edgeState = isEdgeBuilt ? "solid" : "ghost";
          } else if (isTraversing) {
            edgeState = "active";
          }

          return (
            <line
              key={`p133-edge-${isClonedGraph ? "c" : "o"}-${u}-${v}`}
              id={isClonedGraph ? `p133-clone-edge-${u}-${v}` : `p133-orig-edge-${u}-${v}`}
              data-edge-state={edgeState}
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
            let origNodeState = "idle";
            if (isCurrent) origNodeState = "active";
            else if (isCloned) origNodeState = "visited";

            return (
              <g key={`p133-orig-group-${val}`} id={`p133-orig-g-${val}`}>
                <circle
                  id={`p133-orig-node-${val}`}
                  data-node-state={origNodeState}
                  cx={pos.cx}
                  cy={pos.cy}
                  r="25"
                />
                <text id={`p133-orig-text-val-${val}`} x={pos.cx} y={pos.cy - 1}>
                  {val}
                </text>
                <text id={`p133-orig-text-sub-${val}`} x={pos.cx} y={pos.cy + 13}>
                  @orig_{val}
                </text>
              </g>
            );
          }

          // Cloned side
          if (!isCloned) {
            return (
              <g key={`p133-clone-ghost-group-${val}`} id={`p133-clone-ghost-${val}`}>
                <circle
                  id={`p133-ghost-circle-${val}`}
                  data-node-state="ghost"
                  cx={pos.cx}
                  cy={pos.cy}
                  r="25"
                />
                <text id={`p133-ghost-text-${val}`} x={pos.cx} y={pos.cy + 5}>
                  {val}
                </text>
              </g>
            );
          }

          let cloneNodeState = "created";
          if (isCurrent) cloneNodeState = "active";
          else if (isCompleted) cloneNodeState = "done";

          return (
            <g key={`p133-clone-solid-group-${val}`} id={`p133-clone-g-${val}`}>
              <AnimatePresence mode="popLayout">
                {isCompleted && (
                  <circle
                    key={`p133-clone-halo-${val}`}
                    id={`p133-clone-halo-${val}`}
                    cx={pos.cx}
                    cy={pos.cy}
                    r="30"
                  />
                )}
              </AnimatePresence>
              <circle
                id={`p133-clone-node-${val}`}
                data-node-state={cloneNodeState}
                cx={pos.cx}
                cy={pos.cy}
                r="25"
              />
              <text id={`p133-cloned-text-val-${val}`} x={pos.cx} y={pos.cy - 1}>
                {val}'
              </text>
              <text id={`p133-cloned-text-sub-${val}`} x={pos.cx} y={pos.cy + 13}>
                @clone_{val}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div id="p133-clone-graph-canvas">
      {/* Metrics Row */}
      <div id="p133-metrics-bar">
        <span id="p133-metric-current">
          DFS Pointer: <b>{currentVisit ? `Node (${currentVisit})` : "Idle"}</b>
        </span>

        <span id="p133-metric-cloned-count">
          Cloned Nodes: <b>{clonedNodes.length} / 4</b>
        </span>

        <span id="p133-metric-visited-count">
          Map Entries: <b>{Object.keys(visitedMap).length}</b>
        </span>

        <span
          id="p133-metric-status"
          data-status={isCompleted ? "done" : "active"}
        >
          Status: <b>{isCompleted ? "DEEP COPY FINISHED" : "RECURSIVE DFS"}</b>
        </span>
      </div>

      {/* Symmetrical Dual Graph Stage */}
      <div id="p133-graphs-stage">
        {/* Left: Original Graph */}
        <div id="p133-orig-graph-card">
          <div id="p133-orig-card-header">
            <span id="p133-orig-header-title">1. Original Graph</span>
            <span id="p133-orig-header-sub">Adjacency: 1-[2,4], 2-[1,3], 3-[2,4], 4-[1,3]</span>
          </div>
          <div id="p133-orig-graph-viewport">{renderGraphSvg(false)}</div>
        </div>

        {/* Right: Cloned Graph */}
        <div id="p133-cloned-graph-card">
          <div id="p133-cloned-card-header">
            <span id="p133-cloned-header-title">2. Cloned Deep Copy</span>
            <span id="p133-cloned-header-sub">New memory allocations and cloned pointers</span>
          </div>
          <div id="p133-cloned-graph-viewport">{renderGraphSvg(true)}</div>
        </div>
      </div>

      {/* Visited Hash Map Lookups */}
      <div id="p133-map-track-card">
        <div id="p133-map-card-header">
          <span id="p133-map-header-title">Visited Clone Hash Map (`visited[orig_node] ➔ copy_node`)</span>
          <span id="p133-map-header-sub">Prevents infinite cycles on undirected edges</span>
        </div>

        <div id="p133-clone-map-grid">
          {Object.keys(visitedMap).length === 0 ? (
            <span id="p133-map-empty-text">Map is empty: no nodes cloned yet</span>
          ) : (
            Object.entries(visitedMap).map(([orig, copy]) => (
              <motion.div
                key={`p133-map-entry-${orig}`}
                id={`p133-map-pill-${orig}`}
                layout
                initial={{ opacity: 0, scale: 0.85, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <span id={`p133-map-token-orig-${orig}`}>Orig({orig}) [@orig_{orig}]</span>
                <span id={`p133-map-arrow-${orig}`}>➔</span>
                <span id={`p133-map-token-copy-${orig}`}>Copy({copy}) [@clone_{copy}]</span>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Result Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p133-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div id="p133-callout-header-text">{output.label}</div>
            <div id="p133-callout-val-text">{output.value}</div>
            <div id="p133-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}