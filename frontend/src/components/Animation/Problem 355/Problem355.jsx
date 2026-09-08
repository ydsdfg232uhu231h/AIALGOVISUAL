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
    <div className="canvas-wrapper twitter-canvas">
      {/* Top Telemetry */}
      <div className="metrics-row">
        <span className="metric-chip action-chip">
          Action: <b>{activeAction || "System Idle"}</b>
        </span>
        <span className="metric-chip feed-chip">
          Viewing Feed of: <b>User {focusUser}</b>
        </span>
        <span className="metric-chip heap-chip">
          Heap Frontier: <b>{heap.length} candidates</b>
        </span>
        <span className="metric-chip total-chip">
          Total Generated Feed: <b>{feed.length} tweets</b>
        </span>
      </div>

      <div className="twitter-stage">
        {/* Left Column: 4 User Accounts & Follow Lists */}
        <div className="users-column">
          <div className="column-title">User Timelines & Follow Graph</div>
          <div className="users-grid">
            {users.map((uid) => {
              const theme = USER_THEMES[uid] || USER_THEMES[1];
              const userTweets = tweetMap[uid] || [];
              const userFollows = followMap[uid] || [];
              const isViewer = uid === focusUser;

              return (
                <div
                  key={`user-card-${uid}`}
                  className={`user-profile-card ${isViewer ? "user-card-active" : ""}`}
                  style={{ borderLeftColor: theme.border }}
                >
                  <div className="user-card-header">
                    <div
                      className="user-avatar"
                      style={{
                        color: theme.text,
                        borderColor: theme.border,
                        backgroundColor: theme.bg
                      }}
                    >
                      U{uid}
                    </div>
                    <div className="user-meta">
                      <span className="user-handle">
                        User {uid} {isViewer && <span className="viewer-badge">(Viewer)</span>}
                      </span>
                      <span className="user-following-count">
                        Following:{" "}
                        {userFollows.length
                          ? userFollows.map((f) => `U${f}`).join(", ")
                          : "None"}
                      </span>
                    </div>
                  </div>

                  {/* Tweet Stream */}
                  <div className="user-tweets-strip">
                    {userTweets.length === 0 ? (
                      <span className="empty-tweets">No tweets</span>
                    ) : (
                      userTweets.map((tw, idx) => (
                        <motion.div
                          key={`tw-${uid}-${tw.id}-${idx}`}
                          className="tweet-pill"
                          style={{
                            borderColor: theme.border,
                            backgroundColor: theme.bg
                          }}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                        >
                          <span className="tw-id" style={{ color: theme.text }}>
                            #{tw.id}
                          </span>
                          <span className="tw-time">t={tw.time}</span>
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
        <div className="heap-column">
          <div className="column-title">Max-Heap Priority Queue</div>
          <div className="heap-canister">
            {heap.length === 0 ? (
              <span className="empty-state-text">Heap Empty / All Extracted</span>
            ) : (
              heap.map((item, idx) => {
                const isTop = idx === 0;
                const theme = USER_THEMES[item.userId] || USER_THEMES[1];

                return (
                  <motion.div
                    key={`heap-item-${item.id}-${idx}`}
                    className={`heap-card ${isTop ? "heap-card-top" : ""}`}
                    initial={{ scale: 0.85, y: -8 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="heap-card-main">
                      <span className="heap-tw-id">Tweet #{item.id}</span>
                      <span
                        className="heap-owner-badge"
                        style={{
                          color: theme.text,
                          borderColor: theme.border,
                          backgroundColor: theme.bg
                        }}
                      >
                        U{item.userId}
                      </span>
                    </div>
                    <div className="heap-card-footer">
                      <span className="heap-time-badge">Timestamp: {item.time}</span>
                      {isTop && <span className="top-pill">MAX RECENCY</span>}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Merged Chronological News Feed */}
        <div className="feed-column">
          <div className="column-title">User {focusUser}'s Merged Feed</div>
          <div className="feed-stream">
            {feed.length === 0 ? (
              <span className="empty-state-text">Feed is empty</span>
            ) : (
              feed.map((tweetObj, idx) => {
                const twId = typeof tweetObj === "object" ? tweetObj.id : tweetObj;
                const authorId = typeof tweetObj === "object" ? tweetObj.userId : null;
                const theme = USER_THEMES[authorId] || USER_THEMES[1];

                return (
                  <motion.div
                    key={`feed-item-${twId}-${idx}`}
                    className="feed-tweet-card"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.08 }}
                  >
                    <div className="feed-rank">#{idx + 1}</div>
                    <div className="feed-content">
                      <div className="feed-header-line">
                        <span className="feed-tw-title">Tweet ID {twId}</span>
                        {authorId && (
                          <span
                            className="feed-author"
                            style={{ color: theme.text, borderColor: theme.border }}
                          >
                            U{authorId}
                          </span>
                        )}
                      </div>
                      <span className="feed-tw-sub">Aggregated by recency rank</span>
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