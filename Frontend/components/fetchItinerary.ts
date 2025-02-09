// 📌 File: /Frontend/utils/fetchItinerary.ts

export const fetchItinerary = async (start: string, end: string, stops: string[]) => {
    try {
        const response = await fetch("http://127.0.0.1:5000/plan_itinerary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ start_location: start, end_location: end, stops }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.response;  // ✅ Return response content
    } catch (error) {
        console.error("Error fetching itinerary:", error);
        return "Failed to fetch itinerary.";
    }
};
