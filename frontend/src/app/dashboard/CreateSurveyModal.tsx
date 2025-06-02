'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { surveys } from '@/lib/api';
import { QuestionCreate, SurveyCreate, Survey } from '@/types';

interface CreateSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  survey?: Survey | null;
}

export default function CreateSurveyModal({ isOpen, onClose, survey }: CreateSurveyModalProps) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Array<{
    text: string;
    is_open_ended: boolean;
    options: Array<{ text: string }>;
  }>>([{ text: '', is_open_ended: true, options: [] }]);

  useEffect(() => {
    if (survey) {
      setTitle(survey.title);
      setDescription(survey.description || '');
      setQuestions(
        survey.questions.map(q => ({
          text: q.text,
          is_open_ended: q.isOpenEnded,
          options: q.options.map(o => ({ text: o.text }))
        }))
      );
    } else {
      setTitle('');
      setDescription('');
      setQuestions([{ text: '', is_open_ended: true, options: [] }]);
    }
  }, [survey]);

  const createSurveyMutation = useMutation({
    mutationFn: surveys.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
      onClose();
      setTitle('');
      setDescription('');
      setQuestions([{ text: '', is_open_ended: true, options: [] }]);
    },
  });

  const updateSurveyMutation = useMutation({
    mutationFn: (data: SurveyCreate) => surveys.update(survey!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
      onClose();
    },
  });

  const addQuestion = () => {
    setQuestions([...questions, { text: '', is_open_ended: true, options: [] }]);
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const newQuestions = [...questions];
    if (field === 'is_open_ended') {
      newQuestions[index] = {
        ...newQuestions[index],
        is_open_ended: value,
        options: value ? [] : [{ text: '' }],
      };
    } else {
      newQuestions[index] = { ...newQuestions[index], [field]: value };
    }
    setQuestions(newQuestions);
  };

  const addOption = (questionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push({ text: '' });
    setQuestions(newQuestions);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex].text = value;
    setQuestions(newQuestions);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(newQuestions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const surveyData: SurveyCreate = {
      title,
      description,
      questions: questions.map((q, index) => ({
        text: q.text,
        is_open_ended: q.is_open_ended,
        order: index + 1,
        options: q.options,
      })),
    };

    if (survey) {
      updateSurveyMutation.mutate(surveyData);
    } else {
      createSurveyMutation.mutate(surveyData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {survey ? 'Edit Survey' : 'Create New Survey'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              required
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Questions</h3>
            {questions.map((question, questionIndex) => (
              <div key={questionIndex} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question {questionIndex + 1}
                  </label>
                  <input
                    type="text"
                    value={question.text}
                    onChange={(e) => updateQuestion(questionIndex, 'text', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="flex items-center space-x-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={question.is_open_ended}
                      onChange={(e) => updateQuestion(questionIndex, 'is_open_ended', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Open-ended question</span>
                  </label>
                </div>

                {!question.is_open_ended && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Options</label>
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={option.text}
                          onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => removeOption(questionIndex, optionIndex)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addOption(questionIndex)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Add Option
                    </button>
                  </div>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addQuestion}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Add Question
            </button>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createSurveyMutation.isPending || updateSurveyMutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {createSurveyMutation.isPending || updateSurveyMutation.isPending
                ? (survey ? 'Updating...' : 'Creating...')
                : (survey ? 'Update Survey' : 'Create Survey')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 