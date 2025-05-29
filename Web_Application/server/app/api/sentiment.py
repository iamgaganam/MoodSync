from fastapi import APIRouter
from pydantic import BaseModel
from server.app.models.sentiment_model import predict_sentiment
from server.app.models.preprocessing import preprocess_text

router = APIRouter()


class StatementRequest(BaseModel):
    """Input model for sentiment analysis requests"""
    statement: str


@router.post("/predict/")
async def predict_sentiment_endpoint(request: StatementRequest):
    """Analyze sentiment of input text and return confidence scores"""
    # Preprocess input text
    processed_text = preprocess_text(request.statement)

    # Generate sentiment prediction with confidence scores
    sentiment, confidence_scores = predict_sentiment(processed_text)

    return {
        "sentiment": sentiment,
        "confidence": confidence_scores
    }