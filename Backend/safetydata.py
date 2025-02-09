from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from geopy.geocoders import Nominatim
import pandas as pd

app = FastAPI()

# Configure CORS to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load emergency numbers dataset from the CSV file
file_path = "data/emergencynumbers.csv"
df = pd.read_csv(file_path)

# Convert the dataset to a dictionary for fast lookup
EMERGENCY_NUMBERS = {
    row["country"]: {
        "Police": row["ByCountry_police"],
        "Ambulance": row["ByCountry_ambulance"],
        "Fire": row["ByCountry_fire"]
    }
    for _, row in df.iterrows()
}

# Pydantic models for requests
class LocationRequest(BaseModel):
    latitude: float
    longitude: float

class EmergencyAlertRequest(BaseModel):
    latitude: float
    longitude: float
    message: str  # Optional additional message for the alert

# Endpoint to fetch emergency numbers based on user's location
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

@app.post("/api/send_emergency_alert")
async def send_emergency_alert(request: EmergencyAlertRequest):
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

        # Simulated alert response
        return {
            "message": f"Simulated emergency alert: {request.message}",
            "country": country,
            "location_details": location.raw["address"],
            "emergency_numbers": emergency_numbers,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send alert: {str(e)}")
