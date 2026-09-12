import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem621.css";

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
  const currentTaskKey = activeTask ? activeTask.toUpperCase() : "idle";

  return (
    <div id="p621-task-canvas">
      {/* Top Telemetry */}
      <div id="p621-metrics-bar">
        <span id="p621-metric-time">
          CPU Time: <b>t = {currentTime}</b>
        </span>
        <span id="p621-metric-cooldown">
          Cooldown Gap: <b>n = {n}</b>
        </span>
        <span id="p621-metric-heap">
          Max-Heap Ready: <b>{heap.length} tasks</b>
        </span>
        <span id="p621-metric-queue">
          In Cooldown: <b>{coolingQueue.length}</b>
        </span>
      </div>

      {/* Main Scheduler Stage */}
      <div id="p621-task-stage">
        {/* Active CPU Core Display */}
        <div id="p621-cpu-core-banner">
          <div id="p621-core-label">ACTIVE CPU EXECUTION CORE</div>
          <div id="p621-core-indicator-box">
            <motion.div
              id="p621-core-badge"
              data-task={currentTaskKey}
              key={`p621-core-task-${currentTime}-${activeTask}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 350, damping: 20 }}
            >
              {activeTask ? `TASK ${activeTask}` : "IDLE (WAITING)"}
            </motion.div>
            <span id="p621-core-subtext">
              {activeTask
                ? `Executing cycle for task ${activeTask}`
                : "No ready tasks in heap — cooling down"}
            </span>
          </div>
        </div>

        {/* CPU Timeline Strip */}
        <div id="p621-cpu-timeline-card">
          <div id="p621-timeline-card-label">
            Execution Log (t = 1 ... {currentTime})
          </div>
          <div id="p621-timeline-slots-track">
            {scheduledLog.length === 0 ? (
              <span id="p621-timeline-empty">Awaiting first CPU cycle...</span>
            ) : (
              scheduledLog.map((taskName, idx) => {
                const isIdle = taskName.toLowerCase() === "idle";
                const isLatest = idx === scheduledLog.length - 1;
                const taskKey = isIdle ? "idle" : taskName.toUpperCase();

                return (
                  <motion.div
                    key={`p621-slot-${idx}-${taskName}`}
                    id={`p621-cpu-slot-${idx}`}
                    data-task={taskKey}
                    data-is-latest={isLatest ? "true" : "false"}
                    initial={{ scale: 0.7, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 20 }}
                  >
                    <span id={`p621-slot-idx-${idx}`}>t={idx + 1}</span>
                    <span id={`p621-slot-glyph-${idx}`}>{isIdle ? "—" : taskName}</span>
                    {isLatest && <span id={`p621-slot-pointer-${idx}`}>▲</span>}
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Dual Deck: Max-Heap & Cooldown Waiting Queue */}
        <div id="p621-dual-deck">
          {/* Max-Heap Inventory Deck */}
          <div id="p621-heap-deck">
            <div id="p621-heap-deck-label">Max-Heap (Ready Queue)</div>
            <div id="p621-heap-deck-content">
              {heap.length === 0 ? (
                <span id="p621-heap-deck-empty">Heap empty (All tasks in cooldown)</span>
              ) : (
                heap.map((item, idx) => {
                  const isTop = idx === 0;
                  const taskName = typeof item === "object" ? item.task : `Task`;
                  const count = typeof item === "object" ? item.cnt : item;
                  const taskKey = taskName ? taskName.toUpperCase() : "A";

                  return (
                    <motion.div
                      key={`p621-heap-${taskName}-${count}-${idx}`}
                      id={`p621-heap-item-${taskName}-${idx}`}
                      data-is-top={isTop ? "true" : "false"}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 350, damping: 20 }}
                    >
                      <div id={`p621-heap-info-${taskName}-${idx}`}>
                        <span
                          id={`p621-heap-task-tag-${taskName}-${idx}`}
                          data-task={taskKey}
                        >
                          {taskName}
                        </span>
                        <span id={`p621-heap-cnt-${taskName}-${idx}`}>
                          Count: {count}
                        </span>
                      </div>
                      {isTop && <span id="p621-heap-top-pill">MAX PRIORITY</span>}
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>

          {/* Cooldown Waiting Queue */}
          <div id="p621-cooling-deck">
            <div id="p621-cooling-deck-label">Cooldown Queue [Ready At]</div>
            <div id="p621-cooling-deck-content">
              {coolingQueue.length === 0 ? (
                <span id="p621-cooling-deck-empty">No tasks in cooldown</span>
              ) : (
                coolingQueue.map((item, idx) => {
                  const canUnlock = item.ready <= currentTime;
                  const remaining = Math.max(0, item.ready - currentTime);
                  const taskKey = item.task ? item.task.toUpperCase() : "A";

                  return (
                    <motion.div
                      key={`p621-cool-${item.task}-${item.ready}-${idx}`}
                      id={`p621-cooling-item-${item.task}-${idx}`}
                      data-can-unlock={canUnlock ? "true" : "false"}
                      initial={{ x: 12, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 350, damping: 20 }}
                    >
                      <div id={`p621-cool-info-${item.task}-${idx}`}>
                        <span
                          id={`p621-cool-task-tag-${item.task}-${idx}`}
                          data-task={taskKey}
                        >
                          {item.task}
                        </span>
                        <span id={`p621-cool-meta-${item.task}-${idx}`}>
                          rem: {item.cnt} | ready at <b>t={item.ready}</b>
                        </span>
                      </div>
                      <span
                        id={`p621-countdown-badge-${item.task}-${idx}`}
                        data-can-unlock={canUnlock ? "true" : "false"}
                      >
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
            id="p621-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div id="p621-callout-header-text">{output.label}</div>
            <div id="p621-callout-val-text">{output.value}</div>
            <div id="p621-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}