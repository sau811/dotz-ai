import jwt
import datetime

SECRET_KEY = "your-secret-key"  # Change this to a secure secret!

def generate_token(username: str) -> str:
    """Generates a JWT token"""
    payload = {
        "sub": username,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

def verify_token(token: str) -> str:
    """Verifies the JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload["sub"]
    except jwt.ExpiredSignatureError:
        return None
