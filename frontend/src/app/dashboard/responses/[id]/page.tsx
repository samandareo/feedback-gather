'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { surveys } from '@/lib/api';
import { Survey, Response } from '@/types';

export default function SurveyResponsesPage() {
  const { id } = useParams();
  const router = useRouter();
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);

  const { data: survey, isLoading: isLoadingSurvey } = useQuery<Survey>({
    queryKey: ['survey', id],
    queryFn: () => surveys.get(Number(id)),
  });

  const { data: responses, isLoading: isLoadingResponses } = useQuery<Response[]>({
    queryKey: ['responses', id],
    queryFn: () => surveys.getResponses(Number(id)),
  });

  if (isLoadingSurvey || isLoadingResponses) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading responses...</p>
        </div>
      </div>
    );
  }

  if (!survey || !responses) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">Failed to load survey responses</p>
        </div>
      </div>
    );
  }

  const questionResponses = selectedQuestion
    ? responses.filter(r => r.question_id === selectedQuestion)
    : responses;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Survey Responses</h1>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="ml-4 px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{survey.title}</h2>
              {survey.description && (
                <p className="text-gray-600 mb-6">{survey.description}</p>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Question
                </label>
                <select
                  value={selectedQuestion || ''}
                  onChange={(e) => setSelectedQuestion(e.target.value ? Number(e.target.value) : null)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-1 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md text-black"
                >
                  <option value="">All Questions</option>
                  {survey.questions.map((question) => (
                    <option key={question.id} value={question.id}>
                      {question.text}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-6">
                {survey.questions
                  .filter(q => !selectedQuestion || q.id === selectedQuestion)
                  .map((question) => {
                    const questionResponses = responses.filter(r => r.question_id === question.id);
                    return (
                      <div key={question.id} className="border rounded-lg p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {question.text}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                          {questionResponses.length} response{questionResponses.length !== 1 ? 's' : ''}
                        </p>
                        <div className="space-y-4">
                          {questionResponses.map((response) => (
                            <div
                              key={response.id}
                              className="bg-gray-50 rounded-md p-4"
                            >
                              <p className="text-gray-900">{response.answer}</p>
                              <p className="text-sm text-gray-500 mt-1">
                                {new Date(response.created_at).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 