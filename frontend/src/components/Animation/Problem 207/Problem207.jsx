import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem207.css";

export default function Problem207({ stepData }) {
  const {
    courses = [0, 1, 2, 3],
    currentCourse = null,
    inPath = [],
    cleared = [],
    cycleNodes = [],
    preMap = { 0: [], 1: [0], 2: [1], 3: [2] },
    state = {},
    output
  } = stepData || {};

  const isCycle = cycleNodes.length > 0 || state.cycleDetected === "True";

  return (
    <div className="canvas-wrapper course-canvas">
      {/* Top Status Bar */}
      <div className="metrics-row">
        <span className="metric-chip total-chip">
          Courses: <b>{courses.length}</b>
        </span>

        {currentCourse !== null ? (
          <span className="metric-chip active-chip">
            Inspecting: <b>Course {currentCourse}</b>
          </span>
        ) : (
          <span className="metric-chip idle-chip">Status: <b>Idle</b></span>
        )}

        <span className="metric-chip stack-chip">
          DFS Stack: <b>{inPath.length > 0 ? inPath.map((c) => `C${c}`).join(" ➔ ") : "Empty"}</b>
        </span>

        <span className="metric-chip cleared-chip">
          Resolved: <b>{cleared.length} / {courses.length}</b>
        </span>

        {isCycle && (
          <span className="metric-chip cycle-chip">
            Cycle: <b>Deadlock Detected</b>
          </span>
        )}
      </div>

      <div className="course-stage">
        {/* Track 1: Course Dependency Graph */}
        <div className="track-card graph-card">
          <div className="card-header-bar">
            <span>Course Dependency Graph</span>
            <span className="card-sub">Left-to-right prerequisite chain</span>
          </div>

          <div className="graph-stage-viewport">
            {courses.map((crs, idx) => {
              const isActive = currentCourse === crs;
              const isVisiting = inPath.includes(crs);
              const isCleared = cleared.includes(crs);
              const isFaulty = cycleNodes.includes(crs);

              const nextCrs = courses[idx + 1];
              const isEdgeActive =
                nextCrs !== undefined &&
                inPath.includes(crs) &&
                inPath.includes(nextCrs);

              return (
                <div key={`course-unit-${crs}`} className="course-unit">
                  {/* High-Visibility Course Card */}
                  <motion.div
                    className={`course-box ${
                      isFaulty
                        ? "box-cycle"
                        : isActive
                        ? "box-active"
                        : isVisiting
                        ? "box-visiting"
                        : isCleared
                        ? "box-cleared"
                        : ""
                    }`}
                    animate={{
                      scale: isFaulty ? [1, 1.1, 1] : isActive ? 1.06 : 1,
                      y: isActive ? -4 : 0
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 22,
                      scale: isFaulty ? { repeat: Infinity, duration: 0.8 } : undefined
                    }}
                  >
                    <div className="box-top-tag">COURSE</div>
                    <div className="box-main-id">C{crs}</div>
                    <div className="box-status-pill">
                      {isFaulty
                        ? "CYCLE"
                        : isCleared
                        ? "RESOLVED"
                        : isVisiting
                        ? "IN STACK"
                        : "PENDING"}
                    </div>

                    {isCleared && <span className="box-check-badge">✓</span>}
                  </motion.div>

                  {/* Connecting Arrow */}
                  {idx < courses.length - 1 && (
                    <div className="conduit-block">
                      <svg className="conduit-arrow-svg" viewBox="0 0 54 20">
                        <defs>
                          <marker
                            id={`arrow-head-${idx}`}
                            viewBox="0 0 10 10"
                            refX="7"
                            refY="5"
                            markerWidth="6"
                            markerHeight="6"
                            orient="auto-start-reverse"
                          >
                            <path
                              d="M 0 1.5 L 8 5 L 0 8.5 z"
                              fill={isFaulty ? "#ef4444" : isEdgeActive ? "#38bdf8" : "#525264"}
                            />
                          </marker>
                        </defs>
                        <line
                          x1="4"
                          y1="10"
                          x2="46"
                          y2="10"
                          className={`conduit-base-path ${isEdgeActive ? "conduit-active-path" : ""}`}
                          markerEnd={`url(#arrow-head-${idx})`}
                        />
                      </svg>
                      <span className={`conduit-text ${isEdgeActive ? "conduit-text-active" : ""}`}>
                        needs
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Color Key Legend */}
          <div className="dependency-legend">
            <span className="legend-item"><span className="dot dot-cleared" /> Cleared (Acyclic)</span>
            <span className="legend-item"><span className="dot dot-visiting" /> Active DFS Path</span>
            <span className="legend-item"><span className="dot dot-active" /> Current Node</span>
            <span className="legend-item"><span className="dot dot-cycle" /> Circular Deadlock</span>
          </div>
        </div>

        {/* Track 2: Adjacency Prerequisite Map (preMap) */}
        <div className="track-card map-card">
          <div className="card-header-bar">
            <span>Adjacency Prerequisite Map (preMap)</span>
            <span className="card-sub">Clear to [] when safe</span>
          </div>

          <div className="premap-grid">
            {courses.map((crs) => {
              const prereqs = preMap[crs] || [];
              const isCurrent = currentCourse === crs;
              const isCleared = cleared.includes(crs);

              return (
                <div
                  key={`premap-${crs}`}
                  className={`premap-pill ${
                    isCurrent ? "premap-active" : isCleared ? "premap-cleared" : ""
                  }`}
                >
                  <span className="premap-key">Course {crs}</span>
                  <span className="premap-arrow">➔</span>
                  <span className="premap-val">
                    {prereqs.length === 0 ? (
                      <span className="val-empty">[] (Acyclic & Safe)</span>
                    ) : (
                      `[ Course ${prereqs.join(", ") } ]`
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
              output.value === "False" ? "callout-error" : "callout-success"
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