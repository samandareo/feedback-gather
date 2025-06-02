from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base, engine
import models
from auth import get_password_hash

def init_db():
    print("Creating database tables...")
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    # Create a session
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        # Check if test user already exists
        existing_user = db.query(models.User).filter(models.User.email == "test@example.com").first()
        if not existing_user:
            # Create a test user
            test_user = models.User(
                email="test@example.com",
                hashed_password=get_password_hash("password123"),
                is_active=True,
                is_superuser=False
            )
            db.add(test_user)
            db.commit()
            print("Test user created successfully!")
        else:
            print("Test user already exists!")
        
        print("Database initialized successfully!")
    except Exception as e:
        print(f"Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()

# NOTE: If you have an existing database, you may need to delete it and re-run this script to add the is_active column to the Survey table.

if __name__ == "__main__":
    init_db() 