import  { useState, useEffect } from "react";

// Test case configurations for the Hash Map approach
const CASES = {
  best: {
    label: "Best Case",
    array: [3, 7, 9, 12, 15],
    target: 10,
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    description: "Match found instantly on the very first pair check.",
    steps: [
      { idx: 0, val: 3, comp: 7, map: {}, text: "Checking 3. Need 7. Map empty.", found: false },
      { idx: 1, val: 7, comp: 3, map: { 3: 0 }, text: "Checking 7. Need 3. Found 3 in Map!", found: true }
    ]
  },
  average: {
    label: "Average Case",
    array: [1, 4, 6, 8, 11],
    target: 14,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    description: "Match discovered somewhere near the middle of the array.",
    steps: [
      { idx: 0, val: 4, comp: 10, map: {}, text: "Checking 4. Need 10. Not in map.", found: false },
      { idx: 1, val: 1, comp: 13, map: { 4: 0 }, text: "Checking 1. Need 13. Not in map.", found: false },
      { idx: 2, val: 6, comp: 8, map: { 4: 0, 1: 1 }, text: "Checking 6. Need 8. Not in map.", found: false },
      { idx: 3, val: 8, comp: 6, map: { 4: 0, 1: 1, 6: 2 }, text: "Checking 8. Need 6. Found 6 in Map!", found: true }
    ]
  },
  worst: {
    label: "Worst Case",
    array: [1, 2, 3, 5, 4],
    target: 9,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    description: "Match is at the absolute end, or doesn't exist at all.",
    steps: [
      { idx: 0, val: 1, comp: 8, map: {}, text: "Checking 1. Need 8. Not in map.", found: false },
      { idx: 1, val: 2, comp: 7, map: { 1: 0 }, text: "Checking 2. Need 7. Not in map.", found: false },
      { idx: 2, val: 3, comp: 6, map: { 1: 0, 2: 1 }, text: "Checking 3. Need 6. Not in map.", found: false },
      { idx: 3, val: 5, comp: 4, map: { 1: 0, 2: 1, 3: 2 }, text: "Checking 5. Need 4. Not in map.", found: false },
      { idx: 4, val: 4, comp: 5, map: { 1: 0, 2: 1, 3: 2, 5: 3 }, text: "Checking 4. Need 5. Found 5 in Map!", found: true }
    ]
  }
};

export default function TwoSumComplexityVisualizer() {
  const [activeTab, setActiveTab] = useState("best");
  const [stepIdx, setStepIdx] = useState(0);

  const currentCase = CASES[activeTab];
  const currentStep = currentCase.steps[stepIdx];
  // Automatically advance steps inside the selected case timeline
  useEffect(() => {
    const timeout = setTimeout(()=>{
      setStepIdx(0); // Reset whenever tab shifts

    }, 0);
    
    const interval = setInterval(() => {
      setStepIdx((prev) => {
        if (prev < currentCase.steps.length - 1) return prev + 1;
        return 0; // Loop timeline
      });
    }, 2500);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval); 
    }
  }, [activeTab,currentCase]);

  return (
    <div style={styles.cardFrame}>
      {/* Top Header Row Layout */}
      <div style={styles.headerRow}>
        <div style={styles.windowDots}>
          <span>Live</span>
        </div>
        <div style={styles.headerTitle}>two-sum · case complexities</div>
      </div>

      {/* Navigation Filter Tabs */}
      <div style={styles.tabContainer}>
        {Object.keys(CASES).map((key) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              ...styles.tabButton,
              borderColor: activeTab === key ? "#10b981" : "#334155",
              color: activeTab === key ? "#ffffff" : "#a8a29e",
              backgroundColor: activeTab === key ? "#1c1917" : "transparent"
            }}
          >
            <span
              style={{
                ...styles.tabDot,
                backgroundColor: key === "best" ? "#10b981" : key === "average" ? "#eab308" : "#f43f5e"
              }}
            />
            {CASES[key].label}
          </button>
        ))}
        <h2 style={{marginLeft: "auto"}}>Target: {currentCase.target}</h2>
      </div>

      {/* Metrics Row Grid Layout */}
      <div style={styles.metricsGrid}>
        <div>
          <div style={styles.metricLabel}>TIME</div>
          <div style={styles.metricValue}>{currentCase.timeComplexity}</div>
        </div>
        <div>
          <div style={styles.metricLabel}>SPACE</div>
          <div style={{ ...styles.metricValue, color: "#e2e8f0" }}>{currentCase.spaceComplexity}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={styles.metricLabel}>WORK MEASURE</div>
          <div style={styles.workProgressLabel}>
            Step {stepIdx + 1} of {currentCase.steps.length} ops
          </div>
          <div style={styles.progressBarBg}>
            <div
              style={{
                ...styles.progressBarFill,
                width: `${((stepIdx + 1) / currentCase.steps.length) * 100}%`
              }}
            />
          </div>
        </div>
      </div>

      {/* Interactive Visual Execution Panel */}
      <div style={styles.visualizerBox}>
        {/* The Array Items Lineup */}
        <div style={styles.arrayLine}>
          {currentCase.array.map((num, i) => {
            const isActive = currentStep?.idx === i;
            const isMatched = currentStep?.found && (i === currentStep.idx || currentCase.array[i] === currentStep.comp);
            
            return (
              <div
                key={i}
                style={{
                  ...styles.arrayNode,
                  borderColor: isMatched ? "#10b981" : isActive ? "#38bdf8" : "#2e2a24",
                  backgroundColor: isMatched ? "#065f46" : isActive ? "#0c4a6e" : "#1c1917"
                }}
              >
                {num}
              </div>
            );
          })}
        </div>

        {/* Dynamic Memory Map Registry Mirror */}
        <div style={styles.mapConsole}>
          <span style={{ color: "#a8a29e" }}>Hash Map Cache: </span>
          {Object.keys(currentStep?.map || {}).length === 0 ? (
            <span style={{ color: "#78716c", fontStyle: "italic" }}>&#123; empty &#125;</span>
          ) : (
            <span style={{ color: "#10b981", fontFamily: "monospace" }}>
              &#123; {Object.entries(currentStep.map).map(([k, v]) => `"${k}": idx ${v}`).join(", ")} &#125;
            </span>
          )}
        </div>
      </div>

      {/* Description Explainer Banner */}
      <div style={styles.descriptionText}>
        <strong>{currentStep?.text}</strong> — {currentCase.description}
      </div>
      
    </div>
  );
}

