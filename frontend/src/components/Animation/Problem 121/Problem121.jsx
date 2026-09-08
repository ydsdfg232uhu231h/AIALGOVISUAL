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
    <div id="stock-canvas">
      {/* Top Telemetry Header */}
      <div id="metrics-bar">
        <span id="metric-day">
          Current Day: <b>Day {currentDay} (${prices[currentDay]})</b>
        </span>

        <span id="metric-min-buy">
          Min Buy Price: <b>{minPrice === "INF" ? "INF" : `$${minPrice} (Day ${buyDay})`}</b>
        </span>

        <span id="metric-cur-profit">
          Current Spread: <b>+${currentProfit}</b>
        </span>

        <span id={isCompleted ? "metric-max-done" : "metric-max-active"}>
          Max Profit: <b>+${maxProf}</b>
        </span>
      </div>

      {/* Main Stock Stage */}
      <div id="stock-stage">
        <div id="chart-card">
          <div id="chart-card-header">
            <span id="chart-header-title">Daily Stock Price & Transaction Window</span>
            <span id="chart-header-sub">Single-pass tracking: minPrice = min(minPrice, price)</span>
          </div>

          <div id="bars-viewport">
            <div id="bars-container">
              {prices.map((price, idx) => {
                const isCurrent = currentDay === idx;
                const isBuy = buyDay === idx;
                const isSell = (sellDay !== null ? sellDay === idx : (isCompleted && idx === 4));
                const isWinningTransaction = isCompleted && (isBuy || isSell);

                const barHeightPercent = (price / maxBarHeight) * 100;

                let barId = `bar-idle-${idx}`;
                if (isWinningTransaction) {
                  barId = `bar-winner-${idx}`;
                } else if (isCurrent) {
                  barId = `bar-current-${idx}`;
                } else if (isBuy) {
                  barId = `bar-buy-${idx}`;
                }

                return (
                  <div key={`day-column-${idx}`} id={`col-wrapper-${idx}`} className="day-column">
                    {/* Top Pointer Badges */}
                    <div id={`ptr-slot-${idx}`} className="pointer-slot">
                      <AnimatePresence>
                        {isBuy && !isCompleted && (
                          <motion.div
                            id="buy-pointer-badge"
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
                            id="sell-pointer-badge"
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
                            id={isBuy ? "win-buy-badge" : "win-sell-badge"}
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
                    <div id={`bar-slot-${idx}`} className="bar-track-slot">
                      <motion.div
                        id={barId}
                        className="price-bar-pillar"
                        style={{ height: `${barHeightPercent}%` }}
                        animate={{
                          scale: isWinningTransaction ? [1, 1.05, 1] : isCurrent ? 1.03 : 1
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                          scale: isWinningTransaction ? { repeat: Infinity, duration: 1.4 } : undefined
                        }}
                      >
                        <span id={`price-label-${idx}`} className="bar-val-label">${price}</span>
                      </motion.div>
                    </div>

                    {/* Day Subscript */}
                    <span id={`day-label-${idx}`} className="day-index-label">
                      Day {idx}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Calculation Tracker Dashboard */}
        <div id="calc-card">
          <div id="calc-card-header">
            <span id="calc-header-title">Daily Evaluation Logic</span>
            <span id="calc-header-sub">Computes profit = price - minPrice</span>
          </div>

          <div id="calc-grid">
            <div id="calc-box-action">
              <span id="calc-title-action">Current Action:</span>
              <span id="calc-val-action">
                {minPrice !== "INF" && prices[currentDay] < minPrice
                  ? `New minimum discovered! Update minPrice = $${prices[currentDay]}`
                  : `Calculate spread: $${prices[currentDay]} - $${minPrice === "INF" ? 0 : minPrice}`}
              </span>
            </div>

            <div id="calc-box-spread">
              <span id="calc-title-spread">Daily Profit Potential:</span>
              <span id="calc-val-spread">
                {minPrice !== "INF" && prices[currentDay] >= minPrice
                  ? `$${prices[currentDay]} - $${minPrice} = +$${prices[currentDay] - minPrice}`
                  : "$0 (Price is lower than min)"}
              </span>
            </div>

            <div id="calc-box-best">
              <span id="calc-title-best">Record Profit:</span>
              <span id="calc-val-best">
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