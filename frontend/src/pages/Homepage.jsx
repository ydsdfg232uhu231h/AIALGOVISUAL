  import TwoSumVisualizer from "../components/Homepagehelper/Twosumpage.jsx";
  import TwoSumComplexityVisualizer from "../components/Homepagehelper/Cases.jsx";


function Homepage() {
  return (
    <>
      <div className="myhome">
        <div className="b1" >
            <h5>watch algorithm</h5>
            <h1>Algorithm You can see.</h1>
            <p>Every pattern, stepped through one frame at a time — pointers gliding, trees recursing, DP tables filling in. Press play and watch the idea unfold.</p>
            <button>Start with DSA →</button>
        </div>
        <div className="b2">
          <TwoSumVisualizer/>
        </div>
      </div>
      <div className="myhome">
        <div className="b2">
          <TwoSumComplexityVisualizer/>
        </div>
        <div className="b1" >

            <h1>watch analyzation of Your Problems.</h1>
            <p> Master algorithmic efficiency with our interactive visualizer. Our platform maps best-case, worst-case, and average-case time and space complexities in real time, transforming abstract Big O notation into clear, actionable visual insights for developers and engineers.</p>
            <button id="btn2">See it on real problem →</button>
        </div>
        </div>        
    </>
  )
}

export default Homepage;