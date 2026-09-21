import { Link, NavLink, useNavigate, Outlet } from "react-router";
import { Myfooter } from "./Myfooter.jsx";
import ProfileLogo from "./ProfileLogo.jsx";
import { useEffect, useState } from "react";
import useUserdetail from "./Userdetail.jsx";
import "./Layout.css";
import { useTheme } from "../context/ThemeContext.jsx";

function Layout() {
  const [myuserd, setmyuserd] = useState(null);
  const navigate = useNavigate();
  const { userdata } = useUserdetail();
const {theme}  =useTheme()
  

  // Listen for theme toggles made on Login, Signup, or Profile page
  

  useEffect(() => {
    try {
      if (!userdata) {
        navigate("/signup");
        return;
      }

      const userdetail = userdata;

      if (!userdetail?.name) {
        navigate("/signup");
        return;
      }

      const myusername = userdetail?.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase();

      setmyuserd(myusername);
    } catch (error) {
      console.error("Error reading user details:", error.message);
      navigate("/signup");
    }
  }, [navigate, userdata]);

  return (
    <div id="layout-app-root" data-theme={theme}>
      <header id="mylayout">
        <nav>
          <ul>
            <li>
              <h1>
                <Link to="/">AAFPS</Link>
              </h1>
            </li>

            <li>
              <NavLink to="/home">Home</NavLink>
            </li>

            <li>
              <NavLink to="/problems">Problems</NavLink>
            </li>

            <li>
              <NavLink to="/ai">AI</NavLink>
            </li>

            {!userdata ? (
              <li>
                <NavLink to="/signup">Sign Up</NavLink>
              </li>
            ) : (
              <li>
                <Link to="/profile">
                  <ProfileLogo Name={myuserd} />
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </header>

      <main id="layout-main-outlet">
        <Outlet />
      </main>

      <footer>
        <Myfooter />
      </footer>
    </div>
  );
}

export default Layout;