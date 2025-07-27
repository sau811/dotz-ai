# file_schema.py
from pydantic import BaseModel

class FileUploadResponse(BaseModel):
    filename: str
    file_url: str

class FileDownloadRequest(BaseModel):
    filename: str
