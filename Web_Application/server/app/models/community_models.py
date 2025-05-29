from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel


# Support Group Models
class SupportGroupBase(BaseModel):
    """Base model for support group data"""
    name: str
    description: str
    meetingSchedule: str
    language: str
    isOnline: bool
    tags: List[str]


class SupportGroupResponse(SupportGroupBase):
    """Support group response with additional metadata"""
    id: str
    members: int
    isJoined: bool = False
    createdAt: datetime
    updatedAt: datetime


# Event Models
class EventBase(BaseModel):
    """Base model for event data"""
    title: str
    date: str
    time: str
    host: str
    location: str


class EventResponse(EventBase):
    """Event response with RSVP status and metadata"""
    id: str
    attendees: int
    isRsvp: bool = False
    createdAt: datetime
    updatedAt: datetime


# Comment Models
class CommentBase(BaseModel):
    """Base model for comment data"""
    text: str
    author: str


class CommentResponse(CommentBase):
    """Comment response with timestamp formatting"""
    id: str
    timePosted: str
    createdAt: datetime


# Post Models
class PostBase(BaseModel):
    """Base model for community post data"""
    title: str
    content: str
    author: str


class PostResponse(PostBase):
    """Post response with engagement metrics"""
    id: str
    likes: int
    comments: int
    isLiked: bool = False
    timePosted: str
    commentsList: Optional[List[CommentResponse]] = None
    createdAt: datetime
    updatedAt: datetime


# Peer Supporter Models
class PeerSupporterBase(BaseModel):
    """Base model for peer supporter data"""
    name: str
    specialties: str
    experience: str
    languages: str


class PeerSupporterResponse(PeerSupporterBase):
    """Peer supporter response with connection status"""
    id: str
    isConnected: bool = False
    createdAt: datetime
    updatedAt: datetime


# Chat Room Models
class ChatRoomBase(BaseModel):
    """Base model for chat room data"""
    name: str
    moderator: str
    topic: str


class ChatRoomResponse(ChatRoomBase):
    """Chat room response with membership status"""
    id: str
    activeMembers: int
    isJoined: bool = False
    createdAt: datetime
    updatedAt: datetime


# Chat Message Models
class ChatMessageBase(BaseModel):
    """Base model for chat message data"""
    sender: str
    text: str
    roomId: str


class ChatMessageResponse(BaseModel):
    """Chat message response with formatting"""
    id: str
    sender: str
    text: str
    time: str
    createdAt: datetime