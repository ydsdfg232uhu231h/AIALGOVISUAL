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

  return (
    <div className="canvas-wrapper lru-canvas">
      {/* Top Metrics Row */}
      <div className="metrics-row">
        <span className={`metric-chip op-chip op-${currentOp}`}>
          Op: <b>{currentOp.toUpperCase()}</b>
        </span>

        {activeKey !== null && (
          <span className="metric-chip target-chip">
            Key: <b>{activeKey}</b>
          </span>
        )}

        <span className="metric-chip cap-chip">
          Capacity: <b>{nodes.length} / {capacity}</b>
        </span>

        {evictedKey !== null && (
          <span className="metric-chip evict-chip">
            Evicted: <b>Key {evictedKey} (LRU)</b>
          </span>
        )}
      </div>

      {/* Main Stage */}
      <div className="lru-stage">
        {/* Track 1: Doubly Linked List Usage Hierarchy */}
        <div className="track-card dll-card" id="mydillcard">
          <div className="card-header-bar">
            <span>1. Doubly Linked List (Usage Hierarchy)</span>
            <span className="card-sub">Left = LRU (Eviction candidate) ➔ Right = MRU (Most Recent)</span>
          </div>

          <div className="dll-track-viewport">
            {/* Left Sentinel (LRU Head) */}
            <div className="sentinel-box sentinel-left">
              <span className="sentinel-tag">HEAD</span>
              <span className="sentinel-title">LEFT</span>
              <span className="sentinel-sub">LRU</span>
            </div>

            <div className="conduit-arrow-pair">
              <span className="arrow-next">⇄</span>
            </div>

            {/* Dynamic Cache Nodes */}
            <div className="dll-nodes-wrapper">
              <AnimatePresence initial={false}>
                {nodes.map((node, idx) => {
                  const isLRU = idx === 0;
                  const isMRU = idx === nodes.length - 1;
                  const isActive = activeKey === node.key;

                  return (
                    <React.Fragment key={node.id}>
                      <motion.div
                        layout
                        layoutId={node.id}
                        initial={{ opacity: 0, scale: 0.8, y: -20 }}
                        animate={{
                          opacity: 1,
                          scale: isActive ? 1.08 : 1,
                          y: 0
                        }}
                        exit={{ opacity: 0, scale: 0.6, y: 30 }}
                        transition={{ type: "spring", stiffness: 350, damping: 24 }}
                        className={`dll-node-card ${
                          isActive
                            ? "node-active"
                            : isMRU
                            ? "node-mru"
                            : isLRU
                            ? "node-lru"
                            : ""
                        }`}
                      >
                        <div className="node-pos-badge">
                          {isLRU && nodes.length > 1 ? "LRU" : isMRU ? "MRU" : `POS ${idx + 1}`}
                        </div>

                        <div className="node-kv-content">
                          <span className="kv-key">K: <b>{node.key}</b></span>
                          <span className="kv-divider">|</span>
                          <span className="kv-val">V: <b>{node.val}</b></span>
                        </div>

                        <span className="node-addr-tag">addr: 0x{node.key}A</span>
                      </motion.div>

                      {idx < nodes.length - 1 && (
                        <div className="conduit-arrow-pair">
                          <span className="arrow-next">⇄</span>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </AnimatePresence>

              {nodes.length === 0 && (
                <div className="empty-dll-placeholder">
                  Cache empty (Sentinels connected directly)
                </div>
              )}
            </div>

            <div className="conduit-arrow-pair">
              <span className="arrow-next">⇄</span>
            </div>

            {/* Right Sentinel (MRU Tail) */}
            <div className="sentinel-box sentinel-right">
              <span className="sentinel-tag">TAIL</span>
              <span className="sentinel-title">RIGHT</span>
              <span className="sentinel-sub">MRU</span>
            </div>
          </div>
        </div>

        {/* Track 2: Hash Map Pointer Lookup Table */}
        <div className="track-card map-card">
          <div className="card-header-bar">
            <span>2. Hash Map Key Lookup Table (`cache[key]`)</span>
            <span className="card-sub">Maps key directly to node address for O(1) retrieval</span>
          </div>

          <div className="map-cards-grid">
            {Object.keys(map).length === 0 ? (
              <span className="empty-map-placeholder">Map is empty</span>
            ) : (
              Object.entries(map).map(([k, v]) => {
                const isActive = activeKey === Number(k);

                return (
                  <motion.div
                    key={`map-entry-${k}`}
                    layout
                    className={`map-token-pill ${isActive ? "map-token-active" : ""}`}
                  >
                    <span className="token-key">Key: {k}</span>
                    <span className="token-arrow">➔</span>
                    <span className="token-ptr">Node({k}, {v}) [0x{k}A]</span>
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