
import { useNavigate } from "react-router";
import TwoSumVisualizer from "../components/Homepagehelper/Twosumpage.jsx";
import Swim from "../components/Homepagehelper/Cases.jsx";
import "./Homepage.css";
import { useTheme } from "../context/ThemeContext.jsx";
import useFetcher from "../utility/FetchHelper.jsx";
import { useEffect } from "react";

function Homepage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { Activeserver } = useFetcher();
  useEffect(()=> {
    const Timer = 14*60*1000;
    const interval  = setInterval(Activeserver,Timer);
    return ()=> clearInterval(interval);
  },[]);
  

  function handleDSAClick({ a }) {
    if (a === "DSA" || a === "Problem") {
      navigate("/problems");
    }
  }

  return (
    <div id="home-wrapper" data-theme={theme}>
      <div className="myhome">
        <div className="b1">
          <h5>Watch Algorithm</h5>
          <h1>Algorithm you can see.</h1>
          <p>
            Every pattern, stepped through one frame at a time — pointers
            gliding, trees recursing, DP tables filling in. Press play and watch
            the idea unfold.
          </p>
          <button onClick={() => handleDSAClick({ a: "DSA" })}>
            Start with DSA →
          </button>
        </div>
        <div className="b2">
          <TwoSumVisualizer />
        </div>
      </div>

      <div className="myhome" id="thishone">
        <div className="b2">
          <Swim />
        </div>
        <div className="b1">
          <h1>Watch Analyzation Of Your Problems.</h1>
          <p>
            Master algorithmic efficiency with our interactive visualizer. Our
            platform maps best-case, worst-case, and average-case time and space
            complexities in real time, transforming abstract Big O notation into
            clear, actionable visual insights for developers and engineers.
          </p>
          <button id="btn2" onClick={() => handleDSAClick({ a: "Problem" })}>
            See it on real problem →
          </button>
        </div>
      </div>
    </div>
  );
}

export default Homepage;