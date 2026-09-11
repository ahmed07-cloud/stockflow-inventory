
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import bcrypt

from routers import inventory
from database import engine, Base, SessionLocal
import models
from models import User

from routers import products
from routers import transactions
from routers import dashboard
from routers import auth


Base.metadata.create_all(bind=engine)


db = SessionLocal()

admin = db.query(User).filter(
    User.email == "admin@stockflow.com"
).first()

if admin is None:
    hashed_password = bcrypt.hashpw(
        b"admin123",
        bcrypt.gensalt()
    ).decode("utf-8")

    admin = User(
        name="Admin",
        email="admin@stockflow.com",
        password=hashed_password,
        role="admin"
    )

    db.add(admin)
    db.commit()

else:
    # Convert old plain-text password to bcrypt hash
    if not admin.password.startswith("$2"):
        hashed_password = bcrypt.hashpw(
            admin.password.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")

        admin.password = hashed_password
        db.commit()

db.close()


app = FastAPI(
    title="StockFlow API",
    description="Inventory Tracking System Backend",
    version="1.0.0"
)


allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "")
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]
if allowed_origins_env:
    for o in allowed_origins_env.split(","):
        if o.strip():
            origins.append(o.strip())

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(products.router)
app.include_router(inventory.router)
app.include_router(transactions.router)
app.include_router(dashboard.router)
app.include_router(auth.router)


@app.get("/")
def root():
    return {
        "message": "StockFlow Inventory Tracking System API",
        "status": "running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }

