import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Problem332.css";

const AIRPORTS = {
  JFK: { x: 50, y: 130, name: "New York (JFK)" },
  MUC: { x: 140, y: 60, name: "Munich (MUC)" },
  LHR: { x: 230, y: 170, name: "London (LHR)" },
  SFO: { x: 320, y: 60, name: "San Francisco (SFO)" },
  SJC: { x: 410, y: 130, name: "San Jose (SJC)" }
};

const ALL_TICKETS = [
  { from: "JFK", to: "MUC" },
  { from: "MUC", to: "LHR" },
  { from: "LHR", to: "SFO" },
  { from: "SFO", to: "SJC" }
];

export default function Problem332({ stepData }) {
  const {
    adj = {},
    itinerary = [],
    state = {},
    output
  } = stepData || {};

  const currentAirport = state.currentAirport || (itinerary.length ? itinerary[itinerary.length - 1] : "JFK");

  return (
    <div className="canvas-wrapper itinerary-canvas">
      {/* Top Metrics Row */}
      <div className="metrics-row">
        <span className="metric-chip current-chip">
          Current Location: <b>{currentAirport}</b>
        </span>
        <span className="metric-chip path-chip">
          Itinerary Length: <b>{itinerary.length} / 5 stops</b>
        </span>
        <span className="metric-chip algo-chip">
          Algorithm: <b>Hierholzer's DFS Post-Order</b>
        </span>
      </div>

      <div className="itinerary-stage">
        {/* SVG Flight Map Canvas */}
        <div className="map-card">
          <div className="card-header-bar">
            <span>Eulerian Flight Map</span>
            <span className="sub-legend">Start Airport: JFK</span>
          </div>

          <svg viewBox="0 0 460 210" className="flight-map-svg">
            <defs>
              <marker
                id="arrow"
                markerWidth="8"
                markerHeight="6"
                refX="17"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#3f3f46" />
              </marker>
              <marker
                id="arrow-active"
                markerWidth="8"
                markerHeight="6"
                refX="17"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#38bdf8" />
              </marker>
            </defs>

            {/* Flight Route Connections */}
            {ALL_TICKETS.map((ticket, idx) => {
              const src = AIRPORTS[ticket.from];
              const dst = AIRPORTS[ticket.to];
              const isFlown = itinerary.includes(ticket.from) && itinerary.includes(ticket.to);

              return (
                <g key={`ticket-${idx}`}>
                  <line
                    x1={src.x}
                    y1={src.y}
                    x2={dst.x}
                    y2={dst.y}
                    stroke={isFlown ? "#38bdf8" : "#27272a"}
                    strokeWidth={isFlown ? 2.5 : 1.5}
                    strokeDasharray={isFlown ? "none" : "4,4"}
                    markerEnd={isFlown ? "url(#arrow-active)" : "url(#arrow)"}
                  />
                </g>
              );
            })}

            {/* Airport Nodes */}
            {Object.entries(AIRPORTS).map(([code, coords]) => {
              const isCurrent = currentAirport === code;
              const isVisited = itinerary.includes(code);

              return (
                <g key={`airport-${code}`}>
                  <motion.circle
                    cx={coords.x}
                    cy={coords.y}
                    r="18"
                    className={`airport-node ${isCurrent ? "node-current" : isVisited ? "node-visited" : ""}`}
                    animate={{ scale: isCurrent ? 1.15 : 1 }}
                    transition={{ type: "spring", stiffness: 350, damping: 20 }}
                  />
                  <text
                    x={coords.x}
                    y={coords.y + 4.5}
                    className="airport-code-text"
                    textAnchor="middle"
                  >
                    {code}
                  </text>
                  <text
                    x={coords.x}
                    y={coords.y - 24}
                    className={`airport-label-sub ${isCurrent ? "label-active" : ""}`}
                    textAnchor="middle"
                  >
                    {code === "JFK" ? "ORIGIN" : code}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Lower Split: Remaining Tickets Queue & Constructed Itinerary */}
        <div className="lower-deck">
          {/* Adjacency Map (Remaining Tickets) */}
          <div className="deck-card adj-deck">
            <div className="deck-title">Remaining Available Tickets (adj)</div>
            <div className="adj-list">
              {Object.keys(AIRPORTS).map((code) => {
                const destinations = adj[code] || [];
                return (
                  <div key={`adj-${code}`} className="adj-row">
                    <span className="adj-code">{code} ➔</span>
                    <div className="dest-badges">
                      {destinations.length === 0 ? (
                        <span className="empty-dest">Empty (All used)</span>
                      ) : (
                        destinations.map((dst, i) => (
                          <span key={`dst-${code}-${i}`} className="ticket-pill">
                            {dst}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Constructed Itinerary Track */}
          <div className="deck-card itin-deck">
            <div className="deck-title">Reconstructed Itinerary (res)</div>
            <div className="itin-stream">
              {itinerary.length === 0 ? (
                <span className="empty-itin">Traversing routes...</span>
              ) : (
                itinerary.map((airport, idx) => (
                  <motion.div
                    key={`itin-stop-${airport}-${idx}`}
                    className="itin-stop-card"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: idx * 0.08 }}
                  >
                    <span className="itin-order">#{idx + 1}</span>
                    <span className="itin-airport">{airport}</span>
                    {idx < itinerary.length - 1 && <span className="itin-arrow">➔</span>}
                  </motion.div>
                ))
              )}
            </div>
          </div>
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