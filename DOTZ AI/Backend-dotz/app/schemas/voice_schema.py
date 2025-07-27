# voice_schema.py
from pydantic import BaseModel

class VoiceRequest(BaseModel):
    audio_file: str

class VoiceResponse(BaseModel):
    text: str

class TTSRequest(BaseModel):
    text: str

class TTSResponse(BaseModel):
    audio_file: str