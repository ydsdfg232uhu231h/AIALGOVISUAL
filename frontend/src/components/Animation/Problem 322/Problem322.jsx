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
    <div className="canvas-wrapper coin-change-canvas">
      {/* Metrics Row */}
      <div className="metrics-row">
        <div className="coins-rack">
          <span className="rack-label">Coins:</span>
          {coins.map((c) => (
            <span
              key={`coin-${c}`}
              className={`coin-chip ${activeCoin === c ? "coin-active" : ""}`}
            >
              ¢{c}
            </span>
          ))}
        </div>

        <span className="metric-chip target-chip">
          Evaluating Amount: <b>a = {a}</b>
        </span>

        {activeCoin && a >= activeCoin && (
          <span className="metric-chip lookback-chip">
            Lookback (a - {activeCoin}): <b>dp[{a - activeCoin}]</b>
          </span>
        )}

        {minCoins !== undefined && (
          <span className="metric-chip result-chip">
            Min Coins: <b>{minCoins}</b>
          </span>
        )}
      </div>

      {/* 1D DP Array Track */}
      <div className="dp-table-container">
        <div className="dp-row-label">dp[amount]:</div>
        <div className="dp-cells-stream">
          {dp.map((val, amountIdx) => {
            const isCurrent = amountIdx === a;
            const isLookback = activeCoin && amountIdx === a - activeCoin;
            const isTarget = isComplete && amountIdx === dp.length - 1;
            const isInf = val === "INF";

            return (
              <div key={`cell-${amountIdx}`} className="dp-column">
                {/* Pointer Slot */}
                <div className="ptrs-group">
                  {isLookback && <span className="pointer-tag ptr-lookback">a - c</span>}
                  {isCurrent && !isComplete && <span className="pointer-tag ptr-curr">curr</span>}
                </div>

                {/* Value Box */}
                <motion.div
                  className={`dp-node ${isCurrent ? "node-curr" : ""} ${
                    isLookback ? "node-lookback" : ""
                  } ${isTarget ? "node-target" : ""} ${isInf ? "node-inf" : "node-computed"}`}
                  animate={{
                    scale: isCurrent || isTarget ? 1.08 : 1
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="val-text">{isInf ? "∞" : val}</span>
                  <span className="idx-text">[{amountIdx}]</span>
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
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="result-callout"
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