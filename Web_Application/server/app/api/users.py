from fastapi import APIRouter, File, Form, UploadFile, HTTPException, Depends, Header, Path
from typing import List, Optional
import json
import os
from datetime import datetime
import shutil
import uuid
import logging
import bcrypt
from server.app.utils.database import db
from bson.objectid import ObjectId

router = APIRouter()
logger = logging.getLogger(__name__)

# Helper function to save uploaded files - same as in professionals.py
async def save_upload_file(upload_file: UploadFile, folder: str) -> str:
    try:
        # Create folder if it doesn't exist
        os.makedirs(folder, exist_ok=True)

        # Generate a unique filename
        file_extension = os.path.splitext(upload_file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(folder, unique_filename)

        # Save the file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)

        # Return the relative path for storing in database
        return file_path
    except Exception as e:
        logger.error(f"Error saving file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")

# Simplified authentication - same as in professionals.py
async def get_admin_user(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        return {"role": "admin"}  # For testing only - remove in production!

    # Here you'd validate the token and return user info
    # For now, we're just returning a mock admin user
    return {"role": "admin", "id": "admin_user_id"}

# Create a new user
@router.post("/")
async def create_user(
        name: str = Form(...),
        email: str = Form(...),
        phone: str = Form(...),
        location: str = Form(...),
        password: str = Form(...),
        active: bool = Form(True),
        profileImage: Optional[UploadFile] = File(None),
        current_user: dict = Depends(get_admin_user)
):
    logger.info(f"Received user creation request for: {name}")

    try:
        # Check if user has admin role
        if current_user.get("role") != "admin":
            logger.warning(f"Non-admin user attempted to create user: {current_user}")
            raise HTTPException(status_code=403, detail="Only administrators can add users")

        # Check if user with email already exists
        users_collection = db["users"]
        existing_user = users_collection.find_one({"email": email})
        if existing_user:
            raise HTTPException(status_code=400, detail="User with this email already exists")

        # Hash the password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        # Set profile image path
        profile_image_path = ""
        if profileImage:
            logger.info(f"Saving profile image: {profileImage.filename}")
            profile_image_path = await save_upload_file(profileImage, "uploads/user_profile_images")

        # Create user document
        user = {
            "name": name,
            "email": email,
            "phone": phone,
            "location": location,
            "password": hashed_password.decode('utf-8'),  # Store as string
            "active": active,
            "joinDate": datetime.now().strftime("%Y-%m-%d"),
            "currentMood": 50,  # Default neutral mood
            "riskLevel": "Low",  # Default risk level
            "recentActivity": [],
            "lastActive": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "profileImagePath": profile_image_path,
            "createdAt": datetime.now(),
            "createdBy": current_user.get("id")
        }

        # Save to database
        logger.info("Saving user to database")
        result = users_collection.insert_one(user)

        # Return the new user with ID (excluding password)
        user_response = user.copy()
        del user_response["password"]
        user_response["_id"] = str(result.inserted_id)
        logger.info(f"User created with ID: {user_response['_id']}")

        return {"message": "User added successfully", "user": user_response}

    except HTTPException as e:
        # Re-raise HTTP exceptions
        logger.error(f"HTTP Exception: {e.detail}")
        raise
    except Exception as e:
        logger.error(f"Error creating user: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create user: {str(e)}")

# Get all users
@router.get("/")
async def get_users(current_user: dict = Depends(get_admin_user)):
    try:
        users_collection = db["users"]
        users = list(users_collection.find({}))

        # Remove passwords from the response
        for user in users:
            user["_id"] = str(user["_id"])
            if "password" in user:
                del user["password"]
            if "createdBy" in user and user["createdBy"]:
                user["createdBy"] = str(user["createdBy"])

        return users
    except Exception as e:
        logger.error(f"Error retrieving users: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve users: {str(e)}")

# Delete a user by ID
@router.delete("/{user_id}")
async def delete_user(
        user_id: str = Path(..., title="The ID of the user to delete"),
        current_user: dict = Depends(get_admin_user)
):
    try:
        # Check if user has admin role
        if current_user.get("role") != "admin":
            logger.warning(f"Non-admin user attempted to delete user: {current_user}")
            raise HTTPException(status_code=403, detail="Only administrators can delete users")

        # Convert string ID to ObjectId
        try:
            obj_id = ObjectId(user_id)
        except Exception as e:
            logger.error(f"Invalid ObjectId format: {user_id}")
            raise HTTPException(status_code=400, detail=f"Invalid user ID format: {str(e)}")

        # Get the user first to retrieve file paths
        users_collection = db["users"]
        user = users_collection.find_one({"_id": obj_id})

        if not user:
            logger.warning(f"No user found with ID: {user_id}")
            raise HTTPException(status_code=404, detail="User not found")

        # Delete the user from the database
        result = users_collection.delete_one({"_id": obj_id})

        if result.deleted_count == 0:
            logger.warning(f"Failed to delete user with ID: {user_id}")
            raise HTTPException(status_code=500, detail="Failed to delete user")

        # Clean up associated files
        try:
            if "profileImagePath" in user and user["profileImagePath"]:
                profile_path = user["profileImagePath"]
                if os.path.exists(profile_path):
                    os.remove(profile_path)
        except Exception as e:
            # Log error but don't fail the request if file deletion fails
            logger.error(f"Error deleting user files: {str(e)}")

        logger.info(f"User deleted with ID: {user_id}")
        return {"message": "User deleted successfully"}

    except HTTPException as e:
        # Re-raise HTTP exceptions
        logger.error(f"HTTP Exception: {e.detail}")
        raise
    except Exception as e:
        logger.error(f"Error deleting user: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to delete user: {str(e)}")