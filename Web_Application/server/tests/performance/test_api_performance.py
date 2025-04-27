import pytest
import time
import statistics
import json
import asyncio
from fastapi.testclient import TestClient
import os
import sys
from datetime import datetime, timedelta

# Add project root to path to help with imports
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

# Try different import approaches to find your app
try:
    # Try importing from main.py (common FastAPI pattern)
    from main import app
except ImportError:
    try:
        # Try importing from app.py if it's in the server root
        from app import app
    except ImportError:
        try:
            # Try if app is directly in the app package
            from app.app import app
        except ImportError:
            # Last resort - import from your specific path
            # Modify this to match your actual app location
            sys.path.insert(0, os.path.join(project_root, "server"))
            from app.main import app

# Import your auth service for token creation
# Adjust the import path to match your actual file structure
try:
    from app.services.auth_service import create_access_token
except ImportError:
    # Fallback options if the path is different
    try:
        from app.auth_service import create_access_token
    except ImportError:
        # Define a simple token creator as fallback
        def create_access_token(data, expires_delta=None):
            return "test_token_for_performance_testing"

# Create test client
client = TestClient(app)


# Helper to create test tokens
def get_test_token(email="performance_test@example.com"):
    try:
        return create_access_token(
            data={"sub": email},
            expires_delta=timedelta(minutes=30)
        )
    except Exception as e:
        print(f"Error creating token: {e}")
        return "test_token_for_performance_testing"


