# server/app/api/community.py
from fastapi import APIRouter, HTTPException, status, Query
from typing import List, Optional, Any
from bson import ObjectId
from datetime import datetime

# Models
from server.app.models.community_models import (
    SupportGroupResponse, EventResponse, PostResponse, PeerSupporterResponse,
    ChatRoomResponse, CommentResponse, PostBase, CommentBase
)

# Database collections
from server.app.utils.database import (
    support_groups_collection, events_collection, posts_collection,
    comments_collection, peer_supporters_collection, chat_rooms_collection
)

router = APIRouter()

# Mock current user for demo purposes
MOCK_USER = {
    "_id": "demo_user_id",
    "username": "demo_user",
    "email": "demo@example.com"
}


# Helper function to format time ago
async def format_datetime_ago(dt: datetime) -> str:
    """Convert datetime to 'X time ago' format"""
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


# Support Groups Endpoints
@router.get("/support-groups", response_model=List[SupportGroupResponse])
async def get_support_groups(
        language: Optional[str] = None,
        is_online: Optional[bool] = None,
        tag: Optional[str] = None,
        search: Optional[str] = None
):
    query = {}

    # Apply filters
    if language and language != "all":
        query["language"] = language

    if is_online is not None:
        query["isOnline"] = is_online

    if tag and tag != "all":
        query["tags"] = {"$in": [tag]}

    # Apply search query
    if search:
        search_query = {"$or": [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"tags": {"$in": [search.lower()]}}
        ]}
        query = {**query, **search_query}

    try:
        # Find matching groups
        cursor = support_groups_collection.find(query)
        groups = []

        # User ID for checking membership
        user_id = str(MOCK_USER["_id"])

        async for doc in cursor:
            # Check if user has joined this group
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
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch support groups: {str(e)}"
        )


@router.post("/support-groups/{group_id}/join", response_model=SupportGroupResponse)
async def join_leave_support_group(group_id: str):
    try:
        # Find the group
        group = await support_groups_collection.find_one({"_id": ObjectId(group_id)})

        if not group:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Support group not found"
            )

        # Use mock user
        user_id = str(MOCK_USER["_id"])
        is_joined = user_id in group.get("joinedUsers", [])

        if is_joined:
            # User wants to leave the group
            result = await support_groups_collection.update_one(
                {"_id": ObjectId(group_id)},
                {
                    "$pull": {"joinedUsers": user_id},
                    "$inc": {"members": -1},
                    "$set": {"updatedAt": datetime.now()}
                }
            )

            if result.modified_count == 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Failed to leave group"
                )

            # Get updated group data
            updated_group = await support_groups_collection.find_one({"_id": ObjectId(group_id)})

            return SupportGroupResponse(
                id=str(updated_group["_id"]),
                name=updated_group["name"],
                description=updated_group["description"],
                meetingSchedule=updated_group["meetingSchedule"],
                members=updated_group["members"],
                tags=updated_group["tags"],
                language=updated_group["language"],
                isOnline=updated_group["isOnline"],
                isJoined=False,
                createdAt=updated_group["createdAt"],
                updatedAt=updated_group["updatedAt"]
            )
        else:
            # User wants to join the group
            result = await support_groups_collection.update_one(
                {"_id": ObjectId(group_id)},
                {
                    "$addToSet": {"joinedUsers": user_id},
                    "$inc": {"members": 1},
                    "$set": {"updatedAt": datetime.now()}
                }
            )

            if result.modified_count == 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Failed to join group"
                )

            # Get updated group data
            updated_group = await support_groups_collection.find_one({"_id": ObjectId(group_id)})

            return SupportGroupResponse(
                id=str(updated_group["_id"]),
                name=updated_group["name"],
                description=updated_group["description"],
                meetingSchedule=updated_group["meetingSchedule"],
                members=updated_group["members"],
                tags=updated_group["tags"],
                language=updated_group["language"],
                isOnline=updated_group["isOnline"],
                isJoined=True,
                createdAt=updated_group["createdAt"],
                updatedAt=updated_group["updatedAt"]
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred: {str(e)}"
        )


