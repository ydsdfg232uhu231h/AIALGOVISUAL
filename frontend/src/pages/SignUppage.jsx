import { useState } from "react";
import { useNavigate } from "react-router";
import { useMycontextuser } from "../Mycontextuser.jsx";


function SignUppage() {
  const [authchecker, setauthchecker] = useState(false);
  const {myuser} = useMycontextuser();
  console.log("my users",myuser.name)
   
  const navigate = useNavigate();
  async function handleCicked () {
    const newauthchecked = !authchecker;
    await setauthchecker(newauthchecked);
    if (newauthchecked) {
      return navigate("/login");
    }
    else{
      return navigate("/signup");
    }
  }
  async function HandleSubmitSign(e){
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const formvalue = Object.fromEntries(data);
    console.log("My Data ",formvalue);
    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/signup',
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formvalue),
        });
        if (!response.ok) {
          return;
        }
        console.log(myuser);
        const mydata = await response.json();
        console.log(mydata)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div id="mylogin">
      <form action="/signup"  onSubmit={HandleSubmitSign}>
      <h1>Sign Up</h1>
       <input type="text" name="name" placeholder="Name" />
      
      <input type="email" name="email" placeholder="Email" />
      
      <input type="password" name="password" placeholder="Password" />
      <h5>You need to login even after SignUp</h5>
      <div id="lsbtn">
      <button type="submit">Sign Up</button>
      <button type="button" onClick={handleCicked}>Login</button>
      </div>

      </form>
      </div>
  )
}

export default SignUppage;