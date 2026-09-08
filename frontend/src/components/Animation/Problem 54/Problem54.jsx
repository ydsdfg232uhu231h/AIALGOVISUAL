import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem54.css";

export default function Problem54({ stepData }) {
  const {
    matrix = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ],
    visitedCells = [],
    activeCells = [],
    top = 0,
    bottom = 2,
    left = 0,
    right = 2,
    res = [],
    isCompleted = false,
    output
  } = stepData || {};

  const checkIsVisited = (r, c) => visitedCells.some(([vr, vc]) => vr === r && vc === c);
  const checkIsActive = (r, c) => activeCells.some(([ar, ac]) => ar === r && ac === c);

  return (
    <div id="spiral-matrix-canvas">
      {/* Top Metrics Row */}
      <div id="metrics-bar">
        <span id="metric-top">
          Top: <b>{top}</b>
        </span>
        <span id="metric-bottom">
          Bottom: <b>{bottom}</b>
        </span>
        <span id="metric-left">
          Left: <b>{left}</b>
        </span>
        <span id="metric-right">
          Right: <b>{right}</b>
        </span>
        <span id={isCompleted ? "metric-status-done" : "metric-status-active"}>
          Status: <b>{isCompleted ? "TRAVERSAL COMPLETE ✓" : "SHRINKING BOUNDARIES"}</b>
        </span>
      </div>

      <div id="spiral-stage">
        {/* Track 1: 2D Matrix Grid */}
        <div id="matrix-card">
          <div id="matrix-card-header">
            <span id="matrix-header-title">1. 2D Matrix (`matrix`)</span>
            <span id="matrix-header-sub">Traversing 4 boundaries iteratively</span>
          </div>

          <div id="matrix-viewport">
            <div id="matrix-grid">
              {matrix.map((row, rIdx) => (
                <div key={`row-${rIdx}`} id={`matrix-row-${rIdx}`}>
                  {row.map((val, cIdx) => {
                    const isVisited = checkIsVisited(rIdx, cIdx);
                    const isActive = checkIsActive(rIdx, cIdx);

                    let boxId = `cell-idle-${rIdx}-${cIdx}`;
                    if (isActive) boxId = `cell-active-${rIdx}-${cIdx}`;
                    else if (isVisited) boxId = `cell-visited-${rIdx}-${cIdx}`;

                    // Border highlighting to show active boundaries
                    const isTopBoundary = rIdx === top && !isVisited;
                    const isBottomBoundary = rIdx === bottom && !isVisited;
                    const isLeftBoundary = cIdx === left && !isVisited;
                    const isRightBoundary = cIdx === right && !isVisited;

                    return (
                      <motion.div
                        key={`cell-${rIdx}-${cIdx}`}
                        id={boxId}
                        animate={{ scale: isActive ? 1.1 : 1 }}
                        transition={{ type: "spring", stiffness: 350, damping: 20 }}
                        style={{
                          borderTopColor: isTopBoundary && !isActive && !isVisited ? "#facc15" : "",
                          borderBottomColor: isBottomBoundary && !isActive && !isVisited ? "#facc15" : "",
                          borderLeftColor: isLeftBoundary && !isActive && !isVisited ? "#facc15" : "",
                          borderRightColor: isRightBoundary && !isActive && !isVisited ? "#facc15" : ""
                        }}
                      >
                        {val}
                        <span id={`coord-tag-${rIdx}-${cIdx}`}>[{rIdx},{cIdx}]</span>
                      </motion.div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Track 2: Accumulated Result List */}
        <div id="res-card">
          <div id="res-card-header">
            <span id="res-header-title">2. Output Array (`res`)</span>
            <span id="res-header-sub">Elements gathered in spiral order</span>
          </div>

          <div id="res-viewport">
            <AnimatePresence mode="popLayout">
              {res.length === 0 ? (
                <span id="res-empty-text">res = [] (empty)</span>
              ) : (
                <div id="res-list-container">
                  {res.map((val, idx) => {
                    const isNewest = idx >= res.length - activeCells.length && !isCompleted;
                    let pillId = isCompleted ? `res-pill-done-${idx}` : isNewest ? `res-pill-active-${idx}` : `res-pill-idle-${idx}`;

                    return (
                      <motion.div
                        key={`res-item-${idx}-${val}`}
                        id={pillId}
                        layout
                        initial={{ opacity: 0, scale: 0.5, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      >
                        {val}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </AnimatePresence>
          </div>
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