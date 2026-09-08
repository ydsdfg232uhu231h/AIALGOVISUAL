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
    <div className="canvas-wrapper lcs-canvas">
      {/* Metrics Row */}
      <div className="metrics-row">
        {i !== null && j !== null && (
          <>
            <span className="metric-chip cell-chip">
              Cell: <b>[{i}][{j}]</b>
            </span>
            <span className={`metric-chip ${isMatch ? "match-chip" : "mismatch-chip"}`}>
              '{text1[i]}' vs '{text2[j]}':{" "}
              <b>{isMatch ? "MATCH (1 + dp[i+1][j+1])" : "MISMATCH (max(down, right))"}</b>
            </span>
          </>
        )}
        {lcsLength !== undefined && (
          <span className="metric-chip result-chip">
            LCS Length: <b>{lcsLength}</b>
          </span>
        )}
      </div>

      {/* 2D DP Table */}
      <div className="matrix-card">
        {/* Column Headers: text2 chars */}
        <div className="matrix-row col-headers-row">
          <div className="header-cell corner-cell">t1 \ t2</div>
          {text2.split("").map((ch, colIdx) => (
            <div
              key={`header-col-${colIdx}`}
              className={`header-cell col-header ${j === colIdx ? "header-active" : ""}`}
            >
              <span className="char-letter">{ch}</span>
              <span className="char-idx">[{colIdx}]</span>
            </div>
          ))}
          <div className="header-cell col-header base-header">
            <span className="char-letter">Ø</span>
            <span className="char-idx">[{text2.length}]</span>
          </div>
        </div>

        {/* Matrix Rows: text1 chars + table cells */}
        {dpTable.map((row, rowIdx) => {
          const rowChar = rowIdx < text1.length ? text1[rowIdx] : "Ø";
          const isCurrentRow = i === rowIdx;

          return (
            <div key={`row-${rowIdx}`} className="matrix-row">
              {/* Row Header */}
              <div
                className={`header-cell row-header ${isCurrentRow ? "header-active" : ""} ${
                  rowIdx === text1.length ? "base-header" : ""
                }`}
              >
                <span className="char-letter">{rowChar}</span>
                <span className="char-idx">[{rowIdx}]</span>
              </div>

              {/* Table Data Cells */}
              {row.map((val, colIdx) => {
                const isCurrent = i === rowIdx && j === colIdx;
                const isDiagDependency = isMatch && i + 1 === rowIdx && j + 1 === colIdx;
                const isDownDependency = !isMatch && i !== null && i + 1 === rowIdx && j === colIdx;
                const isRightDependency = !isMatch && j !== null && i === rowIdx && j + 1 === colIdx;
                const isTargetCell = isComplete && rowIdx === 0 && colIdx === 0;

                return (
                  <motion.div
                    key={`cell-${rowIdx}-${colIdx}`}
                    className={`dp-cell ${isCurrent ? "cell-curr" : ""} ${
                      isDiagDependency ? "cell-dep-diag" : ""
                    } ${isDownDependency || isRightDependency ? "cell-dep-max" : ""} ${
                      isTargetCell ? "cell-final" : ""
                    } ${rowIdx === text1.length || colIdx === text2.length ? "cell-base" : ""}`}
                    animate={{
                      scale: isCurrent || isTargetCell ? 1.08 : 1
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="cell-val">{val}</span>
                  </motion.div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Output Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="result-callout"
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