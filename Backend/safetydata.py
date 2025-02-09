from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from geopy.geocoders import Nominatim
import pandas as pd

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load emergency numbers dataset from the uploaded CSV
file_path = "data/emergencynumbers.csv"
df = pd.read_csv(file_path)

# Convert to dictionary for fast lookup
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
    try:
        geolocator = Nominatim(user_agent="safety-app")
        location = geolocator.reverse((request.latitude, request.longitude), language="en")

        if not location or "country" not in location.raw["address"]:
            raise HTTPException(status_code=400, detail="Could not determine country")

        country = location.raw["address"]["country"]
        emergency_numbers = EMERGENCY_NUMBERS.get(
            country,
            {"Police": "Unknown", "Ambulance": "Unknown", "Fire": "Unknown"}
        )

        return {"country": country, "emergency_numbers": emergency_numbers}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
