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

  let statusState = "ready";
  if (matched) statusState = "success";
  else if (mismatch) statusState = "error";
  else if (isSearching) statusState = "scanning";

  return (
    <div id="p211-trie-canvas">
      {/* Top Metrics Bar */}
      <div id="p211-metrics-row">
        <span id="p211-metric-words">
          Stored Words: <b>{words.length}</b>
        </span>

        {searchPattern && (
          <span id="p211-metric-pattern">
            Pattern Query: <b>"{searchPattern}"</b>
          </span>
        )}

        {currentBranch && (
          <span id="p211-metric-branch">
            Branch: <b>'{currentBranch}' (Depth {activeLevel}/3)</b>
          </span>
        )}

        <span id="p211-metric-status" data-status={statusState}>
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
        <div id="p211-pattern-live-matcher">
          <div id="p211-matcher-row-pattern">
            <span id="p211-matcher-label-pattern">Target Pattern:</span>
            <div id="p211-matcher-slots-pattern">
              {searchPattern.split("").map((ch, idx) => {
                const isWildcard = ch === ".";
                const isCurrentCursor = activeLevel - 1 === idx;
                const isErrorSlot = mismatch && isCurrentCursor;

                let slotState = "idle";
                if (isWildcard) slotState = "wildcard";
                else if (isErrorSlot) slotState = "error";
                else if (isCurrentCursor) slotState = "active";

                return (
                  <div
                    key={`p211-slot-pat-${idx}`}
                    id={`p211-slot-pat-${idx}`}
                    data-slot-state={slotState}
                  >
                    <span id={`p211-slot-char-pat-${idx}`}>{ch}</span>
                    <span id={`p211-slot-sub-pat-${idx}`}>
                      {isWildcard && currentBranch ? `[${currentBranch}]` : `idx ${idx}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div id="p211-matcher-arrow-divider">➔</div>

          <div id="p211-matcher-row-probe">
            <span id="p211-matcher-label-probe">Trie Branch Probe:</span>
            <div id="p211-matcher-slots-probe">
              {[0, 1, 2].map((idx) => {
                const probedChar = currentAttempt[idx] || "-";
                const isCurrentCursor = activeLevel - 1 === idx;
                const isFailedChar = mismatch && isCurrentCursor;
                const isConfirmed = activeLevel > idx + 1 || (activeLevel === 3 && matched);

                let slotState = "idle";
                if (isFailedChar) slotState = "error";
                else if (isConfirmed) slotState = "confirmed";
                else if (isCurrentCursor) slotState = "active";

                return (
                  <motion.div
                    key={`p211-slot-probe-${idx}`}
                    id={`p211-slot-probe-${idx}`}
                    data-slot-state={slotState}
                    layout
                    animate={{ scale: isCurrentCursor ? 1.08 : 1 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  >
                    <span id={`p211-slot-char-probe-${idx}`}>{probedChar}</span>
                    <span id={`p211-slot-sub-probe-${idx}`}>
                      {isFailedChar ? "FAIL" : isConfirmed ? "MATCH" : `pos ${idx}`}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div id="p211-trie-stage">
        {/* Track 1: Dictionary Entries */}
        <div id="p211-ops-card">
          <div id="p211-ops-card-header">
            <span id="p211-ops-header-title">Dictionary Word Entries</span>
            <span id="p211-ops-header-sub">{words.length} words stored</span>
          </div>

          <div id="p211-words-stream">
            {words.map((w) => {
              const branchKey = w[0];
              const isWordHit = matchedBranches.includes(branchKey);

              return (
                <motion.div
                  key={`p211-word-${w}`}
                  id={`p211-word-badge-${w}`}
                  data-word-hit={isWordHit ? "true" : "false"}
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: isWordHit ? 1.05 : 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 350, damping: 24 }}
                >
                  <span id={`p211-word-dot-${w}`}>•</span>
                  <span id={`p211-word-str-${w}`}>{w}</span>
                  {isWordHit && (
                    <span id={`p211-word-verified-tag-${w}`}>MATCH</span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Track 2: Prefix Trie Hierarchy Tree */}
        <div id="p211-tree-card">
          <div id="p211-tree-card-header">
            <span id="p211-tree-header-title">Prefix Trie Node Hierarchy</span>
            <span id="p211-tree-header-sub">Wildcard '.' fans out across branches</span>
          </div>

          <div id="p211-trie-tree-wrapper">
            {/* Root Node */}
            <div id="p211-trie-level-root">
              <div
                id="p211-root-node"
                data-root-state={isSearching ? "active" : "idle"}
              >
                <span id="p211-root-node-lbl">ROOT</span>
              </div>
            </div>

            <div id="p211-tree-connector-line" />

            {/* Branches for 'b', 'd', 'm' */}
            <div id="p211-trie-level-branches">
              {branches.map((bChar) => {
                const isThisBranch = currentBranch === bChar;
                const isBranchActive = isThisBranch && activeLevel >= 1;
                const isMidActive = isThisBranch && activeLevel >= 2;
                const isEndActive = isThisBranch && activeLevel >= 3;
                const isBranchVerified = matchedBranches.includes(bChar);

                const isBranchFailed = isThisBranch && mismatch && activeLevel === 1;
                const isMidFailed = isThisBranch && mismatch && activeLevel === 2;
                const isEndFailed = isThisBranch && mismatch && activeLevel === 3;

                let l1State = "idle";
                if (isBranchFailed) l1State = "mismatch";
                else if (isBranchVerified) l1State = "verified";
                else if (isBranchActive) l1State = "active-branch";

                let l2State = "idle";
                if (isMidFailed) l2State = "mismatch";
                else if (isBranchVerified) l2State = "verified";
                else if (isMidActive) l2State = "active-mid";

                let l3State = "word-end";
                if (isEndFailed) l3State = "mismatch";
                else if (isBranchVerified || (isEndActive && matched)) l3State = "word-end-hit";
                else if (isEndActive) l3State = "active-mid";

                return (
                  <div key={`p211-branch-${bChar}`} id={`p211-branch-column-${bChar}`}>
                    {/* Level 1 Node */}
                    <motion.div
                      id={`p211-node-l1-${bChar}`}
                      data-node-state={l1State}
                      layout
                      animate={{ scale: isBranchActive || isBranchFailed ? 1.12 : 1 }}
                      transition={{ type: "spring", stiffness: 350, damping: 20 }}
                    >
                      <span id={`p211-node-char-l1-${bChar}`}>{bChar}</span>
                      <span id={`p211-node-sub-l1-${bChar}`}>lvl 1</span>
                      {isBranchFailed && (
                        <span id={`p211-node-err-l1-${bChar}`}>✕</span>
                      )}
                    </motion.div>

                    <div id={`p211-down-stem-1-${bChar}`} />

                    {/* Level 2: 'a' Node */}
                    <div
                      id={`p211-node-l2-${bChar}`}
                      data-node-state={l2State}
                    >
                      <span id={`p211-node-char-l2-${bChar}`}>a</span>
                      <span id={`p211-node-sub-l2-${bChar}`}>lvl 2</span>
                      {isMidFailed && (
                        <span id={`p211-node-err-l2-${bChar}`}>✕</span>
                      )}
                    </div>

                    <div id={`p211-down-stem-2-${bChar}`} />

                    {/* Level 3: Terminal 'd' isWord Node */}
                    <div
                      id={`p211-node-l3-${bChar}`}
                      data-node-state={l3State}
                    >
                      <span id={`p211-node-char-l3-${bChar}`}>d</span>
                      <span id={`p211-node-sub-l3-${bChar}`}>isWord</span>
                      {isEndFailed && (
                        <span id={`p211-node-err-l3-${bChar}`}>✕</span>
                      )}
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
            id="p211-result-callout-box"
            data-callout-state={output.value === "False" ? "error" : "success"}
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div id="p211-callout-header-text">{output.label}</div>
            <div id="p211-callout-val-text">{output.value}</div>
            <div id="p211-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}