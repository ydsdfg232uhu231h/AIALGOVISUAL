import { IoMdSearch } from "react-icons/io";
import TwoSumVisualizer from "../Homepagehelper/Twosumpage.jsx";
import { MdOutlineManageSearch } from "react-icons/md";
import { FaExternalLinkAlt, FaPlay, FaPause  } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import "./Myproblemlayout.css"
import CodeEditor from "./Codelinesdis.jsx";
import { Link, useLoaderData, useNavigate, useParams, useRouteLoaderData } from "react-router";
import { FaFastForward,FaFastBackward  } from "react-icons/fa";
import { useState } from "react";
function Myproblemlayout() {
  const [isplay,setisplay]= useState(false);
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
              {/* <h2 id="ma"><FaEdit /></h2> */}
              <h2 id="linkQus"><Link to={"/problems/pesudocode"}>practice</Link></h2>
              <h2><a href={singleprobdata.url} target="_blank" rel="noopener noreferrer"><FaExternalLinkAlt/></a></h2>
            </div>
            <div>
             <CodeEditor pesudocode={singleansdata.pseudoCode} />
            </div>
          </div>
          <div className="box2 b2">Output</div>
          <div className="box1 b1">
            <h4>Step: 4</h4>
            <p>Found it! Left(-2) + Right(7) = 5. Target reached. </p>
          </div>
          <div className="box1">
            <div id={"progressbar"}>
              <h3>Play here</h3>
              <div id="player">
                <h3><FaFastBackward /></h3>
                <h3 onClick={()=>setisplay(!isplay)}> {isplay? <FaPause/> : <FaPlay />} </h3>
                <h3><FaFastForward/></h3>
              </div>
            <progress max={"100%"} value={"60%"}/>

            </div>
          </div>
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