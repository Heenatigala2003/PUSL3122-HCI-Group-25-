import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const ROLES = [
  {
    value: 'designer',
    label: 'Designer',
    sub: 'Admin workspace',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-2.828 1.172H7v-2a4 4 0 011.172-2.828z" />
      </svg>
    ),
  },
  {
    value: 'user',
    label: 'Customer',
    sub: 'View & request designs',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('designer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', { name, email, password, role });

      if (response.data.status === 'success') {
        localStorage.setItem('token', response.data.token);
        const user = response.data.data.user;
        localStorage.setItem('user', JSON.stringify(user));
        navigate(user.role === 'designer' ? '/room-setup' : '/customer-view');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#06080f]">

      {/* ─── Left Panel ─── */}
      <div className="hidden lg:flex lg:w-[50%] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#0d1f2d] via-[#0a1628] to-[#06080f]" />
          <div className="absolute top-[5%] right-[10%] w-[450px] h-[450px] bg-indigo-500/[0.07] rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '5s' }} />
          <div className="absolute bottom-[10%] left-[5%] w-[350px] h-[350px] bg-sky-500/[0.06] rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '4s', animationDelay: '1.5s' }} />
          <div className="absolute top-[45%] left-[30%] w-[200px] h-[200px] bg-gold-500/[0.04] rounded-full blur-[80px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '0.5s' }} />
        </div>

        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
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

          {/* Content */}
          <div className="max-w-lg">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/[0.08] border border-indigo-500/[0.15] mb-8">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-xs font-semibold text-indigo-300 uppercase tracking-widest">Join the Platform</span>
            </div>
            <h1 className="text-[3.2rem] leading-[1.1] font-black text-white tracking-tight mb-6">
              Build spaces<br />
              that <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-cyan-400 bg-clip-text text-transparent">inspire.</span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed max-w-md">
              Create an account as a Designer to build immersive 3D rooms, or as a Customer to preview and request designs.
            </p>
            <div className="flex flex-col gap-4 mt-10">
              {[
                { icon: '🎨', label: 'Designer', desc: 'Full 2D/3D canvas, lighting studio, cloud save' },
                { icon: '👁️', label: 'Customer', desc: 'Preview designs in 3D and request customizations' },
              ].map((r) => (
                <div key={r.label} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
                  <span className="text-2xl">{r.icon}</span>
                  <div>
                    <div className="text-sm font-bold text-white">{r.label}</div>
                    <div className="text-xs text-slate-500">{r.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <p className="text-xs text-slate-700 font-medium">
            © 2026 FurniForge Studio. All rights reserved.
          </p>
        </div>
      </div>

      {/* ─── Right Panel: Signup Form ─── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-14 relative">
        <div className="absolute inset-0 bg-[#090c14]" />
        <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-white/[0.06] to-transparent hidden lg:block" />

        <div className="relative z-10 w-full max-w-[440px]">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="text-lg font-bold text-white">FurniForge</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white tracking-tight">Create your account</h2>
            <p className="mt-2 text-slate-500 font-medium">Join thousands of designers on FurniForge</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-red-500/[0.07] border border-red-500/20 animate-fade-in">
              <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-red-300 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <svg className="w-[18px] h-[18px] text-slate-600 group-focus-within:text-sky-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text" required placeholder="John Doe"
                  className="w-full h-[52px] pl-11 pr-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-[15px] placeholder:text-slate-600 focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 focus:bg-white/[0.06] outline-none transition-all duration-200"
                  value={name} onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <svg className="w-[18px] h-[18px] text-slate-600 group-focus-within:text-sky-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email" required placeholder="designer@studio.com"
                  className="w-full h-[52px] pl-11 pr-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-[15px] placeholder:text-slate-600 focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 focus:bg-white/[0.06] outline-none transition-all duration-200"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <svg className="w-[18px] h-[18px] text-slate-600 group-focus-within:text-sky-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'} required placeholder="Min. 8 characters"
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

            {/* Role Selector */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">Professional Role</label>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`group flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${role === r.value
                        ? 'border-sky-500 bg-sky-500/10 shadow-lg shadow-sky-500/15'
                        : 'border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                      }`}
                  >
                    <div className={`transition-colors ${role === r.value ? 'text-sky-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                      {r.icon}
                    </div>
                    <div>
                      <div className={`text-sm font-bold transition-colors ${role === r.value ? 'text-white' : 'text-slate-400'}`}>{r.label}</div>
                      <div className="text-[10px] text-slate-600 mt-0.5">{r.sub}</div>
                    </div>
                    {role === r.value && (
                      <div className="absolute top-2 right-2">
                        <div className="w-2 h-2 rounded-full bg-sky-400" />
                      </div>
                    )}
                  </button>
                ))}
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
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-xs font-medium text-slate-600 uppercase tracking-wider">Or</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          <div className="text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/" className="text-sky-400 hover:text-sky-300 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          <p className="text-center text-[11px] text-slate-700 mt-10">
            By creating an account, you agree to our{' '}
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

export default Signup;