// Exactly 700px by 400px Premium Box Layout Styles
const styles = {
  cardFrame: {
    width: "645px",
    height: "395px",
    backgroundColor: "#141210",
    border: "1px solid #2e2a24",
    borderRadius: "12px",
    padding: "24px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    fontFamily: "system-ui, -apple-system, sans-serif",
    color: "#ffffff"
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  windowDots: { display: "flex", gap: "6px", backgroundColor: "green", padding: "5px 10px", borderRadius: "10px" },
  dot: { width: "10px", height: "10px", borderRadius: "50%" },
  headerTitle: { fontSize: "0.85rem", color: "#78716c", fontFamily: "monospace" },
  tabContainer: { display: "flex", gap: "10px", alignItems: "center", marginTop: "12px" },
  tabButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 14px",
    borderRadius: "20px",
    border: "1px solid",
    fontSize: "0.85rem",
    cursor: "pointer",
    transition: "all 0.2s ease"
  },
  tabDot: { width: "6px", height: "6px", borderRadius: "50%" },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 2fr",
    alignItems: "center",
    marginTop: "16px",
    borderBottom: "1px solid #2e2a24",
    paddingBottom: "16px"
  },
  metricLabel: { fontSize: "0.75rem", color: "#78716c", fontWeight: "bold", letterSpacing: "1px" },
  metricValue: { fontSize: "2rem", fontWeight: "bold", color: "#10b981", marginTop: "4px", fontFamily: "monospace" },
  workProgressLabel: { fontSize: "0.85rem", color: "#10b981", fontFamily: "monospace", marginTop: "4px" },
  progressBarBg: { width: "100%", height: "6px", backgroundColor: "#1c1917", borderRadius: "3px", marginTop: "8px", overflow: "hidden" },
  progressBarFill: { height: "100%", backgroundColor: "#10b981", transition: "width 0.4s ease-in-out" },
  visualizerBox: {
    backgroundColor: "#191614",
    border: "1px solid #2e2a24",
    borderRadius: "8px",
    padding: "16px",
    flexGrow: 1,
    marginTop: "16px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "14px"
  },
  arrayLine: { display: "flex", gap: "10px" },
  arrayNode: {
    width: "45px",
    height: "45px",
    border: "2px solid",
    borderRadius: "6px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: "1.1rem",
    transition: "all 0.3s ease"
  },
  mapConsole: { fontSize: "0.85rem", fontFamily: "monospace" },
  descriptionText: {
    fontSize: "0.9rem",
    color: "#a8a29e",
    marginTop: "14px",
    lineHeight: "1.4"
  }
};
