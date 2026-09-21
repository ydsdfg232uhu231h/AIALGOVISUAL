import { useState } from "react";
import Modal from "./Modal.jsx";
import Loading from "./Loading";
import { useTheme } from "../context/ThemeContext";
import "./Success.css";

export default function Success({ message }) {
  const [showsuccess, setshowsuccess] = useState(true);
  const { theme } = useTheme();

  function handleshow() {
    setshowsuccess(false);
  }

  return (
    <Modal>
      {showsuccess ? (
        <div id="success" data-theme={theme} role="status">
          <h1>{message}</h1>
          <button onClick={handleshow} aria-label="Close notification">
            &times;
          </button>
        </div>
      ) : (
        <div>
          <Loading />
        </div>
      )}
    </Modal>
  );
}

export function PopError({ message }) {
  const [showerror, setshowerror] = useState(true);
  const { theme } = useTheme();

  function handleshow() {
    setshowerror(false);
  }

  return (
    <Modal>
      {showerror ? (
        <div id="poperror" data-theme={theme} role="alert">
          <h1>{message}</h1>
          <button onClick={handleshow} aria-label="Close error notification">
            &times;
          </button>
        </div>
      ) : (
        <div>
          <Loading />
        </div>
      )}
    </Modal>
  );
}