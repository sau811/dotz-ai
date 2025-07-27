from pydantic import BaseModel
from typing import Optional
from app.models.chat_model import generate_response

class ChatRequest(BaseModel):
    user_id: Optional[str] = "default"
    message: str

async def process_chat(chat_request: ChatRequest) -> str:
    return await generate_response(chat_request.message, chat_request.user_id)
