import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem981.css";

export default function Problem981({ stepData }) {
  const {
    store = {},
    currentQuery = null,
    state = {},
    output
  } = stepData || {};

  const storeKeys = Object.keys(store);

  return (
    <div id="p981-timemap-canvas">
      {/* Top Metrics Row */}
      <div id="p981-metrics-bar">
        <span id="p981-metric-keys">
          Stored Keys: <b>{storeKeys.length}</b>
        </span>
        {currentQuery ? (
          <span id="p981-metric-query">
            Active Query: <b>get("{currentQuery.key}", t={currentQuery.time}) &rarr; "{currentQuery.res}"</b>
          </span>
        ) : (
          <span id="p981-metric-idle">
            Operation: <b>{state["store['foo']"] ? "SET" : "IDLE"}</b>
          </span>
        )}
      </div>

      {/* Hash Map Key-Bucket View */}
      <div id="p981-timemap-container">
        {storeKeys.length === 0 ? (
          <div id="p981-empty-store-card">
            <span id="p981-empty-icon">📂</span>
            <span id="p981-empty-text">TimeMap store is empty. Awaiting set() operations...</span>
          </div>
        ) : (
          storeKeys.map((keyName) => {
            const records = store[keyName] || [];
            const isTargetKey = currentQuery && currentQuery.key === keyName;

            return (
              <div
                key={keyName}
                id={`p981-key-bucket-${keyName}`}
                data-is-active={isTargetKey ? "true" : "false"}
              >
                {/* Key Header Tag */}
                <div id={`p981-key-header-${keyName}`}>
                  <span id={`p981-key-badge-${keyName}`}>KEY</span>
                  <span id={`p981-key-title-${keyName}`}>"{keyName}"</span>
                  <span id={`p981-records-count-${keyName}`}>({records.length} records)</span>
                </div>

                {/* Timeline Stream */}
                <div id={`p981-timeline-track-${keyName}`}>
                  {records.map((entry, idx) => {
                    const isMatched =
                      isTargetKey &&
                      currentQuery.res === entry.val &&
                      entry.time <= currentQuery.time;

                    return (
                      <React.Fragment key={`${keyName}-${entry.time}-${idx}`}>
                        {idx > 0 && <div id={`p981-timeline-connector-${keyName}-${idx}`} />}

                        <motion.div
                          id={`p981-time-entry-${keyName}-${idx}`}
                          data-is-matched={isMatched ? "true" : "false"}
                          layout
                          animate={{
                            scale: isMatched ? 1.08 : 1
                          }}
                          transition={{ type: "spring", stiffness: 350, damping: 20 }}
                        >
                          <div id={`p981-entry-timestamp-${keyName}-${idx}`}>t = {entry.time}</div>
                          <div id={`p981-entry-value-${keyName}-${idx}`}>"{entry.val}"</div>
                          {isMatched && (
                            <motion.span
                              id={`p981-match-pill-${keyName}-${idx}`}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.2 }}
                            >
                              MATCH (&le; {currentQuery.time})
                            </motion.span>
                          )}
                        </motion.div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Output Callout (Elevated safely above playback controls) */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p981-result-callout-box"
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ type: "spring", stiffness: 360, damping: 26 }}
          >
            <div id="p981-callout-header-text">{output.label}</div>
            <div id="p981-callout-val-text">{output.value}</div>
            <div id="p981-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}