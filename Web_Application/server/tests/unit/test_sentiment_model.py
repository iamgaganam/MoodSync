# tests/unit/test_sentiment_model.py

import pytest
import numpy as np
from unittest.mock import patch, MagicMock

# Import the function and module to test
from server.app.models.sentiment_model import predict_sentiment

# Important: We need to get the correct module path for patching
import server.app.models.sentiment_model as sentiment_module


class TestSentimentModel:
    """Unit tests for sentiment_model.py using mocks."""

    @pytest.fixture
    def mock_dependencies(self):
        """Set up mocks for model dependencies."""
        # Create mock objects
        mock_model = MagicMock()
        mock_vectorizer = MagicMock()
        mock_label_encoder = MagicMock()

        # Configure mock behavior
        mock_vectorizer.transform.return_value = np.array([[0.1, 0.2, 0.3]])
        mock_model.predict.return_value = np.array([1])
        mock_model.predict_proba.return_value = np.array([[0.2, 0.8]])
        mock_label_encoder.inverse_transform.return_value = np.array(['positive'])

        # Return a dictionary of mocks
        return {
            'model': mock_model,
            'vectorizer': mock_vectorizer,
            'label_encoder': mock_label_encoder
        }

    def test_predict_sentiment_positive(self, mock_dependencies):
        """Test that the function correctly predicts positive sentiment."""
        # Use the correct module path for patching
        with patch.object(sentiment_module, 'model', mock_dependencies['model']), \
                patch.object(sentiment_module, 'vectorizer', mock_dependencies['vectorizer']), \
                patch.object(sentiment_module, 'label_encoder', mock_dependencies['label_encoder']):
            # Call the function
            sentiment, confidence = predict_sentiment("I feel happy today")

            # Verify the result
            assert sentiment == 'positive'
            assert confidence == [0.2, 0.8]

            # Verify the mocks were called correctly
            mock_dependencies['vectorizer'].transform.assert_called_once_with(["I feel happy today"])
            mock_dependencies['model'].predict.assert_called_once()
            mock_dependencies['model'].predict_proba.assert_called_once()
            mock_dependencies['label_encoder'].inverse_transform.assert_called_once_with(np.array([1]))

    def test_predict_sentiment_negative(self, mock_dependencies):
        """Test that the function correctly predicts negative sentiment."""
        # Reconfigure mocks for negative sentiment
        mock_dependencies['model'].predict.return_value = np.array([0])
        mock_dependencies['model'].predict_proba.return_value = np.array([[0.7, 0.3]])
        mock_dependencies['label_encoder'].inverse_transform.return_value = np.array(['negative'])

        # Use the correct module path for patching
        with patch.object(sentiment_module, 'model', mock_dependencies['model']), \
                patch.object(sentiment_module, 'vectorizer', mock_dependencies['vectorizer']), \
                patch.object(sentiment_module, 'label_encoder', mock_dependencies['label_encoder']):
            # Call the function
            sentiment, confidence = predict_sentiment("I feel sad today")

            # Verify the result
            assert sentiment == 'negative'
            assert confidence == [0.7, 0.3]

            # Verify the mocks were called correctly
            mock_dependencies['vectorizer'].transform.assert_called_once_with(["I feel sad today"])

    def test_predict_sentiment_neutral(self, mock_dependencies):
        """Test that the function correctly predicts neutral sentiment."""
        # Reconfigure mocks for neutral sentiment
        mock_dependencies['model'].predict.return_value = np.array([2])
        mock_dependencies['model'].predict_proba.return_value = np.array([[0.3, 0.3, 0.4]])
        mock_dependencies['label_encoder'].inverse_transform.return_value = np.array(['neutral'])

        # Use the correct module path for patching
        with patch.object(sentiment_module, 'model', mock_dependencies['model']), \
                patch.object(sentiment_module, 'vectorizer', mock_dependencies['vectorizer']), \
                patch.object(sentiment_module, 'label_encoder', mock_dependencies['label_encoder']):
            # Call the function
            sentiment, confidence = predict_sentiment("Today is Monday")

            # Verify the result
            assert sentiment == 'neutral'
            assert confidence == [0.3, 0.3, 0.4]

    def test_vectorizer_error_handling(self, mock_dependencies):
        """Test error handling when vectorizer fails."""
        # Make vectorizer.transform raise an exception
        mock_dependencies['vectorizer'].transform.side_effect = Exception("Vectorizer error")

        # Use the correct module path for patching
        with patch.object(sentiment_module, 'model', mock_dependencies['model']), \
                patch.object(sentiment_module, 'vectorizer', mock_dependencies['vectorizer']), \
                patch.object(sentiment_module, 'label_encoder', mock_dependencies['label_encoder']):
            # Call should raise the exception
            with pytest.raises(Exception) as exc_info:
                predict_sentiment("Problem text")

            # Verify exception details
            assert "Vectorizer error" in str(exc_info.value)