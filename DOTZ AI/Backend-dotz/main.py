import os
import uvicorn
import logging
import threading
import time
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import random
import subprocess

# Import route modules
from app.routes.chat_routes import router as chat_router
from app.routes.voice_routes import router as voice_router
##from app.routes.video_routes import router as video_router
from app.routes.security_routes import router as security_router
from app.routes.image_routes import router as image_router
from app.routes.file_routes import router as file_router
from app.routes.analysis_routes import router as analysis_router

# Configure Logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("DotzAI")

# FastAPI App
app = FastAPI(
    title="Dotz AI Backend",
    description="AI-powered assistant with Chat, Voice, Video, Security, AI Training, and Image Generation.",
    version="1.0.1",
    openapi_tags=[
        {"name": "Chat", "description": "AI-powered chat assistant"},
        {"name": "Voice", "description": "Real-time Speech-to-Text & AI Voice Assistant"},
        {"name": "Video", "description": "Real-time AI Video Processing with WebRTC"},
        {"name": "Security", "description": "AES-256 Encryption & Decryption"},
        {"name": "Image Generation", "description": "Generate high-quality AI images"},
        {"name": "File Uploads", "description": "Upload and process files"},
        {"name": "Real-time AI Analysis", "description": "AI-powered real-time video and voice analysis"},
    ]
)

# Track Server Start Time
START_TIME = time.time()

# Enable CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure upload directory exists
UPLOAD_DIR = os.path.join("static", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# File upload route
@app.post("/upload-file")
async def upload_file(file: UploadFile = File(...)):
    try:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as f:
            f.write(await file.read())
        return JSONResponse(content={"fileUrl": f"http://127.0.0.1:8000/static/uploads/{file.filename}"}, status_code=200)  # Updated to 8000
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

# Include All Routes
app.include_router(chat_router, prefix="/chat", tags=["Chat"])
app.include_router(voice_router, prefix="/voice", tags=["Voice"])
#app.include_router(video_router, prefix="/video", tags=["Video"])
app.include_router(security_router, prefix="/security", tags=["Security"])
app.include_router(image_router, prefix="/image", tags=["Image Generation"])
app.include_router(file_router, prefix="/file", tags=["File Uploads"])
app.include_router(analysis_router, prefix="/analysis", tags=["Real-time AI Analysis"])

# Serve Static Files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Root and Health Check Routes
@app.get("/", tags=["Default"])
def read_root():
    return {"message": "🚀 Dotz AI Backend is running!"}

@app.get("/health", tags=["Default"])
def health_check():
    uptime = round(time.time() - START_TIME, 2)
    return {"status": "OK", "uptime": f"{uptime} seconds", "message": "Backend is running smoothly!"}

# WebSocket Endpoint (root-level, optional)
active_connections = set()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.add(websocket)
    logger.info(f"✅ WebSocket Connection Established: {websocket.client}")
    try:
        while True:
            data = await websocket.receive_text()
            logger.info(f"📩 Received WebSocket Message: {data}")
            if "image" in data.lower():
                response = {
                    "text": "Here's an AI-generated image!",
                    "attachment": {
                        "type": "image",
                        "content": f"http://127.0.0.1:8000/static/images/sample-{random.randint(1,100)}.jpg"  # Updated to 8000
                    }
                }
            elif "file" in data.lower():
                response = {
                    "text": "Here's an AI-generated document!",
                    "attachment": {
                        "type": "pdf",
                        "content": f"http://127.0.0.1:8000/static/files/sample-{random.randint(1,100)}.pdf"  # Updated to 8000
                    }
                }
            else:
                response = {
                    "text": f"You said: {data}",
                    "attachment": None
                }
            await websocket.send_json(response)
    except WebSocketDisconnect:
        logger.warning(f"⚠️ WebSocket Disconnected: {websocket.client}")
        active_connections.remove(websocket)
    except Exception as e:
        logger.error(f"❌ WebSocket Error: {e}")
        active_connections.remove(websocket)

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("🛑 Shutting down Dotz AI Backend...")
    for connection in active_connections:
        await connection.close()
    logger.info("✅ All WebSocket connections closed.")


# Simplified Play Media Endpoint
@app.post("/voice/play-media")
async def play_media():
    try:
        # Construct the path to your virtual environment's Python interpreter
        venv_python_path = os.path.join(os.getcwd(), "venv", "Scripts", "python.exe") # For Windows
        if not os.path.exists(venv_python_path):
            venv_python_path = os.path.join(os.getcwd(), "venv", "bin", "python") # For Linux/macOS

        # Use the explicit path to run your simplified script
        subprocess.Popen([venv_python_path, "your_simplified_script.py"])
        return {"message": "Attempting to play media based on voice command..."}
    except Exception as e:
        return {"error": f"Could not start media playback script: {e}"}


# Start the FastAPI Server
if __name__ == "__main__":
    logger.info("🚀 Starting Dotz AI Backend on port 8000...")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)  # Changed to 8000