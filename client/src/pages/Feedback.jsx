import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Feedback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, company, messages, allResults, type } = location.state || {};
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!role || !company || (!messages && !allResults)) {
      navigate('/setup');
      return;
    }
    generateFeedback();
  }, [role, company, messages, allResults, type, navigate]);

  const generateFeedback = async () => {
    let prompt;

    if (type === "coding") {
      // Handle coding interview feedback
      const codingFeedbackPrompt = `
Analyze these coding interview results for ${role} at ${company}.

Results: ${JSON.stringify(allResults.map(r => ({
  question: r.question.title,
  difficulty: r.question.difficulty,
  score: r.evaluation.score,
  feedback: r.evaluation.feedback
})))}

Respond ONLY with JSON no markdown:
{
  "overallScore": 75,
  "grade": "B+",
  "summary": "Overall assessment of coding skills",
  "strengths": ["Good problem decomposition", "Clean code", "Correct logic"],
  "improvements": ["Optimize time complexity", "Handle edge cases", "Add comments"],
  "categories": [
    {"name": "Problem Solving", "score": 80},
    {"name": "Code Quality", "score": 70},
    {"name": "Optimization", "score": 65},
    {"name": "Speed", "score": 75}
  ],
  "tip": "Practice dynamic programming problems daily on LeetCode"
}`;
      prompt = codingFeedbackPrompt;
    } else {
      // Handle regular interview feedback
      const conversation = messages.map(m => `${m.role === 'assistant' ? 'AI' : 'User'}: ${m.content}`).join('\n');

      prompt = `Analyze interview answers for ${role} at ${company}.
Answers: ${conversation}
Reply ONLY with this JSON, no markdown no backticks:
{
  "overallScore": 75,
  "grade": "B+",
  "summary": "2-3 sentence assessment",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3"],
  "categories": [
    {"name": "Communication", "score": 80},
    {"name": "Technical Knowledge", "score": 70},
    {"name": "Problem Solving", "score": 75},
    {"name": "Confidence", "score": 72}
  ],
  "tip": "One actionable tip"
}`;
    }

    try {
      const res = await fetch("http://localhost:3001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: prompt }] })
      });
      const data = await res.json();
      const parsed = JSON.parse(data.content.replace(/```json|```/g, "").trim());
      setFeedback(parsed);
    } catch (error) {
      console.error('Error generating feedback:', error);
      setFeedback({
        overallScore: 0,
        grade: "Error",
        summary: "Sorry, there was an error generating feedback. Please try again.",
        strengths: [],
        improvements: [],
        categories: [],
        tip: ""
      });
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#065F46] flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold">Analyzing your interview...</h2>
          <p className="text-green-100 mt-2">This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (!feedback) return null;

  return (
    <div className="min-h-screen bg-[#F8FAF9] p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#065F46] mb-2">Interview Feedback</h1>
          <p className="text-gray-600">{role} Interview at {company}</p>
        </div>

        {/* Score Circle */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8 text-center">
          <div className="relative inline-block">
            <svg className="w-32 h-32" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#E5E7EB" strokeWidth="8" />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#10B981"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 50}`}
                strokeDashoffset={`${2 * Math.PI * 50 * (1 - feedback.overallScore / 100)}`}
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div>
                <div className="text-3xl font-bold text-[#065F46]">{feedback.overallScore}/100</div>
                <div className="text-lg font-semibold text-gray-600">{feedback.grade}</div>
              </div>
            </div>
          </div>
          <p className="mt-4 text-gray-700 max-w-md mx-auto">{feedback.summary}</p>
        </div>

        {/* Performance Bars */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Performance Breakdown</h3>
          <div className="space-y-4">
            {feedback.categories.map((cat, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">{cat.name}</span>
                  <span className="text-sm text-gray-600">{cat.score}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-[#10B981] h-3 rounded-full transition-all duration-500"
                    style={{ width: `${cat.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths and Improvements */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-xl font-semibold text-green-600 mb-4">Strengths</h3>
            <ul className="space-y-3">
              {feedback.strengths.map((strength, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-xl font-semibold text-amber-600 mb-4">Areas for Improvement</h3>
            <ul className="space-y-3">
              {feedback.improvements.map((improvement, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="text-amber-500 mt-1">•</span>
                  <span className="text-gray-700">{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Pro Tip */}
        <div className="bg-gradient-to-r from-[#FCD34D] to-[#F59E0B] rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-[#065F46] mb-2">💡 Pro Tip</h3>
          <p className="text-[#065F46]">{feedback.tip}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/setup')}
            className="bg-[#065F46] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#047857] transition-colors"
          >
            Practice Again
          </button>
          <button
            onClick={() => navigate('/')}
            className="border-2 border-[#065F46] text-[#065F46] px-8 py-3 rounded-lg font-medium hover:bg-[#065F46] hover:text-white transition-colors"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Feedback;