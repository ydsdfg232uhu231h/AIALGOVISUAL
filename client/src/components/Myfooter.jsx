import { Link } from "react-router";
import { useTheme } from "../context/ThemeContext";
import "./Myfooter.css";

export function Myfooter() {
  const { theme } = useTheme();

  return (
    <footer className="c" id="ifs" data-theme={theme}>
      <hr />
      <div className="r">
        <div className="c ifd">
          <h3>AAFPS</h3>
          <p>
            AI Assistant For Problem Solving is a platform where students can
            study and learn about dsa problems.
          </p>
        </div>

        <div className="c ifd">
          <h3>Quick Links</h3>
          <ul id="slink">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/problems">Problems</Link>
            </li>
            <li>
              <Link to="/ai">AI</Link>
            </li>
          </ul>
        </div>

        <div className="c ifd">
          <h3>Get In Touch</h3>
          <ul>
            <li>📧 yuvrajgupta90334@gmail.com</li>
            <li>
              <ol>
                <li>
                  <img src="github.png" id="github" alt="GitHub" />
                </li>
                <li>
                  <img src="linkedin.png" id="linkedin" alt="LinkedIn" />
                </li>
                <li>
                  <img src="leetcode.png" id="leetcode" alt="LeetCode" />
                </li>
              </ol>
            </li>
          </ul>
        </div>
      </div>

      <div id="lf">
        <hr />
        <p>© 2026 AAFPS. All rights reserved. Built with React.js, CSS &amp; Node.js.</p>
      </div>
    </footer>
  );
}