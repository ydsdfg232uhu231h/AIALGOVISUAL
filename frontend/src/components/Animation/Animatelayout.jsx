// src/Components/Animation/Animatelayout.jsx
import { useState, useEffect } from "react";
import "./Animatelayout.css";
import Sidebar from "./Sidebar";
import { problemRegistry } from "./registry";

export default function AnimateLayout() {
  const [activeProblemId, setActiveProblemId] = useState(1);
  const currentProblem = problemRegistry[activeProblemId] || problemRegistry[1] || {};
  const { Component: VisualCanvas = () => null, data: problemData = {} } = currentProblem;

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [activeTab, setActiveTab] = useState("pseudo"); // "pseudo" or "explanation"

  const steps = problemData.steps || [];
  const totalSteps = steps.length;
  const activeStepData = steps[currentStep] || steps[0] || {};

  // Reset playback and scrubber when switching problems
  useEffect(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, [activeProblemId]);

  // Unified dynamic timer: respects step-specific dwellMs and global speed
  useEffect(() => {
    if (!isPlaying) return;

    const currentStepData = steps[currentStep];
    const baseInterval = 1000 / speed;
    const stepDelay = currentStepData?.dwellMs
      ? currentStepData.dwellMs / speed
      : baseInterval;

    const timer = setTimeout(() => {
      if (currentStep < totalSteps - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, stepDelay);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, speed, totalSteps, steps]);

  if (!totalSteps) {
    return <div className="dsa-app-root">Loading problem data...</div>;
  }

  return (
    <div className="dsa-app-root">
      <Sidebar
        questions={Object.values(problemRegistry).map((p) => p.data)}
        activeProblemId={activeProblemId}
        onSelectProblem={setActiveProblemId}
      />

      <main className="dsa-visual-main">
        <header className="dsa-header">
          <div>
            <span className="sub-badge">{(problemData.topic || "").toUpperCase()}</span>
            <h1 className="header-title">{problemData.title}</h1>
          </div>
          <div className="complexity-group">
            <span className="pill">time <b>{problemData.timeComplexity}</b></span>
            <span className="pill">space <b>{problemData.spaceComplexity}</b></span>
          </div>
        </header>

        <div className="layout-body">
          <section className="viewport-box">
            <div className="animation-container">
              <VisualCanvas stepData={activeStepData} />
            </div>

            <div className="narration-box">
              <span className="line-indicator">line {(activeStepData.activeLine ?? 0) + 1}</span>
              <p className="narration-text">{activeStepData.narration || ""}</p>
            </div>
          </section>

          <aside className="right-inspectors">
            <div className="panel code-inspector">
              <div className="panel-tab">
                <div className="tab-group">
                  <button
                    className={`tab-btn ${activeTab === "pseudo" ? "active" : ""}`}
                    onClick={() => setActiveTab("pseudo")}
                  >
                    Pseudocode
                  </button>
                  <button
                    className={`tab-btn ${activeTab === "explanation" ? "active" : ""}`}
                    onClick={() => setActiveTab("explanation")}
                  >
                    Concept
                  </button>
                </div>
                <a href={problemData.url} target="_blank" rel="noreferrer" className="btn-ref">
                  LeetCode
                </a>
              </div>

              {activeTab === "pseudo" ? (
                <pre className="code-block">
                  {(problemData.codeLines || []).map((line, idx) => (
                    <div
                      key={idx}
                      className={`code-row ${idx === activeStepData.activeLine ? "active-row" : ""}`}
                    >
                      <span className="row-num">{idx + 1}</span>
                      <code>{line}</code>
                    </div>
                  ))}
                </pre>
              ) : (
                <div className="explanation-block">
                  <p>{problemData.explanation}</p>
                </div>
              )}
            </div>

            <div className="panel state-inspector">
              <div className="panel-tab">Variable State</div>
              <div className="state-table">
                {Object.entries(activeStepData.state || {}).map(([k, v]) => (
                  <div key={k} className="state-field">
                    <span className="k-name">{k}</span>
                    <span className="v-val">{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <footer className="playback-footer">
          <button onClick={() => setCurrentStep(0)} className="btn-ctrl" title="Restart">↺</button>
          <button onClick={() => setCurrentStep((s) => Math.max(0, s - 1))} className="btn-ctrl">⏮</button>
          <button onClick={() => setIsPlaying(!isPlaying)} className="btn-ctrl btn-play">
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button onClick={() => setCurrentStep((s) => Math.min(totalSteps - 1, s + 1))} className="btn-ctrl">⏭</button>

          <input
            type="range"
            min="0"
            max={Math.max(0, totalSteps - 1)}
            value={currentStep}
            onChange={(e) => setCurrentStep(Number(e.target.value))}
            className="timeline-scrubber"
          />

          <span className="step-counter">{currentStep + 1} / {totalSteps}</span>

          <button
            onClick={() => setSpeed((s) => (s === 1 ? 1.5 : s === 1.5 ? 2 : 1))}
            className="btn-speed"
          >
            {speed}x
          </button>
        </footer>
      </main>
    </div>
  );
}