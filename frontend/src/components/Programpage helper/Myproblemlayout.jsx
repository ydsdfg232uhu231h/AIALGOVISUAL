import { IoMdSearch } from "react-icons/io";
import {useState} from "react";
import TwoSumVisualizer from "../Homepagehelper/Twosumpage";
import { MdOutlineManageSearch } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { VscRunCompact } from "react-icons/vsc";
import { IoCopyOutline } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa";
import "./Myproblemlayout.css"
import CodeEditor from "./Codelinesdis.jsx";
import { Link, useLoaderData, useNavigate, useParams, useRouteLoaderData } from "react-router";
function Myproblemlayout() {
  const [userCodeRun,setUserCodeRun] = useState(false);
  const navigate = useNavigate();
  const problemdata = useRouteLoaderData("problems");
  const answerdata = useLoaderData();
  
  const prodata = problemdata.data;
  const ansdata = answerdata.data;
  const parms = useParams();
  const targetId = parms?.id;
  
  const singleprobdata = prodata.find(par=> par.id == targetId);
  const singleansdata = ansdata.find(par=> par.id == targetId);
  const questiondisplay = prodata.filter(ques=> ques?.id != targetId);
  function handlesendproblems(){
    navigate("/problems");
  }
  
   
    
  
  return (
    <>
      <div id="probdis">
        <div id="probques">
          <div className="myarrow" onClick={handlesendproblems}>
            <h4><FaArrowLeft/> </h4>
            <h5>Problems</h5>
          </div>
          <h1>DSA Problems Solving</h1>
          <div id="quesinput">
            <h1><IoMdSearch />  Search <MdOutlineManageSearch id="searchmenu" /></h1>
          </div>
          <ul>
          {
            questiondisplay.map((mydata, index)=> (
              <li id={"problemques"} key={mydata.id}><Link to={`/problems/${mydata.id}`} >Q{index + 1}.{mydata.title}</Link> </li>
            ))
          }
         </ul>
        <div>
        </div>
        </div>
        
        <div id="probans">
          <div className="box2">
            <div className="box22">
              <div className="box22">
              <h1>{singleprobdata.algorithm}</h1>

              </div>
              <h2 id="ma" onClick><a href={singleprobdata.url} target="_blank" rel="noopener noreferrer"><FaEdit /></a></h2>
              <h2><VscRunCompact onClick={()=> setUserCodeRun(!userCodeRun)} /></h2>
              <h2><IoCopyOutline /></h2>
              <h3 id="linkQus"><a href={singleprobdata.url} target="_blank" rel="noopener noreferrer">practice</a></h3>
            </div>
            <div>
             {!userCodeRun && <CodeEditor pesudocode={singleansdata.pseudoCode} />}
            </div>
          </div>
          <div className="box2 b2">Output</div>
          <div className="box1 b1">
            gregre
          </div>
          <div className="box1">we need to add player here</div>
          <div className="box3">
            <div>
              <h2>{singleprobdata.algorithm}</h2>
            </div>
            <div>
              <h3>Time: {singleprobdata.timeComplexity}</h3>
            </div>
            <div>
              <h3>space: {singleprobdata.timeComplexity}</h3>
            </div>


          </div>
          <div className="box4">
            <h5>{singleprobdata.topic}</h5>
            <h1>{singleprobdata.title}</h1>
            <div className="box44">
              <h1>{singleprobdata.oneLinerQuestion}</h1>
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