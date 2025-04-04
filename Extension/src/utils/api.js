export const apiRequest = async (action, text) => {
    try {
        const response = await fetch(`http://localhost:8000/api/mistral`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text })
        });

        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();
        return data.explanation; // Assuming the backend returns { explanation: "..." }
    } catch (error) {
        console.error("API Error:", error);
        return "❌ Error connecting to AI service.";
    }
};
