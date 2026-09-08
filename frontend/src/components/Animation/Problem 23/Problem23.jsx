import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem23.css";

export default function Problem23({ stepData }) {
  const {
    lists = [
      [1, 4, 5],
      [1, 3, 4],
      [2, 6]
    ],
    listPointers = [0, 0, 0], // Current index pointers in each of the k lists
    heap = [1, 1, 2], // Current elements in min-heap
    merged = [],
    poppedNode = null, // e.g. { val: 1, listIdx: 0 }
    isCompleted = false,
    output
  } = stepData || {};

  return (
    <div id="merge-k-canvas">
      {/* Top Metrics Row */}
      <div id="metrics-bar">
        <span id="metric-k-lists">
          Total Lists: <b>k = {lists.length}</b>
        </span>

        <span id="metric-heap-size">
          Min-Heap Size: <b>{heap.length} elements</b>
        </span>

        <span id="metric-merged-size">
          Merged Nodes: <b>{merged.length} nodes</b>
        </span>

        {poppedNode ? (
          <span id="metric-popped-active">
            Smallest Popped: <b>{poppedNode.val} (L{poppedNode.listIdx})</b>
          </span>
        ) : (
          <span id="metric-popped-idle">
            Smallest Popped: <b>None</b>
          </span>
        )}

        <span id={isCompleted ? "metric-status-done" : "metric-status-active"}>
          Status: <b>{isCompleted ? "ALL MERGED ✓" : "EXTRACT MIN & ADVANCE"}</b>
        </span>
      </div>

      <div id="merge-k-stage">
        {/* Stage 1: Input K Lists Surface */}
        <div id="k-lists-card">
          <div id="k-lists-header">
            <span id="k-lists-title">1. Original k Sorted Lists (`lists`)</span>
            <span id="k-lists-sub">Pointers advance as nodes enter the min-heap</span>
          </div>

          <div id="k-lists-viewport">
            {lists.map((row, lIdx) => {
              const ptrIdx = listPointers[lIdx] ?? 0;

              return (
                <div key={`list-row-${lIdx}`} id={`k-list-row-${lIdx}`}>
                  <span id={`list-label-${lIdx}`}>L{lIdx}:</span>

                  <div id={`nodes-chain-${lIdx}`}>
                    {row.map((val, nIdx) => {
                      const isCurrentHead = nIdx === ptrIdx && !isCompleted;
                      const isPopped = poppedNode?.listIdx === lIdx && poppedNode?.val === val && nIdx === ptrIdx - 1;
                      const isConsumed = nIdx < ptrIdx && !isPopped;

                      let nodeId = `node-idle-${lIdx}-${nIdx}`;
                      if (isPopped) nodeId = `node-popped-${lIdx}-${nIdx}`;
                      else if (isCurrentHead) nodeId = `node-head-${lIdx}-${nIdx}`;
                      else if (isConsumed) nodeId = `node-consumed-${lIdx}-${nIdx}`;

                      return (
                        <React.Fragment key={`k-node-${lIdx}-${nIdx}`}>
                          <motion.div
                            id={nodeId}
                            animate={{ scale: isCurrentHead || isPopped ? 1.1 : 1 }}
                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                          >
                            <span id={`node-val-${lIdx}-${nIdx}`}>{val}</span>
                            {isCurrentHead && <span id={`head-tag-${lIdx}`}>PTR</span>}
                          </motion.div>

                          {nIdx < row.length - 1 && (
                            <span id={isConsumed ? `arrow-dimmed-${lIdx}-${nIdx}` : `arrow-idle-${lIdx}-${nIdx}`}>
                              →
                            </span>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stage 2: Middle Row (Min-Heap Chamber & Extractor) */}
        <div id="middle-stage-grid">
          {/* Min-Heap Chamber */}
          <div id="heap-chamber-card">
            <div id="heap-card-header">
              <span id="heap-header-title">2. Min-Heap Priority Queue</span>
              <span id="heap-header-sub">Root holds global minimum O(log k)</span>
            </div>

            <div id="heap-chamber-viewport">
              <AnimatePresence mode="popLayout">
                {heap.length === 0 ? (
                  <span id="heap-empty-text">Min-Heap is Empty</span>
                ) : (
                  heap.map((item, idx) => {
                    const isMin = idx === 0;
                    const val = typeof item === "object" ? item.val : item;
                    const listTag = typeof item === "object" && item.listIdx !== undefined ? `L${item.listIdx}` : null;

                    return (
                      <motion.div
                        key={`heap-node-${idx}-${val}-${listTag || "x"}`}
                        id={isMin ? `heap-pill-min-${idx}` : `heap-pill-idle-${idx}`}
                        layout
                        initial={{ opacity: 0, scale: 0.6, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ type: "spring", stiffness: 360, damping: 24 }}
                      >
                        <span id={`heap-pill-val-${idx}`}>{val}</span>
                        {listTag && <span id={`heap-pill-tag-${idx}`}>{listTag}</span>}
                        {isMin && <span id="heap-min-badge">MIN</span>}
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Popped Extractor Action Panel */}
          <div id="action-inspector-card">
            <div id="action-card-header">
              <span id="action-header-title">Heap Operations</span>
              <span id="action-header-sub">Pop smallest node & push next</span>
            </div>

            <div id="action-grid">
              <div id="action-box-pop">
                <span id="action-title-pop">Extracted from Heap:</span>
                <span id="action-val-pop">
                  {poppedNode ? `Node (${poppedNode.val}) from List ${poppedNode.listIdx}` : "Waiting for extraction..."}
                </span>
              </div>

              <div id="action-box-next">
                <span id="action-title-next">Next Heap Push:</span>
                <span id="action-val-next">
                  {poppedNode && lists[poppedNode.listIdx]?.[listPointers[poppedNode.listIdx]] !== undefined
                    ? `Push Node (${lists[poppedNode.listIdx][listPointers[poppedNode.listIdx]]}) from L${poppedNode.listIdx}`
                    : poppedNode
                    ? `List ${poppedNode.listIdx} reached NULL`
                    : "---"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stage 3: Merged Result Linked List */}
        <div id="merged-track-card">
          <div id="merged-card-header">
            <span id="merged-header-title">3. Merged Sorted Result List (`dummy.next`)</span>
            <span id="merged-header-sub">Sequentially accumulated sorted chain</span>
          </div>

          <div id="merged-elements-track">
            <AnimatePresence mode="popLayout">
              {merged.length === 0 ? (
                <span id="merged-empty-text">Result list is empty...</span>
              ) : (
                <div id="merged-chain-container">
                  {merged.map((val, idx) => {
                    const isNewest = idx === merged.length - 1 && !isCompleted;
                    let pillId = `merged-node-idle-${idx}`;
                    if (isCompleted) pillId = `merged-node-done-${idx}`;
                    else if (isNewest) pillId = `merged-node-active-${idx}`;

                    return (
                      <React.Fragment key={`merged-${idx}-${val}`}>
                        <motion.div
                          id={pillId}
                          layout
                          initial={{ opacity: 0, scale: 0.6, x: 20 }}
                          animate={{ opacity: 1, scale: 1, x: 0 }}
                          transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        >
                          <span id={`merged-val-${idx}`}>{val}</span>
                        </motion.div>

                        {idx < merged.length - 1 && (
                          <span id={`merged-arrow-${idx}`}>→</span>
                        )}
                      </React.Fragment>
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