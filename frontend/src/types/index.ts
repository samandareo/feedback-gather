export interface User {
  id: number;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface LoginFormData {
  username: string;
  password: string;
}

export interface SignupFormData {
  email: string;
  password: string;
}

export interface QuestionOption {
  id?: number;
  question_id?: number;
  text: string;
}

export interface Question {
  id: number;
  survey_id: number;
  text: string;
  is_open_ended: boolean;
  order: number;
  options: QuestionOption[];
}

export interface QuestionCreate {
  text: string;
  is_open_ended: boolean;
  order: number;
  options: QuestionOption[];
}

export interface Survey {
  id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  questions: Question[];
  share_token?: string;
  is_active: boolean;
}

export interface SurveyCreate {
  title: string;
  description: string;
  questions: QuestionCreate[];
}

export interface Response {
  id: number;
  survey_id: number;
  question_id: number;
  answer: string;
  created_at: string;
} 