# Events Endpoints
@router.get("/events", response_model=List[EventResponse])
async def get_events(search: Optional[str] = None):
    query = {}

    # Apply search
    if search:
        query = {
            "$or": [
                {"title": {"$regex": search, "$options": "i"}},
                {"host": {"$regex": search, "$options": "i"}},
                {"location": {"$regex": search, "$options": "i"}}
            ]
        }

    try:
        # Find events
        cursor = events_collection.find(query)
        events_list = []

        # Use mock user
        user_id = str(MOCK_USER["_id"])

        async for doc in cursor:
            # Check if user has RSVP'd
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
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch events: {str(e)}"
        )


@router.post("/events/{event_id}/rsvp", response_model=EventResponse)
async def rsvp_to_event(event_id: str):
    try:
        # Find the event
        event = await events_collection.find_one({"_id": ObjectId(event_id)})

        if not event:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Event not found"
            )

        # Use mock user
        user_id = str(MOCK_USER["_id"])
        is_rsvp = user_id in event.get("attendees", [])

        if is_rsvp:
            # User wants to cancel RSVP
            result = await events_collection.update_one(
                {"_id": ObjectId(event_id)},
                {
                    "$pull": {"attendees": user_id},
                    "$inc": {"attendeeCount": -1},
                    "$set": {"updatedAt": datetime.now()}
                }
            )

            if result.modified_count == 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Failed to cancel RSVP"
                )
        else:
            # User wants to RSVP
            result = await events_collection.update_one(
                {"_id": ObjectId(event_id)},
                {
                    "$addToSet": {"attendees": user_id},
                    "$inc": {"attendeeCount": 1},
                    "$set": {"updatedAt": datetime.now()}
                }
            )

            if result.modified_count == 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Failed to RSVP"
                )

        # Get updated event data
        updated_event = await events_collection.find_one({"_id": ObjectId(event_id)})

        # Check if user has RSVP'd
        is_rsvp_updated = user_id in updated_event.get("attendees", [])

        return EventResponse(
            id=str(updated_event["_id"]),
            title=updated_event["title"],
            date=updated_event["date"],
            time=updated_event["time"],
            host=updated_event["host"],
            location=updated_event["location"],
            attendees=updated_event["attendeeCount"],
            isRsvp=is_rsvp_updated,
            createdAt=updated_event["createdAt"],
            updatedAt=updated_event["updatedAt"]
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred: {str(e)}"
        )


# Posts & Comments Endpoints
@router.get("/posts", response_model=List[PostResponse])
async def get_posts(
        search: Optional[str] = None,
        limit: int = Query(10, ge=1, le=50),
        skip: int = Query(0, ge=0)
):
    query = {}

    # Apply search
    if search:
        query = {
            "$or": [
                {"title": {"$regex": search, "$options": "i"}},
                {"content": {"$regex": search, "$options": "i"}},
                {"author": {"$regex": search, "$options": "i"}}
            ]
        }

    try:
        # Find posts with pagination
        cursor = posts_collection.find(query).sort("createdAt", -1).skip(skip).limit(limit)
        posts_list = []

        # Use mock user
        user_id = str(MOCK_USER["_id"])

        async for post in cursor:
            # Check if user has liked this post
            is_liked = user_id in post.get("likes", [])

            # Format time ago
            time_posted = await format_datetime_ago(post["createdAt"])

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
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch posts: {str(e)}"
        )


@router.post("/posts", response_model=PostResponse)
async def create_post(post_data: PostBase):
    try:
        # Use mock user
        username = MOCK_USER["username"]

        # Create new post
        now = datetime.now()
        post = {
            "title": post_data.title,
            "content": post_data.content,
            "author": post_data.author if post_data.author else username,
            "likes": [],
            "likeCount": 0,
            "commentCount": 0,
            "createdAt": now,
            "updatedAt": now
        }

        result = await posts_collection.insert_one(post)

        if not result.inserted_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create post"
            )

        # Get the created post
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
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred: {str(e)}"
        )


