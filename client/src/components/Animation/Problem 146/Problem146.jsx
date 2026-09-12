import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem146.css";

export default function Problem146({ stepData }) {
  const {
    capacity = 2,
    nodes = [], // [{ id: "node-1", key: 1, val: 1 }, ...] ordered LRU -> MRU
    map = {}, // { "1": 1, "2": 2 }
    currentOp = "init",
    activeKey = null,
    evictedKey = null,
    output
  } = stepData || {};

  const normalizedOp = (typeof currentOp === "string" ? currentOp.toLowerCase() : "init");

  return (
    <div id="p146-lru-canvas">
      {/* Top Metrics Row */}
      <div id="p146-metrics-row">
        <span id="p146-metric-op" data-op={normalizedOp}>
          Op: <b>{String(currentOp).toUpperCase()}</b>
        </span>

        {activeKey !== null && (
          <span id="p146-metric-target">
            Key: <b>{activeKey}</b>
          </span>
        )}

        <span id="p146-metric-cap">
          Capacity: <b>{nodes.length} / {capacity}</b>
        </span>

        {evictedKey !== null && (
          <span id="p146-metric-evict">
            Evicted: <b>Key {evictedKey} (LRU)</b>
          </span>
        )}
      </div>

      {/* Main Stage */}
      <div id="p146-lru-stage">
        {/* Track 1: Doubly Linked List Usage Hierarchy */}
        <div id="p146-dll-card">
          <div id="p146-dll-card-header">
            <span id="p146-dll-header-title">1. Doubly Linked List (Usage Hierarchy)</span>
            <span id="p146-dll-header-sub">Left = LRU (Eviction candidate) ➔ Right = MRU (Most Recent)</span>
          </div>

          <div id="p146-dll-track-viewport">
            {/* Left Sentinel (LRU Head) */}
            <div id="p146-sentinel-left" data-sentinel="head">
              <span id="p146-sentinel-tag-left">HEAD</span>
              <span id="p146-sentinel-title-left">LEFT</span>
              <span id="p146-sentinel-sub-left">LRU</span>
            </div>

            <div id="p146-conduit-left">
              <span id="p146-arrow-next-left">⇄</span>
            </div>

            {/* Dynamic Cache Nodes */}
            <div id="p146-dll-nodes-wrapper">
              <AnimatePresence mode="popLayout" initial={false}>
                {nodes.map((node, idx) => {
                  const isLRU = idx === 0;
                  const isMRU = idx === nodes.length - 1;
                  const isActive = activeKey === node.key;

                  let nodeState = "idle";
                  if (isActive) nodeState = "active";
                  else if (isMRU) nodeState = "mru";
                  else if (isLRU) nodeState = "lru";

                  return (
                    <React.Fragment key={node.id}>
                      <motion.div
                        id={`p146-dll-node-${node.id}`}
                        data-node-state={nodeState}
                        layout
                        layoutId={`p146-node-${node.id}`}
                        initial={{ opacity: 0, scale: 0.8, y: -20 }}
                        animate={{
                          opacity: 1,
                          scale: isActive ? 1.06 : 1,
                          y: 0
                        }}
                        exit={{ opacity: 0, scale: 0.6, y: 30 }}
                        transition={{ type: "spring", stiffness: 350, damping: 24 }}
                      >
                        <div id={`p146-node-pos-${node.id}`}>
                          {isLRU && nodes.length > 1 ? "LRU" : isMRU ? "MRU" : `POS ${idx + 1}`}
                        </div>

                        <div id={`p146-node-kv-${node.id}`}>
                          <span id={`p146-kv-key-${node.id}`}>K: <b>{node.key}</b></span>
                          <span id={`p146-kv-divider-${node.id}`}>|</span>
                          <span id={`p146-kv-val-${node.id}`}>V: <b>{node.val}</b></span>
                        </div>

                        <span id={`p146-node-addr-${node.id}`}>addr: 0x{node.key}A</span>
                      </motion.div>

                      {idx < nodes.length - 1 && (
                        <div key={`p146-conduit-${node.id}`} id={`p146-conduit-mid-${node.id}`}>
                          <span id={`p146-arrow-next-mid-${node.id}`}>⇄</span>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </AnimatePresence>

              {nodes.length === 0 && (
                <div id="p146-empty-dll-placeholder">
                  Cache empty (Sentinels connected directly)
                </div>
              )}
            </div>

            <div id="p146-conduit-right">
              <span id="p146-arrow-next-right">⇄</span>
            </div>

            {/* Right Sentinel (MRU Tail) */}
            <div id="p146-sentinel-right" data-sentinel="tail">
              <span id="p146-sentinel-tag-right">TAIL</span>
              <span id="p146-sentinel-title-right">RIGHT</span>
              <span id="p146-sentinel-sub-right">MRU</span>
            </div>
          </div>
        </div>

        {/* Track 2: Hash Map Pointer Lookup Table */}
        <div id="p146-map-card">
          <div id="p146-map-card-header">
            <span id="p146-map-header-title">2. Hash Map Key Lookup Table (`cache[key]`)</span>
            <span id="p146-map-header-sub">Maps key directly to node address for O(1) retrieval</span>
          </div>

          <div id="p146-map-cards-grid">
            {Object.keys(map).length === 0 ? (
              <span id="p146-empty-map-placeholder">Map is empty</span>
            ) : (
              Object.entries(map).map(([k, v]) => {
                const isActive = activeKey === Number(k);

                return (
                  <motion.div
                    key={`p146-map-entry-${k}`}
                    id={`p146-map-entry-${k}`}
                    data-token-active={isActive ? "true" : "false"}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  >
                    <span id={`p146-token-key-${k}`}>Key: {k}</span>
                    <span id={`p146-token-arrow-${k}`}>➔</span>
                    <span id={`p146-token-ptr-${k}`}>Node({k}, {v}) [0x{k}A]</span>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Result Callout Modal */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p146-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div id="p146-callout-header-text">{output.label}</div>
            <div id="p146-callout-val-text">{output.value}</div>
            <div id="p146-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}