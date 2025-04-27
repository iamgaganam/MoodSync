from locust import HttpUser, task, between
import random
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class MentalHealthAppUser(HttpUser):
    """
    Locust test class for simulating users interacting with the mental health app.
    """

    # Define the host directly in the class
    host = "http://localhost:8000"

    # Wait time between tasks (1-5 seconds)
    wait_time = between(1, 5)

    # Store tokens for authenticated requests
    token = None

    def on_start(self):
        """Log in when the user starts."""
        # Create a unique user email for this test instance
        user_id = random.randint(1, 100000)
        self.email = f"test_user_{user_id}@example.com"
        self.password = "Test1234!"

        # Try to register the user first
        try:
            user_data = {
                "username": f"test_user_{user_id}",
                "email": self.email,
                "password": self.password,
                "mobileNumber": f"94771234{user_id % 1000:03}",
                "emergencyContact": {
                    "name": "Emergency Contact",
                    "mobileNumber": "94771239999",
                    "relationship": "Friend"
                }
            }

            # Check if registration endpoint exists, try alternative paths if needed
            try:
                logger.info(f"Attempting to register user: {self.email}")
                response = self.client.post(
                    "/api/auth/register",
                    json=user_data,
                    name="/api/auth/register",
                    catch_response=True
                )
                if response.status_code >= 400:
                    logger.warning(f"Registration failed with status {response.status_code}")
                    # Try an alternative path
                    response = self.client.post(
                        "/auth/register",
                        json=user_data,
                        name="/auth/register",
                        catch_response=True
                    )
            except Exception as e:
                logger.error(f"Registration exception: {e}")
        except Exception as e:
            logger.error(f"Error during registration setup: {e}")

        # Now login to get the token
        try:
            # Try multiple login endpoint variations
            login_endpoints = [
                ("/api/auth/login", {"username": self.email, "password": self.password}),
                ("/auth/login", {"username": self.email, "password": self.password}),
                ("/api/auth/token", {"username": self.email, "password": self.password}),
                ("/login", {"email": self.email, "password": self.password})
            ]

            for endpoint, data in login_endpoints:
                try:
                    logger.info(f"Attempting login at {endpoint}")
                    response = self.client.post(
                        endpoint,
                        data=data,  # Some APIs expect form data
                        name=endpoint,
                        catch_response=True
                    )

                    if response.status_code == 200:
                        try:
                            response_data = response.json()
                            # Try different token field names
                            self.token = (
                                    response_data.get("access_token") or
                                    response_data.get("token") or
                                    response_data.get("accessToken")
                            )
                            if self.token:
                                logger.info(f"Successfully logged in at {endpoint}")
                                break
                        except Exception as e:
                            logger.error(f"Error parsing login response: {e}")
                except Exception as e:
                    logger.error(f"Login attempt failed at {endpoint}: {e}")

            if not self.token:
                logger.warning("Failed to obtain token, will skip authenticated requests")

        except Exception as e:
            logger.error(f"Error during login: {e}")

    @task(2)
    def visit_health_check(self):
        """Visit the health check endpoint."""
        with self.client.get("/health", name="/health", catch_response=True) as response:
            if response.status_code == 404:
                # Try alternative health check endpoints
                try:
                    alt_response = self.client.get("/", name="/", catch_response=True)
                    if alt_response.status_code == 200:
                        alt_response.success()
                except Exception:
                    pass
            elif response.status_code == 200:
                response.success()

    @task(5)
    def analyze_sentiment(self):
        """Simulate sentiment analysis."""
        if not self.token:
            return

        # List of texts with various mental health sentiments
        texts = [
            # Depression texts
            "I feel so sad and hopeless today",
            "I don't enjoy anything anymore",
            "I feel worthless and like a burden",

            # Anxiety texts
            "I'm constantly worried about everything",
            "I feel nervous and can't relax",
            "My heart is racing and I can't focus",

            # Stress texts
            "I'm overwhelmed with work and can't handle it",
            "The pressure is too much for me",
            "I'm stressed out about my finances",

            # Positive/Normal texts
            "I had a regular day today",
            "The weather is nice outside",
            "I watched a movie last night"
        ]

        # Randomly select a text
        selected_text = random.choice(texts)

        # Try multiple possible endpoint paths
        sentiment_endpoints = [
            "/api/sentiment/analyze",
            "/sentiment/analyze",
            "/api/sentiment"
        ]

        for endpoint in sentiment_endpoints:
            try:
                with self.client.post(
                        endpoint,
                        headers={"Authorization": f"Bearer {self.token}"},
                        json={"text": selected_text},
                        name=endpoint,
                        catch_response=True
                ) as response:
                    if response.status_code < 400:
                        response.success()
                        break
                    elif response.status_code == 404:
                        response.failure(f"Endpoint {endpoint} not found")
                    else:
                        response.failure(f"Request failed with status code: {response.status_code}")
            except Exception as e:
                logger.error(f"Error during sentiment analysis at {endpoint}: {e}")

    @task(2)
    def get_protected_resource(self):
        """Access a protected endpoint."""
        if not self.token:
            return

        # Try multiple possible protected endpoints
        protected_endpoints = [
            "/api/protected/profile",
            "/api/user/profile",
            "/api/protected/data",
            "/api/user"
        ]

        for endpoint in protected_endpoints:
            try:
                with self.client.get(
                        endpoint,
                        headers={"Authorization": f"Bearer {self.token}"},
                        name=endpoint,
                        catch_response=True
                ) as response:
                    if response.status_code < 400:
                        response.success()
                        break
                    elif response.status_code == 404:
                        response.failure(f"Endpoint {endpoint} not found")
                    else:
                        response.failure(f"Request failed with status code: {response.status_code}")
            except Exception as e:
                logger.error(f"Error accessing protected resource at {endpoint}: {e}")


