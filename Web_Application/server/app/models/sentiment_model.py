import joblib
import os
import logging
from typing import Tuple, List

logger = logging.getLogger(__name__)

# Load ML models and preprocessing components
try:
    data_directory = os.path.join(os.path.dirname(__file__), '../../data')

    model = joblib.load(os.path.join(data_directory, "mental_health_model.pkl"))
    vectorizer = joblib.load(os.path.join(data_directory, "vectorizer.pkl"))
    label_encoder = joblib.load(os.path.join(data_directory, "label_encoder.pkl"))

    logger.info("ML models loaded successfully")
except Exception as e:
    logger.error(f"Failed to load ML models: {str(e)}")
    raise


def predict_sentiment(processed_text: str) -> Tuple[str, List[float]]:
    """
    Predict sentiment and confidence scores for processed text
    """
    if not processed_text:
        return "neutral", [0.0, 1.0, 0.0]  # Default neutral response

    try:
        # Transform text to vector format
        input_vector = vectorizer.transform([processed_text])

        # Generate predictions
        prediction = model.predict(input_vector)
        confidence_scores = model.predict_proba(input_vector)

        # Decode predicted label
        sentiment = label_encoder.inverse_transform(prediction)[0]

        return sentiment, confidence_scores.tolist()[0]

    except Exception as e:
        logger.error(f"Sentiment prediction failed: {str(e)}")
        return "neutral", [0.0, 1.0, 0.0]