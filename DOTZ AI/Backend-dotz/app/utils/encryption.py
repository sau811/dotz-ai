# encryption.py
from cryptography.fernet import Fernet

# Generate a secret key (Only once, store it safely!)
# key = Fernet.generate_key()
SECRET_KEY = b"your-secret-key-here"  # Replace with actual key

cipher = Fernet(SECRET_KEY)

def encrypt_file(data: bytes) -> bytes:
    """Encrypts file data"""
    return cipher.encrypt(data)

def decrypt_file(data: bytes) -> bytes:
    """Decrypts file data"""
    return cipher.decrypt(data)
