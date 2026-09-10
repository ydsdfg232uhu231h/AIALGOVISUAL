import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem322.css";

export default function Problem322({ stepData }) {
  const {
    coins = [1, 2, 5],
    dp = [],
    currentAmount = 0,
    activeCoin = null,
    state = {},
    output
  } = stepData || {};

  const { a = currentAmount, minCoins, status } = state;
  const isComplete = status === "COMPLETED";

  return (
    <div id="p322-coin-change-canvas">
      {/* Metrics Row */}
      <div id="p322-metrics-row">
        <div id="p322-coins-rack">
          <span id="p322-rack-label">Coins:</span>
          {coins.map((c) => (
            <span
              key={`p322-coin-${c}`}
              id={`p322-coin-chip-${c}`}
              data-is-active={activeCoin === c ? "true" : "false"}
            >
              ¢{c}
            </span>
          ))}
        </div>

        <span id="p322-metric-target">
          Evaluating Amount: <b>a = {a}</b>
        </span>

        {activeCoin && a >= activeCoin && (
          <span id="p322-metric-lookback">
            Lookback (a - {activeCoin}): <b>dp[{a - activeCoin}]</b>
          </span>
        )}

        {minCoins !== undefined && (
          <span id="p322-metric-result">
            Min Coins: <b>{minCoins}</b>
          </span>
        )}
      </div>

      {/* 1D DP Array Track */}
      <div id="p322-dp-table-container">
        <div id="p322-dp-row-label">dp[amount]:</div>
        <div id="p322-dp-cells-stream">
          {dp.map((val, amountIdx) => {
            const isCurrent = amountIdx === a;
            const isLookback = activeCoin && amountIdx === a - activeCoin;
            const isTarget = isComplete && amountIdx === dp.length - 1;
            const isInf = val === "INF";

            let nodeState = isInf ? "inf" : "computed";
            if (isTarget) nodeState = "target";
            else if (isCurrent) nodeState = "curr";
            else if (isLookback) nodeState = "lookback";

            return (
              <div key={`p322-cell-${amountIdx}`} id={`p322-dp-col-${amountIdx}`}>
                {/* Pointer Slot */}
                <div id={`p322-ptrs-group-${amountIdx}`}>
                  <AnimatePresence mode="popLayout">
                    {isLookback && (
                      <motion.span
                        key="p322-ptr-lookback"
                        layoutId="p322-ptr-lookback"
                        id={`p322-pointer-tag-lookback-${amountIdx}`}
                        data-ptr="lookback"
                        initial={{ y: -6, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -6, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 450, damping: 26 }}
                      >
                        a - c
                      </motion.span>
                    )}
                    {isCurrent && !isComplete && (
                      <motion.span
                        key="p322-ptr-curr"
                        layoutId="p322-ptr-curr"
                        id={`p322-pointer-tag-curr-${amountIdx}`}
                        data-ptr="curr"
                        initial={{ y: -6, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -6, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 450, damping: 26 }}
                      >
                        curr
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                {/* Value Box */}
                <motion.div
                  id={`p322-dp-node-${amountIdx}`}
                  data-node-state={nodeState}
                  layout
                  animate={{
                    scale: isCurrent || isTarget ? 1.08 : 1
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 20 }}
                >
                  <span id={`p322-val-text-${amountIdx}`}>{isInf ? "∞" : val}</span>
                  <span id={`p322-idx-text-${amountIdx}`}>[{amountIdx}]</span>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Output Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p322-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div id="p322-callout-header-text">{output.label}</div>
            <div id="p322-callout-val-text">{output.value}</div>
            <div id="p322-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}