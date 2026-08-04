import { useState, useEffect } from "react";
import styles from "./Twosum.module.css";

export default function TwoSumVisualizer() {
  // CONFIGURATION: Change these to any values! The code will adjust automatically.
  const array = [-5, -2, 1, 4, 7, 9];
const target = 5; 



  // 1. Core State Hooks
  const [leftIdx, setLeftIdx] = useState(0);
  const [rightIdx, setRightIdx] = useState(array.length - 1);
  const [stepCount, setStepCount] = useState(1);
  const [stepText, setStepText] = useState("Initializing algorithm...");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // 2. The Dynamic Algorithm Loop
  useEffect(() => {
    // Stop processing if pointers cross or a match is locked down
    if (isDone) return;

    const interval = setInterval(() => {
      // Safety check: if pointers meet or cross, the search has failed
      if (leftIdx >= rightIdx) {
        setStepText(`Step ${stepCount}: Pointers crossed. No pair matches target ${target}.`);
        setIsDone(true);
        clearInterval(interval);
        return;
      }

      const currentSum = array[leftIdx] + array[rightIdx];

      // CONDITION A: Match found!
      if (currentSum === target) {
        setStepText(
          `Step ${stepCount}: Found it! Left(${array[leftIdx]}) + Right(${array[rightIdx]}) = ${currentSum}. Target reached.`
        );
        setIsSuccess(true);
        setIsDone(true);
        clearInterval(interval);
      } 
      // CONDITION B: Sum is too big
      else if (currentSum > target) {
        setStepText(
          `Step ${stepCount}: Left(${array[leftIdx]}) + Right(${array[rightIdx]}) = ${currentSum}. Too high! Shifting Right leftward.`
        );
        setRightIdx((prev) => prev - 1);
        setStepCount((prev) => prev + 1);
      } 
      // CONDITION C: Sum is too small
      else {
        setStepText(
          `Step ${stepCount}: Left(${array[leftIdx]}) + Right(${array[rightIdx]}) = ${currentSum}. Too low! Shifting Left rightward.`
        );
        setLeftIdx((prev) => prev + 1);
        setStepCount((prev) => prev + 1);
      }
    }, 3000); // Progresses safely every 3 seconds

    return () => clearInterval(interval);
  }, [leftIdx, rightIdx, stepCount, isDone]);


  // 3. Reset Engine loop if you want to watch it replay
  useEffect(() => {
    if (isDone) {
      const resetTimeout = setTimeout(() => {
        setLeftIdx(0);
        setRightIdx(array.length - 1);
        setStepCount(1);
        setStepText("Restarting dynamic simulation...");
        setIsSuccess(false);
        setIsDone(false);
      }, 5000); // Holds the final result on screen for 5 seconds before looping
      return () => clearTimeout(resetTimeout);
    }
  }, [isDone]);


  // Dimension step adjustments (70px CSS box layout width + 15px layout grid gap)
  const stepDistance = 85; 

  return (
    <div className={styles.container}>
      <div>
        <h2 className={styles.title}>Dynamic Two Sum Visualizer</h2>
        <p className={styles.subtitle}>
          Searching for Target = <span className={styles.target}>{target}</span>
        </p>
      </div>

      <div className={styles.arrayContainer}>
        {array.map((num, idx) => {
          const isPointerActive = idx === leftIdx || idx === rightIdx;
          const showSuccessHighlight = isSuccess && isPointerActive;

          // Assemble modular class extensions dynamically
          const elementClass = `${styles.element} ${
            showSuccessHighlight ? styles.elementSuccess : ""
          }`;

          return (
            <div key={idx} className={elementClass}>
              <span className={styles.indexLabel}>{idx}</span>
              {num}
            </div>
          );
        })}

        {/* Left Indicator Arrow Block */}
        <div
          className={`${styles.pointer} ${styles.leftPointer}`}
          style={{ transform: `translateX(${leftIdx * stepDistance}px)` }}
        >
          ↑ <br /> Left
        </div>

        {/* Right Indicator Arrow Block */}
        <div
          className={`${styles.pointer} ${styles.rightPointer}`}
          style={{ transform: `translateX(${rightIdx * stepDistance}px)` }}
        >
          ↑ <br /> Right
        </div>
      </div>

      {/* Dynamic Text Ticker Console Box */}
      <div className={styles.ticker}>{stepText}</div>
    </div>
  );
}
