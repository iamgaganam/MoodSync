from fastapi import APIRouter, Path, HTTPException, Depends, Form
from datetime import datetime
import logging
from server.app.utils.database import db
from bson.objectid import ObjectId

router = APIRouter()
logger = logging.getLogger(__name__)


async def get_current_user():
    return {"id": "current-user"}


@router.post("/")
async def create_emergency_contact(
        name: str = Form(...),
        phone: str = Form(...),
        userId: str = Form(...),
        current_user=Depends(get_current_user)
):
    """Create new emergency contact for user"""
    try:
        emergency_contact = {
            "name": name,
            "phone": phone,
            "userId": userId,
            "createdAt": datetime.now(),
            "createdBy": current_user.get("id")
        }

        # Save to database
        emergency_contacts_collection = db["emergency_contacts"]
        result = emergency_contacts_collection.insert_one(emergency_contact)

        emergency_contact["_id"] = str(result.inserted_id)
        logger.info(f"Emergency contact created: {emergency_contact['_id']}")

        return {"message": "Emergency contact added successfully", "emergency_contact": emergency_contact}

    except Exception as e:
        logger.error(f"Emergency contact creation failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create emergency contact")


@router.get("/user/{user_id}")
async def get_user_emergency_contacts(
        user_id: str = Path(..., title="User ID to get emergency contacts for"),
        current_user=Depends(get_current_user)
):
    """Retrieve all emergency contacts for specific user"""
    try:
        emergency_contacts_collection = db["emergency_contacts"]
        emergency_contacts = list(emergency_contacts_collection.find({"userId": user_id}))

        # Convert ObjectIds to strings for JSON serialization
        for contact in emergency_contacts:
            contact["_id"] = str(contact["_id"])
            if "createdBy" in contact and contact["createdBy"]:
                contact["createdBy"] = str(contact["createdBy"])

        logger.info(f"Retrieved {len(emergency_contacts)} contacts for user {user_id}")
        return emergency_contacts

    except Exception as e:
        logger.error(f"Failed to retrieve emergency contacts: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve emergency contacts")


@router.delete("/{contact_id}")
async def delete_emergency_contact(
        contact_id: str = Path(..., title="Emergency contact ID to delete"),
        current_user=Depends(get_current_user)
):
    """Delete emergency contact by ID"""
    try:
        # Validate ObjectId format
        try:
            obj_id = ObjectId(contact_id)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid emergency contact ID format")

        # Find and delete emergency contact
        emergency_contacts_collection = db["emergency_contacts"]
        emergency_contact = emergency_contacts_collection.find_one({"_id": obj_id})

        if not emergency_contact:
            raise HTTPException(status_code=404, detail="Emergency contact not found")

        result = emergency_contacts_collection.delete_one({"_id": obj_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=500, detail="Failed to delete emergency contact")

        logger.info(f"Emergency contact deleted: {contact_id}")
        return {"message": "Emergency contact deleted successfully"}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Emergency contact deletion failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete emergency contact")


@router.get("/health")
async def health_check():
    """API health check endpoint"""
    try:
        # Test database connection
        db.command("ping")
        return {"status": "healthy", "message": "API is operational"}
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(status_code=500, detail="API health check failed")