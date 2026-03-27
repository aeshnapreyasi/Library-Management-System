from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
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