from fastapi import APIRouter, File, Form, UploadFile, HTTPException, Depends, Header
from typing import List, Optional
import json
import os
from datetime import datetime
import shutil
import uuid
import logging
from server.app.utils.database import db  # Make sure this path matches your project structure

router = APIRouter()
logger = logging.getLogger(__name__)


# Helper function to save uploaded files
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


# Simplified authentication - we'll improve this later
async def get_admin_user(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        return {"role": "admin"}  # For testing only - remove in production!

    # Here you'd validate the token and return user info
    # For now, we're just returning a mock admin user
    return {"role": "admin", "id": "admin_user_id"}


# Changed from "" to "/" to make the route more explicit
@router.post("/")
async def create_professional(
        name: str = Form(...),
        email: str = Form(...),
        phone: str = Form(...),
        hospital: str = Form(...),
        specialty: str = Form(...),
        specializations: str = Form(...),  # JSON string
        languages: str = Form(...),  # JSON string
        education: str = Form(...),
        licenseNumber: str = Form(...),
        availableHours: str = Form(...),
        active: bool = Form(True),
        verified: bool = Form(False),
        joinDate: Optional[str] = Form(None),
        availabilityStatus: str = Form("Available"),
        profileImage: UploadFile = File(...),
        licenseCertificate: UploadFile = File(...),
        current_user: dict = Depends(get_admin_user)
):
    # Add debugging log to help troubleshoot
    logger.info(f"Received professional creation request for: {name}")

    try:
        # Check if user has admin role (assuming role field exists in user document)
        if current_user.get("role") != "admin":
            logger.warning(f"Non-admin user attempted to create professional: {current_user}")
            raise HTTPException(status_code=403, detail="Only administrators can add professionals")

        # Parse JSON strings
        try:
            specializations_list = json.loads(specializations)
            languages_list = json.loads(languages)
        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing error: {str(e)}")
            raise HTTPException(status_code=400, detail="Invalid JSON format for specializations or languages")

        # Set join date to today if not provided
        if not joinDate:
            joinDate = datetime.now().strftime("%Y-%m-%d")

        # Save uploaded files
        logger.info(f"Saving profile image: {profileImage.filename}")
        profile_image_path = await save_upload_file(profileImage, "uploads/profile_images")

        logger.info(f"Saving license certificate: {licenseCertificate.filename}")
        license_cert_path = await save_upload_file(licenseCertificate, "uploads/license_certificates")

        # Create professional document
        professional = {
            "name": name,
            "email": email,
            "phone": phone,
            "hospital": hospital,
            "active": active,
            "joinDate": joinDate,
            "verified": verified,
            "specialty": specialty,
            "specializations": specializations_list,
            "languages": languages_list,
            "education": education,
            "licenseNumber": licenseNumber,
            "currentAssignments": [],
            "availabilityStatus": availabilityStatus,
            "availableHours": availableHours,
            "nextAvailableSlot": "",
            "profileImagePath": profile_image_path,
            "licenseCertificatePath": license_cert_path,
            "createdAt": datetime.now(),
            "createdBy": current_user.get("id")
        }

        # Save to database
        logger.info("Saving professional to database")
        professionals_collection = db["professionals"]
        result = professionals_collection.insert_one(professional)

        # Return the new professional with ID
        professional["_id"] = str(result.inserted_id)
        logger.info(f"Professional created with ID: {professional['_id']}")

        return {"message": "Professional added successfully", "professional": professional}

    except HTTPException as e:
        # Re-raise HTTP exceptions
        logger.error(f"HTTP Exception: {e.detail}")
        raise
    except Exception as e:
        logger.error(f"Error creating professional: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create professional: {str(e)}")


# Get all professionals
@router.get("/")
async def get_professionals(current_user: dict = Depends(get_admin_user)):
    try:
        professionals_collection = db["professionals"]
        professionals = list(professionals_collection.find({}))

        # Convert ObjectId to string for JSON serialization
        for professional in professionals:
            professional["_id"] = str(professional["_id"])
            if "createdBy" in professional and professional["createdBy"]:
                professional["createdBy"] = str(professional["createdBy"])

        return professionals
    except Exception as e:
        logger.error(f"Error retrieving professionals: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve professionals: {str(e)}")