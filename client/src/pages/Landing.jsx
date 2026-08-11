import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Landing = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAF9]">
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#065F46] rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-xl font-bold text-[#065F46]">InterviewGuru</span>
              <span className="bg-[#FCD34D] text-[#065F46] px-2 py-1 rounded-full text-xs font-medium">New — Voice mode live</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-[#065F46]">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-[#065F46]">Pricing</a>
              <a href="#about" className="text-gray-600 hover:text-[#065F46]">About</a>
              <button onClick={() => navigate('/login')} className="text-[#065F46] hover:text-[#047857]">Login</button>
              <button onClick={() => navigate('/login')} className="bg-[#065F46] text-white px-4 py-2 rounded-lg hover:bg-[#047857]">Sign Up</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -top-8 -left-8 w-36 h-36 bg-[#10B981] rounded-full opacity-10"></div>
              <span className="inline-block bg-[#10B981] text-white px-3 py-1 rounded-full text-sm font-medium mb-4">AI-Powered Interviews</span>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Crack Your <span className="underline decoration-[#FCD34D] decoration-4">Dream Company</span> Interview with AI
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Practice with personalized AI interviewers tailored for Indian companies. Get instant feedback and improve your interview skills.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button onClick={() => navigate('/setup')} className="bg-[#065F46] text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-[#047857] transition-colors">
                  Start Practicing Free →
                </button>
                <button className="border-2 border-[#065F46] text-[#065F46] px-8 py-3 rounded-lg text-lg font-medium hover:bg-[#065F46] hover:text-white transition-colors">
                  Watch Demo
                </button>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>10,000+ Students</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>50+ Companies</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Free Forever</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="space-y-4">
                {/* Chat Preview Cards */}
                <div className="bg-white border border-[#10B981] rounded-lg p-4 shadow-sm">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-[#065F46] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">AI</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">InterviewGuru AI</span>
                      <span className="text-xs text-gray-500 ml-2">TCS · Round 1</span>
                    </div>
                  </div>
                  <p className="text-gray-700">Tell me about a challenging project you've worked on and how you overcame the difficulties.</p>
                </div>
                <div className="bg-[#065F46] rounded-lg p-4 shadow-sm ml-8">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-white text-sm font-medium">You</span>
                  </div>
                  <p className="text-white">I worked on a real-time chat application where we faced scalability issues. We implemented Redis caching and optimized our database queries, which improved performance by 60%.</p>
                </div>
                <div className="bg-white border border-[#10B981] rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-[#065F46]">8.5/10</span>
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div className="w-17/20 h-full bg-[#10B981] rounded-full"></div>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm">Great technical depth! Consider quantifying the impact more specifically and mentioning any metrics.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Strip */}
      <section className="py-8 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-600 mb-6">Trusted by students placed at</p>
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-400 text-lg font-medium">
            <span>TCS</span>
            <span>·</span>
            <span>Infosys</span>
            <span>·</span>
            <span>Google</span>
            <span>·</span>
            <span>Amazon</span>
            <span>·</span>
            <span>Flipkart</span>
            <span>·</span>
            <span>Zomato</span>
            <span>·</span>
            <span>Razorpay</span>
            <span>·</span>
            <span>CRED</span>
            <span>·</span>
            <span>Meesho</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#F8FAF9] p-8 rounded-lg relative">
              <div className="absolute top-4 right-4 text-[#10B981] opacity-10 text-6xl font-bold">01</div>
              <div className="w-12 h-1 bg-[#10B981] mb-6"></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Feedback</h3>
              <p className="text-gray-600 mb-6">Get instant, personalized feedback on your answers with detailed analysis and improvement suggestions.</p>
              <a href="#" className="text-[#065F46] font-medium hover:text-[#047857]">Explore feature →</a>
            </div>
            <div className="bg-white p-8 rounded-lg border-l-4 border-[#065F46] relative">
              <div className="absolute top-4 right-4 text-[#FCD34D] opacity-10 text-6xl font-bold">02</div>
              <div className="w-12 h-1 bg-[#FCD34D] mb-6"></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Indian Companies</h3>
              <p className="text-gray-600 mb-6">Practice with interview questions specifically tailored for top Indian tech companies and startups.</p>
              <a href="#" className="text-[#065F46] font-medium hover:text-[#047857]">Explore feature →</a>
            </div>
            <div className="bg-[#F8FAF9] p-8 rounded-lg relative">
              <div className="absolute top-4 right-4 text-[#10B981] opacity-10 text-6xl font-bold">03</div>
              <div className="w-12 h-1 bg-[#D1FAE5] mb-6"></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Track Progress</h3>
              <p className="text-gray-600 mb-6">Monitor your improvement over time with detailed analytics and performance metrics.</p>
              <a href="#" className="text-[#065F46] font-medium hover:text-[#047857]">Explore feature →</a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-[#065F46] py-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full opacity-4"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Ready to ace your next interview?
              </h2>
              <p className="text-lg text-green-100 mb-8">
                Join thousands of students who have improved their interview skills with InterviewGuru AI.
              </p>
              <div className="flex items-center space-x-6 text-green-100">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-300 rounded-full"></span>
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-300 rounded-full"></span>
                  <span>5-minute setup</span>
                </div>
              </div>
            </div>
            <div className="text-center lg:text-right">
              <button onClick={() => navigate('/setup')} className="bg-[#FCD34D] text-[#065F46] px-8 py-4 rounded-lg text-xl font-bold hover:bg-[#F59E0B] transition-colors">
                Get Started for Free →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-[#065F46] rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <span className="text-xl font-bold">InterviewGuru</span>
              </div>
              <p className="text-gray-400">Empowering Indian students to crack their dream company interviews with AI.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Demo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 InterviewGuru. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;