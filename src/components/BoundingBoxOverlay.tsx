import React from 'react';
import { BoundingBox } from '../types';

interface BoundingBoxOverlayProps {
  boundingBox?: BoundingBox;
  showBox: boolean;
  colorHex?: string;
  garmentType: string;
  confidence: number;
}

export const BoundingBoxOverlay: React.FC<BoundingBoxOverlayProps> = ({
  boundingBox,
  showBox,
  colorHex = '#6366F1',
  garmentType,
  confidence,
}) => {
  if (!showBox || !boundingBox) return null;

  const { x, y, width, height } = boundingBox;

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden rounded-2xl">
      {/* Primary Detection Bounding Box */}
      <div
        className="absolute border-2 border-indigo-400 bg-indigo-500/10 transition-all duration-300 shadow-sm"
        style={{
          left: `${x}%`,
          top: `${y}%`,
          width: `${width}%`,
          height: `${height}%`,
          boxShadow: '0 0 15px rgba(99, 102, 241, 0.35)',
        }}
      >
        {/* Corner HUD Markers */}
        <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-indigo-300" />
        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-indigo-300" />
        <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-indigo-300" />
        <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-indigo-300" />

        {/* Central Crosshair */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 opacity-40">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-indigo-300 -translate-y-1/2" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-indigo-300 -translate-x-1/2" />
        </div>

        {/* Top Tag Label */}
        <div className="absolute -top-7 left-0 flex items-center gap-1.5 px-2 py-0.5 bg-indigo-600 text-white text-[11px] font-mono font-medium rounded-t-md shadow-md tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="truncate max-w-[180px]">{garmentType}</span>
          <span className="text-indigo-200 border-l border-indigo-400/40 pl-1.5">
            {Math.round(confidence * 100)}%
          </span>
        </div>

        {/* Coordinate indicator in bottom right */}
        <div className="absolute -bottom-5 right-0 text-[9px] font-mono text-indigo-300/80 px-1 bg-slate-950/80 rounded">
          {Math.round(x)}%, {Math.round(y)}% | {Math.round(width)}×{Math.round(height)}%
        </div>
      </div>
    </div>
  );
};
