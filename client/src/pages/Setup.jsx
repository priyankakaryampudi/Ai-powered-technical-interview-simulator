import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Setup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [customRole, setCustomRole] = useState('');

  const roles = [
    'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
    'Data Scientist', 'ML Engineer', 'DevOps Engineer', 'Product Manager',
    'UI/UX Designer', 'Business Analyst'
  ];

  const companies = [
    'Google', 'Microsoft', 'Amazon', 'Flipkart', 'Zomato', 'Swiggy',
    'CRED', 'Razorpay', 'Infosys', 'TCS', 'Wipro', 'Paytm'
  ];

  const handleSubmit = () => {
    const selectedRole = customRole || role;
    navigate('/interview', { state: { role: selectedRole, company } });
  };

  return (
    <div className="min-h-screen bg-[#065F46] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#065F46] mb-2">Setup Your Interview</h1>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className={`w-8 h-2 rounded ${step >= 1 ? 'bg-[#10B981]' : 'bg-gray-300'}`}></div>
            <div className={`w-8 h-2 rounded ${step >= 2 ? 'bg-[#10B981]' : 'bg-gray-300'}`}></div>
          </div>
          <p className="text-gray-600">Step {step} of 2</p>
        </div>

        {step === 1 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Your Job Role</h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => { setRole(r); setCustomRole(''); setStep(2); }}
                  className={`p-3 rounded-lg border-2 text-left transition-colors ${
                    role === r ? 'border-[#10B981] bg-[#F0FDF4]' : 'border-gray-200 hover:border-[#10B981]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Or enter custom role</label>
              <input
                type="text"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                placeholder="e.g. React Developer"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!role && !customRole}
              className="w-full bg-[#065F46] text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#047857] transition-colors"
            >
              Next →
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Target Company</h2>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {companies.map((c) => (
                <button
                  key={c}
                  onClick={() => setCompany(c)}
                  className={`p-3 rounded-lg border-2 text-center transition-colors ${
                    company === c ? 'border-[#10B981] bg-[#F0FDF4]' : 'border-gray-200 hover:border-[#10B981]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!company}
                className="flex-1 bg-[#065F46] text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#047857] transition-colors"
              >
                Start Interview →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Setup;