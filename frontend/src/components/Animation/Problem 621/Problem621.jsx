import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem621.css";

const TASK_COLORS = {
  A: { text: "#f59e0b", bg: "rgba(245, 158, 11, 0.15)", border: "#f59e0b" },
  B: { text: "#38bdf8", bg: "rgba(56, 189, 248, 0.15)", border: "#38bdf8" },
  C: { text: "#22c55e", bg: "rgba(34, 197, 94, 0.15)", border: "#22c55e" },
  D: { text: "#c084fc", bg: "rgba(192, 132, 252, 0.15)", border: "#c084fc" },
  idle: { text: "#71717a", bg: "#18181b", border: "#3f3f46" }
};

export default function Problem621({ stepData }) {
  const {
    currentTime = 0,
    activeTask = null,
    heap = [],
    coolingQueue = [],
    scheduledLog = [],
    state = {},
    output
  } = stepData || {};

  const n = 2;
  const currentTaskStyle = TASK_COLORS[activeTask] || TASK_COLORS.idle;

  return (
    <div className="canvas-wrapper task-canvas">
      {/* Top Telemetry */}
      <div className="metrics-row">
        <span className="metric-chip time-chip">
          CPU Time: <b>t = {currentTime}</b>
        </span>
        <span className="metric-chip cooldown-chip">
          Cooldown Gap: <b>n = {n}</b>
        </span>
        <span className="metric-chip heap-chip">
          Max-Heap Ready: <b>{heap.length} tasks</b>
        </span>
        <span className="metric-chip queue-chip">
          In Cooldown: <b>{coolingQueue.length}</b>
        </span>
      </div>

      {/* Main Scheduler Stage */}
      <div className="task-stage">
        {/* Active CPU Core Display */}
        <div className="cpu-core-banner">
          <div className="core-label">ACTIVE CPU EXECUTION CORE</div>
          <div className="core-indicator-box">
            <motion.div
              className={`core-badge ${activeTask ? "badge-running" : "badge-idle"}`}
              key={`core-task-${currentTime}-${activeTask}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{
                borderColor: currentTaskStyle.border,
                backgroundColor: currentTaskStyle.bg,
                color: currentTaskStyle.text
              }}
            >
              {activeTask ? `TASK ${activeTask}` : "IDLE (WAITING)"}
            </motion.div>
            <span className="core-subtext">
              {activeTask
                ? `Executing cycle for task ${activeTask}`
                : "No ready tasks in heap — cooling down"}
            </span>
          </div>
        </div>

        {/* CPU Timeline Strip */}
        <div className="cpu-timeline-card">
          <div className="card-label">Execution Log (t = 1 ... {currentTime})</div>
          <div className="timeline-slots-track">
            {scheduledLog.length === 0 ? (
              <span className="timeline-empty">Awaiting first CPU cycle...</span>
            ) : (
              scheduledLog.map((taskName, idx) => {
                const isIdle = taskName.toLowerCase() === "idle";
                const isLatest = idx === scheduledLog.length - 1;
                const style = TASK_COLORS[taskName] || TASK_COLORS.idle;

                return (
                  <motion.div
                    key={`slot-${idx}-${taskName}`}
                    className={`cpu-slot ${isLatest ? "slot-active" : ""}`}
                    initial={{ scale: 0.7, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 20 }}
                    style={{
                      borderColor: style.border,
                      backgroundColor: style.bg,
                      color: style.text
                    }}
                  >
                    <span className="slot-idx">t={idx + 1}</span>
                    <span className="slot-glyph">{isIdle ? "—" : taskName}</span>
                    {isLatest && <span className="slot-pointer">▲</span>}
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Dual Deck: Max-Heap & Cooldown Waiting Queue */}
        <div className="dual-deck">
          {/* Max-Heap Inventory Deck */}
          <div className="deck-card heap-deck">
            <div className="card-label">Max-Heap (Ready Queue)</div>
            <div className="deck-content">
              {heap.length === 0 ? (
                <span className="deck-empty">Heap empty (All tasks in cooldown)</span>
              ) : (
                heap.map((item, idx) => {
                  const isTop = idx === 0;
                  const taskName = typeof item === "object" ? item.task : `Task`;
                  const count = typeof item === "object" ? item.cnt : item;
                  const style = TASK_COLORS[taskName] || TASK_COLORS.A;

                  return (
                    <motion.div
                      key={`heap-${taskName}-${count}-${idx}`}
                      className={`heap-card-item ${isTop ? "heap-card-top" : ""}`}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                    >
                      <div className="heap-info">
                        <span
                          className="heap-task-tag"
                          style={{ color: style.text, borderColor: style.border }}
                        >
                          {taskName}
                        </span>
                        <span className="heap-cnt">Count: {count}</span>
                      </div>
                      {isTop && <span className="heap-top-pill">MAX PRIORITY</span>}
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>

          {/* Cooldown Waiting Queue */}
          <div className="deck-card cooling-deck">
            <div className="card-label">Cooldown Queue [Ready At]</div>
            <div className="deck-content">
              {coolingQueue.length === 0 ? (
                <span className="deck-empty">No tasks in cooldown</span>
              ) : (
                coolingQueue.map((item, idx) => {
                  const canUnlock = item.ready <= currentTime;
                  const remaining = Math.max(0, item.ready - currentTime);
                  const style = TASK_COLORS[item.task] || TASK_COLORS.A;

                  return (
                    <motion.div
                      key={`cool-${item.task}-${item.ready}-${idx}`}
                      className={`cooling-card-item ${canUnlock ? "cooling-ready" : ""}`}
                      initial={{ x: 12, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                    >
                      <div className="cool-info">
                        <span
                          className="cool-task"
                          style={{ color: style.text, borderColor: style.border }}
                        >
                          {item.task}
                        </span>
                        <span className="cool-meta">
                          rem: {item.cnt} | ready at <b>t={item.ready}</b>
                        </span>
                      </div>
                      <span className={`countdown-badge ${canUnlock ? "badge-unlocked" : ""}`}>
                        {canUnlock ? "UNLOCKED" : `Wait ${remaining}t`}
                      </span>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Output Result Callout */}
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