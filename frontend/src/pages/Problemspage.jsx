import { useRouteLoaderData,Link } from "react-router"
import style from "./Problemspage.module.css";

 function Problemspage() {
  const problemdata = useRouteLoaderData("problems");
  const probdata = problemdata.data;
  
  return (
    <>
        <h1>DSA Problem</h1>
         <ul>
          {
            probdata.map((mydata, index)=> (
              <li id={style.problemques} key={mydata.id}><Link to={`/problems/${mydata.id}`}>Q{index + 1} {mydata.title}</Link></li>
              
            ))
          }
         </ul>
    </>
  )
}

export default Problemspage