# server/app/api/emergency_contacts.py
from fastapi import APIRouter, Path, HTTPException, Depends, Form, Query
from typing import List, Optional
from datetime import datetime
import logging
from server.app.utils.database import db
from bson.objectid import ObjectId
from fastapi.middleware.cors import CORSMiddleware

router = APIRouter()
logger = logging.getLogger(__name__)


# Simplified authentication function - adjust to match your existing auth system
async def get_current_user():
    # For testing/demo, return a dummy user
    # In production, this should validate tokens/sessions
    return {"id": "current-user"}


# Create a new emergency contact
@router.post("/")
async def create_emergency_contact(
        name: str = Form(...),
        phone: str = Form(...),
        userId: str = Form(...),
        current_user=Depends(get_current_user)
):
    try:
        # Create emergency contact document
        emergency_contact = {
            "name": name,
            "phone": phone,
            "userId": userId,
            "createdAt": datetime.now(),
            "createdBy": current_user.get("id")
        }

        # Save to database
        logger.info(f"Saving emergency contact for user {userId}")
        emergency_contacts_collection = db["emergency_contacts"]
        result = emergency_contacts_collection.insert_one(emergency_contact)

        # Return the new emergency contact with ID
        emergency_contact["_id"] = str(result.inserted_id)
        logger.info(f"Emergency contact created with ID: {emergency_contact['_id']}")

        return {"message": "Emergency contact added successfully", "emergency_contact": emergency_contact}

    except Exception as e:
        logger.error(f"Error creating emergency contact: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create emergency contact: {str(e)}")


# Get all emergency contacts for a user
@router.get("/user/{user_id}")
async def get_user_emergency_contacts(
        user_id: str = Path(..., title="The ID of the user to get emergency contacts for"),
        current_user=Depends(get_current_user)
):
    try:
        logger.info(f"Fetching emergency contacts for user: {user_id}")
        emergency_contacts_collection = db["emergency_contacts"]
        emergency_contacts = list(emergency_contacts_collection.find({"userId": user_id}))

        logger.info(f"Found {len(emergency_contacts)} contacts for user {user_id}")

        # Convert ObjectId to string for JSON serialization
        for contact in emergency_contacts:
            contact["_id"] = str(contact["_id"])
            if "createdBy" in contact and contact["createdBy"]:
                contact["createdBy"] = str(contact["createdBy"])

        # Debug log the first contact if available
        if emergency_contacts and len(emergency_contacts) > 0:
            logger.debug(f"Sample contact: {emergency_contacts[0]}")

        return emergency_contacts
    except Exception as e:
        logger.error(f"Error retrieving emergency contacts: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve emergency contacts: {str(e)}")


# Delete an emergency contact
@router.delete("/{contact_id}")
async def delete_emergency_contact(
        contact_id: str = Path(..., title="The ID of the emergency contact to delete"),
        current_user=Depends(get_current_user)
):
    try:
        logger.info(f"Attempting to delete emergency contact with ID: {contact_id}")

        # Convert string ID to ObjectId
        try:
            obj_id = ObjectId(contact_id)
        except Exception as e:
            logger.error(f"Invalid ObjectId format: {contact_id}")
            raise HTTPException(status_code=400, detail=f"Invalid emergency contact ID format: {str(e)}")

        # Get the emergency contact first to check if it exists
        emergency_contacts_collection = db["emergency_contacts"]
        emergency_contact = emergency_contacts_collection.find_one({"_id": obj_id})

        if not emergency_contact:
            logger.warning(f"No emergency contact found with ID: {contact_id}")
            raise HTTPException(status_code=404, detail="Emergency contact not found")

        # Delete the emergency contact from the database
        result = emergency_contacts_collection.delete_one({"_id": obj_id})

        if result.deleted_count == 0:
            logger.warning(f"Failed to delete emergency contact with ID: {contact_id}")
            raise HTTPException(status_code=500, detail="Failed to delete emergency contact")

        logger.info(f"Emergency contact deleted with ID: {contact_id}")
        return {"message": "Emergency contact deleted successfully"}

    except HTTPException as e:
        # Re-raise HTTP exceptions
        logger.error(f"HTTP Exception: {e.detail}")
        raise
    except Exception as e:
        logger.error(f"Error deleting emergency contact: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to delete emergency contact: {str(e)}")


# Health check endpoint for API testing
@router.get("/health")
async def health_check():
    try:
        # Check database connection
        db.command("ping")
        return {"status": "healthy", "message": "API is operational"}
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"API health check failed: {str(e)}")