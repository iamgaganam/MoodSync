import pytest
import time
import statistics
import numpy as np
import os
from server.app.models.sentiment_model import predict_sentiment, model, vectorizer, label_encoder


@pytest.fixture(scope="module")
def check_model_files():
    """Check if model files exist before running tests."""
    data_directory = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data')

    # Assert model files exist
    model_path = os.path.join(data_directory, "mental_health_model.pkl")
    vectorizer_path = os.path.join(data_directory, "vectorizer.pkl")
    label_encoder_path = os.path.join(data_directory, "label_encoder.pkl")

    # Skip tests if files don't exist
    if not (os.path.exists(model_path) and
            os.path.exists(vectorizer_path) and
            os.path.exists(label_encoder_path)):
        pytest.skip("Model files not found. Skipping performance tests.")


class TestModelPerformance:
    """Performance tests for the mental health sentiment model."""

    def test_model_inference_speed(self, check_model_files):
        """Test the inference speed of the sentiment model."""
        # Test data - a mix of different types of text
        test_texts = [
            "I feel very depressed today",
            "I'm having anxiety about my upcoming presentation",
            "I'm thinking about ending it all",
            "Today was a normal day at work",
            "I feel stressed about the deadline tomorrow",
            "The weather is nice outside",
            "I can't stop crying",
            "I'm excited about the weekend",
            "I feel worthless and hopeless",
            "Just went grocery shopping"
        ]

        # Number of iterations for reliable timing
        num_iterations = 50

        # Store the timing results
        inference_times = []

        # Time the inference for each text
        for text in test_texts:
            times_for_text = []

            # Multiple runs for statistical significance
            for _ in range(num_iterations):
                start_time = time.time()
                sentiment, _ = predict_sentiment(text)
                end_time = time.time()
                times_for_text.append(end_time - start_time)

            # Record average time for this text
            avg_time = statistics.mean(times_for_text)
            inference_times.append((text, avg_time, sentiment))

        # Calculate overall statistics
        all_times = [t for _, t, _ in inference_times]
        avg_inference_time = statistics.mean(all_times)
        median_inference_time = statistics.median(all_times)
        p95_inference_time = sorted(all_times)[int(len(all_times) * 0.95)]

        # Print detailed results
        print("\nModel Inference Performance Results:")
        print("-" * 50)
        print(f"Average inference time: {avg_inference_time:.6f} seconds")
        print(f"Median inference time: {median_inference_time:.6f} seconds")
        print(f"95th percentile inference time: {p95_inference_time:.6f} seconds")
        print("\nDetailed results by text type:")

        # Group by sentiment for analysis
        sentiment_groups = {}
        for text, time_taken, sentiment in inference_times:
            if sentiment not in sentiment_groups:
                sentiment_groups[sentiment] = []
            sentiment_groups[sentiment].append(time_taken)

        # Print average time by sentiment category
        for sentiment, times in sentiment_groups.items():
            avg_time = statistics.mean(times)
            print(f"  {sentiment}: {avg_time:.6f} seconds (avg)")

        print("\nSlowest examples:")
        # Sort by time and print the 3 slowest
        slowest = sorted(inference_times, key=lambda x: x[1], reverse=True)[:3]
        for text, time_taken, sentiment in slowest:
            print(f"  '{text[:30]}...' ({sentiment}): {time_taken:.6f} seconds")

        # Assert performance requirements
        # These thresholds should be adjusted based on your specific requirements
        assert avg_inference_time < 0.1, f"Average inference time ({avg_inference_time:.6f}s) exceeds threshold of 0.1s"
        assert p95_inference_time < 0.2, f"95th percentile inference time ({p95_inference_time:.6f}s) exceeds threshold of 0.2s"

    def test_model_memory_usage(self, check_model_files):
        """Test the memory usage of the model during inference."""
        try:
            import psutil
            import os
        except ImportError:
            pytest.skip("psutil not installed. Install with: pip install psutil")

        # Get current process
        process = psutil.Process(os.getpid())

        # Measure baseline memory
        baseline_memory = process.memory_info().rss / (1024 * 1024)  # Convert to MB

        # Test data - long text to stress memory usage
        long_text = "I feel very " + "very " * 1000 + "depressed today"

        # Perform multiple inferences to measure memory impact
        num_iterations = 20
        memory_usage = []

        for i in range(num_iterations):
            # Run inference
            sentiment, _ = predict_sentiment(long_text)

            # Measure memory after inference
            current_memory = process.memory_info().rss / (1024 * 1024)
            memory_usage.append(current_memory)

            # Print progress
            if i % 5 == 0:
                print(f"Iteration {i}: Memory usage = {current_memory:.2f} MB")

        # Calculate memory statistics
        avg_memory = statistics.mean(memory_usage)
        max_memory = max(memory_usage)
        memory_increase = max_memory - baseline_memory

        # Print results
        print("\nMemory Usage Results:")
        print("-" * 50)
        print(f"Baseline memory: {baseline_memory:.2f} MB")
        print(f"Average memory during inference: {avg_memory:.2f} MB")
        print(f"Maximum memory during inference: {max_memory:.2f} MB")
        print(f"Maximum memory increase: {memory_increase:.2f} MB")

        # Assert memory requirements
        # These thresholds should be adjusted based on your specific requirements
        assert memory_increase < 100, f"Memory increase ({memory_increase:.2f} MB) exceeds threshold of 100 MB"

    def test_vectorizer_performance(self, check_model_files):
        """Test the performance of the text vectorization component."""
        # Test data with varying lengths
        test_texts = [
            "Short text",
            "This is a medium length text with some more words to process",
            "This is a longer text that contains multiple sentences. It has punctuation and various words. "
            "The vectorizer needs to process all of this text and convert it into numerical features. "
            "We want to measure how long this takes for different text lengths.",
            # Very long text (simulating a long user input)
            "Long " * 500 + "text with repetition."
        ]

        # Number of iterations
        num_iterations = 20

        # Store results by text length
        vectorization_times = []

        for text in test_texts:
            times = []
            text_length = len(text)

            for _ in range(num_iterations):
                # Time just the vectorization step
                start_time = time.time()
                vectorized = vectorizer.transform([text])
                end_time = time.time()

                times.append(end_time - start_time)

            avg_time = statistics.mean(times)
            vectorization_times.append((text_length, avg_time))

        # Print results
        print("\nVectorizer Performance Results:")
        print("-" * 50)
        print("Text Length | Avg. Vectorization Time (s)")
        print("-" * 50)

        for length, avg_time in vectorization_times:
            print(f"{length:11} | {avg_time:.6f}")

        # Calculate time per character for long texts
        if len(vectorization_times) > 2:
            longest_text_length, longest_text_time = vectorization_times[-1]
            time_per_char = longest_text_time / longest_text_length
            print(f"\nTime per character for long text: {time_per_char:.9f} seconds")

            # Check if vectorization time scales linearly with text length
            expected_time_for_longest = vectorization_times[1][1] * (longest_text_length / vectorization_times[1][0])
            time_ratio = longest_text_time / expected_time_for_longest
            print(f"Scaling factor (1.0 = perfect linear scaling): {time_ratio:.2f}")

            # Assert that vectorization time scales reasonably with text length
            assert time_ratio < 2.0, f"Vectorization time increases non-linearly (factor: {time_ratio:.2f})"