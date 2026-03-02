import React from 'react';
import { HexColorPicker } from 'react-colorful';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

const ColorPicker = ({ color, onChange, label }: ColorPickerProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative">
      {label && <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</p>}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 w-full px-3 py-2.5 bg-slate-900/60 border border-white/10 rounded-xl hover:border-white/20 transition-all"
      >
        <div
          className="w-7 h-7 rounded-lg border border-white/10 shadow-inner flex-shrink-0"
          style={{ backgroundColor: color }}
        />
        <span className="text-sm font-mono text-slate-300 uppercase">{color}</span>
        <svg className={`w-4 h-4 text-slate-500 ml-auto transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 p-4 glass-panel rounded-2xl shadow-2xl border border-white/10">
          <HexColorPicker color={color} onChange={onChange} />
          <div className="mt-3 flex items-center gap-2">
            <input
              type="text"
              value={color}
              onChange={(e) => /^#[0-9A-Fa-f]{0,6}$/.test(e.target.value) && onChange(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-slate-900/80 border border-white/10 rounded-lg text-xs font-mono text-slate-200 outline-none focus:border-primary-500/50"
            />
            <button type="button" onClick={() => setOpen(false)}
              className="px-3 py-1.5 bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold rounded-lg transition-colors">
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
