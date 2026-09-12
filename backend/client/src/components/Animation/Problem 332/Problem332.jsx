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

  const currentAirport =
    state.currentAirport || (itinerary.length ? itinerary[itinerary.length - 1] : "JFK");

  return (
    <div id="p332-itinerary-canvas">
      {/* Top Metrics Row */}
      <div id="p332-metrics-bar">
        <span id="p332-metric-current">
          Current Location: <b>{currentAirport}</b>
        </span>
        <span id="p332-metric-path">
          Itinerary Length: <b>{itinerary.length} / 5 stops</b>
        </span>
        <span id="p332-metric-algo">
          Algorithm: <b>Hierholzer's DFS Post-Order</b>
        </span>
      </div>

      <div id="p332-itinerary-stage">
        {/* SVG Flight Map Canvas */}
        <div id="p332-map-card">
          <div id="p332-map-card-header">
            <span id="p332-map-title">Eulerian Flight Map</span>
            <span id="p332-sub-legend">Start Airport: JFK</span>
          </div>

          <svg id="p332-flight-map-svg" viewBox="0 0 460 210">
            <defs>
              <marker
                id="p332-arrow"
                markerWidth="8"
                markerHeight="6"
                refX="17"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#3f3f46" />
              </marker>
              <marker
                id="p332-arrow-active"
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
              const isFlown =
                itinerary.includes(ticket.from) && itinerary.includes(ticket.to);

              return (
                <g key={`p332-ticket-${idx}`} id={`p332-ticket-g-${idx}`}>
                  <line
                    id={`p332-ticket-line-${ticket.from}-${ticket.to}`}
                    data-is-flown={isFlown ? "true" : "false"}
                    x1={src.x}
                    y1={src.y}
                    x2={dst.x}
                    y2={dst.y}
                    markerEnd={isFlown ? "url(#p332-arrow-active)" : "url(#p332-arrow)"}
                  />
                </g>
              );
            })}

            {/* Airport Nodes */}
            {Object.entries(AIRPORTS).map(([code, coords]) => {
              const isCurrent = currentAirport === code;
              const isVisited = itinerary.includes(code);

              let nodeState = "idle";
              if (isCurrent) nodeState = "current";
              else if (isVisited) nodeState = "visited";

              return (
                <g key={`p332-airport-${code}`} id={`p332-airport-g-${code}`}>
                  <motion.circle
                    id={`p332-airport-circle-${code}`}
                    data-node-state={nodeState}
                    cx={coords.x}
                    cy={coords.y}
                    r="18"
                    layout
                    animate={{ scale: isCurrent ? 1.15 : 1 }}
                    transition={{ type: "spring", stiffness: 350, damping: 20 }}
                  />
                  <text
                    id={`p332-airport-code-${code}`}
                    x={coords.x}
                    y={coords.y + 4.5}
                    textAnchor="middle"
                  >
                    {code}
                  </text>
                  <text
                    id={`p332-airport-sublabel-${code}`}
                    data-is-active={isCurrent ? "true" : "false"}
                    x={coords.x}
                    y={coords.y - 24}
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
        <div id="p332-lower-deck">
          {/* Adjacency Map (Remaining Tickets) */}
          <div id="p332-adj-deck">
            <div id="p332-adj-deck-title">Remaining Available Tickets (adj)</div>
            <div id="p332-adj-list">
              {Object.keys(AIRPORTS).map((code) => {
                const destinations = adj[code] || [];
                return (
                  <div key={`p332-adj-${code}`} id={`p332-adj-row-${code}`}>
                    <span id={`p332-adj-code-${code}`}>{code} ➔</span>
                    <div id={`p332-dest-badges-${code}`}>
                      {destinations.length === 0 ? (
                        <span id={`p332-empty-dest-${code}`}>Empty (All used)</span>
                      ) : (
                        destinations.map((dst, i) => (
                          <span
                            key={`p332-dst-${code}-${i}`}
                            id={`p332-ticket-pill-${code}-${i}`}
                          >
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
          <div id="p332-itin-deck">
            <div id="p332-itin-deck-title">Reconstructed Itinerary (res)</div>
            <div id="p332-itin-stream">
              {itinerary.length === 0 ? (
                <span id="p332-empty-itin-text">Traversing routes...</span>
              ) : (
                itinerary.map((airport, idx) => (
                  <motion.div
                    key={`p332-itin-stop-${airport}-${idx}`}
                    id={`p332-itin-stop-${airport}-${idx}`}
                    layout
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: idx * 0.08 }}
                  >
                    <span id={`p332-itin-order-${idx}`}>#{idx + 1}</span>
                    <span id={`p332-itin-airport-${idx}`}>{airport}</span>
                    {idx < itinerary.length - 1 && (
                      <span id={`p332-itin-arrow-${idx}`}>➔</span>
                    )}
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
            id="p332-result-callout-box"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div id="p332-callout-header-text">{output.label}</div>
            <div id="p332-callout-val-text">{output.value}</div>
            <div id="p332-callout-detail-text">{output.detail}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}