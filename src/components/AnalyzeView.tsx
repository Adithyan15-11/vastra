import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload,
  Camera,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Cpu,
  BookOpen,
  Eye,
  EyeOff,
  Sliders,
  Share2,
  FileCheck,
  Zap,
  Tag,
  Shield,
  Palette,
  Droplets,
  Flame,
  Shirt,
  Info,
  ArrowRight,
  BookmarkPlus,
  Check,
  Crop,
  Scissors,
  Database,
  FolderUp,
  FolderCheck
} from 'lucide-react';
import { GarmentAnalysisResult, SampleTestGarment, DatasetFolderState } from '../types';
import { SAMPLE_GARMENTS } from '../data/sampleImages';
import { BoundingBoxOverlay } from './BoundingBoxOverlay';
import { DatasetMatchCard } from './DatasetMatchCard';

interface AnalyzeViewProps {
  currentResult: GarmentAnalysisResult | null;
  isAnalyzing: boolean;
  pipelineStep: string;
  error: string | null;
  onAnalyzeImage: (fileOrBase64: File | string) => void;
  onOpenCropper: (imageSrc: string, title?: string, actionLabel?: string) => void;
  onSelectSample: (sample: SampleTestGarment) => void;
  onOpenCamera: () => void;
  onSaveToHistory: (result: GarmentAnalysisResult) => void;
  isSavedInHistory: boolean;
  onNavigateToTechnical: () => void;
  onNavigateToRecommendations: () => void;
  onNavigateToCareGuide: () => void;
  onReset: () => void;
  datasetState: DatasetFolderState | null;
  onOpenDatasetModal: () => void;
}

