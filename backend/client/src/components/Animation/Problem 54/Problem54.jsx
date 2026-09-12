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
    <div id="p54-spiral-matrix-canvas">
      {/* Top Metrics Row */}
      <div id="p54-metrics-bar">
        <span id="p54-metric-top">
          Top: <b>{top}</b>
        </span>
        <span id="p54-metric-bottom">
          Bottom: <b>{bottom}</b>
        </span>
        <span id="p54-metric-left">
          Left: <b>{left}</b>
        </span>
        <span id="p54-metric-right">
          Right: <b>{right}</b>
        </span>
        <span id={isCompleted ? "p54-metric-status-done" : "p54-metric-status-active"}>
          Status: <b>{isCompleted ? "TRAVERSAL COMPLETE ✓" : "SHRINKING BOUNDARIES"}</b>
        </span>
      </div>

      <div id="p54-spiral-stage">
        {/* Track 1: 2D Matrix Grid */}
        <div id="p54-matrix-card">
          <div id="p54-matrix-card-header">
            <span id="p54-matrix-header-title">1. 2D Matrix (`matrix`)</span>
            <span id="p54-matrix-header-sub">Traversing 4 boundaries iteratively</span>
          </div>

          <div id="p54-matrix-viewport">
            <div id="p54-matrix-grid">
              {matrix.map((row, rIdx) => (
                <div key={`p54-row-${rIdx}`} id={`p54-matrix-row-${rIdx}`}>
                  {row.map((val, cIdx) => {
                    const isVisited = checkIsVisited(rIdx, cIdx);
                    const isActive = checkIsActive(rIdx, cIdx);

                    let cellState = "idle";
                    if (isActive) cellState = "active";
                    else if (isVisited) cellState = "visited";

                    // Boundary indicators
                    const isTopBoundary = rIdx === top && !isVisited;
                    const isBottomBoundary = rIdx === bottom && !isVisited;
                    const isLeftBoundary = cIdx === left && !isVisited;
                    const isRightBoundary = cIdx === right && !isVisited;

                    return (
                      <motion.div
                        key={`p54-cell-${rIdx}-${cIdx}`}
                        id={`p54-cell-${rIdx}-${cIdx}`}
                        data-state={cellState}
                        data-top-boundary={isTopBoundary && !isActive && !isVisited ? "true" : "false"}
                        data-bottom-boundary={isBottomBoundary && !isActive && !isVisited ? "true" : "false"}
                        data-left-boundary={isLeftBoundary && !isActive && !isVisited ? "true" : "false"}
                        data-right-boundary={isRightBoundary && !isActive && !isVisited ? "true" : "false"}
                        layout
                        animate={{ scale: isActive ? 1.1 : 1 }}
                        transition={{ type: "spring", stiffness: 350, damping: 20 }}
                      >
                        <span id={`p54-cell-val-${rIdx}-${cIdx}`}>{val}</span>
                        <span id={`p54-coord-tag-${rIdx}-${cIdx}`}>[{rIdx},{cIdx}]</span>
                      </motion.div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Track 2: Accumulated Result List */}
        <div id="p54-res-card">
          <div id="p54-res-card-header">
            <span id="p54-res-header-title">2. Output Array (`res`)</span>
            <span id="p54-res-header-sub">Elements gathered in spiral order</span>
          </div>

          <div id="p54-res-viewport">
            <AnimatePresence mode="popLayout">
              {res.length === 0 ? (
                <span id="p54-res-empty-text">res = [] (empty)</span>
              ) : (
                <div id="p54-res-list-container">
                  {res.map((val, idx) => {
                    const isNewest = idx >= res.length - activeCells.length && !isCompleted;
                    let pillState = "idle";
                    if (isCompleted) pillState = "done";
                    else if (isNewest) pillState = "active";

                    return (
                      <motion.div
                        key={`p54-res-item-${idx}-${val}`}
                        id={`p54-res-pill-${idx}`}
                        data-pill-state={pillState}
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
            id="p54-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div id="p54-callout-header-text">{output.label}</div>
            <div id="p54-callout-val-text">{output.value}</div>
            <div id="p54-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}