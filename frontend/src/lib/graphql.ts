import { GraphQLClient } from 'graphql-request';
import { API_URL } from '@/config';

const GRAPHQL_URL = `${API_URL}/graphql`;

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
  text: string;
  isOpenEnded: boolean;
  options: QuestionOption[];
}

export interface Survey {
  id: number;
  title: string;
  description: string | null;
  isActive: boolean;
  questions: Question[];
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
      isActive
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
      isActive
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