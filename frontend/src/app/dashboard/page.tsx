'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import CreateSurveyModal from './CreateSurveyModal';
import { graphqlClient, GET_SURVEYS, Survey, GetSurveysResponse } from '@/lib/graphql';
import { useQueryClient } from '@tanstack/react-query';
import { surveys as surveysApi } from '@/lib/api';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [isCreatingSurvey, setIsCreatingSurvey] = useState(false);
  const [editingSurvey, setEditingSurvey] = useState<Survey | null>(null);
  const [deletingSurveyId, setDeletingSurveyId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: surveys, isLoading } = useQuery<Survey[]>({
    queryKey: ['surveys'],
    queryFn: async () => {
      const { getSurveys } = await graphqlClient.request<GetSurveysResponse>(GET_SURVEYS);
      return getSurveys;
    },
  });

  const handleShare = async (surveyId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/survey/${surveyId}/share`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      const shareUrl = `${window.location.origin}/survey/${data.share_token}`;
      await navigator.clipboard.writeText(shareUrl);
      alert('Share link copied to clipboard!');
    } catch (error) {
      console.error('Failed to generate share link:', error);
      alert('Failed to generate share link');
    }
  };

  const handleToggleSurvey = async (surveyId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`http://localhost:8000/api/surveys/${surveyId}/status?is_active=${!currentStatus}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to update survey status');
      }
      
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
    } catch (error) {
      console.error('Failed to update survey status:', error);
      alert('Failed to update survey status');
    }
  };

  const handleDeleteSurvey = async () => {
    if (!deletingSurveyId) return;
    
    try {
      await surveysApi.deleteSurvey(deletingSurveyId);
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
      setDeletingSurveyId(null);
    } catch (error) {
      console.error('Failed to delete survey:', error);
      alert('Failed to delete survey');
    }
  };

  const handleExportResponses = async (surveyId: number) => {
    try {
      const blob = await surveysApi.exportResponses(surveyId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `survey_${surveyId}_responses.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to export responses:', error);
      alert('Failed to export responses');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Customer Feedback System</h1>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">{user?.email}</span>
              <button
                onClick={logout}
                className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Surveys</h2>
            <button
              onClick={() => setIsCreatingSurvey(true)}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Create Survey
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {surveys?.map((survey) => (
              <div key={survey.id} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium text-gray-900">
                        {survey.title}
                      </h3>
                      {!survey.isActive && (
                        <span className="ml-2 px-2 py-1 text-xs font-semibold bg-gray-300 text-gray-800 rounded">Stopped</span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleExportResponses(survey.id)}
                        className="p-1 text-gray-600 hover:text-green-600"
                        title="Export Responses"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setEditingSurvey(survey)}
                        className="p-1 text-gray-600 hover:text-indigo-600"
                        title="Edit Survey"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setDeletingSurveyId(survey.id)}
                        className="p-1 text-gray-600 hover:text-red-600"
                        title="Delete Survey"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {survey.description}
                  </p>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      {survey.questions.length} question{survey.questions.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="mt-4 flex space-x-3">
                    <button
                      onClick={() => handleShare(survey.id)}
                      className="flex-1 px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      disabled={!survey.isActive}
                    >
                      Share
                    </button>
                    <button
                      onClick={() => handleToggleSurvey(survey.id, survey.isActive)}
                      className={`flex-1 px-3 py-2 text-sm font-medium ${
                        survey.isActive
                          ? 'text-red-600 hover:text-red-500'
                          : 'text-green-600 hover:text-green-500'
                      }`}
                    >
                      {survey.isActive ? 'Stop Survey' : 'Activate Survey'}
                    </button>
                    <Link
                      href={`/dashboard/responses/${survey.id}`}
                      className="flex-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-500 text-center"
                    >
                      View Responses
                    </Link>
                    <Link
                      href={`/dashboard/analytics/${survey.id}`}
                      className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 text-center"
                    >
                      View Analytics
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <CreateSurveyModal
        isOpen={isCreatingSurvey || editingSurvey !== null}
        onClose={() => {
          setIsCreatingSurvey(false);
          setEditingSurvey(null);
        }}
        survey={editingSurvey}
      />

      {/* Delete Confirmation Modal */}
      {deletingSurveyId && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Survey</h3>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to delete this survey? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeletingSurveyId(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSurvey}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 