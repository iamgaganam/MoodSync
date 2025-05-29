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


class BookingCreate(BaseModel):
    """Model for creating new booking appointments"""
    doctorId: str
    doctorName: str
    time: str
    date: str
    hospitalName: str
    specialty: str
    price: float
    userName: str = "Anonymous User"
    userContact: Optional[str] = None


class BookingResponse(BaseModel):
    """Model for booking response data"""
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


def generate_booking_reference(doctor_id: str, date: str) -> str:
    """Generate unique booking reference number"""
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    doctor_prefix = doctor_id[:4] if len(doctor_id) >= 4 else doctor_id
    return f"BK-{doctor_prefix}-{timestamp}"


@router.post("/", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
async def create_booking(booking: BookingCreate = Body(...)):
    """Create new appointment booking with conflict checking"""
    db = get_database()

    # Validate doctor exists
    if not booking.doctorId.startswith("mock-"):
        try:
            doctor = await db.professionals.find_one({"_id": ObjectId(booking.doctorId)})
            if not doctor:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Doctor not found"
                )
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Doctor not found"
            )

    # Check for booking conflicts
    existing_booking = await db.bookings.find_one({
        "doctorId": booking.doctorId,
        "date": booking.date,
        "time": booking.time,
        "status": "confirmed"
    })

    if existing_booking:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This time slot is already booked. Please select another time."
        )

    # Create booking document
    booking_doc = booking.dict()
    booking_doc["bookingRef"] = generate_booking_reference(booking.doctorId, booking.date)
    booking_doc["createdAt"] = datetime.now()
    booking_doc["status"] = "confirmed"

    # Save to database
    result = await db.bookings.insert_one(booking_doc)
    booking_doc["id"] = str(result.inserted_id)

    return booking_doc


@router.get("/{booking_id}", response_model=BookingResponse)
async def get_booking(booking_id: str):
    """Retrieve specific booking by ID"""
    db = get_database()

    try:
        booking = await db.bookings.find_one({"_id": ObjectId(booking_id)})
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid booking ID format"
        )

    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )

    # Convert ObjectId for response
    booking["id"] = str(booking["_id"])
    del booking["_id"]

    return booking


@router.get("/user/{user_name}", response_model=list[BookingResponse])
async def get_user_bookings(user_name: str):
    """Retrieve all bookings for specific user"""
    db = get_database()

    cursor = db.bookings.find({"userName": user_name})
    bookings = await cursor.to_list(length=100)

    if not bookings:
        return []

    # Convert ObjectIds for response
    for booking in bookings:
        booking["id"] = str(booking["_id"])
        del booking["_id"]

    return bookings