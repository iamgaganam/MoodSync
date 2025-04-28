from locust import HttpUser, task, between
import random
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class MentalHealthAppUser(HttpUser):
    """Simulates users interacting with the mental health app."""
    
    host = "http://localhost:8000"
    wait_time = between(1, 5)
    token = None
    
    def on_start(self):
        """Set up user data and authenticate."""
        self.user_id = random.randint(1, 100000)
        self.email = f"test_user_{self.user_id}@example.com"
        self.password = "Test1234!"
        self._register_user()
        self._login_user()
    
    def _register_user(self):
        """Register a new user."""
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
        
        try:
            # Try primary and fallback registration endpoints
            endpoints = ["/api/auth/register", "/auth/register"]
            
            for endpoint in endpoints:
                with self.client.post(
                    endpoint, 
                    json=user_data,
                    name=endpoint,
                    catch_response=True
                ) as response:
                    if response.status_code < 400:
                        logger.info(f"Successfully registered at {endpoint}")
                        return
        except Exception as e:
            logger.error(f"Registration failed: {e}")
    
    def _login_user(self):
        """Login and obtain auth token."""
        if not self.token:
            # Define possible login endpoint variations
            login_endpoints = [
                ("/api/auth/login", {"username": self.email, "password": self.password}),
                ("/auth/login", {"username": self.email, "password": self.password}),
                ("/api/auth/token", {"username": self.email, "password": self.password}),
                ("/login", {"email": self.email, "password": self.password})
            ]
            
            for endpoint, data in login_endpoints:
                try:
                    with self.client.post(
                        endpoint,
                        data=data,
                        name=endpoint,
                        catch_response=True
                    ) as response:
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
                                    return
                            except Exception as e:
                                logger.error(f"Error parsing login response: {e}")
                except Exception as e:
                    logger.error(f"Login failed at {endpoint}: {e}")
    
    @task(2)
    def visit_health_check(self):
        """Test health check endpoint."""
        endpoints = ["/health", "/"]
        
        for endpoint in endpoints:
            with self.client.get(endpoint, name=endpoint, catch_response=True) as response:
                if response.status_code < 400:
                    response.success()
                    return
    
    @task(5)
    def analyze_sentiment(self):
        """Test sentiment analysis endpoint."""
        if not self.token:
            return
            
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
        
        selected_text = random.choice(texts)
        
        # Try multiple endpoint paths
        endpoints = ["/api/sentiment/analyze", "/sentiment/analyze", "/api/sentiment"]
        
        for endpoint in endpoints:
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
    def get_protected_resource(self):
        """Test protected endpoint access."""
        if not self.token:
            return
            
        endpoints = ["/api/protected/profile", "/api/user/profile", "/api/protected/data", "/api/user"]
        
        for endpoint in endpoints:
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
    """Simulates WebSocket connections (via HTTP approximation)."""
    
    host = "http://localhost:8000"
    wait_time = between(10, 30)
    token = None
    
    def on_start(self):
        """Set up user and authenticate."""
        self.user_id = random.randint(1, 100000)
        self.email = f"ws_user_{self.user_id}@example.com"
        self.password = "Test1234!"
        
        # Register and login
        self._register_and_login()
    
    def _register_and_login(self):
        """Combined registration and login."""
        # Register
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
            self.client.post("/api/auth/register", json=user_data, catch_response=True)
            
            # Login to get token
            response = self.client.post(
                "/api/auth/login",
                data={"username": self.email, "password": self.password},
                catch_response=True
            )
            
            if response.status_code == 200:
                response_data = response.json()
                self.token = response_data.get("access_token")
        except Exception as e:
            logger.error(f"WebSocket user setup failed: {e}")
    
    @task
    def simulate_websocket_connection(self):
        """Simulate WebSocket connection via HTTP."""
        if not self.token:
            return
            
        # Find a working WebSocket status endpoint
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
                        # Found working endpoint, simulate message exchange
                        self._simulate_message_exchange()
                        return
            except Exception:
                continue
    
    def _simulate_message_exchange(self):
        """Simulate exchanging messages over WebSocket."""
        if not self.token:
            return
            
        messages = [
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
                    json={"message": random.choice(messages)},
                    name=endpoint,
                    catch_response=True
                )
                return
            except Exception:
                continue


# Print test configuration information
def print_test_info():
    """Display test configuration information."""
    info = """
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
"""
    print(info)

print_test_info()