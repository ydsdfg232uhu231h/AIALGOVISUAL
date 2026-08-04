import {  useState} from "react";
import {useNavigate} from "react-router";
import Success from "../components/Success";

function LogInpage() {
  const [authchecker, setauthchecker] = useState(false); 
  const [isAuth,setisAuth] = useState(()=>{
        const saveauth = localStorage.getItem("auth_user");
        return saveauth !== null? JSON.parse(saveauth): true;
    }); 
    const [showsuc,setsuc] = useState();
   
  
  const navigate = useNavigate();
   function handleCicked () {
    const newauthchecked = !authchecker;
    setauthchecker(newauthchecked);
    if (newauthchecked) {
      return navigate("/signup");
    }
    else{
      return navigate("/login");
    }
  }
  async function HandleSubmitlogin(e){
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const formvalue = Object.fromEntries(data);
    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/login',
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
        const mydata = await response.json();
       
        setsuc(mydata);

        
    } catch (error) {
      console.log(error)
    }
    setisAuth(true);
   
    
   
    if (isAuth) {
      navigate("/home");
    }
  }
  return (
    <div id="mylogin">
      {!showsuc? <form action="/login"  onSubmit={HandleSubmitlogin}>
      <h1>Login</h1>
      
      <input type="email" name="email" placeholder="Enter email" />
      
      <input type="password" name="password" placeholder="Enter password" />
      <div id="lsbtn">
      <button type="submit">Login</button>
      <button type="button" onClick={handleCicked}>Sign Up</button>
      </div>

      </form>: <Success message={showsuc.message}/>}
      </div>
  )
}

export default LogInpage;