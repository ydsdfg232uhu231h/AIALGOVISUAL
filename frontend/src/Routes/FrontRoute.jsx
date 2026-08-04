import {createBrowserRouter, RouterProvider } from "react-router";
import Layout from "../components/Layout.jsx";
import Homepage from "../pages/Homepage.jsx";
import AI from "../pages/AI.jsx";
import LogInpage from "../pages/LogInpage.jsx";
import SignUppage from "../pages/SignUppage.jsx";
import Problemspage from "../pages/Problemspage.jsx";
import Welcomepage from "../pages/Welcomepage.jsx";
import Myproblemlayout from "../components/Programpage helper/Myproblemlayout";
import loadprob from "../components/Programpage helper/loadprob.jsx";
import Loading from "../components/Loading.jsx";
import MyuserProvider from '../MyuserProvider.jsx';
import Errorpage from "../pages/Errorpage.jsx";
import Errors from "../components/Error.jsx";


function FrontRoute() {
    const myroute = createBrowserRouter([
        {path: "/", element: <Layout />, errorElement: <Errorpage/>,
            children: [
                {index:true, element: <Homepage/>},
                {path:"/home", element: <Homepage/>},
                {path: "/ai", element: <AI/>},
                {path: "/login", element: <LogInpage/>},
                {path:"/signup", element: <SignUppage/>},
                {path: "/problems" , hydrateFallbackElement: <Loading/>,loader: loadprob, element: <Problemspage/> },
                {path: "/problems/:id", element: <Myproblemlayout/>},
               
                {path: "/welcome", element: <Welcomepage/>},
                {path: "*", element: <Errors status={"404"} error= {"Not Found"} message= {"Incorrect page routes"}/>}
            ]
        }
    ]);
  return (
    <MyuserProvider>
        <RouterProvider router={myroute}/>
    </MyuserProvider>
  )
}

export default FrontRoute;