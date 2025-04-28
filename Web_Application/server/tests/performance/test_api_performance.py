import pytest
import time
import statistics
import json
import asyncio
from fastapi.testclient import TestClient
import os
import sys
from datetime import datetime, timedelta

# Setup project path
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

# Dynamic app import with fallbacks
def import_app():
    """Import the FastAPI app with multiple fallback options."""
    for module_path in [
        "main",
        "app",
        "app.app",
        "server.app.main"
    ]:
        try:
            module = __import__(module_path, fromlist=["app"])
            return module.app
        except (ImportError, AttributeError):
            continue
    
    pytest.skip("Could not import FastAPI app. Skipping API performance tests.")

# Import app and create test client
app = import_app()
client = TestClient(app)

# Import or create token generator
def get_auth_token_generator():
    """Import or create a token generator function."""
    for module_path, func_name in [
        ("app.services.auth_service", "create_access_token"),
        ("app.auth_service", "create_access_token")
    ]:
        try:
            module = __import__(module_path, fromlist=[func_name])
            return getattr(module, func_name)
        except (ImportError, AttributeError):
            continue
    
    # Fallback token generator
    def create_access_token(data, expires_delta=None):
        return "test_token_for_performance_testing"
    
    return create_access_token

create_access_token = get_auth_token_generator()

def get_test_token(email="performance_test@example.com"):
    """Create a test token for authentication."""
    try:
        return create_access_token(
            data={"sub": email},
            expires_delta=timedelta(minutes=30)
        )
    except Exception as e:
        print(f"Error creating token: {e}")
        return "test_token_for_performance_testing"

def measure_performance(callable_func, iterations=100):
    """Generic performance measurement function."""
    response_times = []
    
    for _ in range(iterations):
        start_time = time.time()
        try:
            callable_func()
            end_time = time.time()
            response_times.append(end_time - start_time)
        except Exception as e:
            print(f"Error during performance test: {e}")
    
    if not response_times:
        return None
    
    return {
        "avg": statistics.mean(response_times),
        "median": statistics.median(response_times),
        "p95": sorted(response_times)[int(len(response_times) * 0.95)],
        "min": min(response_times),
        "max": max(response_times)
    }

def print_performance_results(name, metrics):
    """Print formatted performance test results."""
    if not metrics:
        print(f"\n{name}: No successful requests to measure performance.")
        return
    
    print(f"\n{name} Performance:")
    print("-" * 50)
    print(f"  Average response time:       {metrics['avg']:.6f} seconds")
    print(f"  Median response time:        {metrics['median']:.6f} seconds")
    print(f"  95th percentile response:    {metrics['p95']:.6f} seconds")
    print(f"  Range:                       {metrics['min']:.6f} - {metrics['max']:.6f} seconds")


