import { useState } from "react";
import { useNavigate } from "react-router";
import Success from "../components/Success";
import useUserdetail from "../components/Userdetail";
import Loading from "../components/Loading";
function LogInpage() {
  const [authchecker,setauthchecker] = useState(false);
  const { refetchUser } = useUserdetail();
  const [showsuc, setsuc] = useState();
  const aobj = { email: "", password: "", message: "" };
  const [logerror, setlogerror] = useState(aobj);
  const navigate = useNavigate();
 
    function handleCicked() {
    const newauthchecked = !authchecker;
    setauthchecker(newauthchecked);
    if (newauthchecked) {
      return navigate("/signup");
    }
    else {
      return navigate("/login");
    }
  }
  async function HandleSubmitlogin(e) {
    e.preventDefault();
    setlogerror(aobj);
    const data = new FormData(e.currentTarget);
    const formvalue = Object.fromEntries(data);
    
    if (!formvalue) {
      throw new Error("incorrect Form details");
    }
    try {
      const response = await fetch('https://aialgovisual-1.onrender.com/api/v1/auth/login',
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formvalue),
        });
      const mydata = await response.json();

      if (!mydata.errors) {
        if (response.status === 403) {
          setlogerror(prev => ({ ...prev, message: mydata.message }))
        }
        else if (response.status === 200) {
          setsuc(mydata);
          await  refetchUser();
          const timer = setTimeout(() => {
            navigate("/home");
            window.location.reload();
          }, 4000);
          return () => clearTimeout(timer);
        
      }

    } 
     
     else  {
          
           setlogerror({
            email: mydata.errors?.find(mes => mes.path === "email")?.msg || "",
            password: mydata.errors?.find(mes => mes.path === "password")?.msg || "",
          })
    }
    if (!response.ok) {
      return;
    }
  
  } catch (error) {
    console.log("Myerror", error)

  }





}
return (
  <div id="mylogin">
    {!showsuc ? <form action="/login" onSubmit={HandleSubmitlogin}>
      <h1>Login</h1>
      {logerror.email !== "" && <h3 style={{ color: "red" }}>{logerror.email}</h3>}
      <input type="email" name="email" autoComplete="false" placeholder="Enter email" />
      {logerror.password !== "" && <h3 style={{ color: "red" }}>{logerror.password}</h3>}
      <input type="password" name="password" autoComplete="false" placeholder="Enter password" />
      {logerror.message !== "" && <h4 style={{ color: "red" }}>{logerror.message}</h4>}
      <div id="lsbtn">
        <button type="submit">Login</button>
        <button type="button" onClick={handleCicked}>Sign Up</button>
      </div>

    </form> : <><Success message={showsuc.message} /> <Loading/></>}
  </div>
)
}

export default LogInpage;