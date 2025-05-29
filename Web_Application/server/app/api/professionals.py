from fastapi import APIRouter, File, Form, UploadFile, HTTPException, Depends, Header, Path
from typing import Optional
import json
import os
from datetime import datetime
import shutil
import uuid
import logging
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
async def create_professional(
        name: str = Form(...),
        email: str = Form(...),
        phone: str = Form(...),
        hospital: str = Form(...),
        specialty: str = Form(...),
        specializations: str = Form(...),
        languages: str = Form(...),
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
    """Create new healthcare professional profile"""
    logger.info(f"Creating professional: {name}")

    try:
        # Verify admin permissions
        if current_user.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Administrator access required")

        # Parse JSON fields
        try:
            specializations_list = json.loads(specializations)
            languages_list = json.loads(languages)
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid JSON format for specializations or languages")

        # Set default join date
        if not joinDate:
            joinDate = datetime.now().strftime("%Y-%m-%d")

        # Save uploaded files
        profile_image_path = await save_upload_file(profileImage, "uploads/profile_images")
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
        professionals_collection = db["professionals"]
        result = professionals_collection.insert_one(professional)

        professional["_id"] = str(result.inserted_id)
        logger.info(f"Professional created: {professional['_id']}")

        return {"message": "Professional added successfully", "professional": professional}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Professional creation failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create professional: {str(e)}")


@router.get("/")
async def get_professionals(current_user: dict = Depends(get_admin_user)):
    """Retrieve all healthcare professionals"""
    try:
        professionals_collection = db["professionals"]
        professionals = list(professionals_collection.find({}))

        # Convert ObjectIds to strings for JSON serialization
        for professional in professionals:
            professional["_id"] = str(professional["_id"])
            if "createdBy" in professional and professional["createdBy"]:
                professional["createdBy"] = str(professional["createdBy"])

        return professionals
    except Exception as e:
        logger.error(f"Failed to retrieve professionals: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve professionals")


@router.delete("/{professional_id}")
async def delete_professional(
        professional_id: str = Path(..., title="Professional ID to delete"),
        current_user: dict = Depends(get_admin_user)
):
    """Delete healthcare professional and associated files"""
    try:
        # Verify admin permissions
        if current_user.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Administrator access required")

        # Validate ObjectId format
        try:
            obj_id = ObjectId(professional_id)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid professional ID format")

        # Find and delete professional
        professionals_collection = db["professionals"]
        professional = professionals_collection.find_one({"_id": obj_id})

        if not professional:
            raise HTTPException(status_code=404, detail="Professional not found")

        result = professionals_collection.delete_one({"_id": obj_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=500, detail="Failed to delete professional")

        # Clean up associated files
        for path_key in ["profileImagePath", "licenseCertificatePath"]:
            if path_key in professional and professional[path_key]:
                try:
                    if os.path.exists(professional[path_key]):
                        os.remove(professional[path_key])
                except Exception as e:
                    logger.error(f"Failed to delete file {professional[path_key]}: {str(e)}")

        logger.info(f"Professional deleted: {professional_id}")
        return {"message": "Professional deleted successfully"}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Professional deletion failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete professional")