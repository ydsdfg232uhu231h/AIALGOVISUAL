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
    <div className="canvas-wrapper timemap-canvas">
      {/* Top Metrics Row */}
      <div className="metrics-row">
        <span className="metric-chip keys-chip">
          Stored Keys: <b>{storeKeys.length}</b>
        </span>
        {currentQuery ? (
          <span className="metric-chip query-chip">
            Active Query: <b>get("{currentQuery.key}", t={currentQuery.time}) &rarr; "{currentQuery.res}"</b>
          </span>
        ) : (
          <span className="metric-chip idle-chip">
            Operation: <b>{state["store['foo']"] ? "SET" : "IDLE"}</b>
          </span>
        )}
      </div>

      {/* Hash Map Key-Bucket View */}
      <div className="timemap-container">
        {storeKeys.length === 0 ? (
          <div className="empty-store-card">
            <span className="empty-icon">📂</span>
            <span className="empty-text">TimeMap store is empty. Awaiting set() operations...</span>
          </div>
        ) : (
          storeKeys.map((keyName) => {
            const records = store[keyName] || [];
            const isTargetKey = currentQuery && currentQuery.key === keyName;

            return (
              <div
                key={keyName}
                className={`key-bucket-card ${isTargetKey ? "bucket-active" : ""}`}
              >
                {/* Key Header Tag */}
                <div className="key-header">
                  <span className="key-badge">KEY</span>
                  <span className="key-title">"{keyName}"</span>
                  <span className="records-count">({records.length} records)</span>
                </div>

                {/* Timeline Stream */}
                <div className="timeline-track">
                  {records.map((entry, idx) => {
                    const isMatched =
                      isTargetKey &&
                      currentQuery.res === entry.val &&
                      entry.time <= currentQuery.time;

                    return (
                      <React.Fragment key={`${keyName}-${entry.time}-${idx}`}>
                        {idx > 0 && <div className="timeline-connector" />}

                        <motion.div
                          className={`time-entry-card ${isMatched ? "entry-matched" : ""}`}
                          animate={{
                            scale: isMatched ? 1.08 : 1
                          }}
                          transition={{ type: "spring", stiffness: 350, damping: 20 }}
                        >
                          <div className="entry-timestamp">t = {entry.time}</div>
                          <div className="entry-value">"{entry.val}"</div>
                          {isMatched && (
                            <motion.span
                              className="match-pill"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
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