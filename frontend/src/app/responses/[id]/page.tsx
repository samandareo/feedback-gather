'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { surveys } from '@/lib/api';
import { useParams } from 'next/navigation';
import { Survey, Response, Question } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

export default function SurveyResponses() {
  const { id } = useParams();
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);

  const { data: survey, isLoading } = useQuery({
    queryKey: ['survey', id],
    queryFn: () => surveys.get(parseInt(id as string)),
  });

  const { data: responses, isLoading: isLoadingResponses } = useQuery({
    queryKey: ['responses', id],
    queryFn: () => surveys.getResponses(parseInt(id as string)),
  });

  if (isLoading || isLoadingResponses) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!survey || !responses) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-red-600">Survey or responses not found</div>
        </div>
      </div>
    );
  }

  const filteredResponses = selectedQuestion
    ? responses.filter((r) => r.question_id === selectedQuestion)
    : responses;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-100 p-8"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{survey.title}</h1>
          <p className="text-gray-600">{survey.description}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-black mb-4">Filter by Question</h2>
              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedQuestion(null)}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors duration-200 text-black font-medium ${
                    selectedQuestion === null ? 'bg-blue-100 text-black' : 'hover:bg-gray-50'
                  }`}
                >
                  All Responses
                </motion.button>
                {survey.questions.map((question: Question) => (
                  <motion.button
                    key={question.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedQuestion(question.id)}
                    className={`w-full text-left px-4 py-2 rounded-md transition-colors duration-200 ${
                      selectedQuestion === question.id
                        ? 'bg-blue-100 text-black font-medium'
                        : 'text-black hover:bg-gray-50'
                    }`}
                  >
                    {question.text}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Responses Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-black">
                  {selectedQuestion
                    ? `Responses for: ${survey.questions.find((q: Question) => q.id === selectedQuestion)?.text}`
                    : 'All Responses'}
                </h2>
                <span className="text-sm text-gray-600">
                  {filteredResponses.length} response{filteredResponses.length !== 1 ? 's' : ''}
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedQuestion}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {filteredResponses.map((response) => (
                    <motion.div
                      key={response.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-black font-medium">
                          {survey.questions.find((q: Question) => q.id === response.question_id)?.text}
                        </p>
                        <span className="text-sm text-gray-600">
                          {new Date(response.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-black">{response.answer}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
} 