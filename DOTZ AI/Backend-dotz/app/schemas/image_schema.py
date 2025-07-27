from pydantic import BaseModel

class ImageGenerationRequest(BaseModel):
    prompt: str

class ImageGenerationResponse(BaseModel):
    image_data: str # Use image_data here.