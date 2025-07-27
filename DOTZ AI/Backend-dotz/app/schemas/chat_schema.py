from pydantic import BaseModel
from typing import Optional

class ChatRequest(BaseModel):
    user_id: Optional[str] = "default"
    message: str
