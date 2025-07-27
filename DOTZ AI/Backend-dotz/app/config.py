import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY")
    JWT_SECRET = os.getenv("JWT_SECRET")
    AES_KEY = os.getenv("AES_KEY")
    MODEL_PATH = os.getenv("MODEL_PATH", "./models")
    UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", "./uploads")
    FEDERATED_DIR = os.getenv("FEDERATED_DIR", "./federated")

# Ensure critical keys exist
if not Config.SECRET_KEY or not Config.JWT_SECRET or not Config.AES_KEY:
    raise ValueError("Missing critical environment variables! Check your .env file.")

config = Config()
