# encryption_service.py
from app.utils.encryption import encrypt_file, decrypt_file

def encrypt_data(data: bytes) -> bytes:
    """Encrypts raw binary data using AES-256 encryption."""
    return encrypt_file(data)

def decrypt_data(data: bytes) -> bytes:
    """Decrypts raw binary data using AES-256 encryption."""
    return decrypt_file(data)
