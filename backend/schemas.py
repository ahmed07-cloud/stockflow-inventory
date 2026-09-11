from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ProductCreate(BaseModel):
    name: str
    sku: str
    category: str
    quantity: int = 0
    unit: str = "pcs"
    price: float = 0
    min_stock: int = 0
    description: Optional[str] = ""


class ProductResponse(ProductCreate):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class StockTransactionCreate(BaseModel):
    product_id: int
    quantity: int
    reason: Optional[str] = ""
    notes: Optional[str] = ""


class TransactionResponse(BaseModel):
    id: int
    product_id: int
    type: str
    quantity: int
    previous_stock: int
    new_stock: int
    reason: Optional[str] = ""
    notes: Optional[str] = ""
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
