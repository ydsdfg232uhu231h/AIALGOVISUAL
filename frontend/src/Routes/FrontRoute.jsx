import { createBrowserRouter, RouterProvider } from "react-router";
import Layout from "../components/Layout.jsx";
import Homepage from "../pages/Homepage.jsx";
import AI from "../pages/AI.jsx";
import LogInpage from "../pages/LogInpage.jsx";
import SignUppage from "../pages/SignUppage.jsx";
import Problemspage from "../pages/Problemspage.jsx";
import Welcomepage from "../pages/Welcomepage.jsx";
import Myproblemlayout from "../components/Programpage helper/Myproblemlayout";
import loadprob, { loadprobans } from "../components/Programpage helper/loadprob.jsx";
import Loading from "../components/Loading.jsx";

import Errorpage from "../pages/Errorpage.jsx";
import Errors from "../components/Error.jsx";
import Profilepage from "../pages/Profilepage.jsx";
import MyProtectedRoutes from "./MyProtectedRoutes.jsx";

function FrontRoute() {
    const myroute = createBrowserRouter([
        {
            path: "/", element: <Layout />, errorElement: <Errorpage />,
            children: [
                {
                    index: true,
                    element:
                        <MyProtectedRoutes>
                            <Homepage />
                        </MyProtectedRoutes>
                },
                {
                    path: "/home",
                    element:
                        <MyProtectedRoutes>
                            <Homepage />
                        </MyProtectedRoutes>
                },
                {
                    path: "/ai", element:
                        <MyProtectedRoutes>
                            <AI />
                        </MyProtectedRoutes>

                },
                {
                    path: "/login", 
                    element: <LogInpage />
                        

                },
                {
                    path: "/signup", element: <SignUppage />

                },
                {
                    path: "/profile", element:
                        <MyProtectedRoutes>
                            <Profilepage />
                        </MyProtectedRoutes>

                },
                {
                    path: "/problems", id: "problems", hydrateFallbackElement: <Loading />, loader: loadprob, children: [
                        {
                            index: true, element:
                                <MyProtectedRoutes>
                                    <Problemspage />
                                </MyProtectedRoutes>

                        },
                        {
                            path: ":id",loader:  loadprobans,element:
                                <MyProtectedRoutes>
                                    <Myproblemlayout />
                                </MyProtectedRoutes>

                        },

                    ]
                },

                {
                    path: "/welcome", element: <Welcomepage />
                },
                {
                    path: "*", element: <Errors status={"404"} error={"Not Found"} message={"Incorrect page routes"} />
                }
            ]
        }
    ]);
    return (<>
        <RouterProvider router={myroute} />
    </>

    )
}

export default FrontRoute;