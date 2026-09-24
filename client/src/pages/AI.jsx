import style from "./AI.module.css";
import { IoSend } from "react-icons/io5";
import { FaUserAlt, FaRobot } from "react-icons/fa";
import useFetcher from "../utility/FetchHelper.jsx";
import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { FaTrashCan } from "react-icons/fa6";
import useUserdetail from "../components/Userdetail.jsx";
import ReactMarkdown from "react-markdown";
import { useTheme } from "../context/ThemeContext.jsx";

function AI() {
  const { userdata } = useUserdetail();
  const name = userdata?.name;
  const usermessage = useRef();
  const [chatmessage, setchatmessage] = useState([]);
  const buttonref = useRef(null);
  const btnref = useRef(null);
  const { deletechatmessages, getUserChats, sendChatsrequest } = useFetcher();
  // Synchronize with aafps_theme in localStorage
 const { theme} = useTheme();

  // Cross-tab & local storage change synchronization
  

  useEffect(() => {
    btnref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    const timer = setTimeout(() => {
      buttonref.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 400);
    return () => clearTimeout(timer);
  }, [chatmessage]);

  async function handleDeletechat() {
    await deletechatmessages();
    setchatmessage([]);
  }

  async function handleSubmit(e) {
    if (e) e.preventDefault();
    try {
      const content = usermessage.current?.value?.trim();
      if (!content) return;

      if (usermessage.current) {
        usermessage.current.value = "";
      }

      const newMessage = { role: "user", content };
      setchatmessage((prev) => [...prev, newMessage]);

      const chatData = await sendChatsrequest({ message: content });
      if (chatData?.chats) {
        setchatmessage([...chatData.chats]);
      }
    } catch (error) {
      console.error("Chat error:", error);
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useLayoutEffect(() => {
    async function Myarea() {
      if (name) {
        await getUserChats().then((data) => {
          if (data?.chats) {
            setchatmessage([...data.chats]);
          }
        });
      }
    }
    Myarea();
  }, [name]);

  return (
    <div id={style.airpRoot} data-theme={theme}>
      <div id={style.content}>
        <div id={style.chathead}>
          <img src="Myai.png" alt="AAFPS AI" />
          <h1>AAFPS AI</h1>
          <p>
            You can ask some questions related to Knowledge, Business, Advices,
            Education, etc. But avoid sharing personal information.
          </p>
        </div>

        {chatmessage.map((mydata, index) => (
          <hgroup
            key={index}
            className={mydata?.role === "user" ? style.roleuser : style.rolechat}
          >
            <h2>
              {mydata?.role === "user" ? <FaUserAlt /> : <FaRobot />}{" "}
              {mydata.role === "user" ? name || "User" : "AAFPS Assistant"}
            </h2>

            {mydata?.role === "assistant" ? (
              <div className={style.chatresponse}>
                <ReactMarkdown>{mydata.content}</ReactMarkdown>
              </div>
            ) : (
              <p>{mydata.content}</p>
            )}
          </hgroup>
        ))}

        {chatmessage.length > 0 && (
          <button
            id={style.cleaner}
            onClick={handleDeletechat}
            ref={btnref}
            title="Clear Chat History"
          >
            <FaTrashCan />
          </button>
        )}
      </div>

      <form id={style.chatmessage} ref={buttonref} onSubmit={handleSubmit}>
        <input
          type="text"
          ref={usermessage}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything..."
        />
        <button type="submit" title="Send Message">
          <IoSend />
        </button>
      </form>
    </div>
  );
}

export default AI;