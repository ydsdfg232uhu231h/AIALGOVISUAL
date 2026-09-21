import { useState, useEffect } from "react";
import styles from "./Twosum.module.css";
import { useTheme } from "../../context/ThemeContext";

export default function TwoSumVisualizer() {
  const array = [-5, -2, 1, 4, 7, 9];
  const target = 5;

  const [leftIdx, setLeftIdx] = useState(0);
  const [rightIdx, setRightIdx] = useState(array.length - 1);
  const [stepCount, setStepCount] = useState(1);
  const [stepText, setStepText] = useState("Initializing algorithm...");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // Sync theme with aafps_theme via Context
  const { theme } = useTheme();

  useEffect(() => {
    if (isDone) return;

    const interval = setInterval(() => {
      if (leftIdx >= rightIdx) {
        setStepText(`Step ${stepCount}: Pointers crossed. No pair matches target ${target}.`);
        setIsDone(true);
        clearInterval(interval);
        return;
      }

      const currentSum = array[leftIdx] + array[rightIdx];

      if (currentSum === target) {
        setStepText(
          `Step ${stepCount}: Found it! Left(${array[leftIdx]}) + Right(${array[rightIdx]}) = ${currentSum}. Target reached.`
        );
        setIsSuccess(true);
        setIsDone(true);
        clearInterval(interval);
      } else if (currentSum > target) {
        setStepText(
          `Step ${stepCount}: Left(${array[leftIdx]}) + Right(${array[rightIdx]}) = ${currentSum}. Too high! Decrementing Right pointer.`
        );
        setRightIdx((prev) => prev - 1);
        setStepCount((prev) => prev + 1);
      } else {
        setStepText(
          `Step ${stepCount}: Left(${array[leftIdx]}) + Right(${array[rightIdx]}) = ${currentSum}. Too low! Incrementing Left pointer.`
        );
        setLeftIdx((prev) => prev + 1);
        setStepCount((prev) => prev + 1);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [leftIdx, rightIdx, stepCount, isDone]);

  useEffect(() => {
    if (isDone) {
      const resetTimeout = setTimeout(() => {
        setLeftIdx(0);
        setRightIdx(array.length - 1);
        setStepCount(1);
        setStepText("Restarting simulation...");
        setIsSuccess(false);
        setIsDone(false);
      }, 5000);
      return () => clearTimeout(resetTimeout);
    }
  }, [isDone]);

  const currentSum = array[leftIdx] + array[rightIdx];

  return (
    <div className={styles.container} data-theme={theme}>
      {/* Top Metric Bar */}
      <div className={styles.metricsBar}>
        <div className={styles.metricPill}>
          Target: <b className={styles.metricTarget}>{target}</b>
        </div>
        <div className={styles.metricPill}>
          Left: <b className={styles.metricValLeft}>idx [{leftIdx}] = {array[leftIdx]}</b>
        </div>
        <div className={styles.metricPill}>
          Right: <b className={styles.metricValRight}>idx [{rightIdx}] = {array[rightIdx]}</b>
        </div>
        <div className={styles.metricPill}>
          Current Sum: <b className={styles.metricSum}>{array[leftIdx]} + {array[rightIdx]} = {currentSum}</b>
        </div>
        <div
          className={`${styles.metricPill} ${
            isSuccess ? styles.statusSuccess : styles.statusPending
          }`}
        >
          Status: <span>{isSuccess ? "MATCH FOUND" : "SEARCHING"}</span>
        </div>
      </div>

      {/* Main Visualizer Stage Card */}
      <div className={styles.stageCard}>
        <div className={styles.cardHeader}>
          <span>1. Two-Pointer Array Scan</span>
          <span className={styles.cardSubtitle}>Moving Left/Right pointers based on sum</span>
        </div>

        <div className={styles.arrayContainer}>
          {array.map((num, idx) => {
            const isLeft = idx === leftIdx;
            const isRight = idx === rightIdx;
            const isMatched = isSuccess && (isLeft || isRight);

            let nodeClass = styles.element;
            if (isMatched) {
              nodeClass += ` ${styles.elementSuccess}`;
            } else if (isLeft) {
              nodeClass += ` ${styles.elementLeftActive}`;
            } else if (isRight) {
              nodeClass += ` ${styles.elementRightActive}`;
            }

            return (
              <div key={idx} className={styles.cellCarrier}>
                {/* Pointer Label Lane */}
                <div className={styles.pointerLane}>
                  {isLeft && <span className={styles.pointerBadgeLeft}>L ➔ [{idx}]</span>}
                  {isRight && <span className={styles.pointerBadgeRight}>R ➔ [{idx}]</span>}
                </div>

                {/* Node Box */}
                <div className={nodeClass}>
                  <span className={styles.elementVal}>{num}</span>
                  <span className={styles.indexLabel}>idx [{idx}]</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ticker Banner */}
      <div className={styles.ticker}>{stepText}</div>
    </div>
  );
}