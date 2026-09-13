import "./Profilepage.css";
import defaultuserimage from "../assets/defaultuserimage.png";
import useUserdetail from "../components/Userdetail";
import { IoLogOut } from "react-icons/io5";
import { useNavigate } from "react-router";
import Success, { PopError } from "../components/Success.jsx";
import { useState, useEffect } from "react";

function Profilepage() {
  const { userdata, logoutUser } = useUserdetail();
  const [message, setmessage] = useState({ error: "", success: "" });
  const navigate = useNavigate();

  useEffect(() => {
    if (!userdata) {
      navigate("/signup");
    }
  }, [userdata, navigate]);

  async function handleLogout(e) {
    e.preventDefault();
    try {
      const response = await fetch("https://aialgovisual.onrender.com/api/v1/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: userdata?.email }),
      });

      const data = await response.json();

      if (!response.ok) {
        return setmessage({ error: data.message, success: "" });
      }

      if (response.status === 200) {
        logoutUser();
        navigate("/signup");
      }
    } catch (error) {
      console.error(error);
      setmessage({ error: "Logout failed", success: "" });
    }
  }

  if (!userdata) return null;

  return (
    <>
      {message.error && <PopError message={message.error} />}
      {message.success && <Success message={message.success} />}
      <div id="profilecontainer">
        <div id="profile">
          <img src={defaultuserimage} alt="unable to load" />
          <h1>{userdata?.name}</h1>
          <h3>{userdata?.email}</h3>
          <h3 id="logout">
            <button onClick={handleLogout}>
              <IoLogOut /> Logout
            </button>
          </h3>
        </div>
      </div>
    </>
  );
}

export default Profilepage;