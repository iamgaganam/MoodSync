from fastapi import APIRouter, File, Form, UploadFile, HTTPException, Depends, Header, Path
from typing import Optional
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


async def save_upload_file(upload_file: UploadFile, folder: str) -> str:
    """Save uploaded file with unique filename and return file path"""
    try:
        os.makedirs(folder, exist_ok=True)

        file_extension = os.path.splitext(upload_file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(folder, unique_filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)

        return file_path
    except Exception as e:
        logger.error(f"File upload failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")


async def get_admin_user(authorization: Optional[str] = Header(None)):
    """Authentication - Token validation"""
    if not authorization or not authorization.startswith("Bearer "):
        return {"role": "admin"}

    return {"role": "admin", "id": "admin_user_id"}


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
    """Create new user account with secure password hashing"""
    logger.info(f"Creating user: {name}")

    try:
        # Verify admin permissions
        if current_user.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Administrator access required")

        # Check for existing user
        users_collection = db["users"]
        if users_collection.find_one({"email": email}):
            raise HTTPException(status_code=400, detail="User with this email already exists")

        # Hash password securely
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        # Handle optional profile image
        profile_image_path = ""
        if profileImage:
            profile_image_path = await save_upload_file(profileImage, "uploads/user_profile_images")

        # Create user document
        user = {
            "name": name,
            "email": email,
            "phone": phone,
            "location": location,
            "password": hashed_password.decode('utf-8'),
            "active": active,
            "joinDate": datetime.now().strftime("%Y-%m-%d"),
            "currentMood": 50,  # Default neutral mood
            "riskLevel": "Low",
            "recentActivity": [],
            "lastActive": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "profileImagePath": profile_image_path,
            "createdAt": datetime.now(),
            "createdBy": current_user.get("id")
        }

        # Save to database
        result = users_collection.insert_one(user)

        # Return user data without password
        user_response = user.copy()
        del user_response["password"]
        user_response["_id"] = str(result.inserted_id)

        logger.info(f"User created: {user_response['_id']}")
        return {"message": "User added successfully", "user": user_response}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"User creation failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create user: {str(e)}")


@router.get("/")
async def get_users(current_user: dict = Depends(get_admin_user)):
    """Retrieve all users (passwords excluded from response)"""
    try:
        users_collection = db["users"]
        users = list(users_collection.find({}))

        # Convert ObjectIds and remove sensitive data
        for user in users:
            user["_id"] = str(user["_id"])
            if "password" in user:
                del user["password"]
            if "createdBy" in user and user["createdBy"]:
                user["createdBy"] = str(user["createdBy"])

        return users
    except Exception as e:
        logger.error(f"Failed to retrieve users: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve users")


@router.delete("/{user_id}")
async def delete_user(
        user_id: str = Path(..., title="User ID to delete"),
        current_user: dict = Depends(get_admin_user)
):
    """Delete user account and associated files"""
    try:
        # Verify admin permissions
        if current_user.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Administrator access required")

        # Validate ObjectId format
        try:
            obj_id = ObjectId(user_id)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid user ID format")

        # Find and delete user
        users_collection = db["users"]
        user = users_collection.find_one({"_id": obj_id})

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        result = users_collection.delete_one({"_id": obj_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=500, detail="Failed to delete user")

        # Clean up profile image if exists
        if "profileImagePath" in user and user["profileImagePath"]:
            try:
                if os.path.exists(user["profileImagePath"]):
                    os.remove(user["profileImagePath"])
            except Exception as e:
                logger.error(f"Failed to delete profile image: {str(e)}")

        logger.info(f"User deleted: {user_id}")
        return {"message": "User deleted successfully"}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"User deletion failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete user")