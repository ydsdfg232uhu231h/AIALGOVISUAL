import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem121.css";

export default function Problem121({ stepData }) {
  const {
    prices = [7, 1, 5, 3, 6, 4],
    currentDay = 0,
    buyDay = 0,
    sellDay = null,
    minPrice = "INF",
    currentProfit = 0,
    maxProf = 0,
    state = {},
    output
  } = stepData || {};

  const isCompleted = state.status === "COMPLETED";
  const maxBarHeight = Math.max(...prices);

  return (
    <div id="p121-stock-canvas">
      {/* Top Telemetry Header */}
      <div id="p121-metrics-bar">
        <span id="p121-metric-day">
          Current Day: <b>Day {currentDay} (${prices[currentDay]})</b>
        </span>

        <span id="p121-metric-min-buy">
          Min Buy Price: <b>{minPrice === "INF" ? "INF" : `$${minPrice} (Day ${buyDay})`}</b>
        </span>

        <span id="p121-metric-cur-profit">
          Current Spread: <b>+${currentProfit}</b>
        </span>

        <span
          id="p121-metric-max"
          data-status={isCompleted ? "done" : "active"}
        >
          Max Profit: <b>+${maxProf}</b>
        </span>
      </div>

      {/* Main Stock Stage */}
      <div id="p121-stock-stage">
        <div id="p121-chart-card">
          <div id="p121-chart-card-header">
            <span id="p121-chart-header-title">Daily Stock Price & Transaction Window</span>
            <span id="p121-chart-header-sub">Single-pass tracking: minPrice = min(minPrice, price)</span>
          </div>

          <div id="p121-bars-viewport">
            <div id="p121-bars-container">
              {prices.map((price, idx) => {
                const isCurrent = currentDay === idx;
                const isBuy = buyDay === idx;
                const isSell = sellDay !== null ? sellDay === idx : (isCompleted && idx === 4);
                const isWinningTransaction = isCompleted && (isBuy || isSell);

                const barHeightPercent = (price / maxBarHeight) * 100;

                let barState = "idle";
                if (isWinningTransaction) {
                  barState = "winner";
                } else if (isCurrent) {
                  barState = "current";
                } else if (isBuy) {
                  barState = "buy";
                }

                // Static scale mapping: no keyframe arrays or repeat loops
                const targetScale = isWinningTransaction ? 1.05 : isCurrent ? 1.03 : 1;

                return (
                  <div key={`day-column-${idx}`} id={`p121-col-wrapper-${idx}`}>
                    {/* Top Pointer Badges */}
                    <div id={`p121-ptr-slot-${idx}`}>
                      <AnimatePresence mode="popLayout">
                        {isBuy && !isCompleted && (
                          <motion.div
                            key={`p121-buy-ptr-${idx}`}
                            id="p121-buy-pointer-badge"
                            layout
                            initial={{ y: -8, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -8, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 450, damping: 26 }}
                          >
                            <span>BUY ${price}</span>
                          </motion.div>
                        )}
                        {isCurrent && !isBuy && !isCompleted && (
                          <motion.div
                            key={`p121-sell-ptr-${idx}`}
                            id="p121-sell-pointer-badge"
                            layout
                            initial={{ y: -8, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -8, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 450, damping: 26 }}
                          >
                            <span>SELL?</span>
                          </motion.div>
                        )}
                        {isWinningTransaction && (
                          <motion.div
                            key={`p121-win-ptr-${idx}`}
                            id={`p121-win-badge-${idx}`}
                            data-badge-type={isBuy ? "buy" : "sell"}
                            layout
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 450, damping: 26 }}
                          >
                            <span>{isBuy ? "BUY $1" : "SELL $6"}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Visual Bar Pillar */}
                    <div id={`p121-bar-slot-${idx}`}>
                      <motion.div
                        id={`p121-bar-${idx}`}
                        data-bar-state={barState}
                        layout
                        style={{ height: `${barHeightPercent}%` }}
                        animate={{ scale: targetScale }}
                        transition={{
                          type: "spring",
                          stiffness: 320,
                          damping: 24
                        }}
                      >
                        <span id={`p121-price-label-${idx}`}>${price}</span>
                      </motion.div>
                    </div>

                    {/* Day Subscript */}
                    <span id={`p121-day-label-${idx}`}>
                      Day {idx}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Calculation Tracker Dashboard */}
        <div id="p121-calc-card">
          <div id="p121-calc-card-header">
            <span id="p121-calc-header-title">Daily Evaluation Logic</span>
            <span id="p121-calc-header-sub">Computes profit = price - minPrice</span>
          </div>

          <div id="p121-calc-grid">
            <div id="p121-calc-box-action">
              <span id="p121-calc-title-action">Current Action:</span>
              <span id="p121-calc-val-action">
                {minPrice !== "INF" && prices[currentDay] < minPrice
                  ? `New minimum discovered! Update minPrice = $${prices[currentDay]}`
                  : `Calculate spread: $${prices[currentDay]} - $${minPrice === "INF" ? 0 : minPrice}`}
              </span>
            </div>

            <div id="p121-calc-box-spread">
              <span id="p121-calc-title-spread">Daily Profit Potential:</span>
              <span id="p121-calc-val-spread">
                {minPrice !== "INF" && prices[currentDay] >= minPrice
                  ? `$${prices[currentDay]} - $${minPrice} = +$${prices[currentDay] - minPrice}`
                  : "$0 (Price is lower than min)"}
              </span>
            </div>

            <div id="p121-calc-box-best">
              <span id="p121-calc-title-best">Record Profit:</span>
              <span id="p121-calc-val-best">
                +${maxProf}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Result Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p121-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div id="p121-callout-header-text">{output.label}</div>
            <div id="p121-callout-val-text">{output.value}</div>
            <div id="p121-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}