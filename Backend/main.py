from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
from uuid import uuid4
import shutil
import os
import pandas as pd
import requests
import groq
from geopy.geocoders import Nominatim
import uvicorn

# ------------------ 🚀 FastAPI Initialization ------------------ #
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow frontend access
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directory for uploaded images
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# ------------------ 🛂 User Profile Management ------------------ #
class BucketListItem(BaseModel):
    name: str
    lat: float
    lng: float

class UserProfile(BaseModel):
    id: str
    profilePicture: Optional[str] = None
    name: str
    bio: str
    age: int
    height: str
    weight: str
    trips: int
    countries: int
    bucketList: List[BucketListItem] = []

# In-memory storage for user profiles
users = {}

# Initialize a test user
users["user123"] = UserProfile(
    id="user123",
    name="Test User",
    bio="This is a test user.",
    age=25,
    height="5'8\"",
    weight="150lbs",
    trips=5,
    countries=3,
    profilePicture=None,
    bucketList=[]
)

@app.get("/api/user/{user_id}", response_model=UserProfile)
def get_user(user_id: str):
    """Retrieve user profile data"""
    user = users.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.post("/api/user/{user_id}", response_model=UserProfile)
def update_user(
    user_id: str,
    profilePicture: Optional[UploadFile] = File(None),
    name: str = Form(...),
    bio: str = Form(...),
    age: int = Form(...),
    height: str = Form(...),
    weight: str = Form(...),
    trips: int = Form(...),
    countries: int = Form(...)
):
    """Create or update a user profile"""
    if user_id not in users:
        users[user_id] = UserProfile(
            id=user_id, name=name, bio=bio, age=age,
            height=height, weight=weight, trips=trips, countries=countries,
            profilePicture=None, bucketList=[]
        )

    user = users[user_id]
    profile_pic_path = user.profilePicture  # Preserve existing profile picture

    if profilePicture:
        file_extension = os.path.splitext(profilePicture.filename)[-1].lower()
        allowed_extensions = {".jpg", ".jpeg", ".png"}
        if file_extension not in allowed_extensions:
            raise HTTPException(status_code=400, detail="Invalid image format. Please upload JPG or PNG.")

        file_location = f"{UPLOAD_DIR}/{uuid4()}_{profilePicture.filename}"
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(profilePicture.file, buffer)
        profile_pic_path = file_location  # Update only if a new image is uploaded

    user.name = name
    user.bio = bio
    user.age = age
    user.height = height
    user.weight = weight
    user.trips = trips
    user.countries = countries
    user.profilePicture = profile_pic_path

    return user

# ------------------ 🌍 City Safety & Travel Data (Groq + Unsplash) ------------------ #

# API Keys
GROQ_API_KEY = "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"
UNSPLASH_API_KEY = "EkQesnFfriurvMS0ZmqZ3rHlGUAzwdQlCpuvsspPOJg"

# Initialize Groq client
groq_client = groq.Client(api_key=GROQ_API_KEY)

class CityRequest(BaseModel):
    city_name: str

def get_unsplash_image(city_name: str) -> str:
    """Fetch a city image from the Unsplash API."""
    try:
        url = "https://api.unsplash.com/search/photos"
        params = {"query": city_name, "per_page": 1, "client_id": UNSPLASH_API_KEY}
        response = requests.get(url, params=params)
        data = response.json()

        if "results" in data and len(data["results"]) > 0:
            return data["results"][0]["urls"]["regular"]
        return "No image available"
    except Exception as e:
        print(f"Error fetching Unsplash image: {e}")  # Debugging Log
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

        description = "Unknown"
        safety_score = "No safety score provided"
        safety_description = "No safety description provided"

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
    """Fetch city data (from Groq) and image (from Unsplash)"""
    city_name = request.city_name
    try:
        city_data = get_groq_data(city_name)
        city_image_url = get_unsplash_image(city_name)
        return {**city_data, "image_url": city_image_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

# ------------------ 🚑 Emergency Numbers API ------------------ #

file_path = "data/emergencynumbers.csv"
df = pd.read_csv(file_path)

EMERGENCY_NUMBERS = {
    row["country"]: {
        "Police": row["ByCountry_police"],
        "Ambulance": row["ByCountry_ambulance"],
        "Fire": row["ByCountry_fire"],
    }
    for _, row in df.iterrows()
}

class LocationRequest(BaseModel):
    latitude: float
    longitude: float

@app.post("/api/get_emergency_numbers")
async def get_emergency_numbers(request: LocationRequest):
    """Fetch emergency numbers based on location"""
    geolocator = Nominatim(user_agent="safety-app")
    location = geolocator.reverse((request.latitude, request.longitude), language="en")

    country = location.raw["address"]["country"]
    emergency_numbers = EMERGENCY_NUMBERS.get(country, {"Police": "Unknown", "Ambulance": "Unknown", "Fire": "Unknown"})

    return {"country": country, "emergency_numbers": emergency_numbers}

# ------------------ 🚀 Start the Server ------------------ #

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
