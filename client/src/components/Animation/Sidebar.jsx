import { useState } from "react";
import "./Sidebar.css";

export default function Sidebar({ questions, activeProblemId, onSelectProblem }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [openTopics, setOpenTopics] = useState({ "Array & Hash Table": true });
  const [isOpen, setIsOpen] = useState(false);

  // Group questions by topic
  const grouped = questions.reduce((acc, q) => {
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
      {/* Menu Button (Only Visible on Mobile via CSS) */}
      <button 
        className="sidebar-toggle-btn" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Navigation Sidebar"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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

      {/* Mobile Dark Overlay */}
      {isOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      {/* Sidebar Panel */}
      <aside className={`dsa-left-sidebar ${isOpen ? "is-open" : ""}`}>
        <div className="brand-header">
          <span className="brand-logo">AAFPS Visual</span>
          <span className="brand-tag">step-by-step pattern animations</span>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search... ⌘K"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="topic-accordion">
          {Object.entries(grouped).map(([topic, items]) => {
            const matchingItems = filteredQuestions(items);
            if (matchingItems.length === 0) return null;

            const isTopicOpen = openTopics[topic] || searchTerm.length > 0;

            return (
              <div key={topic} className="topic-group">
                <button className="topic-title" onClick={() => toggleTopic(topic)}>
                  <span>{isTopicOpen ? "▾" : "▸"} {topic}</span>
                  <span className="count-badge">({matchingItems.length})</span>
                </button>

                {isTopicOpen && (
                  <div className="question-list">
                    {matchingItems.map((q) => (
                      <div
                        key={q.id}
                        className={`question-item ${activeProblemId === q.id ? "selected" : ""}`}
                        onClick={() => handleSelectProblem(q.id)}
                      >
                        <span className="q-name">{q.title}</span>
                        <span className="q-desc">{q.algorithm}</span>
                      </div>
                    ))}
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