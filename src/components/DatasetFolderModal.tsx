import React, { useState, useRef } from 'react';
import {
  FolderUp,
  FolderCheck,
  Database,
  X,
  Search,
  CheckCircle2,
  Trash2,
  Sparkles,
  Download,
  Layers,
  ArrowRight,
  Upload,
  AlertCircle,
  FileCode,
  Eye,
  SlidersHorizontal,
  Check
} from 'lucide-react';
import { DatasetFolderState, DatasetReferenceItem } from '../types';
import {
  processDatasetFiles,
  getFilesFromDataTransfer,
  getDefaultBenchmarkDataset,
} from '../utils/datasetManager';

interface DatasetFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  datasetState: DatasetFolderState | null;
  onUpdateDataset: (dataset: DatasetFolderState | null) => void;
  onAnalyzeSample: (imageUrl: string) => void;
}

export const DatasetFolderModal: React.FC<DatasetFolderModalProps> = ({
  isOpen,
  onClose,
  datasetState,
  onUpdateDataset,
  onAnalyzeSample,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [processingStatus, setProcessingStatus] = useState<string>('');

  const directoryInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDirectoryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    setProcessingStatus(`Parsing folder contents (${files.length} items)...`);
    try {
      const fileArr = Array.from(files);
      const dataset = await processDatasetFiles(fileArr);
      onUpdateDataset(dataset);
    } catch (err) {
      console.error('Failed to parse folder:', err);
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
      if (directoryInputRef.current) directoryInputRef.current.value = '';
    }
  };

  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    setProcessingStatus(`Indexing ${files.length} image files...`);
    try {
      const fileArr = Array.from(files);
      const dataset = await processDatasetFiles(fileArr, 'custom_images');
      onUpdateDataset(dataset);
    } catch (err) {
      console.error('Failed to parse files:', err);
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (!e.dataTransfer.items && !e.dataTransfer.files) return;

    setIsProcessing(true);
    setProcessingStatus('Traversing dropped folder hierarchy...');
    try {
      let files: File[] = [];
      if (e.dataTransfer.items) {
        files = await getFilesFromDataTransfer(e.dataTransfer.items);
      } else if (e.dataTransfer.files) {
        files = Array.from(e.dataTransfer.files);
      }

      if (files.length > 0) {
        setProcessingStatus(`Extracting features and categories from ${files.length} items...`);
        const dataset = await processDatasetFiles(files);
        onUpdateDataset(dataset);
      }
    } catch (err) {
      console.error('Failed reading dropped folder:', err);
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  const handleLoadBenchmark = () => {
    const benchmark = getDefaultBenchmarkDataset();
    onUpdateDataset(benchmark);
  };

  const handleToggleGrounding = (enabled: boolean) => {
    if (!datasetState) return;
    onUpdateDataset({
      ...datasetState,
      isGroundingEnabled: enabled,
    });
  };

  const handleClearDataset = () => {
    onUpdateDataset(null);
  };

  const handleExportJson = () => {
    if (!datasetState) return;
    const exportData = {
      folderName: datasetState.folderName,
      totalFiles: datasetState.totalFiles,
      imageCount: datasetState.imageCount,
      categories: datasetState.categoriesDetected,
      materials: datasetState.materialsDetected,
      metadata: datasetState.metadataJson,
      samples: datasetState.referenceItems.map((item) => ({
        fileName: item.fileName,
        filePath: item.filePath,
        category: item.inferredCategory,
        material: item.inferredMaterial,
      })),
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${datasetState.folderName}_vastra_index.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filter items
  const filteredItems = (datasetState?.referenceItems || []).filter((item) => {
    const matchesSearch =
      searchQuery === '' ||
      item.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.filePath.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.inferredMaterial && item.inferredMaterial.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategoryFilter === 'all' || item.inferredCategory === selectedCategoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl shadow-indigo-950/50 overflow-hidden text-slate-100">
        {/* Hidden Directory File Input */}
        <input
          ref={directoryInputRef}
          type="file"
          // @ts-expect-error webkitdirectory is standard for folder picker in modern browsers
          webkitdirectory=""
          directory=""
          multiple
          onChange={handleDirectoryChange}
          className="hidden"
        />

        {/* Hidden Multi-File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.json,.csv"
          onChange={handleFilesChange}
          className="hidden"
        />

        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-white">Custom Reference Data Folder</h2>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                  Enhanced Accuracy
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Ground the VASTRA Computer Vision pipeline with your proprietary garment dataset folder
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Upload Dropzone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-200 cursor-pointer ${
              isDragging
                ? 'border-indigo-400 bg-indigo-500/15'
                : 'border-slate-700/80 hover:border-indigo-500/50 bg-slate-950/40 hover:bg-slate-950/70'
            }`}
            onClick={() => directoryInputRef.current?.click()}
          >
            <div className="max-w-md mx-auto flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
                <FolderUp className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-100">
                Drop your Dataset Folder here, or click to browse
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Select an entire folder containing garment photos, textile swatches, or subdirectories (e.g.{' '}
                <code className="text-indigo-300 font-mono">data/cotton/</code>,{' '}
                <code className="text-indigo-300 font-mono">data/denim/</code>) with optional{' '}
                <code className="text-indigo-300 font-mono">dataset.json</code>.
              </p>

              {/* Action Buttons inside Dropzone */}
              <div
                className="mt-4 flex flex-wrap items-center justify-center gap-2.5"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => directoryInputRef.current?.click()}
                  className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 shadow-md shadow-indigo-950 transition-all"
                >
                  <FolderUp className="w-3.5 h-3.5" />
                  <span>Choose Folder (Directory)</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-400" />
                  <span>Select Individual Files</span>
                </button>

                <button
                  type="button"
                  onClick={handleLoadBenchmark}
                  className="px-3.5 py-2 text-xs font-medium rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Load Benchmark Dataset</span>
                </button>
              </div>
            </div>

            {isProcessing && (
              <div className="mt-4 p-3 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 text-xs flex items-center justify-center gap-2 animate-pulse">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                <span>{processingStatus || 'Processing files...'}</span>
              </div>
            )}
          </div>

          {/* Dataset Status Banner / Configuration */}
          {datasetState ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <FolderCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white font-mono text-sm">
                        📁 /{datasetState.folderName}/
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.2 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                        {datasetState.imageCount} images indexed
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Uploaded {new Date(datasetState.lastUploadedAt).toLocaleTimeString()} •{' '}
                      {datasetState.totalFiles} total files processed
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleExportJson}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 text-xs flex items-center gap-1.5 transition-colors"
                    title="Export parsed dataset manifest as JSON"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Export JSON</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClearDataset}
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs flex items-center gap-1.5 transition-colors"
                    title="Remove custom dataset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Clear</span>
                  </button>
                </div>
              </div>

              {/* Toggle Switch for Enhanced Grounding */}
              <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                      <span>Ground Recognition with this Data Folder</span>
                      {datasetState.isGroundingEnabled ? (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                          ACTIVE (ENHANCED ACCURACY)
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          DISABLED
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Cross-references incoming clothing images with your uploaded prototypes to achieve maximum classification precision
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={datasetState.isGroundingEnabled}
                    onChange={(e) => handleToggleGrounding(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              {/* Detected Classes & Materials Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80">
                  <span className="text-slate-400 text-[11px] font-medium block mb-1.5">
                    Detected Apparel Categories ({datasetState.categoriesDetected.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {datasetState.categoriesDetected.map((cat) => (
                      <span
                        key={cat}
                        className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[11px] font-mono uppercase"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80">
                  <span className="text-slate-400 text-[11px] font-medium block mb-1.5">
                    Detected Fabric & Textile Types ({datasetState.materialsDetected.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {datasetState.materialsDetected.map((mat) => (
                      <span
                        key={mat}
                        className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[11px] font-mono"
                      >
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {datasetState.metadataJson && (
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-slate-300">
                    Loaded annotation metadata: {datasetState.metadataJson.dataset_name || 'Manifest File'} (
                    {datasetState.metadataJson.num_classes ? `${datasetState.metadataJson.num_classes} classes` : 'Structured tags'}
                    )
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-indigo-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-indigo-200">No Custom Data Folder Loaded</span>
                <span>
                  VASTRA is currently operating in generalized open-domain mode. Upload your data folder above or click{' '}
                  <button
                    onClick={handleLoadBenchmark}
                    className="underline hover:text-white font-medium"
                  >
                    Load Benchmark Dataset
                  </button>{' '}
                  to experience ground-truth few-shot classification and verified material matching!
                </span>
              </div>
            </div>
          )}

          {/* Reference Items Search and Gallery */}
          {datasetState && datasetState.referenceItems.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-200">
                    Indexed Reference Garments ({filteredItems.length})
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Click any sample to test pipeline with custom grounding
                  </span>
                </div>

                {/* Search & Category Filter */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Filter by file, fabric..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-44"
                    />
                  </div>

                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="px-2.5 py-1 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-indigo-500 font-mono"
                  >
                    <option value="all">All Categories</option>
                    <option value="top">Tops</option>
                    <option value="bottom">Bottoms</option>
                    <option value="outerwear">Outerwear</option>
                    <option value="one-piece">One-Piece</option>
                    <option value="accessory">Accessories</option>
                  </select>
                </div>
              </div>

              {/* Grid of Samples */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-80 overflow-y-auto pr-1">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onAnalyzeSample(item.previewUrl);
                      onClose();
                    }}
                    className="group relative rounded-xl border border-slate-800 hover:border-indigo-500 bg-slate-950/60 hover:bg-slate-950 p-2.5 cursor-pointer transition-all flex flex-col justify-between"
                  >
                    <div className="aspect-square w-full rounded-lg overflow-hidden bg-slate-900 relative mb-2">
                      <img
                        src={item.previewUrl}
                        alt={item.fileName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-indigo-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-[10px] font-medium px-2 py-1 rounded bg-indigo-600 text-white shadow">
                          Analyze
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-mono text-indigo-400 uppercase font-semibold">
                          {item.inferredCategory || 'sample'}
                        </span>
                        <span className="text-slate-500 text-[9px] truncate max-w-[80px]">
                          {item.subfolder}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-200 truncate" title={item.fileName}>
                        {item.customLabel || item.fileName}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {item.inferredMaterial}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>
              {datasetState && datasetState.isGroundingEnabled
                ? `Dataset Grounding Active (${datasetState.imageCount} references loaded)`
                : 'Upload data folder to enable ground-truth domain transfer'}
            </span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
