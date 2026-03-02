import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#f8fafc', '#e2e8f0', '#94a3b8', '#475569', '#1e293b', '#0f172a'];
const FLOOR_PRESETS = [
  { label: 'Pearl', color: '#f8fafc' },
  { label: 'Ash',   color: '#cbd5e1' },
  { label: 'Steel', color: '#94a3b8' },
  { label: 'Slate', color: '#475569' },
  { label: 'Charcoal', color: '#1e293b' },
];

const RoomSetup = () => {
  const [dimensions, setDimensions] = useState({ width: 6, height: 5 });
  const [shape, setShape]           = useState('rectangular');
  const [colorScheme, setColorScheme] = useState('#1e293b');
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/designer', { state: { room: { width: dimensions.width, height: dimensions.height, color: colorScheme } } });
  };

  return (
    <div className="min-h-screen bg-[#06080f] text-slate-100 overflow-hidden relative">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/8 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto px-8 py-10 relative z-10">
        {/* Logo bar */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <span className="text-lg font-bold text-white tracking-tight">FurniForge</span>
        </div>

        <header className="mb-10 space-y-2">
          <h1 className="text-5xl font-black text-white tracking-tight">
            Room <span className="bg-gradient-to-r from-primary-400 to-indigo-400 bg-clip-text text-transparent">Configuration</span>
          </h1>
          <p className="text-slate-400 text-lg font-medium">Define the foundation of your masterpiece</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <section className="lg:col-span-5 glass-dark p-8 rounded-[2rem] space-y-8 border border-white/[0.06]">
            {/* Shape */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Room Shape</label>
              <div className="flex gap-3 p-1.5 bg-slate-950/60 rounded-2xl border border-slate-700/40">
                {['rectangular', 'l-shaped'].map((s) => (
                  <button key={s} onClick={() => setShape(s)}
                    className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                      shape === s
                        ? 'bg-primary-600 text-white shadow-xl shadow-primary-500/20 scale-[1.01]'
                        : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                    }`}>
                    {s === 'rectangular' ? '▭ Rectangular' : 'L L-Shaped'}
                  </button>
                ))}
              </div>
            </div>

            {/* Dimensions */}
            <div className="grid grid-cols-2 gap-5">
              {[
                { label: 'Width', key: 'width' },
                { label: 'Length', key: 'height' }
              ].map(({ label, key }) => (
                <div key={key} className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {label} <span className="text-slate-600 normal-case font-normal">(m)</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input type="number" min={2} max={20} step={0.5}
                      className="input-field text-lg font-bold text-center"
                      value={dimensions[key as 'width' | 'height']}
                      onChange={(e) => setDimensions({ ...dimensions, [key]: Number(e.target.value) })}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Floor Color */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Floor Colour</label>
              <div className="grid grid-cols-5 gap-2">
                {FLOOR_PRESETS.map((p) => (
                  <button key={p.color} onClick={() => setColorScheme(p.color)}
                    className={`group relative h-10 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                      colorScheme === p.color ? 'border-primary-500 ring-2 ring-primary-500/30 scale-105' : 'border-white/10'
                    }`}
                    style={{ backgroundColor: p.color }}
                    title={p.label}
                  >
                    {colorScheme === p.color && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-4 h-4 text-primary-400 drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-600 mt-1">Selected: {FLOOR_PRESETS.find(p => p.color === colorScheme)?.label || 'Custom'}</p>
            </div>

            {/* Info */}
            <div className="p-4 bg-primary-600/[0.07] border border-primary-500/20 rounded-2xl">
              <div className="flex items-center gap-2 mb-1.5">
                <svg className="w-4 h-4 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-bold text-white uppercase tracking-wider">Pro Tip</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">Your room configuration will be passed to the designer. Use the 3D view to examine lighting and clearances.</p>
            </div>
          </section>

          {/* Preview */}
          <section className="lg:col-span-7 flex flex-col">
            <div className="flex-1 glass p-10 rounded-[2rem] flex flex-col items-center justify-center min-h-[480px] border border-white/[0.05] relative">
              <div className="absolute top-5 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
                Floor Plan Preview
              </div>

              <div className="relative">
                {/* Dimensions labels */}
                <div className="absolute -left-10 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 -rotate-90 whitespace-nowrap">
                  {dimensions.height}m
                </div>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-500">
                  {dimensions.width}m
                </div>

                {/* Room visualization */}
                <div
                  className="relative shadow-[0_30px_80px_-10px_rgba(0,0,0,0.7)] rounded-2xl overflow-hidden"
                  style={{
                    width: `${Math.min(dimensions.width * 50, 380)}px`,
                    height: `${Math.min(dimensions.height * 50, 380)}px`,
                    border: '6px solid #334155',
                    backgroundColor: colorScheme,
                  }}
                >
                  {/* Grid overlay */}
                  <div className="absolute inset-0 opacity-[0.08]" style={{
                    backgroundImage: 'radial-gradient(#666 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }} />

                  {/* Corner markers */}
                  {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((pos) => (
                    <div key={pos} className={`absolute ${pos} w-3 h-3 border-2 border-primary-500/60 rounded-sm`} />
                  ))}
                </div>
              </div>
            </div>

            <button onClick={handleContinue}
              className="btn-primary mt-6 py-5 text-base font-black tracking-wide w-full rounded-2xl flex items-center justify-center gap-3 shadow-2xl shadow-primary-500/20">
              Enter Creative Studio
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RoomSetup;
