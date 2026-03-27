from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from datetime import date
from app.db.database import get_db
from app.models import models
from app.schemas import schemas
from app.api.dependencies import get_current_user

router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.get("/master-books", response_model=List[schemas.CatalogItemResponse])
def get_master_books(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.CatalogItem).filter(models.CatalogItem.item_type == models.ItemType.book).all()

@router.get("/master-movies", response_model=List[schemas.CatalogItemResponse])
def get_master_movies(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.CatalogItem).filter(models.CatalogItem.item_type == models.ItemType.movie).all()

@router.get("/overdue")
def get_overdue_returns(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # Find transactions that are not returned and past the expected return date
    overdue_transactions = db.query(models.Transaction).filter(
        models.Transaction.is_returned == False,
        models.Transaction.expected_return_date < date.today()
    ).all()
    
    results = []
    for txn in overdue_transactions:
        item = db.query(models.CatalogItem).filter(models.CatalogItem.id == txn.item_id).first()
        member = db.query(models.Member).filter(models.Member.id == txn.member_id).first()
        days_overdue = (date.today() - txn.expected_return_date).days
        
        results.append({
            "transaction_id": txn.id,
            "item_name": item.name,
            "member_id": member.membership_id,
            "issue_date": txn.issue_date,
            "expected_return_date": txn.expected_return_date,
            "days_overdue": days_overdue,
            "current_fine": days_overdue * 10.0 # Assuming 10 units per day
        })
    return results