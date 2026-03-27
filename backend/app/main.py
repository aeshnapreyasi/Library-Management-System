from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import database setup
from app.db.database import engine, Base

# Import all routers
from app.api.routers import auth, maintenance, transactions, reports

# 1. Create all database tables based on our SQLAlchemy models
Base.metadata.create_all(bind=engine)

# 2. Initialize FastAPI
app = FastAPI(
    title="Library Management System API",
    description="Backend for the Library Management System academic project.",
    version="1.0.0"
)

# 3. Configure CORS (Crucial for React Frontend connection)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite's default local port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Include the routing modules
app.include_router(auth.router)
app.include_router(maintenance.router)
app.include_router(transactions.router)
app.include_router(reports.router)

# 5. Root endpoint for health check
@app.get("/")
def read_root():
    return {"status": "online", "message": "Library API is running."}