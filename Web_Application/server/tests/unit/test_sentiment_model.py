import pytest
import numpy as np
from unittest.mock import patch, MagicMock

# Import the function to test
from server.app.models.sentiment_model import predict_sentiment

# Get the correct module path for patching
import server.app.models.sentiment_model as sentiment_module


class TestSentimentModel:
    """Unit tests for sentiment_model.py using mocks."""
    
    @pytest.fixture
    def mock_components(self):
        """Set up mocks for model dependencies."""
        # Create mock objects
        mocks = {
            'model': MagicMock(),
            'vectorizer': MagicMock(),
            'label_encoder': MagicMock()
        }
        
        # Configure basic mock behavior
        mocks['vectorizer'].transform.return_value = np.array([[0.1, 0.2, 0.3]])
        
        return mocks
    
    def setup_prediction(self, mocks, class_index, probabilities, class_label):
        """Configure mocks for a specific prediction scenario."""
        mocks['model'].predict.return_value = np.array([class_index])
        mocks['model'].predict_proba.return_value = np.array([probabilities])
        mocks['label_encoder'].inverse_transform.return_value = np.array([class_label])
    
    def test_predict_sentiment_positive(self, mock_components):
        """Test prediction of positive sentiment."""
        # Configure for positive sentiment
        self.setup_prediction(
            mock_components,
            class_index=1,
            probabilities=[0.2, 0.8],
            class_label='positive'
        )
        
        # Apply mocks and test
        with patch.multiple(sentiment_module, **mock_components):
            sentiment, confidence = predict_sentiment("I feel happy today")
            
            # Verify results
            assert sentiment == 'positive'
            assert confidence == [0.2, 0.8]
            
            # Verify calls
            mock_components['vectorizer'].transform.assert_called_once_with(["I feel happy today"])
            mock_components['model'].predict.assert_called_once()
            mock_components['model'].predict_proba.assert_called_once()
            mock_components['label_encoder'].inverse_transform.assert_called_once_with(np.array([1]))
    
    def test_predict_sentiment_negative(self, mock_components):
        """Test prediction of negative sentiment."""
        # Configure for negative sentiment
        self.setup_prediction(
            mock_components,
            class_index=0,
            probabilities=[0.7, 0.3],
            class_label='negative'
        )
        
        # Apply mocks and test
        with patch.multiple(sentiment_module, **mock_components):
            sentiment, confidence = predict_sentiment("I feel sad today")
            
            # Verify results
            assert sentiment == 'negative'
            assert confidence == [0.7, 0.3]
            
            # Verify calls
            mock_components['vectorizer'].transform.assert_called_once_with(["I feel sad today"])
    
    def test_predict_sentiment_neutral(self, mock_components):
        """Test prediction of neutral sentiment."""
        # Configure for neutral sentiment
        self.setup_prediction(
            mock_components,
            class_index=2,
            probabilities=[0.3, 0.3, 0.4],
            class_label='neutral'
        )
        
        # Apply mocks and test
        with patch.multiple(sentiment_module, **mock_components):
            sentiment, confidence = predict_sentiment("Today is Monday")
            
            # Verify results
            assert sentiment == 'neutral'
            assert confidence == [0.3, 0.3, 0.4]
    
    def test_vectorizer_error_handling(self, mock_components):
        """Test error handling when vectorizer fails."""
        # Configure vectorizer to raise an exception
        mock_components['vectorizer'].transform.side_effect = Exception("Vectorizer error")
        
        # Apply mocks and test
        with patch.multiple(sentiment_module, **mock_components):
            with pytest.raises(Exception) as exc_info:
                predict_sentiment("Problem text")
            
            # Verify exception details
            assert "Vectorizer error" in str(exc_info.value)
    
    def test_multi_class_prediction(self, mock_components):
        """Test prediction with multiple sentiment classes."""
        # Configure for multi-class scenario
        self.setup_prediction(
            mock_components,
            class_index=3,
            probabilities=[0.1, 0.2, 0.1, 0.6],
            class_label='anxiety'
        )
        
        # Apply mocks and test
        with patch.multiple(sentiment_module, **mock_components):
            sentiment, confidence = predict_sentiment("I'm feeling anxious")
            
            # Verify results
            assert sentiment == 'anxiety'
            assert confidence == [0.1, 0.2, 0.1, 0.6]
            assert sum(confidence) == pytest.approx(1.0)