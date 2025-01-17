from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# Download NLTK data
nltk.download('stopwords')
nltk.download('wordnet')

# Load the trained model, vectorizer, and label encoder
model = joblib.load("mental_health_model.pkl")  # Replace with your model file path
vectorizer = joblib.load("vectorizer.pkl")  # Replace with your vectorizer file path
label_encoder = joblib.load("label_encoder.pkl")  # Replace with your label encoder file path

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins; replace with frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic model for input validation
class StatementRequest(BaseModel):
    statement: str

# Text preprocessing function
def preprocess_text(text: str) -> str:
    lemmatizer = WordNetLemmatizer()
    stop_words = set(stopwords.words('english'))
    text = re.sub(r'[^a-zA-Z]', ' ', text).lower()
    words = [lemmatizer.lemmatize(word) for word in text.split() if word not in stop_words]
    return ' '.join(words)

# Health check endpoint
@app.get("/")
async def root():
    return {"message": "Hello, this is the mental health prediction API."}

# Prediction endpoint
@app.post("/predict/")
async def predict_sentiment(request: StatementRequest):
    # Preprocess the input statement
    processed_text = preprocess_text(request.statement)

    # Transform the text into vector format
    input_vector = vectorizer.transform([processed_text])

    # Predict the sentiment and confidence scores
    prediction = model.predict(input_vector)
    confidence_scores = model.predict_proba(input_vector)

    # Decode the predicted label
    sentiment = label_encoder.inverse_transform(prediction)[0]

    # Return the prediction and confidence scores
    return {
        "sentiment": sentiment,
        "confidence": confidence_scores.tolist()[0]
    }
