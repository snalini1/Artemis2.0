import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from groq import Groq
from flask_cors import CORS
import json

# Load environment variables
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")  # ✅ Fetch safely

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY is not set. Please check your .env file.")

client = Groq(api_key=GROQ_API_KEY)

app = Flask(__name__)
CORS(app)
@app.route("/plan_itinerary", methods=["POST"])
def plan_itinerary():
    data = request.json
    start_location = data.get("start_location", "")
    end_location = data.get("end_location", "")
    stops = data.get("stops", [])
    
    prompt = f"Plan a safe itinerary from {start_location} to {end_location} with stops at {', '.join(stops)}."
    completion = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[{"role": "system", "content": "You are a safety-focused travel assistant."},
                  {"role": "user", "content": prompt}],
        temperature=1,
        max_completion_tokens=1024,
        top_p=1,
        stream=False
    )
    response = completion.choices[0].message.content
    
    # Convert response to bullet points for readability
    bullet_point_response = "\n".join([f"• {line}" for line in response.split("\n") if line.strip()])
    
    return jsonify({"response": bullet_point_response})

if __name__ == "__main__":
    app.run(debug=True)
