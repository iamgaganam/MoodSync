import os
import logging
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ConfigurationError, ServerSelectionTimeoutError
from dotenv import load_dotenv
from datetime import datetime

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Get MongoDB connection string from environment variables
# Note: Check both MONGO_URI (your code) and MONGODB_URI (from .env)
MONGO_URI = os.getenv("MONGO_URI") or os.getenv("MONGODB_URI")
DB_NAME = os.getenv("DB_NAME", "moodsync")

if not MONGO_URI:
    logger.error("MONGO_URI environment variable is not set!")
    raise ValueError("MONGO_URI environment variable is not set")

try:
    # Connect to MongoDB with timeout
    logger.info(f"Attempting to connect to MongoDB for database: {DB_NAME}...")
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)

    # Check connection by pinging
    client.admin.command('ping')
    logger.info(f"Successfully connected to MongoDB database: {DB_NAME}")

    # Get database and collections
    db = client[DB_NAME]

    # Existing collections
    users_collection = db["users"]

    # Community support collections
    support_groups_collection = db["support_groups"]
    events_collection = db["events"]
    posts_collection = db["posts"]
    comments_collection = db["comments"]
    peer_supporters_collection = db["peer_supporters"]
    chat_rooms_collection = db["chat_rooms"]
    chat_messages_collection = db["chat_messages"]

    # Create indexes if they don't exist
    if "email_1" not in users_collection.index_information():
        users_collection.create_index("email", unique=True)
        logger.info("Created unique index on email field")
    else:
        logger.info("Email index already exists")

except ConnectionFailure as e:
    logger.error(f"MongoDB Connection Error: {str(e)}")
    raise
except ServerSelectionTimeoutError as e:
    logger.error(f"MongoDB Server Selection Timeout: {str(e)}")
    raise
except ConfigurationError as e:
    logger.error(f"MongoDB Configuration Error: {str(e)}")
    raise
except Exception as e:
    logger.error(f"Unexpected error when connecting to MongoDB: {str(e)}")
    raise


# Format datetime to "X time ago"
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


# Functions to initialize the community database with sample data
async def init_support_groups():
    # Check if collection is empty
    count = await support_groups_collection.count_documents({})
    if count == 0:
        # Insert sample support groups
        await support_groups_collection.insert_many([
            {
                "name": "Anxiety Support Circle",
                "members": 234,
                "meetingSchedule": "Tuesdays at 7PM",
                "description": "A safe space for people dealing with anxiety to share experiences and coping strategies.",
                "tags": ["anxiety", "stress", "coping"],
                "language": "English",
                "isOnline": True,
                "joinedUsers": [],
                "createdAt": datetime.now(),
                "updatedAt": datetime.now()
            },
            {
                "name": "Depression Recovery",
                "members": 187,
                "meetingSchedule": "Wednesdays at 6PM",
                "description": "Support for those navigating depression and working toward recovery.",
                "tags": ["depression", "recovery", "self-care"],
                "language": "English",
                "isOnline": True,
                "joinedUsers": [],
                "createdAt": datetime.now(),
                "updatedAt": datetime.now()
            },
            {
                "name": "සිංහල මානසික සෞඛ්‍ය කණ්ඩායම",
                "members": 156,
                "meetingSchedule": "Saturdays at 10AM",
                "description": "A Sinhala-language group focused on mental health awareness and support.",
                "tags": ["sinhala", "general", "awareness"],
                "language": "Sinhala",
                "isOnline": False,
                "joinedUsers": [],
                "createdAt": datetime.now(),
                "updatedAt": datetime.now()
            },
            {
                "name": "Young Adults Wellness",
                "members": 221,
                "meetingSchedule": "Fridays at 8PM",
                "description": "For young adults (18-30) dealing with mental health challenges in today's world.",
                "tags": ["young-adults", "stress", "life-skills"],
                "language": "English",
                "isOnline": True,
                "joinedUsers": [],
                "createdAt": datetime.now(),
                "updatedAt": datetime.now()
            }
        ])
        logger.info("Initialized support groups collection with sample data")


async def init_events():
    # Check if collection is empty
    count = await events_collection.count_documents({})
    if count == 0:
        # Insert sample events
        await events_collection.insert_many([
            {
                "title": "Mindfulness Workshop",
                "date": "June 15, 2025",
                "time": "6:00 PM - 7:30 PM",
                "host": "Dr. Samantha Perera",
                "location": "Online (Zoom)",
                "attendees": [],
                "attendeeCount": 18,
                "createdAt": datetime.now(),
                "updatedAt": datetime.now()
            },
            {
                "title": "Art Therapy Session",
                "date": "June 18, 2025",
                "time": "4:00 PM - 5:30 PM",
                "host": "Colombo Wellness Center",
                "location": "Colombo 7, Sri Lanka",
                "attendees": [],
                "attendeeCount": 12,
                "createdAt": datetime.now(),
                "updatedAt": datetime.now()
            }
        ])
        logger.info("Initialized events collection with sample data")


