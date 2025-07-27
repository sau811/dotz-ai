# image_routes.py
from fastapi import APIRouter, HTTPException, status
from app.services.image_service import process_image_generation
from app.schemas.image_schema import ImageGenerationRequest, ImageGenerationResponse

router = APIRouter()

HUGGINGFACE_TOKEN = "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" #Place your token here.

@router.post("/", response_model=ImageGenerationResponse)
async def generate_image_endpoint(request: ImageGenerationRequest):
    try:
        image_response = process_image_generation(request, HUGGINGFACE_TOKEN) #Pass the token.
        return image_response
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Internal Server Error: {e}")