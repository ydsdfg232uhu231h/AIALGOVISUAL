import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem4.css";

export default function Problem4({ stepData }) {
  const {
    nums1 = [],
    nums2 = [],
    partition1 = 0,
    partition2 = 0,
    state = {},
    output
  } = stepData || {};

  const {
    low,
    high,
    i,
    j,
    maxLeft1,
    minRight1,
    maxLeft2,
    minRight2,
    median
  } = state;

  const isValidCondition =
    maxLeft1 !== undefined &&
    minRight2 !== undefined &&
    (maxLeft1 === "-INF" || maxLeft1 <= (minRight2 === "INF" ? Infinity : minRight2)) &&
    (maxLeft2 === "-INF" || maxLeft2 <= (minRight1 === "INF" ? Infinity : minRight1));

  const renderPartitionedArray = (arr, partitionIndex, label, cutVarName, arrayKey) => (
    <div key={arrayKey} id={`array-row-${arrayKey}`}>
      <div id={`array-label-box-${arrayKey}`}>
        <span id={`array-label-name-${arrayKey}`}>{label}</span>
        <span id={`cut-indicator-${arrayKey}`}>
          {cutVarName} = {partitionIndex}
        </span>
      </div>

      <div id={`partition-track-${arrayKey}`}>
        {/* Left half before partition */}
        <div id={`partition-half-left-${arrayKey}`}>
          {arr.slice(0, partitionIndex).map((val, idx) => (
            <motion.div
              key={`left-${arrayKey}-${idx}-${val}`}
              id={`number-box-left-${arrayKey}-${idx}`}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {val}
              <span id={`box-idx-left-${arrayKey}-${idx}`}>[{idx}]</span>
            </motion.div>
          ))}
          {partitionIndex === 0 && (
            <span id={`empty-slot-left-${arrayKey}`}>-INF</span>
          )}
        </div>

        {/* Partition Divider Line */}
        <div id={`partition-line-${arrayKey}`}>
          <span id={`line-bar-top-${arrayKey}`} />
          <span id={`cut-tag-${arrayKey}`}>Cut</span>
          <span id={`line-bar-bottom-${arrayKey}`} />
        </div>

        {/* Right half after partition */}
        <div id={`partition-half-right-${arrayKey}`}>
          {arr.slice(partitionIndex).map((val, idx) => {
            const actualIdx = partitionIndex + idx;
            return (
              <motion.div
                key={`right-${arrayKey}-${actualIdx}-${val}`}
                id={`number-box-right-${arrayKey}-${actualIdx}`}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {val}
                <span id={`box-idx-right-${arrayKey}-${actualIdx}`}>[{actualIdx}]</span>
              </motion.div>
            );
          })}
          {partitionIndex === arr.length && (
            <span id={`empty-slot-right-${arrayKey}`}>+INF</span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div id="partition-canvas">
      {/* Search Range & Boundary Status Banner */}
      <div id="metrics-banner">
        {low !== undefined && high !== undefined && (
          <span id="metric-chip-range">
            Search Range: low = <b>{low}</b>, high = <b>{high}</b>
          </span>
        )}
        {maxLeft1 !== undefined && (
          <span id="metric-chip-bounds-1">
            maxLeft1: <b>{String(maxLeft1)}</b> | minRight1: <b>{String(minRight1)}</b>
          </span>
        )}
        {maxLeft2 !== undefined && (
          <span id="metric-chip-bounds-2">
            maxLeft2: <b>{String(maxLeft2)}</b> | minRight2: <b>{String(minRight2)}</b>
          </span>
        )}
      </div>

      {/* Dual Partitioned Arrays */}
      <div id="arrays-container">
        {renderPartitionedArray(nums1, partition1, "nums1 (Smaller)", "i", "nums1")}
        {renderPartitionedArray(nums2, partition2, "nums2", "j", "nums2")}
      </div>

      {/* Condition Check */}
      {maxLeft1 !== undefined && minRight2 !== undefined && (
        <div id="condition-indicator-card">
          <span id="condition-prefix-label">Condition: </span>
          <b id={isValidCondition ? "condition-check-valid" : "condition-check-invalid"}>
            {maxLeft1} ≤ {minRight2} &amp; {maxLeft2} ≤ {minRight1}
          </b>
        </div>
      )}

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