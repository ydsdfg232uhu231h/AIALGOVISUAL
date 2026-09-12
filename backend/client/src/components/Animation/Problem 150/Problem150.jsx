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
    <div id="p150-rpn-eval-canvas">
      {/* Top Metrics Row */}
      <div id="p150-metrics-bar">
        <span id="p150-metric-pointer">
          Current Token:{" "}
          <b>{currentToken !== null ? `"${currentToken}" (index ${tokenIdx})` : "None"}</b>
        </span>

        <span id="p150-metric-stack-count">
          Stack Size: <b>{stack.length} operands</b>
        </span>

        {op ? (
          <span id="p150-metric-eval-active">
            Active Math: <b>{a} {op} {b} = {result}</b>
          </span>
        ) : (
          <span id="p150-metric-eval-idle">
            Active Math: <b>Waiting</b>
          </span>
        )}

        <span
          id="p150-metric-status"
          data-status={isCompleted ? "done" : "active"}
        >
          Status: <b>{isCompleted ? "EVALUATION COMPLETE ✓" : actionType}</b>
        </span>
      </div>

      <div id="p150-rpn-stage">
        {/* Track 1: Postfix Tokens Ribbon */}
        <div id="p150-tokens-track-card">
          <div id="p150-tokens-card-header">
            <span id="p150-tokens-header-title">1. Postfix Tokens Stream (`tokens`)</span>
            <span id="p150-tokens-header-sub">Sequential Left-to-Right Scan</span>
          </div>

          <div id="p150-tokens-elements-track">
            {tokens.map((token, idx) => {
              const isCurrent = idx === tokenIdx && !isCompleted;
              const isProcessed = idx < tokenIdx;
              const isOp = isOperator(token);

              let tokenState = "idle";
              if (isCurrent && isOp) tokenState = "active-op";
              else if (isCurrent) tokenState = "active-num";
              else if (isProcessed) tokenState = "passed";
              else if (isOp) tokenState = "op";

              return (
                <motion.div
                  key={`p150-token-${idx}`}
                  id={`p150-token-col-${idx}`}
                  layout
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                    opacity: isProcessed && !isCurrent ? 0.4 : 1
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                >
                  <div
                    id={`p150-token-box-${idx}`}
                    data-token-state={tokenState}
                  >
                    {token}
                  </div>
                  <span id={`p150-token-idx-tag-${idx}`}>[{idx}]</span>

                  <AnimatePresence mode="popLayout">
                    {isCurrent && (
                      <motion.span
                        key="p150-active-token-ptr"
                        layoutId="p150-curr-token-pointer"
                        id={`p150-token-pointer-tag-${idx}`}
                        initial={{ y: 6, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 6, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 450, damping: 26 }}
                      >
                        CURR
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Lower Row: Math Operation Unit & LIFO Stack */}
        <div id="p150-middle-stage-grid">
          {/* Operation Engine */}
          <div id="p150-op-engine-card">
            <div id="p150-op-card-header">
              <span id="p150-op-header-title">2. Arithmetic ALU Unit</span>
              <span id="p150-op-header-sub">Pop b, pop a &rarr; Compute a OP b</span>
            </div>

            <div id="p150-op-viewport">
              <AnimatePresence mode="wait">
                {op ? (
                  <motion.div
                    key={`p150-math-${a}-${op}-${b}`}
                    id="p150-alu-calc-flow"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 22 }}
                  >
                    <div id="p150-alu-operand-a">
                      <span id="p150-alu-label-a">a (1st pop)</span>
                      <span id="p150-alu-val-a">{a}</span>
                    </div>

                    <div id="p150-alu-operator-badge">{op}</div>

                    <div id="p150-alu-operand-b">
                      <span id="p150-alu-label-b">b (2nd pop)</span>
                      <span id="p150-alu-val-b">{b}</span>
                    </div>

                    <div id="p150-alu-equal-sign">=</div>

                    <div id="p150-alu-result-box">
                      <span id="p150-alu-label-res">Push Result</span>
                      <span id="p150-alu-val-res">{result}</span>
                    </div>
                  </motion.div>
                ) : (
                  <span id="p150-op-empty-text">
                    {currentToken && !isOperator(currentToken)
                      ? `Reading operand "${currentToken}" → Pushing directly to stack`
                      : "Awaiting operator trigger..."}
                  </span>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* LIFO Operand Stack */}
          <div id="p150-stack-card">
            <div id="p150-stack-card-header">
              <span id="p150-stack-header-title">3. Evaluation Stack (LIFO)</span>
              <span id="p150-stack-header-sub">Top element holds final result</span>
            </div>

            <div id="p150-stack-viewport">
              <AnimatePresence mode="popLayout">
                {stack.length === 0 ? (
                  <span id="p150-stack-empty-text">Stack is empty</span>
                ) : (
                  <div id="p150-stack-vertical-list">
                    {stack.slice().reverse().map((val, revIdx) => {
                      const actualIdx = stack.length - 1 - revIdx;
                      const isTop = actualIdx === stack.length - 1;

                      let nodeState = "idle";
                      if (isCompleted && isTop) nodeState = "winner";
                      else if (isTop) nodeState = "top";

                      return (
                        <motion.div
                          key={`p150-stack-node-${actualIdx}-${val}`}
                          id={`p150-stack-node-${actualIdx}`}
                          data-node-state={nodeState}
                          layout
                          initial={{ opacity: 0, scale: 0.5, y: -20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.5, y: 20 }}
                          transition={{ type: "spring", stiffness: 350, damping: 24 }}
                        >
                          <span id={`p150-stack-val-${actualIdx}`}>{val}</span>
                          {isTop && (
                            <span id={`p150-stack-top-badge-${actualIdx}`}>
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
            id="p150-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div id="p150-callout-header-text">{output.label}</div>
            <div id="p150-callout-val-text">{output.value}</div>
            <div id="p150-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}