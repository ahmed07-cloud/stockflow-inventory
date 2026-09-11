
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import bcrypt

from database import get_db
from models import User

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/login")
def login(
    email: str,
    password: str,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.email == email
    ).first()

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not bcrypt.checkpw(
        password.encode("utf-8"),
        user.password.encode("utf-8")
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    return {
        "message": "Login successful",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }

