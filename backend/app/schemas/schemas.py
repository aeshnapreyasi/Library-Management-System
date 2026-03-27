from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import date
from enum import Enum

# Define matching Enums for Pydantic
class ItemType(str, Enum):
    book = "book"
    movie = "movie"

class MembershipDuration(str, Enum):
    six_months = "6_months"
    one_year = "1_year"
    two_years = "2_years"

# --- AUTH & USER SCHEMAS ---
class UserLogin(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=8, max_length=72)
    is_admin: bool = False  # Allow frontend to specify role during registration (for testing)

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    is_admin: bool = False

class UserResponse(BaseModel):
    id: int
    username: str
    is_admin: bool
    is_active: bool

    class Config:
        from_attributes = True  # Allows Pydantic to read SQLAlchemy models

# --- CATALOG SCHEMAS (Books/Movies) ---
class CatalogItemCreate(BaseModel):
    serial_no: str
    item_type: ItemType
    name: str
    author: str
    category: str
    cost: Optional[float] = 0.0
    procurement_date: Optional[date] = None

class CatalogItemResponse(CatalogItemCreate):
    id: int
    status: str

    class Config:
        from_attributes = True

class CatalogItemCreate(BaseModel):
    item_type: str
    serial_no: str
    name: str
    author: str
    category: str
    cost: Optional[float] = 0.0
    procurement_date: date

class MemberCreate(BaseModel):
    first_name: str
    last_name: str
    contact_number: str
    contact_address: str
    aadhar_card_no: str
    membership_type: str