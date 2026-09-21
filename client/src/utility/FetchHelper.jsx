

const url = window.location.origin;

export async function sendChatsrequest({ message }) {
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

export async function getUserChats() {
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

export async function deletechatmessages() {
    const url = window.location.origin;
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

export async function logoutuser({email}) {
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

// src/utility/FetchHelper.js (or wherever your API calls live)

export async function updateUserProfile(profileData) {
  const response = await fetch(`${url}/api/v1/auth/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // send cookies/session if using cookies
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to update profile");
  }

  return response.json();
}