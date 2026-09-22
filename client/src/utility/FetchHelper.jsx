

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
  const isFormData = profileData instanceof FormData;

  let response;
  try {
    response = await fetch(`${url}/api/v1/auth/profile`, {
      method: "PUT",
      credentials: "include",
      // CRITICAL: Do NOT set Content-Type header when sending FormData!
      headers: isFormData ? {} : { "Content-Type": "application/json" },
      body: isFormData ? profileData : JSON.stringify(profileData),
    });
  } catch (networkErr) {
    // Handles offline / connection refused / DNS errors
     throw new Error(networkErr.message || "Network request failed. Is the server running?", { cause: networkErr });
  }

  // Check if response is JSON
  const contentType = response.headers.get("content-type") || "";
  let data = null;

  if (contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    // If Express returned an HTML 500/404 or text error
    const textError = await response.text().catch(() => "");
    if (!response.ok) {
      throw new Error(`Server Error (${response.status}): ${textError || response.statusText}`);
    }
  }

  if (!response.ok) {
    const errorMsg =
      (data && (data.message || data.error)) ||
      (typeof data?.cause === "string" ? data.cause : null) ||
      `Request failed with status ${response.status}`;

    throw new Error(errorMsg);
  }

  return data || {};
}