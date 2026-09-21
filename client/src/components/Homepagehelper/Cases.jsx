import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import "./Swim.css";

const problemPayload = {
  id: 778,
  title: "Swim in Rising Water",
  steps: [
    {
      stepIndex: 0,
      narration: "Line 2: Initialize minHeap with origin (0, 0) [elev: 0, t: 0]. Mark (0, 0) in visit set.",
      state: { minHeap: "[[0, 0, 0]]" },
      grid: [
        [0, 2, 4, 6, 8],
        [16, 18, 20, 22, 10],
        [14, 12, 24, 21, 11],
        [15, 13, 23, 17, 9],
        [19, 5, 3, 7, 1]
      ],
      visited: [[0, 0]],
      currentCell: [0, 0],
      currentTime: 0,
      output: null
    },
    {
      stepIndex: 1,
      narration: "Line 10: From (0, 0): push (0, 1) [req t=max(0, 2)=2] and (1, 0) [req t=max(0, 16)=16].",
      state: { minHeap: "[[2, 0, 1], [16, 1, 0]]" },
      grid: [
        [0, 2, 4, 6, 8],
        [16, 18, 20, 22, 10],
        [14, 12, 24, 21, 11],
        [15, 13, 23, 17, 9],
        [19, 5, 3, 7, 1]
      ],
      visited: [[0, 0], [0, 1], [1, 0]],
      currentCell: [0, 0],
      currentTime: 0,
      output: null
    },
    {
      stepIndex: 2,
      narration: "Line 4: Pop min root [t: 2, (0, 1)]. Water rises to t = 2. Swimmer advances to (0, 1).",
      state: { minHeap: "[[16, 1, 0]]" },
      grid: [
        [0, 2, 4, 6, 8],
        [16, 18, 20, 22, 10],
        [14, 12, 24, 21, 11],
        [15, 13, 23, 17, 9],
        [19, 5, 3, 7, 1]
      ],
      visited: [[0, 0], [0, 1], [1, 0]],
      currentCell: [0, 1],
      currentTime: 2,
      output: null
    },
    {
      stepIndex: 3,
      narration: "Line 10: From (0, 1): push (0, 2) [req t=max(2, 4)=4] and (1, 1) [req t=max(2, 18)=18].",
      state: { minHeap: "[[4, 0, 2], [16, 1, 0], [18, 1, 1]]" },
      grid: [
        [0, 2, 4, 6, 8],
        [16, 18, 20, 22, 10],
        [14, 12, 24, 21, 11],
        [15, 13, 23, 17, 9],
        [19, 5, 3, 7, 1]
      ],
      visited: [[0, 0], [0, 1], [1, 0], [0, 2], [1, 1]],
      currentCell: [0, 1],
      currentTime: 2,
      output: null
    },
    {
      stepIndex: 4,
      narration: "Line 4: Pop min root [t: 4, (0, 2)]. Water rises to t = 4. Swimmer moves to (0, 2).",
      state: { minHeap: "[[16, 1, 0], [18, 1, 1]]" },
      grid: [
        [0, 2, 4, 6, 8],
        [16, 18, 20, 22, 10],
        [14, 12, 24, 21, 11],
        [15, 13, 23, 17, 9],
        [19, 5, 3, 7, 1]
      ],
      visited: [[0, 0], [0, 1], [1, 0], [0, 2], [1, 1]],
      currentCell: [0, 2],
      currentTime: 4,
      output: null
    },
    {
      stepIndex: 5,
      narration: "Line 10: From (0, 2): push (0, 3) [req t=max(4, 6)=6] and (1, 2) [req t=max(4, 20)=20].",
      state: { minHeap: "[[6, 0, 3], [16, 1, 0], [18, 1, 1], [20, 1, 2]]" },
      grid: [
        [0, 2, 4, 6, 8],
        [16, 18, 20, 22, 10],
        [14, 12, 24, 21, 11],
        [15, 13, 23, 17, 9],
        [19, 5, 3, 7, 1]
      ],
      visited: [[0, 0], [0, 1], [1, 0], [0, 2], [1, 1], [0, 3], [1, 2]],
      currentCell: [0, 2],
      currentTime: 4,
      output: null
    },
    {
      stepIndex: 6,
      narration: "Line 4: Pop min root [t: 6, (0, 3)]. Water rises to t = 6. Swimmer moves to (0, 3).",
      state: { minHeap: "[[16, 1, 0], [18, 1, 1], [20, 1, 2]]" },
      grid: [
        [0, 2, 4, 6, 8],
        [16, 18, 20, 22, 10],
        [14, 12, 24, 21, 11],
        [15, 13, 23, 17, 9],
        [19, 5, 3, 7, 1]
      ],
      visited: [[0, 0], [0, 1], [1, 0], [0, 2], [1, 1], [0, 3], [1, 2]],
      currentCell: [0, 3],
      currentTime: 6,
      output: null
    },
    {
      stepIndex: 7,
      narration: "Line 10: From (0, 3): push (0, 4) [req t=max(6, 8)=8] and (1, 3) [req t=max(6, 22)=22].",
      state: { minHeap: "[[8, 0, 4], [16, 1, 0], [18, 1, 1], [20, 1, 2], [22, 1, 3]]" },
      grid: [
        [0, 2, 4, 6, 8],
        [16, 18, 20, 22, 10],
        [14, 12, 24, 21, 11],
        [15, 13, 23, 17, 9],
        [19, 5, 3, 7, 1]
      ],
      visited: [[0, 0], [0, 1], [1, 0], [0, 2], [1, 1], [0, 3], [1, 2], [0, 4], [1, 3]],
      currentCell: [0, 3],
      currentTime: 6,
      output: null
    },
    {
      stepIndex: 8,
      narration: "Line 4: Pop min root [t: 8, (0, 4)]. Water rises to t = 8. Swimmer turns down east edge.",
      state: { minHeap: "[[16, 1, 0], [18, 1, 1], [20, 1, 2], [22, 1, 3]]" },
      grid: [
        [0, 2, 4, 6, 8],
        [16, 18, 20, 22, 10],
        [14, 12, 24, 21, 11],
        [15, 13, 23, 17, 9],
        [19, 5, 3, 7, 1]
      ],
      visited: [[0, 0], [0, 1], [1, 0], [0, 2], [1, 1], [0, 3], [1, 2], [0, 4], [1, 3]],
      currentCell: [0, 4],
      currentTime: 8,
      output: null
    },
    {
      stepIndex: 9,
      narration: "Line 10: From (0, 4): push (1, 4) [req t=max(8, 10)=10]. Added to heap.",
      state: { minHeap: "[[10, 1, 4], [16, 1, 0], [18, 1, 1], [20, 1, 2], [22, 1, 3]]" },
      grid: [
        [0, 2, 4, 6, 8],
        [16, 18, 20, 22, 10],
        [14, 12, 24, 21, 11],
        [15, 13, 23, 17, 9],
        [19, 5, 3, 7, 1]
      ],
      visited: [[0, 0], [0, 1], [1, 0], [0, 2], [1, 1], [0, 3], [1, 2], [0, 4], [1, 3], [1, 4]],
      currentCell: [0, 4],
      currentTime: 8,
      output: null
    },
    {
      stepIndex: 10,
      narration: "Line 4: Pop min root [t: 10, (1, 4)]. Water rises to t = 10. Swimmer reaches (1, 4).",
      state: { minHeap: "[[16, 1, 0], [18, 1, 1], [20, 1, 2], [22, 1, 3]]" },
      grid: [
        [0, 2, 4, 6, 8],
        [16, 18, 20, 22, 10],
        [14, 12, 24, 21, 11],
        [15, 13, 23, 17, 9],
        [19, 5, 3, 7, 1]
      ],
      visited: [[0, 0], [0, 1], [1, 0], [0, 2], [1, 1], [0, 3], [1, 2], [0, 4], [1, 3], [1, 4]],
      currentCell: [1, 4],
      currentTime: 10,
      output: null
    },
    {
      stepIndex: 11,
      narration: "Line 10: From (1, 4): push (2, 4) [req t=max(10, 11)=11].",
      state: { minHeap: "[[11, 2, 4], [16, 1, 0], [18, 1, 1], [20, 1, 2], [22, 1, 3]]" },
      grid: [
        [0, 2, 4, 6, 8],
        [16, 18, 20, 22, 10],
        [14, 12, 24, 21, 11],
        [15, 13, 23, 17, 9],
        [19, 5, 3, 7, 1]
      ],
      visited: [[0, 0], [0, 1], [1, 0], [0, 2], [1, 1], [0, 3], [1, 2], [0, 4], [1, 3], [1, 4], [2, 4]],
      currentCell: [1, 4],
      currentTime: 10,
      output: null
    },
    {
      stepIndex: 12,
      narration: "Line 4: Pop min root [t: 11, (2, 4)]. Water rises to t = 11. Push neighbor (3, 4) [req t=max(11, 9)=11].",
      state: { minHeap: "[[11, 3, 4], [16, 1, 0], [18, 1, 1], [20, 1, 2], [22, 1, 3]]" },
      grid: [
        [0, 2, 4, 6, 8],
        [16, 18, 20, 22, 10],
        [14, 12, 24, 21, 11],
        [15, 13, 23, 17, 9],
        [19, 5, 3, 7, 1]
      ],
      visited: [[0, 0], [0, 1], [1, 0], [0, 2], [1, 1], [0, 3], [1, 2], [0, 4], [1, 3], [1, 4], [2, 4], [3, 4]],
      currentCell: [2, 4],
      currentTime: 11,
      output: null
    },
    {
      stepIndex: 13,
      narration: "Line 4: Pop min root [t: 11, (3, 4)]. Swimmer moves to (3, 4). Push destination neighbor (4, 4) [req t=max(11, 1)=11]!",
      state: { minHeap: "[[11, 4, 4], [16, 1, 0], [18, 1, 1], [20, 1, 2], [22, 1, 3]]" },
      grid: [
        [0, 2, 4, 6, 8],
        [16, 18, 20, 22, 10],
        [14, 12, 24, 21, 11],
        [15, 13, 23, 17, 9],
        [19, 5, 3, 7, 1]
      ],
      visited: [[0, 0], [0, 1], [1, 0], [0, 2], [1, 1], [0, 3], [1, 2], [0, 4], [1, 3], [1, 4], [2, 4], [3, 4], [4, 4]],
      currentCell: [3, 4],
      currentTime: 11,
      output: null
    },
    {
      stepIndex: 14,
      narration: "Line 5: Pop min root [t: 11, (4, 4)]. r == 4 AND c == 4. Bottom-right destination reached! RETURN t = 11.",
      state: { minHeap: "[]", status: "COMPLETED", minTime: 11 },
      grid: [
        [0, 2, 4, 6, 8],
        [16, 18, 20, 22, 10],
        [14, 12, 24, 21, 11],
        [15, 13, 23, 17, 9],
        [19, 5, 3, 7, 1]
      ],
      visited: [[0, 0], [0, 1], [1, 0], [0, 2], [1, 1], [0, 3], [1, 2], [0, 4], [1, 3], [1, 4], [2, 4], [3, 4], [4, 4]],
      currentCell: [4, 4],
      currentTime: 11,
      output: {
        label: "Minimum Water Height (5x5)",
        value: "t = 11",
        detail: "Path (0,0)->(0,1)->(0,2)->(0,3)->(0,4)->(1,4)->(2,4)->(3,4)->(4,4) bypasses central high peaks."
      }
    }
  ]
};

