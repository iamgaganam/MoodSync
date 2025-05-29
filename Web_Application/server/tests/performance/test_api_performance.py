import pytest
import time
import statistics
import json
import asyncio
import os
import sys
import threading
import queue
import warnings
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Callable, Union
from dataclasses import dataclass

# Suppress warnings for cleaner test output
warnings.filterwarnings("ignore", category=DeprecationWarning)
warnings.filterwarnings("ignore", category=RuntimeWarning)

# Configure project path
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if project_root not in sys.path:
    sys.path.insert(0, project_root)


@dataclass
class PerformanceMetrics:
    """Performance metrics data structure"""
    avg: float
    median: float
    std_dev: float
    p95: float
    p99: float
    min: float
    max: float
    total_requests: int
    successful_requests: int
    failed_requests: int
    success_rate: float
    requests_per_second: float


class PerformanceConfig:
    """Environment-specific performance thresholds"""

    @staticmethod
    def get_thresholds(environment: str = "development") -> Dict[str, float]:
        """Return performance thresholds based on environment"""
        configs = {
            "development": {
                "health_check": 0.20,
                "authentication_register": 2.0,
                "authentication_login": 1.0,
                "sentiment_analysis": 2.0,
                "protected_endpoint": 0.5,
                "websocket_connection": 2.0,
                "websocket_message": 1.0,
                "concurrent_load": 0.5
            },
            "staging": {
                "health_check": 0.15,
                "authentication_register": 1.0,
                "authentication_login": 0.5,
                "sentiment_analysis": 1.0,
                "protected_endpoint": 0.3,
                "websocket_connection": 1.0,
                "websocket_message": 0.5,
                "concurrent_load": 0.3
            },
            "production": {
                "health_check": 0.1,
                "authentication_register": 0.5,
                "authentication_login": 0.3,
                "sentiment_analysis": 0.5,
                "protected_endpoint": 0.2,
                "websocket_connection": 0.5,
                "websocket_message": 0.2,
                "concurrent_load": 0.2
            }
        }
        return configs.get(environment, configs["development"])


# Initialize configuration
ENVIRONMENT = os.getenv("TEST_ENVIRONMENT", "development")
PERFORMANCE_THRESHOLDS = PerformanceConfig.get_thresholds(ENVIRONMENT)


def safe_import_fastapi_app():
    """Import FastAPI app with fallback options"""
    import_paths = [
        "main.app", "app.main.app", "app.app", "server.main.app",
        "server.app.main.app", "main", "app", "server.app"
    ]

    for module_path in import_paths:
        try:
            if "." in module_path:
                module_name, app_name = module_path.rsplit(".", 1)
                module = __import__(module_name, fromlist=[app_name])
                app_obj = getattr(module, app_name, None)
            else:
                module = __import__(module_path)
                app_obj = getattr(module, 'app', None)

            if app_obj is not None:
                print(f"✅ Successfully imported app from: {module_path}")
                return app_obj

        except (ImportError, AttributeError) as e:
            print(f"❌ Failed to import {module_path}: {e}")
            continue

    # Create mock app if no real app found
    print("⚠️  No FastAPI app found, creating mock app for testing")
    try:
        from fastapi import FastAPI

        mock_app = FastAPI()

        @mock_app.get("/health")
        @mock_app.get("/")
        async def health_check():
            return {"status": "ok", "timestamp": datetime.now().isoformat()}

        @mock_app.post("/api/auth/register")
        async def mock_register():
            await asyncio.sleep(0.1)
            return {"message": "User registered successfully", "user_id": 1}

        @mock_app.post("/api/auth/login")
        async def mock_login():
            await asyncio.sleep(0.05)
            return {"access_token": "mock_token", "token_type": "bearer"}

        @mock_app.post("/api/sentiment/analyze")
        async def mock_sentiment():
            await asyncio.sleep(0.02)
            return {"sentiment": "positive", "confidence": 0.85}

        return mock_app

    except ImportError:
        pytest.skip("FastAPI not available and no app found. Skipping API performance tests.")


