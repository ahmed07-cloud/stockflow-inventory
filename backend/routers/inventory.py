from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Product, Transaction
from schemas import StockTransactionCreate

router = APIRouter(
    prefix="/inventory",
    tags=["Inventory"]
)


# Stock In
@router.post("/stock-in")
def stock_in(
    data: StockTransactionCreate,
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(
        Product.id == data.product_id
    ).first()

    if product is None:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    previous_stock = product.quantity
    product.quantity += data.quantity

    transaction = Transaction(
        product_id=product.id,
        type="IN",
        quantity=data.quantity,
        previous_stock=previous_stock,
        new_stock=product.quantity,
        reason=data.reason,
        notes=data.notes
    )

    db.add(transaction)
    db.commit()
    db.refresh(product)

    return {
        "message": "Stock added successfully",
        "product_id": product.id,
        "previous_stock": previous_stock,
        "new_stock": product.quantity
    }


# Stock Out
@router.post("/stock-out")
def stock_out(
    data: StockTransactionCreate,
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(
        Product.id == data.product_id
    ).first()

    if product is None:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    if data.quantity > product.quantity:
        raise HTTPException(
            status_code=400,
            detail="Insufficient stock"
        )

    previous_stock = product.quantity
    product.quantity -= data.quantity

    transaction = Transaction(
        product_id=product.id,
        type="OUT",
        quantity=data.quantity,
        previous_stock=previous_stock,
        new_stock=product.quantity,
        reason=data.reason,
        notes=data.notes
    )

    db.add(transaction)
    db.commit()
    db.refresh(product)

    return {
        "message": "Stock removed successfully",
        "product_id": product.id,
        "previous_stock": previous_stock,
        "new_stock": product.quantity
    }
# Low Stock Products
@router.get("/low-stock")
def get_low_stock(db: Session = Depends(get_db)):

    products = db.query(Product).filter(
        Product.quantity <= Product.min_stock
    ).all()

    return products