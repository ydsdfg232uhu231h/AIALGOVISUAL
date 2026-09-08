import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem417.css";

export default function Problem417({ stepData }) {
  const {
    heights = [
      [1, 2, 2, 3, 5],
      [3, 2, 3, 4, 4],
      [2, 4, 5, 3, 1],
      [6, 7, 1, 4, 5],
      [5, 1, 1, 2, 4]
    ],
    pacificCells = [],
    atlanticCells = [],
    intersectCells = [],
    state = {},
    output
  } = stepData || {};

  const isCellIn = (r, c, list) => list.some(([row, col]) => row === r && col === c);

  return (
    <div id="pacific-atlantic-canvas">
      {/* Top Telemetry Header */}
      <div id="metrics-bar">
        <span id="metric-grid-dim" className="metric-chip">
          Grid: <b>{heights.length} × {heights[0]?.length || 0}</b>
        </span>

        <span id="metric-pac-count" className="metric-chip">
          Pacific Reached: <b>{pacificCells.length} cells</b>
        </span>

        <span id="metric-atl-count" className="metric-chip">
          Atlantic Reached: <b>{atlanticCells.length} cells</b>
        </span>

        <span id="metric-overlap-count" className="metric-chip">
          Intersection (Both): <b>{intersectCells.length} cells</b>
        </span>
      </div>

      <div id="matrix-stage">
        <div id="terrain-card" className="track-card">
          <div className="card-header-bar">
            <span>2D Elevation Map & Reverse Ocean Flow</span>
            <span className="card-sub">Pacific: Top/Left edges ➔ Atlantic: Bottom/Right edges</span>
          </div>

          <div id="ocean-grid-wrapper">
            {/* Top Pacific Ocean Banner */}
            <div id="ocean-banner-top" className="ocean-banner ocean-pac">
              <span>PACIFIC OCEAN (TOP)</span>
            </div>

            <div id="ocean-middle-row">
              {/* Left Pacific Ocean Banner */}
              <div id="ocean-banner-left" className="ocean-banner ocean-pac">
                <span>P<br />A<br />C<br />I<br />F<br />I<br />C</span>
              </div>

              {/* 2D Grid Cells */}
              <div
                id="elevation-cells-grid"
                style={{
                  gridTemplateColumns: `repeat(${heights[0]?.length || 5}, 1fr)`
                }}
              >
                {heights.map((row, r) =>
                  row.map((val, c) => {
                    const inPac = isCellIn(r, c, pacificCells);
                    const inAtl = isCellIn(r, c, atlanticCells);
                    const inIntersect = isCellIn(r, c, intersectCells) || (inPac && inAtl);

                    const cellId = `cell-${r}-${c}`;

                    return (
                      <motion.div
                        key={cellId}
                        id={cellId}
                        className={`elevation-cell ${
                          inIntersect
                            ? "cell-both-green"
                            : inPac
                            ? "cell-pac-blue"
                            : inAtl
                            ? "cell-atl-orange"
                            : ""
                        }`}
                        animate={{
                          scale: inIntersect ? [1, 1.08, 1] : inPac || inAtl ? 1.04 : 1
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                          scale: inIntersect ? { repeat: Infinity, duration: 1.2 } : undefined
                        }}
                      >
                        <span className="elevation-val">{val}</span>
                        <span className="cell-coords">[{r},{c}]</span>

                        {inIntersect && <div className="cell-green-ring" />}
                      </motion.div>
                    );
                  })
                )}
              </div>

              {/* Right Atlantic Ocean Banner */}
              <div id="ocean-banner-right" className="ocean-banner ocean-atl">
                <span>A<br />T<br />L<br />A<br />N<br />T<br />I<br />C</span>
              </div>
            </div>

            {/* Bottom Atlantic Ocean Banner */}
            <div id="ocean-banner-bottom" className="ocean-banner ocean-atl">
              <span>ATLANTIC OCEAN (BOTTOM)</span>
            </div>
          </div>

          {/* Color Key */}
          <div id="ocean-legend">
            <span className="legend-item"><span className="dot dot-pac" /> Pacific Reachable</span>
            <span className="legend-item"><span className="dot dot-atl" /> Atlantic Reachable</span>
            <span className="legend-item"><span className="dot dot-both" /> Flows to BOTH (Answer)</span>
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