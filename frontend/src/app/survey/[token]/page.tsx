'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { surveys } from '@/lib/api';
import { useParams } from 'next/navigation';
import { Survey } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

export default function SharedSurvey() {
  const { token } = useParams();
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: survey, isLoading } = useQuery({
    queryKey: ['survey', token],
    queryFn: () => surveys.getByToken(token as string),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!survey) return;

    setIsSubmitting(true);
    try {
      const responseData = Object.entries(responses).map(([questionId, answer]) => ({
        question_id: parseInt(questionId),
        answer,
      }));

      await surveys.submitResponses(survey.id, responseData);
      alert('Thank you for your feedback!');
      setResponses({});
    } catch (error) {
      console.error('Failed to submit responses:', error);
      alert('Failed to submit responses. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-600"
          >
            Survey not found or has expired
          </motion.div>
        </div>
      </div>
    );
  }

  if (survey && survey.is_active === false) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gray-900 text-center bg-yellow-100 border border-yellow-300 rounded-lg p-8 mt-12 shadow"
          >
            <h1 className="text-2xl font-bold mb-2">This survey is no longer accepting responses</h1>
            <p className="text-gray-700">The owner has stopped this survey. Thank you for your interest!</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-100 p-8"
    >
      <div className="max-w-3xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-gray-900 mb-2"
        >
          {survey.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 mb-8"
        >
          {survey.description}
        </motion.p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <AnimatePresence>
            {survey.questions.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{question.text}</h2>
                {question.is_open_ended ? (
                  <motion.textarea
                    whileFocus={{ scale: 1.01 }}
                    value={responses[question.id] || ''}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setResponses((prev) => ({ ...prev, [question.id]: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    rows={3}
                    required
                  />
                ) : (
                  <div className="space-y-2">
                    {question.options.map((option) => (
                      <motion.label
                        key={option.id}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option.text}
                          checked={responses[question.id] === option.text}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setResponses((prev) => ({ ...prev, [question.id]: e.target.value }))
                          }
                          className="text-blue-600 focus:ring-blue-500"
                          required
                        />
                        <span className="text-gray-900">{option.text}</span>
                      </motion.label>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex justify-end"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Responses'}
            </motion.button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
} 