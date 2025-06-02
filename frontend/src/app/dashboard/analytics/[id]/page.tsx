"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { surveys } from "@/lib/api";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Link from "next/link";
import { FaChartBar, FaAlignLeft } from "react-icons/fa";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AnalyticsPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["analytics", id],
    queryFn: () => surveys.getAnalytics(Number(id)),
  });

  // Calculate summary stats
  let totalResponses = 0;
  if (data && data.analytics.length > 0) {
    data.analytics.forEach((q: any) => {
      if (q.type === "multiple_choice") {
        totalResponses += Object.values(q.options as Record<string, number>).reduce((a, b) => a + b, 0);
      } else if (q.type === "open_ended") {
        totalResponses += q.answers.length;
      }
    });
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Survey Analytics</h1>
          <Link href="/dashboard" className="text-blue-600 hover:underline">Back to Dashboard</Link>
        </div>
        {/* Summary Card */}
        <div className="mb-8 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[180px] bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col items-center shadow-sm">
            <span className="text-2xl font-bold text-blue-700">{totalResponses}</span>
            <span className="text-sm text-blue-900">Total Responses</span>
          </div>
          <div className="flex-1 min-w-[180px] bg-green-50 border border-green-200 rounded-lg p-4 flex flex-col items-center shadow-sm">
            <span className="text-2xl font-bold text-green-700">{data?.analytics.length || 0}</span>
            <span className="text-sm text-green-900">Questions</span>
          </div>
        </div>
        {/* Divider */}
        <hr className="mb-8 border-gray-200" />
        {isLoading ? (
          <div className="p-8">Loading analytics...</div>
        ) : error ? (
          <div className="p-8 text-red-600">Failed to load analytics.</div>
        ) : (
          data.analytics.map((q: any, idx: number) => (
            <div key={q.question_id} className="mb-12 bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center mb-4">
                <span className={`mr-2 text-xl ${q.type === 'multiple_choice' ? 'text-blue-500' : 'text-green-500'}`}>
                  {q.type === 'multiple_choice' ? <FaChartBar /> : <FaAlignLeft />}
                </span>
                <h2 className="text-xl font-semibold text-gray-900">{q.question_text}</h2>
              </div>
              {q.type === "multiple_choice" ? (
                <Bar
                  data={{
                    labels: Object.keys(q.options),
                    datasets: [
                      {
                        label: "Responses",
                        data: Object.values(q.options),
                        backgroundColor: [
                          "#2563eb",
                          "#22c55e",
                          "#f59e42",
                          "#ef4444",
                          "#a21caf",
                          "#eab308",
                          "#0ea5e9",
                        ],
                        borderRadius: 6,
                        borderWidth: 1,
                        borderColor: "#e5e7eb",
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                      title: { display: false },
                    },
                    scales: {
                      y: { beginAtZero: true, ticks: { precision: 0 } },
                    },
                    animation: {
                      duration: 800,
                      easing: 'easeOutQuart',
                    },
                    backgroundColor: "#fff",
                  }}
                />
              ) : (
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Responses:</h3>
                  {q.answers.length === 0 ? (
                    <p className="text-gray-500 italic">No responses yet.</p>
                  ) : (
                    <ul className="list-disc pl-6 space-y-1">
                      {q.answers.map((a: string, idx: number) => (
                        <li key={idx} className="text-gray-900 bg-gray-50 rounded px-2 py-1 mb-1 transition-colors duration-150 hover:bg-blue-50">
                          {a}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              {idx < data.analytics.length - 1 && <hr className="mt-8 mb-2 border-gray-200" />}
            </div>
          ))
        )}
      </div>
    </div>
  );
} 