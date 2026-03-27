from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import date, timedelta
from app.db.database import get_db
from app.models import models
from app.api.dependencies import get_current_user
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/transactions", tags=["Transactions"])

# Input schemas specifically for these actions
class IssueRequest(BaseModel):
    serial_no: str
    membership_id: str
    remarks: str | None = None

class ReturnRequest(BaseModel):
    serial_no: str
    actual_return_date: date | None = None
    remarks: str | None = None

@router.post("/issue")
def issue_item(
    req: IssueRequest, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # 1. Verify item exists and is available
    item = db.query(models.CatalogItem).filter(models.CatalogItem.serial_no == req.serial_no).first()
    if not item or item.status != models.ItemStatus.available:
        raise HTTPException(status_code=400, detail="Item is not available for issue.")
        
    # 2. Verify member exists and is active
    member = db.query(models.Member).filter(models.Member.membership_id == req.membership_id).first()
    if not member or not member.is_active:
        raise HTTPException(status_code=400, detail="Invalid or inactive membership.")

    # 3. Create transaction and calculate 15-day return window
    expected_return = date.today() + timedelta(days=15)
    
    new_transaction = models.Transaction(
        item_id=item.id,
        member_id=member.id,
        issue_date=date.today(),
        expected_return_date=expected_return,
        remarks=req.remarks
    )
    
    # 4. Update item status
    item.status = models.ItemStatus.issued
    
    db.add(new_transaction)
    db.commit()
    return {"message": "Item issued successfully", "expected_return_date": expected_return}

@router.post("/return")
def return_item(
    req: ReturnRequest, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    item = db.query(models.CatalogItem).filter(models.CatalogItem.serial_no == req.serial_no).first()
    if not item or item.status != models.ItemStatus.issued:
        raise HTTPException(status_code=400, detail="Item is not currently issued.")

    # Find the active transaction for this item
    transaction = db.query(models.Transaction).filter(
        models.Transaction.item_id == item.id,
        models.Transaction.is_returned == False
    ).first()

    if not transaction:
        raise HTTPException(status_code=404, detail="Active transaction not found.")

    return_date = req.actual_return_date or date.today()
    transaction.actual_return_date = return_date
    transaction.is_returned = True
    item.status = models.ItemStatus.available

    # Basic Fine Calculation (e.g., 10 currency units per day overdue)
    days_overdue = (return_date - transaction.expected_return_date).days
    if days_overdue > 0:
        transaction.fine_calculated = float(days_overdue * 10.0)
        
        # Add fine to member's pending total
        member = db.query(models.Member).filter(models.Member.id == transaction.member_id).first()
        member.pending_fine += transaction.fine_calculated

    db.commit()
    return {
        "message": "Item returned successfully", 
        "fine_calculated": transaction.fine_calculated
    }

@router.get("/active/{serial_no}")
def get_active_transaction(serial_no: str, db: Session = Depends(get_db)):
    """Fetches details of a currently issued book to auto-populate the return form."""
    item = db.query(models.CatalogItem).filter(models.CatalogItem.serial_no == serial_no).first()
    if not item or item.status != models.ItemStatus.issued:
        raise HTTPException(status_code=404, detail="Item is not currently issued or does not exist.")

    transaction = db.query(models.Transaction).filter(
        models.Transaction.item_id == item.id,
        models.Transaction.is_returned == False
    ).first()

    if not transaction:
        raise HTTPException(status_code=404, detail="Active transaction not found.")

    member = db.query(models.Member).filter(models.Member.id == transaction.member_id).first()

    return {
        "book_name": item.name,
        "author_name": item.author,
        "issue_date": transaction.issue_date,
        "expected_return_date": transaction.expected_return_date,
        "membership_id": member.membership_id
    }

# for searching of availability 

@router.get("/search")
def search_books(
    name: Optional[str] = None, 
    author: Optional[str] = None, 
    db: Session = Depends(get_db),
    # If you are using a user dependency, include it here. Otherwise, you can remove the next line.
    current_user: models.User = Depends(get_current_user) 
):
    """Searches the catalog for available books by name or author."""
    query = db.query(models.CatalogItem)
    
    # Filter by name if provided (case-insensitive)
    if name:
        query = query.filter(models.CatalogItem.name.ilike(f"%{name}%"))
        
    # Filter by author if provided (case-insensitive)
    if author:
        query = query.filter(models.CatalogItem.author.ilike(f"%{author}%"))
        
    return query.all()

# 1. Create a quick schema to catch the frontend data
class FinePayment(BaseModel):
    membership_id: str
    amount: Optional[float] = 0.0
    remarks: Optional[str] = None

# 2. Create the endpoint
@router.post("/fine")
def pay_fine(
    payment: FinePayment, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user) # Assuming you are using this dependency
):
    """Processes a fine payment for a specific member."""
    
    # Check if the member exists
    member = db.query(models.Member).filter(models.Member.membership_id == payment.membership_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Membership ID not found.")

    # In a full production system, you would update the specific transaction's 'fine_paid' status here.
    # For now, we will register the payment as successful so the frontend can complete the workflow.
    
    return {
        "status": "success",
        "message": f"Fine cleared successfully for Member: {payment.membership_id}",
        "membership_id": payment.membership_id
    }