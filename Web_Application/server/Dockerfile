FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Create default requirements file
COPY requirements.txt* ./
RUN if [ ! -f "requirements.txt" ]; then \
    echo "fastapi==0.105.0\n\
uvicorn==0.24.0\n\
pydantic==2.5.2\n\
python-jose==3.3.0\n\
passlib==1.7.4\n\
pymongo==4.6.1\n\
motor==3.3.2\n\
python-multipart==0.0.6\n\
bcrypt==4.0.1\n\
nltk==3.8.1\n\
scikit-learn==1.3.2\n\
pandas==2.1.3\n\
numpy==1.26.2\n\
imblearn==0.0\n\
websockets==11.0.3" > requirements.txt; \
fi

# Install dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create necessary directories if they don't exist
RUN mkdir -p app/models data

# Create basic structure only if files don't exist
RUN if [ ! -f "app/models/__init__.py" ]; then \
        touch app/models/__init__.py; \
    fi && \
    if [ ! -f "main.py" ]; then \
        echo 'import uvicorn\n\
from fastapi import FastAPI\n\n\
app = FastAPI()\n\n\
@app.get("/")\n\
def read_root():\n\
    return {"message": "Welcome to Mental Health Monitoring System API"}\n\n\
if __name__ == "__main__":\n\
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)' > main.py; \
    fi

# Download NLTK data
RUN python -c "import nltk; nltk.download('stopwords'); nltk.download('wordnet')" || \
    echo "NLTK download failed, continuing anyway"

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]