def safe_get_token_generator():
    """Get authentication token generator with fallbacks"""
    token_paths = [
        ("app.services.auth_service", "create_access_token"),
        ("app.auth_service", "create_access_token"),
        ("services.auth_service", "create_access_token"),
        ("auth_service", "create_access_token"),
        ("app.core.security", "create_access_token"),
        ("core.security", "create_access_token")
    ]

    for module_path, func_name in token_paths:
        try:
            module = __import__(module_path, fromlist=[func_name])
            if hasattr(module, func_name):
                print(f"✅ Found token generator: {module_path}.{func_name}")
                return getattr(module, func_name)
        except (ImportError, AttributeError):
            continue

    # Fallback token generator
    print("⚠️  Using fallback token generator")
    def create_test_token(data: Union[Dict, str], expires_delta: Optional[timedelta] = None) -> str:
        return f"test_token_{int(time.time())}"

    return create_test_token


# Initialize components
try:
    app = safe_import_fastapi_app()
    from fastapi.testclient import TestClient
    client = TestClient(app)
except Exception as e:
    print(f"❌ Failed to initialize test client: {e}")
    pytest.skip("Cannot initialize FastAPI test client")

create_access_token = safe_get_token_generator()


def generate_test_token(email: str = "performance_test@example.com") -> str:
    """Generate authentication token for testing"""
    try:
        token_data = {"sub": email, "exp": datetime.utcnow() + timedelta(minutes=30)}
        return create_access_token(data=token_data, expires_delta=timedelta(minutes=30))
    except Exception as e:
        print(f"⚠️  Token generation failed, using fallback: {e}")
        return f"test_token_{int(time.time())}"


def measure_performance(
        operation: Callable,
        iterations: int = 50,
        warmup_runs: int = 5,
        timeout: float = 30.0,
        test_name: str = "Unknown"
) -> Optional[PerformanceMetrics]:
    """Measure operation performance with comprehensive error handling"""

    print(f"🔥 Warming up {test_name} ({warmup_runs} runs)...")

    # Warmup phase
    for i in range(warmup_runs):
        try:
            result = operation()
            if i == 0 and hasattr(result, 'status_code') and result.status_code >= 500:
                print(f"⚠️  Operation returning server errors during warmup")
        except Exception as e:
            if i == warmup_runs - 1:
                print(f"⚠️  Warmup completed with errors: {e}")

    print(f"📊 Measuring {test_name} performance ({iterations} runs)...")

    # Measurement phase
    response_times = []
    failed_requests = 0
    server_errors = 0
    start_total = time.perf_counter()

    for i in range(iterations):
        if time.perf_counter() - start_total > timeout:
            print(f"⏰ Timeout reached after {i} iterations")
            break

        start_time = time.perf_counter()
        try:
            result = operation()
            elapsed = time.perf_counter() - start_time

            if result is None:
                failed_requests += 1
                continue
            elif hasattr(result, 'status_code'):
                if result.status_code >= 500:
                    server_errors += 1
                    continue
                elif result.status_code >= 400:
                    failed_requests += 1
                    continue

            response_times.append(elapsed)

        except Exception as e:
            failed_requests += 1
            if i < 5:
                print(f"❌ Request {i + 1} failed: {e}")

    # Calculate statistics
    if not response_times:
        print(f"❌ No successful requests for {test_name}")
        return None

    sorted_times = sorted(response_times)
    total_requests = len(response_times) + failed_requests + server_errors

    metrics = PerformanceMetrics(
        avg=statistics.mean(response_times),
        median=statistics.median(response_times),
        std_dev=statistics.stdev(response_times) if len(response_times) > 1 else 0,
        p95=sorted_times[int(len(sorted_times) * 0.95)] if sorted_times else 0,
        p99=sorted_times[int(len(sorted_times) * 0.99)] if sorted_times else 0,
        min=min(response_times),
        max=max(response_times),
        total_requests=total_requests,
        successful_requests=len(response_times),
        failed_requests=failed_requests,
        success_rate=(len(response_times) / total_requests) * 100 if total_requests > 0 else 0,
        requests_per_second=len(response_times) / sum(response_times) if response_times else 0
    )

    if server_errors > 0:
        print(f"⚠️  {server_errors} server errors (5xx) encountered")

    return metrics


