import axios from 'axios';
import { AuthResponse, LoginFormData, SignupFormData, Survey, Response, SurveyCreate } from '@/types';
import { API_URL as baseURL } from '@/config';
const API_URL = `${baseURL}/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: async (data: LoginFormData): Promise<AuthResponse> => {
    // Convert to form data format
    const formData = new URLSearchParams();
    formData.append('username', data.username);
    formData.append('password', data.password);

    const response = await api.post<AuthResponse>('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  signup: async (data: SignupFormData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/signup', data);
    return response.data;
  },
};

export const surveys = {
  create: async (data: SurveyCreate): Promise<Survey> => {
    const response = await api.post<Survey>('/survey/', data);
    return response.data;
  },

  get: async (id: number): Promise<Survey> => {
    const response = await api.get<Survey>(`/survey/${id}`);
    return response.data;
  },

  getByToken: async (token: string): Promise<Survey> => {
    const response = await api.get<Survey>(`/survey/shared/${token}`);
    return response.data;
  },

  list: async (): Promise<Survey[]> => {
    const response = await api.get<Survey[]>('/survey/');
    return response.data;
  },

  getResponses: async (surveyId: number): Promise<Response[]> => {
    const response = await api.get<Response[]>(`/responses/${surveyId}`);
    return response.data;
  },

  submitResponses: async (surveyId: number, responses: { question_id: number; answer: string }[]): Promise<Response[]> => {
    const response = await api.post<Response[]>(`/responses/${surveyId}`, responses);
    return response.data;
  },

  generateShareLink: async (surveyId: number): Promise<{ share_token: string }> => {
    const response = await api.post<{ share_token: string }>(`/survey/${surveyId}/share`);
    return response.data;
  },

  updateStatus: async (surveyId: number, is_active: boolean): Promise<Survey> => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/surveys/${surveyId}/status?is_active=${is_active}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Failed to update survey status');
    return res.json();
  },

  update: async (surveyId: number, data: SurveyCreate): Promise<Survey> => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/surveys/${surveyId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update survey');
    return res.json();
  },

  getAnalytics: async (surveyId: number): Promise<any> => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/survey/${surveyId}/analytics`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  },

  deleteSurvey: async (surveyId: number): Promise<void> => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/surveys/${surveyId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Failed to delete survey');
  },

  exportResponses: async (surveyId: number): Promise<Blob> => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/survey/${surveyId}/export`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Failed to export responses');
    return res.blob();
  },
};

export default api; 