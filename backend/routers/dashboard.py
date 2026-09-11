from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import Product, Transaction

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


# Dashboard Statistics
@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db)
):

    products = db.query(Product).all()

    total_products = len(products)

    total_stock = sum(
        product.quantity for product in products
    )

    total_inventory_value = sum(
        product.quantity * product.price
        for product in products
    )

    low_stock = sum(
        1
        for product in products
        if product.quantity <= product.min_stock
        and product.quantity > 0
    )

    out_of_stock = sum(
        1
        for product in products
        if product.quantity == 0
    )

    return {
        "total_products": total_products,
        "total_stock": total_stock,
        "total_inventory_value": total_inventory_value,
        "low_stock": low_stock,
        "out_of_stock": out_of_stock
    }


# Recent Transactions
@router.get("/recent-transactions")
def get_recent_transactions(
    db: Session = Depends(get_db)
):

    transactions = db.query(Transaction).order_by(
        Transaction.id.desc()
    ).limit(5).all()

    return transactions