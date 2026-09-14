from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Product, Transaction
from schemas import ProductCreate, ProductResponse

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)


# Create Product
@router.post("/", response_model=ProductResponse)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):

    existing = db.query(Product).filter(Product.sku == product.sku).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"A product with SKU '{product.sku}' already exists"
        )

    new_product = Product(
        name=product.name,
        sku=product.sku,
        category=product.category,
        quantity=product.quantity,
        unit=product.unit,
        price=product.price,
        min_stock=product.min_stock,
        description=product.description
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product


# Get All Products
@router.get("/", response_model=list[ProductResponse])
def get_products(db: Session = Depends(get_db)):

    products = db.query(Product).all()

    return products


# Get One Product
@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):

    product = db.query(Product).filter(Product.id == product_id).first()

    if product is None:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product


# Update Product
@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product_data: ProductCreate,
    db: Session = Depends(get_db)
):

    product = db.query(Product).filter(Product.id == product_id).first()

    if product is None:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    existing_sku = db.query(Product).filter(
        Product.sku == product_data.sku,
        Product.id != product_id
    ).first()
    if existing_sku:
        raise HTTPException(
            status_code=400,
            detail=f"A product with SKU '{product_data.sku}' already exists"
        )

    product.name = product_data.name
    product.sku = product_data.sku
    product.category = product_data.category
    product.quantity = product_data.quantity
    product.unit = product_data.unit
    product.price = product_data.price
    product.min_stock = product_data.min_stock
    product.description = product_data.description

    db.commit()
    db.refresh(product)

    return product


# Delete Product
@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):

    product = db.query(Product).filter(Product.id == product_id).first()

    if product is None:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    # Delete related transactions first to avoid FK constraint errors
    db.query(Transaction).filter(
        Transaction.product_id == product_id
    ).delete(synchronize_session=False)

    db.delete(product)
    db.commit()

    return {
        "message": "Product deleted successfully"
    }