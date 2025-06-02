from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import strawberry
from strawberry.fastapi import GraphQLRouter
from typing import List, Optional
import uvicorn
from database import engine, Base
from routes import router
from graphql_schema import schema

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Customer Feedback System API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Local development
        "https://*.vercel.app",   # Vercel deployments
        "https://feedback-gather-inze.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include REST API routes
app.include_router(router, prefix="/api")

# Include GraphQL routes
graphql_app = GraphQLRouter(schema)
app.include_router(graphql_app, prefix="/graphql")

# Basic health check endpoint
@app.get("/")
async def root():
    return {"message": "Customer Feedback System API is running"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 