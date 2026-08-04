import { useLoaderData } from "react-router"


 function Problemspage() {
  const problemdata = useLoaderData();
  const probdata = problemdata.data;
  console.log(probdata)
  return (
    <>
         <ul>
          {
            probdata.map((mydata, index)=> (
              <li style={{color: "white", backgroundColor: "transparent"}}  key={mydata.id}>Q{index + 1}. <a href={mydata.url}>{mydata.title}</a> </li>
            ))
          }
         </ul>
    </>
  )
}

export default Problemspage