<div align="center">
  <h1>🛡️ WIChain</h1>
  <h3>Advanced Wi-Fi Spoofing & Evil Twin Detection Platform</h3>
  <p>Securing networks with <b>Machine Learning</b>, <b>Blockchain</b>, and <b>AI Threat Intelligence</b></p>
  
  <p>
    <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python"/>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
    <img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask"/>
    <img src="https://img.shields.io/badge/Blockchain-121D33?style=for-the-badge&logo=blockchain&logoColor=white" alt="Blockchain"/>
    <img src="https://img.shields.io/badge/Machine%20Learning-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white" alt="Machine Learning"/>
  </p>
</div>

---

## 🌟 Overview

**WIChain** is a cutting-edge security platform designed to detect zero-day Wi-Fi spoofing and Evil Twin attacks in real-time. By combining predictive machine learning models with a decentralized blockchain ledger, WIChain ensures that threat data is not only identified instantly but also stored immutably for forensic analysis. Furthermore, our integrated **AI Threat Intelligence** engine (powered by Baidu CoBuddy) provides actionable, deep-dive analysis of network anomalies.

## ✨ Key Features

- **📡 Real-Time Cross-Platform Scanning**: Scans and analyzes local Wi-Fi networks on Windows, macOS, and Linux without extra hardware.
- **🧠 Machine Learning Detection**: Uses trained models (`scikit-learn`) to predict malicious access points based on RSSI, encryption, vendors, and behavioral patterns.
- **⛓️ Blockchain Threat Ledger**: High-risk spoofing attempts are permanently logged on a custom blockchain, ensuring data integrity and tamper-proof history.
- **🤖 AI Threat Analysis**: Automatically analyzes scan results via OpenRouter (Baidu CoBuddy) to generate comprehensive threat reports and mitigation strategies.
- **📊 Modern Interactive Dashboard**: A highly responsive, dark-themed React frontend featuring GSAP animations, 3D elements (Three.js), and live data visualization (Recharts).

## 🛠️ Tech Stack

### Frontend (Client-Side)
- **React.js (Vite)**
- **Tailwind CSS**
- **GSAP & Framer Motion** (Animations)
- **Three.js & React Three Fiber** (3D Visuals)
- **Recharts** (Data Visualization)

### Backend (Server-Side)
- **Python & Flask**
- **SQLite** (Local Data Storage)
- **Scikit-Learn & Pandas** (Machine Learning Pipeline)
- **Custom Blockchain Implementation**
- **OpenRouter API** (LLM Integration)

## 📂 Project Structure

```
WIChain/
├── backend/
│   ├── app.py                 # Main Flask server
│   ├── blockchain.py          # Custom Blockchain implementation
│   ├── models/                # Pre-trained ML models (.pkl)
│   ├── oui.txt                # MAC address vendor resolution
│   ├── requirements.txt       # Python dependencies
│   └── wifi_networks.db       # SQLite database (auto-generated)
│
├── frontend/
│   ├── src/                   # React source code
│   │   ├── components/        # Reusable UI components
│   │   ├── Pages/             # Dashboard, Research, and Threat pages
│   │   └── App.jsx            # React Router & Main App
│   ├── package.json           # Node dependencies
│   └── vite.config.js         # Vite configuration
│
└── README.md                  # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)

### 1️⃣ Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up the OpenRouter API Key (for AI Analysis):
   ```bash
   export OPENROUTER_API_KEY="your_api_key_here"  # On Windows: set OPENROUTER_API_KEY="your_api_key_here"
   ```
5. Run the Flask server:
   ```bash
   python app.py
   ```
   *(The server will start on `http://localhost:5000`)*

### 2️⃣ Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *(The frontend will be available at `http://localhost:5173`)*

## 🛡️ How It Works

1. **Scan Phase**: The backend triggers OS-level Wi-Fi scans (`netsh`, `nmcli`, or `airport`) to gather nearby BSSIDs, SSIDs, signal strengths, and encryption types.
2. **Analysis Phase**: Data is passed through the pre-trained ML classifier. Rule-based checks also assess threat indicators (e.g., Open networks, duplicate SSIDs, unknown vendors).
3. **Ledger Phase**: If an Access Point is flagged as a high-risk "Spoof", the event is packaged into a transaction and mined onto the WIChain blockchain.
4. **Intelligence Phase**: The user can request an AI Analysis of the current network state, communicating with an LLM to receive tactical advice.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📄 License

This project is licensed under the MIT License.
