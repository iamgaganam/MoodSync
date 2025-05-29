import pytest
import os
from server.app.models.sentiment_model import predict_sentiment, model, vectorizer, label_encoder


@pytest.fixture(scope="module")
def model_files_exist():
    """Verify model files exist before running integration tests"""
    data_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data')

    required_files = [
        "mental_health_model.pkl",
        "vectorizer.pkl",
        "label_encoder.pkl"
    ]

    file_paths = [os.path.join(data_dir, filename) for filename in required_files]

    if not all(os.path.exists(path) for path in file_paths):
        pytest.skip("Model files not found. Skipping integration tests.")


class TestMentalHealthModelIntegration:
    """Integration tests validating mental health model performance with actual model files"""

    def test_model_components_loaded(self, model_files_exist):
        """Verify all model components are properly loaded and functional"""
        assert all([model, vectorizer, label_encoder]), "Model components failed to load"

        # Validate required methods exist
        required_methods = [
            (model, ['predict', 'predict_proba']),
            (vectorizer, ['transform']),
            (label_encoder, ['inverse_transform'])
        ]

        for component, methods in required_methods:
            for method in methods:
                assert hasattr(component, method), f"Missing {method} in {component.__class__.__name__}"

    def test_mental_health_classification(self, model_files_exist):
        """Test accurate detection of mental health concerns"""
        test_cases = [
            {"text": "I feel deeply depressed and hopeless today", "expected": ["depression"]},
            {"text": "I can't stop crying and everything feels overwhelming", "expected": ["depression", "suicidal"]},
            {"text": "I'm having panic attacks and constant worry", "expected": ["anxiety", "stress"]},
            {"text": "I feel worthless and like a burden to everyone", "expected": ["depression", "suicidal"]},
            {"text": "I don't see a point in living anymore", "expected": ["suicidal"]}
        ]

        for case in test_cases:
            sentiment, confidence = predict_sentiment(case["text"])

            # Validate prediction matches expected categories
            assert sentiment.lower() in [cat.lower() for cat in case["expected"]], \
                f"Expected one of {case['expected']} for '{case['text']}', got '{sentiment}'"

    def test_normal_text_classification(self, model_files_exist):
        """Test accurate detection of normal/non-concerning content"""
        normal_texts = [
            "I had a regular day today",
            "I'm going to my appointment tomorrow at 2pm",
            "The weather is cloudy outside",
            "I watched a documentary about space"
        ]

        for text in normal_texts:
            sentiment, _ = predict_sentiment(text)
            assert sentiment.lower() == "normal", f"Expected 'Normal' for '{text}', got '{sentiment}'"

    def test_confidence_score_validation(self, model_files_exist):
        """Validate confidence scores are properly formatted and normalized"""
        _, confidence = predict_sentiment("Sample text for confidence validation")

        assert isinstance(confidence, list), "Confidence scores must be a list"
        assert all(0 <= score <= 1 for score in confidence), "Confidence scores must be between 0 and 1"
        assert abs(sum(confidence) - 1.0) < 1e-5, "Confidence scores must sum to 1"

    def test_edge_case_handling(self, model_files_exist):
        """Test model behavior with edge cases and unusual inputs"""
        edge_cases = {
            "empty": "",
            "long_repetitive": "feeling sad " * 1000,
            "special_characters": "I feel 😢 today! #depression @therapy",
            "numbers_only": "123 456 789",
            "mixed_case": "I FEEL very SAD today"
        }

        for case_name, text in edge_cases.items():
            sentiment, confidence = predict_sentiment(text)
            assert isinstance(sentiment, str), f"Should return string sentiment for {case_name}"
            assert isinstance(confidence, list), f"Should return list confidence for {case_name}"


# Parametrized test for complete classification validation
CLASSIFICATION_TEST_DATA = [
    ("I'm so depressed", ["depression"]),
    ("I feel worthless", ["depression", "suicidal"]),
    ("I can't stop crying", ["depression", "suicidal", "normal"]),
    ("I'm having a panic attack", ["anxiety", "stress"]),
    ("Going to the store", ["normal"]),
    ("The weather is nice today", ["normal"]),
    ("I have a meeting tomorrow", ["normal"]),
]


@pytest.mark.parametrize("input_text,acceptable_categories", CLASSIFICATION_TEST_DATA)
def test_comprehensive_classification(model_files_exist, input_text, acceptable_categories):
    """Parametrized test for mental health classification accuracy"""
    sentiment, confidence = predict_sentiment(input_text)

    assert sentiment.lower() in [cat.lower() for cat in acceptable_categories], \
        f"Expected one of {acceptable_categories} for '{input_text}', got '{sentiment}'"