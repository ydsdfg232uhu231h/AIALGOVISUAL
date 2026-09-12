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
    <div id="p23-merge-k-canvas">
      {/* Top Metrics Row */}
      <div id="p23-metrics-bar">
        <span id="p23-metric-k-lists">
          Total Lists: <b>k = {lists.length}</b>
        </span>

        <span id="p23-metric-heap-size">
          Min-Heap Size: <b>{heap.length} elements</b>
        </span>

        <span id="p23-metric-merged-size">
          Merged Nodes: <b>{merged.length} nodes</b>
        </span>

        {poppedNode ? (
          <span id="p23-metric-popped-active">
            Smallest Popped: <b>{poppedNode.val} (L{poppedNode.listIdx})</b>
          </span>
        ) : (
          <span id="p23-metric-popped-idle">
            Smallest Popped: <b>None</b>
          </span>
        )}

        <span id={isCompleted ? "p23-metric-status-done" : "p23-metric-status-active"}>
          Status: <b>{isCompleted ? "ALL MERGED ✓" : "EXTRACT MIN & ADVANCE"}</b>
        </span>
      </div>

      <div id="p23-merge-k-stage">
        {/* Stage 1: Input K Lists Surface */}
        <div id="p23-k-lists-card">
          <div id="p23-k-lists-header">
            <span id="p23-k-lists-title">1. Original k Sorted Lists (`lists`)</span>
            <span id="p23-k-lists-sub">Pointers advance as nodes enter the min-heap</span>
          </div>

          <div id="p23-k-lists-viewport">
            {lists.map((row, lIdx) => {
              const ptrIdx = listPointers[lIdx] ?? 0;

              return (
                <div key={`p23-list-row-${lIdx}`} id={`p23-k-list-row-${lIdx}`}>
                  <span id={`p23-list-label-${lIdx}`}>L{lIdx}:</span>

                  <div id={`p23-nodes-chain-${lIdx}`}>
                    {row.map((val, nIdx) => {
                      const isCurrentHead = nIdx === ptrIdx && !isCompleted;
                      const isPopped = poppedNode?.listIdx === lIdx && poppedNode?.val === val && nIdx === ptrIdx - 1;
                      const isConsumed = nIdx < ptrIdx && !isPopped;

                      let nodeState = "idle";
                      if (isPopped) nodeState = "popped";
                      else if (isCurrentHead) nodeState = "head";
                      else if (isConsumed) nodeState = "consumed";

                      return (
                        <React.Fragment key={`p23-k-node-frag-${lIdx}-${nIdx}`}>
                          <motion.div
                            id={`p23-k-node-${lIdx}-${nIdx}`}
                            data-state={nodeState}
                            layout
                            animate={{ scale: isCurrentHead || isPopped ? 1.1 : 1 }}
                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                          >
                            <span id={`p23-node-val-${lIdx}-${nIdx}`}>{val}</span>
                            {isCurrentHead && <span id={`p23-head-tag-${lIdx}`}>PTR</span>}
                          </motion.div>

                          {nIdx < row.length - 1 && (
                            <span
                              id={`p23-arrow-${lIdx}-${nIdx}`}
                              data-consumed={isConsumed ? "true" : "false"}
                            >
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
        <div id="p23-middle-stage-grid">
          {/* Min-Heap Chamber */}
          <div id="p23-heap-chamber-card">
            <div id="p23-heap-card-header">
              <span id="p23-heap-header-title">2. Min-Heap Priority Queue</span>
              <span id="p23-heap-header-sub">Root holds global minimum O(log k)</span>
            </div>

            <div id="p23-heap-chamber-viewport">
              <AnimatePresence mode="popLayout">
                {heap.length === 0 ? (
                  <span id="p23-heap-empty-text">Min-Heap is Empty</span>
                ) : (
                  heap.map((item, idx) => {
                    const isMin = idx === 0;
                    const val = typeof item === "object" ? item.val : item;
                    const listTag = typeof item === "object" && item.listIdx !== undefined ? `L${item.listIdx}` : null;

                    return (
                      <motion.div
                        key={`p23-heap-node-${idx}-${val}-${listTag || "x"}`}
                        id={`p23-heap-pill-${idx}`}
                        data-min={isMin ? "true" : "false"}
                        layout
                        initial={{ opacity: 0, scale: 0.6, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ type: "spring", stiffness: 360, damping: 24 }}
                      >
                        <span id={`p23-heap-pill-val-${idx}`}>{val}</span>
                        {listTag && <span id={`p23-heap-pill-tag-${idx}`}>{listTag}</span>}
                        {isMin && <span id="p23-heap-min-badge">MIN</span>}
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Popped Extractor Action Panel */}
          <div id="p23-action-inspector-card">
            <div id="p23-action-card-header">
              <span id="p23-action-header-title">Heap Operations</span>
              <span id="p23-action-header-sub">Pop smallest node & push next</span>
            </div>

            <div id="p23-action-grid">
              <div id="p23-action-box-pop">
                <span id="p23-action-title-pop">Extracted from Heap:</span>
                <span id="p23-action-val-pop">
                  {poppedNode ? `Node (${poppedNode.val}) from List ${poppedNode.listIdx}` : "Waiting for extraction..."}
                </span>
              </div>

              <div id="p23-action-box-next">
                <span id="p23-action-title-next">Next Heap Push:</span>
                <span id="p23-action-val-next">
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
        <div id="p23-merged-track-card">
          <div id="p23-merged-card-header">
            <span id="p23-merged-header-title">3. Merged Sorted Result List (`dummy.next`)</span>
            <span id="p23-merged-header-sub">Sequentially accumulated sorted chain</span>
          </div>

          <div id="p23-merged-elements-track">
            <AnimatePresence mode="popLayout">
              {merged.length === 0 ? (
                <span id="p23-merged-empty-text">Result list is empty...</span>
              ) : (
                <div id="p23-merged-chain-container">
                  {merged.map((val, idx) => {
                    const isNewest = idx === merged.length - 1 && !isCompleted;
                    let nodeState = "idle";
                    if (isCompleted) nodeState = "done";
                    else if (isNewest) nodeState = "active";

                    return (
                      <React.Fragment key={`p23-merged-${idx}-${val}`}>
                        <motion.div
                          id={`p23-merged-node-${idx}`}
                          data-state={nodeState}
                          layout
                          initial={{ opacity: 0, scale: 0.6, x: 20 }}
                          animate={{ opacity: 1, scale: 1, x: 0 }}
                          transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        >
                          <span id={`p23-merged-val-${idx}`}>{val}</span>
                        </motion.div>

                        {idx < merged.length - 1 && (
                          <span id={`p23-merged-arrow-${idx}`}>→</span>
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
            id="p23-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
          >
            <div id="p23-callout-header-text">{output.label}</div>
            <div id="p23-callout-val-text">{output.value}</div>
            <div id="p23-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}