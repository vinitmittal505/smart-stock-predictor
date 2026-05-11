import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { Leaf, ArrowRight, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPhrase, setLoadingPhrase] = useState('Authenticating...');
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (loading) {
      let i = 0;
      const loginPhrases = [
        "Verifying credentials...",
        "Establishing secure connection...",
        "Handshaking with neural engine...",
        "Loading dashboard..."
      ];
      setLoadingPhrase(loginPhrases[0]);
      interval = setInterval(() => {
        i = (i + 1) % loginPhrases.length;
        setLoadingPhrase(loginPhrases[i]);
      }, 900);
    } else {
      setLoadingPhrase('Authenticating...');
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await new Promise(resolve => setTimeout(resolve, 3500)); // Mandatory buffer
      const response = await authAPI.login({ 
        username: username.trim(), 
        password: password.trim() 
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Side - Hero */}
      <div className="hidden md:flex flex-1 bg-black p-20 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center space-x-3 text-white mb-20">
            <div className="p-3 bg-white rounded-xl">
              <Leaf className="h-8 w-8 text-black" />
            </div>
            <span className="text-3xl font-black tracking-tighter">Smart Stock</span>
          </div>
          
          <h1 className="text-7xl font-black text-white tracking-tighter leading-tight mb-8">
            Predictive logistics <br /> for the modern age.
          </h1>
          <p className="text-xl text-gray-400 font-bold max-w-lg leading-relaxed">
            Deploy neural forecasting to outmaneuver disruptions. Transform raw inventory data into predictive, actionable intelligence.
          </p>
        </div>

        <div className="relative z-10 flex items-center space-x-10">
          <div className="flex flex-col">
            <span className="text-4xl font-black text-emerald-500 tracking-tighter">99.9%</span>
            <span className="text-[10px] font-black text-white uppercase tracking-widest mt-1">Accuracy Rate</span>
          </div>
          <div className="h-12 w-px bg-white/20"></div>
          <div className="flex flex-col">
            <span className="text-4xl font-black text-emerald-500 tracking-tighter">2.4k</span>
            <span className="text-[10px] font-black text-white uppercase tracking-widest mt-1">Active SKUs</span>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white relative">
        <div className="max-w-md w-full bento-card p-12 rounded-[2rem] shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 relative z-10 animate-fade-in">
          <div className="mb-10">
            <div className="flex items-center space-x-2 text-[10px] font-black text-black uppercase tracking-[0.3em] mb-3">
              <ShieldCheck className="h-4 w-4" />
              <span>Secure Gateway</span>
            </div>
            <h2 className="text-4xl font-black text-black tracking-tighter">Welcome back.</h2>
            <p className="text-gray-500 font-black mt-2">Enter credentials to manage supply.</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-white border-2 border-black text-red-600 px-5 py-4 rounded-xl text-sm font-black animate-fade-up shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-black uppercase tracking-widest">Username</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="e.g. admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-black uppercase tracking-widest">Password</label>
                <input
                  type="password"
                  required
                  className="input-field"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center space-x-3 !py-5 mt-8 disabled:opacity-50"
            >
              <span>{loading ? loadingPhrase : 'Sign In'}</span>
              {!loading && <ArrowRight className="h-5 w-5" />}
            </button>
            
            <div className="flex flex-col items-center space-y-2 mt-10">
              <p className="text-[10px] font-black text-black uppercase tracking-widest">Authorized Access Only</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