export const AnalyzeView: React.FC<AnalyzeViewProps> = ({
  currentResult,
  isAnalyzing,
  pipelineStep,
  error,
  onAnalyzeImage,
  onOpenCropper,
  onSelectSample,
  onOpenCamera,
  onSaveToHistory,
  isSavedInHistory,
  onNavigateToTechnical,
  onNavigateToRecommendations,
  onNavigateToCareGuide,
  onReset,
  datasetState,
  onOpenDatasetModal,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropFileInputRef = useRef<HTMLInputElement>(null);
  const [showBoundingBox, setShowBoundingBox] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState(false);
  const [alwaysCrop, setAlwaysCrop] = useState<boolean>(() => {
    try {
      return localStorage.getItem('vastra_always_crop') === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleAlwaysCrop = (checked: boolean) => {
    setAlwaysCrop(checked);
    try {
      localStorage.setItem('vastra_always_crop', String(checked));
    } catch {}
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, forceCrop: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndProcess(file, forceCrop || alwaysCrop);
    }
    // reset input so same file can be chosen again
    e.target.value = '';
  };

  const validateAndProcess = async (file: File, shouldCrop: boolean) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp', 'image/tiff'];
    if (!validTypes.includes(file.type)) {
      alert('Unsupported file format. Please upload a JPEG, PNG, or WebP clothing image.');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      alert('Image file is too large (max 20MB). Please choose a smaller photo.');
      return;
    }

    if (shouldCrop) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onOpenCropper(reader.result, 'Crop & Focus Textile Region', 'Run VASTRA Pipeline on Crop');
        }
      };
      reader.readAsDataURL(file);
    } else {
      onAnalyzeImage(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcess(e.dataTransfer.files[0], alwaysCrop);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const triggerCropUpload = () => {
    cropFileInputRef.current?.click();
  };

  const handleSaveClick = () => {
    if (currentResult) {
      onSaveToHistory(currentResult);
      setSaveFeedback(true);
      setTimeout(() => setSaveFeedback(false), 2200);
    }
  };

  return (
    <div className="space-y-10">
      {/* Hidden File Input (Direct) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => handleFileChange(e, false)}
        className="hidden"
      />

      {/* Hidden File Input (Crop First) */}
      <input
        ref={cropFileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => handleFileChange(e, true)}
        className="hidden"
      />

      {/* Hero Header */}
      <section className="text-center max-w-3xl mx-auto pt-2 pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono mb-4 tracking-wide">
          <Zap className="w-3.5 h-3.5 text-indigo-400" />
          <span>B.Tech CSE Project • 5th Semester Computer Vision</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-100 font-sans sm:leading-tight">
          VASTRA — <span className="bg-linear-to-r from-indigo-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">Smart Clothing Analysis</span>
        </h1>
        <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
          Vision-Assisted Smart Textile Recognition and Analysis. Instant neural classification of garment type,
          material composition, weave pattern, structural condition, and curated fabric care directives.
        </p>
      </section>

      {/* Error Alert if Any */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start gap-3 max-w-4xl mx-auto"
        >
          <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-rose-200">Pipeline Notice</h4>
            <p className="mt-0.5 text-rose-300/90">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Primary Input Mode Cards: 3-Column Grid with Dedicated Cropping Option */}
      <section className="max-w-4xl mx-auto space-y-3.5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {/* Card 1: Upload Clothing Image */}
          <div
            onClick={triggerFileUpload}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`group relative p-5 sm:p-6 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col items-center text-center justify-between min-h-[210px] ${
              dragActive
                ? 'border-indigo-400 bg-indigo-500/15 shadow-xl shadow-indigo-950'
                : 'border-slate-800 hover:border-indigo-500/50 bg-slate-900/60 hover:bg-slate-900/90 hover:shadow-xl hover:shadow-indigo-950/20'
            }`}
          >
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3.5 group-hover:scale-105 group-hover:bg-indigo-500/20 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
                Upload & Auto-Analyze
              </h3>
              <p className="mt-1.5 text-xs text-slate-400 max-w-xs leading-normal">
                Drop full photo here, or browse local files (JPG, PNG, WebP up to 20MB)
              </p>
            </div>
            <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-indigo-400 group-hover:text-indigo-300">
              <span>Instant Scan</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>

          {/* Card 2: Crop & Focus Garment / Textile Swatch */}
          <div
            onClick={triggerCropUpload}
            className="group relative p-5 sm:p-6 rounded-2xl border border-slate-800 hover:border-emerald-500/50 bg-slate-900/60 hover:bg-slate-900/90 hover:shadow-xl hover:shadow-emerald-950/20 transition-all duration-200 cursor-pointer flex flex-col items-center text-center justify-between min-h-[210px]"
          >
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3.5 group-hover:scale-105 group-hover:bg-emerald-500/20 transition-transform">
                <Crop className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-semibold text-slate-100 group-hover:text-emerald-300 transition-colors">
                  Crop & Focus Region
                </h3>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-medium">
                  ROI
                </span>
              </div>
              <p className="mt-1.5 text-xs text-slate-400 max-w-xs leading-normal">
                Isolate specific garments, necklines, sleeves, or fabric weave patches before recognition
              </p>
            </div>
            <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 group-hover:text-emerald-300">
              <span>Open Cropping Tool</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>

          {/* Card 3: Use Live Camera */}
          <div
            onClick={onOpenCamera}
            className="group relative p-5 sm:p-6 rounded-2xl border border-slate-800 hover:border-violet-500/50 bg-slate-900/60 hover:bg-slate-900/90 hover:shadow-xl hover:shadow-violet-950/20 transition-all duration-200 cursor-pointer flex flex-col items-center text-center justify-between min-h-[210px]"
          >
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mb-3.5 group-hover:scale-105 group-hover:bg-violet-500/20 transition-transform">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-100 group-hover:text-violet-300 transition-colors">
                Use Live Camera
              </h3>
              <p className="mt-1.5 text-xs text-slate-400 max-w-xs leading-normal">
                Capture real-time snapshots with instant Direct Analyze or Crop options
              </p>
            </div>
            <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-violet-400 group-hover:text-violet-300">
              <span>Launch Camera HUD</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>

        {/* Cropping Options & Settings Bar */}
        <div className="px-4 py-2.5 rounded-xl bg-slate-900/50 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <label className="flex items-center gap-2.5 cursor-pointer select-none text-slate-300 hover:text-white transition-colors">
            <input
              type="checkbox"
              checked={alwaysCrop}
              onChange={(e) => handleToggleAlwaysCrop(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-950"
            />
            <span className="font-medium text-slate-200 flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5 text-indigo-400" />
              Always launch cropper before analyzing uploaded images
            </span>
          </label>

          <span className="text-[11px] text-slate-400 font-mono">
            Aspect Presets: Free • 1:1 Weave • 4:5 Portrait • 3:4 Fashion
          </span>
        </div>

        {/* Ground-Truth Data Folder Grounding Banner */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
            datasetState && datasetState.isGroundingEnabled
              ? 'bg-linear-to-r from-emerald-950/30 via-slate-900 to-indigo-950/30 border-emerald-500/40 shadow-lg shadow-emerald-950/15'
              : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  datasetState && datasetState.isGroundingEnabled
                    ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                    : 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400'
                }`}
              >
                {datasetState && datasetState.isGroundingEnabled ? (
                  <FolderCheck className="w-5 h-5" />
                ) : (
                  <Database className="w-5 h-5" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-slate-100">
                    {datasetState ? (
                      <span>
                        Data Folder: <span className="font-mono text-emerald-300">/{datasetState.folderName}/</span>
                      </span>
                    ) : (
                      'Upload Data Folder for Enhanced Accuracy'
                    )}
                  </h4>
                  {datasetState?.isGroundingEnabled ? (
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      GROUNDING ACTIVE
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                      ACCURACY BOOST AVAILABLE
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5 max-w-xl leading-relaxed">
                  {datasetState && datasetState.isGroundingEnabled
                    ? `Grounding active with ${datasetState.imageCount} reference garment images (${datasetState.categoriesDetected.join(', ')}) for verified classification and material matching.`
                    : 'Upload your training or reference data folder with clothing photos and fabric swatches to ground neural predictions and eliminate misclassifications.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenDatasetModal}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                  datasetState && datasetState.isGroundingEnabled
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-950'
                }`}
              >
                <FolderUp className="w-3.5 h-3.5" />
                <span>{datasetState ? 'Manage Data Folder' : 'Upload Data Folder'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Loading Skeleton Loader */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-4xl mx-auto p-6 sm:p-8 rounded-2xl border border-indigo-500/30 bg-slate-900/80 shadow-2xl backdrop-blur-md"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20 animate-ping" />
                <div className="w-14 h-14 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-indigo-400" />
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-slate-100">
                  Running VASTRA CV pipeline...
                </h3>
                <p className="text-xs text-indigo-300 font-mono mt-1">
                  {pipelineStep || 'Extracting features and classifying textile attributes'}
                </p>
              </div>

              {/* Progress Stepper */}
              <div className="w-full max-w-md pt-2">
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-linear-to-r from-indigo-500 via-violet-500 to-indigo-400 rounded-full animate-pulse w-3/4" />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-2 px-1">
                  <span>1. Preprocessing</span>
                  <span>2. YOLO BBox</span>
                  <span>3. Texture Mapping</span>
                  <span>4. Attribute Synthesis</span>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Dedicated Offline Demo Mode Section */}
      <section className="max-w-4xl mx-auto pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-2 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-slate-200">Offline Demo Mode</h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                Instant Zero-Latency
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Pre-loaded test benchmarks for viva examiners and demonstration without internet dependency.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">4 Sample Benchmarks</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {SAMPLE_GARMENTS.map((sample) => (
            <div
              key={sample.id}
              onClick={() => onSelectSample(sample)}
              className="group relative bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-950/40"
            >
              <div className="aspect-square relative overflow-hidden bg-slate-950">
                <img
                  src={sample.thumbnailUrl}
                  alt={sample.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <span className="absolute top-2 left-2 text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-slate-900/90 text-indigo-300 border border-slate-700/60 backdrop-blur-xs uppercase">
                  {sample.category}
                </span>
                <span className="absolute bottom-2 right-2 text-[10px] font-mono text-emerald-400 bg-slate-950/80 px-1.5 py-0.5 rounded">
                  {Math.round(sample.result.confidenceScore * 100)}% Conf
                </span>
              </div>
              <div className="p-3">
                <h4 className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 truncate">
                  {sample.name}
                </h4>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  {sample.result.estimatedMaterial}
                </p>
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-indigo-400 font-medium">
                  <span>Load Sample</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenCropper(
                          sample.thumbnailUrl,
                          `Crop Benchmark: ${sample.name}`,
                          'Run Pipeline on Crop'
                        );
                      }}
                      className="p-1 rounded-md bg-slate-800/80 hover:bg-indigo-600/30 text-indigo-300 hover:text-indigo-200 border border-slate-700/60 transition-colors"
                      title="Test interactive cropper on this benchmark garment"
                    >
                      <Crop className="w-3 h-3" />
                    </button>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Instant Result Card Layout */}
      {currentResult && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-2xl"
        >
          {/* Card Top Action Bar */}
          <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-base font-semibold text-slate-100">
                VASTRA Analysis Result
              </h2>
              <span className="text-xs font-mono text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-md border border-slate-700/50">
                {currentResult.inferenceStats.latencyMs}ms inference
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  onOpenCropper(
                    currentResult.imageUrl,
                    `Re-crop: ${currentResult.garmentType}`,
                    'Re-analyze Cropped Region'
                  )
                }
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 transition-colors"
                title="Crop specific garment section or weave pattern and re-analyze"
              >
                <Crop className="w-3.5 h-3.5 text-indigo-400" />
                <span>Crop & Re-analyze</span>
              </button>

              <button
                type="button"
                onClick={() => setShowBoundingBox(!showBoundingBox)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border transition-colors ${
                  showBoundingBox
                    ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                {showBoundingBox ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>YOLO Box {showBoundingBox ? 'ON' : 'OFF'}</span>
              </button>

              <button
                type="button"
                onClick={handleSaveClick}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-xl border transition-all ${
                  isSavedInHistory || saveFeedback
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                }`}
              >
                {isSavedInHistory || saveFeedback ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Saved</span>
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Save to History</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onReset}
                className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl transition-colors"
                title="Scan another garment"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Result Card Main Body */}
          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            {/* Left Column: Image Preview with Bounding Box Overlay */}
            <div className="lg:col-span-5 flex flex-col space-y-4">
              <div className="relative aspect-4/5 w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner">
                <img
                  src={currentResult.imageUrl}
                  alt={currentResult.garmentType}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />

                {/* Floating Crop Button on Image */}
                <button
                  type="button"
                  onClick={() =>
                    onOpenCropper(
                      currentResult.imageUrl,
                      `Crop: ${currentResult.garmentType}`,
                      'Analyze Selected Region'
                    )
                  }
                  className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-950/85 hover:bg-indigo-600 text-indigo-200 hover:text-white border border-indigo-500/30 hover:border-indigo-400 shadow-lg backdrop-blur-xs transition-all"
                  title="Crop this garment image"
                >
                  <Crop className="w-3.5 h-3.5" />
                  <span>Crop</span>
                </button>

                <BoundingBoxOverlay
                  boundingBox={currentResult.boundingBox}
                  showBox={showBoundingBox}
                  colorHex={currentResult.color.hex}
                  garmentType={currentResult.garmentType}
                  confidence={currentResult.confidenceScore}
                />

                {/* Bottom Bar on Image */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950/80 text-slate-300 border border-slate-800 backdrop-blur-xs">
                    Input: {currentResult.inferenceStats.inputResolution}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950/80 text-emerald-400 border border-slate-800 backdrop-blur-xs font-semibold">
                    Score: {Math.round(currentResult.confidenceScore * 100)}%
                  </span>
                </div>
              </div>

              {/* Texture Attributes Card */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-semibold text-slate-300 pb-1 border-b border-slate-800/80">
                  <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Textile Microstructure Analysis</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Weave Architecture</span>
                    <span className="font-medium text-slate-200">{currentResult.textureFeatures.weaveType}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Estimated Weight</span>
                    <span className="font-medium text-slate-200">{currentResult.textureFeatures.density}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Optical Sheen</span>
                    <span className="font-medium text-slate-200">{currentResult.textureFeatures.sheen}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Fiber Elasticity</span>
                    <span className="font-medium text-slate-200">{currentResult.textureFeatures.stretchFactor}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Clear Fields Display */}
            <div className="lg:col-span-7 space-y-6">
              {/* Primary Garment Header */}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold">
                    Category: {currentResult.category}
                  </span>
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                    Confidence: {(currentResult.confidenceScore * 100).toFixed(1)}%
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-100 mt-2 font-sans tracking-tight">
                  {currentResult.garmentType}
                </h3>
              </div>

              {/* Data Folder Match & Ground-Truth Verification Card */}
              {currentResult.datasetMatch && (
                <DatasetMatchCard
                  match={currentResult.datasetMatch}
                  datasetFolderName={datasetState?.folderName}
                  onOpenDatasetModal={onOpenDatasetModal}
                />
              )}

              {/* Grid of Key Detected Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Field: Colour */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
                    <Palette className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Detected Colour</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-lg border border-white/20 shadow-xs shrink-0"
                      style={{ backgroundColor: currentResult.color.hex }}
                    />
                    <div>
                      <div className="text-sm font-semibold text-slate-100">
                        {currentResult.color.name}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        {currentResult.color.hex} • {currentResult.color.paletteType}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Field: Pattern */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
                    <Layers className="w-3.5 h-3.5 text-violet-400" />
                    <span>Textile Pattern</span>
                  </div>
                  <div className="text-sm font-semibold text-slate-100">
                    {currentResult.pattern}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Oriented frequency gradient
                  </div>
                </div>

                {/* Field: Estimated Material */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
                    <Shirt className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Estimated Material</span>
                  </div>
                  <div className="text-sm font-semibold text-slate-100">
                    {currentResult.estimatedMaterial}
                  </div>
                  <div className="text-[11px] text-emerald-400 mt-0.5 font-medium">
                    Primary: {currentResult.materialCategory}
                  </div>
                </div>

                {/* Field: Brand Status */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
                    <Tag className="w-3.5 h-3.5 text-amber-400" />
                    <span>Brand Status</span>
                  </div>
                  <div className="text-sm font-semibold text-slate-100">
                    {currentResult.brandStatus}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Logo / Hardware inspection
                  </div>
                </div>
              </div>

              {/* Field: Condition Status */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Shield className="w-3.5 h-3.5 text-blue-400" />
                    <span>Condition Status</span>
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-200">
                    {currentResult.conditionScore}/100 Integrity
                  </span>
                </div>
                <div className="text-sm font-semibold text-slate-100 mb-2">
                  {currentResult.conditionStatus}
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-emerald-500 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${currentResult.conditionScore}%` }}
                  />
                </div>
              </div>

              {/* Care Guide Summary Section */}
              <div className="p-5 rounded-xl bg-indigo-950/20 border border-indigo-500/20 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-indigo-500/20">
                  <div className="flex items-center gap-2 text-sm font-semibold text-indigo-300">
                    <BookOpen className="w-4 h-4 text-indigo-400" />
                    <span>Care Guide Summary ({currentResult.materialCategory})</span>
                  </div>
                  <button
                    onClick={onNavigateToCareGuide}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                  >
                    <span>Full Guide</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Washing</span>
                    <span className="font-medium text-slate-200 truncate block">{currentResult.careGuide.washTemp}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Drying</span>
                    <span className="font-medium text-slate-200 truncate block">{currentResult.careGuide.drying}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Ironing</span>
                    <span className="font-medium text-slate-200 truncate block">{currentResult.careGuide.ironing}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300/90 leading-relaxed pt-1">
                  {currentResult.careGuide.washing}
                </p>
              </div>

              {/* Low-confidence Warning if applicable */}
              {currentResult.confidenceScore < 0.85 && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>
                    Confidence score is under 85%. For higher accuracy, ensure adequate lighting, minimal background clutter, and clear garment focus.
                  </span>
                </div>
              )}

              {/* Quick Jump Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onNavigateToRecommendations}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md shadow-indigo-950 transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Outfit Pairings for this {currentResult.garmentType}</span>
                </button>

                <button
                  type="button"
                  onClick={onNavigateToTechnical}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl transition-colors"
                >
                  <Cpu className="w-4 h-4 text-violet-400" />
                  <span>View Technical CV Logs & Viva Metrics</span>
                </button>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* Empty Upload State Note when no item analyzed */}
      {!currentResult && !isAnalyzing && (
        <section className="max-w-4xl mx-auto text-center py-6 border-t border-slate-800/60">
          <div className="inline-flex items-center gap-2 text-xs text-slate-400 font-mono">
            <Info className="w-4 h-4 text-indigo-400" />
            <span>Ready for image input. Select one of the 4 benchmark presets above or upload any garment photo.</span>
          </div>
        </section>
      )}
    </div>
  );
};
