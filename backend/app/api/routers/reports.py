from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from datetime import date
from app.db.database import get_db
from app.models import models
from app.schemas import schemas

# Assuming you have an authentication dependency set up. 
# If it's in a different path like app.core.security, update the import below accordingly.
from app.api.dependencies import get_current_user

# Note: Check your main.py. If main.py already adds an "/api" prefix when including 
# this router, change the prefix below to just "/reports".
router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.get("/master-books")
def get_master_books(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Returns a master list of all books."""
    # Using string 'book' or models.ItemType.book depending on your exact SQLAlchemy model definition
    return db.query(models.CatalogItem).filter(models.CatalogItem.item_type == "book").all()

@router.get("/master-movies")
def get_master_movies(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Returns a master list of all movies."""
    return db.query(models.CatalogItem).filter(models.CatalogItem.item_type == "movie").all()

@router.get("/master-members")
def get_master_members(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Returns a master list of all registered members."""
    return db.query(models.Member).all()

@router.get("/active-issues")
def get_active_issues(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Returns a list of all items currently issued but not yet returned."""
    # Join Transactions with CatalogItems and Members to get readable names instead of just IDs
    active_txs = db.query(
        models.Transaction, 
        models.CatalogItem.name.label("item_name"), 
        models.Member.membership_id
    ).join(models.CatalogItem, models.Transaction.item_id == models.CatalogItem.id)\
     .join(models.Member, models.Transaction.member_id == models.Member.id)\
     .filter(models.Transaction.is_returned == False).all()
    
    result = []
    for tx, item_name, membership_id in active_txs:
        result.append({
            "transaction_id": tx.id,
            "item_name": item_name,
            "membership_id": membership_id,
            "issue_date": tx.issue_date,
            "expected_return_date": tx.expected_return_date
        })
    return result

@router.get("/overdue")
def get_overdue_returns(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Returns all transactions that are past their expected return date."""
    # Find transactions that are not returned and past the expected return date
    overdue_transactions = db.query(models.Transaction).filter(
        models.Transaction.is_returned == False,
        models.Transaction.expected_return_date < date.today()
    ).all()
    
    results = []
    for txn in overdue_transactions:
        item = db.query(models.CatalogItem).filter(models.CatalogItem.id == txn.item_id).first()
        member = db.query(models.Member).filter(models.Member.id == txn.member_id).first()
        
        # Calculate days overdue
        days_overdue = (date.today() - txn.expected_return_date).days
        
        results.append({
            "transaction_id": txn.id,
            "item_name": item.name if item else "Unknown Item",
            "member_id": member.membership_id if member else "Unknown Member",
            "issue_date": txn.issue_date,
            "expected_return_date": txn.expected_return_date,
            "days_overdue": days_overdue,
            "current_fine": days_overdue * 10.0 # Assuming 10 Rs/units per day
        })
    return results