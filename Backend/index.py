import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from groq import Groq
from flask_cors import CORS
import json

# Load environment variables
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY is not set. Check your .env file.")

# Initialize Groq Client
client = Groq(api_key=GROQ_API_KEY)

app = Flask(__name__)
CORS(app)

### 🎤 **LLM Instructions: Travel Expert Persona**
AI_SYSTEM_PROMPT = (
    "You are a travel guide, geography expert, and a well-respected professor. "
    "You are kind and warm but provide detailed, intelligent responses. "
    "You are unbiased, especially in safety ratings. "
    "You provide structured itineraries with time breakdowns, travel tips, and recommendations. "
    "Always return bullet-pointed responses for clarity."
)

### 📌 **Chatbot Endpoint (Handles General Queries)**
@app.route("/chatbot", methods=["POST"])
def chatbot():
    data = request.json
    query = data.get("query", "").strip()

    if not query:
        return jsonify({"response": "I didn't understand. Can you rephrase?"})

    # AI Request
    response = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[
            {"role": "system", "content": AI_SYSTEM_PROMPT},
            {"role": "user", "content": query},
        ],
        temperature=0.7,
        max_completion_tokens=500,
    )

    response_text = response.choices[0].message.content.strip()
    bullet_response = format_response_as_bullet_points(response_text)

    return jsonify({"response": bullet_response})

### 🗺️ **Plan My Itinerary Endpoint**
@app.route("/chatbot/plan_itinerary", methods=["POST"])
def plan_itinerary():
    data = request.json
    locations = data.get("locations", "").strip()

    if not locations:
        return jsonify({"response": "Please provide at least one destination to plan an itinerary."})

    prompt = (
        f"Plan a detailed itinerary for the following destinations: {locations}. "
        "Include recommended travel methods, top attractions, ideal meal spots, and safety tips. "
        "Format the response with clear bullet points for easy reading."
    )

    response = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[
            {"role": "system", "content": AI_SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        temperature=0.7,
        max_completion_tokens=800,
    )

    response_text = response.choices[0].message.content.strip()
    bullet_response = format_response_as_bullet_points(response_text)

    return jsonify({"response": bullet_response})

### 🚦 **Safety Ratings Endpoint**
@app.route("/chatbot/safety_ratings", methods=["POST"])
def safety_ratings():
    data = request.json
    location = data.get("location", "").strip()

    if not location:
        return jsonify({"response": "Please provide a city or country to check safety ratings."})

    prompt = (
        f"Provide an unbiased safety rating (1-10) for {location}. "
        "Explain the safety concerns in detail, including crime rates, political stability, and health risks. "
        "Provide travel safety recommendations and useful tips. Format response in bullet points."
    )

    response = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[
            {"role": "system", "content": AI_SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        temperature=0.7,
        max_completion_tokens=600,
    )

    response_text = response.choices[0].message.content.strip()
    bullet_response = format_response_as_bullet_points(response_text)

    return jsonify({"response": bullet_response})

### 📰 **Local News Endpoint**
@app.route("/chatbot/local_news", methods=["POST"])
def local_news():
    data = request.json
    location = data.get("location", "").strip()

    if not location:
        return jsonify({"response": "Please provide a city or country to fetch local news."})

    prompt = (
        f"Provide the latest important news from {location}. "
        "Focus on news that is relevant to travelers, such as cultural events, transport updates, or security alerts. "
        "Format the response in bullet points."
    )

    response = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[
            {"role": "system", "content": AI_SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        temperature=0.7,
        max_completion_tokens=500,
    )

    response_text = response.choices[0].message.content.strip()
    bullet_response = format_response_as_bullet_points(response_text)

    return jsonify({"response": bullet_response})

### 🍽️ **Recommendations Endpoint**
@app.route("/chatbot/recommendations", methods=["POST"])
def recommendations():
    data = request.json
    location = data.get("location", "").strip()

    if not location:
        return jsonify({"response": "Please provide a city or country for recommendations."})

    prompt = (
        f"Provide travel recommendations for {location}. "
        "Include the best local food spots, must-visit attractions, and hidden gems. "
        "Suggest things to do for different types of travelers (solo, families, couples). "
        "Format the response in bullet points."
    )

    response = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[
            {"role": "system", "content": AI_SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        temperature=0.7,
        max_completion_tokens=600,
    )

    response_text = response.choices[0].message.content.strip()
    bullet_response = format_response_as_bullet_points(response_text)

    return jsonify({"response": bullet_response})

### 📌 **Helper Function: Format AI Response as Bullet Points**
def format_response_as_bullet_points(response_text):
    return "\n".join([f"• {line}" for line in response_text.split("\n") if line.strip()])

if __name__ == "__main__":
    app.run(debug=True)
