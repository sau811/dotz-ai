from pydantic import BaseModel

class VideoStreamRequest(BaseModel):
    user_id: str
    video_data: str

class VideoStreamResponse(BaseModel):
    processed_video_data: str
