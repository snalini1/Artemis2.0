import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from groq import Groq
import json

# Load environment variables
load_dotenv()
client = Groq(api_key=os.environ["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"])

app = Flask(__name__)

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
    return jsonify({"response": response})

@app.route("/safety_rating", methods=["POST"])
def safety_rating():
    location = request.json.get("location", "")
    prompt = f"Provide a safety rating and analysis for {location}."
    completion = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[{"role": "system", "content": "You are a safety expert providing up-to-date risk assessments."},
                  {"role": "user", "content": prompt}],
        temperature=1,
        max_completion_tokens=1024,
        top_p=1,
        stream=False
    )
    response = completion.choices[0].message.content
    return jsonify({"response": response})

@app.route("/recommendations", methods=["POST"])
def recommendations():
    location = request.json.get("location", "")
    prompt = f"Provide safe recommendations for places to visit in {location}."
    completion = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[{"role": "system", "content": "You are a travel safety advisor recommending secure locations."},
                  {"role": "user", "content": prompt}],
        temperature=1,
        max_completion_tokens=1024,
        top_p=1,
        stream=False
    )
    response = completion.choices[0].message.content
    return jsonify({"response": response})

@app.route("/local_news", methods=["POST"])
def local_news():
    location = request.json.get("location", "")
    prompt = f"Provide recent safety-related news in {location}."
    completion = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[{"role": "system", "content": "You provide the latest safety-related news updates."},
                  {"role": "user", "content": prompt}],
        temperature=1,
        max_completion_tokens=1024,
        top_p=1,
        stream=False
    )
    response = completion.choices[0].message.content
    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(debug=True)

