import cv2
import whisper
import torch
import numpy as np
import asyncio
from aiortc import MediaStreamTrack
from aiortc.contrib.media import MediaPlayer
from llama_cpp import Llama
import mediapipe as mp
from ultralytics import YOLO
import threading
import queue

# Load AI Models
chat_model = Llama(model_path="D:\\Dotz AI\\backend\\models\\mistral-7b-instruct-v0.1.Q5_K_M.gguf", n_ctx=4096, n_threads=6, n_batch=512)
whisper_model = whisper.load_model("base.en")  # Optimized for GTX 1650

# Load MediaPipe Hands for Sign Detection
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(min_detection_confidence=0.5, min_tracking_confidence=0.5)
mp_drawing = mp.solutions.drawing_utils

# Load YOLOv8 Model for Object Detection
yolo_model = YOLO("yolov8n.pt")

# Queue for real-time processing
audio_queue = queue.Queue()
response_queue = queue.Queue()

class VideoProcessor(MediaStreamTrack):
    """WebRTC Video Stream Processor for Real-Time AI Analysis"""

    kind = "video"

    def __init__(self, track):
        super().__init__()
        self.track = track

    async def recv(self):
        frame = await self.track.recv()
        img = frame.to_ndarray(format="bgr24")

        # Process Frame
        processed_img = self.process_frame(img)

        return frame.from_ndarray(processed_img, format="bgr24")

    def process_frame(self, frame):
        """Detect objects and signs in real-time"""

        # Object Detection using YOLOv8
        results = yolo_model(frame)
        for result in results:
            for box in result.boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                confidence = float(box.conf[0])

                if confidence > 0.5:
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                    label = f"{result.names[int(box.cls[0])]}: {confidence:.2f}"
                    cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

        # Hand Sign Detection
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = hands.process(rgb_frame)

        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                mp_drawing.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)

        return frame

def real_time_audio_processing():
    """Process real-time audio and send AI responses."""
    player = MediaPlayer("default", format="dshow")  # Windows default mic
    while True:
        frame = player.audio.recv()  # Get audio
        audio_data = np.frombuffer(frame.data, dtype=np.int16)

        # Convert speech to text using Whisper
        transcript = whisper_model.transcribe(audio_data)

        # Send AI-generated response
        ai_response = chat_model(transcript["text"])
        response_queue.put(ai_response)

def start_real_time_analysis():
    """Start real-time AI video + voice processing."""
    cap = cv2.VideoCapture(0)  # Use webcam

    # Start real-time audio processing in a separate thread
    threading.Thread(target=real_time_audio_processing, daemon=True).start()

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # Process the frame
        processed_frame = VideoProcessor.process_frame(VideoProcessor, frame)

        # Display the processed frame
        cv2.imshow("Real-Time AI Assistant", processed_frame)

        # Display AI response if available
        if not response_queue.empty():
            print("AI Response:", response_queue.get())

        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    cap.release()
    cv2.destroyAllWindows()
