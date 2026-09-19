import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem21.css";

export default function Problem21({ stepData }) {
  const {
    l1 = [],
    l2 = [],
    merged = [],
    l1Idx = 0,
    l2Idx = 0,
    state = {},
    output
  } = stepData || {};

  const renderSourceList = (nodes, activeIdx, listPrefix, label, ptrName) => (
    <div id={`p21-${listPrefix}-row`}>
      <span id={`p21-${listPrefix}-label`}>{label}:</span>
      <div id={`p21-${listPrefix}-chain`}>
        {nodes.map((val, idx) => {
          const isActive = idx === activeIdx;
          const isAttached = idx < activeIdx;

          return (
            <React.Fragment key={`p21-${listPrefix}-node-${idx}`}>
              <motion.div
                id={`p21-${listPrefix}-node-wrapper-${idx}`}
                layout
                animate={{
                  scale: isActive ? 1.15 : 1,
                  opacity: isAttached ? 0.35 : 1
                }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              >
                {isActive && (
                  <span
                    id={`p21-${listPrefix}-ptr-${idx}`}
                    data-list={listPrefix}
                  >
                    {ptrName}
                  </span>
                )}
                <div
                  id={`p21-${listPrefix}-circle-${idx}`}
                  data-list={listPrefix}
                  data-is-active={isActive ? "true" : "false"}
                  data-is-attached={isAttached ? "true" : "false"}
                >
                  {val}
                </div>
                <span id={`p21-${listPrefix}-idx-${idx}`}>[{idx}]</span>
              </motion.div>
              {idx < nodes.length - 1 && (
                <span
                  id={`p21-${listPrefix}-arrow-${idx}`}
                  data-is-attached={isAttached ? "true" : "false"}
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

  return (
    <div id="p21-merge-canvas">
      {/* Action Indicator Bar */}
      {state.attached !== undefined && (
        <div id="p21-status-banner">
          Attached node <b>{state.attached}</b> from <b>{state.from}</b>
        </div>
      )}

      {/* Input Lists */}
      <div id="p21-source-lists">
        {renderSourceList(l1, l1Idx, "l1", "List 1", "l1")}
        {renderSourceList(l2, l2Idx, "l2", "List 2", "l2")}
      </div>

      <div id="p21-separator-divider" />

      {/* Merged Target List */}
      <div id="p21-merged-track">
        <span id="p21-merged-label">Merged:</span>
        <div id="p21-merged-chain">
          {merged.length === 0 ? (
            <span id="p21-empty-hint">dummy (head)</span>
          ) : (
            merged.map((val, idx) => (
              <React.Fragment key={`p21-merged-node-${idx}`}>
                <motion.div
                  id={`p21-merged-wrapper-${idx}`}
                  layout
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div id={`p21-merged-circle-${idx}`}>{val}</div>
                  <span id={`p21-merged-idx-${idx}`}>[{idx}]</span>
                </motion.div>
                {idx < merged.length - 1 && (
                  <span id={`p21-merged-arrow-${idx}`}>→</span>
                )}
              </React.Fragment>
            ))
          )}
        </div>
      </div>

      {/* Result Callout (Elevated safely above playback controls) */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p21-result-callout-box"
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ type: "spring", stiffness: 360, damping: 26 }}
          >
            <div id="p21-callout-header-text">{output.label}</div>
            <div id="p21-callout-val-text">{output.value}</div>
            <div id="p21-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}