async def init_posts_and_comments():
    # Check if collections are empty
    posts_count = await posts_collection.count_documents({})
    if posts_count == 0:
        # Insert sample posts
        from bson import ObjectId
        post1_id = ObjectId()
        post2_id = ObjectId()
        post3_id = ObjectId()

        await posts_collection.insert_many([
            {
                "_id": post1_id,
                "author": "Mindful_Journey",
                "title": "Finding peace in small moments",
                "content": "Today I practiced mindfulness for just 5 minutes and it made such a difference... I noticed how much calmer I felt afterward. It's amazing how taking just a small break to breathe and center yourself can change your whole outlook.",
                "likes": [],
                "likeCount": 24,
                "commentCount": 2,
                "createdAt": datetime.now(),
                "updatedAt": datetime.now()
            },
            {
                "_id": post2_id,
                "author": "HealingSteps",
                "title": "My recovery milestone",
                "content": "After 6 months of therapy, I finally feel like I'm making progress with my anxiety... It hasn't been easy, but having this community has helped me stay committed to the process. I can now go to social events without the overwhelming fear I used to experience.",
                "likes": [],
                "likeCount": 56,
                "commentCount": 3,
                "createdAt": datetime.now(),
                "updatedAt": datetime.now()
            },
            {
                "_id": post3_id,
                "author": "GratitudeSeeker",
                "title": "Three things I'm grateful for today",
                "content": "Even on hard days, finding small things to be grateful for helps me stay grounded... Today I'm grateful for: 1) My morning cup of tea, 2) The supportive message from a friend, 3) Finding this community where I can express myself freely.",
                "likes": [],
                "likeCount": 38,
                "commentCount": 2,
                "createdAt": datetime.now(),
                "updatedAt": datetime.now()
            }
        ])

        # Insert sample comments
        await comments_collection.insert_many([
            {
                "postId": post1_id,
                "author": "HealingSteps",
                "text": "This is so true! I've been doing the same.",
                "createdAt": datetime.now()
            },
            {
                "postId": post1_id,
                "author": "PeacefulMind",
                "text": "What mindfulness technique do you use?",
                "createdAt": datetime.now()
            },
            {
                "postId": post2_id,
                "author": "RecoveryRoad",
                "text": "So proud of you! Keep going!",
                "createdAt": datetime.now()
            },
            {
                "postId": post2_id,
                "author": "JourneyToWell",
                "text": "This gives me so much hope",
                "createdAt": datetime.now()
            },
            {
                "postId": post2_id,
                "author": "MindfulMatters",
                "text": "What type of therapy worked best for you?",
                "createdAt": datetime.now()
            },
            {
                "postId": post3_id,
                "author": "ThankfulHeart",
                "text": "I love this practice! I'll try it too.",
                "createdAt": datetime.now()
            },
            {
                "postId": post3_id,
                "author": "MindfulJourney",
                "text": "Beautiful way to shift perspective ❤️",
                "createdAt": datetime.now()
            }
        ])
        logger.info("Initialized posts and comments collections with sample data")


async def init_peer_supporters():
    # Check if collection is empty
    count = await peer_supporters_collection.count_documents({})
    if count == 0:
        # Insert sample peer supporters
        await peer_supporters_collection.insert_many([
            {
                "name": "Amal S.",
                "specialties": "Anxiety, Depression",
                "experience": "Supporting others for 2 years",
                "languages": "Languages: English, Sinhala",
                "connectedUsers": [],
                "createdAt": datetime.now(),
                "updatedAt": datetime.now()
            },
            {
                "name": "Priya K.",
                "specialties": "PTSD, Stress Management",
                "experience": "Supporting others for 3 years",
                "languages": "Languages: English, Tamil",
                "connectedUsers": [],
                "createdAt": datetime.now(),
                "updatedAt": datetime.now()
            },
            {
                "name": "Malik J.",
                "specialties": "Recovery, Addiction",
                "experience": "Supporting others for 5 years",
                "languages": "Languages: English, Sinhala",
                "connectedUsers": [],
                "createdAt": datetime.now(),
                "updatedAt": datetime.now()
            }
        ])
        logger.info("Initialized peer supporters collection with sample data")


async def init_chat_rooms():
    # Check if collection is empty
    count = await chat_rooms_collection.count_documents({})
    if count == 0:
        # Insert sample chat rooms
        await chat_rooms_collection.insert_many([
            {
                "name": "Daily Mindfulness",
                "activeMembers": [],
                "activeMemberCount": 42,
                "moderator": "MindfulMasters",
                "topic": "Finding calm in busy moments",
                "createdAt": datetime.now(),
                "updatedAt": datetime.now()
            },
            {
                "name": "Anxiety Support",
                "activeMembers": [],
                "activeMemberCount": 28,
                "moderator": "CalmCollective",
                "topic": "Coping with social anxiety",
                "createdAt": datetime.now(),
                "updatedAt": datetime.now()
            },
            {
                "name": "Young Adults (18-25)",
                "activeMembers": [],
                "activeMemberCount": 36,
                "moderator": "YouthWellness",
                "topic": "Balancing work, study, and mental health",
                "createdAt": datetime.now(),
                "updatedAt": datetime.now()
            }
        ])
        logger.info("Initialized chat rooms collection with sample data")


async def init_community_database():
    """Initialize all community collections with sample data"""
    await init_support_groups()
    await init_events()
    await init_posts_and_comments()
    await init_peer_supporters()
    await init_chat_rooms()
    logger.info("Community database initialization complete")


logger.info("Database setup complete")