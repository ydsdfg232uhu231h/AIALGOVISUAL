import { useState, useEffect, useRef } from "react";
import "./Animatelayout.css";
import Sidebar from "./Sidebar";
import { problemRegistry } from "./registry";
import { useTheme } from "../../context/ThemeContext";

export default function AnimateLayout() {
  const [activeProblemId, setActiveProblemId] = useState(1);
  const currentProblem = problemRegistry[activeProblemId] || problemRegistry[1] || {};
  const { Component: VisualCanvas = () => null, data: problemData = {} } = currentProblem;
  const buttonref = useRef(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [activeTab, setActiveTab] = useState("pseudo"); // "pseudo" or "explanation"

  // Sync theme with aafps_theme via Context
  const { theme } = useTheme();

  const steps = problemData.steps || [];
  const totalSteps = steps.length;
  const activeStepData = steps[currentStep] || steps[0] || {};

  // Reset playback and scrubber when switching problems
  useEffect(() => {
    setCurrentStep(0);
    setIsPlaying(false);
    buttonref.current?.scrollIntoView({ behavior: "smooth", block: "end" });
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
    return (
      <div id="dsa-app-root" data-theme={theme}>
        Loading problem data...
      </div>
    );
  }

  return (
    <div id="dsa-app-root" data-theme={theme}>
      <Sidebar
        questions={Object.values(problemRegistry).map((p) => p.data)}
        activeProblemId={activeProblemId}
        onSelectProblem={setActiveProblemId}
      />

      <main id="dsa-visual-main" ref={buttonref}>
        <header id="dsa-header">
          <div>
            <span id="dsa-sub-badge">{(problemData.topic || "").toUpperCase()}</span>
            <h1 id="dsa-header-title">{problemData.title}</h1>
          </div>
          <div id="dsa-complexity-group">
            <span id="dsa-pill-time">
              time <b>{problemData.timeComplexity}</b>
            </span>
            <span id="dsa-pill-space">
              space <b>{problemData.spaceComplexity}</b>
            </span>
          </div>
        </header>

        <div id="dsa-layout-body">
          <section id="dsa-viewport-box">
            <div id="dsa-animation-container">
              <VisualCanvas stepData={activeStepData} />
            </div>

            <div id="dsa-narration-box">
              <span id="dsa-line-indicator">line {(activeStepData.activeLine ?? 0) + 1}</span>
              <p id="dsa-narration-text">{activeStepData.narration || ""}</p>
            </div>
          </section>

          <aside id="dsa-right-inspectors">
            <div id="dsa-panel-code-inspector">
              <div id="dsa-panel-code-tab">
                <div id="dsa-tab-group">
                  <button
                    id="dsa-tab-btn-pseudo"
                    data-tab-state={activeTab === "pseudo" ? "active" : "idle"}
                    onClick={() => setActiveTab("pseudo")}
                  >
                    Pseudocode
                  </button>
                  <button
                    id="dsa-tab-btn-concept"
                    data-tab-state={activeTab === "explanation" ? "active" : "idle"}
                    onClick={() => setActiveTab("explanation")}
                  >
                    Concept
                  </button>
                </div>
                <a
                  id="dsa-btn-ref"
                  href={problemData.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  LeetCode
                </a>
              </div>

              {activeTab === "pseudo" ? (
                <pre id="dsa-code-block">
                  {(problemData.codeLines || []).map((line, idx) => (
                    <div
                      key={`dsa-code-row-${idx}`}
                      id={`dsa-code-row-${idx}`}
                      data-is-active={idx === activeStepData.activeLine ? "true" : "false"}
                    >
                      <span id={`dsa-row-num-${idx}`}>{idx + 1}</span>
                      <code id={`dsa-row-code-${idx}`}>{line}</code>
                    </div>
                  ))}
                </pre>
              ) : (
                <div id="dsa-explanation-block">
                  <p id="dsa-explanation-text">{problemData.explanation}</p>
                </div>
              )}
            </div>

            <div id="dsa-panel-state-inspector">
              <div id="dsa-panel-state-tab">Variable State</div>
              <div id="dsa-state-table">
                {Object.entries(activeStepData.state || {}).map(([k, v]) => (
                  <div key={`dsa-state-${k}`} id={`dsa-state-field-${k}`}>
                    <span id={`dsa-k-name-${k}`}>{k}</span>
                    <span id={`dsa-v-val-${k}`}>{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <footer id="dsa-playback-footer">
          <button
            id="dsa-btn-restart"
            data-btn-type="ctrl"
            onClick={() => setCurrentStep(0)}
            title="Restart"
          >
            ↺
          </button>
          <button
            id="dsa-btn-prev"
            data-btn-type="ctrl"
            onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
            title="Previous Step"
          >
            ⏮
          </button>
          <button
            id="dsa-btn-play-toggle"
            data-btn-type="play"
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button
            id="dsa-btn-next"
            data-btn-type="ctrl"
            onClick={() => setCurrentStep((s) => Math.min(totalSteps - 1, s + 1))}
            title="Next Step"
          >
            ⏭
          </button>

          <input
            id="dsa-timeline-scrubber"
            type="range"
            min="0"
            max={Math.max(0, totalSteps - 1)}
            value={currentStep}
            onChange={(e) => setCurrentStep(Number(e.target.value))}
          />

          <span id="dsa-step-counter">
            {currentStep + 1} / {totalSteps}
          </span>

          <button
            id="dsa-btn-speed"
            onClick={() => setSpeed((s) => (s === 1 ? 1.5 : s === 1.5 ? 2 : 1))}
            title="Adjust Speed"
          >
            {speed}x
          </button>
        </footer>
      </main>
    </div>
  );
}