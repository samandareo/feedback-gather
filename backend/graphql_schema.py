import strawberry
from typing import List, Optional
from datetime import datetime
from database import get_db
import models

@strawberry.type
class QuestionOption:
    id: int
    text: str
    question_id: int

@strawberry.type
class Question:
    id: int
    text: str
    is_open_ended: bool
    survey_id: int
    options: List[QuestionOption]

@strawberry.type
class Survey:
    id: int
    title: str
    description: Optional[str]
    is_active: bool
    questions: List[Question]

@strawberry.type
class Answer:
    id: int
    text: str
    question_id: int
    response_id: int

@strawberry.type
class Response:
    id: int
    survey_id: int
    submitted_at: str
    answers: List[Answer]

@strawberry.type
class Query:
    @strawberry.field
    def get_surveys(self) -> List[Survey]:
        db = next(get_db())
        surveys = db.query(models.Survey).all()
        return surveys

    @strawberry.field
    def get_survey(self, id: int) -> Optional[Survey]:
        db = next(get_db())
        survey = db.query(models.Survey).filter(models.Survey.id == id).first()
        return survey

    @strawberry.field
    def get_survey_responses(self, survey_id: int) -> List[Response]:
        db = next(get_db())
        responses = db.query(models.Response).filter(models.Response.survey_id == survey_id).all()
        return responses

@strawberry.type
class Mutation:
    @strawberry.mutation
    def submit_response(self, survey_id: int, answers: List[str]) -> Response:
        db = next(get_db())
        response = models.Response(
            survey_id=survey_id,
            submitted_at=datetime.utcnow().isoformat()
        )
        db.add(response)
        db.flush()

        for i, answer_text in enumerate(answers):
            answer = models.Answer(
                response_id=response.id,
                question_id=i + 1,  # Assuming question IDs are sequential
                text=answer_text
            )
            db.add(answer)

        db.commit()
        db.refresh(response)
        return response

schema = strawberry.Schema(query=Query, mutation=Mutation) 