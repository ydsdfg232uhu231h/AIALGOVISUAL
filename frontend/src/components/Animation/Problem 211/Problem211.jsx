import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem211.css";

export default function Problem211({ stepData }) {
  const {
    words = ["bad", "dad", "mad"],
    searchPattern = "",
    matched = false,
    activeBranch = null,
    activeLevel = 0, // 0: root, 1: branch letter, 2: 'a', 3: 'd' (isWord)
    matchedBranches = [], // Array of branch characters verified so far, e.g. ['b', 'd', 'm']
    mismatch = false,
    mismatchChar = null,
    state = {},
    output
  } = stepData || {};

  const branches = ["b", "d", "m"];
  const currentBranch = activeBranch || state.branchTried || null;
  const isSearching = Boolean(searchPattern);

  // Reconstruct current candidate string based on search path & probe
  const getAttemptedString = () => {
    if (!currentBranch) return "";
    let str = currentBranch;
    if (activeLevel >= 2) {
      str += mismatch && mismatchChar === "o" ? "o" : "a";
    }
    if (activeLevel >= 3) {
      str += mismatch && mismatchChar === "x" ? "x" : "d";
    }
    return str;
  };

  const currentAttempt = getAttemptedString();

  return (
    <div className="canvas-wrapper trie-canvas">
      {/* Top Metrics Bar */}
      <div className="metrics-row">
        <span className="metric-chip words-chip">
          Stored Words: <b>{words.length}</b>
        </span>
        {searchPattern && (
          <span className="metric-chip pattern-chip">
            Pattern Query: <b>"{searchPattern}"</b>
          </span>
        )}
        {currentBranch && (
          <span className="metric-chip branch-chip">
            Branch: <b>'{currentBranch}' (Depth {activeLevel}/3)</b>
          </span>
        )}
        <span
          className={`metric-chip status-chip ${
            matched ? "status-success" : mismatch ? "status-error" : ""
          }`}
        >
          Status:{" "}
          <b>
            {matched
              ? `Matched (${matchedBranches.length} branch hits)`
              : mismatch
              ? `Mismatch: '${mismatchChar}' does not exist`
              : isSearching
              ? "Scanning Trie..."
              : "Ready"}
          </b>
        </span>
      </div>

      {/* Real-time Pattern Matcher Visualizer */}
      {searchPattern && (
        <div className="pattern-live-matcher">
          <div className="matcher-row">
            <span className="matcher-label">Target Pattern:</span>
            <div className="matcher-slots">
              {searchPattern.split("").map((ch, idx) => {
                const isWildcard = ch === ".";
                const isCurrentCursor = activeLevel - 1 === idx;
                const isErrorSlot = mismatch && isCurrentCursor;

                return (
                  <div
                    key={`slot-pat-${idx}`}
                    className={`matcher-slot ${
                      isWildcard
                        ? "slot-wildcard"
                        : isErrorSlot
                        ? "slot-error"
                        : isCurrentCursor
                        ? "slot-active"
                        : ""
                    }`}
                  >
                    <span className="slot-char">{ch}</span>
                    <span className="slot-sub">
                      {isWildcard && currentBranch ? `[${currentBranch}]` : `idx ${idx}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="matcher-arrow-divider">➔</div>

          <div className="matcher-row">
            <span className="matcher-label">Trie Branch Probe:</span>
            <div className="matcher-slots">
              {[0, 1, 2].map((idx) => {
                const probedChar = currentAttempt[idx] || "-";
                const isCurrentCursor = activeLevel - 1 === idx;
                const isFailedChar = mismatch && isCurrentCursor;
                const isConfirmed = activeLevel > idx + 1 || (activeLevel === 3 && matched);

                return (
                  <motion.div
                    key={`slot-probe-${idx}`}
                    animate={{ scale: isCurrentCursor ? 1.08 : 1 }}
                    className={`matcher-slot ${
                      isFailedChar
                        ? "slot-error"
                        : isConfirmed
                        ? "slot-confirmed"
                        : isCurrentCursor
                        ? "slot-active"
                        : ""
                    }`}
                  >
                    <span className="slot-char">{probedChar}</span>
                    <span className="slot-sub">
                      {isFailedChar ? "FAIL" : isConfirmed ? "MATCH" : `pos ${idx}`}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="trie-stage">
        {/* Track 1: Dictionary Entries */}
        <div className="track-card ops-card">
          <div className="card-header-bar">
            <span>Dictionary Word Entries</span>
            <span className="card-sub">{words.length} words stored</span>
          </div>

          <div className="words-stream">
            {words.map((w) => {
              const branchKey = w[0];
              const isWordHit = matchedBranches.includes(branchKey);

              return (
                <motion.div
                  key={`word-${w}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: isWordHit ? 1.05 : 1, opacity: 1 }}
                  className={`word-badge ${isWordHit ? "word-badge-hit" : ""}`}
                >
                  <span className="word-dot">•</span>
                  <span className="word-str">{w}</span>
                  {isWordHit && <span className="word-verified-tag">MATCH</span>}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Track 2: Prefix Trie Hierarchy Tree */}
        <div className="track-card tree-card">
          <div className="card-header-bar">
            <span>Prefix Trie Node Hierarchy</span>
            <span className="card-sub">Wildcard '.' fans out across branches</span>
          </div>

          <div className="trie-tree-wrapper">
            {/* Root Node */}
            <div className="trie-level level-root">
              <div className={`trie-node root-node ${isSearching ? "node-active-root" : ""}`}>
                <span className="node-lbl">ROOT</span>
              </div>
            </div>

            <div className="tree-connector-line" />

            {/* Branches for 'b', 'd', 'm' */}
            <div className="trie-level level-branches">
              {branches.map((bChar) => {
                const isThisBranch = currentBranch === bChar;
                const isBranchActive = isThisBranch && activeLevel >= 1;
                const isMidActive = isThisBranch && activeLevel >= 2;
                const isEndActive = isThisBranch && activeLevel >= 3;
                const isBranchVerified = matchedBranches.includes(bChar);

                const isBranchFailed = isThisBranch && mismatch && activeLevel === 1;
                const isMidFailed = isThisBranch && mismatch && activeLevel === 2;
                const isEndFailed = isThisBranch && mismatch && activeLevel === 3;

                return (
                  <div key={`branch-${bChar}`} className="branch-column">
                    {/* Level 1 Node */}
                    <motion.div
                      className={`trie-node ${
                        isBranchFailed
                          ? "node-mismatch"
                          : isBranchVerified
                          ? "node-verified"
                          : isBranchActive
                          ? "node-active-branch"
                          : ""
                      }`}
                      animate={{ scale: isBranchActive || isBranchFailed ? 1.12 : 1 }}
                      transition={{ type: "spring", stiffness: 350, damping: 20 }}
                    >
                      <span className="node-char">{bChar}</span>
                      <span className="node-sub">lvl 1</span>
                      {isBranchFailed && <span className="node-err-badge">✕</span>}
                    </motion.div>

                    <div className="down-stem" />

                    {/* Level 2: 'a' Node */}
                    <div
                      className={`trie-node sub-node ${
                        isMidFailed
                          ? "node-mismatch"
                          : isBranchVerified
                          ? "node-verified"
                          : isMidActive
                          ? "node-active-mid"
                          : ""
                      }`}
                    >
                      <span className="node-char">a</span>
                      <span className="node-sub">lvl 2</span>
                      {isMidFailed && <span className="node-err-badge">✕</span>}
                    </div>

                    <div className="down-stem" />

                    {/* Level 3: Terminal 'd' isWord Node */}
                    <div
                      className={`trie-node sub-node ${
                        isEndFailed
                          ? "node-mismatch"
                          : isBranchVerified
                          ? "node-word-end-hit"
                          : isEndActive && matched
                          ? "node-word-end-hit"
                          : isEndActive
                          ? "node-active-mid"
                          : "node-word-end"
                      }`}
                    >
                      <span className="node-char">d</span>
                      <span className="node-sub">isWord</span>
                      {isEndFailed && <span className="node-err-badge">✕</span>}
                    </div>
                  </div>
                );
              })}
            </div>
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
            className={`result-callout ${output.value === "False" ? "callout-error" : ""}`}
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