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
    <div className="canvas-wrapper topo-canvas">
      {/* Metrics Row */}
      <div className="metrics-row">
        <span className="metric-chip total-chip">
          Courses: <b>{numCourses}</b>
        </span>

        {currentCourse !== null ? (
          <span className="metric-chip active-chip">
            Processing: <b>Course {currentCourse}</b>
          </span>
        ) : (
          <span className="metric-chip idle-chip">Status: <b>Idle</b></span>
        )}

        <span className="metric-chip queue-chip">
          BFS Queue: <b>{queue.length > 0 ? `[ ${queue.map((c) => `C${c}`).join(", ")} ]` : "Empty"}</b>
        </span>

        <span className="metric-chip order-chip">
          Ordered: <b>{order.length} / {numCourses}</b>
        </span>
      </div>

      {/* Main Visual Stage */}
      <div className="topo-stage">
        {/* Track 1: Graph Nodes & In-Degree Counters */}
        <div className="track-card " id="mygraphcard">
          <div className="card-header-bar">
            <span>1. Dependency Graph & In-Degree State</span>
            <span className="card-sub">In-Degree = remaining prerequisites to satisfy</span>
          </div>

          <div className="nodes-graph-row">
            {courses.map((crs) => {
              const inDeg = inDegrees[crs] ?? 0;
              const isProcessing = currentCourse === crs;
              const inQueue = queue.includes(crs);
              const isResolved = order.includes(crs);

              return (
                <div key={`crs-unit-${crs}`} className="node-unit-wrapper">
                  <motion.div
                    className={`course-node ${
                      isProcessing
                        ? "node-processing"
                        : isResolved
                        ? "node-resolved"
                        : inQueue
                        ? "node-queued"
                        : inDeg === 0
                        ? "node-zero-indeg"
                        : ""
                    }`}
                    animate={{
                      scale: isProcessing ? 1.1 : isResolved ? 1.02 : 1,
                      y: isProcessing ? -4 : 0
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 22 }}
                  >
                    <span className="node-top-lbl">COURSE</span>
                    <span className="node-id">C{crs}</span>

                    <span className={`indeg-badge ${inDeg === 0 ? "indeg-zero" : ""}`}>
                      In-Deg: {inDeg}
                    </span>

                    {isResolved && <span className="resolved-check">✓</span>}
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* Color Key */}
          <div className="dependency-legend">
            <span className="legend-item"><span className="dot dot-resolved" /> Completed / Ordered</span>
            <span className="legend-item"><span className="dot dot-processing" /> Currently Dequeued</span>
            <span className="legend-item"><span className="dot dot-queued" /> In BFS Queue</span>
            <span className="legend-item"><span className="dot dot-locked" /> In-Degree &gt; 0 (Locked)</span>
          </div>
        </div>

        {/* Track 2: BFS Queue & Dynamic Order Bar */}
        <div className="track-card execution-card" id="mycard">
          <div className="card-header-bar">
            <span>2. Kahn's Execution State</span>
            <span className="card-sub">Queue feeds into Topological Result array</span>
          </div>

          <div className="execution-grid">
            {/* Queue Box */}
            <div className="queue-box-panel">
              <span className="panel-title">Active Queue (In-Degree = 0)</span>
              <div className="queue-tokens-row">
                {queue.length === 0 ? (
                  <span className="empty-lbl">Queue Empty</span>
                ) : (
                  queue.map((c) => (
                    <motion.span
                      key={`queue-${c}`}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="queue-token"
                    >
                      C{c}
                    </motion.span>
                  ))
                )}
              </div>
            </div>

            {/* Topological Output Sequence */}
            <div className="order-box-panel">
              <span className="panel-title">Topological Order (`res`)</span>
              <div className="order-tokens-row">
                {order.length === 0 ? (
                  <span className="empty-lbl">No courses ordered yet</span>
                ) : (
                  order.map((c, idx) => (
                    <React.Fragment key={`res-${c}`}>
                      <motion.span
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="order-token"
                      >
                        C{c}
                      </motion.span>
                      {idx < order.length - 1 && <span className="order-sep">➔</span>}
                    </React.Fragment>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Track 3: Adjacency Forward Map */}
        <div className="track-card adj-card" id="myadjcard">
          <div className="card-header-bar">
            <span>3. Forward Adjacency (`adj[u] ➔ v`)</span>
            <span className="card-sub">Completing u unlocks edges to adjacent nodes v</span>
          </div>

          <div className="adj-grid">
            {courses.map((crs) => {
              const targets = adj[crs] || [];
              const isCurrent = currentCourse === crs;
              const isCleared = order.includes(crs);

              return (
                <div
                  key={`adj-row-${crs}`}
                  className={`adj-row-pill ${
                    isCurrent ? "adj-active" : isCleared ? "adj-cleared" : ""
                  }`}
                >
                  <span className="adj-source">Course {crs}</span>
                  <span className="adj-arrow">➔ Unlocks:</span>
                  <span className="adj-targets">
                    {targets.length === 0 ? (
                      <span className="val-empty">[] (No outbound targets)</span>
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
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`result-callout ${
              output.value === "[]" ? "callout-error" : "callout-success"
            }`}
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