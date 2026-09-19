import { useState } from "react";
import { useNavigate } from "react-router";
import Success from "../components/Success";
import Loading from "../components/Loading";



function SignUppage() {
  const [authchecker, setauthchecker] = useState(false);
  const [showsuc, setsuc] = useState();
  const navigate = useNavigate();
  const sobj = { name: "", email: "", password: "", message: "" };
  const [signerror, setsignerror] = useState(sobj)
  function handleCicked() {
    const newauthchecked = !authchecker;
    setauthchecker(newauthchecked);
    if (newauthchecked) {
      return navigate("/login");
    }
    else {
      return navigate("/signup");
    }
  }
  async function HandleSubmitSign(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const formvalue = Object.fromEntries(data);
    const email = formvalue?.email;
    console.log("My Data ", email);

    try {
      const url = window.location.origin;
      const response = await fetch(`${url}/api/v1/auth/signup`,
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
          if (response.status === 409) {
            console.log("Email message: ", mydata.message)
            return setsignerror(prev => ({ ...prev, message: mydata.message }))
          }
          else if (response.status === 201) {
            setsuc(mydata);
            const timer = setTimeout(()=>{
              navigate("/login");
              
            },4000)
            return ()=> clearTimeout(timer);
            
          }

        }
        else  {
         
          setsignerror({
            name: mydata.errors?.find(mes => mes.path === "name")?.msg || "",
            email: mydata.errors?.find(mes => mes.path === "email")?.msg || "",
            password: mydata.errors?.find(mes => mes.path === "password")?.msg || "",
          })
        }
       

       
        if (!response.ok) {
          return;
        }

      } catch (error) {
        console.log("User error", error)

      }
    
  }
  return (
    <div id="mylogin">
      {!showsuc ? <form action="/signup" onSubmit={HandleSubmitSign}>
        <h1>Sign Up</h1>
        {signerror.name !== "" && <h3 style={{ color: "red" }}>{signerror.name}</h3>}
        <input type="text" name="name" autoComplete="false" placeholder="Name" />
        {signerror.email !== "" && <h3 style={{ color: "red" }}>{signerror.email}</h3>}
        <input type="email" name="email" autoComplete="false" placeholder="Email" />
        {signerror.password !== "" && <h3 style={{ color: "red" }}>{signerror.password}</h3>}
        <input type="password" name="password" autoComplete="false" placeholder="Password" />
        {signerror.message !== "" && <h4 style={{ color: "red" }}>{signerror.message}</h4>}
        <h5>You need to login even after SignUp</h5>
        <div id="lsbtn">
          <button type="submit">Sign Up</button>
          <button type="button" onClick={handleCicked}>Login</button>
        </div>

      </form> : <><Success message={showsuc.message} /> <Loading/></>}
    </div>
  )
}

export default SignUppage;