import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Success from "../components/Success";
import Loading from "../components/Loading";
import { useTheme } from "../context/ThemeContext";
import "./Loginpage.css";

const initialErrors = { name: "", email: "", password: "", message: "" };

function SignUppage() {
  const [showsuc, setsuc] = useState(null);
  const [signerror, setsignerror] = useState(initialErrors);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  // Sync theme with localStorage 'aafps_theme'

  // Listen for theme changes across pages/tabs
 

  
  // Safely manage redirect countdown after registration
  useEffect(() => {
    if (!showsuc) return;

    const timer = setTimeout(() => {
      navigate("/login");
    }, 4000);

    return () => clearTimeout(timer);
  }, [showsuc, navigate]);

  async function HandleSubmitSign(e) {
    e.preventDefault();
    setsignerror(initialErrors);

    const data = new FormData(e.currentTarget);
    const formvalue = Object.fromEntries(data);

    try {
      const url = window.location.origin;
      const response = await fetch(`${url}/api/v1/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formvalue),
      });

      const mydata = await response.json();

      if (!mydata.errors) {
        if (response.status === 409) {
          return setsignerror((prev) => ({ ...prev, message: mydata.message }));
        } else if (response.status === 201) {
          setsuc(mydata);
          return;
        }
      } else {
        setsignerror({
          name: mydata.errors?.find((mes) => mes.path === "name")?.msg || "",
          email: mydata.errors?.find((mes) => mes.path === "email")?.msg || "",
          password: mydata.errors?.find((mes) => mes.path === "password")?.msg || "",
          message: "",
        });
      }
    } catch (error) {
      console.error("Sign up error:", error);
      setsignerror((prev) => ({
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
        <form onSubmit={HandleSubmitSign}>
          <h1>Sign Up</h1>

          {signerror.name && <h3 style={{ color: "#ef4444" }}>{signerror.name}</h3>}
          <input
            type="text"
            name="name"
            autoComplete="name"
            placeholder="Name"
            required
          />

          {signerror.email && <h3 style={{ color: "#ef4444" }}>{signerror.email}</h3>}
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Email"
            required
          />

          {signerror.password && <h3 style={{ color: "#ef4444" }}>{signerror.password}</h3>}
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            placeholder="Password"
            required
          />

          {signerror.message && <h4 style={{ color: "#ef4444" }}>{signerror.message}</h4>}
          <h5>You need to login even after SignUp</h5>

          <div id="lsbtn">
            <button type="submit">Sign Up</button>
            <button type="button" onClick={() => navigate("/login")}>
              Login
            </button>
          </div>
        </form>
      ) : (
        <>
          <Success message={showsuc.message || "Registration successful!"} />
          <Loading />
        </>
      )}
    </div>
  );
}

export default SignUppage;