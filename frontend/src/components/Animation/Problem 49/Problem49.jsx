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
    <div id="anagrams-canvas">
      {/* Top Metrics Row */}
      <div id="metrics-bar">
        <span id="metric-pointer">
          Pointer (`i`): <b>{currentIndex !== null ? `i = ${currentIndex}` : "Done"}</b>
        </span>

        <span id="metric-word">
          Current Word: <b>{currentWord ? `"${currentWord}"` : "None"}</b>
        </span>

        <span id="metric-key">
          Sorted Key: <b>{sortedKey ? `"${sortedKey}"` : "None"}</b>
        </span>

        <span id={isCompleted ? "metric-status-done" : "metric-status-active"}>
          Total Groups: <b>{groupKeys.length}</b>
        </span>
      </div>

      <div id="anagrams-stage">
        {/* Track 1: Input Array */}
        <div id="input-track-card">
          <div id="input-card-header">
            <span id="input-header-title">1. Input Array (`strs`)</span>
            <span id="input-header-sub">Iterating through each string</span>
          </div>

          <div id="input-elements-track">
            {array.map((val, idx) => {
              const isCurrent = idx === currentIndex && !isCompleted;
              const isPassed = currentIndex !== null && idx < currentIndex;

              let boxId = `input-box-idle-${idx}`;
              if (isCurrent) boxId = `input-box-active-${idx}`;
              else if (isPassed || isCompleted) boxId = `input-box-passed-${idx}`;

              return (
                <motion.div
                  key={`input-${idx}`}
                  id={`input-col-${idx}`}
                  animate={{
                    scale: isCurrent ? 1.08 : 1,
                    opacity: isPassed && !isCurrent ? 0.4 : 1
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                >
                  <div id={boxId}>"{val}"</div>
                  <span id={`input-idx-tag-${idx}`}>[{idx}]</span>
                  {isCurrent && <span id="input-pointer-tag-i">i</span>}
                </motion.div>
              );
            })}
          </div>
        </div>

        <div id="middle-row-stage">
          {/* Transformation Engine */}
          <div id="transform-card">
            <div id="transform-header">
              <span id="transform-title">2. Character Sorting Engine</span>
              <span id="transform-sub">Generates canonical key</span>
            </div>
            
            <div id="transform-viewport">
              <div id="transform-flow">
                <div id="transform-box-original">
                  <span id="transform-label-orig">Original</span>
                  <span id="transform-val-orig">{currentWord ? `"${currentWord}"` : "---"}</span>
                </div>
                
                <div id="transform-arrow">➔</div>
                
                <div id={sortedKey ? "transform-box-sorted-active" : "transform-box-sorted-idle"}>
                  <span id="transform-label-key">Sorted Key</span>
                  <span id="transform-val-key">{sortedKey ? `"${sortedKey}"` : "---"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hash Map Storage */}
          <div id="hashmap-card">
            <div id="hashmap-header">
              <span id="hashmap-title">3. Hash Map (`map`)</span>
              <span id="hashmap-sub">map[sortedKey].append(word)</span>
            </div>

            <div id="hashmap-viewport">
              <AnimatePresence mode="popLayout">
                {groupKeys.length === 0 ? (
                  <span id="hashmap-empty-text">Hash Map is currently empty</span>
                ) : (
                  groupKeys.map((key) => {
                    const isRecentlyUpdated = key === sortedKey && !isCompleted;
                    
                    return (
                      <motion.div
                        key={`bucket-${key}`}
                        id={isRecentlyUpdated ? `group-bucket-active-${key}` : `group-bucket-idle-${key}`}
                        layout
                        initial={{ opacity: 0, scale: 0.8, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 24 }}
                      >
                        <div id={`bucket-header-${key}`}>Key: <b>"{key}"</b></div>
                        <div id={`bucket-list-${key}`}>
                          <AnimatePresence mode="popLayout">
                            {groups[key].map((word, wIdx) => {
                              const isNewWord = isRecentlyUpdated && wIdx === groups[key].length - 1;
                              
                              return (
                                <motion.div
                                  key={`word-${key}-${word}-${wIdx}`}
                                  id={isNewWord ? `word-pill-new-${wIdx}` : `word-pill-idle-${wIdx}`}
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
            id="result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div id="callout-header-text">{output.label}</div>
            <div id="callout-val-text">{output.value}</div>
            <div id="callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}