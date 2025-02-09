# main.py
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
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

# In-memory storage
users = {}

# Directory for uploaded images
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

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

# Get user profile
@app.get("/api/user/{user_id}", response_model=UserProfile)
def get_user(user_id: str):
    user = users.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Create or update user profile
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
    profile_pic_path = None
    if profilePicture:
        file_location = f"{UPLOAD_DIR}/{uuid4()}_{profilePicture.filename}"
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(profilePicture.file, buffer)
        profile_pic_path = file_location

    user = users.get(user_id, UserProfile(id=user_id, name=name, bio=bio, age=age, height=height, weight=weight, trips=trips, countries=countries))
    user.name = name
    user.bio = bio
    user.age = age
    user.height = height
    user.weight = weight
    user.trips = trips
    user.countries = countries
    if profile_pic_path:
        user.profilePicture = profile_pic_path

    users[user_id] = user
    return user

# Add to bucket list
@app.post("/api/user/{user_id}/bucket-list", response_model=UserProfile)
def add_to_bucket_list(user_id: str, item: BucketListItem):
    user = users.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.bucketList.append(item)
    return user

# Remove from bucket list
@app.delete("/api/user/{user_id}/bucket-list/{item_id}", response_model=UserProfile)
def remove_from_bucket_list(user_id: str, item_id: str):
    user = users.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.bucketList = [item for item in user.bucketList if item.name != item_id]
    return user

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)