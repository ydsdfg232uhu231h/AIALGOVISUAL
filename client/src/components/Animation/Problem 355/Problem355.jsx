import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem355.css";

const USER_THEMES = {
  1: { text: "#38bdf8", bg: "rgba(56, 189, 248, 0.15)", border: "#38bdf8" },
  2: { text: "#facc15", bg: "rgba(250, 204, 21, 0.15)", border: "#facc15" },
  3: { text: "#22c55e", bg: "rgba(34, 197, 94, 0.15)", border: "#22c55e" },
  4: { text: "#c084fc", bg: "rgba(192, 132, 252, 0.15)", border: "#c084fc" }
};

export default function Problem355({ stepData }) {
  const {
    tweetMap = {},
    followMap = {},
    heap = [],
    feed = [],
    activeAction = null,
    focusUser = 1,
    output
  } = stepData || {};

  const users = [1, 2, 3, 4];

  return (
    <div id="p355-twitter-canvas">
      {/* Top Telemetry */}
      <div id="p355-metrics-bar">
        <span id="p355-metric-action">
          Action: <b>{activeAction || "System Idle"}</b>
        </span>
        <span id="p355-metric-feed">
          Viewing Feed of: <b>User {focusUser}</b>
        </span>
        <span id="p355-metric-heap">
          Heap Frontier: <b>{heap.length} candidates</b>
        </span>
        <span id="p355-metric-total">
          Total Generated Feed: <b>{feed.length} tweets</b>
        </span>
      </div>

      <div id="p355-twitter-stage">
        {/* Left Column: 4 User Accounts & Follow Lists */}
        <div id="p355-users-column">
          <div id="p355-users-title">User Timelines &amp; Follow Graph</div>
          <div id="p355-users-grid">
            {users.map((uid) => {
              const userTweets = tweetMap[uid] || [];
              const userFollows = followMap[uid] || [];
              const isViewer = uid === focusUser;

              return (
                <div
                  key={`p355-user-${uid}`}
                  id={`p355-user-card-${uid}`}
                  data-user-id={uid}
                  data-is-viewer={isViewer ? "true" : "false"}
                >
                  <div id={`p355-user-card-header-${uid}`}>
                    <div
                      id={`p355-user-avatar-${uid}`}
                      data-user-id={uid}
                    >
                      U{uid}
                    </div>
                    <div id={`p355-user-meta-${uid}`}>
                      <span id={`p355-user-handle-${uid}`}>
                        User {uid}{" "}
                        {isViewer && (
                          <span id={`p355-viewer-badge-${uid}`}>(Viewer)</span>
                        )}
                      </span>
                      <span id={`p355-user-following-count-${uid}`}>
                        Following:{" "}
                        {userFollows.length
                          ? userFollows.map((f) => `U${f}`).join(", ")
                          : "None"}
                      </span>
                    </div>
                  </div>

                  {/* Tweet Stream */}
                  <div id={`p355-user-tweets-strip-${uid}`}>
                    {userTweets.length === 0 ? (
                      <span id={`p355-empty-tweets-${uid}`}>No tweets</span>
                    ) : (
                      userTweets.map((tw, idx) => (
                        <motion.div
                          key={`p355-tw-${uid}-${tw.id}-${idx}`}
                          id={`p355-tw-pill-${uid}-${tw.id}-${idx}`}
                          data-user-id={uid}
                          layout
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 350, damping: 20 }}
                        >
                          <span
                            id={`p355-tw-id-${uid}-${tw.id}-${idx}`}
                            data-user-id={uid}
                          >
                            #{tw.id}
                          </span>
                          <span id={`p355-tw-time-${uid}-${tw.id}-${idx}`}>
                            t={tw.time}
                          </span>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center: Priority Queue (Max-Heap) */}
        <div id="p355-heap-column">
          <div id="p355-heap-title">Max-Heap Priority Queue</div>
          <div id="p355-heap-canister">
            {heap.length === 0 ? (
              <span id="p355-empty-heap-text">Heap Empty / All Extracted</span>
            ) : (
              heap.map((item, idx) => {
                const isTop = idx === 0;

                return (
                  <motion.div
                    key={`p355-heap-item-${item.id}-${idx}`}
                    id={`p355-heap-card-${item.id}-${idx}`}
                    data-is-top={isTop ? "true" : "false"}
                    layout
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div id={`p355-heap-card-main-${item.id}-${idx}`}>
                      <span id={`p355-heap-tw-id-${item.id}-${idx}`}>
                        Tweet #{item.id}
                      </span>
                      <span
                        id={`p355-heap-owner-badge-${item.id}-${idx}`}
                        data-user-id={item.userId}
                      >
                        U{item.userId}
                      </span>
                    </div>
                    <div id={`p355-heap-card-footer-${item.id}-${idx}`}>
                      <span id={`p355-heap-time-badge-${item.id}-${idx}`}>
                        Timestamp: {item.time}
                      </span>
                      {isTop && <span id="p355-top-pill">MAX RECENCY</span>}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Merged Chronological News Feed */}
        <div id="p355-feed-column">
          <div id="p355-feed-title">User {focusUser}'s Merged Feed</div>
          <div id="p355-feed-stream">
            {feed.length === 0 ? (
              <span id="p355-empty-feed-text">Feed is empty</span>
            ) : (
              feed.map((tweetObj, idx) => {
                const twId = typeof tweetObj === "object" ? tweetObj.id : tweetObj;
                const authorId = typeof tweetObj === "object" ? tweetObj.userId : null;

                return (
                  <motion.div
                    key={`p355-feed-item-${twId}-${idx}`}
                    id={`p355-feed-card-${twId}-${idx}`}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.08 }}
                  >
                    <div id={`p355-feed-rank-${idx}`}>#{idx + 1}</div>
                    <div id={`p355-feed-content-${idx}`}>
                      <div id={`p355-feed-header-line-${idx}`}>
                        <span id={`p355-feed-tw-title-${idx}`}>Tweet ID {twId}</span>
                        {authorId && (
                          <span
                            id={`p355-feed-author-${idx}`}
                            data-user-id={authorId}
                          >
                            U{authorId}
                          </span>
                        )}
                      </div>
                      <span id={`p355-feed-tw-sub-${idx}`}>
                        Aggregated by recency rank
                      </span>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Result Callout */}
      <AnimatePresence>
        {output && (
          <motion.div
            id="p355-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div id="p355-callout-header-text">{output.label}</div>
            <div id="p355-callout-val-text">{output.value}</div>
            <div id="p355-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}