from pydantic import BaseModel

# Request schema for encryption
class EncryptRequest(BaseModel):
    text: str

# Response schema for encryption
class EncryptResponse(BaseModel):
    encrypted_text: str

# Request schema for decryption
class DecryptRequest(BaseModel):
    encrypted_text: str

# Response schema for decryption
class DecryptResponse(BaseModel):
    decrypted_text: str
