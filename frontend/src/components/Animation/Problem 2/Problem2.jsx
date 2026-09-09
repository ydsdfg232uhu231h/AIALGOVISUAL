import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem2.css";

export default function Problem2({ stepData }) {
  const {
    l1 = [],
    l2 = [],
    resultList = [],
    l1Idx = 0,
    l2Idx = 0,
    state = {},
    output
  } = stepData || {};

  const renderLinkedList = (nodes, activeIdx, label, ptrName, listKey) => (
    <div key={`p2-list-${listKey}`} id={`p2-list-row-${listKey}`}>
      <span id={`p2-list-label-${listKey}`}>{label}:</span>
      <div id={`p2-nodes-chain-${listKey}`}>
        {nodes.map((val, idx) => {
          const isActive = idx === activeIdx;
          const nodeState = isActive ? "active" : "idle";

          return (
            <React.Fragment key={`p2-${listKey}-node-frag-${idx}`}>
              <motion.div
                id={`p2-node-container-${listKey}-${idx}`}
                layout
                animate={{ scale: isActive ? 1.12 : 1 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              >
                {/* Fixed Pointer Strip */}
                <div id={`p2-ptr-lane-${listKey}-${idx}`}>
                  <AnimatePresence mode="popLayout">
                    {isActive && (
                      <motion.span
                        key={`p2-ptr-${listKey}-${idx}`}
                        id={`p2-ptr-pill-${listKey}-${idx}`}
                        layout
                        initial={{ y: -6, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -6, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 450, damping: 25 }}
                      >
                        {ptrName}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                {/* Node Circle with Data-State */}
                <div
                  id={`p2-node-circle-${listKey}-${idx}`}
                  data-state={nodeState}
                >
                  {val}
                </div>
                <span id={`p2-node-idx-${listKey}-${idx}`}>[{idx}]</span>
              </motion.div>
              {idx < nodes.length - 1 && (
                <span id={`p2-arrow-sym-${listKey}-${idx}`}>→</span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );

  return (
    <div id="p2-ll-canvas">
      {/* Carry Indicator */}
      <div id="p2-carry-container">
        Carry: <span id="p2-carry-value">{state.carry ?? 0}</span>
      </div>

      {/* Linked Lists Track */}
      <div id="p2-lists-track">
        {renderLinkedList(l1, l1Idx, "List 1", "l1", "l1")}
        {renderLinkedList(l2, l2Idx, "List 2", "l2", "l2")}

        <div id="p2-separator-line" />

        {/* Sum Result List */}
        <div id="p2-list-row-res">
          <span id="p2-list-label-res">Result:</span>
          <div id="p2-nodes-chain-res">
            {resultList.length === 0 ? (
              <span id="p2-empty-hint">Waiting for first sum...</span>
            ) : (
              resultList.map((val, idx) => (
                <React.Fragment key={`p2-res-node-frag-${idx}`}>
                  <motion.div
                    key={`p2-res-${idx}`}
                    id={`p2-node-container-res-${idx}`}
                    layout
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div id={`p2-ptr-lane-res-${idx}`} />
                    <div id={`p2-node-circle-res-${idx}`} data-state="result">
                      {val}
                    </div>
                    <span id={`p2-node-idx-res-${idx}`}>[{idx}]</span>
                  </motion.div>
                  {idx < resultList.length - 1 && (
                    <span id={`p2-arrow-sym-res-${idx}`}>→</span>
                  )}
                </React.Fragment>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Output Card */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p2-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div id="p2-callout-header-text">{output.label}</div>
            <div id="p2-callout-val-text">{output.value}</div>
            <div id="p2-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}