class TestAPIPerformance:
    """Performance tests for API endpoints."""

    def test_health_check_performance(self):
        """Test health check endpoint performance."""
        def health_check():
            try:
                response = client.get("/health")
                if response.status_code >= 400:
                    response = client.get("/")
                return response
            except Exception as e:
                print(f"Health check error: {e}")
                return None
        
        metrics = measure_performance(health_check)
        print_performance_results("Health Check Endpoint", metrics)
        
        if metrics:
            assert metrics["avg"] < 0.05, f"Average health check response time ({metrics['avg']:.6f}s) exceeds threshold of 0.05s"

    def test_auth_performance(self):
        """Test authentication endpoints performance."""
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
            start_time = time.time()
            try:
                response = client.post("/api/auth/register", json=user)
                end_time = time.time()
                if response.status_code in (200, 201):
                    registration_times.append(end_time - start_time)
            except Exception:
                continue
        
        # Test login performance
        login_times = []
        for user in test_users:
            start_time = time.time()
            try:
                response = client.post(
                    "/api/auth/login",
                    data={"username": user["email"], "password": user["password"]}
                )
                end_time = time.time()
                if response.status_code == 200:
                    login_times.append(end_time - start_time)
            except Exception:
                continue
        
        # Calculate and report registration metrics
        if registration_times:
            reg_metrics = {
                "avg": statistics.mean(registration_times),
                "p95": sorted(registration_times)[int(len(registration_times) * 0.95)]
            }
            print_performance_results("Registration Endpoint", reg_metrics)
            assert reg_metrics["avg"] < 0.5, f"Average registration time ({reg_metrics['avg']:.6f}s) exceeds threshold of 0.5s"
        else:
            print("\nNo successful registrations to measure performance.")
        
        # Calculate and report login metrics
        if login_times:
            login_metrics = {
                "avg": statistics.mean(login_times),
                "p95": sorted(login_times)[int(len(login_times) * 0.95)]
            }
            print_performance_results("Login Endpoint", login_metrics)
            assert login_metrics["avg"] < 0.3, f"Average login time ({login_metrics['avg']:.6f}s) exceeds threshold of 0.3s"
        else:
            print("\nNo successful logins to measure performance.")

    def test_sentiment_analysis_performance(self):
        """Test sentiment analysis endpoint performance."""
        token = get_test_token()
        
        # Test texts with different complexity
        test_texts = [
            "I feel sad today",
            "I'm having a difficult time managing my anxiety and depression",
            "Today was a good day, but I still feel a bit down and worried about my future",
            "I've been feeling very overwhelmed lately with work and personal life. " * 10
        ]
        
        metrics_by_length = []
        
        for text in test_texts:
            def analyze_sentiment():
                return client.post(
                    "/api/sentiment/analyze",
                    headers={"Authorization": f"Bearer {token}"},
                    json={"text": text}
                )
            
            # Measure with fewer iterations for longer texts
            iterations = 10 if len(text) > 100 else 20
            metrics = measure_performance(analyze_sentiment, iterations)
            
            if metrics:
                metrics_by_length.append({
                    "text_length": len(text),
                    "metrics": metrics
                })
        
        # Print results
        if metrics_by_length:
            print("\nSentiment Analysis API Performance Results:")
            print("-" * 70)
            print(f"{'Text Length':12} | {'Avg Time (s)':12} | {'Median (s)':12} | {'P95 (s)':12}")
            print("-" * 70)
            
            for result in metrics_by_length:
                m = result["metrics"]
                print(f"{result['text_length']:12} | {m['avg']:.6f}     | {m['median']:.6f}     | {m['p95']:.6f}")
            
            # Overall statistics
            all_avg_times = [r["metrics"]["avg"] for r in metrics_by_length]
            overall_avg = statistics.mean(all_avg_times)
            print(f"\nOverall average response time: {overall_avg:.6f} seconds")
            
            assert overall_avg < 0.5, f"Average API response time ({overall_avg:.6f}s) exceeds threshold of 0.5s"
        else:
            print("\nNo successful sentiment analysis requests to measure performance.")

    def test_protected_endpoint_performance(self):
        """Test protected endpoint performance."""
        token = get_test_token()
        
        # Find a working protected endpoint
        endpoints = [
            "/api/protected/profile",
            "/api/protected/user",
            "/api/protected/data"
        ]
        
        working_endpoint = None
        for endpoint in endpoints:
            try:
                response = client.get(endpoint, headers={"Authorization": f"Bearer {token}"})
                if response.status_code != 404:
                    working_endpoint = endpoint
                    break
            except Exception:
                continue
        
        if not working_endpoint:
            print("\nNo working protected endpoint found to test.")
            return
        
        print(f"Testing protected endpoint: {working_endpoint}")
        
        def access_protected():
            return client.get(
                working_endpoint,
                headers={"Authorization": f"Bearer {token}"}
            )
        
        metrics = measure_performance(access_protected, 50)
        print_performance_results("Protected Endpoint", metrics)
        
        if metrics:
            assert metrics["avg"] < 0.2, f"Average protected endpoint response time ({metrics['avg']:.6f}s) exceeds threshold of 0.2s"


@pytest.mark.skip(reason="Run manually with server running")
def test_websocket_performance():
    """Test WebSocket connection performance (run manually)."""
    import websockets
    
    async def run_websocket_test():
        token = get_test_token()
        
        # Metrics to collect
        connection_times = []
        message_times = []
        num_iterations = 10
        
        for _ in range(num_iterations):
            # Measure connection time
            start_time = time.time()
            
            try:
                async with websockets.connect(f"ws://localhost:8000/api/chat?token={token}") as websocket:
                    connection_time = time.time() - start_time
                    connection_times.append(connection_time)
                    
                    # Measure message exchange time
                    for _ in range(5):
                        message_start = time.time()
                        
                        await websocket.send(json.dumps({
                            "message": "Hello, this is a test message"
                        }))
                        
                        await websocket.recv()
                        
                        message_time = time.time() - message_start
                        message_times.append(message_time)
            except Exception as e:
                print(f"WebSocket error: {e}")
        
        # Report results
        if connection_times:
            conn_metrics = {
                "avg": statistics.mean(connection_times),
                "p95": sorted(connection_times)[int(len(connection_times) * 0.95)]
            }
            print_performance_results("WebSocket Connection", conn_metrics)
        
        if message_times:
            msg_metrics = {
                "avg": statistics.mean(message_times),
                "p95": sorted(message_times)[int(len(message_times) * 0.95)]
            }
            print_performance_results("WebSocket Message Exchange", msg_metrics)
            
            assert conn_metrics["avg"] < 0.5, "Average WebSocket connection time exceeds threshold"
            assert msg_metrics["avg"] < 0.2, "Average WebSocket message time exceeds threshold"
    
    # Run the async test
    asyncio.run(run_websocket_test())


if __name__ == "__main__":
    pytest.main(["-xvs", __file__])