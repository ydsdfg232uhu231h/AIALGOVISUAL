import style from "./AI.module.css";
import { IoSend } from "react-icons/io5";
import { FaUserAlt, FaRobot } from "react-icons/fa";
import { deletechatmessages, getUserChats, sendChatsrequest } from "../utility/FetchHelper.jsx"
import {useLayoutEffect, useRef, useState } from "react";
import { FaTrashCan } from "react-icons/fa6";
import useUserdetail from "../components/Userdetail.jsx";
import Reac4tMarkdown from "react-markdown";
import { useEffect } from "react";
function AI() {
    const { userdata } = useUserdetail();
    const name = userdata?.name;
    const usermessage = useRef();
    const [chatmessage, setchatmessage] = useState([]);
    const buttonref = useRef(null);
    const btnref = useRef(null);
    useEffect(()=>{
btnref.current?.scrollIntoView({behavior: "smooth", block: "center"});
    },[chatmessage]);
        buttonref.current?.scrollIntoView({behavior: "smooth", block: "end"});
    },[chatmessage])

    async function handleDeletechat(){
        await deletechatmessages();
        setchatmessage([]);

    }
   
    async function handleSubmit() {
        try {
            const content = usermessage.current.value;
            if (usermessage && usermessage.current) {
                usermessage.current.value = "";
            }
            const newMessage = { role: "user", content }
        
             setchatmessage(prev => ([ ...prev, newMessage ]));
            const chatData = await sendChatsrequest({ message: content });
            
            setchatmessage([...chatData.chats])
        } catch (error) {
            console.error(error);
        }
        if (usermessage.current?.value === "") {
            return;
        }
    }
    useLayoutEffect(() => {
        async function Myarea(){
        if (name) {
            await getUserChats()
                .then((data) => {
                    setchatmessage([...data.chats]);
                })
        }
    }
    Myarea();
    }, [])


    
    return (
        // need to work here
        <>

           
            <div id={style.content} >
                <div id={style.chathead}>
                    <img src="Myai.png" alt="image not found" />
                    <h1>AAFPS AI</h1>
                    <p>You can ask some questions related to Knowledge, Bussiness, Advices,
              Education, etc. But avoid sharing personal information</p>
                </div>
                 {chatmessage.map((mydata,index) => <hgroup key={index} className={mydata?.role === "user" ? style.roleuser : style.rolechat}>
                    <h2>{mydata?.role === "user" ? <FaUserAlt /> : <FaRobot />} {mydata.role === "user"?  name : mydata.role}</h2>
                    {mydata?.role === "assistant" ? (
                        <div className={style.chatresponse} key={index}>
                        <Reac4tMarkdown>
                            {mydata.content}
                        </Reac4tMarkdown>

                        </div>
                    ) : (
                        <p>{mydata.content}</p>
                    )}
                </hgroup>)}
                   {chatmessage.length > 0 && <button id={style.cleaner} onClick={handleDeletechat} ref={btnref}><FaTrashCan/></button>}
            </div>
            <div id={style.chatmessage}  ref={buttonref}>
                <input type="text" ref={usermessage} placeholder="Ask anything..." />
                <button type="submit" onClick={handleSubmit}><IoSend /></button>
            </div>

        </>
    )
}

export default AI;

/*
Model gemini-3.5-flash-lite

path: 
  https://aialgovisual.onrender.com/api/v1/chat/new 
with message:
 JSON: 
{
    "message": "How are you"
}
the response which we get by using 
respnse.text :

{
    "chats": [
        {
            "id": "22185739-25ad-443e-9ffd-28dd508bbac0",
            "role": "user",
            "content": "How are you",
            "_id": "6a81ebfda7f72016ef2417f7"
        },
        {
            "id": "22185739-25ad-443e-9ffd-28dd508bbac0",
            "role": "assistant",
            "content": "I'm doing well, thank you for asking! How are you doing today?",
            "_id": "6a81ebfda7f72016ef2417f8"
        }
    ]
}
*/