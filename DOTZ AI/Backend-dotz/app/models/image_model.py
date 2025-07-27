# image_model.py
from diffusers import StableDiffusionPipeline
import torch

pipe = StableDiffusionPipeline.from_pretrained(
    "runwayml/stable-diffusion-v1-5",
    torch_dtype=torch.float32,
    use_safetensors=True,
    low_cpu_mem_usage=False,
    device_map=None
).to("cuda" if torch.cuda.is_available() else "cpu")

pipe.safety_checker = None

def generate_image(prompt: str):
    with torch.inference_mode():
        image = pipe(prompt).images[0]
    return image