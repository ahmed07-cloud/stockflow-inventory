# StockFlow – Inventory Management System

## 1. Project Overview

StockFlow is a web-based Inventory Management System developed to manage products, monitor stock levels, record stock movements, and view inventory statistics.

The system provides a simple interface for managing inventory using a React frontend, FastAPI backend, and SQLite database.

## 2. Technologies Used

* React
* TypeScript
* FastAPI
* Python
* SQLAlchemy
* SQLite
* REST API
* Bcrypt
* Vite

## 3. Main Modules

### Authentication

* Admin login
* Email and password verification
* Bcrypt password hashing

### Product Management

* Add products
* View products
* Edit products
* Delete products
* Store product details such as SKU, category, price, and quantity

### Inventory Management

* Stock In
* Stock Out
* Low-stock monitoring
* Automatic stock quantity updates

### Transaction Management

* Records every Stock In and Stock Out operation
* Stores previous stock and new stock
* Stores reason and notes
* Displays transaction history

### Dashboard

* Total products
* Total stock
* Total inventory value
* Low-stock count
* Out-of-stock count
* Recent transactions

## 4. System Architecture

```text
User
  ↓
React + TypeScript Frontend
  ↓
REST API
  ↓
FastAPI Backend
  ↓
SQLAlchemy
  ↓
SQLite Database
```

## 5. Database

The system uses three main tables:

### Users

Stores administrator login information.

### Products

Stores product and inventory information.

### Transactions

Stores Stock In and Stock Out records.

## 6. Project Structure

```text
stockflow-inventory-management-ui/
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── stockflow.db
│   └── routers/
│       ├── auth.py
│       ├── products.py
│       ├── inventory.py
│       ├── transactions.py
│       └── dashboard.py
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── contexts/
│   └── lib/
│       └── api.ts
│
├── package.json
└── README.md
```

## 7. How to Run the Project

### Start Backend

Open a terminal inside the `backend` folder:

```text
.\venv\Scripts\python.exe -m uvicorn main:app --reload
```

Backend runs at:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

### Start Frontend

Open another terminal in the main project folder:

```text
npm.cmd run dev
```

Frontend runs at:

```text
http://localhost:5173/
```

## 8. Default Login

```text
Email: admin@stockflow.com
Password: admin123
```

## 9. API Endpoints

### Authentication

* `POST /auth/login`

### Products

* `GET /products/`
* `POST /products/`
* `GET /products/{id}`
* `PUT /products/{id}`
* `DELETE /products/{id}`

### Inventory

* `POST /inventory/stock-in`
* `POST /inventory/stock-out`
* `GET /inventory/low-stock`

### Transactions

* `GET /transactions/`
* `GET /transactions/{id}`

### Dashboard

* `GET /dashboard/stats`
* `GET /dashboard/recent-transactions`

## 10. Security

The administrator password is stored using Bcrypt hashing instead of storing the plain-text password.

## 11. Future Enhancements

* Multiple user roles
* User registration
* JWT authentication
* Product search and filtering
* Export inventory reports
* Email notifications for low stock
* Cloud database support

## 12. Conclusion

StockFlow provides a simple and efficient solution for managing inventory, tracking
