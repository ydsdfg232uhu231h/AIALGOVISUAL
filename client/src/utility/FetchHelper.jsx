
export default function useFetcher() {
    const url = window.location.origin;


    async function sendChatsrequest({ message }) {
        console.log(message);
        const response = await fetch(`${url}/api/v1/chat/new`, {
            method: "POST",
            headers: {
                "content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ message: message })
        });
        if (response.status === 401) {
            const errorResponse = await response.json();
            return errorResponse.message;
        }
        if (!response.ok) {
            return;
        }
        const chatdata = await response.json();
        return chatdata;
    }

    async function getUserChats() {
        const response = await fetch(`${url}/api/v1/chat/all-chats`, {
            method: "GET",
            credentials: "include",
        });
        console.log(response)
        if (response.status !== 200) {
            throw new Error("Unable to send chat")
        }
        if (response.status === 401) {
            const errorResponse = await response.json();
            return errorResponse.message;
        }
        if (!response.ok) {
            return;
        }
        const chatdata = await response.json();
        return chatdata;
    }

    async function deletechatmessages() {
        const response = await fetch(`${url}/api/v1/chat/delete`, {
            method: "DELETE",
            credentials: "include"
        });
        if (response.status === 401) {
            const errorResponse = await response.json();
            return errorResponse.message;
        }
        if (!response.ok) {
            return;
        }
        const chatdeleteres = await response.json();
        return chatdeleteres;
    }

    async function logoutuser({ email }) {
        console.log(email);
        const response = await fetch(`${url}/api/v1/auth/logout`, {
            method: "POST",
            headers: {
                "content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ email: email })
        });
        if (response.status === 401) {
            const errorResponse = await response.json();
            return errorResponse.message;
        }
        if (!response.ok) {
            return;
        }
        const chatdata = await response.json();
        return chatdata;
    }



    async function updateUserProfile(formPayload) {
  const response = await fetch(`${url}/api/v1/user/profile`, {
    method: "PUT",
    // DO NOT set 'Content-Type': 'application/json' or 'multipart/form-data' here!
    // The browser automatically attaches boundary headers for FormData.
    body: formPayload, 
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to update profile");
  }
  return data;
}

    async function Activeserver() {
        const response = await fetch(`${url}/api/v1/user/`, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            return;
        }
        const userActive = await response.json();
        console.log(userActive);
    }
    async function Loginfetchuser({ formvalue }) {
        try {
            const response = await fetch(`${url}/api/v1/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(formvalue),
            });

            return response;

        }
        catch (error) {
            console.log(error)
            return { message: "Network error. Please try again later." }
        }
    }

    async function Signupfetchuser({ formvalue }) {
        try {
            const response = await fetch(`${url}/api/v1/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(formvalue),
            });


            return response;

        }
        catch (error) {
            console.log(error)
            return { message: "Network error. Please try again later." }
        }
    }
    return {
        sendChatsrequest,
        getUserChats,
        deletechatmessages,
        logoutuser,
        updateUserProfile,
        Activeserver,
        Loginfetchuser,
        Signupfetchuser
    }
}