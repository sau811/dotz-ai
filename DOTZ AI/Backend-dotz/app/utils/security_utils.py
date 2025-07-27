from Crypto.Cipher import AES
import base64
import os

SECRET_KEY = os.getenv("SECRET_KEY", "your-32-byte-secret-key").encode()

def pad(text):
    """Pads text to be a multiple of 16 bytes (AES block size)."""
    return text + (16 - len(text) % 16) * chr(16 - len(text) % 16)

def unpad(text):
    """Removes padding from text."""
    return text[:-ord(text[-1])]

def encrypt_message(text: str) -> str:
    """Encrypt a message using AES-256."""
    cipher = AES.new(SECRET_KEY, AES.MODE_CBC, SECRET_KEY[:16])
    encrypted = cipher.encrypt(pad(text).encode())
    return base64.b64encode(cipher.iv + encrypted).decode()

def decrypt_message(encrypted_text: str) -> str:
    """Decrypt a message using AES-256."""
    encrypted_text = base64.b64decode(encrypted_text)
    iv, encrypted = encrypted_text[:16], encrypted_text[16:]
    cipher = AES.new(SECRET_KEY, AES.MODE_CBC, iv)
    return unpad(cipher.decrypt(encrypted).decode())
