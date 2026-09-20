import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Palette,
  Layers,
  CheckCircle2,
  Tag,
  ArrowRight,
  ShieldCheck,
  Compass,
  Shirt,
  Info
} from 'lucide-react';
import { GarmentAnalysisResult, OutfitRecommendation } from '../types';
import { generateOutfitRecommendations } from '../utils/recommendations';
import { SAMPLE_GARMENTS } from '../data/sampleImages';

interface RecommendationsViewProps {
  currentResult: GarmentAnalysisResult | null;
  onSelectSample: (result: GarmentAnalysisResult) => void;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  currentResult,
  onSelectSample,
}) => {
  // Use currentResult if available, otherwise default to first sample benchmark
  const activeGarment = currentResult || SAMPLE_GARMENTS[0].result;
  const recommendations: OutfitRecommendation[] = generateOutfitRecommendations(activeGarment);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-linear-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            OBJECTIVE CHROMATIC & TEXTILE COMPATIBILITY
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
          Intelligent Outfit & Color Harmony Recommendations
        </h1>
        <p className="text-sm text-slate-400 mt-1.5 max-w-2xl">
          Algorithmic color wheel harmony (complementary, analogous, and monochromatic vectors) paired with
          fabric weight and weave density balancing. Strictly objective textile science.
        </p>
      </div>

      {/* Active Garment Context Card & Sample Selector */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-4">
          <img
            src={activeGarment.imageUrl}
            alt={activeGarment.garmentType}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-slate-700/80 shrink-0"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
                {activeGarment.category}
              </span>
              <span className="text-xs font-mono text-slate-400">Target Anchor Item</span>
            </div>
            <h3 className="text-lg font-bold text-slate-100 mt-1">
              {activeGarment.garmentType}
            </h3>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
              <span className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full border border-white/20"
                  style={{ backgroundColor: activeGarment.color.hex }}
                />
                <span className="text-slate-200">{activeGarment.color.name}</span>
              </span>
              <span>•</span>
              <span>{activeGarment.estimatedMaterial}</span>
            </div>
          </div>
        </div>

        {/* Quick Switch to Sample if wanted */}
        <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-4">
          <span className="text-xs font-mono text-slate-400 whitespace-nowrap hidden lg:inline">
            Switch Target:
          </span>
          <div className="grid grid-cols-4 gap-1.5 w-full sm:w-auto">
            {SAMPLE_GARMENTS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => onSelectSample(s.result)}
                className={`p-1 rounded-lg border text-[10px] font-mono transition-all text-center truncate max-w-[80px] ${
                  activeGarment.id === s.result.id
                    ? 'bg-indigo-600/30 text-indigo-200 border-indigo-500'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
                title={s.name}
              >
                {s.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3 Algorithmic Outfit Recommendations */}
      <div className="space-y-6">
        {recommendations.map((rec, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 sm:p-7 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5"
          >
            {/* Recommendation Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-mono font-bold flex items-center justify-center">
                    0{index + 1}
                  </span>
                  <h3 className="text-lg font-bold text-slate-100">{rec.vibe}</h3>
                </div>
                <p className="text-xs text-slate-400 mt-1 pl-8">
                  Context: <span className="text-slate-300 font-medium">{rec.occasion}</span>
                </p>
              </div>

              <div className="flex items-center gap-2 pl-8 sm:pl-0">
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {rec.colorHarmonyType}
                </span>
              </div>
            </div>

            {/* Recommended Pairing Elements */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Top (if applicable) */}
              {rec.topRecommendation && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                  <div className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider font-semibold">
                    Complementary Top
                  </div>
                  <div className="text-xs font-bold text-slate-200">
                    {rec.topRecommendation.garment}
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="w-3.5 h-3.5 rounded-md border border-white/20 shrink-0"
                      style={{ backgroundColor: rec.topRecommendation.colorHex }}
                    />
                    <span className="text-slate-300 font-medium">
                      {rec.topRecommendation.colorSuggestion}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                    {rec.topRecommendation.rationale}
                  </p>
                </div>
              )}

              {/* Bottom (if applicable) */}
              {rec.bottomRecommendation && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                  <div className="text-[10px] font-mono text-blue-400 uppercase tracking-wider font-semibold">
                    Complementary Bottom
                  </div>
                  <div className="text-xs font-bold text-slate-200">
                    {rec.bottomRecommendation.garment}
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="w-3.5 h-3.5 rounded-md border border-white/20 shrink-0"
                      style={{ backgroundColor: rec.bottomRecommendation.colorHex }}
                    />
                    <span className="text-slate-300 font-medium">
                      {rec.bottomRecommendation.colorSuggestion}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                    {rec.bottomRecommendation.rationale}
                  </p>
                </div>
              )}

              {/* Outerwear (if applicable) */}
              {rec.outerwearRecommendation && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                  <div className="text-[10px] font-mono text-violet-400 uppercase tracking-wider font-semibold">
                    Layering Outerwear
                  </div>
                  <div className="text-xs font-bold text-slate-200">
                    {rec.outerwearRecommendation.garment}
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="w-3.5 h-3.5 rounded-md border border-white/20 shrink-0"
                      style={{ backgroundColor: rec.outerwearRecommendation.colorHex }}
                    />
                    <span className="text-slate-300 font-medium">
                      {rec.outerwearRecommendation.colorSuggestion}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                    {rec.outerwearRecommendation.rationale}
                  </p>
                </div>
              )}

              {/* Footwear */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                <div className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-semibold">
                  Footwear Anchor
                </div>
                <div className="text-xs font-bold text-slate-200">
                  {rec.footwearRecommendation.garment}
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className="w-3.5 h-3.5 rounded-md border border-white/20 shrink-0"
                    style={{ backgroundColor: rec.footwearRecommendation.colorHex }}
                  />
                  <span className="text-slate-300 font-medium">
                    {rec.footwearRecommendation.colorSuggestion}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                  {rec.footwearRecommendation.rationale}
                </p>
              </div>
            </div>

            {/* Objective Styling & Fabric Balance Notes */}
            <div className="pt-3 border-t border-slate-800/80 bg-slate-950/40 p-4 rounded-xl space-y-2 text-xs">
              <div className="font-semibold text-slate-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Textile Science & Chromatic Harmony Directives</span>
              </div>
              <ul className="space-y-1.5 text-slate-400 pl-2">
                {rec.stylingNotes.map((note, nIdx) => (
                  <li key={nIdx} className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-indigo-400 mt-2 shrink-0" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
