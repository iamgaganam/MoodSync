import pytest
import time
import statistics
import os
from server.app.models.sentiment_model import predict_sentiment, model, vectorizer, label_encoder


@pytest.fixture(scope="module")
def model_files_exist():
    """Check if model files exist before running tests."""
    data_directory = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data')
    
    model_path = os.path.join(data_directory, "mental_health_model.pkl")
    vectorizer_path = os.path.join(data_directory, "vectorizer.pkl")
    label_encoder_path = os.path.join(data_directory, "label_encoder.pkl")
    
    # Skip tests if files don't exist
    if not all([os.path.exists(p) for p in [model_path, vectorizer_path, label_encoder_path]]):
        pytest.skip("Model files not found. Skipping performance tests.")


class TestModelPerformance:
    """Performance tests for the mental health sentiment model."""

    def test_model_inference_speed(self, model_files_exist):
        """Test the inference speed of the sentiment model."""
        # Test data with different sentiment categories
        test_texts = {
            "depression": ["I feel very depressed today", "I can't stop crying"],
            "anxiety": ["I'm having anxiety about my presentation", "I feel nervous and on edge"],
            "suicidal": ["I'm thinking about ending it all", "I feel worthless and hopeless"],
            "normal": ["Today was a normal day at work", "The weather is nice outside", 
                      "Just went grocery shopping", "I'm excited about the weekend"]
        }
        
        # Test parameters
        num_iterations = 50
        results = []
        
        # Measure inference times for all texts
        for category, texts in test_texts.items():
            for text in texts:
                times = []
                
                # Run multiple iterations
                for _ in range(num_iterations):
                    start_time = time.time()
                    sentiment, _ = predict_sentiment(text)
                    times.append(time.time() - start_time)
                
                # Record average time
                avg_time = statistics.mean(times)
                results.append({
                    "text": text,
                    "category": category,
                    "predicted": sentiment,
                    "avg_time": avg_time,
                    "min_time": min(times),
                    "max_time": max(times),
                    "p95_time": sorted(times)[int(num_iterations * 0.95)]
                })
        
        # Calculate overall statistics
        all_times = [r["avg_time"] for r in results]
        overall_stats = {
            "avg": statistics.mean(all_times),
            "median": statistics.median(all_times),
            "p95": sorted(all_times)[int(len(all_times) * 0.95)]
        }
        
        # Group by prediction category
        category_times = {}
        for result in results:
            pred = result["predicted"].lower()
            if pred not in category_times:
                category_times[pred] = []
            category_times[pred].append(result["avg_time"])
        
        # Print results
        self._print_inference_results(results, overall_stats, category_times)
        
        # Assertions
        assert overall_stats["avg"] < 0.1, f"Average inference time ({overall_stats['avg']:.6f}s) exceeds threshold of 0.1s"
        assert overall_stats["p95"] < 0.2, f"95th percentile inference time ({overall_stats['p95']:.6f}s) exceeds threshold of 0.2s"
    
    def _print_inference_results(self, results, overall_stats, category_times):
        """Helper to print formatted inference results."""
        print("\nModel Inference Performance Results:")
        print("-" * 60)
        print(f"Average inference time: {overall_stats['avg']:.6f} seconds")
        print(f"Median inference time: {overall_stats['median']:.6f} seconds")
        print(f"95th percentile time: {overall_stats['p95']:.6f} seconds")
        
        print("\nBy category:")
        for category, times in category_times.items():
            print(f"  {category}: {statistics.mean(times):.6f} seconds (avg)")
        
        print("\nSlowest examples:")
        for result in sorted(results, key=lambda x: x["avg_time"], reverse=True)[:3]:
            print(f"  '{result['text'][:30]}...' ({result['predicted']}): {result['avg_time']:.6f} seconds")

    def test_memory_usage(self, model_files_exist):
        """Test memory usage during model inference."""
        try:
            import psutil
            process = psutil.Process(os.getpid())
        except ImportError:
            pytest.skip("psutil not installed. Install with: pip install psutil")
        
        # Measure baseline memory
        baseline_memory = process.memory_info().rss / (1024 * 1024)  # MB
        
        # Use a long text to stress memory
        long_text = "I feel very " + "very " * 1000 + "depressed today"
        
        # Perform multiple inferences
        num_iterations = 20
        memory_usage = []
        
        for i in range(num_iterations):
            # Run inference
            predict_sentiment(long_text)
            
            # Measure memory
            current_memory = process.memory_info().rss / (1024 * 1024)
            memory_usage.append(current_memory)
            
            # Print progress
            if i % 5 == 0:
                print(f"Iteration {i}: Memory usage = {current_memory:.2f} MB")
        
        # Calculate memory statistics
        memory_stats = {
            "baseline": baseline_memory,
            "avg": statistics.mean(memory_usage),
            "max": max(memory_usage),
            "increase": max(memory_usage) - baseline_memory
        }
        
        # Print results
        print("\nMemory Usage Results:")
        print("-" * 50)
        print(f"Baseline memory: {memory_stats['baseline']:.2f} MB")
        print(f"Average memory during inference: {memory_stats['avg']:.2f} MB")
        print(f"Maximum memory during inference: {memory_stats['max']:.2f} MB")
        print(f"Maximum memory increase: {memory_stats['increase']:.2f} MB")
        
        # Assert memory requirements
        assert memory_stats["increase"] < 100, f"Memory increase ({memory_stats['increase']:.2f} MB) exceeds threshold of 100 MB"

    def test_vectorizer_performance(self, model_files_exist):
        """Test the performance of text vectorization."""
        # Test data with varying lengths
        test_texts = [
            "Short text",
            "This is a medium length text with some more words to process",
            "This is a longer text that contains multiple sentences. It has punctuation and various words. "
            "The vectorizer needs to process all of this text and convert it into numerical features. "
            "We want to measure how long this takes for different text lengths.",
            "Long " * 500 + "text with repetition."
        ]
        
        num_iterations = 20
        results = []
        
        for text in test_texts:
            times = []
            text_length = len(text)
            
            for _ in range(num_iterations):
                # Time vectorization only
                start_time = time.time()
                vectorized = vectorizer.transform([text])
                times.append(time.time() - start_time)
            
            results.append({
                "length": text_length,
                "avg_time": statistics.mean(times),
                "min_time": min(times),
                "max_time": max(times)
            })
        
        # Print results
        print("\nVectorizer Performance Results:")
        print("-" * 50)
        print("Text Length | Avg. Vectorization Time (s)")
        print("-" * 50)
        
        for result in results:
            print(f"{result['length']:11} | {result['avg_time']:.6f}")
        
        # Analyze scaling behavior
        if len(results) > 2:
            longest = results[-1]
            medium = results[1]
            
            time_per_char = longest["avg_time"] / longest["length"]
            print(f"\nTime per character for long text: {time_per_char:.9f} seconds")
            
            scaling_factor = (longest["avg_time"] / medium["avg_time"]) / (longest["length"] / medium["length"])
            print(f"Scaling factor (1.0 = linear scaling): {scaling_factor:.2f}")
            
            # Assert reasonable scaling
            assert scaling_factor < 2.0, f"Vectorization time scales non-linearly (factor: {scaling_factor:.2f})"