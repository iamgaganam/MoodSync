from locust import HttpUser, task, between
import random
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class MentalHealthAppUser(HttpUser):
    """Simulates regular application users performing common actions"""

    host = "http://localhost:8000"
    wait_time = between(1, 5)
    token = None

    def on_start(self):
        """Initialize user session with registration and authentication"""
        self.user_id = random.randint(1, 100000)
        self.email = f"test_user_{self.user_id}@example.com"
        self.password = "Test1234!"
        self._register_user()
        self._authenticate_user()

    def _register_user(self):
        """Register new test user with fallback endpoints"""
        user_data = {
            "username": f"test_user_{self.user_id}",
            "email": self.email,
            "password": self.password,
            "mobileNumber": f"94771234{self.user_id % 1000:03}",
            "emergencyContact": {
                "name": "Emergency Contact",
                "mobileNumber": "94771239999",
                "relationship": "Friend"
            }
        }

        registration_endpoints = ["/api/auth/register", "/auth/register"]

        for endpoint in registration_endpoints:
            try:
                with self.client.post(endpoint, json=user_data, name=endpoint, catch_response=True) as response:
                    if response.status_code < 400:
                        logger.info(f"Registration successful: {endpoint}")
                        return
            except Exception as e:
                logger.error(f"Registration failed at {endpoint}: {e}")

    def _authenticate_user(self):
        """Authenticate user and obtain access token"""
        if self.token:
            return

        auth_configs = [
            ("/api/auth/login", {"username": self.email, "password": self.password}),
            ("/auth/login", {"username": self.email, "password": self.password}),
            ("/api/auth/token", {"username": self.email, "password": self.password}),
            ("/login", {"email": self.email, "password": self.password})
        ]

        for endpoint, credentials in auth_configs:
            try:
                with self.client.post(endpoint, data=credentials, name=endpoint, catch_response=True) as response:
                    if response.status_code == 200:
                        response_data = response.json()
                        self.token = (
                                response_data.get("access_token") or
                                response_data.get("token") or
                                response_data.get("accessToken")
                        )
                        if self.token:
                            logger.info(f"Authentication successful: {endpoint}")
                            return
            except Exception as e:
                logger.error(f"Authentication failed at {endpoint}: {e}")

    @task(2)
    def check_system_health(self):
        """Test system health and status endpoints"""
        health_endpoints = ["/health", "/"]

        for endpoint in health_endpoints:
            with self.client.get(endpoint, name=endpoint, catch_response=True) as response:
                if response.status_code < 400:
                    response.success()
                    return

    @task(5)
    def analyze_sentiment(self):
        """Test sentiment analysis with various text samples"""
        if not self.token:
            return

        # Diverse test samples for comprehensive testing
        test_samples = [
            # Mental health concerns
            "I feel so sad and hopeless today",
            "I don't enjoy anything anymore",
            "I'm constantly worried about everything",
            "I feel nervous and can't relax",
            "I'm overwhelmed with work pressure",

            # Normal/positive content
            "I had a regular day today",
            "The weather is nice outside",
            "I watched a movie last night"
        ]

        selected_text = random.choice(test_samples)
        sentiment_endpoints = ["/api/sentiment/analyze", "/sentiment/analyze", "/api/sentiment"]

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
                        return
            except Exception as e:
                logger.error(f"Sentiment analysis failed at {endpoint}: {e}")

    @task(2)
    def access_protected_resources(self):
        """Test access to protected endpoints"""
        if not self.token:
            return

        protected_endpoints = ["/api/protected/profile", "/api/user/profile", "/api/protected/data", "/api/user"]

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
                        return
            except Exception as e:
                logger.error(f"Protected resource access failed at {endpoint}: {e}")


class WebSocketUser(HttpUser):
    """Simulates WebSocket-based chat interactions"""

    host = "http://localhost:8000"
    wait_time = between(10, 30)
    token = None

    def on_start(self):
        """Initialize WebSocket user with authentication"""
        self.user_id = random.randint(1, 100000)
        self.email = f"ws_user_{self.user_id}@example.com"
        self.password = "Test1234!"
        self._setup_user_session()

    def _setup_user_session(self):
        """Combined registration and authentication for WebSocket users"""
        user_data = {
            "username": f"ws_user_{self.user_id}",
            "email": self.email,
            "password": self.password,
            "mobileNumber": f"94771234{self.user_id % 1000:03}",
            "emergencyContact": {
                "name": "Emergency Contact",
                "mobileNumber": "94771239999",
                "relationship": "Friend"
            }
        }

        try:
            # Register user
            self.client.post("/api/auth/register", json=user_data, catch_response=True)

            # Authenticate and get token
            response = self.client.post(
                "/api/auth/login",
                data={"username": self.email, "password": self.password},
                catch_response=True
            )

            if response.status_code == 200:
                self.token = response.json().get("access_token")
        except Exception as e:
            logger.error(f"WebSocket user setup failed: {e}")

    @task
    def simulate_websocket_interaction(self):
        """Simulate WebSocket connection and message exchange"""
        if not self.token:
            return

        # Test WebSocket status endpoints
        status_endpoints = ["/api/chat/status", "/api/chat-socket/status", "/api/socket/status"]

        for endpoint in status_endpoints:
            try:
                with self.client.get(
                        endpoint,
                        headers={"Authorization": f"Bearer {self.token}"},
                        name=endpoint,
                        catch_response=True
                ) as response:
                    if response.status_code < 400:
                        self._simulate_message_exchange()
                        return
            except Exception:
                continue

    def _simulate_message_exchange(self):
        """Simulate sending messages through WebSocket API"""
        if not self.token:
            return

        chat_messages = [
            "Hello, how are you?",
            "I'm feeling sad today",
            "Can you help me with my anxiety?",
            "I'm having trouble sleeping",
            "I need some advice"
        ]

        message_endpoints = ["/api/chat/message", "/api/chat-socket/message", "/api/socket/message"]

        for endpoint in message_endpoints:
            try:
                self.client.post(
                    endpoint,
                    headers={"Authorization": f"Bearer {self.token}"},
                    json={"message": random.choice(chat_messages)},
                    name=endpoint,
                    catch_response=True
                )
                return
            except Exception:
                continue


def print_test_configuration():
    """Display performance test configuration and guidelines"""
    config_info = """
========================================================
MoodSync Performance Testing Configuration Guidelines to Marker
========================================================
Target Host: http://localhost:8000

User Classes:
├── MentalHealthAppUser: Core application functionality
└── WebSocketUser: Real-time chat/messaging features

Test Coverage:
├── Authentication & Registration
├── Sentiment Analysis API
├── Protected Resource Access
├── WebSocket Communication
└── System Health Monitoring

Performance Guidelines:
• Start with 5-10 concurrent users
• Monitor server resources during testing
• Gradually increase load to identify bottlenecks
• Check application logs for errors
========================================================
"""
    print(config_info)


print_test_configuration()