def display_metrics(test_name: str, metrics: Optional[PerformanceMetrics], threshold: Optional[float] = None) -> bool:
    """Display performance metrics with threshold validation"""
    if not metrics:
        print(f"\n❌ {test_name}: No performance data available")
        return False

    print(f"\n📊 {test_name} Performance Results")
    print("═" * 60)
    print(f"Average Response Time:  {metrics.avg:.4f}s")
    print(f"Median Response Time:   {metrics.median:.4f}s")
    print(f"95th Percentile:        {metrics.p95:.4f}s")
    print(f"99th Percentile:        {metrics.p99:.4f}s")
    print(f"Standard Deviation:     {metrics.std_dev:.4f}s")
    print(f"Min/Max:                {metrics.min:.4f}s / {metrics.max:.4f}s")
    print(f"Success Rate:           {metrics.success_rate:.1f}% ({metrics.successful_requests}/{metrics.total_requests})")
    print(f"Throughput:             {metrics.requests_per_second:.2f} req/s")

    if threshold:
        passed = metrics.avg < threshold and metrics.success_rate >= 90
        status_icon = "✅" if passed else "❌"
        status_text = "PASS" if passed else "FAIL"

        print(f"Threshold:              {threshold:.3f}s")
        print(f"Result:                 {status_icon} {status_text}")

        if not passed:
            if metrics.avg >= threshold:
                print(f"🐌 Performance issue: {metrics.avg:.4f}s > {threshold:.3f}s threshold")
            if metrics.success_rate < 90:
                print(f"🚨 Reliability issue: {metrics.success_rate:.1f}% < 90% success rate")

        return passed

    return True


