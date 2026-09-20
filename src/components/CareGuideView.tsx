import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  BookOpen,
  Droplets,
  Wind,
  Flame,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Sparkles,
  Info,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';
import { CARE_GUIDE_DATABASE, MaterialCareInfo } from '../data/careGuideData';
import { MaterialType } from '../types';

interface CareGuideViewProps {
  initialMaterial?: MaterialType;
}

export const CareGuideView: React.FC<CareGuideViewProps> = ({ initialMaterial }) => {
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialType>(
    initialMaterial || 'Cotton'
  );
  const [stainFilter, setStainFilter] = useState('');

  const currentInfo: MaterialCareInfo =
    CARE_GUIDE_DATABASE.find((item) => item.type === selectedMaterial) ||
    CARE_GUIDE_DATABASE[0];

  const filteredStains = currentInfo.stainGuide.filter((stain) =>
    stain.stainType.toLowerCase().includes(stainFilter.toLowerCase()) ||
    stain.treatment.toLowerCase().includes(stainFilter.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-linear-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            TEXTILE SCIENCE & LAUNDRY PROTOCOLS
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
          Smart Textile Care & Preservation Directory
        </h1>
        <p className="text-sm text-slate-400 mt-1.5 max-w-2xl">
          Material-specific laundry methodologies, thermodynamic ironing thresholds, enzymatic stain removal, and fiber longevity preservation guidelines.
        </p>
      </div>

      {/* Material Selector Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {CARE_GUIDE_DATABASE.map((item) => {
          const isSelected = selectedMaterial === item.type;
          return (
            <button
              key={item.type}
              type="button"
              onClick={() => setSelectedMaterial(item.type)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950 scale-102'
                  : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <span>{item.type}</span>
            </button>
          );
        })}
      </div>

      {/* Active Material Main Guide */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-xl space-y-6">
        {/* Title & Tagline */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-100">{currentInfo.displayName}</h2>
              <span className={`px-2.5 py-0.5 text-xs font-mono rounded-md border ${currentInfo.badgeColor}`}>
                {currentInfo.type}
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">{currentInfo.tagline}</p>
          </div>
          <div className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 shrink-0">
            Origin: {currentInfo.origin}
          </div>
        </div>

        {/* 4 Core Maintenance Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pillar 1: Washing */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-indigo-400">
              <div className="flex items-center gap-2 font-semibold text-xs text-slate-200">
                <Droplets className="w-4 h-4 text-indigo-400" />
                <span>Washing</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300">
                {currentInfo.symbols.wash}
              </span>
            </div>
            <div className="text-xs font-semibold text-slate-100">{currentInfo.washing.recommendedTemp}</div>
            <p className="text-xs text-slate-400 leading-relaxed">{currentInfo.washing.description}</p>
          </div>

          {/* Pillar 2: Drying */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-blue-400">
              <div className="flex items-center gap-2 font-semibold text-xs text-slate-200">
                <Wind className="w-4 h-4 text-blue-400" />
                <span>Drying Method</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300">
                {currentInfo.symbols.dry}
              </span>
            </div>
            <div className="text-xs font-semibold text-slate-100">{currentInfo.drying.method}</div>
            <p className="text-xs text-slate-400 leading-relaxed">{currentInfo.drying.description}</p>
          </div>

          {/* Pillar 3: Ironing */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-amber-400">
              <div className="flex items-center gap-2 font-semibold text-xs text-slate-200">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Ironing & Heat</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300">
                {currentInfo.symbols.iron}
              </span>
            </div>
            <div className="text-xs font-semibold text-slate-100">Max: {currentInfo.ironing.maxTemp}</div>
            <p className="text-xs text-slate-400 leading-relaxed">{currentInfo.ironing.description}</p>
          </div>

          {/* Pillar 4: Bleach & Dry Clean */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-rose-400">
              <div className="flex items-center gap-2 font-semibold text-xs text-slate-200">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Bleach & Solvent</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-300">
                {currentInfo.symbols.bleach}
              </span>
            </div>
            <div className="text-xs font-semibold text-slate-100">
              Bleach: {currentInfo.bleaching.allowed ? 'Allowed' : 'Prohibited'}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{currentInfo.bleaching.warning}</p>
          </div>
        </div>

        {/* Do's and Don'ts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="p-5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-3">
            <h3 className="text-sm font-semibold text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Recommended Practices (Do's)</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {currentInfo.dos.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-3">
            <h3 className="text-sm font-semibold text-rose-300 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-400" />
              <span>Harmful Practices (Don'ts)</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {currentInfo.donts.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Stain Removal Protocol Matrix */}
        <div className="pt-4 border-t border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Targeted Stain Removal Protocol for {currentInfo.displayName}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Immediate remediation steps prior to permanent pigment oxidation.
              </p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={stainFilter}
                onChange={(e) => setStainFilter(e.target.value)}
                placeholder="Filter stain type..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredStains.map((stain, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5 text-xs"
              >
                <div className="font-semibold text-indigo-300">{stain.stainType}</div>
                <p className="text-slate-400 leading-relaxed text-[11px]">{stain.treatment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
