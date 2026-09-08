import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem150.css";

export default function Problem150({ stepData }) {
  const {
    tokens = ["2", "1", "+", "3", "*"],
    tokenIdx = -1,
    stack = [],
    state = {},
    actionType = "IDLE", // "PUSH_OPERAND", "APPLY_OPERATOR", "INIT", "DONE"
    isCompleted = false,
    output
  } = stepData || {};

  const currentToken = tokenIdx >= 0 && tokenIdx < tokens.length ? tokens[tokenIdx] : null;
  const isOperator = (t) => ["+", "-", "*", "/"].includes(t);

  const { op, a, b, result } = state;

  return (
    <div id="rpn-eval-canvas">
      {/* Top Metrics Row */}
      <div id="metrics-bar">
        <span id="metric-pointer">
          Current Token:{" "}
          <b>{currentToken !== null ? `"${currentToken}" (index ${tokenIdx})` : "None"}</b>
        </span>

        <span id="metric-stack-count">
          Stack Size: <b>{stack.length} operands</b>
        </span>

        {op ? (
          <span id="metric-eval-active">
            Active Math: <b>{a} {op} {b} = {result}</b>
          </span>
        ) : (
          <span id="metric-eval-idle">
            Active Math: <b>Waiting</b>
          </span>
        )}

        <span id={isCompleted ? "metric-status-done" : "metric-status-active"}>
          Status: <b>{isCompleted ? "EVALUATION COMPLETE ✓" : actionType}</b>
        </span>
      </div>

      <div id="rpn-stage">
        {/* Track 1: Postfix Tokens Ribbon */}
        <div id="tokens-track-card">
          <div id="tokens-card-header">
            <span id="tokens-header-title">1. Postfix Tokens Stream (`tokens`)</span>
            <span id="tokens-header-sub">Sequential Left-to-Right Scan</span>
          </div>

          <div id="tokens-elements-track">
            {tokens.map((token, idx) => {
              const isCurrent = idx === tokenIdx && !isCompleted;
              const isProcessed = idx < tokenIdx;
              const isOp = isOperator(token);

              let boxId = `token-box-idle-${idx}`;
              if (isCurrent && isOp) boxId = `token-box-active-op-${idx}`;
              else if (isCurrent) boxId = `token-box-active-num-${idx}`;
              else if (isProcessed) boxId = `token-box-passed-${idx}`;
              else if (isOp) boxId = `token-box-op-${idx}`;

              return (
                <motion.div
                  key={`token-${idx}`}
                  id={`token-col-${idx}`}
                  animate={{
                    scale: isCurrent ? 1.12 : 1,
                    opacity: isProcessed && !isCurrent ? 0.4 : 1
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                >
                  <div id={boxId}>
                    {token}
                  </div>
                  <span id={`token-idx-tag-${idx}`}>[{idx}]</span>
                  {isCurrent && <span id="token-pointer-tag">CURR</span>}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Lower Row: Math Operation Unit & LIFO Stack */}
        <div id="middle-stage-grid">
          {/* Operation Engine */}
          <div id="op-engine-card">
            <div id="op-card-header">
              <span id="op-header-title">2. Arithmetic ALU Unit</span>
              <span id="op-header-sub">Pop b, pop a &rarr; Compute a OP b</span>
            </div>

            <div id="op-viewport">
              <AnimatePresence mode="wait">
                {op ? (
                  <motion.div
                    key={`math-${a}-${op}-${b}`}
                    id="alu-calc-flow"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 22 }}
                  >
                    <div id="alu-operand-a">
                      <span id="alu-label-a">a (1st pop)</span>
                      <span id="alu-val-a">{a}</span>
                    </div>

                    <div id="alu-operator-badge">{op}</div>

                    <div id="alu-operand-b">
                      <span id="alu-label-b">b (2nd pop)</span>
                      <span id="alu-val-b">{b}</span>
                    </div>

                    <div id="alu-equal-sign">=</div>

                    <div id="alu-result-box">
                      <span id="alu-label-res">Push Result</span>
                      <span id="alu-val-res">{result}</span>
                    </div>
                  </motion.div>
                ) : (
                  <span id="op-empty-text">
                    {currentToken && !isOperator(currentToken)
                      ? `Reading operand "${currentToken}" &rarr; Pushing directly to stack`
                      : "Awaiting operator trigger..."}
                  </span>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* LIFO Operand Stack */}
          <div id="stack-card">
            <div id="stack-card-header">
              <span id="stack-header-title">3. Evaluation Stack (LIFO)</span>
              <span id="stack-header-sub">Top element holds final result</span>
            </div>

            <div id="stack-viewport">
              <AnimatePresence mode="popLayout">
                {stack.length === 0 ? (
                  <span id="stack-empty-text">Stack is empty</span>
                ) : (
                  <div id="stack-vertical-list">
                    {stack.slice().reverse().map((val, revIdx) => {
                      const actualIdx = stack.length - 1 - revIdx;
                      const isTop = actualIdx === stack.length - 1;

                      let pillId = `stack-node-idle-${actualIdx}`;
                      if (isCompleted && isTop) pillId = `stack-node-winner-${actualIdx}`;
                      else if (isTop) pillId = `stack-node-top-${actualIdx}`;

                      return (
                        <motion.div
                          key={`stack-node-${actualIdx}-${val}`}
                          id={pillId}
                          layout
                          initial={{ opacity: 0, scale: 0.5, y: -20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.5, y: 20 }}
                          transition={{ type: "spring", stiffness: 350, damping: 24 }}
                        >
                          <span id={`stack-val-${actualIdx}`}>{val}</span>
                          {isTop && (
                            <span id="stack-top-badge">
                              {isCompleted ? "RESULT" : "TOP"}
                            </span>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
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