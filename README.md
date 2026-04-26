# Vel Tech IDS: AI-Powered Intrusion Detection System

![Vel Tech IDS](frontend/public/vel%20tech%20logo.png)

## 🛡️ Project Overview
Vel Tech IDS is a premium web-based AI Intrusion Detection System designed to monitor network traffic and detect malicious activities using advanced Deep Learning models (CNN-LSTM Hybrid) and Classical Machine Learning algorithms (Random Forest, Decision Tree, Logistic Regression).

Built with a **Glassmorphic Dark Mode UI**, the platform provides an end-to-end pipeline from dataset processing to live traffic monitoring and real-time inference.

## 🚀 Key Features
- **Hybrid AI Core:** Combined CNN-LSTM architecture for spatial and temporal anomaly detection.
- **Dynamic Training:** Train multiple architectures on benchmark datasets (CICIDS, KDDCup99).
- **Preprocessing Engine:** Automated feature encoding, normalization, and sequence generation.
- **Testing Sandbox:** Live data entry for manual model verification.
- **Dynamic Analytics:** Real-time benchmarking charts using Recharts.
- **Live Interface:** Simulated and real packet capture monitoring with Scapy.

## 🛠️ Tech Stack
- **Frontend:** React (Vite), Tailwind CSS, Lucide-React, Recharts, Axios.
- **Backend:** Flask, TensorFlow/Keras, Scikit-Learn, Pandas, Scapy.
- **Deployment:** Render (Blueprints enabled).

## 📥 Installation

### Backend Setup
1. Navigate to `backend/`
2. Create a virtual environment: `python -m venv venv`
3. Activate: `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Mac/Linux)
4. Install dependencies: `pip install -r requirements.txt`
5. Run server: `python app.py`

### Frontend Setup
1. Navigate to `frontend/`
2. Install: `npm install`
3. Run: `npm run dev`

## ☁️ Deployment (Render)
This project is pre-configured for Render using the `render.yaml` blueprint.
1. Push this repo to GitHub.
2. In Render, select **New > Blueprint**.
3. Link your repository.
4. Render will automatically deploy the Backend and Frontend with the correct environment variables.

---
**Developed for the Major Project at Vel Tech Rangarajan Dr. Sagunthala R&D Institute of Science and Technology.**