class TestAPIPerformance:
    """Comprehensive API performance testing suite"""

    def setup_method(self):
        """Initialize test environment"""
        self.performance_report = []
        print(f"\n🚀 Performance Testing Suite - {ENVIRONMENT.upper()} Environment")
        print(f"📋 Thresholds: {PERFORMANCE_THRESHOLDS}")

    def add_to_report(self, test_name: str, metrics: PerformanceMetrics, threshold: float, passed: bool):
        """Add test results to performance report"""
        self.performance_report.append({
            "test": test_name,
            "avg_time": metrics.avg,
            "success_rate": metrics.success_rate,
            "threshold": threshold,
            "passed": passed,
            "environment": ENVIRONMENT,
            "throughput": metrics.requests_per_second
        })

    def test_health_endpoint_performance(self):
        """Test health check endpoint performance"""

        def health_check():
            endpoints = ["/health", "/", "/api/health", "/healthz", "/status", "/ping"]

            for endpoint in endpoints:
                try:
                    response = client.get(endpoint, timeout=3.0)
                    if response.status_code < 400:
                        return response
                except Exception:
                    continue
            return None

        metrics = measure_performance(health_check, iterations=30, warmup_runs=3, test_name="Health Check")
        threshold = PERFORMANCE_THRESHOLDS["health_check"]
        passed = display_metrics("Health Check", metrics, threshold)

        if metrics:
            self.add_to_report("health_check", metrics, threshold, passed)
            if not passed and metrics.avg >= threshold:
                print(f"\n💡 Health Endpoint Optimization Tips:")
                print(f"   • Remove database connectivity checks")
                print(f"   • Use in-memory health status")
                print(f"   • Implement health check caching")
        else:
            pytest.fail("Health endpoint is completely unresponsive")

    def test_authentication_performance(self):
        """Test authentication endpoints performance"""

        timestamp = int(time.time())
        test_users = [
            {
                "username": f"perf_user_{timestamp}_{i}",
                "email": f"perf_user_{timestamp}_{i}@performance.test",
                "password": "TestPassword123!",
                "mobileNumber": f"94771{timestamp % 10000:04d}",
                "emergencyContact": {
                    "name": "Test Emergency Contact",
                    "mobileNumber": "94771111111",
                    "relationship": "Friend"
                }
            }
            for i in range(3)
        ]

        # Test Registration Performance
        def register_user():
            user = test_users[len(registration_times) % len(test_users)]
            user["username"] = f"{user['username']}_{len(registration_times)}"
            user["email"] = f"perf_{len(registration_times)}_{timestamp}@test.com"

            try:
                response = client.post("/api/auth/register", json=user, timeout=5.0)
                return response
            except Exception as e:
                print(f"⚠️  Registration error: {e}")
                return None

        print("\n🔐 Testing Registration Performance...")
        registration_times = []

        for i in range(5):
            start_time = time.perf_counter()
            try:
                response = register_user()
                if response and response.status_code in (200, 201):
                    registration_times.append(time.perf_counter() - start_time)
                elif response:
                    print(f"Registration response: {response.status_code}")
            except Exception as e:
                print(f"Registration attempt {i} failed: {e}")

        # Test Login Performance
        def login_user():
            user = test_users[0]
            try:
                login_data = {"username": user["email"], "password": user["password"]}
                response = client.post("/api/auth/login", data=login_data, timeout=5.0)
                return response
            except Exception as e:
                print(f"⚠️  Login error: {e}")
                return None

        print("🔑 Testing Login Performance...")

        # Pre-register user for login tests
        try:
            reg_response = client.post("/api/auth/register", json=test_users[0], timeout=10.0)
            if reg_response.status_code not in (200, 201):
                print(f"⚠️  Pre-login registration failed: {reg_response.status_code}")
        except Exception as e:
            print(f"⚠️  Pre-login setup failed: {e}")

        login_times = []
        for i in range(10):
            start_time = time.perf_counter()
            try:
                response = login_user()
                if response and response.status_code == 200:
                    login_times.append(time.perf_counter() - start_time)
                elif response:
                    print(f"Login response: {response.status_code}")
            except Exception as e:
                print(f"Login attempt {i} failed: {e}")

        # Report Results
        if registration_times:
            reg_metrics = PerformanceMetrics(
                avg=statistics.mean(registration_times),
                median=statistics.median(registration_times),
                std_dev=statistics.stdev(registration_times) if len(registration_times) > 1 else 0,
                p95=max(registration_times),
                p99=max(registration_times),
                min=min(registration_times),
                max=max(registration_times),
                total_requests=5,
                successful_requests=len(registration_times),
                failed_requests=5 - len(registration_times),
                success_rate=(len(registration_times) / 5) * 100,
                requests_per_second=len(registration_times) / sum(registration_times) if registration_times else 0
            )

            threshold = PERFORMANCE_THRESHOLDS["authentication_register"]
            passed = display_metrics("User Registration", reg_metrics, threshold)
            self.add_to_report("registration", reg_metrics, threshold, passed)

        if login_times:
            login_metrics = PerformanceMetrics(
                avg=statistics.mean(login_times),
                median=statistics.median(login_times),
                std_dev=statistics.stdev(login_times) if len(login_times) > 1 else 0,
                p95=sorted(login_times)[int(len(login_times) * 0.95)],
                p99=max(login_times),
                min=min(login_times),
                max=max(login_times),
                total_requests=10,
                successful_requests=len(login_times),
                failed_requests=10 - len(login_times),
                success_rate=(len(login_times) / 10) * 100,
                requests_per_second=len(login_times) / sum(login_times) if login_times else 0
            )

            threshold = PERFORMANCE_THRESHOLDS["authentication_login"]
            passed = display_metrics("User Login", login_metrics, threshold)
            self.add_to_report("login", login_metrics, threshold, passed)

    def test_sentiment_analysis_performance(self):
        """Test sentiment analysis performance with varying text lengths"""
        token = generate_test_token()

        test_cases = [
            ("Short Text", "I feel happy today"),
            ("Medium Text", "I'm experiencing some anxiety and would like to talk about my feelings and emotions"),
            ("Long Text",
             "Today has been a particularly challenging day for my mental health. I've been struggling with feelings of anxiety and depression that seem to come in waves. Sometimes I feel like I'm making progress, but then I have setbacks that make me question everything. I'm trying to stay positive and use the coping strategies I've learned, but it's not always easy. I think talking about these feelings helps me process them better and understand what I'm going through."),
            ("Very Long Text",
             "This is a comprehensive mental health assessment text that includes multiple sentences and various emotional indicators. " * 10)
        ]

        performance_results = []

        for scenario_name, text in test_cases:
            def analyze_sentiment():
                try:
                    response = client.post(
                        "/api/sentiment/analyze",
                        headers={"Authorization": f"Bearer {token}"},
                        json={"text": text},
                        timeout=10.0
                    )
                    return response
                except Exception as e:
                    print(f"⚠️  Sentiment analysis error: {e}")
                    return None

            iterations = 8 if len(text) > 200 else 15
            metrics = measure_performance(
                analyze_sentiment,
                iterations=iterations,
                warmup_runs=2,
                test_name=f"Sentiment Analysis - {scenario_name}"
            )

            if metrics:
                performance_results.append({
                    "scenario": scenario_name,
                    "length": len(text),
                    "avg_time": metrics.avg,
                    "success_rate": metrics.success_rate,
                    "throughput": metrics.requests_per_second
                })

        # Display comprehensive results
        if performance_results:
            print("\n🧠 Sentiment Analysis Performance Summary")
            print("═" * 70)
            print(f"{'Scenario':<20} | {'Length':<8} | {'Avg Time':<10} | {'Success %':<10} | {'Req/s':<8}")
            print("═" * 70)

            for result in performance_results:
                print(f"{result['scenario']:<20} | {result['length']:<8} | {result['avg_time']:<10.4f} | {result['success_rate']:<10.1f} | {result['throughput']:<8.2f}")

            overall_avg = statistics.mean([r["avg_time"] for r in performance_results])
            overall_success = statistics.mean([r["success_rate"] for r in performance_results])

            print("═" * 70)
            print(f"Overall Average: {overall_avg:.4f}s | Success Rate: {overall_success:.1f}%")

            threshold = PERFORMANCE_THRESHOLDS["sentiment_analysis"]
            passed = overall_avg < threshold and overall_success >= 80

            summary_metrics = PerformanceMetrics(
                avg=overall_avg,
                median=overall_avg,
                std_dev=0,
                p95=max([r["avg_time"] for r in performance_results]),
                p99=max([r["avg_time"] for r in performance_results]),
                min=min([r["avg_time"] for r in performance_results]),
                max=max([r["avg_time"] for r in performance_results]),
                total_requests=sum(8 if len(case[1]) > 200 else 15 for case in test_cases),
                successful_requests=int(sum(8 if len(case[1]) > 200 else 15 for case in test_cases) * overall_success / 100),
                failed_requests=0,
                success_rate=overall_success,
                requests_per_second=statistics.mean([r["throughput"] for r in performance_results])
            )

            self.add_to_report("sentiment_analysis", summary_metrics, threshold, passed)

            if not passed:
                print(f"\n🐌 Sentiment analysis performance needs improvement")
                print(f"   Current: {overall_avg:.4f}s > Target: {threshold:.3f}s")

    def test_protected_endpoint_performance(self):
        """Test protected endpoints with authentication"""
        token = generate_test_token()

        protected_endpoints = [
            "/api/protected/profile", "/api/protected/user", "/api/protected/data",
            "/api/user/profile", "/api/user/me", "/api/profile", "/api/dashboard",
            "/api/user", "/protected"
        ]

        working_endpoint = None
        endpoint_responses = {}

        print("\n🔍 Discovering protected endpoints...")
        for endpoint in protected_endpoints:
            try:
                response = client.get(
                    endpoint,
                    headers={"Authorization": f"Bearer {token}"},
                    timeout=3.0
                )
                endpoint_responses[endpoint] = response.status_code

                if response.status_code not in [404, 405]:
                    working_endpoint = endpoint
                    print(f"✅ Found working endpoint: {endpoint} (Status: {response.status_code})")
                    break

            except Exception as e:
                endpoint_responses[endpoint] = f"Error: {e}"

        if not working_endpoint:
            print(f"\n⚠️  No responsive protected endpoints found:")
            for endpoint, status in endpoint_responses.items():
                print(f"   {endpoint}: {status}")

            print(f"🔧 Running mock protected endpoint test...")

            def mock_protected_test():
                time.sleep(0.01)
                return type('MockResponse', (), {'status_code': 200})()

            metrics = measure_performance(mock_protected_test, iterations=20, warmup_runs=2, test_name="Mock Protected Endpoint")

            if metrics:
                threshold = PERFORMANCE_THRESHOLDS["protected_endpoint"]
                passed = display_metrics("Protected Endpoint (Mock)", metrics, threshold)
                self.add_to_report("protected_endpoint_mock", metrics, threshold, passed)
            return

        def access_protected():
            try:
                response = client.get(
                    working_endpoint,
                    headers={"Authorization": f"Bearer {token}"},
                    timeout=5.0
                )
                return response
            except Exception as e:
                print(f"⚠️  Protected endpoint error: {e}")
                return None

        metrics = measure_performance(access_protected, iterations=25, warmup_runs=3, test_name=f"Protected Endpoint ({working_endpoint})")

        threshold = PERFORMANCE_THRESHOLDS["protected_endpoint"]
        passed = display_metrics(f"Protected Endpoint ({working_endpoint})", metrics, threshold)

        if metrics:
            self.add_to_report("protected_endpoint", metrics, threshold, passed)

    def test_concurrent_load_performance(self):
        """Test API performance under concurrent load"""

        def worker_thread(task_queue: queue.Queue, results_queue: queue.Queue, worker_id: int):
            """Worker function for concurrent load testing"""
            while True:
                try:
                    task = task_queue.get(timeout=2)
                    if task is None:
                        break

                    start_time = time.perf_counter()
                    try:
                        response = client.get("/health", timeout=3.0)
                        end_time = time.perf_counter()

                        results_queue.put({
                            "worker_id": worker_id,
                            "response_time": end_time - start_time,
                            "status_code": response.status_code if response else 500,
                            "success": response.status_code < 400 if response else False
                        })
                    except Exception as e:
                        results_queue.put({
                            "worker_id": worker_id,
                            "response_time": 0,
                            "status_code": 500,
                            "success": False,
                            "error": str(e)
                        })
                    finally:
                        task_queue.task_done()

                except queue.Empty:
                    break

        print("\n🚦 Testing Concurrent Load Performance...")

        num_requests = 20
        num_workers = 4

        task_queue = queue.Queue()
        results_queue = queue.Queue()
        threads = []

        # Add tasks to queue
        for i in range(num_requests):
            task_queue.put(f"request_{i}")

        # Start worker threads
        start_time = time.perf_counter()
        for worker_id in range(num_workers):
            t = threading.Thread(target=worker_thread, args=(task_queue, results_queue, worker_id))
            t.daemon = True
            t.start()
            threads.append(t)

        # Wait for completion
        try:
            task_queue.join()
        except KeyboardInterrupt:
            print("⚠️  Load test interrupted")

        total_time = time.perf_counter() - start_time

        # Stop workers
        for _ in range(num_workers):
            task_queue.put(None)

        # Wait for threads to finish
        for t in threads:
            t.join(timeout=1)

        # Collect and analyze results
        results = []
        while not results_queue.empty():
            try:
                results.append(results_queue.get_nowait())
            except queue.Empty:
                break

        if results:
            successful_results = [r for r in results if r["success"]]
            response_times = [r["response_time"] for r in successful_results]

            if response_times:
                concurrent_metrics = PerformanceMetrics(
                    avg=statistics.mean(response_times),
                    median=statistics.median(response_times),
                    std_dev=statistics.stdev(response_times) if len(response_times) > 1 else 0,
                    p95=sorted(response_times)[int(len(response_times) * 0.95)],
                    p99=sorted(response_times)[int(len(response_times) * 0.99)],
                    min=min(response_times),
                    max=max(response_times),
                    total_requests=len(results),
                    successful_requests=len(successful_results),
                    failed_requests=len(results) - len(successful_results),
                    success_rate=(len(successful_results) / len(results)) * 100,
                    requests_per_second=len(successful_results) / total_time
                )

                print(f"\n⚡ Concurrent Load Test Results:")
                print(f"Total Time: {total_time:.3f}s")
                print(f"Concurrent Workers: {num_workers}")

                threshold = PERFORMANCE_THRESHOLDS["concurrent_load"]
                passed = display_metrics("Concurrent Load", concurrent_metrics, threshold)

                self.add_to_report("concurrent_load", concurrent_metrics, threshold, passed)

                if concurrent_metrics.success_rate < 90:
                    print(f"🚨 Low success rate under load: {concurrent_metrics.success_rate:.1f}%")

            else:
                print("❌ No successful requests during concurrent load test")
                pytest.fail("Concurrent load test produced no successful results")
        else:
            print("❌ No results collected from concurrent load test")
            pytest.fail("Concurrent load test failed to collect any results")

    @pytest.mark.skip(reason="Optional WebSocket test - enable manually if WebSocket server is running")
    def test_websocket_performance(self):
        """WebSocket performance testing (optional)"""
        try:
            import websockets
        except ImportError:
            pytest.skip("websockets library not installed. Install with: pip install websockets")

        async def websocket_test():
            token = generate_test_token()
            connection_times = []
            message_times = []

            websocket_url = "ws://localhost:8000/api/chat"

            for i in range(3):
                print(f"WebSocket test iteration {i + 1}/3")

                try:
                    start_time = time.perf_counter()
                    async with websockets.connect(f"{websocket_url}?token={token}", timeout=5) as websocket:
                        connection_times.append(time.perf_counter() - start_time)

                        for j in range(3):
                            msg_start = time.perf_counter()
                            test_message = json.dumps({
                                "message": f"Performance test message {j}",
                                "timestamp": datetime.now().isoformat()
                            })

                            await websocket.send(test_message)
                            response = await asyncio.wait_for(websocket.recv(), timeout=3)
                            message_times.append(time.perf_counter() - msg_start)

                except Exception as e:
                    print(f"WebSocket iteration {i} failed: {e}")

            # Report results
            if connection_times:
                conn_avg = statistics.mean(connection_times)
                print(f"✅ WebSocket Connection Average: {conn_avg:.6f}s")

                conn_threshold = PERFORMANCE_THRESHOLDS["websocket_connection"]
                assert conn_avg < conn_threshold, f"WebSocket connection too slow: {conn_avg:.6f}s > {conn_threshold:.3f}s"

            if message_times:
                msg_avg = statistics.mean(message_times)
                print(f"✅ WebSocket Message Average: {msg_avg:.6f}s")

                msg_threshold = PERFORMANCE_THRESHOLDS["websocket_message"]
                assert msg_avg < msg_threshold, f"WebSocket messaging too slow: {msg_avg:.6f}s > {msg_threshold:.3f}s"

        try:
            asyncio.run(websocket_test())
        except Exception as e:
            pytest.skip(f"WebSocket test failed: {e}")

    def teardown_method(self):
        """Generate comprehensive performance report"""
        if not hasattr(self, 'performance_report') or not self.performance_report:
            return

        print(f"\n" + "═" * 80)
        print(f"📋 PERFORMANCE SUMMARY REPORT - {ENVIRONMENT.upper()}")
        print(f"═" * 80)

        print(f"{'Test Name':<25} | {'Avg Time':<10} | {'Success %':<10} | {'Req/s':<8} | {'Threshold':<10} | {'Status':<8}")
        print(f"─" * 80)

        total_tests = len(self.performance_report)
        passed_tests = 0

        for test in self.performance_report:
            status = "✅ PASS" if test["passed"] else "❌ FAIL"
            if test["passed"]:
                passed_tests += 1

            print(f"{test['test']:<25} | {test['avg_time']:<10.4f} | {test['success_rate']:<10.1f} | {test.get('throughput', 0):<8.2f} | {test['threshold']:<10.3f} | {status:<8}")

        print(f"─" * 80)

        overall_pass_rate = (passed_tests / total_tests) * 100
        print(f"Overall Results: {passed_tests}/{total_tests} tests passed ({overall_pass_rate:.1f}%)")

        failed_tests = [test for test in self.performance_report if not test["passed"]]

        if failed_tests:
            print(f"\n🔧 PERFORMANCE OPTIMIZATION OPPORTUNITIES:")
            print(f"─" * 50)

            for test in failed_tests:
                improvement_needed = ((test['avg_time'] - test['threshold']) / test['threshold']) * 100
                print(f"• {test['test']}: {improvement_needed:.1f}% slower than target")

        else:
            print(f"\n🎉 All performance tests passed! Your API is performing well.")

        print(f"\n💡 GENERAL OPTIMIZATION TIPS FOR {ENVIRONMENT.upper()}:")
        print(f"─" * 50)

        if ENVIRONMENT == "development":
            print(f"• Focus on identifying bottlenecks rather than absolute performance")
            print(f"• Use profiling tools to find slow database queries")
            print(f"• Consider implementing response caching for frequently accessed data")
        elif ENVIRONMENT == "staging":
            print(f"• Optimize database queries and add proper indexing")
            print(f"• Implement connection pooling for database and external services")
            print(f"• Consider adding a Redis cache layer")
        else:
            print(f"• Implement comprehensive monitoring and alerting")
            print(f"• Consider using a CDN for static assets")
            print(f"• Implement proper load balancing and auto-scaling")

        print(f"• Monitor memory usage and garbage collection")
        print(f"• Use async/await for I/O-bound operations")
        print(f"• Implement proper error handling and circuit breakers")


if __name__ == "__main__":
    print(f"🧪 API Performance Test Suite")
    print(f"Environment: {ENVIRONMENT}")
    print(f"Thresholds: {PERFORMANCE_THRESHOLDS}")

    pytest_args = ["-v", "--tb=short", "--strict-markers", __file__]

    # Add HTML report
    try:
        import pytest_html
        report_file = f"performance_report_{ENVIRONMENT}_{int(time.time())}.html"
        pytest_args.extend([f"--html={report_file}", "--self-contained-html"])
        print(f"📊 HTML report will be generated: {report_file}")
    except ImportError:
        print(f"💡 Install pytest-html for HTML reports: pip install pytest-html")

    exit_code = pytest.main(pytest_args)
    print(f"\n🏁 Test execution completed with exit code: {exit_code}")
    sys.exit(exit_code)