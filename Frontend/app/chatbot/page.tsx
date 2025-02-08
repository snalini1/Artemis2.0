"use client";

import React, { useState } from "react";
import { fetchItinerary } from "./fetchItinerary";

const TravelPlanner: React.FC = () => {
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [stops, setStops] = useState<string[]>([]);
    const [result, setResult] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        if (!start || !end) {
            setError("Please enter both a start and end location.");
            setLoading(false);
            return;
        }

        try {
            const itinerary = await fetchItinerary(start, end, stops);
            setResult(itinerary); // Ensure the response is set properly
        } catch (err) {
            setError("Failed to fetch itinerary.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Travel Itinerary Planner</h1>

            <input
                type="text"
                placeholder="Start Location"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="border p-2 rounded w-full mb-2"
            />
            <input
                type="text"
                placeholder="End Location"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="border p-2 rounded w-full mb-2"
            />
            <input
                type="text"
                placeholder="Stops (comma-separated)"
                onChange={(e) => setStops(e.target.value.split(","))}
                className="border p-2 rounded w-full mb-2"
            />

            <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white p-2 rounded"
            >
                {loading ? "Generating..." : "Get Itinerary"}
            </button>

            {error && (
                <div className="mt-4 p-2 border rounded bg-red-100 text-red-600">
                    <p>{error}</p>
                </div>
            )}

            {result && (
                <div className="mt-4 p-4 border rounded bg-white text-black shadow-md">
                    <h2 className="text-lg font-semibold mb-2">Generated Itinerary:</h2>
                    <p>{result}</p>
                </div>
            )}

        </div>
    );
};

export default TravelPlanner;
