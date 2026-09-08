// src/Components/Animation/Sidebar.jsx
import  { useState } from "react";
import "./Sidebar.css";

export default function Sidebar({ questions, activeProblemId, onSelectProblem }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [openTopics, setOpenTopics] = useState({ "Array & Hash Table": true });

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

  return (
    <aside className="dsa-left-sidebar">
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

          const isOpen = openTopics[topic] || searchTerm.length > 0;

          return (
            <div key={topic} className="topic-group">
              <button className="topic-title" onClick={() => toggleTopic(topic)}>
                <span>{isOpen ? "▾" : "▸"} {topic}</span>
                <span className="count-badge">({matchingItems.length})</span>
              </button>

              {isOpen && (
                <div className="question-list">
                  {matchingItems.map((q) => (
                    <div
                      key={q.id}
                      className={`question-item ${activeProblemId === q.id ? "selected" : ""}`}
                      onClick={() => onSelectProblem(q.id)}
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
  );
}