class WebSocketUser(HttpUser):
    """
    User class for testing WebSocket connections.
    Note: Locust doesn't natively support WebSockets well, so this is a simplified simulation.
    """
    # Define the host directly in the class
    host = "http://localhost:8000"

    wait_time = between(10, 30)  # Longer wait times for WebSocket users
    token = None

    def on_start(self):
        """Login to get token for WebSocket connection."""
        # Create a unique user email for this test instance
        user_id = random.randint(1, 100000)
        self.email = f"ws_user_{user_id}@example.com"
        self.password = "Test1234!"

        # Try to register and login
        try:
            # Registration
            user_data = {
                "username": f"ws_user_{user_id}",
                "email": self.email,
                "password": self.password,
                "mobileNumber": f"94771234{user_id % 1000:03}",
                "emergencyContact": {
                    "name": "Emergency Contact",
                    "mobileNumber": "94771239999",
                    "relationship": "Friend"
                }
            }

            self.client.post(
                "/api/auth/register",
                json=user_data,
                name="/api/auth/register",
                catch_response=True
            )

            # Login
            response = self.client.post(
                "/api/auth/login",
                data={"username": self.email, "password": self.password},
                name="/api/auth/login",
                catch_response=True
            )

            if response.status_code == 200:
                try:
                    response_data = response.json()
                    self.token = response_data.get("access_token")
                except Exception:
                    pass
        except Exception:
            # If registration or login fails, this user will skip authenticated requests
            pass

    @task
    def simulate_websocket_connection(self):
        """
        Simulate a WebSocket connection by making HTTP requests.

        Note: This doesn't actually open a WebSocket connection, but it simulates
        the load on your server by making regular HTTP requests to endpoints
        that would be involved in WebSocket handling.
        """
        if not self.token:
            return

        # Try multiple possible WebSocket-related endpoints
        websocket_endpoints = [
            "/api/chat/status",
            "/api/chat-socket/status",
            "/api/socket/status"
        ]

        for endpoint in websocket_endpoints:
            try:
                with self.client.get(
                        endpoint,
                        headers={"Authorization": f"Bearer {self.token}"},
                        name=endpoint,
                        catch_response=True
                ) as response:
                    if response.status_code < 400:
                        # Found a working endpoint, simulate message exchange
                        messages = [
                            "Hello, how are you?",
                            "I'm feeling sad today",
                            "Can you help me with my anxiety?",
                            "I'm having trouble sleeping",
                            "I need some advice"
                        ]

                        message_endpoints = [
                            "/api/chat/message",
                            "/api/chat-socket/message",
                            "/api/socket/message"
                        ]

                        for msg_endpoint in message_endpoints:
                            try:
                                self.client.post(
                                    msg_endpoint,
                                    headers={"Authorization": f"Bearer {self.token}"},
                                    json={"message": random.choice(messages)},
                                    name=msg_endpoint,
                                    catch_response=True
                                )
                                break
                            except Exception:
                                continue

                        break
            except Exception as e:
                logger.error(f"Error simulating WebSocket at {endpoint}: {e}")


# Print test configuration information
print("""
=====================================================
MoodSync Performance Testing Configuration
=====================================================
Host: http://localhost:8000
User Types:
- MentalHealthAppUser: Simulates regular app users
- WebSocketUser: Simulates chat/WebSocket users

Endpoints Tested:
- Authentication (/api/auth/*)
- Health check (/health)
- Sentiment analysis
- Protected resources
- WebSocket simulation

Tips:
- Start with 5-10 users and check for errors
- Gradually increase to find performance limits
- Monitor your server's CPU/memory during test
=====================================================
""")