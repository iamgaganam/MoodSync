from fastapi import APIRouter, HTTPException, status, Query
from typing import List, Optional
from bson import ObjectId
from datetime import datetime

from server.app.models.community_models import (
    SupportGroupResponse, EventResponse, PostResponse, PeerSupporterResponse,
    ChatRoomResponse, CommentResponse, PostBase, CommentBase
)
from server.app.utils.database import (
    support_groups_collection, events_collection, posts_collection,
    comments_collection, peer_supporters_collection, chat_rooms_collection
)

router = APIRouter()

def format_datetime_ago(dt: datetime) -> str:
    """Convert datetime to human-readable 'time ago' format"""
    now = datetime.now()
    diff = now - dt

    if diff.days > 30:
        months = diff.days // 30
        return f"{months} {'month' if months == 1 else 'months'} ago"
    elif diff.days > 0:
        return f"{diff.days} {'day' if diff.days == 1 else 'days'} ago"
    elif diff.seconds >= 3600:
        hours = diff.seconds // 3600
        return f"{hours} {'hour' if hours == 1 else 'hours'} ago"
    elif diff.seconds >= 60:
        minutes = diff.seconds // 60
        return f"{minutes} {'minute' if minutes == 1 else 'minutes'} ago"
    else:
        return "Just now"


async def build_search_query(search: Optional[str], fields: List[str]) -> dict:
    """Build MongoDB search query for multiple fields"""
    if not search:
        return {}

    return {
        "$or": [
            {field: {"$regex": search, "$options": "i"}} for field in fields
        ]
    }


async def toggle_user_membership(collection, doc_id: str, user_field: str, count_field: str):
    """Function to handle join/leave operations"""
    user_id = str(MOCK_USER["_id"])

    # Find document
    doc = await collection.find_one({"_id": ObjectId(doc_id)})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found")

    is_member = user_id in doc.get(user_field, [])

    # Toggle membership
    if is_member:
        update_op = {
            "$pull": {user_field: user_id},
            "$inc": {count_field: -1},
            "$set": {"updatedAt": datetime.now()}
        }
    else:
        update_op = {
            "$addToSet": {user_field: user_id},
            "$inc": {count_field: 1},
            "$set": {"updatedAt": datetime.now()}
        }

    result = await collection.update_one({"_id": ObjectId(doc_id)}, update_op)
    if result.modified_count == 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to update membership")

    return await collection.find_one({"_id": ObjectId(doc_id)})


