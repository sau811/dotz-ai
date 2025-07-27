from app.utils.jwt_handler import generate_token
from app.schemas.auth_schema import UserRegister, UserLogin, TokenResponse

# Dummy User Database (Replace with real DB later)
users_db = {}

def register_user(request: UserRegister) -> TokenResponse:
    """Registers a new user and returns a JWT token"""
    if request.username in users_db:
        raise ValueError("User already exists")
    
    users_db[request.username] = request.password  # Store password (Hash this in production)
    token = generate_token(request.username)
    return TokenResponse(access_token=token, token_type="bearer")

def login_user(request: UserLogin) -> TokenResponse:
    """Authenticates user and returns a JWT token"""
    if request.username not in users_db or users_db[request.username] != request.password:
        raise ValueError("Invalid username or password")

    token = generate_token(request.username)
    return TokenResponse(access_token=token, token_type="bearer")
