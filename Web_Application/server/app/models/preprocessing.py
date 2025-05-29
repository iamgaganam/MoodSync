import re
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer


def preprocess_text(text: str) -> str:
    """
    Clean and preprocess text for sentiment analysis
    """
    if not text or not isinstance(text, str):
        return ""

    lemmatizer = WordNetLemmatizer()
    stop_words = set(stopwords.words('english'))

    # Remove non-alphabetic characters and convert to lowercase
    text = re.sub(r'[^a-zA-Z]', ' ', text).lower()

    # Tokenize, lemmatize, and remove stopwords
    words = [
        lemmatizer.lemmatize(word)
        for word in text.split()
        if word not in stop_words and len(word) > 1
    ]

    return ' '.join(words)