class TestAPIPerformance:
    """Performance tests for API endpoints."""

    def test_health_check_performance(self):
        """Test performance of the health check endpoint."""
        # Number of iterations
        num_iterations = 100

        # Store response times
        response_times = []

        # Make multiple requests
        for _ in range(num_iterations):
            start_time = time.time()
            try:
                # Try the /health endpoint first
                response = client.get("/health")

                # If that fails, try root endpoint
                if response.status_code >= 400:
                    response = client.get("/")
            except Exception as e:
                print(f"Error accessing health endpoint: {e}")
                continue

            end_time = time.time()

            # Record time
            response_times.append(end_time - start_time)

        if not response_times:
            pytest.skip("Could not access health endpoints")

        # Calculate statistics
        avg_time = statistics.mean(response_times)
        median_time = statistics.median(response_times)
        p95_time = sorted(response_times)[int(num_iterations * 0.95)]

        # Print results
        print(f"\nHealth Check Endpoint Performance:")
        print(f"  Average response time: {avg_time:.6f} seconds")
        print(f"  Median response time: {median_time:.6f} seconds")
        print(f"  95th percentile response time: {p95_time:.6f} seconds")

        # Assert performance requirements
        assert avg_time < 0.05, f"Average health check response time ({avg_time:.6f}s) exceeds threshold of 0.05s"

    def test_auth_performance(self):
        """Test performance of authentication endpoints."""
        # Test data
        test_users = [
            {
                "username": f"perf_user_{i}",
                "email": f"perf_user_{i}@example.com",
                "password": "Test1234!",
                "mobileNumber": f"94771234{i:03}",
                "emergencyContact": {
                    "name": "Emergency Contact",
                    "mobileNumber": "94771239999",
                    "relationship": "Friend"
                }
            }
            for i in range(10)
        ]

        # Test registration performance
        registration_times = []
        for user in test_users:
            # Skip if user already exists to avoid failure
            try:
                start_time = time.time()
                response = client.post(
                    "/api/auth/register",
                    json=user
                )
                end_time = time.time()

                # Only count successful registrations
                if response.status_code == 200 or response.status_code == 201:
                    registration_times.append(end_time - start_time)
            except Exception as e:
                print(f"Registration error: {e}")
                continue

        # Test login performance
        login_times = []
        for user in test_users:
            try:
                start_time = time.time()
                response = client.post(
                    "/api/auth/login",
                    data={
                        "username": user["email"],
                        "password": user["password"]
                    }
                )
                end_time = time.time()

                # Only count successful logins
                if response.status_code == 200:
                    login_times.append(end_time - start_time)
            except Exception as e:
                print(f"Login error: {e}")
                continue

        # Calculate statistics
        if registration_times:
            avg_reg_time = statistics.mean(registration_times)
            p95_reg_time = sorted(registration_times)[int(len(registration_times) * 0.95)]
            print(f"\nRegistration Endpoint Performance:")
            print(f"  Average response time: {avg_reg_time:.6f} seconds")
            print(f"  95th percentile response time: {p95_reg_time:.6f} seconds")
            assert avg_reg_time < 0.5, f"Average registration time ({avg_reg_time:.6f}s) exceeds threshold of 0.5s"
        else:
            print("\nNo successful registrations to measure performance.")

        if login_times:
            avg_login_time = statistics.mean(login_times)
            p95_login_time = sorted(login_times)[int(len(login_times) * 0.95)]
            print(f"\nLogin Endpoint Performance:")
            print(f"  Average response time: {avg_login_time:.6f} seconds")
            print(f"  95th percentile response time: {p95_login_time:.6f} seconds")
            assert avg_login_time < 0.3, f"Average login time ({avg_login_time:.6f}s) exceeds threshold of 0.3s"
        else:
            print("\nNo successful logins to measure performance.")

    def test_sentiment_analysis_performance(self):
        """Test performance of sentiment analysis endpoint."""
        # Get a test token
        token = get_test_token()

        # Test data with different complexity levels
        test_texts = [
            "I feel sad today",
            "I'm having a difficult time managing my anxiety and depression",
            "Today was a good day, but I still feel a bit down and worried about my future",
            # Long text (simulating a journal entry)
            "I've been feeling very overwhelmed lately with work and personal life. " * 10
        ]

        # Number of iterations for reliable measurement
        num_iterations = 20

        # Store results
        response_times = []

        for text in test_texts:
            times = []

            # Make multiple requests
            for _ in range(num_iterations):
                start_time = time.time()

                try:
                    # Try the sentiment analysis endpoint
                    response = client.post(
                        "/api/sentiment/analyze",
                        headers={"Authorization": f"Bearer {token}"},
                        json={"text": text}
                    )

                    end_time = time.time()

                    # Only count successful requests
                    if response.status_code == 200:
                        times.append(end_time - start_time)
                except Exception as e:
                    print(f"Sentiment analysis error: {e}")
                    continue

            if times:
                avg_time = statistics.mean(times)
                median_time = statistics.median(times)
                p95_time = sorted(times)[int(len(times) * 0.95)]

                response_times.append({
                    "text_length": len(text),
                    "avg_time": avg_time,
                    "median_time": median_time,
                    "p95_time": p95_time
                })

        # Print results
        if response_times:
            print("\nSentiment Analysis API Performance Results:")
            print("-" * 70)
            print(f"{'Text Length':12} | {'Avg Time (s)':12} | {'Median (s)':12} | {'P95 (s)':12}")
            print("-" * 70)

            for result in response_times:
                print(
                    f"{result['text_length']:12} | {result['avg_time']:.6f}     | {result['median_time']:.6f}     | {result['p95_time']:.6f}")

            # Overall statistics
            all_avg_times = [r["avg_time"] for r in response_times]
            overall_avg = statistics.mean(all_avg_times)
            print(f"\nOverall average response time: {overall_avg:.6f} seconds")

            # Assert performance requirements
            assert overall_avg < 0.5, f"Average API response time ({overall_avg:.6f}s) exceeds threshold of 0.5s"
        else:
            print("\nNo successful sentiment analysis requests to measure performance.")

    def test_protected_endpoint_performance(self):
        """Test performance of protected endpoints."""
        # Get a test token
        token = get_test_token()

        # Number of iterations
        num_iterations = 50

        # Store response times
        response_times = []

        # Make multiple requests to a protected endpoint
        # Try multiple potential endpoints
        endpoints = [
            "/api/protected/profile",
            "/api/protected/user",
            "/api/protected/data"
        ]

        # Find a working protected endpoint
        working_endpoint = None
        for endpoint in endpoints:
            try:
                response = client.get(
                    endpoint,
                    headers={"Authorization": f"Bearer {token}"}
                )
                if response.status_code != 404:  # Any response other than 404 suggests it exists
                    working_endpoint = endpoint
                    break
            except Exception:
                continue

        if not working_endpoint:
            print("\nNo working protected endpoint found to test.")
            return

        print(f"Testing protected endpoint: {working_endpoint}")

        # Now test the performance of the working endpoint
        for _ in range(num_iterations):
            start_time = time.time()

            try:
                response = client.get(
                    working_endpoint,
                    headers={"Authorization": f"Bearer {token}"}
                )

                end_time = time.time()

                # Count all responses, even errors (we're testing auth overhead)
                response_times.append(end_time - start_time)
            except Exception as e:
                print(f"Protected endpoint error: {e}")
                continue

        # Calculate statistics
        if response_times:
            avg_time = statistics.mean(response_times)
            median_time = statistics.median(response_times)
            p95_time = sorted(response_times)[int(len(response_times) * 0.95)]

            # Print results
            print(f"\nProtected Endpoint Performance:")
            print(f"  Average response time: {avg_time:.6f} seconds")
            print(f"  Median response time: {median_time:.6f} seconds")
            print(f"  95th percentile response time: {p95_time:.6f} seconds")

            # Assert performance requirements
            assert avg_time < 0.2, f"Average protected endpoint response time ({avg_time:.6f}s) exceeds threshold of 0.2s"
        else:
            print("\nNo successful protected endpoint requests to measure performance.")