# Support Groups Endpoints
@router.get("/support-groups", response_model=List[SupportGroupResponse])
async def get_support_groups(
        language: Optional[str] = None,
        is_online: Optional[bool] = None,
        tag: Optional[str] = None,
        search: Optional[str] = None
):
    """Retrieve support groups with optional filtering"""
    query = {}

    # Apply filters
    if language and language != "all":
        query["language"] = language
    if is_online is not None:
        query["isOnline"] = is_online
    if tag and tag != "all":
        query["tags"] = {"$in": [tag]}

    # Add search query
    if search:
        search_query = await build_search_query(search, ["name", "description"])
        if "tags" in search_query["$or"][0]:
            search_query["$or"].append({"tags": {"$in": [search.lower()]}})
        query.update(search_query)

    try:
        cursor = support_groups_collection.find(query)
        groups = []
        user_id = str(MOCK_USER["_id"])

        async for doc in cursor:
            is_joined = user_id in doc.get("joinedUsers", [])
            groups.append(SupportGroupResponse(
                id=str(doc["_id"]),
                name=doc["name"],
                description=doc["description"],
                meetingSchedule=doc["meetingSchedule"],
                members=doc["members"],
                tags=doc["tags"],
                language=doc["language"],
                isOnline=doc["isOnline"],
                isJoined=is_joined,
                createdAt=doc["createdAt"],
                updatedAt=doc["updatedAt"]
            ))

        return groups
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/support-groups/{group_id}/join", response_model=SupportGroupResponse)
async def join_leave_support_group(group_id: str):
    """Toggle support group membership"""
    try:
        updated_group = await toggle_user_membership(
            support_groups_collection, group_id, "joinedUsers", "members"
        )

        user_id = str(MOCK_USER["_id"])
        is_joined = user_id in updated_group.get("joinedUsers", [])

        return SupportGroupResponse(
            id=str(updated_group["_id"]),
            name=updated_group["name"],
            description=updated_group["description"],
            meetingSchedule=updated_group["meetingSchedule"],
            members=updated_group["members"],
            tags=updated_group["tags"],
            language=updated_group["language"],
            isOnline=updated_group["isOnline"],
            isJoined=is_joined,
            createdAt=updated_group["createdAt"],
            updatedAt=updated_group["updatedAt"]
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


# Events Endpoints
@router.get("/events", response_model=List[EventResponse])
async def get_events(search: Optional[str] = None):
    """Retrieve events with optional search"""
    try:
        query = await build_search_query(search, ["title", "host", "location"]) if search else {}

        cursor = events_collection.find(query)
        events_list = []
        user_id = str(MOCK_USER["_id"])

        async for doc in cursor:
            is_rsvp = user_id in doc.get("attendees", [])
            events_list.append(EventResponse(
                id=str(doc["_id"]),
                title=doc["title"],
                date=doc["date"],
                time=doc["time"],
                host=doc["host"],
                location=doc["location"],
                attendees=doc["attendeeCount"],
                isRsvp=is_rsvp,
                createdAt=doc["createdAt"],
                updatedAt=doc["updatedAt"]
            ))

        return events_list
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/events/{event_id}/rsvp", response_model=EventResponse)
async def rsvp_to_event(event_id: str):
    """Toggle event RSVP status"""
    try:
        updated_event = await toggle_user_membership(
            events_collection, event_id, "attendees", "attendeeCount"
        )

        user_id = str(MOCK_USER["_id"])
        is_rsvp = user_id in updated_event.get("attendees", [])

        return EventResponse(
            id=str(updated_event["_id"]),
            title=updated_event["title"],
            date=updated_event["date"],
            time=updated_event["time"],
            host=updated_event["host"],
            location=updated_event["location"],
            attendees=updated_event["attendeeCount"],
            isRsvp=is_rsvp,
            createdAt=updated_event["createdAt"],
            updatedAt=updated_event["updatedAt"]
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


# Posts & Comments Endpoints
@router.get("/posts", response_model=List[PostResponse])
async def get_posts(
        search: Optional[str] = None,
        limit: int = Query(10, ge=1, le=50),
        skip: int = Query(0, ge=0)
):
    """Retrieve posts with pagination and search"""
    try:
        query = await build_search_query(search, ["title", "content", "author"]) if search else {}

        cursor = posts_collection.find(query).sort("createdAt", -1).skip(skip).limit(limit)
        posts_list = []
        user_id = str(MOCK_USER["_id"])

        async for post in cursor:
            is_liked = user_id in post.get("likes", [])
            time_posted = format_datetime_ago(post["createdAt"])

            posts_list.append(PostResponse(
                id=str(post["_id"]),
                title=post["title"],
                content=post["content"],
                author=post["author"],
                likes=post["likeCount"],
                comments=post["commentCount"],
                isLiked=is_liked,
                timePosted=time_posted,
                createdAt=post["createdAt"],
                updatedAt=post["updatedAt"]
            ))

        return posts_list
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/posts", response_model=PostResponse)
async def create_post(post_data: PostBase):
    """Create new community post"""
    try:
        now = datetime.now()
        post = {
            "title": post_data.title,
            "content": post_data.content,
            "author": post_data.author or MOCK_USER["username"],
            "likes": [],
            "likeCount": 0,
            "commentCount": 0,
            "createdAt": now,
            "updatedAt": now
        }

        result = await posts_collection.insert_one(post)
        if not result.inserted_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to create post")

        created_post = await posts_collection.find_one({"_id": result.inserted_id})

        return PostResponse(
            id=str(created_post["_id"]),
            title=created_post["title"],
            content=created_post["content"],
            author=created_post["author"],
            likes=created_post["likeCount"],
            comments=created_post["commentCount"],
            isLiked=False,
            timePosted="Just now",
            createdAt=created_post["createdAt"],
            updatedAt=created_post["updatedAt"]
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/posts/{post_id}/like", response_model=PostResponse)
async def like_unlike_post(post_id: str):
    """Toggle post like status"""
    try:
        updated_post = await toggle_user_membership(
            posts_collection, post_id, "likes", "likeCount"
        )

        user_id = str(MOCK_USER["_id"])
        is_liked = user_id in updated_post.get("likes", [])
        time_posted = format_datetime_ago(updated_post["createdAt"])

        return PostResponse(
            id=str(updated_post["_id"]),
            title=updated_post["title"],
            content=updated_post["content"],
            author=updated_post["author"],
            likes=updated_post["likeCount"],
            comments=updated_post["commentCount"],
            isLiked=is_liked,
            timePosted=time_posted,
            createdAt=updated_post["createdAt"],
            updatedAt=updated_post["updatedAt"]
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/posts/{post_id}/comments", response_model=List[CommentResponse])
async def get_post_comments(post_id: str):
    """Retrieve comments for specific post"""
    try:
        cursor = comments_collection.find({"postId": ObjectId(post_id)}).sort("createdAt", 1)
        comments_list = []

        async for comment in cursor:
            time_posted = format_datetime_ago(comment["createdAt"])
            comments_list.append(CommentResponse(
                id=str(comment["_id"]),
                author=comment["author"],
                text=comment["text"],
                timePosted=time_posted,
                createdAt=comment["createdAt"]
            ))

        return comments_list
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/posts/{post_id}/comments", response_model=CommentResponse)
async def add_comment(post_id: str, comment_data: CommentBase):
    """Add comment to post"""
    try:
        # Verify post exists
        post = await posts_collection.find_one({"_id": ObjectId(post_id)})
        if not post:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")

        # Create comment
        now = datetime.now()
        comment = {
            "postId": ObjectId(post_id),
            "author": comment_data.author or MOCK_USER["username"],
            "text": comment_data.text,
            "createdAt": now
        }

        result = await comments_collection.insert_one(comment)
        if not result.inserted_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to add comment")

        # Update post comment count
        await posts_collection.update_one(
            {"_id": ObjectId(post_id)},
            {"$inc": {"commentCount": 1}, "$set": {"updatedAt": now}}
        )

        created_comment = await comments_collection.find_one({"_id": result.inserted_id})

        return CommentResponse(
            id=str(created_comment["_id"]),
            author=created_comment["author"],
            text=created_comment["text"],
            timePosted="Just now",
            createdAt=created_comment["createdAt"]
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


# Peer Supporters Endpoints
@router.get("/peer-supporters", response_model=List[PeerSupporterResponse])
async def get_peer_supporters(search: Optional[str] = None):
    """Retrieve peer supporters with optional search"""
    try:
        query = await build_search_query(search, ["name", "specialties", "languages"]) if search else {}

        cursor = peer_supporters_collection.find(query)
        supporters_list = []
        user_id = str(MOCK_USER["_id"])

        async for doc in cursor:
            is_connected = user_id in doc.get("connectedUsers", [])
            supporters_list.append(PeerSupporterResponse(
                id=str(doc["_id"]),
                name=doc["name"],
                specialties=doc["specialties"],
                experience=doc["experience"],
                languages=doc["languages"],
                isConnected=is_connected,
                createdAt=doc["createdAt"],
                updatedAt=doc["updatedAt"]
            ))

        return supporters_list
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/peer-supporters/{supporter_id}/connect", response_model=PeerSupporterResponse)
async def connect_disconnect_supporter(supporter_id: str):
    """Toggle peer supporter connection"""
    try:
        updated_supporter = await toggle_user_membership(
            peer_supporters_collection, supporter_id, "connectedUsers", None
        )

        user_id = str(MOCK_USER["_id"])
        is_connected = user_id in updated_supporter.get("connectedUsers", [])

        return PeerSupporterResponse(
            id=str(updated_supporter["_id"]),
            name=updated_supporter["name"],
            specialties=updated_supporter["specialties"],
            experience=updated_supporter["experience"],
            languages=updated_supporter["languages"],
            isConnected=is_connected,
            createdAt=updated_supporter["createdAt"],
            updatedAt=updated_supporter["updatedAt"]
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


# Chat Rooms Endpoints
@router.get("/chat-rooms", response_model=List[ChatRoomResponse])
async def get_chat_rooms(search: Optional[str] = None):
    """Retrieve chat rooms with optional search"""
    try:
        query = await build_search_query(search, ["name", "topic"]) if search else {}

        cursor = chat_rooms_collection.find(query)
        rooms_list = []
        user_id = str(MOCK_USER["_id"])

        async for doc in cursor:
            is_joined = user_id in doc.get("activeMembers", [])
            rooms_list.append(ChatRoomResponse(
                id=str(doc["_id"]),
                name=doc["name"],
                moderator=doc["moderator"],
                topic=doc["topic"],
                activeMembers=doc["activeMemberCount"],
                isJoined=is_joined,
                createdAt=doc["createdAt"],
                updatedAt=doc["updatedAt"]
            ))

        return rooms_list
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/chat-rooms/{room_id}/join", response_model=ChatRoomResponse)
async def join_leave_chat_room(room_id: str):
    """Toggle chat room membership"""
    try:
        updated_room = await toggle_user_membership(
            chat_rooms_collection, room_id, "activeMembers", "activeMemberCount"
        )

        user_id = str(MOCK_USER["_id"])
        is_joined = user_id in updated_room.get("activeMembers", [])

        return ChatRoomResponse(
            id=str(updated_room["_id"]),
            name=updated_room["name"],
            moderator=updated_room["moderator"],
            topic=updated_room["topic"],
            activeMembers=updated_room["activeMemberCount"],
            isJoined=is_joined,
            createdAt=updated_room["createdAt"],
            updatedAt=updated_room["updatedAt"]
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))