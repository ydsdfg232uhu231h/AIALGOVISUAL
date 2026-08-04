import "./Profilepage.css";
import defaultuserimage from "../assets/defaultuserimage.png";

function Profilepage() {
  const userdata = JSON.parse(localStorage?.getItem("usersdata"));
  return (
    <>
        <div id="profilecontainer">
        <div id='profile'>
            <img src={defaultuserimage} alt="uable to load" />
            <h1>{userdata.firstname} {userdata.lastname}</h1>
            <h2>{userdata.role}</h2>
            <h3>{userdata.email}</h3>
            
            <p>Gender: {userdata.gender}</p>
            <p>Phone: {userdata.phone}</p>
        </div>

        </div>
    </>
  )
}

export default Profilepage;