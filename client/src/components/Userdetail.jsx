import { useCallback, useEffect } from "react";
import useLocalstorage from "../utility/Mystorage";

// Helper to broadcast auth updates across all hook instances in the same tab
export const notifyAuthChange = () => {
  window.dispatchEvent(new Event("auth-change"));
};

function useUserdetail() {
  const [userdata, setuserdata] = useLocalstorage("userdetail", null);
  const url = window.location.origin;
  console.log(url)
  const Fetchuser = useCallback(async () => {
    try {
      const response = await fetch(
        `${url}/api/v1/auth/auth-status`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("userdetail");
        setuserdata(null);
        return null;
      }

      if (!response.ok) return null;

      const data = await response.json();
      const user = { name: data.name, email: data.email };
      setuserdata(user);
      return user;
    } catch (error) {
      console.error("Fetch user error:", error);
      return null;
    }
  }, [setuserdata]);

  // Sync state whenever an auth event fires or window regains focus
  useEffect(() => {
    const handleSync = () => {
      const stored = localStorage.getItem("userdetail");
      setuserdata(stored ? JSON.parse(stored) : null);
    };

    const handleFocus = () => {
      Fetchuser();
    };

    window.addEventListener("auth-change", handleSync);
    window.addEventListener("storage", handleSync); // syncs across other tabs too
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("auth-change", handleSync);
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("focus", handleFocus);
    };
  }, [Fetchuser, setuserdata]);

  return {
    userdata,
    refetchUser: Fetchuser,
  };
}

export default useUserdetail;