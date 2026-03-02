import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });

      if (response.data.status === 'success') {
        localStorage.setItem('token', response.data.token);
        const user = response.data.data.user;
        localStorage.setItem('user', JSON.stringify(user));

        // Role-based redirect
        if (user.role === 'designer') {
          navigate('/room-setup');
        } else {
          navigate('/customer-view');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#06080f]">

      {/* ─── Left Panel: Branding ─── */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        {/* Animated gradient mesh */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#0a1628] via-[#0d1f3c] to-[#06080f]" />
          <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] bg-sky-500/[0.07] rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-[5%] right-[10%] w-[400px] h-[400px] bg-indigo-500/[0.06] rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
          <div className="absolute top-[60%] left-[5%] w-[200px] h-[200px] bg-cyan-400/[0.05] rounded-full blur-[80px] animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />

        <div className="relative z-10 flex flex-col justify-between p-16 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/25">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">FurniForge</span>
          </div>

          {/* Hero */}
          <div className="max-w-lg">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/[0.08] border border-sky-500/[0.15] mb-8">
              <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              <span className="text-xs font-semibold text-sky-300 uppercase tracking-widest">Design Platform v2.0</span>
            </div>
            <h1 className="text-[3.5rem] leading-[1.1] font-black text-white tracking-tight mb-6">
              Where ideas<br />
              become <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">reality.</span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed max-w-md">
              Transform 2D blueprints into immersive 3D experiences. Design, visualize, and prototype furniture layouts with precision.
            </p>
            <div className="flex flex-wrap gap-3 mt-10">
              {['2D Blueprint', '3D Rendering', 'Lighting Studio', 'Cloud Storage'].map((f) => (
                <div key={f} className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-slate-400 font-medium backdrop-blur-sm">
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-12">
            {[{ value: '10K+', label: 'Designs Created' }, { value: '2.5K', label: 'Active Designers' }, { value: '99.9%', label: 'Uptime' }].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Right Panel: Login Form ─── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16 relative">
        <div className="absolute inset-0 bg-[#090c14]" />
        <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-white/[0.06] to-transparent hidden lg:block" />

        <div className="relative z-10 w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-12 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="text-lg font-bold text-white">FurniForge</span>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-white tracking-tight">Welcome back</h2>
            <p className="mt-2 text-slate-500 font-medium">Enter your credentials to access the studio</p>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-red-500/[0.07] border border-red-500/20 animate-fade-in">
              <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-sm text-red-300 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Email address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <svg className="w-[18px] h-[18px] text-slate-600 group-focus-within:text-sky-400 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email" required placeholder="designer@furniforge.com"
                  className="w-full h-[52px] pl-11 pr-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-[15px] placeholder:text-slate-600 focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 focus:bg-white/[0.06] outline-none transition-all duration-200"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-300">Password</label>
                <button type="button" className="text-xs font-medium text-sky-400 hover:text-sky-300 transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <svg className="w-[18px] h-[18px] text-slate-600 group-focus-within:text-sky-400 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'} required placeholder="Enter your password"
                  className="w-full h-[52px] pl-11 pr-12 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-[15px] placeholder:text-slate-600 focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 focus:bg-white/[0.06] outline-none transition-all duration-200"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-600 hover:text-slate-400 transition-colors">
                  {showPassword ? (
                    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full h-[52px] mt-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-[15px] shadow-lg shadow-sky-500/25 hover:shadow-sky-400/30 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Authenticating...
                </>
              ) : (
                <>
                  Sign in to Studio
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-xs font-medium text-slate-600 uppercase tracking-wider">Or</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          <div className="text-center">
            <p className="text-sm text-slate-500">
              Don't have an account?{' '}
              <Link to="/signup" className="text-sky-400 hover:text-sky-300 font-semibold transition-colors">
                Create free account
              </Link>
            </p>
          </div>

          <p className="text-center text-[11px] text-slate-700 mt-12">
            By signing in, you agree to our{' '}
            <Link to="/terms" className="text-sky-500 hover:text-sky-400 underline decoration-sky-500/30 hover:decoration-sky-400 transition-colors">
              Terms
            </Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-sky-500 hover:text-sky-400 underline decoration-sky-500/30 hover:decoration-sky-400 transition-colors">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
