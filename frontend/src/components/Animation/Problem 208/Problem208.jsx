import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem208.css";

export default function Problem208({ stepData }) {
  const {
    trieTree = { root: {} },
    activePath = [],
    state = {},
    output
  } = stepData || {};

  const currentOp = state.op || "init";
  const targetWord = state.word || state.prefix || "";
  const isSearchFail = state.isWord === "False" && state.result === "False";
  const isSearchSuccess = state.isWord === "True" && state.result === "True";
  const isPrefixSuccess = currentOp === "startsWith" && state.result === "True";

  // Recursive Tree Node Renderer with Animated Connectors
  const renderTrieNodes = (nodeObj, pathSoFar = []) => {
    if (!nodeObj || typeof nodeObj !== "object") return null;

    const entries = Object.entries(nodeObj).filter(([key]) => key !== "isWord");
    if (entries.length === 0) return null;

    return (
      <div className="trie-children-row">
        {entries.map(([char, childNode]) => {
          const nextPath = [...pathSoFar, char];
          const depth = nextPath.length;

          // Check if this node is in the active DFS path
          const isActive =
            activePath.length >= depth &&
            nextPath.every((val, idx) => val === activePath[idx]);

          const isCurrentHead = isActive && activePath.length === depth;
          const isTerminalWord = childNode.isWord === true;

          // Special status highlights for terminal comparisons
          const isFailedTerminal = isCurrentHead && isSearchFail;
          const isSuccessTerminal = isCurrentHead && isSearchSuccess;
          const isPrefixHit = isCurrentHead && isPrefixSuccess;

          return (
            <div key={`${char}-${depth}`} className="trie-node-branch">
              <div className={`connector-stem ${isActive ? "stem-active" : ""}`} />

              <motion.div
                layout
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{
                  scale: isCurrentHead ? 1.15 : isActive ? 1.05 : 1,
                  opacity: 1
                }}
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
                className={`trie-node-pill ${
                  isFailedTerminal
                    ? "node-not-word"
                    : isSuccessTerminal
                    ? "node-word-hit"
                    : isPrefixHit
                    ? "node-prefix-hit"
                    : isCurrentHead
                    ? "node-head"
                    : isActive
                    ? "node-path"
                    : isTerminalWord
                    ? "node-terminal-idle"
                    : ""
                }`}
              >
                <span className="node-char">{char}</span>
                <span className="node-depth-tag">lvl {depth}</span>

                {isTerminalWord && (
                  <span className="word-flag">
                    isWord: <b>T</b>
                  </span>
                )}

                {isFailedTerminal && (
                  <span className="err-badge">isWord: F</span>
                )}
              </motion.div>

              {renderTrieNodes(childNode, nextPath)}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="canvas-wrapper trie-tree-canvas">
      {/* Top Metrics Row */}
      <div className="metrics-row">
        <span className={`metric-chip op-chip op-${currentOp}`}>
          Op: <b>{currentOp.toUpperCase()}</b>
        </span>

        {targetWord && (
          <span className="metric-chip target-chip">
            Query: <b>"{targetWord}"</b>
          </span>
        )}

       <span className="metric-chip status-chip">
  Current Prefix:{" "}
  <b>
    {activePath.length > 0
      ? activePath.map((char, idx) => (
          <React.Fragment key={idx}>
            <span>{char}</span>
            {idx < activePath.length - 1 && <span className="path-arrow">➔</span>}
          </React.Fragment>
        ))
      : "ROOT"}
  </b>
</span>

        <span className="metric-chip status-chip">
          Depth: <b>{activePath.length} / {targetWord.length || 0}</b>
        </span>
      </div>

      {/* Target Word Scanner Track */}
      {targetWord && (
        <div className="word-scanner-bar">
          <span className="scanner-label">Character Traversal:</span>
          <div className="scanner-pills">
            {targetWord.split("").map((ch, idx) => {
              const isPassed = activePath.length > idx && activePath[idx] === ch;
              const isCurrent = activePath.length - 1 === idx;
              const isFailed = isCurrent && isSearchFail;

              return (
                <motion.div
                  key={`scanner-${idx}-${ch}`}
                  animate={{ scale: isCurrent ? 1.12 : 1 }}
                  className={`scanner-char-pill ${
                    isFailed
                      ? "scanner-fail"
                      : isCurrent
                      ? "scanner-current"
                      : isPassed
                      ? "scanner-passed"
                      : ""
                  }`}
                >
                  <span className="scanner-ch">{ch}</span>
                  <span className="scanner-idx">[{idx}]</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tree Visualization Stage */}
      <div className="trie-stage">
        <div className="track-card tree-card">
          <div className="card-header-bar">
            <span>Prefix Tree Structure</span>
            <span className="card-sub">
              {currentOp === "insert"
                ? "Dynamically inserting child nodes"
                : currentOp === "search"
                ? "Verifying character path & isWord flag"
                : currentOp === "startsWith"
                ? "Verifying prefix existence only"
                : "Root initialized"}
            </span>
          </div>

          <div className="trie-tree-viewport">
            {/* Root Node */}
            <div className="trie-root-container">
              <div className={`trie-node-pill root-pill ${activePath.length === 0 && currentOp !== "init" ? "root-active" : ""}`}>
                <span className="node-char">ROOT</span>
                <span className="node-depth-tag">empty</span>
              </div>
            </div>

            {/* Tree Branch Hierarchy */}
            {renderTrieNodes(trieTree.root, [])}
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
            className={`result-callout ${output.value === "False" ? "callout-error" : "callout-success"}`}
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