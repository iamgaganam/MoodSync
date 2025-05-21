from fastapi import APIRouter, HTTPException, Body, status
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from bson import ObjectId
from ..utils.database import get_database

router = APIRouter(
    prefix="/api/bookings",
    tags=["bookings"],
    responses={404: {"description": "Not found"}},
)


# Pydantic models
class BookingCreate(BaseModel):
    doctorId: str
    doctorName: str
    time: str
    date: str
    hospitalName: str
    specialty: str
    price: float
    userName: str = "Anonymous User"
    userContact: Optional[str] = None

    class Config:
        schema_extra = {
            "example": {
                "doctorId": "123456789",
                "doctorName": "Dr. Kumara Perera",
                "time": "09:00",
                "date": "2025-05-21",
                "hospitalName": "Nawaloka Hospital - Colombo",
                "specialty": "Psychiatrist",
                "price": 3500,
                "userName": "Patient Name",
                "userContact": "0771234567"
            }
        }


class BookingResponse(BaseModel):
    id: str
    doctorId: str
    doctorName: str
    time: str
    date: str
    hospitalName: str
    specialty: str
    price: float
    userName: str
    userContact: Optional[str] = None
    bookingRef: str
    createdAt: datetime
    status: str = "confirmed"


# Helper function to create a booking reference
def generate_booking_reference(doctor_id: str, date: str) -> str:
    """Generate a unique booking reference"""
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    doctor_prefix = doctor_id[:4] if len(doctor_id) >= 4 else doctor_id
    return f"BK-{doctor_prefix}-{timestamp}"


@router.post("/", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
async def create_booking(booking: BookingCreate = Body(...)):
    """
    Create a new booking for a mental health professional.
    """
    db = get_database()

    # Check if the doctor exists
    try:
        doctor = await db.professionals.find_one({"_id": ObjectId(booking.doctorId)})
    except:
        # If the ID isn't a valid ObjectId, we'll assume it's a mock doctor
        doctor = None

    # For mock doctors or if doctor checking is disabled, proceed anyway
    if not doctor and not booking.doctorId.startswith("mock-"):
        # Only raise an error if it's not a mock doctor
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found"
        )

    # Check if this time slot is already booked for this doctor on this date
    existing_booking = await db.bookings.find_one({
        "doctorId": booking.doctorId,
        "date": booking.date,
        "time": booking.time,
        "status": "confirmed"  # Only check against confirmed bookings
    })

    if existing_booking:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This time slot is already booked. Please select another time."
        )

    # Create booking reference
    booking_ref = generate_booking_reference(booking.doctorId, booking.date)

    # Prepare booking document
    booking_doc = booking.dict()
    booking_doc["bookingRef"] = booking_ref
    booking_doc["createdAt"] = datetime.now()
    booking_doc["status"] = "confirmed"

    # Insert booking
    result = await db.bookings.insert_one(booking_doc)
    booking_id = str(result.inserted_id)

    # Convert ObjectId to string for response
    booking_doc["id"] = booking_id
    booking_doc["createdAt"] = booking_doc["createdAt"]

    # Optional: Send SMS notification or email (would be implemented here)

    return booking_doc


@router.get("/{booking_id}", response_model=BookingResponse)
async def get_booking(booking_id: str):
    """
    Get a booking by ID
    """
    db = get_database()

    try:
        booking = await db.bookings.find_one({"_id": ObjectId(booking_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid booking ID format"
        )

    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )

    # Convert ObjectId to string
    booking["id"] = str(booking["_id"])
    del booking["_id"]

    return booking


@router.get("/user/{user_name}", response_model=list[BookingResponse])
async def get_user_bookings(user_name: str):
    """
    Get all bookings for a specific user
    """
    db = get_database()

    cursor = db.bookings.find({"userName": user_name})
    bookings = await cursor.to_list(length=100)

    if not bookings:
        return []

    # Convert ObjectIds to strings
    for booking in bookings:
        booking["id"] = str(booking["_id"])
        del booking["_id"]

    return bookings