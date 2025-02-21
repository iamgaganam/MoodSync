import joblib
import os

# Define the correct path to the data directory
data_directory = os.path.join(os.path.dirname(__file__), '../../data')

# Load the trained model, vectorizer, and label encoder from the 'data' directory
model = joblib.load(os.path.join(data_directory, "mental_health_model.pkl"))
vectorizer = joblib.load(os.path.join(data_directory, "vectorizer.pkl"))
label_encoder = joblib.load(os.path.join(data_directory, "label_encoder.pkl"))

def predict_sentiment(processed_text: str):
    # Transform the text into vector format
    input_vector = vectorizer.transform([processed_text])

    # Predict the sentiment and confidence scores
    prediction = model.predict(input_vector)
    confidence_scores = model.predict_proba(input_vector)

    # Decode the predicted label
    sentiment = label_encoder.inverse_transform(prediction)[0]

    return sentiment, confidence_scores.tolist()[0]