@router.post("/posts/{post_id}/like", response_model=PostResponse)
async def like_unlike_post(post_id: str):
    try:
        # Find the post
        post = await posts_collection.find_one({"_id": ObjectId(post_id)})

        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Post not found"
            )

        # Use mock user
        user_id = str(MOCK_USER["_id"])
        is_liked = user_id in post.get("likes", [])

        if is_liked:
            # User wants to unlike
            result = await posts_collection.update_one(
                {"_id": ObjectId(post_id)},
                {
                    "$pull": {"likes": user_id},
                    "$inc": {"likeCount": -1},
                    "$set": {"updatedAt": datetime.now()}
                }
            )
        else:
            # User wants to like
            result = await posts_collection.update_one(
                {"_id": ObjectId(post_id)},
                {
                    "$addToSet": {"likes": user_id},
                    "$inc": {"likeCount": 1},
                    "$set": {"updatedAt": datetime.now()}
                }
            )

        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to update like status"
            )

        # Get updated post
        updated_post = await posts_collection.find_one({"_id": ObjectId(post_id)})

        # Check if user has liked
        is_liked_updated = user_id in updated_post.get("likes", [])

        # Format time ago
        time_posted = await format_datetime_ago(updated_post["createdAt"])

        return PostResponse(
            id=str(updated_post["_id"]),
            title=updated_post["title"],
            content=updated_post["content"],
            author=updated_post["author"],
            likes=updated_post["likeCount"],
            comments=updated_post["commentCount"],
            isLiked=is_liked_updated,
            timePosted=time_posted,
            createdAt=updated_post["createdAt"],
            updatedAt=updated_post["updatedAt"]
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred: {str(e)}"
        )


@router.get("/posts/{post_id}/comments", response_model=List[CommentResponse])
async def get_post_comments(post_id: str):
    try:
        # Find comments for the post
        cursor = comments_collection.find({"postId": ObjectId(post_id)}).sort("createdAt", 1)
        comments_list = []

        async for comment in cursor:
            # Format time ago
            time_posted = await format_datetime_ago(comment["createdAt"])

            comments_list.append(CommentResponse(
                id=str(comment["_id"]),
                author=comment["author"],
                text=comment["text"],
                timePosted=time_posted,
                createdAt=comment["createdAt"]
            ))

        return comments_list
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred: {str(e)}"
        )


@router.post("/posts/{post_id}/comments", response_model=CommentResponse)
async def add_comment(post_id: str, comment_data: CommentBase):
    try:
        # Check if post exists
        post = await posts_collection.find_one({"_id": ObjectId(post_id)})

        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Post not found"
            )

        # Use mock user
        username = MOCK_USER["username"]

        # Create new comment
        now = datetime.now()
        comment = {
            "postId": ObjectId(post_id),
            "author": comment_data.author if comment_data.author else username,
            "text": comment_data.text,
            "createdAt": now
        }

        result = await comments_collection.insert_one(comment)

        if not result.inserted_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to add comment"
            )

        # Increment comment count on the post
        await posts_collection.update_one(
            {"_id": ObjectId(post_id)},
            {
                "$inc": {"commentCount": 1},
                "$set": {"updatedAt": now}
            }
        )

        # Get the created comment
        created_comment = await comments_collection.find_one({"_id": result.inserted_id})

        return CommentResponse(
            id=str(created_comment["_id"]),
            author=created_comment["author"],
            text=created_comment["text"],
            timePosted="Just now",
            createdAt=created_comment["createdAt"]
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred: {str(e)}"
        )


# Peer Supporters Endpoints
@router.get("/peer-supporters", response_model=List[PeerSupporterResponse])
async def get_peer_supporters(search: Optional[str] = None):
    query = {}

    # Apply search
    if search:
        query = {
            "$or": [
                {"name": {"$regex": search, "$options": "i"}},
                {"specialties": {"$regex": search, "$options": "i"}},
                {"languages": {"$regex": search, "$options": "i"}}
            ]
        }

    try:
        # Find peer supporters
        cursor = peer_supporters_collection.find(query)
        supporters_list = []

        # Use mock user
        user_id = str(MOCK_USER["_id"])

        async for doc in cursor:
            # Check if user is connected
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
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch peer supporters: {str(e)}"
        )


