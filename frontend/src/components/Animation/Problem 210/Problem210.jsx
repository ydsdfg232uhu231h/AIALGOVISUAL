import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem210.css";

export default function Problem210({ stepData }) {
  const {
    numCourses = 4,
    inDegrees = { 0: 0, 1: 1, 2: 1, 3: 2 },
    queue = [],
    order = [],
    currentCourse = null,
    activeEdges = [], // e.g. [[0, 1], [0, 2]]
    adj = { 0: [1, 2], 1: [3], 2: [3], 3: [] },
    state = {},
    output
  } = stepData || {};

  const courses = Array.from({ length: numCourses }, (_, i) => i);

  return (
    <div id="p210-topo-canvas">
      {/* Metrics Row */}
      <div id="p210-metrics-bar">
        <span id="p210-metric-total">
          Courses: <b>{numCourses}</b>
        </span>

        {currentCourse !== null ? (
          <span id="p210-metric-active">
            Processing: <b>Course {currentCourse}</b>
          </span>
        ) : (
          <span id="p210-metric-idle">
            Status: <b>Idle</b>
          </span>
        )}

        <span id="p210-metric-queue">
          BFS Queue: <b>{queue.length > 0 ? `[ ${queue.map((c) => `C${c}`).join(", ")} ]` : "Empty"}</b>
        </span>

        <span id="p210-metric-order">
          Ordered: <b>{order.length} / {numCourses}</b>
        </span>
      </div>

      {/* Main Visual Stage */}
      <div id="p210-topo-stage">
        {/* Track 1: Graph Nodes & In-Degree Counters */}
        <div id="p210-graph-card">
          <div id="p210-graph-card-header">
            <span id="p210-graph-header-title">1. Dependency Graph &amp; In-Degree State</span>
            <span id="p210-graph-header-sub">In-Degree = remaining prerequisites to satisfy</span>
          </div>

          <div id="p210-nodes-graph-row">
            {courses.map((crs) => {
              const inDeg = inDegrees[crs] ?? 0;
              const isProcessing = currentCourse === crs;
              const inQueue = queue.includes(crs);
              const isResolved = order.includes(crs);

              let nodeState = "locked";
              if (isProcessing) nodeState = "processing";
              else if (isResolved) nodeState = "resolved";
              else if (inQueue) nodeState = "queued";
              else if (inDeg === 0) nodeState = "zero-indeg";

              const targetScale = isProcessing ? 1.1 : isResolved ? 1.02 : 1;

              return (
                <div key={`p210-node-unit-${crs}`} id={`p210-node-unit-wrapper-${crs}`}>
                  <motion.div
                    id={`p210-course-node-${crs}`}
                    data-node-state={nodeState}
                    layout
                    animate={{
                      scale: targetScale,
                      y: isProcessing ? -4 : 0
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 22 }}
                  >
                    <span id={`p210-node-top-lbl-${crs}`}>COURSE</span>
                    <span id={`p210-node-id-${crs}`}>C{crs}</span>

                    <span
                      id={`p210-indeg-badge-${crs}`}
                      data-indeg={inDeg === 0 ? "zero" : "positive"}
                    >
                      In-Deg: {inDeg}
                    </span>

                    {isResolved && <span id={`p210-resolved-check-${crs}`}>✓</span>}
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* Color Key */}
          <div id="p210-dependency-legend">
            <span id="p210-legend-item-resolved">
              <span id="p210-dot-resolved" data-dot="resolved" /> Completed / Ordered
            </span>
            <span id="p210-legend-item-processing">
              <span id="p210-dot-processing" data-dot="processing" /> Currently Dequeued
            </span>
            <span id="p210-legend-item-queued">
              <span id="p210-dot-queued" data-dot="queued" /> In BFS Queue
            </span>
            <span id="p210-legend-item-locked">
              <span id="p210-dot-locked" data-dot="locked" /> In-Degree &gt; 0 (Locked)
            </span>
          </div>
        </div>

        {/* Track 2: BFS Queue & Dynamic Order Bar */}
        <div id="p210-execution-card">
          <div id="p210-exec-card-header">
            <span id="p210-exec-header-title">2. Kahn's Execution State</span>
            <span id="p210-exec-header-sub">Queue feeds into Topological Result array</span>
          </div>

          <div id="p210-execution-grid">
            {/* Queue Box */}
            <div id="p210-queue-box-panel">
              <span id="p210-queue-panel-title">Active Queue (In-Degree = 0)</span>
              <div id="p210-queue-tokens-row">
                <AnimatePresence mode="popLayout">
                  {queue.length === 0 ? (
                    <span id="p210-empty-queue-lbl">Queue Empty</span>
                  ) : (
                    queue.map((c) => (
                      <motion.span
                        key={`p210-queue-${c}`}
                        id={`p210-queue-token-${c}`}
                        layout
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 24 }}
                      >
                        C{c}
                      </motion.span>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Topological Output Sequence */}
            <div id="p210-order-box-panel">
              <span id="p210-order-panel-title">Topological Order (`res`)</span>
              <div id="p210-order-tokens-row">
                <AnimatePresence mode="popLayout">
                  {order.length === 0 ? (
                    <span id="p210-empty-order-lbl">No courses ordered yet</span>
                  ) : (
                    order.map((c, idx) => (
                      <React.Fragment key={`p210-res-${c}`}>
                        <motion.span
                          id={`p210-order-token-${c}`}
                          layout
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 400, damping: 24 }}
                        >
                          C{c}
                        </motion.span>
                        {idx < order.length - 1 && (
                          <span id={`p210-order-sep-${c}`}>➔</span>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Track 3: Adjacency Forward Map */}
        <div id="p210-adj-card">
          <div id="p210-adj-card-header">
            <span id="p210-adj-header-title">3. Forward Adjacency (`adj[u] ➔ v`)</span>
            <span id="p210-adj-header-sub">Completing u unlocks edges to adjacent nodes v</span>
          </div>

          <div id="p210-adj-grid">
            {courses.map((crs) => {
              const targets = adj[crs] || [];
              const isCurrent = currentCourse === crs;
              const isCleared = order.includes(crs);

              let adjState = "idle";
              if (isCurrent) adjState = "active";
              else if (isCleared) adjState = "cleared";

              return (
                <div
                  key={`p210-adj-row-${crs}`}
                  id={`p210-adj-row-${crs}`}
                  data-adj-state={adjState}
                >
                  <span id={`p210-adj-source-${crs}`}>Course {crs}</span>
                  <span id={`p210-adj-arrow-${crs}`}>➔ Unlocks:</span>
                  <span id={`p210-adj-targets-${crs}`}>
                    {targets.length === 0 ? (
                      <span id={`p210-val-empty-${crs}`}>[] (No outbound targets)</span>
                    ) : (
                      `[ ${targets.map((t) => `Course ${t}`).join(", ")} ]`
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Result Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p210-result-callout-box"
            data-callout-state={output.value === "[]" ? "error" : "success"}
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div id="p210-callout-header-text">{output.label}</div>
            <div id="p210-callout-val-text">{output.value}</div>
            <div id="p210-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}