import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem49.css";

export default function Problem49({ stepData }) {
  const {
    array = ["eat", "tea", "tan", "ate", "nat", "bat"],
    currentIndex = null,
    currentWord = "",
    sortedKey = "",
    groups = {},
    isCompleted = false,
    output
  } = stepData || {};

  const groupKeys = Object.keys(groups);

  return (
    <div id="p49-anagrams-canvas">
      {/* Top Metrics Row */}
      <div id="p49-metrics-bar">
        <span id="p49-metric-pointer">
          Pointer (`i`): <b>{currentIndex !== null ? `i = ${currentIndex}` : "Done"}</b>
        </span>

        <span id="p49-metric-word">
          Current Word: <b>{currentWord ? `"${currentWord}"` : "None"}</b>
        </span>

        <span id="p49-metric-key">
          Sorted Key: <b>{sortedKey ? `"${sortedKey}"` : "None"}</b>
        </span>

        <span id={isCompleted ? "p49-metric-status-done" : "p49-metric-status-active"}>
          Total Groups: <b>{groupKeys.length}</b>
        </span>
      </div>

      <div id="p49-anagrams-stage">
        {/* Track 1: Input Array */}
        <div id="p49-input-track-card">
          <div id="p49-input-card-header">
            <span id="p49-input-header-title">1. Input Array (`strs`)</span>
            <span id="p49-input-header-sub">Iterating through each string</span>
          </div>

          <div id="p49-input-elements-track">
            {array.map((val, idx) => {
              const isCurrent = idx === currentIndex && !isCompleted;
              const isPassed = currentIndex !== null && idx < currentIndex;

              let boxState = "idle";
              if (isCurrent) boxState = "active";
              else if (isPassed || isCompleted) boxState = "passed";

              return (
                <motion.div
                  key={`p49-input-col-${idx}`}
                  id={`p49-input-col-${idx}`}
                  layout
                  animate={{
                    scale: isCurrent ? 1.08 : 1,
                    opacity: isPassed && !isCurrent ? 0.4 : 1
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                >
                  <div
                    id={`p49-input-box-${idx}`}
                    data-state={boxState}
                  >
                    "{val}"
                  </div>
                  <span id={`p49-input-idx-tag-${idx}`}>[{idx}]</span>
                  {isCurrent && <span id="p49-input-pointer-tag-i">i</span>}
                </motion.div>
              );
            })}
          </div>
        </div>

        <div id="p49-middle-row-stage">
          {/* Transformation Engine */}
          <div id="p49-transform-card">
            <div id="p49-transform-header">
              <span id="p49-transform-title">2. Character Sorting Engine</span>
              <span id="p49-transform-sub">Generates canonical key</span>
            </div>
            
            <div id="p49-transform-viewport">
              <div id="p49-transform-flow">
                <div id="p49-transform-box-original">
                  <span id="p49-transform-label-orig">Original</span>
                  <span id="p49-transform-val-orig">{currentWord ? `"${currentWord}"` : "---"}</span>
                </div>
                
                <div id="p49-transform-arrow">➔</div>
                
                <div
                  id="p49-transform-box-sorted"
                  data-active={Boolean(sortedKey) ? "true" : "false"}
                >
                  <span id="p49-transform-label-key">Sorted Key</span>
                  <span id="p49-transform-val-key">{sortedKey ? `"${sortedKey}"` : "---"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hash Map Storage */}
          <div id="p49-hashmap-card">
            <div id="p49-hashmap-header">
              <span id="p49-hashmap-title">3. Hash Map (`map`)</span>
              <span id="p49-hashmap-sub">map[sortedKey].append(word)</span>
            </div>

            <div id="p49-hashmap-viewport">
              <AnimatePresence mode="popLayout">
                {groupKeys.length === 0 ? (
                  <span id="p49-hashmap-empty-text">Hash Map is currently empty</span>
                ) : (
                  groupKeys.map((key) => {
                    const isRecentlyUpdated = key === sortedKey && !isCompleted;
                    
                    return (
                      <motion.div
                        key={`p49-bucket-${key}`}
                        id={`p49-group-bucket-${key}`}
                        data-active={isRecentlyUpdated ? "true" : "false"}
                        layout
                        initial={{ opacity: 0, scale: 0.8, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 24 }}
                      >
                        <div id={`p49-bucket-header-${key}`}>Key: <b>"{key}"</b></div>
                        <div id={`p49-bucket-list-${key}`}>
                          <AnimatePresence mode="popLayout">
                            {groups[key].map((word, wIdx) => {
                              const isNewWord = isRecentlyUpdated && wIdx === groups[key].length - 1;
                              
                              return (
                                <motion.div
                                  key={`p49-word-${key}-${word}-${wIdx}`}
                                  id={`p49-word-pill-${key}-${wIdx}`}
                                  data-new={isNewWord ? "true" : "false"}
                                  layout
                                  initial={{ opacity: 0, scale: 0.5, x: -20 }}
                                  animate={{ opacity: 1, scale: 1, x: 0 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                >
                                  "{word}"
                                </motion.div>
                              );
                            })}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Result Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p49-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div id="p49-callout-header-text">{output.label}</div>
            <div id="p49-callout-val-text">{output.value}</div>
            <div id="p49-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}