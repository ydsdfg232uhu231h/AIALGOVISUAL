async function loadprob() {
    try {

        const response = await fetch("http://localhost:5000/api/v1/dsa/prob",
            {
                method: "GET",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch problems");
        }
        const problems = await response.json();
        return problems;


    } catch (error) {
        console.error("Fetch Error:", error.message);
        throw error;
    }
}

export default loadprob