from fastapi import APIRouter
from pydantic import BaseModel
from server.app.models.sentiment_model import predict_sentiment
from server.app.models.preprocessing import preprocess_text

# Pydantic model for input validation
class StatementRequest(BaseModel):
    statement: str

# Initialize API router
router = APIRouter()

@router.post("/predict/")
async def predict_sentiment_endpoint(request: StatementRequest):
    # Preprocess the input statement
    processed_text = preprocess_text(request.statement)

    # Predict sentiment and confidence scores
    sentiment, confidence_scores = predict_sentiment(processed_text)

    return {
        "sentiment": sentiment,
        "confidence": confidence_scores
    }
