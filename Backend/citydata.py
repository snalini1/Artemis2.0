from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import groq 
from pydantic import BaseModel

# Initialize FastAPI
app = FastAPI()

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the request model
class CityRequest(BaseModel):
    city_name: str

# Set GroqCloud API Key
GROQ_API_KEY = "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"
groq_client = groq.Client(api_key=GROQ_API_KEY)

@app.post("/api/get_city_data")
async def get_city_data(request: CityRequest):  # Use Pydantic model
    city_name = request.city_name  # Extract city name properly

    try:
        # 🔹 Query LLaMA-3 on GroqCloud
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a travel guide AI, geography and safety expert. Be friendly and warm. "
                        "Always return the response in this exact format:\n\n"
                        "Description: <text>\n"
                        "Safety Score: <number>\n"
                        "Safety Description: <text>"
                    ),
                },
                {
                    "role": "user",
                    "content": f"Describe {city_name} and provide a safety score for travelers (1-10). Also, provide a safety description.",
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