@router.post("/peer-supporters/{supporter_id}/connect", response_model=PeerSupporterResponse)
async def connect_disconnect_supporter(supporter_id: str):
    try:
        # Find the supporter
        supporter = await peer_supporters_collection.find_one({"_id": ObjectId(supporter_id)})

        if not supporter:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Peer supporter not found"
            )

        # Use mock user
        user_id = str(MOCK_USER["_id"])
        is_connected = user_id in supporter.get("connectedUsers", [])

        if is_connected:
            # User wants to disconnect
            result = await peer_supporters_collection.update_one(
                {"_id": ObjectId(supporter_id)},
                {
                    "$pull": {"connectedUsers": user_id},
                    "$set": {"updatedAt": datetime.now()}
                }
            )
        else:
            # User wants to connect
            result = await peer_supporters_collection.update_one(
                {"_id": ObjectId(supporter_id)},
                {
                    "$addToSet": {"connectedUsers": user_id},
                    "$set": {"updatedAt": datetime.now()}
                }
            )

        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to update connection status"
            )

        # Get updated supporter data
        updated_supporter = await peer_supporters_collection.find_one({"_id": ObjectId(supporter_id)})

        # Check if user is connected
        is_connected_updated = user_id in updated_supporter.get("connectedUsers", [])

        return PeerSupporterResponse(
            id=str(updated_supporter["_id"]),
            name=updated_supporter["name"],
            specialties=updated_supporter["specialties"],
            experience=updated_supporter["experience"],
            languages=updated_supporter["languages"],
            isConnected=is_connected_updated,
            createdAt=updated_supporter["createdAt"],
            updatedAt=updated_supporter["updatedAt"]
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred: {str(e)}"
        )


# Chat Rooms Endpoints
@router.get("/chat-rooms", response_model=List[ChatRoomResponse])
async def get_chat_rooms(search: Optional[str] = None):
    query = {}

    # Apply search
    if search:
        query = {
            "$or": [
                {"name": {"$regex": search, "$options": "i"}},
                {"topic": {"$regex": search, "$options": "i"}}
            ]
        }

    try:
        # Find chat rooms
        cursor = chat_rooms_collection.find(query)
        rooms_list = []

        # Use mock user
        user_id = str(MOCK_USER["_id"])

        async for doc in cursor:
            # Check if user has joined
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
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch chat rooms: {str(e)}"
        )


@router.post("/chat-rooms/{room_id}/join", response_model=ChatRoomResponse)
async def join_leave_chat_room(room_id: str):
    try:
        # Find the chat room
        room = await chat_rooms_collection.find_one({"_id": ObjectId(room_id)})

        if not room:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Chat room not found"
            )

        # Use mock user
        user_id = str(MOCK_USER["_id"])
        is_joined = user_id in room.get("activeMembers", [])

        if is_joined:
            # User wants to leave
            result = await chat_rooms_collection.update_one(
                {"_id": ObjectId(room_id)},
                {
                    "$pull": {"activeMembers": user_id},
                    "$inc": {"activeMemberCount": -1},
                    "$set": {"updatedAt": datetime.now()}
                }
            )
        else:
            # User wants to join
            result = await chat_rooms_collection.update_one(
                {"_id": ObjectId(room_id)},
                {
                    "$addToSet": {"activeMembers": user_id},
                    "$inc": {"activeMemberCount": 1},
                    "$set": {"updatedAt": datetime.now()}
                }
            )

        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to update chat room status"
            )

        # Get updated room data
        updated_room = await chat_rooms_collection.find_one({"_id": ObjectId(room_id)})

        # Check if user has joined
        is_joined_updated = user_id in updated_room.get("activeMembers", [])

        return ChatRoomResponse(
            id=str(updated_room["_id"]),
            name=updated_room["name"],
            moderator=updated_room["moderator"],
            topic=updated_room["topic"],
            activeMembers=updated_room["activeMemberCount"],
            isJoined=is_joined_updated,
            createdAt=updated_room["createdAt"],
            updatedAt=updated_room["updatedAt"]
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred: {str(e)}"
        )