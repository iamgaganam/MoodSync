# server/app/models/community_models.py
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

# Simplified models without complex dependencies

class SupportGroupBase(BaseModel):
    name: str
    description: str
    meetingSchedule: str
    language: str
    isOnline: bool
    tags: List[str]

class SupportGroupResponse(SupportGroupBase):
    id: str
    members: int
    isJoined: bool = False
    createdAt: datetime
    updatedAt: datetime

class EventBase(BaseModel):
    title: str
    date: str
    time: str
    host: str
    location: str

class EventResponse(EventBase):
    id: str
    attendees: int
    isRsvp: bool = False
    createdAt: datetime
    updatedAt: datetime

class CommentBase(BaseModel):
    text: str
    author: str

class CommentResponse(CommentBase):
    id: str
    timePosted: str
    createdAt: datetime

class PostBase(BaseModel):
    title: str
    content: str
    author: str

class PostResponse(PostBase):
    id: str
    likes: int
    comments: int
    isLiked: bool = False
    timePosted: str
    commentsList: Optional[List[CommentResponse]] = None
    createdAt: datetime
    updatedAt: datetime

class PeerSupporterBase(BaseModel):
    name: str
    specialties: str
    experience: str
    languages: str

class PeerSupporterResponse(PeerSupporterBase):
    id: str
    isConnected: bool = False
    createdAt: datetime
    updatedAt: datetime

class ChatRoomBase(BaseModel):
    name: str
    moderator: str
    topic: str

class ChatRoomResponse(ChatRoomBase):
    id: str
    activeMembers: int
    isJoined: bool = False
    createdAt: datetime
    updatedAt: datetime

class ChatMessageBase(BaseModel):
    sender: str
    text: str
    roomId: str

class ChatMessageResponse(BaseModel):
    id: str
    sender: str
    text: str
    time: str
    createdAt: datetime