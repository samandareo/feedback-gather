import { GraphQLClient } from 'graphql-request';

const GRAPHQL_URL = 'http://localhost:8000/graphql';

export const graphqlClient = new GraphQLClient(GRAPHQL_URL, {
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to update the auth token
export const updateAuthToken = (token: string | null) => {
  if (token) {
    graphqlClient.setHeader('Authorization', `Bearer ${token}`);
  } else {
    graphqlClient.setHeader('Authorization', '');
  }
};

// Only initialize token on client side
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('token');
  if (token) {
    updateAuthToken(token);
  }
}

export interface QuestionOption {
  id: number;
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

export interface Survey {
  id: number;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  user_id: number;
  questions: Question[];
  share_token?: string;
  is_active: boolean;
}

export interface GetSurveysResponse {
  getSurveys: Survey[];
}

export interface GetSurveyResponse {
  getSurvey: Survey;
}

export const GET_SURVEYS = `
  query GetSurveys {
    getSurveys {
      id
      title
      description
      created_at
      updated_at
      user_id
      is_active
      share_token
      questions {
        id
        text
        isOpenEnded
        options {
          id
          text
        }
      }
    }
  }
`;

export const GET_SURVEY = `
  query GetSurvey($id: Int!) {
    getSurvey(id: $id) {
      id
      title
      description
      created_at
      updated_at
      user_id
      is_active
      share_token
      questions {
        id
        text
        isOpenEnded
        options {
          id
          text
        }
      }
    }
  }
`; 