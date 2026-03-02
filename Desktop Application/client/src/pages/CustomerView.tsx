import React, { Suspense, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import Viewer3D from '../components/Viewer3D';
import apiClient from '../utils/apiClient';

const FURNITURE_TEMPLATES = [
  { name: 'Table', color: '#b45309', icon: 'M4 6h16M4 10h16M10 16h4M8 20h8', w: 100, h: 60, price: 150 },
  { name: 'Chair', color: '#475569', icon: 'M4 6h16M10 14h4M8 18h8M6 6v14m12-14v14', w: 45, h: 45, price: 45 },
  { name: 'Sofa', color: '#4f46e5', icon: 'M4 12v6a2 2 0 002 2h12a2 2 0 002-2v-6m-16 0h16m-16 0v-2a2 2 0 012-2h12a2 2 0 012 2v2', w: 160, h: 65, price: 300 },
  { name: 'Window', color: '#0ea5e9', icon: 'M4 4h16v16H4V4zm0 8h16M12 4v16', w: 80, h: 10, price: 80 },
  { name: 'Door', color: '#78350f', icon: 'M5 3h14v18H5V3zm3 9h2', w: 40, h: 80, price: 120 },
  { name: 'Desk', color: '#065f46', icon: 'M3 10h18M3 10v9h18v-9M7 10V6a2 2 0 012-2h6a2 2 0 012 2v4', w: 90, h: 50, price: 200 },
];

const CustomerView = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [designs, setDesigns] = useState<any[]>([]);
  const [selectedDesignId, setSelectedDesignId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'noon' | 'evening' | 'night'>('noon');
  const [walkthroughMode, setWalkthroughMode] = useState(false);
  const [showARModal, setShowARModal] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'rooms' | 'furniture'>('rooms');
  const [previewFurniture, setPreviewFurniture] = useState<any | null>(null);

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const response = await apiClient.get('/api/public/designs');
        const fetchedDesigns = response.data.data.designs;
        setDesigns(fetchedDesigns);
        if (fetchedDesigns.length > 0) {
          setSelectedDesignId(fetchedDesigns[0]._id);
        }
      } catch (err) {
        console.error('Failed to load designs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDesigns();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="flex flex-col h-screen bg-[#020617] text-slate-200 overflow-hidden">

      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-slate-900/50 backdrop-blur-md border-b border-white/5 z-20">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 bg-gold-600 rounded-xl flex items-center justify-center shadow-lg shadow-gold-500/20">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-black text-white tracking-tight">Furni<span className="text-gold-400">Forge</span></h2>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-gold-500/10 border border-gold-500/20 rounded-full text-[10px] font-bold text-gold-400 uppercase tracking-widest">
                Customer Preview
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-white">{user.name || 'Guest'}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/60 hover:bg-slate-700 border border-white/5 rounded-xl text-sm font-medium text-slate-400 hover:text-white transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">

        {/* Left Panel: Designs List */}
        <aside className="w-64 glass-dark border-r border-white/5 flex flex-col overflow-y-auto">
          <div className="flex border-b border-white/5">
            <button
              onClick={() => setActiveSidebarTab('rooms')}
              className={`flex-1 p-3 text-xs font-black uppercase tracking-[0.08em] border-b-2 transition-all ${activeSidebarTab === 'rooms' ? 'border-gold-500 text-gold-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
            >
              All Rooms
            </button>
            <button
              onClick={() => setActiveSidebarTab('furniture')}
              className={`flex-1 p-3 text-xs font-black uppercase tracking-[0.08em] border-b-2 transition-all ${activeSidebarTab === 'furniture' ? 'border-gold-500 text-gold-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
            >
              Furniture
            </button>
          </div>
          <div className="flex-1 p-3 space-y-2">
            {activeSidebarTab === 'rooms' ? (
              loading ? (
                <p className="text-sm text-slate-500 text-center py-10">Loading designs...</p>
              ) : designs.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-10">No designs created yet.</p>
              ) : (
                designs.map(d => (
                  <button
                    key={d._id}
                    onClick={() => { setSelectedDesignId(d._id); setActiveSidebarTab('rooms'); }}
                    className={`w-full text-left p-4 rounded-xl transition-all border ${selectedDesignId === d._id
                      ? 'bg-gold-500/10 border-gold-500/30'
                      : 'bg-slate-900/30 border-white/[0.03] hover:bg-slate-800/50'
                      }`}
                  >
                    <p className={`text-sm font-bold ${selectedDesignId === d._id ? 'text-gold-400' : 'text-slate-300'}`}>
                      {d.name}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">
                      {new Date(d.createdAt).toLocaleDateString()}
                    </p>
                  </button>
                ))
              )
            ) : (
              // Furniture Tab
              (() => {
                const activeDesign = designs.find(d => d._id === selectedDesignId);
                if (!activeDesign || !activeDesign.furniture?.length) {
                  return <p className="text-sm text-slate-500 text-center py-10">No furniture in this room</p>;
                }
                return activeDesign.furniture.map((f: any, idx: number) => {
                  const typeStr = f.type || f.name || 'Unknown';
                  const tmpl = FURNITURE_TEMPLATES.find(t => t.name === typeStr);
                  const price = tmpl?.price || f.price || 0;
                  const name = typeStr;
                  return (
                    <button
                      key={idx}
                      onClick={() => setPreviewFurniture({ ...f, ...tmpl, price, name })}
                      className="w-full text-left flex items-center gap-3 p-3 bg-slate-900/40 hover:bg-slate-800/50 rounded-xl border border-white/[0.04] transition-all"
                    >
                      <div className="w-5 h-5 rounded-md border border-white/10 shrink-0" style={{ backgroundColor: f.color }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-300 font-bold truncate">{name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{f.material || 'matte'}</p>
                      </div>
                      <p className="text-[11px] text-green-400 font-black">${price}</p>
                    </button>
                  );
                });
              })()
            )}
          </div>
        </aside>

        {/* 3D Viewer */}
        <div className="flex-1 relative">
          {(() => {
            const activeDesign = designs.find(d => d._id === selectedDesignId);
            if (!activeDesign) {
              return (
                <div className="flex w-full h-full items-center justify-center">
                  <p className="text-slate-500">Pick a design from the left</p>
                </div>
              );
            }
            if (previewFurniture || showARModal) return <div className="flex w-full h-full bg-[#020617]" />; // Unmount to free WebGL context
            return (
              <Viewer3D
                roomWidth={activeDesign.room?.width ?? 8}
                roomHeight={activeDesign.room?.height ?? 6}
                furniture={(activeDesign.furniture || []).map((f: any) => {
                  const fName = f.type || f.name || 'Unknown';
                  return {
                    id: f.id || f._id || Math.random().toString(),
                    name: fName,
                    x: Number(f.x) || 80,
                    y: Number(f.y) || 80,
                    width: (FURNITURE_TEMPLATES.find(t => t.name === fName)?.w) || Number(f.width) || 80,
                    height: (FURNITURE_TEMPLATES.find(t => t.name === fName)?.h) || Number(f.height) || 60,
                    color: f.color || '#ffffff',
                    price: (FURNITURE_TEMPLATES.find(t => t.name === fName)?.price) || 0,
                    material: f.material || 'matte',
                  };
                })}
                ambientIntensity={0.6}
                pointIntensity={1.2}
                softShadows={false}
                roomColor={activeDesign.room?.color ?? '#1e293b'}
                timeOfDay={timeOfDay}
                isFirstPerson={walkthroughMode}
              />
            );
          })()}

          {/* Overlay controls */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10 w-max max-w-[90%] flex-wrap justify-center">
            {/* View hint */}
            <div className="px-4 py-2 glass-dark rounded-full border border-white/10 text-xs font-medium text-slate-400 flex items-center gap-2 pointer-events-none shadow-xl">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {walkthroughMode ? 'Right-click to walk · Drag to look' : 'Drag to rotate · Scroll to zoom'}
            </div>

            {/* Walkthrough Toggle */}
            <button
              onClick={() => setWalkthroughMode(!walkthroughMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-xl border ${walkthroughMode
                ? 'bg-rose-500/20 border-rose-400/50 text-rose-400'
                : 'glass-dark border-white/10 text-slate-300 hover:text-white'
                }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Walkthrough
            </button>

            {/* Time of Day toggle */}
            <div className="flex bg-slate-900/80 p-1 rounded-full border border-white/10 backdrop-blur-md shadow-xl">
              {[
                { id: 'morning', icon: '🌅', label: 'Morning' },
                { id: 'noon', icon: '☀️', label: 'Noon' },
                { id: 'evening', icon: '🌇', label: 'Evening' },
                { id: 'night', icon: '🌙', label: 'Night' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTimeOfDay(t.id as any)}
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-sm transition-all ${timeOfDay === t.id ? 'bg-white/10 shadow-inner' : 'hover:bg-white/5 opacity-50 hover:opacity-100'
                    }`}
                  title={t.label}
                >
                  {t.icon}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Info Panel: Stats */}
        <aside className="w-80 glass-dark border-l border-white/5 p-6 flex flex-col gap-6 overflow-y-auto">
          <div>
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Design Details</h3>

            {(() => {
              const activeDesign = designs.find(d => d._id === selectedDesignId);
              if (!activeDesign) return null;

              const totalCost = activeDesign.furniture?.reduce((sum: number, f: any) => {
                const template = FURNITURE_TEMPLATES.find(t => t.name === f.type);
                return sum + (template?.price || 0);
              }, 0) || 0;

              return (
                <>
                  <div className="p-5 bg-gradient-to-br from-gold-600/10 to-transparent border border-gold-500/20 rounded-2xl mb-4 relative overflow-hidden">
                    <p className="text-sm font-bold text-white mb-1">{activeDesign.name}</p>
                    <p className="text-xs text-slate-400 mb-2">Room size: {activeDesign.room?.width}m × {activeDesign.room?.height}m</p>
                    <p className="text-xl font-black text-green-400">${totalCost}</p>

                    {/* View in AR Button */}
                    <button
                      onClick={() => setShowARModal(true)}
                      className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-gold-600 hover:bg-gold-500 text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow-lg shadow-gold-600/20 transition-all"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      AR View
                    </button>
                  </div>

                  {/* Furniture list */}
                  <div className="space-y-2">
                    {activeDesign.furniture?.map((item: any, idx: number) => {
                      const template = FURNITURE_TEMPLATES.find(t => t.name === item.type);
                      const displayWidth = template ? template.w / 50 : 1.6;
                      const displayHeight = template ? template.h / 50 : 1.2;
                      const itemPrice = template ? template.price : 0;

                      return (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-slate-900/40 rounded-xl border border-white/[0.04]">
                          <div className="w-4 h-4 rounded-md border border-white/10" style={{ backgroundColor: item.color }} />
                          <div className="flex flex-col">
                            <span className="text-sm text-slate-300 font-medium">{item.type || item.name}</span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-green-400 font-bold">${itemPrice}</span>
                              <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-white/5 text-slate-400 uppercase tracking-wider border border-white/[0.05]">{item.material || 'matte'}</span>
                            </div>
                          </div>
                          <span className="text-xs text-slate-600 ml-auto">{displayWidth.toFixed(1)}m × {displayHeight.toFixed(1)}m</span>
                        </div>
                      );
                    })}
                  </div>
                </>
              );
            })()}
          </div>

          <div className="mt-auto space-y-3">
            <div className="p-4 bg-slate-900/40 rounded-2xl border border-white/[0.04]">
              <p className="text-xs text-slate-500 mb-3">Like this design? Contact our team to get a customized layout for your space.</p>
              <button
                onClick={() => window.location.href = 'mailto:hello@furniforge.com?subject=Custom Design Request'}
                className="btn-gold w-full py-3 text-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Request Custom Design
              </button>
            </div>
          </div>
        </aside>
      </main>

      {/* AR Modal */}
      {showARModal && selectedDesignId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative">
            <button
              onClick={() => setShowARModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="w-16 h-16 bg-gold-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gold-500/20">
              <svg className="w-8 h-8 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>

            <h3 className="text-xl font-black text-white mb-2">View in Space (AR)</h3>
            <p className="text-sm text-slate-400 mb-8">Scan this QR code with your phone's camera to place this 3D layout in your actual room using Augmented Reality.</p>

            <div className="bg-white p-4 rounded-2xl inline-block mx-auto mb-6 shadow-inner">
              <QRCodeSVG
                value={`${window.location.origin}/ar-viewer/${selectedDesignId}`}
                size={180}
                level="H"
                includeMargin={false}
              />
            </div>

            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Compatible with iOS & Android</p>
          </div>
        </div>
      )}

      {/* Furniture Preview Modal (2D/3D) */}
      {previewFurniture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 max-w-4xl w-full flex flex-col shadow-2xl relative">
            <button
              onClick={() => setPreviewFurniture(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors z-10"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-xl font-black text-white mb-6 pl-2">Item Preview <span className="text-gold-400">• {previewFurniture.name}</span></h3>

            <div className="flex flex-col md:flex-row gap-6 h-[400px]">
              {/* 2D Preview via simple styled div */}
              <div className="flex-1 bg-slate-950 rounded-2xl border border-white/5 flex flex-col items-center justify-center relative overflow-hidden">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest absolute top-4 left-4 z-10 glass-dark px-3 py-1 rounded-full">2D Top View</p>
                <div className="w-full h-full flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 to-slate-950">
                  <div
                    style={{
                      width: `${(previewFurniture.w || 80) * 1.5}px`,
                      height: `${(previewFurniture.h || 60) * 1.5}px`,
                      backgroundColor: previewFurniture.color,
                      transform: `rotate(${previewFurniture.rotation || 0}deg)`
                    }}
                    className="rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/20"
                  />
                </div>
              </div>

              {/* 3D Preview using Viewer3D but single item */}
              <div className="flex-1 bg-slate-950 rounded-2xl border border-white/5 overflow-hidden relative shadow-inner">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest absolute top-4 left-4 z-10 glass-dark px-3 py-1 rounded-full">3D Realistic View</p>
                <Viewer3D
                  roomWidth={3}
                  roomHeight={3}
                  furniture={[{
                    id: 'preview',
                    name: previewFurniture.name || 'Unknown',
                    x: 75,
                    y: 75,
                    width: Number(previewFurniture.w) || 80,
                    height: Number(previewFurniture.h) || 60,
                    color: previewFurniture.color || '#ffffff',
                    price: Number(previewFurniture.price) || 0,
                    material: previewFurniture.material || 'matte'
                  }]}
                  ambientIntensity={0.8}
                  pointIntensity={1.0}
                  roomColor="#020617"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center px-4 py-3 bg-slate-950/50 rounded-2xl border border-white/5">
              <div className="flex gap-6">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-0.5">Material</p>
                  <p className="text-white text-sm font-bold capitalize">{previewFurniture.material || 'Matte'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-0.5">Dimensions</p>
                  <p className="text-white text-sm font-bold capitalize">{((previewFurniture.w || 80) / 50).toFixed(1)}m × {((previewFurniture.h || 60) / 50).toFixed(1)}m</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-0.5">Unit Price</p>
                <p className="text-green-400 text-2xl font-black">${previewFurniture.price || 0}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerView;
