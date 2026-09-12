import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem198.css";

export default function Problem198({ stepData }) {
  const {
    houses = [],
    currentHouse = -1,
    state = {},
    output
  } = stepData || {};

  const { rob1 = 0, rob2 = 0, val, status, maxRobbed } = state;
  const isComplete = status === "COMPLETED";

  return (
    <div id="p198-house-robber-canvas">
      {/* Metrics Row */}
      <div id="p198-metrics-row">
        {val !== undefined && (
          <span id="p198-metric-curr-house">
            Current: <b>House {currentHouse} (${val})</b>
          </span>
        )}
        <span id="p198-metric-rob1">
          rob1 (i - 2): <b>${rob1}</b>
        </span>
        <span id="p198-metric-rob2">
          rob2 (i - 1): <b>${rob2}</b>
        </span>
        {val !== undefined && (
          <span id="p198-metric-formula">
            max(${val} + {rob1}, {rob2}) = <b>${Math.max(val + rob1, rob2)}</b>
          </span>
        )}
        {maxRobbed !== undefined && (
          <span id="p198-metric-total">
            Max Stolen: <b>${maxRobbed}</b>
          </span>
        )}
      </div>

      {/* Houses Strip */}
      <div id="p198-houses-track">
        {/* Virtual Base Anchor for i - 2 when at House 0 or House 1 */}
        {currentHouse <= 1 && currentHouse >= 0 && (
          <div id="p198-house-column-base">
            <div id="p198-ptrs-group-base">
              <AnimatePresence mode="popLayout">
                {currentHouse === 0 && (
                  <motion.span
                    key="p198-ptr-rob1-base0"
                    layoutId="p198-ptr-rob1"
                    id="p198-pointer-tag-rob1-base"
                    data-ptr="rob1"
                    initial={{ y: -6, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -6, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 450, damping: 26 }}
                  >
                    rob1
                  </motion.span>
                )}
                {currentHouse === 1 && (
                  <motion.span
                    key="p198-ptr-rob1-base1"
                    layoutId="p198-ptr-rob1"
                    id="p198-pointer-tag-rob1-base"
                    data-ptr="rob1"
                    initial={{ y: -6, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -6, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 450, damping: 26 }}
                  >
                    rob1
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <div id="p198-house-node-base" data-house-state="base">
              <div id="p198-roof-shape-base" />
              <div id="p198-house-body-base">
                <span id="p198-loot-val-base">$0</span>
                <span id="p198-house-idx-base">base</span>
              </div>
            </div>
          </div>
        )}

        {houses.map((loot, idx) => {
          const isCurrent = idx === currentHouse;
          // rob2 is ALWAYS 1 house back (i - 1)
          const isRob2 = currentHouse >= 1 && idx === currentHouse - 1;
          // rob1 is ALWAYS 2 houses back (i - 2)
          const isRob1 = currentHouse >= 2 && idx === currentHouse - 2;
          const isEvaluated = idx <= currentHouse;

          let houseState = "pending";
          if (isCurrent) houseState = "curr";
          else if (isEvaluated) houseState = "active";

          return (
            <div key={`p198-house-col-${idx}`} id={`p198-house-column-${idx}`}>
              {/* Pointer Badges */}
              <div id={`p198-ptrs-group-${idx}`}>
                <AnimatePresence mode="popLayout">
                  {isRob1 && (
                    <motion.span
                      key="p198-ptr-rob1"
                      layoutId="p198-ptr-rob1"
                      id={`p198-pointer-tag-rob1-${idx}`}
                      data-ptr="rob1"
                      initial={{ y: -6, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -6, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 450, damping: 26 }}
                    >
                      rob1
                    </motion.span>
                  )}
                  {isRob2 && (
                    <motion.span
                      key="p198-ptr-rob2"
                      layoutId="p198-ptr-rob2"
                      id={`p198-pointer-tag-rob2-${idx}`}
                      data-ptr="rob2"
                      initial={{ y: -6, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -6, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 450, damping: 26 }}
                    >
                      rob2
                    </motion.span>
                  )}
                  {isCurrent && !isComplete && (
                    <motion.span
                      key="p198-ptr-curr"
                      layoutId="p198-ptr-curr"
                      id={`p198-pointer-tag-curr-${idx}`}
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

              {/* House Card */}
              <motion.div
                id={`p198-house-node-${idx}`}
                data-house-state={houseState}
                layout
                animate={{
                  scale: isCurrent ? 1.1 : 1
                }}
                transition={{ type: "spring", stiffness: 350, damping: 24 }}
              >
                <div id={`p198-roof-shape-${idx}`} />
                <div id={`p198-house-body-${idx}`}>
                  <span id={`p198-loot-val-${idx}`}>${loot}</span>
                  <span id={`p198-house-idx-${idx}`}>H[{idx}]</span>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Output Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p198-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div id="p198-callout-header-text">{output.label}</div>
            <div id="p198-callout-val-text">{output.value}</div>
            <div id="p198-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}