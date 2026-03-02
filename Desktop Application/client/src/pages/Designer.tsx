import React, { useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Canvas2D, { Furniture } from '../components/Canvas2D';
import Viewer3D from '../components/Viewer3D';
import ColorPicker from '../components/ColorPicker';
import apiClient from '../utils/apiClient';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

type ViewMode = '2D' | '3D';
type TabType = 'components' | 'properties' | 'lighting';

const FURNITURE_TEMPLATES = [
  { name: 'Table', color: '#b45309', icon: 'M4 6h16M4 10h16M10 16h4M8 20h8', w: 100, h: 60, price: 150 },
  { name: 'Chair', color: '#475569', icon: 'M4 6h16M10 14h4M8 18h8M6 6v14m12-14v14', w: 45, h: 45, price: 45 },
  { name: 'Sofa', color: '#4f46e5', icon: 'M4 12v6a2 2 0 002 2h12a2 2 0 002-2v-6m-16 0h16m-16 0v-2a2 2 0 012-2h12a2 2 0 012 2v2', w: 160, h: 65, price: 300 },
  { name: 'Window', color: '#0ea5e9', icon: 'M4 4h16v16H4V4zm0 8h16M12 4v16', w: 80, h: 10, price: 80 },
  { name: 'Door', color: '#78350f', icon: 'M5 3h14v18H5V3zm3 9h2', w: 40, h: 80, price: 120 },
  { name: 'Desk', color: '#065f46', icon: 'M3 10h18M3 10v9h18v-9M7 10V6a2 2 0 012-2h6a2 2 0 012 2v4', w: 90, h: 50, price: 200 },
];

const Designer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const roomState = (location.state as any)?.room;

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isDesigner = user.role === 'designer';

  const [viewMode, setViewMode] = useState<ViewMode>('2D');
  const [activeTab, setActiveTab] = useState<TabType>('components');
  const [room, setRoom] = useState({
    width: roomState?.width ?? 8,
    height: roomState?.height ?? 6,
    color: roomState?.color ?? '#1e293b',
  });
  const [furniture, setFurniture] = useState<Furniture[]>([
    { id: '1', name: 'Table', x: 80, y: 80, width: 100, height: 60, color: '#b45309', price: 150 },
    { id: '2', name: 'Chair', x: 240, y: 100, width: 45, height: 45, color: '#475569', price: 45 },
  ]);

  // Selection
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedItem = furniture.find(f => f.id === selectedId) ?? null;

  // Snap-to-grid
  const [snapEnabled, setSnapEnabled] = useState(true);

  // Lighting
  const [ambientIntensity, setAmbientIntensity] = useState(0.6);
  const [pointIntensity, setPointIntensity] = useState(1.2);
  const [softShadows, setSoftShadows] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'noon' | 'evening' | 'night'>('noon');

  // Design saving
  const [designName, setDesignName] = useState('My Room Design');
  const [savedDesigns, setSavedDesigns] = useState<any[]>([]);
  const [toast, setToast] = useState('');
  const [showLoadModal, setShowLoadModal] = useState(false);

  // User Management
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [userList, setUserList] = useState<any[]>([]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const addFurniture = (tmpl: typeof FURNITURE_TEMPLATES[0]) => {
    setFurniture(prev => [...prev, {
      id: Date.now().toString(),
      name: tmpl.name,
      x: 80,
      y: 80,
      width: tmpl.w,
      height: tmpl.h,
      color: tmpl.color,
      price: tmpl.price,
    }]);
  };

  const updateSelected = (patch: Partial<Furniture>) => {
    if (!selectedId) return;
    setFurniture(prev => prev.map(f => f.id === selectedId ? { ...f, ...patch } : f));
  };

  const deleteSelected = () => {
    setFurniture(prev => prev.filter(f => f.id !== selectedId));
    setSelectedId(null);
  };

  const handleSave = async () => {
    try {
      await apiClient.post('/api/designs', {
        name: designName,
        room,
        furniture: furniture.map(f => ({ id: f.id, type: f.name, x: f.x, y: f.y, color: f.color, scale: 1, rotation: 0, material: f.material })),
      });
      showToast('✅ Design saved to cloud!');
    } catch (err: any) {
      console.error('Save failed', err.response?.data || err);
      showToast('❌ Save failed – check your connection.');
    }
  };

  const handleLoad = async () => {
    try {
      const res = await apiClient.get('/api/designs');
      setSavedDesigns(res.data.data.designs);
      setShowLoadModal(true);
    } catch {
      showToast('❌ Could not load designs.');
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await apiClient.get('/api/admin/users');
      setUserList(res.data.data.users);
      setShowUsersModal(true);
    } catch {
      showToast('❌ Could not load users. Are you an admin?');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user? All their designs will be lost!")) return;
    try {
      await apiClient.delete(`/api/admin/users/${userId}`);
      showToast('✅ User deleted successfully');
      setUserList(prev => prev.filter(u => u._id !== userId));
    } catch {
      showToast('❌ Failed to delete user');
    }
  };

  const loadDesign = (design: any) => {
    setDesignName(design.name);
    if (design.room) setRoom(design.room);
    if (design.furniture) {
      setFurniture(design.furniture.map((f: any) => ({
        id: f.id ?? Date.now().toString(),
        name: f.type,
        x: f.x,
        y: f.y,
        width: (FURNITURE_TEMPLATES.find(t => t.name === f.type)?.w) ?? 80,
        height: (FURNITURE_TEMPLATES.find(t => t.name === f.type)?.h) ?? 60,
        color: f.color,
        price: (FURNITURE_TEMPLATES.find(t => t.name === f.type)?.price) ?? 0,
        material: f.material,
      })));
    }
    setShowLoadModal(false);
    showToast(`📂 Loaded: ${design.name}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('FurniForge - Quotation/Invoice', 14, 20);
    doc.text(`Design Name: ${designName}`, 14, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 40);

    const tableColumn = ["Item", "Unit Price", "Quantity", "Total"];
    const tableRows: any[] = [];

    const qtyMap: Record<string, { count: number, price: number }> = {};
    furniture.forEach(f => {
      if (!qtyMap[f.name]) qtyMap[f.name] = { count: 0, price: f.price };
      qtyMap[f.name].count += 1;
    });

    let totalCost = 0;
    Object.keys(qtyMap).forEach(key => {
      const item = qtyMap[key];
      const itemTotal = item.count * item.price;
      totalCost += itemTotal;
      tableRows.push([key, `$${item.price}`, item.count, `$${itemTotal}`]);
    });

    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 50,
    });

    doc.text(`Grand Total: $${totalCost}`, 14, (doc as any).lastAutoTable.finalY + 10);
    doc.save(`${designName.replace(/\s+/g, '_')}_invoice.pdf`);
    showToast('📄 Invoice PDF downloaded');
  };

  const handleExport3D = () => {
    if ((window as any)._exportGLTF) {
      (window as any)._exportGLTF();
      showToast('📦 3D Model export started');
    } else {
      showToast('❌ Must switch to 3D View first');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans">

      {/* ─── Header ─── */}
      <header className="flex items-center justify-between px-6 py-3 bg-slate-900/50 backdrop-blur-md border-b border-white/[0.06] z-20 flex-shrink-0">
        {/* Left: Logo + role */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-black text-white tracking-tight">Furni<span className="text-primary-400">Forge</span></h2>
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${isDesigner ? 'bg-primary-500/10 border border-primary-500/20 text-primary-400' : 'bg-gold-500/10 border border-gold-500/20 text-gold-400'}`}>
                <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                {isDesigner ? 'Designer Workspace' : 'Customer Preview'}
              </span>
            </div>
          </div>

          {/* Snap toggle */}
          <button onClick={() => setSnapEnabled(!snapEnabled)}
            className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${snapEnabled ? 'bg-primary-500/10 border-primary-500/30 text-primary-400' : 'bg-white/[0.03] border-white/[0.08] text-slate-500 hover:text-slate-300'
              }`}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            {snapEnabled ? 'Snap ON' : 'Snap OFF'}
          </button>
        </div>

        {/* Center: 2D / 3D toggle */}
        <div className="flex bg-slate-950/80 p-1 rounded-xl border border-white/[0.06] shadow-inner">
          {(['2D', '3D'] as ViewMode[]).map((mode) => (
            <button key={mode} onClick={() => setViewMode(mode)}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${viewMode === mode ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' : 'text-slate-500 hover:text-slate-300'
                }`}>
              {mode === '2D' ? (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>
              )}
              {mode} View
            </button>
          ))}
        </div>

        {/* Right: Save, Load, Logout, Export */}
        <div className="flex items-center gap-2">
          {isDesigner && (
            <button onClick={fetchUsers} className="btn-ghost text-xs px-3 py-2 text-slate-400 hover:text-white" title="Manage Users">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              Users
            </button>
          )}
          <button onClick={handleExport3D} className="btn-ghost text-xs px-3 py-2 text-slate-400 hover:text-white" title="Export 3D Model">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" /></svg>
            Export 3D
          </button>
          <button onClick={handleExportPDF} className="btn-ghost text-xs px-3 py-2 text-slate-400 hover:text-white" title="Export PDF Invoice">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            PDF
          </button>
          <button onClick={handleLoad}
            className="btn-ghost text-xs px-4 py-2">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            Load
          </button>
          <button onClick={handleSave}
            className="btn-primary text-xs px-4 py-2">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
            Save
          </button>
          <button onClick={handleLogout}
            className="btn-ghost text-xs px-3 py-2 text-slate-500 hover:text-red-400">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </div>
      </header>

      {/* ─── Main ─── */}
      <main className="flex-1 flex overflow-hidden">

        {/* ── Glassmorphism Sidebar ── */}
        <aside className="w-[300px] flex-shrink-0 glass-dark border-r border-white/[0.05] flex flex-col overflow-hidden">

          {/* Design name */}
          <div className="px-5 pt-5 pb-3 border-b border-white/[0.05]">
            <input
              value={designName} onChange={(e) => setDesignName(e.target.value)}
              className="w-full bg-transparent text-sm font-bold text-white border-b border-white/10 focus:border-primary-500/50 outline-none pb-1 transition-colors placeholder:text-slate-600"
              placeholder="Design name…"
            />
            <p className="text-[10px] text-slate-600 mt-1">Room: {room.width}m × {room.height}m</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 px-3 pt-3 pb-2">
            {[
              { id: 'components', label: 'Library', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
              { id: 'properties', label: 'Props', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
              { id: 'lighting', label: 'Lights', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
            ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as TabType)}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto px-4 pb-6">

            {/* ── Components Tab ── */}
            {activeTab === 'components' && (
              <div className="space-y-4 pt-2">
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">Furniture Items</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {FURNITURE_TEMPLATES.map((tmpl) => (
                    <button key={tmpl.name} onClick={() => addFurniture(tmpl)}
                      className="group flex flex-col items-center justify-center gap-2 p-4 bg-slate-900/50 border border-white/[0.05] rounded-2xl hover:border-primary-500/40 hover:bg-slate-800/60 transition-all active:scale-95 text-center">
                      <div className="w-10 h-10 rounded-xl bg-slate-800/80 flex items-center justify-center group-hover:bg-primary-500/10 transition-colors">
                        <svg className="w-5 h-5 text-slate-400 group-hover:text-primary-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={tmpl.icon} />
                        </svg>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 group-hover:text-white uppercase tracking-wider">{tmpl.name}</span>
                        <span className="block text-[10px] text-green-400/80 mt-1">${tmpl.price}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="pt-3 border-t border-white/[0.05]">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-slate-400">Total Project Cost</span>
                    <span className="text-sm font-black text-green-400">
                      ${furniture.reduce((sum, f) => sum + (f.price || 0), 0)}
                    </span>
                  </div>
                  <ColorPicker
                    label="Floor Colour"
                    color={room.color}
                    onChange={(c) => setRoom(r => ({ ...r, color: c }))}
                  />
                </div>
              </div>
            )}

            {/* ── Properties Tab ── */}
            {activeTab === 'properties' && (
              <div className="space-y-5 pt-2">
                {!selectedItem ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900/60 flex items-center justify-center mb-3">
                      <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
                      </svg>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">Click a furniture item<br />on the canvas to edit it</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-white">{selectedItem.name}</p>
                      <button onClick={deleteSelected}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-xs font-bold text-red-400 transition-all">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        Delete
                      </button>
                    </div>

                    <ColorPicker
                      label="Item Colour"
                      color={selectedItem.color}
                      onChange={(c) => updateSelected({ color: c })}
                    />

                    {/* Material Options */}
                    <div className="space-y-3 pt-2">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Material / Texture</p>
                      <div className="grid grid-cols-2 gap-2">
                        {['matte', 'wood', 'metal', 'fabric'].map((mat) => (
                          <button key={mat} onClick={() => updateSelected({ material: mat })}
                            className={`py-2 rounded-xl text-[11px] font-bold tracking-wide uppercase transition-all border ${(selectedItem.material || 'matte') === mat
                              ? 'bg-sky-500/20 border-sky-400/50 text-sky-400 shadow-md shadow-sky-500/10'
                              : 'bg-white/[0.03] border-white/[0.08] text-slate-500 hover:bg-white/[0.06] hover:text-slate-300'
                              }`}>
                            {mat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Dimensions</p>
                      {[
                        { label: 'Width (px)', val: selectedItem.width, key: 'width' },
                        { label: 'Height (px)', val: selectedItem.height, key: 'height' },
                      ].map(({ label, val, key }) => (
                        <div key={key}>
                          <div className="flex justify-between mb-1.5">
                            <span className="text-xs text-slate-400">{label}</span>
                            <span className="text-xs font-bold text-white">{val}px</span>
                          </div>
                          <input type="range" min={20} max={250} value={val} className="slider-input"
                            onChange={(e) => updateSelected({ [key]: Number(e.target.value) })} />
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Position</p>
                      <div className="grid grid-cols-2 gap-3">
                        {[{ label: 'X', key: 'x', val: selectedItem.x }, { label: 'Y', key: 'y', val: selectedItem.y }].map(({ label, key, val }) => (
                          <div key={key}>
                            <label className="text-[10px] text-slate-500 mb-1 block">{label} position</label>
                            <input type="number" value={Math.round(val)} className="input-field text-sm"
                              onChange={(e) => updateSelected({ [key]: Number(e.target.value) })} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ── Lighting Tab ── */}
            {activeTab === 'lighting' && (
              <div className="space-y-6 pt-2">
                <div className="p-4 bg-gradient-to-br from-gold-600/10 to-transparent border border-gold-500/20 rounded-2xl">
                  <div className="flex items-center gap-2 mb-1.5">
                    <svg className="w-4 h-4 text-gold-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.997.356-2.048 1-2.938a5 5 0 10-6.063 6.948 3.5 3.5 0 015.063-4.01z" />
                    </svg>
                    <span className="text-xs font-black text-gold-400 uppercase tracking-wider">Lighting Studio</span>
                  </div>
                  <p className="text-[10px] text-slate-500">Adjust scene illumination for realistic previews.</p>
                </div>

                {/* Time of Day */}
                <div className="space-y-3">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Time of Day</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'morning', label: 'Morning', icon: '🌅' },
                      { id: 'noon', label: 'Noon', icon: '☀️' },
                      { id: 'evening', label: 'Evening', icon: '🌇' },
                      { id: 'night', label: 'Night', icon: '🌙' },
                    ].map((time) => (
                      <button key={time.id} onClick={() => setTimeOfDay(time.id as any)}
                        className={`flex items-center gap-2 py-2 px-3 rounded-xl text-[11px] font-bold tracking-wide transition-all border ${timeOfDay === time.id
                          ? 'bg-gold-500/20 border-gold-400/50 text-gold-400 shadow-md shadow-gold-500/10'
                          : 'bg-white/[0.03] border-white/[0.08] text-slate-500 hover:bg-white/[0.06] hover:text-slate-300'
                          }`}>
                        <span className="text-lg">{time.icon}</span> {time.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ambient */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-400 font-semibold">Ambient Light</span>
                    <span className="text-xs font-bold text-white">{Math.round(ambientIntensity * 100)}%</span>
                  </div>
                  <input type="range" min={0} max={200} value={ambientIntensity * 100} className="slider-input"
                    onChange={(e) => setAmbientIntensity(Number(e.target.value) / 100)} />
                  <div className="flex justify-between text-[9px] text-slate-700">
                    <span>Dark</span><span>Bright</span>
                  </div>
                </div>

                {/* Directional */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-400 font-semibold">Directional Light</span>
                    <span className="text-xs font-bold text-white">{Math.round(pointIntensity * 100)}%</span>
                  </div>
                  <input type="range" min={0} max={300} value={pointIntensity * 100} className="slider-input"
                    onChange={(e) => setPointIntensity(Number(e.target.value) / 100)} />
                  <div className="flex justify-between text-[9px] text-slate-700">
                    <span>Off</span><span>Max</span>
                  </div>
                </div>

                {/* Soft Shadows */}
                <div className="flex items-center justify-between p-3.5 bg-slate-900/50 border border-white/[0.05] rounded-2xl">
                  <div>
                    <p className="text-xs font-bold text-white">Soft Shadows</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Realistic shadow diffusion</p>
                  </div>
                  <button onClick={() => setSoftShadows(!softShadows)}
                    className={`relative w-11 h-6 rounded-full transition-all duration-300 ${softShadows ? 'bg-primary-600' : 'bg-slate-700'}`}>
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${softShadows ? 'left-[22px]' : 'left-0.5'}`} />
                  </button>
                </div>

                {/* Snap toggle (also here for quick access) */}
                <div className="flex items-center justify-between p-3.5 bg-slate-900/50 border border-white/[0.05] rounded-2xl">
                  <div>
                    <p className="text-xs font-bold text-white">Snap to Grid</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Align elements to 0.5m grid</p>
                  </div>
                  <button onClick={() => setSnapEnabled(!snapEnabled)}
                    className={`relative w-11 h-6 rounded-full transition-all duration-300 ${snapEnabled ? 'bg-primary-600' : 'bg-slate-700'}`}>
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${snapEnabled ? 'left-[22px]' : 'left-0.5'}`} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* ── Canvas Area ── */}
        <div className="flex-1 flex items-center justify-center p-8 bg-[#020617] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:28px_28px] relative overflow-hidden">

          {/* View label */}
          <div className="absolute top-4 right-4 glass-dark px-3 py-1.5 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-white/[0.05] z-10">
            {viewMode === '2D' ? 'Blueprint 2D' : 'Reality 3D'} · {room.width}×{room.height}m
          </div>

          {viewMode === '2D' ? (
            <div className="relative">
              <Canvas2D
                roomWidth={room.width}
                roomHeight={room.height}
                furniture={furniture}
                setFurniture={setFurniture}
                selectedId={selectedId}
                onSelect={(id) => { setSelectedId(id); if (id) setActiveTab('properties'); }}
                snapEnabled={snapEnabled}
                roomColor={room.color}
              />
            </div>
          ) : (
            <div className="w-full h-full">
              <Viewer3D
                roomWidth={room.width}
                roomHeight={room.height}
                furniture={furniture}
                selectedId={selectedId}
                ambientIntensity={ambientIntensity}
                pointIntensity={pointIntensity}
                softShadows={softShadows}
                roomColor={room.color}
                timeOfDay={timeOfDay}
              />
            </div>
          )}
        </div>
      </main>

      {/* ─── Toast ─── */}
      {toast && (
        <div className="toast">{toast}</div>
      )}

      {/* ─── Load Modal ─── */}
      {showLoadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="glass-dark rounded-3xl border border-white/[0.08] p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white">Load Design</h3>
              <button onClick={() => setShowLoadModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/[0.05] hover:bg-white/10 text-slate-400 hover:text-white transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {savedDesigns.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">No saved designs yet</div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {savedDesigns.map((d) => (
                  <button key={d._id} onClick={() => loadDesign(d)}
                    className="w-full flex items-center gap-4 p-4 bg-slate-900/60 hover:bg-slate-800 border border-white/[0.05] hover:border-primary-500/30 rounded-2xl transition-all text-left">
                    <div className="w-8 h-8 bg-primary-500/10 rounded-xl flex items-center justify-center">
                      <svg className="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{d.name}</p>
                      <p className="text-[10px] text-slate-500">{d.furniture?.length ?? 0} items · {new Date(d.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Users Modal ─── */}
      {showUsersModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="glass-dark rounded-3xl border border-white/[0.08] p-6 w-full max-w-2xl shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white">Manage Users</h3>
              <button
                onClick={() => setShowUsersModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/[0.05] hover:bg-white/10 text-slate-400 hover:text-white transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {userList.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">No users found</div>
            ) : (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {userList.map((u) => (
                  <div key={u._id} className="w-full flex items-center justify-between p-4 bg-slate-900/60 border border-white/[0.05] rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-inner ${u.role === 'designer' ? 'bg-primary-600' : 'bg-gold-600'}`}>
                        {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{u.name || 'Unknown User'}</p>
                        <p className="text-xs text-slate-400">{u.email || 'No Email'}</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${u.role === 'designer' ? 'bg-primary-500/20 text-primary-400' : 'bg-gold-500/20 text-gold-400'}`}>
                          {u.role || 'user'}
                        </span>
                      </div>
                    </div>

                    {u._id !== user?._id && u._id !== user?.id && ( // Prevent deleting oneself
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl text-xs font-bold transition-all border border-red-500/20"
                        title="Delete User & their designs"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Designer;
