import { useNavigate } from 'react-router';
import NoAuthanticated from '../components/NotAuthanticated';
import { useEffect, useState } from 'react';
import useUserdetail from '../components/Userdetail';


function MyProtectedRoutes({ children }) {
    const myuser = useUserdetail();
     const [isauth,setisauth] = useState(true);
    const navigate = useNavigate();
    useEffect(()=>{

        async function useraction(){
            if (myuser.userdata) {
                setisauth(true);
               {myuser.userdata === null && await myuser.refetchUser()}
            }
            else{
                setisauth(false);
                navigate("/signup")
            }
            if (isauth === false) {
               return navigate('/signup');
            }

        }   
        useraction();

    },[myuser]);
    return (

    <>
    {isauth? children: <NoAuthanticated/>}
    </>
  )
}

  


export default MyProtectedRoutes