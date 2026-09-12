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
    <div key={`p4-row-${arrayKey}`} id={`p4-array-row-${arrayKey}`}>
      <div id={`p4-array-label-box-${arrayKey}`}>
        <span id={`p4-array-label-name-${arrayKey}`}>{label}</span>
        <span id={`p4-cut-indicator-${arrayKey}`}>
          {cutVarName} = {partitionIndex}
        </span>
      </div>

      <div id={`p4-partition-track-${arrayKey}`}>
        {/* Left half before partition */}
        <div id={`p4-partition-half-left-${arrayKey}`}>
          {arr.slice(0, partitionIndex).map((val, idx) => (
            <motion.div
              key={`p4-left-${arrayKey}-${idx}-${val}`}
              id={`p4-number-box-left-${arrayKey}-${idx}`}
              data-side="left"
              layout
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <span id={`p4-box-val-left-${arrayKey}-${idx}`}>{val}</span>
              <span id={`p4-box-idx-left-${arrayKey}-${idx}`}>[{idx}]</span>
            </motion.div>
          ))}
          {partitionIndex === 0 && (
            <span id={`p4-empty-slot-left-${arrayKey}`}>-INF</span>
          )}
        </div>

        {/* Partition Divider Line */}
        <div id={`p4-partition-line-${arrayKey}`}>
          <span id={`p4-line-bar-top-${arrayKey}`} />
          <span id={`p4-cut-tag-${arrayKey}`}>Cut</span>
          <span id={`p4-line-bar-bottom-${arrayKey}`} />
        </div>

        {/* Right half after partition */}
        <div id={`p4-partition-half-right-${arrayKey}`}>
          {arr.slice(partitionIndex).map((val, idx) => {
            const actualIdx = partitionIndex + idx;
            return (
              <motion.div
                key={`p4-right-${arrayKey}-${actualIdx}-${val}`}
                id={`p4-number-box-right-${arrayKey}-${actualIdx}`}
                data-side="right"
                layout
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <span id={`p4-box-val-right-${arrayKey}-${actualIdx}`}>{val}</span>
                <span id={`p4-box-idx-right-${arrayKey}-${actualIdx}`}>[{actualIdx}]</span>
              </motion.div>
            );
          })}
          {partitionIndex === arr.length && (
            <span id={`p4-empty-slot-right-${arrayKey}`}>+INF</span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div id="p4-partition-canvas">
      {/* Search Range & Boundary Status Banner */}
      <div id="p4-metrics-banner">
        {low !== undefined && high !== undefined && (
          <span id="p4-metric-chip-range">
            Search Range: low = <b>{low}</b>, high = <b>{high}</b>
          </span>
        )}
        {maxLeft1 !== undefined && (
          <span id="p4-metric-chip-bounds-1">
            maxLeft1: <b>{String(maxLeft1)}</b> | minRight1: <b>{String(minRight1)}</b>
          </span>
        )}
        {maxLeft2 !== undefined && (
          <span id="p4-metric-chip-bounds-2">
            maxLeft2: <b>{String(maxLeft2)}</b> | minRight2: <b>{String(minRight2)}</b>
          </span>
        )}
      </div>

      {/* Dual Partitioned Arrays */}
      <div id="p4-arrays-container">
        {renderPartitionedArray(nums1, partition1, "nums1 (Smaller)", "i", "nums1")}
        {renderPartitionedArray(nums2, partition2, "nums2", "j", "nums2")}
      </div>

      {/* Condition Check */}
      {maxLeft1 !== undefined && minRight2 !== undefined && (
        <div id="p4-condition-indicator-card">
          <span id="p4-condition-prefix-label">Condition: </span>
          <b id={isValidCondition ? "p4-condition-check-valid" : "p4-condition-check-invalid"}>
            {maxLeft1} ≤ {minRight2} &amp; {maxLeft2} ≤ {minRight1}
          </b>
        </div>
      )}

      {/* Result Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p4-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div id="p4-callout-header-text">{output.label}</div>
            <div id="p4-callout-val-text">{output.value}</div>
            <div id="p4-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}