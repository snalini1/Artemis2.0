from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import groq
import requests
from pydantic import BaseModel

# Initialize FastAPI
app = FastAPI()

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Update with frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define request model
class CityRequest(BaseModel):
    city_name: str

# API Keys
GROQ_API_KEY = "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"
UNSPLASH_API_KEY = "EkQesnFfriurvMS0ZmqZ3rHlGUAzwdQlCpuvsspPOJg"

# Initialize Groq client
groq_client = groq.Client(api_key=GROQ_API_KEY)

def get_unsplash_image(city_name):
    """Fetch a city image from Unsplash API with error handling."""
    try:
        url = "https://api.unsplash.com/search/photos"
        params = {
            "query": city_name,
            "per_page": 1,
            "client_id": UNSPLASH_API_KEY,
        }
        response = requests.get(url, params=params)
        response.raise_for_status()  # Raise error for bad responses (4xx, 5xx)
        
        data = response.json()
        print("Unsplash API Response:", data)  # Debugging Log
        
        if "results" in data and data["results"]:
            return data["results"][0]["urls"]["regular"]
        return "https://via.placeholder.com/600x400?text=No+Image+Available"

    except requests.RequestException as e:
        print(f"Error fetching Unsplash image: {e}")
        return "https://via.placeholder.com/600x400?text=Error+Fetching+Image"

def get_groq_data(city_name):
    """Fetch city details and safety score from GroqCloud LLaMA-3."""
    try:
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a travel guide AI, geography and safety expert. Be detailed and unbiased."
                        "Provide the response in this exact format:\n\n"
                        "Description: <text>\n"
                        "Safety Score: <number>\n"
                        "Safety Description: <text>"
                    ),
                },
                {
                    "role": "user",
                    "content": f"Describe {city_name} for travelers and provide a safety score (1-10). Also, provide a safety description.",
                },
            ],
            max_tokens=300,
        )

        ai_text = response.choices[0].message.content.strip()
        print("Groq API Response:", ai_text)  # Debugging Log

        # Default values in case of parsing failure
        description = "Unknown"
        safety_score = "No safety score provided"
        safety_description = "No safety description provided"

        # Ensure the response contains all required sections
        if "Description:" in ai_text and "Safety Score:" in ai_text and "Safety Description:" in ai_text:
            parts = ai_text.split("\n")
            for part in parts:
                if part.startswith("Description:"):
                    description = part.replace("Description:", "").strip()
                elif part.startswith("Safety Score:"):
                    safety_score = part.replace("Safety Score:", "").strip()
                elif part.startswith("Safety Description:"):
                    safety_description = part.replace("Safety Description:", "").strip()

        return {
            "city_name": city_name,
            "safety_score": safety_score,
            "description": description,
            "safety_description": safety_description,
        }

    except Exception as e:
        print(f"Error fetching Groq data: {e}")  # Debugging Log
        raise HTTPException(status_code=500, detail="Error retrieving city data from Groq.")

@app.post("/api/get_city_data")
async def get_city_data(request: CityRequest):
    """API Endpoint: Fetch both city data (Groq) and image (Unsplash)."""
    city_name = request.city_name.strip()

    if not city_name:
        raise HTTPException(status_code=400, detail="City name is required.")

    try:
        # Fetch data from both APIs
        groq_data = get_groq_data(city_name)
        city_image_url = get_unsplash_image(city_name)

        # Combine and return results
        return {**groq_data, "image_url": city_image_url}

    except Exception as e:
        print(f"Error in get_city_data: {e}")  # Debugging Log
        raise HTTPException(status_code=500, detail="Failed to retrieve city data.")
