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
    <div className="canvas-wrapper cycle-canvas">
      {/* Top Telemetry Header */}
      <div className="metrics-row">
        <span className="metric-chip total-chip">
          Chain: <b>{nodes.length} Nodes</b>
        </span>

        <span className="metric-chip slow-chip">
          Slow (🐢): <b>Node[{slowIdx}] = {nodes[slowIdx]?.val}</b>
        </span>

        <span className="metric-chip fast-chip">
          Fast (🐇): <b>Node[{fastIdx}] = {nodes[fastIdx]?.val}</b>
        </span>

        <span className={`metric-chip status-chip ${isMatched ? "status-collision" : ""}`}>
          Status: <b>{isMatched ? "COLLISION DETECTED" : "ADVANCING POINTERS"}</b>
        </span>
      </div>

      <div className="cycle-stage">
        {/* Main Linked List Track */}
        <div className="track-card visual-card" id="mytrack">
          <div className="card-header-bar">
            <span>Linked List Racetrack</span>
            <span className="card-sub">Cycle points from Tail Node[{nodes.length - 1}] back into Node[{cycleEntryIdx}]</span>
          </div>

          <div className="racetrack-viewport" ref={containerRef}>
            {/* Dynamic Connecting SVG Curve */}
            {curvePath && (
              <svg className="dynamic-cycle-svg">
                <defs>
                  <marker
                    id="cycle-head"
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
                <path d={curvePath} className="cycle-back-track" />

                {/* Flowing animated laser */}
                <motion.path
                  d={curvePath}
                  className="cycle-laser-path"
                  markerEnd="url(#cycle-head)"
                  animate={{ strokeDashoffset: [-32, 0] }}
                  transition={{ repeat: Infinity, ease: "linear", duration: 1.2 }}
                />
              </svg>
            )}

            {/* Linear Linked List Nodes */}
            <div className="nodes-track">
              {nodes.map((node, idx) => {
                const isSlow = slowIdx === idx;
                const isFast = fastIdx === idx;
                const isCollisionNode = isSlow && isFast && isMatched;
                const isCycleEntry = idx === cycleEntryIdx;
                const isTail = idx === nodes.length - 1;

                return (
                  <div
                    key={node.id}
                    ref={(el) => (nodeRefs.current[idx] = el)}
                    className="node-unit-carrier"
                  >
                    {/* Top Tier: Fast Pointer Zone */}
                    <div className="pointer-lane lane-top">
                      <AnimatePresence>
                        {isFast && (
                          <motion.div
                            layoutId="fast-bunny"
                            initial={{ scale: 0.8, opacity: 0, y: -6 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 450, damping: 28 }}
                            className="pointer-badge fast-badge"
                          >
                            <span>🐇 Fast (+2)</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Middle: Node Capsule */}
                    <motion.div
                      className={`list-node ${
                        isCollisionNode
                          ? "node-collide"
                          : isFast && isSlow
                          ? "node-both"
                          : isFast
                          ? "node-fast"
                          : isSlow
                          ? "node-slow"
                          : isCycleEntry
                          ? "node-entry"
                          : ""
                      }`}
                      animate={{
                        scale: isCollisionNode ? [1, 1.14, 1] : isFast || isSlow ? 1.05 : 1
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 22,
                        scale: isCollisionNode ? { repeat: Infinity, duration: 0.9 } : undefined
                      }}
                    >
                      <span className="node-val">{node.val}</span>
                      <span className="node-index">[{idx}]</span>

                      {/* Informational badges */}
                      {isCycleEntry && <span className="entry-tag">CYCLE IN</span>}
                      {isTail && <span className="tail-tag">LOOP START</span>}

                      {isCollisionNode && (
                        <div className="shockwave-ring" />
                      )}
                    </motion.div>

                    {/* Bottom Tier: Slow Pointer Zone */}
                    <div className="pointer-lane lane-bottom">
                      <AnimatePresence>
                        {isSlow && (
                          <motion.div
                            layoutId="slow-turtle"
                            initial={{ scale: 0.8, opacity: 0, y: 6 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 450, damping: 28 }}
                            className="pointer-badge slow-badge"
                          >
                            <span>🐢 Slow (+1)</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Forward Pointer Connector */}
                    {idx < nodes.length - 1 && (
                      <div className="forward-connector">
                        <span className="con-line" />
                        <span className="con-arrow">➔</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Color Key */}
          <div className="dependency-legend">
            <span className="legend-item"><span className="dot dot-slow" /> Slow Pointer (1 hop/turn)</span>
            <span className="legend-item"><span className="dot dot-fast" /> Fast Pointer (2 hops/turn)</span>
            <span className="legend-item"><span className="dot dot-entry" /> Cycle Entry Point (Node[{cycleEntryIdx}])</span>
            <span className="legend-item"><span className="dot dot-collision" /> Overlap Collision (Cycle Confirmed)</span>
          </div>
        </div>

        {/* Pointer Position Trace Dashboard */}
        <div className="track-card trace-card" id="mytrace">
          <div className="card-header-bar">
            <span>Algorithm Mechanics & Relative Distance</span>
            <span className="card-sub">At each step, Fast gains 1 node on Slow until distance reaches 0</span>
          </div>

          <div className="trace-grid">
            <div className="trace-pill">
              <span className="pill-title">Slow Pointer</span>
              <span className="pill-val val-slow">
                {slowIdx !== null ? `Node[${slowIdx}] (${nodes[slowIdx]?.val})` : "None"}
              </span>
            </div>

            <div className="trace-pill">
              <span className="pill-title">Fast Pointer</span>
              <span className="pill-val val-fast">
                {fastIdx !== null ? `Node[${fastIdx}] (${nodes[fastIdx]?.val})` : "None"}
              </span>
            </div>

            <div className="trace-pill">
              <span className="pill-title">Gap (Fast ➔ Slow)</span>
              <span className={`pill-val ${isMatched ? "val-match" : ""}`}>
                {isMatched ? "0 Nodes (Collision)" : `${Math.abs((fastIdx || 0) - (slowIdx || 0))} Hop(s)`}
              </span>
            </div>

            <div className="trace-pill">
              <span className="pill-title">Cycle Verified?</span>
              <span className={`pill-val ${isMatched ? "val-match" : ""}`}>
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
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`result-callout ${output.value === "True" ? "callout-success" : "callout-error"}`}
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