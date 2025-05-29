import pytest
import time
import statistics
import os
from server.app.models.sentiment_model import predict_sentiment, model, vectorizer, label_encoder


@pytest.fixture(scope="module")
def model_files_exist():
    """Verify required model files exist before running tests"""
    data_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data')

    required_files = ["mental_health_model.pkl", "vectorizer.pkl", "label_encoder.pkl"]
    file_paths = [os.path.join(data_dir, filename) for filename in required_files]

    if not all(os.path.exists(path) for path in file_paths):
        pytest.skip("Model files not found. Skipping performance tests.")


class TestModelPerformance:
    """Performance benchmarking suite for mental health sentiment model"""

    def test_inference_speed_benchmarks(self, model_files_exist):
        """Benchmark model inference speed across different text categories and lengths"""
        test_scenarios = {
            "depression": ["I feel very depressed today", "I can't stop crying"],
            "anxiety": ["I'm having anxiety about my presentation", "I feel nervous and on edge"],
            "suicidal": ["I'm thinking about ending it all", "I feel worthless and hopeless"],
            "normal": ["Today was a normal day at work", "The weather is nice outside",
                       "Just went grocery shopping", "I'm excited about the weekend"]
        }

        performance_results = []
        num_iterations = 50

        # Benchmark each scenario
        for category, texts in test_scenarios.items():
            for text in texts:
                response_times = []

                for _ in range(num_iterations):
                    start_time = time.time()
                    sentiment, _ = predict_sentiment(text)
                    response_times.append(time.time() - start_time)

                performance_results.append({
                    "text_sample": text[:30] + "..." if len(text) > 30 else text,
                    "category": category,
                    "predicted": sentiment,
                    "avg_time": statistics.mean(response_times),
                    "p95_time": sorted(response_times)[int(num_iterations * 0.95)],
                    "text_length": len(text)
                })

        # Analyze and display performance metrics
        self._analyze_inference_performance(performance_results)

        # Performance validation
        overall_avg = statistics.mean([r["avg_time"] for r in performance_results])
        overall_p95 = statistics.mean([r["p95_time"] for r in performance_results])

        assert overall_avg < 0.1, f"Average inference time {overall_avg:.6f}s exceeds 0.1s threshold"
        assert overall_p95 < 0.2, f"95th percentile time {overall_p95:.6f}s exceeds 0.2s threshold"

    def _analyze_inference_performance(self, results):
        """Display comprehensive inference performance analysis"""
        print("\nModel Inference Performance Analysis:")
        print("=" * 70)

        # Overall statistics
        all_times = [r["avg_time"] for r in results]
        print(f"Overall Statistics:")
        print(f"  Average inference time: {statistics.mean(all_times):.6f}s")
        print(f"  Median inference time:  {statistics.median(all_times):.6f}s")
        print(f"  95th percentile time:   {sorted(all_times)[int(len(all_times) * 0.95)]:.6f}s")

        # Performance by category
        category_performance = {}
        for result in results:
            category = result["predicted"].lower()
            if category not in category_performance:
                category_performance[category] = []
            category_performance[category].append(result["avg_time"])

        print(f"\nPerformance by Prediction Category:")
        for category, times in category_performance.items():
            print(f"  {category.capitalize()}: {statistics.mean(times):.6f}s average")

        # Identify slowest examples for optimization
        print(f"\nSlowest Inference Examples:")
        slowest = sorted(results, key=lambda x: x["avg_time"], reverse=True)[:3]
        for result in slowest:
            print(f"  '{result['text_sample']}' ({result['predicted']}): {result['avg_time']:.6f}s")

    def test_memory_usage_analysis(self, model_files_exist):
        """Analyze memory usage during model inference operations"""
        try:
            import psutil
            process = psutil.Process(os.getpid())
        except ImportError:
            pytest.skip("psutil required for memory testing. Install with: pip install psutil")

        # Baseline memory measurement
        baseline_memory = process.memory_info().rss / (1024 * 1024)  # Convert to MB

        # Stress test with extended text
        stress_text = "I feel deeply " + "very " * 1000 + "depressed and overwhelmed today"
        memory_measurements = []

        for iteration in range(20):
            # Perform inference
            predict_sentiment(stress_text)

            # Measure current memory usage
            current_memory = process.memory_info().rss / (1024 * 1024)
            memory_measurements.append(current_memory)

            if iteration % 5 == 0:
                print(f"Iteration {iteration}: {current_memory:.2f} MB")

        # Memory usage analysis
        memory_stats = {
            "baseline": baseline_memory,
            "average": statistics.mean(memory_measurements),
            "peak": max(memory_measurements),
            "increase": max(memory_measurements) - baseline_memory
        }

        print(f"\nMemory Usage Analysis:")
        print("-" * 40)
        print(f"Baseline memory:     {memory_stats['baseline']:.2f} MB")
        print(f"Average during test: {memory_stats['average']:.2f} MB")
        print(f"Peak memory usage:   {memory_stats['peak']:.2f} MB")
        print(f"Memory increase:     {memory_stats['increase']:.2f} MB")

        # Memory efficiency validation
        assert memory_stats[
                   "increase"] < 100, f"Memory increase {memory_stats['increase']:.2f} MB exceeds 100 MB threshold"

    def test_vectorization_performance(self, model_files_exist):
        """Benchmark text vectorization performance across different input sizes"""
        test_inputs = [
            ("Short", "Brief text"),
            ("Medium", "This is a medium length text with several words to process for analysis"),
            ("Long", "This extensive text contains multiple sentences and various linguistic elements. "
                     "The vectorizer processes all content to extract meaningful features. " * 5),
            ("Very Long", "Extended repetitive content. " * 500)
        ]

        vectorization_results = []
        num_iterations = 20

        for category, text in test_inputs:
            response_times = []
            text_length = len(text)

            for _ in range(num_iterations):
                start_time = time.time()
                vectorizer.transform([text])
                response_times.append(time.time() - start_time)

            vectorization_results.append({
                "category": category,
                "length": text_length,
                "avg_time": statistics.mean(response_times),
                "time_per_char": statistics.mean(response_times) / text_length
            })

        # Display vectorization performance
        print(f"\nVectorization Performance Results:")
        print("-" * 60)
        print(f"{'Category':12} | {'Length':8} | {'Avg Time (s)':12} | {'Time/Char':12}")
        print("-" * 60)

        for result in vectorization_results:
            print(f"{result['category']:12} | {result['length']:8} | "
                  f"{result['avg_time']:.6f}     | {result['time_per_char']:.9f}")

        # Analyze scaling behavior for performance optimization
        if len(vectorization_results) >= 2:
            longest = vectorization_results[-1]
            medium = vectorization_results[1]

            scaling_factor = (longest["avg_time"] / medium["avg_time"]) / (longest["length"] / medium["length"])
            print(f"\nScaling Analysis:")
            print(f"  Time per character (long text): {longest['time_per_char']:.9f}s")
            print(f"  Scaling factor: {scaling_factor:.2f} (1.0 = linear)")

            # Validate scaling performance
            assert scaling_factor < 2.0, f"Non-linear scaling detected: {scaling_factor:.2f}"