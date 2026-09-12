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
    <div id="p207-course-canvas">
      {/* Top Status Bar */}
      <div id="p207-metrics-bar">
        <span id="p207-metric-total">
          Courses: <b>{courses.length}</b>
        </span>

        {currentCourse !== null ? (
          <span id="p207-metric-active">
            Inspecting: <b>Course {currentCourse}</b>
          </span>
        ) : (
          <span id="p207-metric-idle">
            Status: <b>Idle</b>
          </span>
        )}

        <span id="p207-metric-stack">
          DFS Stack: <b>{inPath.length > 0 ? inPath.map((c) => `C${c}`).join(" ➔ ") : "Empty"}</b>
        </span>

        <span id="p207-metric-cleared">
          Resolved: <b>{cleared.length} / {courses.length}</b>
        </span>

        {isCycle && (
          <span id="p207-metric-cycle">
            Cycle: <b>Deadlock Detected</b>
          </span>
        )}
      </div>

      <div id="p207-course-stage">
        {/* Track 1: Course Dependency Graph */}
        <div id="p207-graph-card">
          <div id="p207-graph-card-header">
            <span id="p207-graph-header-title">Course Dependency Graph</span>
            <span id="p207-graph-header-sub">Left-to-right prerequisite chain</span>
          </div>

          <div id="p207-graph-stage-viewport">
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

              let boxState = "idle";
              if (isFaulty) boxState = "cycle";
              else if (isActive) boxState = "active";
              else if (isVisiting) boxState = "visiting";
              else if (isCleared) boxState = "cleared";

              const targetScale = isFaulty ? 1.1 : isActive ? 1.06 : 1;

              return (
                <div key={`p207-course-unit-${crs}`} id={`p207-course-unit-${crs}`}>
                  {/* High-Visibility Course Card */}
                  <motion.div
                    id={`p207-course-box-${crs}`}
                    data-box-state={boxState}
                    layout
                    animate={{
                      scale: targetScale,
                      y: isActive ? -4 : 0
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 24
                    }}
                  >
                    <div id={`p207-box-top-tag-${crs}`}>COURSE</div>
                    <div id={`p207-box-main-id-${crs}`}>C{crs}</div>
                    <div id={`p207-box-status-pill-${crs}`}>
                      {isFaulty
                        ? "CYCLE"
                        : isCleared
                        ? "RESOLVED"
                        : isVisiting
                        ? "IN STACK"
                        : "PENDING"}
                    </div>

                    {isCleared && <span id={`p207-box-check-badge-${crs}`}>✓</span>}
                  </motion.div>

                  {/* Connecting Arrow */}
                  {idx < courses.length - 1 && (
                    <div id={`p207-conduit-block-${idx}`}>
                      <svg id={`p207-conduit-arrow-svg-${idx}`} viewBox="0 0 54 20">
                        <defs>
                          <marker
                            id={`p207-arrow-head-${idx}`}
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
                          id={`p207-conduit-line-${idx}`}
                          data-edge-active={isEdgeActive ? "true" : "false"}
                          markerEnd={`url(#p207-arrow-head-${idx})`}
                        />
                      </svg>
                      <span
                        id={`p207-conduit-text-${idx}`}
                        data-edge-active={isEdgeActive ? "true" : "false"}
                      >
                        needs
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Color Key Legend */}
          <div id="p207-dependency-legend">
            <span id="p207-legend-item-cleared">
              <span id="p207-dot-cleared" data-dot="cleared" /> Cleared (Acyclic)
            </span>
            <span id="p207-legend-item-visiting">
              <span id="p207-dot-visiting" data-dot="visiting" /> Active DFS Path
            </span>
            <span id="p207-legend-item-active">
              <span id="p207-dot-active" data-dot="active" /> Current Node
            </span>
            <span id="p207-legend-item-cycle">
              <span id="p207-dot-cycle" data-dot="cycle" /> Circular Deadlock
            </span>
          </div>
        </div>

        {/* Track 2: Adjacency Prerequisite Map (preMap) */}
        <div id="p207-map-card">
          <div id="p207-map-card-header">
            <span id="p207-map-header-title">Adjacency Prerequisite Map (preMap)</span>
            <span id="p207-map-header-sub">Clear to [] when safe</span>
          </div>

          <div id="p207-premap-grid">
            {courses.map((crs) => {
              const prereqs = preMap[crs] || [];
              const isCurrent = currentCourse === crs;
              const isCleared = cleared.includes(crs);

              let pillState = "idle";
              if (isCurrent) pillState = "active";
              else if (isCleared) pillState = "cleared";

              return (
                <div
                  key={`p207-premap-${crs}`}
                  id={`p207-premap-pill-${crs}`}
                  data-pill-state={pillState}
                >
                  <span id={`p207-premap-key-${crs}`}>Course {crs}</span>
                  <span id={`p207-premap-arrow-${crs}`}>➔</span>
                  <span id={`p207-premap-val-${crs}`}>
                    {prereqs.length === 0 ? (
                      <span id={`p207-val-empty-${crs}`}>[] (Acyclic &amp; Safe)</span>
                    ) : (
                      `[ Course ${prereqs.join(", ")} ]`
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
            id="p207-result-callout-box"
            data-callout-state={output.value === "False" ? "error" : "success"}
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div id="p207-callout-header-text">{output.label}</div>
            <div id="p207-callout-val-text">{output.value}</div>
            <div id="p207-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}