FROM python:3.9-slim

WORKDIR /app

# Create requirements.txt if it doesn't exist
RUN echo "fastapi==0.105.0\nuvicorn==0.24.0\npydantic==2.5.2\npython-jose==3.3.0\npasslib==1.7.4\npymongo==4.6.1\nmotor==3.3.2\npython-multipart==0.0.6\nbcrypt==4.0.1\nnltk==3.8.1\nscikit-learn==1.3.2\npandas==2.1.3\nnumpy==1.26.2\nimblearn==0.0\nwebsockets==11.0.3" > /app/requirements.txt

# Copy existing requirements.txt if it exists (will overwrite the one created above)
COPY requirements.txt* /app/

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p app/models data

# Create basic structure if not present
RUN if [ ! -f "app/models/__init__.py" ]; then mkdir -p app/models && touch app/models/__init__.py; fi
RUN if [ ! -f "main.py" ]; then echo 'import uvicorn\nfrom fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get("/")\ndef read_root():\n    return {"message": "Welcome to Mental Health Monitoring System API"}\n\nif __name__ == "__main__":\n    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)' > main.py; fi

# Download NLTK data
RUN python -c "import nltk; nltk.download('stopwords'); nltk.download('wordnet')" || echo "NLTK download failed, continuing anyway"

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]