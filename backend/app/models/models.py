from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey, Float, Text, Enum
from sqlalchemy.orm import relationship
from app.db.database import Base
import enum
from datetime import date

# Enums for strict data validation
class ItemType(enum.Enum):
    book = "book"
    movie = "movie"

class ItemStatus(enum.Enum):
    available = "available"
    issued = "issued"
    lost = "lost"

class MembershipDuration(enum.Enum):
    six_months = "6_months"
    one_year = "1_year"
    two_years = "2_years"

# 1. System Users (For Admin/User Login)
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    is_admin = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)

# 2. Library Members (Patrons)
class Member(Base):
    __tablename__ = "members"

    id = Column(Integer, primary_key=True, index=True)
    membership_id = Column(String, unique=True, index=True, nullable=False) # e.g., M-001
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    contact_number = Column(String, nullable=False)
    contact_address = Column(Text, nullable=False)
    aadhar_card_no = Column(String, unique=True, nullable=False)
    start_date = Column(Date, nullable=False, default=date.today)
    end_date = Column(Date, nullable=False)
    membership_type = Column(Enum(MembershipDuration), nullable=False, default=MembershipDuration.six_months)
    is_active = Column(Boolean, default=True)
    pending_fine = Column(Float, default=0.0)

    # Relationships
    transactions = relationship("Transaction", back_populates="member")

# 3. Catalog (Books and Movies)
class CatalogItem(Base):
    __tablename__ = "catalog_items"

    id = Column(Integer, primary_key=True, index=True)
    serial_no = Column(String, unique=True, index=True, nullable=False) # e.g., SC(B)000001
    item_type = Column(Enum(ItemType), nullable=False, default=ItemType.book)
    name = Column(String, nullable=False)
    author = Column(String, nullable=False) # Applies to Director for movies
    category = Column(String, nullable=False) # e.g., Science, Economics
    status = Column(Enum(ItemStatus), nullable=False, default=ItemStatus.available)
    cost = Column(Float, nullable=True)
    procurement_date = Column(Date, nullable=False, default=date.today)
    
    # Relationships
    transactions = relationship("Transaction", back_populates="item")

# 4. Transactions (Issue, Return, Fines)
class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("catalog_items.id"), nullable=False)
    member_id = Column(Integer, ForeignKey("members.id"), nullable=False)
    
    issue_date = Column(Date, nullable=False, default=date.today)
    expected_return_date = Column(Date, nullable=False) # Populated automatically 15 days ahead based on PDF
    actual_return_date = Column(Date, nullable=True)
    
    fine_calculated = Column(Float, default=0.0)
    fine_paid = Column(Boolean, default=False)
    remarks = Column(Text, nullable=True)

    # Status tracking for the specific transaction
    is_returned = Column(Boolean, default=False)

    # Relationships
    item = relationship("CatalogItem", back_populates="transactions")
    member = relationship("Member", back_populates="transactions")