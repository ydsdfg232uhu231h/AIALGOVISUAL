import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem226.css";

export default function Problem226({ stepData }) {
  const {
    // Current slot mapping: maps tree keys to their current position slot keys
    nodeSlots = {
      4: "root",
      2: "left",
      7: "right",
      6: "rightLeft",
      9: "rightRight"
    },
    activeSwapPair = [], // e.g., [6, 9] or [2, 7]
    swappedNodes = [],   // nodes that completed their swap
    isCompleted = false,
    output
  } = stepData || {};

  // Standard Cartesian coordinates for 5 slots in viewBox="0 0 440 240"
  const slotCoords = {
    root: { cx: 220, cy: 40 },
    // Level 1 slots
    left: { cx: 120, cy: 110 },
    right: { cx: 320, cy: 110 },
    // Level 2 slots under Left
    leftLeft: { cx: 70, cy: 185 },
    leftRight: { cx: 170, cy: 185 },
    // Level 2 slots under Right
    rightLeft: { cx: 270, cy: 185 },
    rightRight: { cx: 370, cy: 185 }
  };

  const treeNodes = [
    { val: 4, label: "Root" },
    { val: 2, label: "Node" },
    { val: 7, label: "Node" },
    { val: 6, label: "Leaf" },
    { val: 9, label: "Leaf" }
  ];

  // Dynamic edges derived from which slot currently holds which parent/child
  const getSlot = (val) => nodeSlots[val] || "root";

  // Determine structural lines based on current parent-child slot relationships
  const edges = [
    { p: 4, c: 2 },
    { p: 4, c: 7 },
    { p: 7, c: 6 },
    { p: 7, c: 9 }
  ];

  return (
    <div id="p226-invert-tree-canvas">
      {/* Top Metrics Row */}
      <div id="p226-metrics-bar">
        <span id="p226-metric-root">
          Root: <b>Node (4)</b>
        </span>

        <span id="p226-metric-swapping">
          Swapping Pair: <b>{activeSwapPair.length === 2 ? `[${activeSwapPair[0]} ⇄ ${activeSwapPair[1]}]` : "None"}</b>
        </span>

        <span id="p226-metric-swapped-count">
          Swapped: <b>{swappedNodes.length} / 4 nodes</b>
        </span>

        <span
          id="p226-metric-status"
          data-status={isCompleted ? "done" : activeSwapPair.length ? "swapping" : "active"}
        >
          Status: <b>{isCompleted ? "ALL SUBTREES INVERTED" : activeSwapPair.length ? "MIRRORING SUBTREES" : "POST-ORDER DFS"}</b>
        </span>
      </div>

      <div id="p226-invert-stage">
        {/* Main Tree Card */}
        <div id="p226-tree-card">
          <div id="p226-tree-card-header">
            <span id="p226-tree-header-title">Multi-Level Binary Tree Mirror Inversion</span>
            <span id="p226-tree-header-sub">Right child (7) contains children (6, 9)</span>
          </div>

          <div id="p226-tree-viewport">
            <svg id="p226-tree-svg-surface" viewBox="0 0 440 240">
              {/* Central Mirror Axis */}
              <line id="p226-mirror-axis" x1="220" y1="15" x2="220" y2="225" />
              <text id="p226-mirror-label" x="225" y="225">MIRROR AXIS</text>

              {/* Dynamic Connecting Edges */}
              {edges.map(({ p, c }) => {
                const parentSlot = slotCoords[getSlot(p)];
                const childSlot = slotCoords[getSlot(c)];
                const isEdgeDone = isCompleted || (swappedNodes.includes(p) && swappedNodes.includes(c));

                return (
                  <line
                    key={`p226-edge-${p}-${c}`}
                    id={`p226-edge-${p}-${c}`}
                    data-edge-state={isEdgeDone ? "done" : "normal"}
                    x1={parentSlot.cx}
                    y1={parentSlot.cy}
                    x2={childSlot.cx}
                    y2={childSlot.cy}
                  />
                );
              })}

              {/* Animated Floating Nodes */}
              {treeNodes.map(({ val, label }) => {
                const currentSlotKey = getSlot(val);
                const pos = slotCoords[currentSlotKey];
                const isSwapping = activeSwapPair.includes(val);
                const isSwapped = isCompleted || swappedNodes.includes(val);

                let nodeState = "idle";
                if (isCompleted || isSwapped) nodeState = "complete";
                else if (isSwapping) nodeState = "swap";

                return (
                  <motion.g
                    key={`p226-g-node-${val}`}
                    id={`p226-g-node-${val}`}
                    animate={{ x: pos.cx, y: pos.cy }}
                    transition={{ type: "spring", stiffness: 280, damping: 24 }}
                  >
                    {isCompleted && (
                      <circle id={`p226-halo-complete-${val}`} cx={0} cy={0} r="28" />
                    )}
                    {isSwapping && (
                      <circle id={`p226-halo-swap-${val}`} cx={0} cy={0} r="26" />
                    )}

                    <circle
                      id={`p226-node-circle-${val}`}
                      data-node-state={nodeState}
                      cx={0}
                      cy={0}
                      r="21"
                    />

                    <text
                      id={`p226-text-val-${val}`}
                      data-node-state={nodeState}
                      x={0}
                      y={1}
                    >
                      {val}
                    </text>
                    <text
                      id={`p226-text-sub-${val}`}
                      data-node-state={nodeState}
                      x={0}
                      y={30}
                    >
                      {label}
                    </text>
                  </motion.g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Tree State Inspection Card */}
        <div id="p226-swap-tracker-card">
          <div id="p226-swap-card-header">
            <span id="p226-swap-header-title">Subtree Swap Order</span>
            <span id="p226-swap-header-sub">Bottom-up: leaves swap first, then parent branches</span>
          </div>

          <div id="p226-swap-grid">
            <div id="p226-swap-box-subright">
              <span id="p226-swap-title-subright">1. Right Subtree (7's Children):</span>
              <span
                id="p226-swap-val-subright"
                data-val-state={swappedNodes.includes(6) ? "done" : "pending"}
              >
                {swappedNodes.includes(6) ? "Leaves Swapped: [9, 6] ✓" : "Original: left=6, right=9"}
              </span>
            </div>

            <div id="p226-swap-box-main">
              <span id="p226-swap-title-main">2. Root (4's Children):</span>
              <span
                id="p226-swap-val-main"
                data-val-state={swappedNodes.includes(7) ? "done" : "pending"}
              >
                {swappedNodes.includes(7) ? "Branches Swapped: left=[7...], right=[2] ✓" : "Original: left=2, right=7"}
              </span>
            </div>

            <div id="p226-swap-box-verdict">
              <span id="p226-swap-title-verdict">Overall Inversion:</span>
              <span
                id="p226-swap-val-verdict"
                data-val-state={isCompleted ? "done" : "pending"}
              >
                {isCompleted ? "MIRROR COMPLETE ✓" : "SWAPPING IN PROGRESS"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Result Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p226-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div id="p226-callout-header-text">{output.label}</div>
            <div id="p226-callout-val-text">{output.value}</div>
            <div id="p226-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}