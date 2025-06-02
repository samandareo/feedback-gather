import pytest
from fastapi.testclient import TestClient
from main import app
from database import get_db, engine, Base
from sqlalchemy.orm import sessionmaker

client = TestClient(app)

# Create a test database session
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

def test_signup():
    response = client.post("/api/auth/signup", json={"email": "test@example.com", "password": "testpassword"})
    assert response.status_code == 200
    assert response.json()["email"] == "test@example.com"

def test_login():
    response = client.post("/api/auth/login", data={"username": "test@example.com", "password": "testpassword"})
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_create_survey():
    # First, login to get the token
    login_response = client.post("/api/auth/login", data={"username": "test@example.com", "password": "testpassword"})
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    survey_data = {
        "title": "Test Survey",
        "description": "A test survey",
        "questions": [
            {"text": "What is your favorite color?", "is_open_ended": True}
        ]
    }
    response = client.post("/api/survey/", json=survey_data, headers=headers)
    assert response.status_code == 200
    assert response.json()["title"] == "Test Survey" 