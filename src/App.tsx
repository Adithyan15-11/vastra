import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { AnalyzeView } from './components/AnalyzeView';
import { TechnicalView } from './components/TechnicalView';
import { HistoryView } from './components/HistoryView';
import { CareGuideView } from './components/CareGuideView';
import { RecommendationsView } from './components/RecommendationsView';
import { AboutView } from './components/AboutView';
import { CameraModal } from './components/CameraModal';
import { ImageCropperModal } from './components/ImageCropperModal';
import { DatasetFolderModal } from './components/DatasetFolderModal';
import { GarmentAnalysisResult, HistoryItem, SampleTestGarment, DatasetFolderState } from './types';
import { SAMPLE_GARMENTS } from './data/sampleImages';
import { getDefaultBenchmarkDataset } from './utils/datasetManager';

const HISTORY_STORAGE_KEY = 'vastra_clothing_analysis_history';
const DATASET_STORAGE_KEY = 'vastra_dataset_state_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('analyze');
  const [currentResult, setCurrentResult] = useState<GarmentAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pipelineStep, setPipelineStep] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // Dataset State & Ground-Truth Modal
  const [datasetState, setDatasetState] = useState<DatasetFolderState | null>(() => {
    try {
      const stored = localStorage.getItem(DATASET_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed loading dataset from storage', e);
    }
    return getDefaultBenchmarkDataset();
  });
  const [isDatasetModalOpen, setIsDatasetModalOpen] = useState(false);

  // Sync dataset to localStorage
  useEffect(() => {
    try {
      if (!datasetState) {
        localStorage.removeItem(DATASET_STORAGE_KEY);
      } else {
        const serializable = {
          ...datasetState,
          referenceItems: datasetState.referenceItems.slice(0, 30).map((item) => ({
            ...item,
            previewUrl: item.previewUrl.startsWith('blob:') ? '' : item.previewUrl,
          })),
        };
        localStorage.setItem(DATASET_STORAGE_KEY, JSON.stringify(serializable));
      }
    } catch (e) {
      console.warn('Failed persisting dataset to localStorage', e);
    }
  }, [datasetState]);

  // Cropping Modal State
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [cropperImageSrc, setCropperImageSrc] = useState<string | null>(null);
  const [cropperTitle, setCropperTitle] = useState('Crop & Focus Textile Region');
  const [cropperActionLabel, setCropperActionLabel] = useState('Apply & Run VASTRA Pipeline');

  const handleOpenCropper = (imageSrc: string, title?: string, actionLabel?: string) => {
    setCropperImageSrc(imageSrc);
    if (title) setCropperTitle(title);
    if (actionLabel) setCropperActionLabel(actionLabel);
    setIsCropperOpen(true);
  };
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Keep localStorage in sync with history state
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.warn('Failed to persist history to localStorage', e);
    }
  }, [history]);

  // Convert File or base64 to data URL and call backend /api/analyze
  const handleAnalyzeImage = async (fileOrBase64: File | string) => {
    setIsAnalyzing(true);
    setError(null);
    setPipelineStep('Initiating neural preprocessing & letterboxing (640×640)...');

    try {
      let base64Data = '';
      let mimeType = 'image/jpeg';

      if (typeof fileOrBase64 === 'string') {
        base64Data = fileOrBase64;
        if (fileOrBase64.startsWith('data:image/png')) {
          mimeType = 'image/png';
        } else if (fileOrBase64.startsWith('data:image/webp')) {
          mimeType = 'image/webp';
        }
      } else {
        mimeType = fileOrBase64.type || 'image/jpeg';
        base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(fileOrBase64);
        });
      }

      // Progressively update pipeline step indicator for realistic user feedback
      setTimeout(() => {
        setPipelineStep('Running CLAHE contrast adjustment & CIE-Lab color separation...');
      }, 400);

      setTimeout(() => {
        setPipelineStep('Extracting features via CSPDarknet53 & PANet feature pyramid...');
      }, 900);

      // Build dataset context if active
      const datasetContext =
        datasetState && datasetState.isGroundingEnabled
          ? {
              enabled: true,
              folderName: datasetState.folderName,
              sampleCount: datasetState.imageCount,
              categories: datasetState.categoriesDetected,
              materials: datasetState.materialsDetected,
              referenceNames: datasetState.referenceItems.map((i) => i.customLabel || i.fileName),
            }
          : undefined;

      if (datasetContext) {
        setTimeout(() => {
          setPipelineStep(
            `Cross-referencing feature maps against /${datasetState?.folderName}/ (${datasetState?.imageCount} reference specimens)...`
          );
        }, 1300);
      }

      setTimeout(() => {
        setPipelineStep('Synthesizing textile material composition & fabric care guidelines...');
      }, 1800);

      // Call Express API endpoint
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: base64Data,
          imageData: base64Data,
          mimeType,
          datasetContext,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const result: GarmentAnalysisResult = await response.json();
      setCurrentResult(result);
      setActiveTab('analyze');
    } catch (err: any) {
      console.error('Analysis failed:', err);
      setError(
        err.message ||
          'VASTRA pipeline encountered an error analyzing this image. You can test with our Offline Demo samples.'
      );
    } finally {
      setIsAnalyzing(false);
      setPipelineStep('');
    }
  };

  const handleSelectSample = (sample: SampleTestGarment) => {
    setError(null);
    setCurrentResult(sample.result);
    setActiveTab('analyze');
  };

  const handleSaveToHistory = (result: GarmentAnalysisResult) => {
    const existingIndex = history.findIndex((item) => item.id === result.id);
    if (existingIndex >= 0) return;

    const newItem: HistoryItem = {
      id: result.id,
      timestamp: result.timestamp,
      garmentType: result.garmentType,
      category: result.category,
      colorName: result.color.name,
      colorHex: result.color.hex,
      material: result.estimatedMaterial,
      pattern: result.pattern,
      condition: result.conditionStatus,
      confidence: result.confidenceScore,
      imageUrl: result.imageUrl,
      analysis: result,
    };

    setHistory((prev) => [newItem, ...prev]);
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAllHistory = () => {
    setHistory([]);
  };

  const handleInspectHistoryResult = (result: GarmentAnalysisResult) => {
    setCurrentResult(result);
    setActiveTab('analyze');
  };

  const handleResetAnalysis = () => {
    setCurrentResult(null);
    setError(null);
  };

  const isCurrentSaved =
    currentResult !== null && history.some((item) => item.id === currentResult.id);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Application Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        historyCount={history.length}
        datasetItemCount={datasetState?.imageCount || 0}
        datasetFolderName={datasetState?.folderName}
        isDatasetGroundingActive={!!datasetState?.isGroundingEnabled}
        onOpenDatasetModal={() => setIsDatasetModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'analyze' && (
          <AnalyzeView
            currentResult={currentResult}
            isAnalyzing={isAnalyzing}
            pipelineStep={pipelineStep}
            error={error}
            onAnalyzeImage={handleAnalyzeImage}
            onOpenCropper={handleOpenCropper}
            onSelectSample={handleSelectSample}
            onOpenCamera={() => setIsCameraOpen(true)}
            onSaveToHistory={handleSaveToHistory}
            isSavedInHistory={isCurrentSaved}
            onNavigateToTechnical={() => setActiveTab('technical')}
            onNavigateToRecommendations={() => setActiveTab('recommendations')}
            onNavigateToCareGuide={() => setActiveTab('care')}
            onReset={handleResetAnalysis}
            datasetState={datasetState}
            onOpenDatasetModal={() => setIsDatasetModalOpen(true)}
          />
        )}

        {activeTab === 'technical' && (
          <TechnicalView currentResult={currentResult} />
        )}

        {activeTab === 'history' && (
          <HistoryView
            history={history}
            onSelectHistoryItem={handleInspectHistoryResult}
            onDeleteItem={handleDeleteHistoryItem}
            onClearAll={handleClearAllHistory}
            onNavigateToAnalyze={() => setActiveTab('analyze')}
          />
        )}

        {activeTab === 'care' && (
          <CareGuideView initialMaterial={currentResult?.materialCategory} />
        )}

        {activeTab === 'recommendations' && (
          <RecommendationsView
            currentResult={currentResult}
            onSelectSample={(result) => {
              setCurrentResult(result);
            }}
          />
        )}

        {activeTab === 'about' && <AboutView />}
      </main>

      {/* Live Camera Viewfinder Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(base64Data, shouldCrop) => {
          if (shouldCrop) {
            handleOpenCropper(base64Data, 'Crop Camera Snapshot', 'Analyze Cropped Snapshot');
          } else {
            handleAnalyzeImage(base64Data);
          }
        }}
      />

      {/* Interactive Garment & Weave Cropping Modal */}
      <ImageCropperModal
        isOpen={isCropperOpen}
        imageSrc={cropperImageSrc}
        title={cropperTitle}
        actionLabel={cropperActionLabel}
        onClose={() => setIsCropperOpen(false)}
        onCropComplete={(croppedBase64) => {
          handleAnalyzeImage(croppedBase64);
        }}
      />

      {/* Ground-Truth Custom Dataset Folder Management Modal */}
      <DatasetFolderModal
        isOpen={isDatasetModalOpen}
        onClose={() => setIsDatasetModalOpen(false)}
        datasetState={datasetState}
        onUpdateDataset={setDatasetState}
        onAnalyzeSample={(imageUrl) => {
          handleAnalyzeImage(imageUrl);
        }}
      />

      {/* Footer with Academic Presentation Sign-off */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">VASTRA</span>
            <span>•</span>
            <span>PBCMT504 Computer Vision B.Tech 5th Sem</span>
          </div>

          <div className="text-slate-400 text-[11px]">
            Team: Varghese James, Adithyan S, Drishya Pradeep • Guide: Prof. Anish George
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setActiveTab('technical')}
              className="hover:text-indigo-400 transition-colors"
            >
              Viva Defense Guide
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('about')}
              className="hover:text-indigo-400 transition-colors"
            >
              Architecture
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