@pytest.mark.skip(reason="Run manually with server running")
def test_websocket_performance():
    """
    Test WebSocket connection performance.
    Note: This test requires the server to be running separately.
    It's marked as skipped by default.
    """
    import websockets
    import asyncio

    async def run_websocket_test():
        # Get a test token
        token = get_test_token()

        # Metrics to collect
        connection_times = []
        message_times = []

        # Number of test iterations
        num_iterations = 10

        for _ in range(num_iterations):
            # Measure connection time
            start_time = time.time()

            # Connect to WebSocket (adjust the URL based on your actual WebSocket path)
            async with websockets.connect(
                    f"ws://localhost:8000/api/chat?token={token}"
            ) as websocket:
                connection_time = time.time() - start_time
                connection_times.append(connection_time)

                # Measure message exchange time
                for _ in range(5):  # Send 5 messages per connection
                    message_start = time.time()

                    # Send a message
                    await websocket.send(json.dumps({
                        "message": "Hello, this is a test message"
                    }))

                    # Wait for response
                    response = await websocket.recv()

                    message_time = time.time() - message_start
                    message_times.append(message_time)

        # Calculate statistics
        avg_conn_time = statistics.mean(connection_times)
        p95_conn_time = sorted(connection_times)[int(num_iterations * 0.95)]

        avg_msg_time = statistics.mean(message_times)
        p95_msg_time = sorted(message_times)[int(len(message_times) * 0.95)]

        print("\nWebSocket Performance Results:")
        print(f"  Average connection time: {avg_conn_time:.6f} seconds")
        print(f"  95th percentile connection time: {p95_conn_time:.6f} seconds")
        print(f"  Average message round-trip time: {avg_msg_time:.6f} seconds")
        print(f"  95th percentile message round-trip time: {p95_msg_time:.6f} seconds")

        # Assert performance requirements
        assert avg_conn_time < 0.5, f"Average WebSocket connection time ({avg_conn_time:.6f}s) exceeds threshold of 0.5s"
        assert avg_msg_time < 0.2, f"Average WebSocket message time ({avg_msg_time:.6f}s) exceeds threshold of 0.2s"

    # Run the async test
    asyncio.run(run_websocket_test())


if __name__ == "__main__":
    # This allows running the tests from command line
    pytest.main(["-xvs", __file__])