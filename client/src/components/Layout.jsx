import { Link, NavLink, useNavigate, Outlet } from "react-router";
import { Myfooter } from "./Myfooter.jsx";
import ProfileLogo from "./ProfileLogo.jsx";
import { useEffect, useState } from "react";
import useUserdetail from "./Userdetail.jsx";

function Layout() {
    const [myuserd, setmyuserd] = useState(null);
    const navigate = useNavigate();
    const {userdata} = useUserdetail();

   useEffect(() => {
    try {
        // 1. Check if user data exists
        if (!userdata) {
            window.location.reload();
            navigate("/signup");
            return;
        }

        const userdetail = userdata;

        // 2. Check if the name exists
        if (!userdetail?.name) {
            navigate("/signup");
            return;
        }

        // 3. Generate initials (e.g., "John Doe" -> "JD")
        const myusername = userdetail.name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase();
            
        // 4. Directly update state (React handles the visual refresh automatically)
        function myuser(){
            setmyuserd(myusername);

        }
        myuser();

    } catch (error) {
        console.error("Error reading user details:", error.message);
        navigate("/signup");
    }
}, [navigate, userdata]); // Added userdata here so it responds to data changes


    return (
        <>
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

            <main>
                <Outlet />
            </main>

            <footer>
                <Myfooter />
            </footer>
        </>
    );
}

export default Layout;