import pytest
import os
import numpy as np
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
        pytest.skip("Model files not found. Skipping integration tests.")


class TestMentalHealthModelIntegration:
    """Integration tests for the mental health model using actual model files."""

    def test_model_loading(self, model_files_exist):
        """Test that the model, vectorizer, and label encoder are properly loaded."""
        # Verify components are loaded
        assert all([model, vectorizer, label_encoder]), "Model components failed to load"
        
        # Verify expected methods exist
        assert hasattr(model, 'predict') and hasattr(model, 'predict_proba'), "Model missing required methods"
        assert hasattr(vectorizer, 'transform'), "Vectorizer missing transform method"
        assert hasattr(label_encoder, 'inverse_transform'), "Label encoder missing inverse_transform method"

    def test_mental_health_detection(self, model_files_exist):
        """Test that the model correctly detects mental health concerns."""
        test_cases = [
            {"text": "I feel deeply depressed and hopeless today", "expected": ["depression"]},
            {"text": "I can't stop crying and everything feels overwhelming", "expected": ["depression", "suicidal"]},
            {"text": "I'm having panic attacks and constant worry", "expected": ["anxiety", "stress"]},
            {"text": "I feel worthless and like a burden to everyone", "expected": ["depression", "suicidal"]},
            {"text": "I don't see a point in living anymore", "expected": ["suicidal"]}
        ]

        for case in test_cases:
            sentiment, confidence = predict_sentiment(case["text"])
            print(f"Text: '{case['text']}' → {sentiment} (confidence: {confidence})")
            
            # Check if prediction matches any expected category
            assert sentiment.lower() in [cat.lower() for cat in case["expected"]], \
                f"Expected one of {case['expected']} for '{case['text']}', but got '{sentiment}'"

    def test_normal_detection(self, model_files_exist):
        """Test that the model can detect normal/non-concerning texts."""
        normal_texts = [
            "I had a regular day today",
            "I'm going to my appointment tomorrow at 2pm",
            "The weather is cloudy outside",
            "I watched a documentary about space"
        ]

        for text in normal_texts:
            sentiment, confidence = predict_sentiment(text)
            print(f"Text: '{text}' → {sentiment} (confidence: {confidence})")
            assert sentiment.lower() == "normal", f"Expected 'Normal' for '{text}', but got '{sentiment}'"

    def test_confidence_scores(self, model_files_exist):
        """Test that confidence scores are properly formatted."""
        _, confidence = predict_sentiment("Sample text for confidence score testing")
        
        assert isinstance(confidence, list), "Confidence scores should be a list"
        assert all(0 <= score <= 1 for score in confidence), "Confidence scores should be between 0 and 1"
        assert abs(sum(confidence) - 1.0) < 1e-5, "Confidence scores should sum to approximately 1"

    def test_edge_cases(self, model_files_exist):
        """Test behavior with edge cases."""
        # Test various edge cases
        edge_cases = {
            "empty": "",
            "long": "feeling sad " * 1000,
            "special_chars": "I feel 😢 today! #depression @therapy"
        }
        
        for case_name, text in edge_cases.items():
            sentiment, _ = predict_sentiment(text)
            assert isinstance(sentiment, str), f"Should return a string sentiment for {case_name} input"
            print(f"{case_name} prediction: {sentiment}")


# Parametrized test for mental health classification
MENTAL_HEALTH_EXAMPLES = [
    ("I'm so depressed", ["depression"]),
    ("I feel worthless", ["depression", "suicidal"]),
    ("I can't stop crying", ["depression", "suicidal", "normal"]),
    ("I'm having a panic attack", ["anxiety", "stress"]),
    ("Going to the store", ["normal"]),
    ("The weather is nice today", ["normal"]),
    ("I have a meeting tomorrow", ["normal"]),
]

@pytest.mark.parametrize("input_text,acceptable_categories", MENTAL_HEALTH_EXAMPLES)
def test_mental_health_classification(model_files_exist, input_text, acceptable_categories):
    """Test mental health classification with flexible category matching."""
    sentiment, confidence = predict_sentiment(input_text)
    print(f"Text: '{input_text}' → Predicted: '{sentiment}' (acceptable: {acceptable_categories})")
    
    # Check if prediction is in acceptable categories
    assert sentiment.lower() in [cat.lower() for cat in acceptable_categories], \
        f"Expected one of {acceptable_categories} for '{input_text}', but got '{sentiment}'"