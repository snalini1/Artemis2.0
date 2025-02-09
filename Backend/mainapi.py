from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles  # Add this import
from pydantic import BaseModel
from typing import List, Optional
from uuid import uuid4
import shutil
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
### ------------------ CITY DATA (City Safety & Image API) ------------------ ###

# API Keys
GROQ_API_KEY = "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"
UNSPLASH_API_KEY = "EkQesnFfriurvMS0ZmqZ3rHlGUAzwdQlCpuvsspPOJg"

# Initialize Groq client
groq_client = groq.Client(api_key=GROQ_API_KEY)

class CityRequest(BaseModel):
    city_name: str

def get_unsplash_image(city_name):
    """Fetch a city image from Unsplash API."""
    try:
        url = "https://api.unsplash.com/search/photos"
        params = {"query": city_name, "per_page": 1, "client_id": UNSPLASH_API_KEY}
        response = requests.get(url, params=params)
        data = response.json()

        if "results" in data and len(data["results"]) > 0:
            return data["results"][0]["urls"]["regular"]
        return "No image available"
    except Exception as e:
        return "Error fetching image"

def get_groq_data(city_name):
    """Fetch city details and safety score from GroqCloud LLaMA-3."""
    try:
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a travel guide AI, geography and safety expert. Be friendly and warm. "
                        "Be harsh about the safety score, don't sugarcoat it. Don't be biased. Women's lives and safety depend on it. "
                        "Always return the response in this exact format:\n\n"
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

        # Default values
        description = "Unknown"
        safety_score = "No safety score provided"
        safety_description = "No safety description provided"

        # Ensure the response contains all required sections
        if "Description:" in ai_text and "Safety Score:" in ai_text and "Safety Description:" in ai_text:
            parts = ai_text.split("\n")  # Split by new line to ensure structure
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
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/get_city_data")
async def get_city_data(request: CityRequest):
    """API Endpoint: Fetch both city data and image."""
    city_name = request.city_name
    try:
        city_data = get_groq_data(city_name)
        city_image_url = get_unsplash_image(city_name)
        return {**city_data, "image_url": city_image_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

### ------------------ SAFETY DATA (Emergency Numbers API) ------------------ ###

# Load emergency numbers dataset
file_path = "data/emergencynumbers.csv"
df = pd.read_csv(file_path)

# Convert to dictionary for lookup
EMERGENCY_NUMBERS = {
    row["country"]: {
        "Police": row["ByCountry_police"],
        "Ambulance": row["ByCountry_ambulance"],
        "Fire": row["ByCountry_fire"]
    }
    for _, row in df.iterrows()
}

class LocationRequest(BaseModel):
    latitude: float
    longitude: float

@app.post("/api/get_emergency_numbers")
async def get_emergency_numbers(request: LocationRequest):
    """Fetch emergency numbers based on user's location."""
    try:
        geolocator = Nominatim(user_agent="safety-app")
        location = geolocator.reverse((request.latitude, request.longitude), language="en")

        if not location or "country" not in location.raw["address"]:
            raise HTTPException(status_code=400, detail="Could not determine country")

        country = location.raw["address"]["country"]
        emergency_numbers = EMERGENCY_NUMBERS.get(
            country, {"Police": "Unknown", "Ambulance": "Unknown", "Fire": "Unknown"}
        )

        return {"country": country, "emergency_numbers": emergency_numbers}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

### ------------------------------------------------------------------------- ###

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
