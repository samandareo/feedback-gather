from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    is_superuser: bool

    class Config:
        from_attributes = True

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Survey schemas
class QuestionOptionBase(BaseModel):
    text: str

class QuestionOptionCreate(QuestionOptionBase):
    pass

class QuestionOption(QuestionOptionBase):
    id: int
    question_id: int

    class Config:
        from_attributes = True

class QuestionBase(BaseModel):
    text: str
    is_open_ended: bool
    order: Optional[int] = None

class QuestionCreate(QuestionBase):
    options: List[QuestionOptionCreate]

class Question(QuestionBase):
    id: int
    survey_id: int
    options: List[QuestionOption]

    class Config:
        from_attributes = True

class SurveyBase(BaseModel):
    title: str
    description: Optional[str] = None
    is_active: Optional[bool] = True

class SurveyCreate(SurveyBase):
    questions: List[QuestionCreate]

class Survey(SurveyBase):
    id: int
    user_id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    share_token: Optional[str] = None
    is_active: bool
    questions: List[Question] = []

    class Config:
        orm_mode = True

# Response schemas
class AnswerBase(BaseModel):
    text: str
    question_id: int

class AnswerCreate(AnswerBase):
    pass

class Answer(AnswerBase):
    id: int
    response_id: int

    class Config:
        from_attributes = True

class ResponseBase(BaseModel):
    question_id: int
    answer: str

class ResponseCreate(ResponseBase):
    pass

class Response(ResponseBase):
    id: int
    survey_id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ShareToken(BaseModel):
    share_token: str 