import os
from vosk import Model, KaldiRecognizer, SetLogLevel
import subprocess
import pyaudio
import struct
import webbrowser
import pywhatkit
import cv2
import logging
import requests
import json
import pyttsx3  # Import pyttsx3

SetLogLevel(0)  # Reduce Vosk logging
logging.basicConfig(level=logging.INFO)

model_path = "D:\\Dotz AI\\backend\\models\\vosk-model-en-us-0.22"  # Replace with your Vosk model path
model = Model(model_path)
rec = KaldiRecognizer(model, 16000)  # Adjusted sample rate to 16000 Hz

piper_path = "D:\\Dotz AI\\backend\\piper\\piper.exe"  # Adjust the path to your Piper executable (not used in this pyttsx3 version)
voice_path = "D:\\Dotz AI\\backend\\piper\\voices\\en_US-amy-low.onnx"  # Adjust the path to your Piper voice file (not used)
piper_dir = "D:\\Dotz AI\\backend\\piper"  # The directory containing piper.exe (not used)

pa = pyaudio.PyAudio()

# HF_TOKEN = "YOUR_HUGGINGFACE_API_TOKEN"  # If you are NOT using Hugging Face
# API_URL = "https://api-inference.huggingface.co/models/microsoft/speecht5_tts"
# headers = {"Authorization": f"Bearer {HF_TOKEN}"} if HF_TOKEN else {}

def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.content

def webm_to_wav(webm_file, wav_file):
    try:
        subprocess.run(['ffmpeg', '-i', webm_file, '-ar', '16000', wav_file], # Explicitly set output sample rate to 16000 Hz
                       check=True, capture_output=True, text=True)
        return True
    except subprocess.CalledProcessError as e:
        print(f'FFMPEG Conversion Error: {e}')
        print(f'FFMPEG Output (stderr):\n{e.stderr}') # Print stderr for more info
        return False

def transcribe_audio(file_path: str) -> str:
    try:
        wav_file_path = os.path.abspath("temp_converted.wav")
        if webm_to_wav(file_path, wav_file_path):
            with open(wav_file_path, "rb") as f:
                rec.AcceptWaveform(f.read())
            result = rec.FinalResult()
            os.remove(wav_file_path)
            return result[14:-3]  # Extract text from JSON
        else:
            return ""
    except Exception as e:
        print(f"Vosk transcription error: {e}")
        return ""

engine = pyttsx3.init()  # Initialize pyttsx3 engine

def text_to_speech(text: str, output_file: str = "output.wav"):
    logging.info(f"Using pyttsx3 TTS for: {text}")
    try:
        engine.save_to_file(text, output_file)
        engine.runAndWait()
        return output_file
    except Exception as e:
        logging.error(f"pyttsx3 TTS error: {e}")
        return ""

def text_to_speech_alternative(text: str, output_file: str = "output_alt.wav", use_shell=False):
    return text_to_speech(text, output_file)

def play_audio(audio_file: str):
    try:
        subprocess.run(["ffplay", "-nodisp", "-autoexit", audio_file], check=True)
    except Exception as e:
        print(f"Audio playback error: {e}")

def open_webpage(query: str):
    try:
        webbrowser.open(f"https://www.google.com/search?q={query}")
    except Exception as e:
        print(f"Error opening webpage: {e}")

def play_youtube_video(video_name: str):
    try:
        pywhatkit.playonyt(video_name)
    except Exception as e:
        print(f"Error playing YouTube video: {e}")

def play_spotify_song(song_name: str):
    try:
        pywhatkit.playonyt(song_name + " spotify")
    except Exception as e:
        print(f"Error playing Spotify song: {e}")

def make_whatsapp_call(contact_name: str):
    try:
        webbrowser.open(f"https://web.whatsapp.com/send?phone=+1{contact_name}") # Replace with actual phone number.
    except Exception as e:
        print(f"Error opening whatsapp web: {e}")

def make_skype_call(contact_name: str):
    try:
        webbrowser.open(f"skype:{contact_name}?call")
    except Exception as e:
        print(f"Error opening skype: {e}")

def take_picture():
    try:
        cap = cv2.VideoCapture(0)  # 0 represents the default webcam
        ret, frame = cap.read()
        if ret:
            cv2.imwrite("captured_image.jpg", frame)
            print("Picture captured and saved as captured_image.jpg")
        else:
            print("Failed to capture picture.")
        cap.release()
    except Exception as e:
        print(f"Error taking picture: {e}")

def send_whatsapp_message(phone_number: str, message: str):
    try:
        pywhatkit.sendwhatmsg_instantly(phone_number, message)
        print("WhatsApp message sent.")
    except Exception as e:
        print(f"Error sending WhatsApp message: {e}")

def process_voice_command(audio_file: str):
    transcribed_text = transcribe_audio(audio_file)
    if transcribed_text:
        print(f"Transcribed: {transcribed_text}")
        if "youtube" in transcribed_text.lower():
            video_name = transcribed_text.replace("youtube", "").strip()
            play_youtube_video(video_name)
        elif "spotify" in transcribed_text.lower():
            song_name = transcribed_text.replace("spotify", "").strip()
            play_spotify_song(song_name)
        elif "search" in transcribed_text.lower():
            query = transcribed_text.replace("search", "").strip()
            open_webpage(query)
        elif "call" in transcribed_text.lower() and "whatsapp" in transcribed_text.lower():
            contact_name = transcribed_text.replace("call", "").replace("whatsapp", "").strip()
            make_whatsapp_call(contact_name)
        elif "call" in transcribed_text.lower() and "skype" in transcribed_text.lower():
            contact_name = transcribed_text.replace("call", "").replace("skype", "").strip()
            make_skype_call(contact_name)
        elif "take picture" in transcribed_text.lower():
            take_picture()
        elif "send whatsapp" in transcribed_text.lower():
            try:
                parts = transcribed_text.lower().split()
                to_index = parts.index("to")
                message_index = parts.index("message")
                phone_number = "".join(filter(str.isdigit, " ".join(parts[to_index + 1:message_index])))
                message = " ".join(parts[message_index + 1:])
                send_whatsapp_message(phone_number, message)
            except ValueError:
                print("Error extracting phone number and message")
        else:
            response_text = f"You said: {transcribed_text}"
            output_wav = "response.wav"
            text_to_speech(response_text, output_wav)  # Now using pyttsx3
            # text_to_speech_alternative(response_text, output_wav) # Also uses pyttsx3
            play_audio(output_wav)
    else:
        print("Could not transcribe audio.")

def cleanup_voice_service():
    pa.terminate()