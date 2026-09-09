import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem141.css";

export default function Problem141({ stepData }) {
  const {
    nodes = [
      { id: "node-0", val: 3 },
      { id: "node-1", val: 2 },
      { id: "node-2", val: 0 },
      { id: "node-3", val: -4 }
    ],
    cycleEntryIdx = 1,
    slowIdx = 0,
    fastIdx = 0,
    currentOp = "compare",
    collision = false,
    output
  } = stepData || {};

  const isMatched = slowIdx === fastIdx && slowIdx !== null && collision;

  // Track coordinates dynamically so the loop curve never detaches
  const containerRef = useRef(null);
  const nodeRefs = useRef([]);
  const [curvePath, setCurvePath] = useState("");

  useEffect(() => {
    const updatePath = () => {
      const tailElem = nodeRefs.current[nodes.length - 1];
      const targetElem = nodeRefs.current[cycleEntryIdx];
      const containerElem = containerRef.current;

      if (tailElem && targetElem && containerElem) {
        const cRect = containerElem.getBoundingClientRect();
        const tRect = tailElem.getBoundingClientRect();
        const eRect = targetElem.getBoundingClientRect();

        const xTail = tRect.left + tRect.width / 2 - cRect.left;
        const yTail = tRect.bottom - cRect.top - 8;

        const xTarget = eRect.left + eRect.width / 2 - cRect.left;
        const yTarget = eRect.bottom - cRect.top - 8;

        const deltaX = Math.abs(xTail - xTarget);
        const arcDepth = Math.max(50, deltaX * 0.25);

        setCurvePath(
          `M ${xTail} ${yTail} C ${xTail} ${yTail + arcDepth}, ${xTarget} ${yTarget + arcDepth}, ${xTarget} ${yTarget + 10}`
        );
      }
    };

    updatePath();
    window.addEventListener("resize", updatePath);
    return () => window.removeEventListener("resize", updatePath);
  }, [nodes.length, cycleEntryIdx]);

  return (
    <div id="p141-cycle-canvas">
      {/* Top Telemetry Header */}
      <div id="p141-metrics-row">
        <span id="p141-metric-total">
          Chain: <b>{nodes.length} Nodes</b>
        </span>

        <span id="p141-metric-slow">
          Slow (🐢): <b>Node[{slowIdx}] = {nodes[slowIdx]?.val}</b>
        </span>

        <span id="p141-metric-fast">
          Fast (🐇): <b>Node[{fastIdx}] = {nodes[fastIdx]?.val}</b>
        </span>

        <span
          id="p141-metric-status"
          data-status={isMatched ? "collision" : "active"}
        >
          Status: <b>{isMatched ? "COLLISION DETECTED" : "ADVANCING POINTERS"}</b>
        </span>
      </div>

      <div id="p141-cycle-stage">
        {/* Main Linked List Track */}
        <div id="p141-track-card">
          <div id="p141-card-header-bar">
            <span>Linked List Racetrack</span>
            <span id="p141-card-sub">
              Cycle points from Tail Node[{nodes.length - 1}] back into Node[{cycleEntryIdx}]
            </span>
          </div>

          <div id="p141-racetrack-viewport" ref={containerRef}>
            {/* Dynamic Connecting SVG Curve */}
            {curvePath && (
              <svg id="p141-dynamic-cycle-svg">
                <defs>
                  <marker
                    id="p141-cycle-head"
                    viewBox="0 0 10 10"
                    refX="5"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#facc15" />
                  </marker>
                </defs>

                {/* Subtle track guide */}
                <path d={curvePath} id="p141-cycle-back-track" />

                {/* Flowing animated laser */}
                <motion.path
                  d={curvePath}
                  id="p141-cycle-laser-path"
                  markerEnd="url(#p141-cycle-head)"
                  animate={{ strokeDashoffset: [-32, 0] }}
                  transition={{ repeat: Infinity, ease: "linear", duration: 1.2 }}
                />
              </svg>
            )}

            {/* Linear Linked List Nodes */}
            <div id="p141-nodes-track">
              {nodes.map((node, idx) => {
                const isSlow = slowIdx === idx;
                const isFast = fastIdx === idx;
                const isCollisionNode = isSlow && isFast && isMatched;
                const isCycleEntry = idx === cycleEntryIdx;
                const isTail = idx === nodes.length - 1;

                let nodeState = "idle";
                if (isCollisionNode) nodeState = "collide";
                else if (isFast && isSlow) nodeState = "both";
                else if (isFast) nodeState = "fast";
                else if (isSlow) nodeState = "slow";
                else if (isCycleEntry) nodeState = "entry";

                const targetScale = isCollisionNode ? 1.1 : isFast || isSlow ? 1.05 : 1;

                return (
                  <div
                    key={node.id}
                    ref={(el) => (nodeRefs.current[idx] = el)}
                    id={`p141-node-unit-carrier-${idx}`}
                  >
                    {/* Top Tier: Fast Pointer Zone */}
                    <div id={`p141-pointer-lane-top-${idx}`} data-lane="top">
                      <AnimatePresence mode="popLayout">
                        {isFast && (
                          <motion.div
                            key="p141-fast-badge"
                            layoutId="p141-fast-bunny"
                            id={`p141-fast-badge-${idx}`}
                            initial={{ scale: 0.8, opacity: 0, y: -6 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 450, damping: 28 }}
                          >
                            <span>🐇 Fast (+2)</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Middle: Node Capsule */}
                    <motion.div
                      id={`p141-list-node-${idx}`}
                      data-state={nodeState}
                      layout
                      animate={{ scale: targetScale }}
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 24
                      }}
                    >
                      <span id={`p141-node-val-${idx}`}>{node.val}</span>
                      <span id={`p141-node-index-${idx}`}>[{idx}]</span>

                      {/* Informational badges */}
                      {isCycleEntry && <span id={`p141-entry-tag-${idx}`}>CYCLE IN</span>}
                      {isTail && <span id={`p141-tail-tag-${idx}`}>LOOP START</span>}

                      {isCollisionNode && (
                        <div id={`p141-shockwave-ring-${idx}`} />
                      )}
                    </motion.div>

                    {/* Bottom Tier: Slow Pointer Zone */}
                    <div id={`p141-pointer-lane-bottom-${idx}`} data-lane="bottom">
                      <AnimatePresence mode="popLayout">
                        {isSlow && (
                          <motion.div
                            key="p141-slow-badge"
                            layoutId="p141-slow-turtle"
                            id={`p141-slow-badge-${idx}`}
                            initial={{ scale: 0.8, opacity: 0, y: 6 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 450, damping: 28 }}
                          >
                            <span>🐢 Slow (+1)</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Forward Pointer Connector */}
                    {idx < nodes.length - 1 && (
                      <div id={`p141-forward-connector-${idx}`}>
                        <span id={`p141-con-arrow-${idx}`}>➔</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Color Key */}
          <div id="p141-dependency-legend">
            <span id="p141-legend-item-slow">
              <span id="p141-dot-slow" data-dot="slow" /> Slow Pointer (1 hop/turn)
            </span>
            <span id="p141-legend-item-fast">
              <span id="p141-dot-fast" data-dot="fast" /> Fast Pointer (2 hops/turn)
            </span>
            <span id="p141-legend-item-entry">
              <span id="p141-dot-entry" data-dot="entry" /> Cycle Entry Point (Node[{cycleEntryIdx}])
            </span>
            <span id="p141-legend-item-collision">
              <span id="p141-dot-collision" data-dot="collision" /> Overlap Collision (Cycle Confirmed)
            </span>
          </div>
        </div>

        {/* Pointer Position Trace Dashboard */}
        <div id="p141-trace-card">
          <div id="p141-trace-header-bar">
            <span>Algorithm Mechanics & Relative Distance</span>
            <span id="p141-trace-sub">At each step, Fast gains 1 node on Slow until distance reaches 0</span>
          </div>

          <div id="p141-trace-grid">
            <div id="p141-trace-pill-slow">
              <span id="p141-pill-title-slow">Slow Pointer</span>
              <span id="p141-pill-val-slow" data-val-type="slow">
                {slowIdx !== null ? `Node[${slowIdx}] (${nodes[slowIdx]?.val})` : "None"}
              </span>
            </div>

            <div id="p141-trace-pill-fast">
              <span id="p141-pill-title-fast">Fast Pointer</span>
              <span id="p141-pill-val-fast" data-val-type="fast">
                {fastIdx !== null ? `Node[${fastIdx}] (${nodes[fastIdx]?.val})` : "None"}
              </span>
            </div>

            <div id="p141-trace-pill-gap">
              <span id="p141-pill-title-gap">Gap (Fast ➔ Slow)</span>
              <span
                id="p141-pill-val-gap"
                data-val-type={isMatched ? "match" : "idle"}
              >
                {isMatched ? "0 Nodes (Collision)" : `${Math.abs((fastIdx || 0) - (slowIdx || 0))} Hop(s)`}
              </span>
            </div>

            <div id="p141-trace-pill-verify">
              <span id="p141-pill-title-verify">Cycle Verified?</span>
              <span
                id="p141-pill-val-verify"
                data-val-type={isMatched ? "match" : "idle"}
              >
                {isMatched ? "TRUE (Loop detected)" : "IN PROGRESS"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Result Modal */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p141-result-callout-box"
            data-callout-state={output.value === "True" ? "success" : "error"}
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div id="p141-callout-header-text">{output.label}</div>
            <div id="p141-callout-val-text">{output.value}</div>
            <div id="p141-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}