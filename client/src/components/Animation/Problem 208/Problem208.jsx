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

  const currentOp = (state.op || "init").toLowerCase();
  const targetWord = state.word || state.prefix || "";
  const isSearchFail = state.isWord === "False" && state.result === "False";
  const isSearchSuccess = state.isWord === "True" && state.result === "True";
  const isPrefixSuccess = currentOp === "startswith" && state.result === "True";

  // Recursive Tree Node Renderer with Animated Connectors
  const renderTrieNodes = (nodeObj, pathSoFar = []) => {
    if (!nodeObj || typeof nodeObj !== "object") return null;

    const entries = Object.entries(nodeObj).filter(([key]) => key !== "isWord");
    if (entries.length === 0) return null;

    const rowKey = pathSoFar.length > 0 ? pathSoFar.join("-") : "root-row";

    return (
      <div key={`p208-row-${rowKey}`} id={`p208-children-row-${rowKey}`}>
        {entries.map(([char, childNode]) => {
          const nextPath = [...pathSoFar, char];
          const depth = nextPath.length;
          const nodePathKey = nextPath.join("-");

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

          let nodeState = "idle";
          if (isFailedTerminal) nodeState = "not-word";
          else if (isSuccessTerminal) nodeState = "word-hit";
          else if (isPrefixHit) nodeState = "prefix-hit";
          else if (isCurrentHead) nodeState = "head";
          else if (isActive) nodeState = "path";
          else if (isTerminalWord) nodeState = "terminal-idle";

          const targetScale = isCurrentHead ? 1.15 : isActive ? 1.05 : 1;

          return (
            <div
              key={`p208-branch-${nodePathKey}`}
              id={`p208-node-branch-${nodePathKey}`}
            >
              <div
                id={`p208-connector-stem-${nodePathKey}`}
                data-stem-active={isActive ? "true" : "false"}
              />

              <motion.div
                id={`p208-node-pill-${nodePathKey}`}
                data-node-state={nodeState}
                layout
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{
                  scale: targetScale,
                  opacity: 1
                }}
                transition={{ type: "spring", stiffness: 350, damping: 24 }}
              >
                <span id={`p208-node-char-${nodePathKey}`}>{char}</span>
                <span id={`p208-node-depth-tag-${nodePathKey}`}>lvl {depth}</span>

                {isTerminalWord && (
                  <span id={`p208-word-flag-${nodePathKey}`}>
                    isWord: <b>T</b>
                  </span>
                )}

                {isFailedTerminal && (
                  <span id={`p208-err-badge-${nodePathKey}`}>isWord: F</span>
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
    <div id="p208-trie-tree-canvas">
      {/* Top Metrics Row */}
      <div id="p208-metrics-row">
        <span id="p208-metric-op" data-op={currentOp}>
          Op: <b>{currentOp.toUpperCase()}</b>
        </span>

        {targetWord && (
          <span id="p208-metric-query">
            Query: <b>"{targetWord}"</b>
          </span>
        )}

        <span id="p208-metric-prefix">
          Current Prefix:{" "}
          <b>
            {activePath.length > 0
              ? activePath.map((char, idx) => (
                  <React.Fragment key={`p208-path-${char}-${idx}`}>
                    <span>{char}</span>
                    {idx < activePath.length - 1 && (
                      <span id={`p208-path-arrow-${idx}`}>➔</span>
                    )}
                  </React.Fragment>
                ))
              : "ROOT"}
          </b>
        </span>

        <span id="p208-metric-depth">
          Depth: <b>{activePath.length} / {targetWord.length || 0}</b>
        </span>
      </div>

      {/* Target Word Scanner Track */}
      {targetWord && (
        <div id="p208-word-scanner-bar">
          <span id="p208-scanner-label">Character Traversal:</span>
          <div id="p208-scanner-pills">
            {targetWord.split("").map((ch, idx) => {
              const isPassed = activePath.length > idx && activePath[idx] === ch;
              const isCurrent = activePath.length - 1 === idx;
              const isFailed = isCurrent && isSearchFail;

              let scannerState = "idle";
              if (isFailed) scannerState = "fail";
              else if (isCurrent) scannerState = "current";
              else if (isPassed) scannerState = "passed";

              return (
                <motion.div
                  key={`p208-scanner-${idx}-${ch}`}
                  id={`p208-scanner-pill-${idx}`}
                  data-scanner-state={scannerState}
                  layout
                  animate={{ scale: isCurrent ? 1.12 : 1 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                >
                  <span id={`p208-scanner-ch-${idx}`}>{ch}</span>
                  <span id={`p208-scanner-idx-${idx}`}>[{idx}]</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tree Visualization Stage */}
      <div id="p208-trie-stage">
        <div id="p208-tree-card">
          <div id="p208-card-header-bar">
            <span>Prefix Tree Structure</span>
            <span id="p208-card-sub">
              {currentOp === "insert"
                ? "Dynamically inserting child nodes"
                : currentOp === "search"
                ? "Verifying character path & isWord flag"
                : currentOp === "startswith"
                ? "Verifying prefix existence only"
                : "Root initialized"}
            </span>
          </div>

          <div id="p208-trie-tree-viewport">
            {/* Root Node */}
            <div id="p208-trie-root-container">
              <div
                id="p208-root-pill"
                data-root-state={activePath.length === 0 && currentOp !== "init" ? "active" : "idle"}
              >
                <span id="p208-root-char">ROOT</span>
                <span id="p208-root-depth-tag">empty</span>
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
            id="p208-result-callout-box"
            data-callout-state={output.value === "False" ? "error" : "success"}
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div id="p208-callout-header-text">{output.label}</div>
            <div id="p208-callout-val-text">{output.value}</div>
            <div id="p208-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}