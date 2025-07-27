import requests
import base64
from app.schemas.image_schema import ImageGenerationRequest, ImageGenerationResponse

API_URL = "https://api-inference.huggingface.co/models/ZB-Tech/Text-to-Image"

def query(payload, huggingface_token):
    try:
        headers = {"Authorization": f"Bearer {huggingface_token}"}
        response = requests.post(API_URL, headers=headers, json=payload)
        response.raise_for_status()
        return response.content
    except requests.exceptions.RequestException as e:
        print(f"API request error: {e}")
        return None

def process_image_generation(request: ImageGenerationRequest, huggingface_token) -> ImageGenerationResponse:
    try:
        image_bytes = query({"inputs": request.prompt}, huggingface_token)

        if image_bytes is None:
            return ImageGenerationResponse(image_data="") # Use image_data here.

        img_str = base64.b64encode(image_bytes).decode("utf-8")
        print(f"Base64 Image Data (first 100 chars): {img_str[:100]}...")
        return ImageGenerationResponse(image_data=img_str) # Use image_data here.

    except Exception as e:
        print(f"Error processing image: {e}")
        return ImageGenerationResponse(image_data="") # Use image_data here.