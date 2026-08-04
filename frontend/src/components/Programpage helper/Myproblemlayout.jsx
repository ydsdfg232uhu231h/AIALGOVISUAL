import { IoMdSearch } from "react-icons/io";
// import {useNavigate} from "react-router"
import TwoSumVisualizer from "../Homepagehelper/Twosumpage";
import { MdOutlineManageSearch } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { IoCopyOutline } from "react-icons/io5";
  
import CodeEditor from "./codelinesdis";
function Myproblemlayout() {
  // const navigate = useNavigate();
  function handlesendhome(){
    // navigate("/home")
console.log("home");
  }
  return (
    <>
      <div id="probdis">
        <div id="probques">
          <div className="myarrow" onClick={handlesendhome}>
            <h4>← </h4>
            <h5> Home</h5>
          </div>
          <h1>DSA Problems Solving</h1>
          <div id="quesinput">
            <h1><IoMdSearch />  Search <MdOutlineManageSearch id="searchmenu" /></h1>
          </div>
        </div>
        <div id="probans">
          <div className="box2">
            <div className="box22">
              <h1>Brute Force</h1>
              <h2 id="ma"><FaEdit /> Practice</h2>
              <h2><IoCopyOutline /> copy</h2>
            </div>
            <div>
              <CodeEditor/>
            </div>
          </div>
          <div className="box2 b2">Output</div>
          <div className="box1 b1">
            gregre
          </div>
          <div className="box1">we need to add player here</div>
          <div className="box3">
            <div>
              <h2>Algorithm</h2>
            </div>
            <div>
              <h3>Time: O(n)</h3>
            </div>
            <div>
              <h3>space: O(1)</h3>
            </div>


          </div>
          <div className="box4">
            <h5>Concept</h5>
            <h1>Introduction</h1>
            <div className="box44">
              <h1>Oposite-ends two pointer</h1>
            </div>
          </div>
          <div className="box5">
            <TwoSumVisualizer />
          </div>
        </div>

      </div>
    </>
  )
}

export default Myproblemlayout