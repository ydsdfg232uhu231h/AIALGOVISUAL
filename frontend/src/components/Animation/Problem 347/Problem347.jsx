import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem347.css";

export default function Problem347({ stepData }) {
  const {
    buckets = { 1: [3], 2: [2], 3: [1], 4: [], 5: [4], 6: [], 7: [], 8: [] },
    res = [],
    k = 3,
    activeBucket = null,
    extractedNum = null,
    freqMap = { 4: 5, 1: 3, 2: 2, 3: 1 },
    output
  } = stepData || {};

  const bucketKeys = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="canvas-wrapper topk-canvas">
      {/* Top Metrics Row */}
      <div className="metrics-row">
        <span className="metric-chip target-chip">
          Target: <b>Top k = {k} Elements</b>
        </span>
        <span className="metric-chip collected-chip">
          Collected: <b>{res.length} / {k}</b>
        </span>
        {activeBucket !== null && (
          <span className="metric-chip sweep-chip">
            Scanning Bucket: <b>Freq #{activeBucket}</b>
          </span>
        )}
      </div>

      <div className="topk-stage">
        {/* Left Card: Frequency Hash Map */}
        <div className="side-panel freq-panel">
          <div className="panel-title">1. Frequency Map</div>
          <div className="freq-list">
            {Object.entries(freqMap).map(([num, count]) => (
              <motion.div
                key={`freq-${num}`}
                className={`freq-row ${extractedNum === Number(num) ? "freq-row-selected" : ""}`}
                animate={{ scale: extractedNum === Number(num) ? 1.05 : 1 }}
              >
                <span className="freq-num-badge">Num: <b>{num}</b></span>
                <span className="freq-count-badge">Count: <b>{count}x</b></span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Center Card: 8 Bucket Array */}
        <div className="main-panel bucket-panel">
          <div className="panel-title-row">
            <span className="panel-title">2. Bucket Array (1..8)</span>
            <span className="sweep-direction">Reverse Scan: 8 ➔ 1</span>
          </div>

          <div className="buckets-grid buckets-grid-8">
            {bucketKeys.map((freq) => {
              const items = buckets[freq] || [];
              const isScanning = activeBucket === freq;
              const hasItems = items.length > 0;

              return (
                <motion.div
                  key={`bucket-${freq}`}
                  className={`bucket-cell ${isScanning ? "bucket-scanning" : ""} ${
                    hasItems ? "bucket-populated" : ""
                  }`}
                  animate={{ scale: isScanning ? 1.05 : 1 }}
                >
                  <div className="bucket-header">
                    <span className="bucket-idx">[{freq}]</span>
                    {isScanning && <span className="active-arrow">▼ SCAN</span>}
                  </div>

                  <div className="bucket-content">
                    {items.length === 0 ? (
                      <span className="bucket-empty">—</span>
                    ) : (
                      items.map((item) => {
                        const isChosen = res.includes(item);
                        return (
                          <motion.div
                            key={`b-item-${freq}-${item}`}
                            className={`bucket-item ${isChosen ? "item-selected" : ""}`}
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                          >
                            {item}
                          </motion.div>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Card: Result Array */}
        <div className="side-panel res-panel">
          <div className="panel-title">3. Top K Output: res[]</div>
          <div className="res-slots">
            {Array.from({ length: k }).map((_, idx) => {
              const val = res[idx];
              const isFilled = val !== undefined;

              return (
                <motion.div
                  key={`res-slot-${idx}`}
                  className={`res-slot-box ${isFilled ? "slot-filled" : "slot-empty"}`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: isFilled ? 1.06 : 1 }}
                  transition={{ type: "spring", stiffness: 350, damping: 20 }}
                >
                  <span className="slot-rank">#{idx + 1}</span>
                  <span className="slot-value">{isFilled ? val : "?"}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Result Callout */}
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