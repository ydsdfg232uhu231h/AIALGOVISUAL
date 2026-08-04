import { Link, NavLink, Outlet } from "react-router";
import { Myfooter } from "./Myfooter";

function Layout() {
     
  return (
    <>
        <header id="mylayout">
            <nav>
                <ul>
                    <li>
                        <h1><Link to={"/"} >AAFPS</Link></h1>
                    </li>
                    <li><NavLink to={"/home"} >Home</NavLink></li>
                    <li><NavLink to={"/problems"}>Problems</NavLink></li>
                    <li><NavLink to={"/ai"}>AI</NavLink></li>
                    <li><NavLink to={"/signup"}>Sign Up</NavLink></li>
                </ul>
            </nav>
        </header>
        <main>
            <Outlet/>
        </main>
        <footer>
            <Myfooter/>
        </footer>
    </>
  )
}

export default Layout;