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
                function Myuserset(){
                    setmyuserd(myusername);
                }
                Myuserset();


        } catch (error) {
            console.error("Error reading user details:", error.message);
            navigate("/signup");
        }
    }, [navigate, userdata]);


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