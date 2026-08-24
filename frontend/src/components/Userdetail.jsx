import { useCallback, useEffect } from "react";
import useLocalstorage from "../utility/Mystorage";

function useUserdetail() {
    const [userdata, setuserdata] = useLocalstorage("userdetail", null);

    const Fetchuser = useCallback(async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/v1/auth/auth-status",
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            if (response.status === 401) {
                localStorage.removeItem("userdetail");
                setuserdata(null);
                return null;
            }

            if (!response.ok) {
                return null;
            }

            const data = await response.json();

            const user = {
                name: data.name,
                email: data.email
            };

            setuserdata(user);

            return user;

        } catch (error) {
            console.error("Fetch user error:", error);
            return null;
        }
    }, [setuserdata]);

   useEffect(() => {
    const handleFocus = () => {
        Fetchuser();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
        window.removeEventListener("focus", handleFocus);
    };
}, [Fetchuser]);

    return {
        userdata,
        refetchUser: Fetchuser
    };
}

export default useUserdetail;