# file_service.py
import os
import shutil
from fastapi import UploadFile
from app.utils.encryption import encrypt_file, decrypt_file

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def save_file(file: UploadFile) -> str:
    """Save an uploaded file securely"""
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    
    with open(file_path, "wb") as f:
        encrypted_data = encrypt_file(file.file.read())
        f.write(encrypted_data)
    
    return file.filename

def get_file(filename: str) -> bytes:
    """Retrieve an encrypted file and decrypt it"""
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    with open(file_path, "rb") as f:
        decrypted_data = decrypt_file(f.read())
    
    return decrypted_data
