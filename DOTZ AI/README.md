# Dotz AI – Empowering Digital Interactions

Dotz AI is an open-source personal assistant project developed by Bhagavath Narenthranath R and Sauhandikaa S, aiming to create a powerful, all-in-one assistant capable of chatting, generating images, and handling file uploads — completely offline and API-free.

## 🚀 Current Features Implemented
- ✅ Real-time **Chat** interface (local model or mock logic)
- ✅ **Image Generation** using internal models
- ✅ **File Upload** support and routing

> Note: No external APIs are used in this version. Everything is handled internally or mocked for demonstration.

## 🏗️ Features Under Development
- 🔄 Voice interaction (WebRTC + speech-to-text) `# TODO`
- 🔄 Video chat integration `# TODO`
- 🔐 Authentication system `# TODO`
- 📊 Data analysis tools `# TODO`
- 🧠 Model training/LLM hosting `# TODO`

## 📂 Folder Structure
```
Backend-dotz/    # FastAPI backend
Frontend-dotz/   # Vite + React + Tailwind frontend
LICENSE
README.md
```

## ⚙️ Local Setup

### 🔧 Prerequisites
- Node.js & npm
- Python 3.10+
- pip or poetry

### 🛠️ Backend Setup (FastAPI)
```bash
cd Backend-dotz
pip install -r requirements.txt
uvicorn main:app --reload
```

### 💻 Frontend Setup (React + Vite)
```bash
cd Frontend-dotz
npm install
npm run dev
```

## 🌱 Environment Variables
Create a `.env` file using the `.env.example` as a base.

## 📄 License
This project is licensed under the MIT License – see the [LICENSE](./LICENSE) file for details.

## 👤 Author
Developed with vision and creativity by Bhagavath Narenthranath R and Sauhandikaa S.
