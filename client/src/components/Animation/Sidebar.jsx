import { useState } from "react";
import { useTheme } from "../../context/ThemeContext.jsx";
import "./Sidebar.css";

export default function Sidebar({ questions = [], activeProblemId, onSelectProblem }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [openTopics, setOpenTopics] = useState({ "Array & Hash Table": true });
  const [isOpen, setIsOpen] = useState(false);

  // Sync theme with aafps_theme via Context
  const { theme } = useTheme();

  // Group questions by topic
  const grouped = (questions || []).reduce((acc, q) => {
    acc[q.topic] = acc[q.topic] || [];
    acc[q.topic].push(q);
    return acc;
  }, {});

  const toggleTopic = (topic) => {
    setOpenTopics((prev) => ({ ...prev, [topic]: !prev[topic] }));
  };

  const filteredQuestions = (list) =>
    list.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleSelectProblem = (id) => {
    onSelectProblem(id);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        id="dsa-sb-toggle-btn"
        data-theme={theme}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Navigation Sidebar"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {isOpen ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
      </button>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          id="dsa-sb-backdrop"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        id="dsa-sb-sidebar"
        data-theme={theme}
        data-is-open={isOpen ? "true" : "false"}
      >
        <div id="dsa-sb-brand-header">
          <span id="dsa-sb-brand-logo">AAFPS Visual</span>
          <span id="dsa-sb-brand-tag">step-by-step pattern animations</span>
        </div>

        <div id="dsa-sb-search-box">
          <input
            id="dsa-sb-search-input"
            type="text"
            placeholder="Search... ⌘K"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div id="dsa-sb-topic-accordion">
          {Object.entries(grouped).map(([topic, items]) => {
            const matchingItems = filteredQuestions(items);
            if (matchingItems.length === 0) return null;

            const isTopicOpen = openTopics[topic] || searchTerm.length > 0;

            return (
              <div key={topic} id={`dsa-sb-group-${topic.replace(/\s+/g, "-").toLowerCase()}`}>
                <button
                  id={`dsa-sb-topic-btn-${topic.replace(/\s+/g, "-").toLowerCase()}`}
                  className="dsa-sb-topic-title"
                  onClick={() => toggleTopic(topic)}
                >
                  <span>
                    {isTopicOpen ? "▾" : "▸"} {topic}
                  </span>
                  <span className="dsa-sb-count-badge">({matchingItems.length})</span>
                </button>

                {isTopicOpen && (
                  <div className="dsa-sb-question-list">
                    {matchingItems.map((q) => {
                      const isSelected = activeProblemId === q.id;
                      return (
                        <div
                          key={q.id}
                          id={`dsa-sb-q-item-${q.id}`}
                          className="dsa-sb-question-item"
                          data-selected={isSelected ? "true" : "false"}
                          onClick={() => handleSelectProblem(q.id)}
                        >
                          <span className="dsa-sb-q-name">{q.title}</span>
                          <span className="dsa-sb-q-desc">{q.algorithm}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
}