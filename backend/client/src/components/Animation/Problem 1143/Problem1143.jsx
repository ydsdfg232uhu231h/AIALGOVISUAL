import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem1143.css";

export default function Problem1143({ stepData }) {
  const {
    dpTable = [],
    i = null,
    j = null,
    state = {},
    output
  } = stepData || {};

  const text1 = "abcde";
  const text2 = "ace";

  const { match, lcsLength, status } = state;
  const isComplete = status === "COMPLETED";

  const isMatch = i !== null && j !== null && text1[i] === text2[j];

  return (
    <div id="p1143-lcs-canvas">
      {/* Metrics Row */}
      <div id="p1143-metrics-bar">
        {i !== null && j !== null && (
          <>
            <span id="p1143-metric-cell">
              Cell: <b>[{i}][{j}]</b>
            </span>
            <span
              id="p1143-metric-match"
              data-is-match={isMatch ? "true" : "false"}
            >
              '{text1[i]}' vs '{text2[j]}':{" "}
              <b>{isMatch ? "MATCH (1 + dp[i+1][j+1])" : "MISMATCH (max(down, right))"}</b>
            </span>
          </>
        )}
        {lcsLength !== undefined && (
          <span id="p1143-metric-result">
            LCS Length: <b>{lcsLength}</b>
          </span>
        )}
      </div>

      {/* 2D DP Table */}
      <div id="p1143-matrix-card">
        {/* Column Headers: text2 chars */}
        <div id="p1143-matrix-header-row">
          <div id="p1143-corner-cell">t1 \ t2</div>
          {text2.split("").map((ch, colIdx) => (
            <div
              key={`p1143-header-col-${colIdx}`}
              id={`p1143-col-header-${colIdx}`}
              data-is-active={j === colIdx ? "true" : "false"}
            >
              <span id={`p1143-col-char-${colIdx}`}>{ch}</span>
              <span id={`p1143-col-idx-${colIdx}`}>[{colIdx}]</span>
            </div>
          ))}
          <div
            id="p1143-col-header-base"
            data-is-base="true"
          >
            <span id="p1143-col-char-base">Ø</span>
            <span id="p1143-col-idx-base">[{text2.length}]</span>
          </div>
        </div>

        {/* Matrix Rows: text1 chars + table cells */}
        {dpTable.map((row, rowIdx) => {
          const rowChar = rowIdx < text1.length ? text1[rowIdx] : "Ø";
          const isCurrentRow = i === rowIdx;
          const isBaseRow = rowIdx === text1.length;

          return (
            <div key={`p1143-row-${rowIdx}`} id={`p1143-matrix-row-${rowIdx}`}>
              {/* Row Header */}
              <div
                id={`p1143-row-header-${rowIdx}`}
                data-is-active={isCurrentRow ? "true" : "false"}
                data-is-base={isBaseRow ? "true" : "false"}
              >
                <span id={`p1143-row-char-${rowIdx}`}>{rowChar}</span>
                <span id={`p1143-row-idx-${rowIdx}`}>[{rowIdx}]</span>
              </div>

              {/* Table Data Cells */}
              {row.map((val, colIdx) => {
                const isCurrent = i === rowIdx && j === colIdx;
                const isDiagDependency = isMatch && i + 1 === rowIdx && j + 1 === colIdx;
                const isDownDependency = !isMatch && i !== null && i + 1 === rowIdx && j === colIdx;
                const isRightDependency = !isMatch && j !== null && i === rowIdx && j + 1 === colIdx;
                const isTargetCell = isComplete && rowIdx === 0 && colIdx === 0;
                const isBaseCell = rowIdx === text1.length || colIdx === text2.length;

                let cellState = "idle";
                if (isTargetCell) cellState = "final";
                else if (isCurrent) cellState = "curr";
                else if (isDiagDependency) cellState = "dep-diag";
                else if (isDownDependency || isRightDependency) cellState = "dep-max";
                else if (isBaseCell) cellState = "base";

                return (
                  <motion.div
                    key={`p1143-cell-${rowIdx}-${colIdx}`}
                    id={`p1143-cell-${rowIdx}-${colIdx}`}
                    data-cell-state={cellState}
                    layout
                    animate={{
                      scale: isCurrent || isTargetCell ? 1.08 : 1
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 24 }}
                  >
                    <span id={`p1143-cell-val-${rowIdx}-${colIdx}`}>{val}</span>
                  </motion.div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Output Callout (Elevated safely above playback controls) */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p1143-result-callout-box"
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ type: "spring", stiffness: 360, damping: 26 }}
          >
            <div id="p1143-callout-header-text">{output.label}</div>
            <div id="p1143-callout-val-text">{output.value}</div>
            <div id="p1143-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}