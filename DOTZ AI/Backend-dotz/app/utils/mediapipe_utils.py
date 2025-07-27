import cv2
import mediapipe as mp

mp_holistic = mp.solutions.holistic

# Initialize Holistic with optimized settings
holistic = mp_holistic.Holistic(model_complexity=0)  # 0 for low-end GPUs

def process_frame(frame):
    """Process a single frame with MediaPipe Holistic"""
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = holistic.process(rgb_frame)
    return results
