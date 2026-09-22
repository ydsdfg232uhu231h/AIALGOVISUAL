import { useState, useEffect, useCallback } from "react";

const AUTH_EVENT = "aafps_auth_change";

export const notifyAuthChange = () => {
  window.dispatchEvent(new Event(AUTH_EVENT));
};

export default function useUserdetail() {
  const [userdata, setUserdata] = useState(() => {
    const cached = localStorage.getItem("userdetail");
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/auth/auth-status", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to authenticate");
      }

      const data = await res.json();

      if (data.message === "Ok") {
        const userObj = {
          id: data.id,
          name: data.name,
          email: data.email,
          handle: data.handle,
          customAvatar: data.customAvatar || "",
          bio: data.bio || "",
          targetGoal: data.targetGoal || "Dynamic Programming & Graphs",
        };

        // 1. Save directly into localStorage
        localStorage.setItem("userdetail", JSON.stringify(userObj));
        localStorage.setItem("aafps_user_profile", JSON.stringify(userObj));

        // 2. Update state
        setUserdata(userObj);
      } else {
        localStorage.removeItem("userdetail");
        localStorage.removeItem("aafps_user_profile");
        setUserdata(null);
      }
    } catch (err) {
      console.error("Auth status error:", err);
      localStorage.removeItem("userdetail");
      localStorage.removeItem("aafps_user_profile");
      setUserdata(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();

    const handleAuthEvent = () => fetchUser();
    window.addEventListener(AUTH_EVENT, handleAuthEvent);

    return () => {
      window.removeEventListener(AUTH_EVENT, handleAuthEvent);
    };
  }, [fetchUser]);

  return { userdata, loading, refetchUser: fetchUser };
}