from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import timedelta
from typing import List
import secrets
from fastapi.responses import JSONResponse, StreamingResponse
import csv
from io import StringIO

from database import get_db
import models
import schemas
from auth import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_active_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

router = APIRouter()

@router.post("/auth/signup", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/auth/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/survey/", response_model=schemas.Survey)
def create_survey(
    survey: schemas.SurveyCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    from datetime import datetime
    from sqlalchemy import func

    # Create survey with timestamps
    db_survey = models.Survey(
        title=survey.title,
        description=survey.description,
        user_id=current_user.id,
        created_at=func.now(),
        updated_at=func.now()
    )
    db.add(db_survey)
    db.flush()

    # Create questions with order
    for idx, question in enumerate(survey.questions):
        db_question = models.Question(
            text=question.text,
            is_open_ended=question.is_open_ended,
            order=idx + 1,  # Start from 1
            survey_id=db_survey.id
        )
        db.add(db_question)
        db.flush()

        # Create options for multiple choice questions
        if not question.is_open_ended and question.options:
            for option in question.options:
                db_option = models.QuestionOption(
                    text=option.text,
                    question_id=db_question.id
                )
                db.add(db_option)

    db.commit()
    db.refresh(db_survey)
    return db_survey

@router.get("/survey/{survey_id}", response_model=schemas.Survey)
def get_survey(
    survey_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    survey = db.query(models.Survey).filter(models.Survey.id == survey_id).first()
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")
    if survey.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this survey")
    return survey

@router.post("/survey/{survey_id}/share", response_model=schemas.ShareToken)
def generate_share_link(
    survey_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    survey = db.query(models.Survey).filter(models.Survey.id == survey_id).first()
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")
    if survey.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to share this survey")
    
    # Generate a unique token
    share_token = secrets.token_urlsafe(32)
    survey.share_token = share_token
    db.commit()
    
    return {"share_token": share_token}

@router.get("/survey/shared/{token}", response_model=schemas.Survey)
def get_shared_survey(token: str, db: Session = Depends(get_db)):
    survey = db.query(models.Survey).filter(models.Survey.share_token == token).first()
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found or has expired")
    return survey

@router.post("/responses/{survey_id}", response_model=List[schemas.Response])
def submit_responses(
    survey_id: int,
    responses: List[schemas.ResponseCreate],
    db: Session = Depends(get_db)
):
    survey = db.query(models.Survey).filter(models.Survey.id == survey_id).first()
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")
    
    # Validate that all questions belong to the survey
    question_ids = {q.id for q in survey.questions}
    for response in responses:
        if response.question_id not in question_ids:
            raise HTTPException(
                status_code=400,
                detail=f"Question {response.question_id} does not belong to this survey"
            )
    
    # Create response records
    db_responses = []
    for response in responses:
        # Create the response
        db_response = models.Response(
            survey_id=survey_id,
            question_id=response.question_id,
            answer=response.answer,
            created_at=func.now()
        )
        db.add(db_response)
        db.flush()  # Flush to get the response ID
        
        # Create the answer
        db_answer = models.Answer(
            response_id=db_response.id,
            question_id=response.question_id,
            text=response.answer
        )
        db.add(db_answer)
        db_responses.append(db_response)
    
    db.commit()
    for db_response in db_responses:
        db.refresh(db_response)
    
    return db_responses

@router.get("/responses/{survey_id}", response_model=List[schemas.Response])
def get_survey_responses(
    survey_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    survey = db.query(models.Survey).filter(models.Survey.id == survey_id).first()
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")
    if survey.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view these responses")
    
    responses = db.query(models.Response).filter(models.Response.survey_id == survey_id).all()
    return responses

@router.get("/survey/", response_model=List[schemas.Survey])
def list_surveys(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    surveys = db.query(models.Survey).filter(models.Survey.user_id == current_user.id).all()
    return surveys

@router.patch("/surveys/{survey_id}/status", response_model=schemas.Survey)
def update_survey_status(survey_id: int, is_active: bool, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    survey = db.query(models.Survey).filter(models.Survey.id == survey_id, models.Survey.user_id == current_user.id).first()
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")
    survey.is_active = is_active
    db.commit()
    db.refresh(survey)
    return survey

@router.get("/surveys/shared/{token}", response_model=schemas.Survey)
def get_survey_by_token(token: str, db: Session = Depends(get_db)):
    survey = db.query(models.Survey).filter(models.Survey.share_token == token, models.Survey.is_active == True).first()
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found or inactive")
    return survey

@router.get("/surveys", response_model=List[schemas.Survey])
def list_surveys(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    return db.query(models.Survey).filter(models.Survey.user_id == current_user.id).all()

@router.get("/survey/{survey_id}/analytics")
def survey_analytics(survey_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    survey = db.query(models.Survey).filter(models.Survey.id == survey_id).first()
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")
    if survey.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this survey")

    analytics = []
    for question in survey.questions:
        if question.is_open_ended:
            # Collect all open-ended answers
            answers = [r.answer for r in db.query(models.Response).filter(models.Response.survey_id == survey_id, models.Response.question_id == question.id).all()]
            analytics.append({
                "question_id": question.id,
                "question_text": question.text,
                "type": "open_ended",
                "answers": answers
            })
        else:
            # Count each option
            option_counts = {}
            for option in question.options:
                count = db.query(models.Response).filter(models.Response.survey_id == survey_id, models.Response.question_id == question.id, models.Response.answer == option.text).count()
                option_counts[option.text] = count
            analytics.append({
                "question_id": question.id,
                "question_text": question.text,
                "type": "multiple_choice",
                "options": option_counts
            })
    return JSONResponse(content={"survey_id": survey_id, "analytics": analytics})

@router.delete("/surveys/{survey_id}")
def delete_survey(survey_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    survey = db.query(models.Survey).filter(models.Survey.id == survey_id, models.Survey.user_id == current_user.id).first()
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")
    db.delete(survey)
    db.commit()
    return {"message": "Survey deleted successfully"}

@router.put("/surveys/{survey_id}", response_model=schemas.Survey)
def update_survey(
    survey_id: int,
    survey: schemas.SurveyCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    db_survey = db.query(models.Survey).filter(models.Survey.id == survey_id, models.Survey.user_id == current_user.id).first()
    if not db_survey:
        raise HTTPException(status_code=404, detail="Survey not found")

    # Update survey fields
    db_survey.title = survey.title
    db_survey.description = survey.description
    db_survey.updated_at = func.now()

    # Delete existing questions and options
    for question in db_survey.questions:
        db.delete(question)

    # Create new questions with order
    for idx, question in enumerate(survey.questions):
        db_question = models.Question(
            text=question.text,
            is_open_ended=question.is_open_ended,
            order=idx + 1,  # Start from 1
            survey_id=db_survey.id
        )
        db.add(db_question)
        db.flush()

        # Create options for multiple choice questions
        if not question.is_open_ended and question.options:
            for option in question.options:
                db_option = models.QuestionOption(
                    text=option.text,
                    question_id=db_question.id
                )
                db.add(db_option)

    db.commit()
    db.refresh(db_survey)
    return db_survey

@router.get("/survey/{survey_id}/export")
def export_survey_responses(
    survey_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    survey = db.query(models.Survey).filter(models.Survey.id == survey_id).first()
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")
    if survey.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to export this survey's responses")

    # Get all responses for this survey
    responses = db.query(models.Response).filter(models.Response.survey_id == survey_id).all()
    
    # Create a CSV file in memory
    output = StringIO()
    writer = csv.writer(output)
    
    # Write header row with question texts
    header = ['Response ID', 'Submitted At']
    for question in survey.questions:
        header.append(question.text)
    writer.writerow(header)
    
    # Group responses by response ID
    response_groups = {}
    for response in responses:
        if response.id not in response_groups:
            response_groups[response.id] = {
                'created_at': response.created_at,
                'answers': {}
            }
        response_groups[response.id]['answers'][response.question_id] = response.answer
    
    # Write data rows
    for response_id, data in response_groups.items():
        row = [response_id, data['created_at']]
        for question in survey.questions:
            row.append(data['answers'].get(question.id, ''))
        writer.writerow(row)
    
    # Prepare the response
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={
            'Content-Disposition': f'attachment; filename="survey_{survey_id}_responses.csv"'
        }
    ) 