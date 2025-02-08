import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS  # Allow frontend to call backend
from groq import Groq

# Load environment variables
load_dotenv("secret_key.env")

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

@app.route("/plan_itinerary", methods=["POST"])
def plan_itinerary():
    data = request.json
    start_location = data.get("start_location", "")
    end_location = data.get("end_location", "")
    stops = data.get("stops", [])

    if not start_location or not end_location:
        return jsonify({"error": "Start and end locations are required"}), 400

    prompt = f"Plan a safe itinerary from {start_location} to {end_location} with stops at {', '.join(stops)}."
    
    try:
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
        return jsonify({"response": response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)

