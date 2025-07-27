from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.utils.jwt_handler import verify_token

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    """Extracts and verifies the JWT token from Authorization header."""
    token = credentials.credentials
    username = verify_token(token)
    if not username:
        raise HTTPException(status_code=401, detail="Unauthorized: Invalid or expired token.")
    return username
