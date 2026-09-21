import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Success from "../components/Success";
import useUserdetail, { notifyAuthChange } from "../components/Userdetail";
import { useTheme } from "../context/ThemeContext";
import Loading from "../components/Loading";
import "./Loginpage.css";

const initialErrors = { email: "", password: "", message: "" };

function LogInpage() {
  const { refetchUser } = useUserdetail();
  const [showsuc, setsuc] = useState(null);
  const [logerror, setlogerror] = useState(initialErrors);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
 
  useEffect(() => {
    if (!showsuc) return;

    const timer = setTimeout(() => {
      navigate("/home");
    }, 3000);

    return () => clearTimeout(timer);
  }, [showsuc, navigate]);

  async function HandleSubmitlogin(e) {
    e.preventDefault();
    setlogerror(initialErrors);

    const data = new FormData(e.currentTarget);
    const formvalue = Object.fromEntries(data);

    try {
      const url = window.location.origin;
      const response = await fetch(`${url}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formvalue),
      });

      const mydata = await response.json();

      if (response.ok && response.status === 200) {
        if (mydata.user || (mydata.name && mydata.email)) {
          const userObj = mydata.user || { name: mydata.name, email: mydata.email };
          localStorage.setItem("userdetail", JSON.stringify(userObj));
        }

        await refetchUser();
        notifyAuthChange();

        setsuc(mydata);
        return;
      }

      if (mydata.errors && Array.isArray(mydata.errors)) {
        setlogerror({
          email: mydata.errors.find((mes) => mes.path === "email")?.msg || "",
          password: mydata.errors.find((mes) => mes.path === "password")?.msg || "",
          message: "",
        });
        return;
      }

      if (mydata.message) {
        setlogerror((prev) => ({ ...prev, message: mydata.message }));
      }
    } catch (error) {
      console.error("Login error:", error);
      setlogerror((prev) => ({
        ...prev,
        message: "Network error. Please try again later.",
      }));
    }
  }

  return (
    <div id="mylogin" data-theme={theme}>
      {/* Theme Switcher Button */}
      <button
        id="login-theme-toggle"
        type="button"
        onClick={toggleTheme}
        title="Toggle Day / Night Mode"
      >
        {theme === "dark" ? "☀️ Day Mode" : "🌙 Night Mode"}
      </button>

      {!showsuc ? (
        <form onSubmit={HandleSubmitlogin}>
          <h1>Login</h1>

          {logerror.email && <h3 style={{ color: "#ef4444" }}>{logerror.email}</h3>}
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Enter email"
            required
          />

          {logerror.password && <h3 style={{ color: "#ef4444" }}>{logerror.password}</h3>}
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="Enter password"
            required
          />

          {logerror.message && <h4 style={{ color: "#ef4444" }}>{logerror.message}</h4>}

          <div id="lsbtn">
            <button type="submit">Login</button>
            <button type="button" onClick={() => navigate("/signup")}>
              Sign Up
            </button>
          </div>
        </form>
      ) : (
        <>
          <Success message={showsuc.message || "Login successful!"} />
          <Loading />
        </>
      )}
    </div>
  );
}

export default LogInpage;