# 🧠 Project MoodSync - Mental Health Monitoring System

> An AI-powered mental health monitoring platform with real-time crisis detection, designed for Sri Lankan communities and beyond.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688.svg)](https://fastapi.tiangolo.com/)

## 🌟 Overview

A comprehensive mental health monitoring system that leverages machine learning for sentiment analysis and mood prediction. The platform provides personalized mental health support, connects users with local professionals, and includes real-time crisis detection to prevent life-threatening situations.

**🎯 Mission**: Democratize mental health support and make it accessible to everyone, especially in Sri Lankan communities.

## ✨ Key Features

- 🤖 **AI-Powered Sentiment Analysis** - Real-time mood detection from text inputs
- 🚨 **Crisis Detection & Alerts** - Automated risk assessment with emergency notifications
- 👨‍⚕️ **Healthcare Professional Integration** - Connect with local mental health specialists
- 📊 **Mood Visualization** - Track mental health trends over time
- 💬 **Anonymous Chat Support** - Safe space for users to express themselves
- 🌍 **Sri Lankan Context** - Culturally adapted content and local healthcare integration
- 📱 **Multi-Platform Support** - Web, mobile-responsive design
- 👨‍👩‍👧‍👦 **Family Alerts** - Notify loved ones during crisis situations
- 🎯 **Personalized Recommendations** - AI-driven coping strategies and motivation

## 🛠️ Tech Stack

### Frontend
- **React** with Vite & TypeScript
- **Tailwind CSS** + Flowbite UI
- **WebSocket** for real-time features

### Backend
- **FastAPI** (Python) - Main backend with ML integration
- **Node.js** (TypeScript) - Microservices architecture
- **MongoDB** - Primary database
- **Redis** - Caching and real-time data

### Machine Learning
- **scikit-learn** - Sentiment classification
- **NLTK** - Natural language processing
- **pandas** - Data manipulation
- **SMOTE** - Handling imbalanced datasets

### Infrastructure
- **Docker** & Docker Compose
- **Nginx** - Reverse proxy
- **OAuth 2** - Authentication

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- Docker & Docker Compose
- MongoDB

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/iamgaganam/MoodSync.git
   cd Web-Application
   ```

2. **Environment Setup**
   ```bash
   # Copy environment files
   cp server/.env.example server/.env
   cp servern/.env.example servern/.env
   
   # Update environment variables with your configurations
   ```

3. **Using Docker (Recommended)**
   ```bash
   docker-compose up --build
   ```

4. **Manual Setup**
   ```bash
   # Backend (FastAPI)
   cd server
   pip install -r requirements.txt
   uvicorn server.main:app --reload
   
   # Microservice (Node.js)
   cd ../servern
   npm install
   npm run dev
   
   # Frontend (React)
   cd ../client
   npm install
   npm run dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:5173
   - FastAPI Backend: http://localhost:8000
   - Node.js Service: http://localhost:3001

## 📖 Usage

1. **User Registration**: Create an account with basic information
2. **Mood Tracking**: Log daily moods through text or voice input
3. **AI Analysis**: Get real-time sentiment analysis and personalized insights
4. **Professional Help**: Book appointments with local mental health professionals
5. **Crisis Support**: Automatic detection and emergency contact alerts
6. **Community**: Join anonymous support groups and discussions

## 📊 ML Model Performance

- **Accuracy**: 93% on test dataset
- **Precision**: 96% for crisis detection
- **Recall**: 97% for high-risk cases
- **Dataset**: 50,000+ mental health sentiment records

## 🔐 Privacy & Security

- End-to-end encryption (AES-256) for all sensitive data
- GDPR compliant data handling
- Anonymous usage options
- Secure authentication with OAuth 2
- Regular security audits

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Crisis Resources

**Sri Lanka Emergency Contacts:**
- National Suicide Prevention: 1926
- Sumithrayo: 0112 682 535
- Emergency Services: 119

**International:**
- Crisis Text Line: Text HOME to 741741
- International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/

## 👨‍💻 Author

**Your Name**
- GitHub: [@iamgaganam](https://github.com/iamgaganam/MoodSync)
- LinkedIn: [Gagana Methmal](https://www.linkedin.com/in/gagana-methmal/)
- Email: gaganam220@gmail.com

## 🙏 Acknowledgments

- Dr. Deshantha Pathinayake who provided guidance
- Mana Suwa Piyasa (මනසුවපියස) – Mental Health Clinic for collaboration
- Open-source community for amazing tools and libraries
- Mr. Gayan Perera for valuable feedback

---

**⚠️ Disclaimer**: This application is designed to support mental health but is not a substitute for professional medical advice, diagnosis, or treatment. If you're experiencing a mental health crisis, please contact emergency services or a mental health professional immediately.