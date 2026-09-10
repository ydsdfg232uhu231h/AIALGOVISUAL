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
    <div id="p347-topk-canvas">
      {/* Top Metrics Row */}
      <div id="p347-metrics-bar">
        <span id="p347-metric-target">
          Target: <b>Top k = {k} Elements</b>
        </span>
        <span id="p347-metric-collected">
          Collected: <b>{res.length} / {k}</b>
        </span>
        {activeBucket !== null && (
          <span id="p347-metric-sweep">
            Scanning Bucket: <b>Freq #{activeBucket}</b>
          </span>
        )}
      </div>

      <div id="p347-topk-stage">
        {/* Left Card: Frequency Hash Map */}
        <div id="p347-freq-panel">
          <div id="p347-freq-panel-title">1. Frequency Map</div>
          <div id="p347-freq-list">
            {Object.entries(freqMap).map(([num, count]) => {
              const isSelected = extractedNum === Number(num);
              return (
                <motion.div
                  key={`p347-freq-${num}`}
                  id={`p347-freq-row-${num}`}
                  data-row-state={isSelected ? "selected" : "idle"}
                  layout
                  animate={{ scale: isSelected ? 1.05 : 1 }}
                  transition={{ type: "spring", stiffness: 350, damping: 20 }}
                >
                  <span id={`p347-freq-num-badge-${num}`}>
                    Num: <b>{num}</b>
                  </span>
                  <span id={`p347-freq-count-badge-${num}`}>
                    Count: <b>{count}x</b>
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Center Card: 8 Bucket Array */}
        <div id="p347-bucket-panel">
          <div id="p347-bucket-header-row">
            <span id="p347-bucket-panel-title">2. Bucket Array (1..8)</span>
            <span id="p347-sweep-direction">Reverse Scan: 8 ➔ 1</span>
          </div>

          <div id="p347-buckets-grid">
            {bucketKeys.map((freq) => {
              const items = buckets[freq] || [];
              const isScanning = activeBucket === freq;
              const hasItems = items.length > 0;

              let bucketState = "empty";
              if (isScanning) bucketState = "scanning";
              else if (hasItems) bucketState = "populated";

              return (
                <motion.div
                  key={`p347-bucket-${freq}`}
                  id={`p347-bucket-cell-${freq}`}
                  data-bucket-state={bucketState}
                  layout
                  animate={{ scale: isScanning ? 1.05 : 1 }}
                  transition={{ type: "spring", stiffness: 350, damping: 20 }}
                >
                  <div id={`p347-bucket-header-${freq}`}>
                    <span id={`p347-bucket-idx-${freq}`}>[{freq}]</span>
                    <AnimatePresence mode="popLayout">
                      {isScanning && (
                        <motion.span
                          key={`p347-arrow-${freq}`}
                          id={`p347-active-arrow-${freq}`}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 450, damping: 22 }}
                        >
                          ▼ SCAN
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  <div id={`p347-bucket-content-${freq}`}>
                    {items.length === 0 ? (
                      <span id={`p347-bucket-empty-${freq}`}>—</span>
                    ) : (
                      items.map((item) => {
                        const isChosen = res.includes(item);
                        return (
                          <motion.div
                            key={`p347-b-item-${freq}-${item}`}
                            id={`p347-b-item-${freq}-${item}`}
                            data-item-state={isChosen ? "selected" : "idle"}
                            layout
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 350, damping: 20 }}
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
        <div id="p347-res-panel">
          <div id="p347-res-panel-title">3. Top K Output: res[]</div>
          <div id="p347-res-slots">
            {Array.from({ length: k }).map((_, idx) => {
              const val = res[idx];
              const isFilled = val !== undefined;

              return (
                <motion.div
                  key={`p347-res-slot-${idx}`}
                  id={`p347-res-slot-${idx}`}
                  data-slot-state={isFilled ? "filled" : "empty"}
                  layout
                  initial={{ scale: 0.8 }}
                  animate={{ scale: isFilled ? 1.06 : 1 }}
                  transition={{ type: "spring", stiffness: 350, damping: 20 }}
                >
                  <span id={`p347-slot-rank-${idx}`}>#{idx + 1}</span>
                  <span id={`p347-slot-value-${idx}`}>{isFilled ? val : "?"}</span>
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
            id="p347-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div id="p347-callout-header-text">{output.label}</div>
            <div id="p347-callout-val-text">{output.value}</div>
            <div id="p347-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 