# 🧠 Mental Health Monitoring System

![Mental Health Monitoring System](https://img.shields.io/badge/Status-In%20Development-yellow)
![License](https://img.shields.io/badge/License-MIT-blue)
![Version](https://img.shields.io/badge/Version-1.0.0-green)

A comprehensive mental health monitoring platform leveraging ML and NLP to analyze user sentiment, track mood patterns, and provide personalized interventions. Built specifically with cultural sensitivity for Sri Lankan users while remaining accessible globally.

## 🎯 Problem Statement

Mental health issues affect millions worldwide, with many sufferers remaining undiagnosed or untreated due to stigma, lack of resources, or limited awareness. This project addresses three critical challenges:

1. **Early Detection**: Identifying concerning patterns in user expressions before they escalate to crisis
2. **Continuous Monitoring**: Providing unobtrusive, privacy-focused tracking of mental wellbeing indicators
3. **Personalized Support**: Delivering culturally-appropriate resources and connecting users with mental health professionals

## ✨ Key Features

### User Features
- **Multi-platform Sentiment Analysis**: Analyzes text from direct inputs and connected social media accounts (X, Facebook, Reddit)
- **Mood Tracking Dashboard**: Visualizes emotional patterns and trends over time with interactive graphs
- **Anonymous Professional Support**: Connect with mental health professionals without revealing personal identity
- **Personalized Coping Strategies**: Receive evidence-based interventions tailored to specific emotional states
- **Real-time Alert System**: Notifies designated emergency contacts during crisis situations
- **Motivational Content**: Daily quotes and positive reinforcement customized to individual needs
- **ML-Powered Chatbot**: Conversational AI for 24/7 support and feedback

### Professional Features
- **Clinical Dashboard**: Secure portal for mental health professionals to monitor patients
- **Communication Channel**: HIPAA-compliant messaging between professionals and users
- **Risk Assessment Tools**: Standardized screening instruments for professional evaluation

### Administrative Features
- **User Management**: Comprehensive tools to maintain user accounts and permissions
- **Content Management**: Interface to update resources, articles, and educational materials
- **Analytics Hub**: Aggregate (anonymized) data visualization for system-wide trends

## 🛠️ Technology Stack

### Frontend
- **React** with Vite and TypeScript
- **Tailwind CSS** with Flowbite components
- **Recharts** for data visualization

### Backend
- **FastAPI** for high-performance API endpoints and ML model integration
- **MongoDB** for flexible data storage
- **JWT** for secure authentication

### Machine Learning
- **Python** as the primary programming language
- **pandas** for data manipulation and analysis
- **scikit-learn** for traditional ML models:
  - TfidfVectorizer for text feature extraction
  - LogisticRegression for classification
  - GridSearchCV for hyperparameter tuning
- **imblearn** (SMOTE) for handling imbalanced datasets
- **NLTK** for natural language processing:
  - Stopword removal
  - WordNetLemmatizer for text normalization
- **Hugging Face Transformers** for advanced NLP (sentiment analysis and text generation)

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Layer  │    │  Service Layer  │    │    Data Layer   │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│                 │    │                 │    │                 │
│  React Frontend │◄──►│   FastAPI       │◄──►│   MongoDB       │
│  - User UI      │    │   - Auth        │    │   - User Data   │
│  - Doctor UI    │    │   - User API    │    │   - Analytics   │
│  - Admin UI     │    │   - Doctor API  │    │   - Resources   │
│                 │    │   - Admin API   │    │                 │
└─────────────────┘    ├─────────────────┤    └─────────────────┘
                       │   ML Pipeline   │
                       │   - Sentiment   │
                       │   - Risk Assess │
                       │   - Prediction  │
                       └─────────────────┘
```

## 🚀 Installation and Setup

### Prerequisites
- Node.js (v16+)
- Python (3.8+)
- MongoDB
- Git

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/mental-health-monitoring.git
cd mental-health-monitoring/backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run the FastAPI server
uvicorn app.main:app --reload
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

### ML Model Training
```bash
# Navigate to ml directory
cd ../ml

# Train sentiment analysis model
python train_sentiment.py

# Train risk assessment model
python train_risk.py
```

## 💻 Usage

### User Journey
1. Register an account or use anonymous mode
2. Connect social media accounts (optional)
3. Complete initial assessment
4. View personalized dashboard
5. Track mood and engage with recommended activities
6. Chat with the AI assistant or connect with professionals
7. Set up emergency contacts and customize alert thresholds

### Professional Journey
1. Register and verify credentials
2. Access assigned patient dashboards
3. Review sentiment analysis and risk assessments
4. Communicate with patients through secure channels
5. Document interventions and track progress

### Admin Journey
1. Login to administrative portal
2. Manage user accounts and professional verifications
3. Update resource database and content library
4. Monitor system performance and usage analytics

## 🔬 ML Model Details

### Sentiment Analysis Pipeline
1. **Data Collection**: Gather text inputs from user entries and social media
2. **Preprocessing**: Clean text, remove stopwords, apply lemmatization
3. **Feature Extraction**: Convert text to numerical features using TF-IDF
4. **Model Training**: Use logistic regression with optimized hyperparameters
5. **Evaluation**: Assess performance using accuracy, precision, recall, F1-score
6. **Deployment**: Serve model via FastAPI endpoints

### Risk Assessment Model
1. **Feature Engineering**: Combine sentiment scores, activity patterns, and user inputs
2. **Imbalanced Data Handling**: Apply SMOTE for oversampling minority classes
3. **Model Selection**: Evaluate multiple classifiers (Logistic Regression, Random Forest, SVM)
4. **Threshold Optimization**: Fine-tune decision thresholds for high recall on severe cases
5. **Continuous Learning**: Update models based on professional feedback

## 📁 Project Structure

```
mental-health-monitoring/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   └── services/
│   ├── tests/
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   └── tsconfig.json
├── ml/
│   ├── data/
│   ├── models/
│   ├── notebooks/
│   ├── src/
│   └── requirements.txt
└── README.md
```

## 🔮 Future Enhancements

- **Voice Analysis**: Adding speech emotion recognition for more comprehensive monitoring
- **Multimodal Analysis**: Incorporate facial expression analysis via optional webcam inputs
- **Federated Learning**: Implement privacy-preserving ML techniques to keep sensitive data on user devices
- **Wearable Integration**: Connect with fitness trackers and smartwatches for physiological data
- **Multilingual Support**: Expand NLP capabilities to include Sinhala and Tamil
- **Intervention Efficacy Tracking**: Measure and optimize the effectiveness of suggested coping strategies

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- Mental Health Foundation of Sri Lanka for domain expertise
- Open-source ML libraries and tools that made this project possible
- Academic advisors for guidance and support

---

*This project was developed as part of a BSc Hons Software Engineering final year project.*
