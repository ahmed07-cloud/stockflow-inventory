from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import Transaction
from schemas import TransactionResponse

router = APIRouter(
    prefix="/transactions",
    tags=["Transactions"]
)


@router.get("/", response_model=list[TransactionResponse])
def get_transactions(db: Session = Depends(get_db)):

    transactions = db.query(Transaction).order_by(
        Transaction.id.desc()
    ).all()

    return transactions


@router.get("/{transaction_id}", response_model=TransactionResponse)
def get_transaction(
    transaction_id: int,
    db: Session = Depends(get_db)
):

    transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id
    ).first()

    if transaction is None:
        from fastapi import HTTPException

        raise HTTPException(
            status_code=404,
            detail="Transaction not found"
        )

    return transaction