import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Crop,
  X,
  Check,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Grid,
  Maximize2,
  Sparkles,
  Move
} from 'lucide-react';

interface ImageCropperModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onCropComplete: (croppedBase64: string) => void;
  title?: string;
  actionLabel?: string;
}

type AspectPreset = 'free' | '1:1' | '4:5' | '3:4' | '16:9';

interface NormalizedCrop {
  x: number; // 0 to 100%
  y: number; // 0 to 100%
  width: number; // 0 to 100%
  height: number; // 0 to 100%
}

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  isOpen,
  imageSrc,
  onClose,
  onCropComplete,
  title = 'Crop & Focus Textile Region',
  actionLabel = 'Apply & Run VASTRA Pipeline',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Normalized crop rectangle (percentages 0 - 100)
  const [crop, setCrop] = useState<NormalizedCrop>({
    x: 10,
    y: 10,
    width: 80,
    height: 80,
  });

  const [aspectPreset, setAspectPreset] = useState<AspectPreset>('free');
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(1);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [naturalDimensions, setNaturalDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  // Dragging state
  const dragRef = useRef<{
    mode: 'move' | 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w' | null;
    startX: number;
    startY: number;
    startCrop: NormalizedCrop;
  }>({
    mode: null,
    startX: 0,
    startY: 0,
    startCrop: { x: 10, y: 10, width: 80, height: 80 },
  });

  // Reset state when a new image is loaded
  useEffect(() => {
    if (isOpen && imageSrc) {
      setCrop({ x: 10, y: 10, width: 80, height: 80 });
      setRotation(0);
      setFlipH(false);
      setZoom(1);
      setAspectPreset('free');
    }
  }, [isOpen, imageSrc]);

  const handleImageLoaded = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setNaturalDimensions({
      width: img.naturalWidth,
      height: img.naturalHeight,
    });
  };

  // Adjust crop when aspect ratio changes
  const applyAspectPreset = (preset: AspectPreset) => {
    setAspectPreset(preset);
    if (preset === 'free') return;

    let targetRatio = 1; // width / height
    if (preset === '1:1') targetRatio = 1;
    if (preset === '4:5') targetRatio = 4 / 5;
    if (preset === '3:4') targetRatio = 3 / 4;
    if (preset === '16:9') targetRatio = 16 / 9;

    setCrop((prev) => {
      // Calculate new width & height based on current center
      const centerX = prev.x + prev.width / 2;
      const centerY = prev.y + prev.height / 2;

      let newWidth = prev.width;
      let newHeight = newWidth / targetRatio;

      if (newHeight > 90) {
        newHeight = 90;
        newWidth = newHeight * targetRatio;
      }
      if (newWidth > 90) {
        newWidth = 90;
        newHeight = newWidth / targetRatio;
      }

      let newX = Math.max(0, Math.min(100 - newWidth, centerX - newWidth / 2));
      let newY = Math.max(0, Math.min(100 - newHeight, centerY - newHeight / 2));

      return {
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
      };
    });
  };

  // Start pointer dragging
  const handlePointerDown = (
    e: React.PointerEvent,
    mode: 'move' | 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w'
  ) => {
    e.preventDefault();
    e.stopPropagation();

    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    dragRef.current = {
      mode,
      startX: e.clientX,
      startY: e.clientY,
      startCrop: { ...crop },
    };
  };

  // Pointer move handler
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.mode || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const deltaXPercent = ((e.clientX - dragRef.current.startX) / rect.width) * 100;
    const deltaYPercent = ((e.clientY - dragRef.current.startY) / rect.height) * 100;

    const { mode, startCrop } = dragRef.current;
    const minSize = 8; // min percentage

    setCrop(() => {
      let newX = startCrop.x;
      let newY = startCrop.y;
      let newWidth = startCrop.width;
      let newHeight = startCrop.height;

      if (mode === 'move') {
        newX = Math.min(Math.max(0, startCrop.x + deltaXPercent), 100 - startCrop.width);
        newY = Math.min(Math.max(0, startCrop.y + deltaYPercent), 100 - startCrop.height);
        return { x: newX, y: newY, width: startCrop.width, height: startCrop.height };
      }

      // Handle corner and edge resizing
      if (mode.includes('e')) {
        newWidth = Math.max(minSize, Math.min(100 - startCrop.x, startCrop.width + deltaXPercent));
      }
      if (mode.includes('w')) {
        const potentialWidth = startCrop.width - deltaXPercent;
        if (potentialWidth >= minSize && startCrop.x + deltaXPercent >= 0) {
          newWidth = potentialWidth;
          newX = startCrop.x + deltaXPercent;
        }
      }
      if (mode.includes('s')) {
        newHeight = Math.max(minSize, Math.min(100 - startCrop.y, startCrop.height + deltaYPercent));
      }
      if (mode.includes('n')) {
        const potentialHeight = startCrop.height - deltaYPercent;
        if (potentialHeight >= minSize && startCrop.y + deltaYPercent >= 0) {
          newHeight = potentialHeight;
          newY = startCrop.y + deltaYPercent;
        }
      }

      // Constrain aspect ratio if locked
      if (aspectPreset !== 'free') {
        let ratio = 1;
        if (aspectPreset === '1:1') ratio = 1;
        if (aspectPreset === '4:5') ratio = 4 / 5;
        if (aspectPreset === '3:4') ratio = 3 / 4;
        if (aspectPreset === '16:9') ratio = 16 / 9;

        // Balance width/height to ratio
        if (mode === 'e' || mode === 'w') {
          newHeight = Math.max(minSize, Math.min(100 - newY, newWidth / ratio));
        } else {
          newWidth = Math.max(minSize, Math.min(100 - newX, newHeight * ratio));
        }
      }

      return {
        x: Math.max(0, Math.min(100 - newWidth, newX)),
        y: Math.max(0, Math.min(100 - newHeight, newY)),
        width: Math.min(100, Math.max(minSize, newWidth)),
        height: Math.min(100, Math.max(minSize, newHeight)),
      };
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragRef.current.mode) {
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
      dragRef.current.mode = null;
    }
  };

  // Perform canvas-based crop with transformations
  const handleExecuteCrop = useCallback(async () => {
    if (!imageSrc) return;
    setIsProcessing(true);

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageSrc;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const sourceWidth = img.naturalWidth || img.width;
      const sourceHeight = img.naturalHeight || img.height;

      // 1. Create offscreen canvas for transformed source image (rotation + flip)
      const transformCanvas = document.createElement('canvas');
      const isRotated90or270 = rotation % 180 !== 0;

      transformCanvas.width = isRotated90or270 ? sourceHeight : sourceWidth;
      transformCanvas.height = isRotated90or270 ? sourceWidth : sourceHeight;

      const tCtx = transformCanvas.getContext('2d');
      if (!tCtx) throw new Error('Canvas context not available');

      tCtx.save();
      tCtx.translate(transformCanvas.width / 2, transformCanvas.height / 2);
      tCtx.rotate((rotation * Math.PI) / 180);
      if (flipH) tCtx.scale(-1, 1);
      tCtx.drawImage(img, -sourceWidth / 2, -sourceHeight / 2, sourceWidth, sourceHeight);
      tCtx.restore();

      // 2. Compute cropped region relative to transformed canvas
      const cropPixelX = (crop.x / 100) * transformCanvas.width;
      const cropPixelY = (crop.y / 100) * transformCanvas.height;
      const cropPixelW = (crop.width / 100) * transformCanvas.width;
      const cropPixelH = (crop.height / 100) * transformCanvas.height;

      // 3. Final output canvas
      const outputCanvas = document.createElement('canvas');
      // Target realistic resolution (e.g. min 640px for high-clarity CV analysis)
      const maxDim = 1200;
      let finalW = Math.round(cropPixelW);
      let finalH = Math.round(cropPixelH);

      if (finalW > maxDim || finalH > maxDim) {
        const scale = maxDim / Math.max(finalW, finalH);
        finalW = Math.round(finalW * scale);
        finalH = Math.round(finalH * scale);
      }

      outputCanvas.width = Math.max(finalW, 64);
      outputCanvas.height = Math.max(finalH, 64);

      const oCtx = outputCanvas.getContext('2d');
      if (!oCtx) throw new Error('Output canvas context not available');

      oCtx.imageSmoothingEnabled = true;
      oCtx.imageSmoothingQuality = 'high';

      oCtx.drawImage(
        transformCanvas,
        cropPixelX,
        cropPixelY,
        cropPixelW,
        cropPixelH,
        0,
        0,
        outputCanvas.width,
        outputCanvas.height
      );

      const croppedBase64 = outputCanvas.toDataURL('image/jpeg', 0.95);
      onCropComplete(croppedBase64);
      onClose();
    } catch (err) {
      console.error('Cropping execution failed:', err);
      alert('Failed to crop image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [imageSrc, crop, rotation, flipH, onCropComplete, onClose]);

  if (!isOpen || !imageSrc) return null;

  // Estimated pixel crop
  const estimatedWidth = naturalDimensions.width
    ? Math.round((crop.width / 100) * naturalDimensions.width)
    : 0;
  const estimatedHeight = naturalDimensions.height
    ? Math.round((crop.height / 100) * naturalDimensions.height)
    : 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Crop className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-slate-100 flex items-center gap-2">
                  <span>{title}</span>
                  <span className="text-[11px] font-mono font-normal px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    Interactive ROI
                  </span>
                </h3>
                <p className="text-xs text-slate-400 hidden sm:block">
                  Drag the bounding box handles to isolate the garment or textile weave pattern
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Toolbar */}
          <div className="px-4 py-2 border-b border-slate-800/80 bg-slate-950/40 flex flex-wrap items-center justify-between gap-2 text-xs">
            {/* Aspect Presets */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              <span className="text-slate-400 text-[11px] font-medium mr-1 flex items-center gap-1">
                <Maximize2 className="w-3 h-3 text-indigo-400" />
                <span>Aspect:</span>
              </span>
              {(['free', '1:1', '4:5', '3:4', '16:9'] as AspectPreset[]).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => applyAspectPreset(preset)}
                  className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
                    aspectPreset === preset
                      ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white border border-slate-700/60'
                  }`}
                >
                  {preset === 'free' ? 'Freeform' : preset}
                </button>
              ))}
            </div>

            {/* Transformations */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setRotation((r) => (r - 90 + 360) % 360)}
                className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700/60 transition-colors"
                title="Rotate 90° CCW"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700/60 transition-colors"
                title="Rotate 90° CW"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setFlipH((f) => !f)}
                className={`p-1.5 rounded-md border transition-colors ${
                  flipH
                    ? 'bg-indigo-600/30 text-indigo-200 border-indigo-500/40'
                    : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700/60'
                }`}
                title="Flip Horizontal"
              >
                <FlipHorizontal className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setShowGrid((g) => !g)}
                className={`p-1.5 rounded-md border transition-colors ${
                  showGrid
                    ? 'bg-indigo-600/30 text-indigo-200 border-indigo-500/40'
                    : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700/60'
                }`}
                title="Toggle Rule of Thirds Grid"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setCrop({ x: 10, y: 10, width: 80, height: 80 });
                  setRotation(0);
                  setFlipH(false);
                  setZoom(1);
                  setAspectPreset('free');
                }}
                className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-slate-200 border border-slate-700/60 transition-colors"
                title="Reset Crop & Orientation"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Stage / Canvas Viewport */}
          <div className="relative flex-1 bg-slate-950 flex items-center justify-center overflow-hidden p-3 sm:p-6 min-h-[340px] max-h-[58vh]">
            <div
              ref={containerRef}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="relative select-none max-h-[52vh] max-w-full inline-block shadow-2xl"
              style={{ touchAction: 'none' }}
            >
              {/* Underlying Image */}
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Source to crop"
                onLoad={handleImageLoaded}
                className="max-h-[50vh] max-w-full object-contain block pointer-events-none rounded-lg"
                style={{
                  transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scale(${zoom})`,
                  transition: 'transform 0.15s ease',
                }}
              />

              {/* Shaded Dark Overlay with transparent window for the crop region */}
              <div
                className="absolute inset-0 pointer-events-none rounded-lg"
                style={{
                  background: `
                    linear-gradient(to right, rgba(2, 6, 23, 0.72) ${crop.x}%, transparent ${crop.x}%, transparent ${crop.x + crop.width}%, rgba(2, 6, 23, 0.72) ${crop.x + crop.width}%),
                    linear-gradient(to bottom, rgba(2, 6, 23, 0.72) ${crop.y}%, transparent ${crop.y}%, transparent ${crop.y + crop.height}%, rgba(2, 6, 23, 0.72) ${crop.y + crop.height}%)
                  `,
                }}
              />

              {/* Interactive Crop Box Element */}
              <div
                onPointerDown={(e) => handlePointerDown(e, 'move')}
                className="absolute cursor-move border-2 border-indigo-400 shadow-xl transition-shadow"
                style={{
                  left: `${crop.x}%`,
                  top: `${crop.y}%`,
                  width: `${crop.width}%`,
                  height: `${crop.height}%`,
                  boxShadow: '0 0 0 9999px rgba(2, 6, 23, 0.65)',
                }}
              >
                {/* Rule of Thirds Grid Lines */}
                {showGrid && (
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                    <div className="border-r border-b border-indigo-300/30" />
                    <div className="border-r border-b border-indigo-300/30" />
                    <div className="border-b border-indigo-300/30" />
                    <div className="border-r border-b border-indigo-300/30" />
                    <div className="border-r border-b border-indigo-300/30" />
                    <div className="border-b border-indigo-300/30" />
                    <div className="border-r border-indigo-300/30" />
                    <div className="border-r border-indigo-300/30" />
                    <div />
                  </div>
                )}

                {/* Center Move Indicator */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 hover:opacity-90 transition-opacity">
                  <div className="p-1 rounded-full bg-indigo-950/80 border border-indigo-400 text-indigo-300">
                    <Move className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Crop Region Dimensions Tag */}
                <div className="absolute top-1 left-1.5 pointer-events-none text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950/80 text-indigo-200 border border-indigo-500/30 backdrop-blur-xs">
                  {estimatedWidth > 0 && estimatedHeight > 0
                    ? `${estimatedWidth} × ${estimatedHeight} px`
                    : `${Math.round(crop.width)}% × ${Math.round(crop.height)}%`}
                </div>

                {/* Corner Resizing Handles */}
                {/* NW */}
                <div
                  onPointerDown={(e) => handlePointerDown(e, 'nw')}
                  className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-indigo-400 border border-slate-900 rounded-xs cursor-nwse-resize shadow-md hover:scale-125 transition-transform"
                />
                {/* NE */}
                <div
                  onPointerDown={(e) => handlePointerDown(e, 'ne')}
                  className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-indigo-400 border border-slate-900 rounded-xs cursor-nesw-resize shadow-md hover:scale-125 transition-transform"
                />
                {/* SW */}
                <div
                  onPointerDown={(e) => handlePointerDown(e, 'sw')}
                  className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-indigo-400 border border-slate-900 rounded-xs cursor-nesw-resize shadow-md hover:scale-125 transition-transform"
                />
                {/* SE */}
                <div
                  onPointerDown={(e) => handlePointerDown(e, 'se')}
                  className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-indigo-400 border border-slate-900 rounded-xs cursor-nwse-resize shadow-md hover:scale-125 transition-transform"
                />

                {/* Edge Middle Handles */}
                {/* N */}
                <div
                  onPointerDown={(e) => handlePointerDown(e, 'n')}
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-2 bg-indigo-300 rounded-xs cursor-ns-resize"
                />
                {/* S */}
                <div
                  onPointerDown={(e) => handlePointerDown(e, 's')}
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-2 bg-indigo-300 rounded-xs cursor-ns-resize"
                />
                {/* W */}
                <div
                  onPointerDown={(e) => handlePointerDown(e, 'w')}
                  className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-4 bg-indigo-300 rounded-xs cursor-ew-resize"
                />
                {/* E */}
                <div
                  onPointerDown={(e) => handlePointerDown(e, 'e')}
                  className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-4 bg-indigo-300 rounded-xs cursor-ew-resize"
                />
              </div>
            </div>
          </div>

          {/* Footer Controls & Confirmation */}
          <div className="px-5 py-3.5 border-t border-slate-800 bg-slate-950/90 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <ZoomIn className="w-3.5 h-3.5 text-slate-400" />
                <span>Zoom:</span>
                <input
                  type="range"
                  min="1"
                  max="2.5"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-20 accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <span className="font-mono text-[11px] text-indigo-300 w-8">
                  {Math.round(zoom * 100)}%
                </span>
              </div>
              <span className="hidden sm:inline text-slate-700">•</span>
              <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                Target: YOLO Tensor (640×640)
              </span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleExecuteCrop}
                disabled={isProcessing}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl shadow-lg shadow-indigo-950/40 transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Extracting Region...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{actionLabel}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
