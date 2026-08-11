import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Interview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, company } = location.state || {};

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [userCode, setUserCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [hint, setHint] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const totalQuestions = 5;
  const [allResults, setAllResults] = useState([]);

  const fallbackQuestions = [
    {
      questionNumber: 1,
      title: "Two Sum",
      difficulty: "Easy",
      description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to the target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
      examples: [
        { input: "nums = [2,7,11,15], target = 9", output: "[0, 1]", explanation: "nums[0] + nums[1] == 9." }
      ],
      hint: "Use a hash map to track previously seen values and their indices.",
      testCases: [
        { input: "[2,7,11,15], 9", expected: "[0,1]" },
        { input: "[3,2,4], 6", expected: "[1,2]" }
      ]
    },
    {
      questionNumber: 2,
      title: "Valid Parentheses",
      difficulty: "Easy",
      description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if open brackets are closed by the same type of brackets, and open brackets are closed in the correct order.",
      examples: [
        { input: "()", output: "true", explanation: "The string is valid." },
        { input: "()[]{}", output: "true", explanation: "All brackets close properly." }
      ],
      hint: "Use a stack to store open brackets and compare them when you encounter a closing bracket.",
      testCases: [
        { input: "()", expected: "true" },
        { input: "(]", expected: "false" }
      ]
    },
    {
      questionNumber: 3,
      title: "Longest Substring Without Repeating Characters",
      difficulty: "Medium",
      description: "Given a string s, find the length of the longest substring without repeating characters.",
      examples: [
        { input: "abcabcbb", output: "3", explanation: "The answer is 'abc', with length 3." },
        { input: "bbbbb", output: "1", explanation: "The answer is 'b', with length 1." }
      ],
      hint: "Use a sliding window with a hash map or array to track the last seen index of each character.",
      testCases: [
        { input: "abcabcbb", expected: "3" },
        { input: "pwwkew", expected: "3" }
      ]
    },
    {
      questionNumber: 4,
      title: "Merge Intervals",
      difficulty: "Medium",
      description: "Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals and return an array of the non-overlapping intervals that cover all the intervals in the input.",
      examples: [
        { input: "[[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]", explanation: "Intervals [1,3] and [2,6] overlap and are merged." }
      ],
      hint: "Sort intervals by start time, then merge while iterating through the list.",
      testCases: [
        { input: "[[1,3],[2,6],[8,10],[15,18]]", expected: "[[1,6],[8,10],[15,18]]" },
        { input: "[[1,4],[4,5]]", expected: "[[1,5]]" }
      ]
    },
    {
      questionNumber: 5,
      title: "Find Median of Two Sorted Arrays",
      difficulty: "Hard",
      description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log(m+n)).",
      examples: [
        { input: "nums1 = [1,3], nums2 = [2]", output: "2.0", explanation: "The merged array is [1,2,3] and the median is 2." }
      ],
      hint: "Use a binary search approach on the smaller array to partition both arrays correctly.",
      testCases: [
        { input: "[1,3], [2]", expected: "2.0" },
        { input: "[1,2], [3,4]", expected: "2.5" }
      ]
    }
  ];

  const getFallbackQuestion = (qNum) => {
    return fallbackQuestions.find((q) => q.questionNumber === qNum) || {
      questionNumber: qNum,
      title: `Fallback Question ${qNum}`,
      difficulty: "Unknown",
      description: "The AI backend is unavailable, so a fallback question is shown.",
      examples: [],
      hint: "Use a basic algorithmic approach for this question.",
      testCases: []
    };
  };

  const callAI = async (messages) => {
    const res = await fetch("http://localhost:3001/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'AI backend returned an error');
    }
    if (!data.content || !data.content.trim()) {
      throw new Error('AI returned empty content');
    }
    return data.content;
  };

  const parseAIJsonResponse = (response) => {
    const cleaned = response.replace(/```json|```/g, "").trim();
    const jsonMatch = cleaned.match(/(\{[\s\S]*\})/);
    if (!jsonMatch) {
      throw new Error('No JSON object found in AI response');
    }
    return JSON.parse(jsonMatch[1]);
  };

  const loadQuestion = async (qNum) => {
    setIsLoading(true);
    setUserCode("");
    setResult(null);
    setShowHint(false);

    const prompt = `Generate coding interview question number ${qNum} of 5 for a ${role} position at ${company}.

Rules:
- Mix difficulty: Q1=Easy, Q2=Easy, Q3=Medium, Q4=Medium, Q5=Hard
- Questions should be relevant to ${role} at ${company}
- For frontend roles: focus on array manipulation, string problems, DOM concepts
- For backend roles: focus on algorithms, data structures, system design snippets
- For data science roles: focus on statistics problems, array operations, matrix problems

Respond with only one valid JSON object. Do not include markdown, backticks, explanations, or any text outside the JSON. If you cannot generate valid JSON, respond with {"error":"Could not generate question"}.

Example schema:
{
  "questionNumber": ${qNum},
  "title": "Two Sum",
  "difficulty": "Easy",
  "description": "Full problem description here...",
  "examples": [
    {"input": "nums = [2,7,11,15], target = 9", "output": "0, 1", "explanation": "Because nums[0] + nums[1] == 9"}
  ],
  "hint": "Think about using a hash map to store values you have seen",
  "testCases": [
    {"input": "[2,7,11,15], 9", "expected": "[0,1]"},
    {"input": "[3,2,4], 6", "expected": "[1,2]"}
  ]
}`;

    try {
      const response = await callAI([
        { role: "system", content: "You are an AI coding interviewer. Respond only with valid JSON and nothing else." },
        { role: "user", content: prompt }
      ]);
      console.log('AI question response:', response);
      let question;

      try {
        question = parseAIJsonResponse(response);
      } catch (parseError) {
        console.warn('Failed to parse AI question JSON:', parseError, response);
        question = {
          questionNumber: qNum,
          title: `AI Question ${qNum}`,
          difficulty: "Unknown",
          description: response,
          examples: [],
          hint: "Use the response above as the problem statement.",
          testCases: []
        };
      }

      setCurrentQuestion(question);
    } catch (error) {
      console.error('Error loading question:', error);
      const fallback = getFallbackQuestion(qNum);
      setCurrentQuestion(fallback);
    }
    setIsLoading(false);
  };

  const evaluateCode = async () => {
    if (!userCode.trim()) return;
    setIsEvaluating(true);

    const prompt = `You are a coding interview evaluator.

Question: ${currentQuestion.title}
Description: ${currentQuestion.description}
User's ${language} code:
${userCode}

Evaluate if the user's solution is logically correct.
Rules:
- Accept ANY correct approach (brute force, optimal, recursive, iterative)
- Check if the logic would produce correct output for the test cases
- Do NOT require exact variable names or specific algorithms
- Focus on whether the approach is valid

Respond ONLY with this JSON, no markdown, no backticks:
{
  "isCorrect": true,
  "score": 85,
  "feedback": "Great solution! Your approach using a hash map is optimal with O(n) time complexity.",
  "timeComplexity": "O(n)",
  "spaceComplexity": "O(n)",
  "suggestion": "One small improvement you could make is..."
}`;

    try {
      const response = await callAI([{ role: "user", content: prompt }]);
      const evaluation = JSON.parse(response.replace(/```json|```/g, "").trim());
      setResult(evaluation);
      setAllResults(prev => [...prev, { question: currentQuestion, evaluation, code: userCode }]);
    } catch (error) {
      console.error('Error evaluating code:', error);
      setResult({
        isCorrect: false,
        score: 0,
        evaluationUnavailable: true,
        feedback: "AI evaluation is unavailable with your current free API key. You can still practice the problem and continue to the next question.",
        timeComplexity: "Unavailable",
        spaceComplexity: "Unavailable",
        suggestion: "Review your code and continue. You can enable evaluation later by switching to a paid API key."
      });
    }
    setIsEvaluating(false);
  };

  const nextQuestion = () => {
    if (questionNumber >= totalQuestions) {
      navigate("/feedback", { state: { role, company, allResults, type: "coding" } });
    } else {
      const nextQ = questionNumber + 1;
      setQuestionNumber(nextQ);
      loadQuestion(nextQ);
    }
  };

  const getHint = () => {
    setShowHint(true);
  };

  useEffect(() => {
    if (!role || !company) {
      navigate('/setup');
      return;
    }
    loadQuestion(1);
  }, [role, company, navigate]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getLanguagePlaceholder = () => {
    switch (language) {
      case 'javascript':
        return `// Write your JavaScript solution here...\n\nfunction solution() {\n  \n}`;
      case 'python':
        return `# Write your Python solution here...\n\ndef solution():\n    pass`;
      case 'java':
        return `// Write your Java solution here...\n\npublic class Solution {\n    public static void main(String[] args) {\n        \n    }\n}`;
      case 'cpp':
        return `// Write your C++ solution here...\n\n#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}`;
      default:
        return '// Write your solution here...';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate('/')} className="text-[#10B981] hover:text-[#34D399]">
              ← InterviewGuru
            </button>
            <div>
              <h1 className="text-lg font-semibold">{role} at {company}</h1>
              <p className="text-sm text-slate-400">Question {questionNumber} of {totalQuestions}</p>
            </div>
          </div>
          <div className="w-32 bg-slate-700 rounded-full h-2">
            <div
              className="bg-[#10B981] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Question */}
        <div className="w-3/5 p-6 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10B981] mx-auto mb-4"></div>
                <p className="text-slate-400">Loading question...</p>
              </div>
            </div>
          ) : currentQuestion ? (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-slate-700 text-white px-3 py-1 rounded-full text-sm font-bold">
                  Q{currentQuestion.questionNumber}
                </span>
                <span className={`px-3 py-1 rounded-full text-white text-sm font-bold ${getDifficultyColor(currentQuestion.difficulty)}`}>
                  {currentQuestion.difficulty}
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-4">{currentQuestion.title}</h2>

              <div className="bg-slate-800 p-4 rounded-lg mb-6">
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{currentQuestion.description}</p>
              </div>

              {currentQuestion.examples && currentQuestion.examples.length > 0 && (
                <div className="bg-slate-800 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold mb-3">Examples:</h3>
                  {currentQuestion.examples.map((example, index) => (
                    <div key={index} className="mb-4 last:mb-0">
                      <div className="text-sm text-slate-400 mb-1">Input:</div>
                      <div className="bg-slate-900 p-2 rounded text-green-400 font-mono text-sm mb-2">
                        {example.input}
                      </div>
                      <div className="text-sm text-slate-400 mb-1">Output:</div>
                      <div className="bg-slate-900 p-2 rounded text-green-400 font-mono text-sm mb-2">
                        {example.output}
                      </div>
                      {example.explanation && (
                        <>
                          <div className="text-sm text-slate-400 mb-1">Explanation:</div>
                          <div className="text-slate-300 text-sm">{example.explanation}</div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={getHint}
                disabled={showHint}
                className="bg-amber-500 text-black px-4 py-2 rounded-lg font-medium hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-4"
              >
                💡 Get Hint
              </button>

              {showHint && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                  <p className="text-amber-800">{currentQuestion.hint}</p>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-2/5 p-6 bg-slate-800 border-l border-slate-700">
          <div className="mb-4">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:border-[#10B981] outline-none"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
          </div>

          <textarea
            value={userCode}
            onChange={(e) => setUserCode(e.target.value)}
            className="w-full h-80 bg-zinc-900 text-green-400 font-mono text-sm p-4 rounded-xl border border-zinc-700 focus:border-green-500 outline-none resize-none leading-relaxed"
            placeholder={getLanguagePlaceholder()}
            spellCheck={false}
          />

          <button
            onClick={evaluateCode}
            disabled={!userCode.trim() || isEvaluating}
            className="w-full bg-[#065F46] text-white py-3 rounded-lg font-medium hover:bg-[#047857] disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-4 flex items-center justify-center"
          >
            {isEvaluating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Evaluating...
              </>
            ) : (
              <>▶ Run & Submit</>
            )}
          </button>

          {result && (
            <div className={`mt-4 p-4 rounded-xl border ${result.evaluationUnavailable ? 'bg-yellow-50 border-yellow-200' : result.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">
                  {result.evaluationUnavailable ? '⚠️' : result.isCorrect ? '✅' : '❌'}
                </span>
                <span className={`font-bold ${result.evaluationUnavailable ? 'text-amber-700' : result.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  {result.evaluationUnavailable ? 'Evaluation Unavailable' : result.isCorrect ? 'Correct Solution!' : 'Not quite right'}
                </span>
                <span className="ml-auto text-sm font-bold text-zinc-600">Score: {result.score}/100</span>
              </div>
              <p className="text-sm text-zinc-600 mb-1">{result.feedback}</p>
              <p className="text-xs text-zinc-400">Time: {result.timeComplexity} · Space: {result.spaceComplexity}</p>
              {(result.isCorrect || result.evaluationUnavailable) && (
                <button onClick={nextQuestion} className="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold">
                  {questionNumber >= totalQuestions ? 'See Feedback →' : 'Next Question →'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Interview;