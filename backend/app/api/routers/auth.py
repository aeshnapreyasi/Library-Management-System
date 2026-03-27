from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models import models
from app.schemas import schemas
from app.core.security import verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, get_password_hash
from datetime import timedelta

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/login", response_model=schemas.Token)
def login(user_credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    # 1. Find user in database
    user = db.query(models.User).filter(models.User.username == user_credentials.username).first()
    
    # 2. Verify existence and password
    if not user or not verify_password(user_credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 3. Generate JWT Token with role payload
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "is_admin": user.is_admin}, 
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register", response_model=schemas.UserResponse)
def register_user(user_in: schemas.UserLogin, db: Session = Depends(get_db)):
    """
    Creates a new system user (Admin or Normal User).
    """
    # 1. Check if user already exists
    existing_user = db.query(models.User).filter(models.User.username == user_in.username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered."
        )
    
    # 2. Hash the password and create user object
    hashed_pass = get_password_hash(user_in.password)
    
    # Note: In a real production app, 'is_admin' should be restricted.
    # For this project, we allow the frontend to pass the flag for easier testing.
    new_user = models.User(
        username=user_in.username,
        password_hash=get_password_hash(user_in.password),
        is_admin=user_in.is_admin, # Now correctly maps from the request
        is_active=True
    )
    
    # 3. Save to PostgreSQL
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user