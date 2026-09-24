
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



    async function updateUserProfile(profileData) {
        const isFormData = profileData instanceof FormData;

        let response;
        try {
            response = await fetch(`${url}/api/v1/user/profile`, {
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