export default function Swim() {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  // Subscribe to theme directly from context
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIdx((prev) => (prev + 1) % problemPayload.steps.length);
    }, 2200);

    return () => clearInterval(timer);
  }, []);

  const stepData = problemPayload.steps[currentStepIdx];

  const {
    grid = [],
    visited = [],
    currentCell = [0, 0],
    currentTime = 0,
    state = {},
    output,
    narration
  } = stepData;

  const N = grid.length || 5;
  const targetCell = [N - 1, N - 1];

  let heapItems = [];
  try {
    heapItems = typeof state.minHeap === "string" ? JSON.parse(state.minHeap) : state.minHeap || [];
  } catch {
    heapItems = [];
  }

  const visitedSet = new Set(visited.map(([r, c]) => `${r},${c}`));
  const [currR, currC] = currentCell || [0, 0];
  const maxGridVal = Math.max(...grid.flat(), 24);

  return (
    <div id="psw-swim-canvas" data-theme={theme}>
      {/* Top Metric Bar */}
      <div id="psw-metrics-bar">
        <span id="psw-metric-water">
          Water Level: <b>t = {currentTime}</b>
        </span>
        <span id="psw-metric-swimmer">
          Swimmer: <b>({currR}, {currC})</b>
        </span>
        <span id="psw-metric-heap">
          Min-Heap Size: <b>{heapItems.length}</b>
        </span>
        <span id="psw-metric-target">
          Target: <b>({targetCell[0]}, {targetCell[1]})</b>
        </span>
      </div>

      {/* Main Grid & Heap Stage */}
      <div id="psw-swim-stage">
        {/* Terrain Grid Card */}
        <div id="psw-water-grid-card">
          <div id="psw-grid-header-label">5x5 Elevation Terrain Grid</div>
          <div
            id="psw-terrain-grid"
            style={{
              gridTemplateColumns: `repeat(${N}, minmax(0, 1fr))`
            }}
          >
            {grid.map((row, r) =>
              row.map((elevation, c) => {
                const isCurrent = currR === r && currC === c;
                const isVisited = visitedSet.has(`${r},${c}`);
                const isSubmerged = elevation <= currentTime;

                let cellState = "dry";
                if (isCurrent) cellState = "active";
                else if (isSubmerged) cellState = "submerged";

                return (
                  <motion.div
                    key={`psw-cell-${r}-${c}`}
                    id={`psw-terrain-cell-${r}-${c}`}
                    data-cell-state={cellState}
                    layout
                    animate={{
                      scale: isCurrent ? 1.05 : 1
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 22 }}
                  >
                    <AnimatePresence>
                      {isSubmerged && (
                        <motion.div
                          id={`psw-water-surface-fill-${r}-${c}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.25 }}
                        />
                      )}
                    </AnimatePresence>

                    <div id={`psw-cell-content-${r}-${c}`}>
                      <span id={`psw-elevation-val-${r}-${c}`}>{elevation}</span>
                      <span id={`psw-cell-coord-${r}-${c}`}>({r},{c})</span>
                    </div>

                    {isCurrent && (
                      <motion.div
                        id={`psw-swimmer-pin-${r}-${c}`}
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      >
                        🏊
                      </motion.div>
                    )}

                    {isVisited && (
                      <span id={`psw-visited-dot-${r}-${c}`} />
                    )}
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Priority Queue (Min-Heap) Inspection */}
        <div id="psw-heap-panel">
          <div id="psw-panel-title">Min-Heap Priority Queue [T, R, C]</div>
          <div id="psw-heap-stream">
            {heapItems.length === 0 ? (
              <span id="psw-heap-empty">Queue empty / expanding...</span>
            ) : (
              heapItems.map(([timeVal, hr, hc], idx) => {
                const isNextMin = idx === 0;

                return (
                  <motion.div
                    key={`psw-heap-${hr}-${hc}-${timeVal}-${idx}`}
                    id={`psw-heap-chip-${hr}-${hc}-${idx}`}
                    data-is-min={isNextMin ? "true" : "false"}
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div id={`psw-heap-min-tag-${hr}-${hc}-${idx}`}>
                      {isNextMin ? "MIN ROOT" : `#${idx + 1}`}
                    </div>
                    <div id={`psw-heap-coords-${hr}-${hc}-${idx}`}>({hr}, {hc})</div>
                    <div id={`psw-heap-time-${hr}-${hc}-${idx}`}>Req: t={timeVal}</div>
                  </motion.div>
                );
              })
            )}
          </div>

          <div id="psw-water-level-meter">
            <span id="psw-meter-label">Global Water Level ({currentTime} / {maxGridVal})</span>
            <div id="psw-meter-bar-track">
              <motion.div
                id="psw-meter-bar-fill"
                animate={{ width: `${Math.min(100, (currentTime / maxGridVal) * 100)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Narration & Result Banner */}
      <div id="psw-result-callout-box">
        {output ? (
          <>
            <div id="psw-callout-header-text">{output.label}</div>
            <div id="psw-callout-val-text">{output.value}</div>
          </>
        ) : (
          <div id="psw-callout-detail-text">{narration}</div>
        )}
      </div>
    </div>
  );
}