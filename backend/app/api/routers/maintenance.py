from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import date, timedelta
from app.db.database import get_db
from app.models import models
from app.schemas import schemas
from app.api.dependencies import get_current_admin_user

router = APIRouter(prefix="/api/maintenance", tags=["Maintenance"])

@router.post("/catalog", response_model=schemas.CatalogItemResponse)
def add_catalog_item(
    item: schemas.CatalogItemCreate, 
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user) # Protects this route
):
    # Check if serial number already exists
    existing_item = db.query(models.CatalogItem).filter(models.CatalogItem.serial_no == item.serial_no).first()
    if existing_item:
        raise HTTPException(status_code=400, detail="Serial number already exists.")
        
    new_item = models.CatalogItem(**item.model_dump())
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.post("/memberships")
def create_membership(
    member: schemas.MemberCreate, 
    db: Session = Depends(get_db), 
    current_admin: models.User = Depends(get_current_admin_user) # Protects this route
):
    """Creates a new library member, auto-generates ID, and calculates end date."""
    
    # 1. Prevent duplicate Aadhar registrations
    existing_member = db.query(models.Member).filter(models.Member.aadhar_card_no == member.aadhar_card_no).first()
    if existing_member:
        raise HTTPException(status_code=400, detail="A member with this Aadhar Card already exists.")

    # 2. Auto-generate the Membership ID (e.g., M-001, M-002)
    last_member = db.query(models.Member).order_by(models.Member.id.desc()).first()
    if last_member and last_member.membership_id and last_member.membership_id.startswith("M-"):
        try:
            last_num = int(last_member.membership_id.split("-")[1])
            new_id = f"M-{last_num + 1:03d}"
        except ValueError:
            new_id = "M-001"
    else:
        new_id = "M-001"

    # 3. Calculate expiration date based on the selected duration from frontend
    start_date = date.today()
    if member.membership_type == "6_months":
        end_date = start_date + timedelta(days=180)
    elif member.membership_type == "1_year":
        end_date = start_date + timedelta(days=365)
    elif member.membership_type == "2_years":
        end_date = start_date + timedelta(days=730)
    else:
        end_date = start_date + timedelta(days=180) # Default fallback

    # 4. Save to the database
    new_member = models.Member(
        membership_id=new_id,
        first_name=member.first_name,
        last_name=member.last_name,
        contact_number=member.contact_number,
        contact_address=member.contact_address,
        aadhar_card_no=member.aadhar_card_no,
        start_date=start_date,
        end_date=end_date,
    )
    
    db.add(new_member)
    db.commit()
    db.refresh(new_member)
    
    return new_member