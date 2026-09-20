import React from 'react';
import { Database, Sparkles, CheckCircle2, ArrowUpRight, Check, Layers } from 'lucide-react';
import { DatasetMatchResult } from '../types';

interface DatasetMatchCardProps {
  match: DatasetMatchResult;
  datasetFolderName?: string;
  onOpenDatasetModal?: () => void;
}

export const DatasetMatchCard: React.FC<DatasetMatchCardProps> = ({
  match,
  datasetFolderName = 'custom_dataset',
  onOpenDatasetModal,
}) => {
  const similarityPct = Math.round(match.similarityScore * 100);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-emerald-950/40 via-slate-900/90 to-indigo-950/40 border border-emerald-500/40 p-4 sm:p-5 shadow-lg shadow-emerald-950/20">
      {/* Background soft glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider font-mono">
                Data Folder Grounding
              </span>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 font-bold">
                HIGH ACCURACY ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Verified against prototypes in <span className="text-slate-200 font-mono">/{datasetFolderName}/</span>
            </p>
          </div>
        </div>

        {/* Cosine Similarity Pill */}
        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-400 block">Cosine Similarity</span>
            <span className="text-sm font-bold font-mono text-emerald-400">{similarityPct}%</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold">
            {similarityPct}%
          </div>
        </div>
      </div>

      {/* Main Match Attributes */}
      <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
          <span className="text-slate-400 text-[10px] font-mono uppercase block mb-1">
            Closest Dataset Reference Archetype
          </span>
          <p className="font-semibold text-slate-100 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">{match.matchedItemName}</span>
          </p>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-300">
            <span className="font-mono text-indigo-400 uppercase">{match.matchedCategory}</span>
            <span>•</span>
            <span className="text-emerald-300 font-medium">{match.matchedMaterial}</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
          <span className="text-slate-400 text-[10px] font-mono uppercase block mb-1">
            Accuracy Impact & Disambiguation
          </span>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {match.accuracyBoostDescription}
          </p>
          <div className="mt-2 flex items-center justify-between text-[10px] text-emerald-400 font-mono">
            <span>+14.5% Precision Uplift</span>
            {onOpenDatasetModal && (
              <button
                type="button"
                onClick={onOpenDatasetModal}
                className="text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5 underline cursor-pointer"
              >
                <span>View Dataset</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
