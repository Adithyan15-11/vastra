export type GarmentCategory = 'top' | 'bottom' | 'outerwear' | 'one-piece' | 'accessory';

export type MaterialType = 'Cotton' | 'Denim' | 'Wool' | 'Silk' | 'Polyester' | 'Linen' | 'Leather' | 'Nylon' | 'Other';

export interface ColorData {
  name: string;
  hex: string;
  secondaryHex?: string;
  paletteType: 'Monochromatic' | 'Neutral' | 'Vibrant' | 'Earthy' | 'Pastel' | 'Deep';
  contrastRatio?: string;
}

export interface BoundingBox {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage 0-100
  height: number; // percentage 0-100
  label: string;
  confidence: number;
}

export interface CareGuideSummary {
  washing: string;
  washTemp: string;
  drying: string;
  ironing: string;
  bleaching: string;
  dryClean: string;
  specialNotes?: string;
}

export interface InferenceStats {
  latencyMs: number;
  inputResolution: string;
  fps: number;
  backbone: string;
  confidenceThreshold: number;
  nmsThreshold: number;
  preprocessingTimeMs: number;
  postprocessingTimeMs: number;
}

export interface PreprocessingStep {
  name: string;
  description: string;
  kernelOrFilter: string;
  outputStatus: 'Completed' | 'Optimal' | 'Processed';
  timeMs: number;
}

export interface GarmentAnalysisResult {
  id: string;
  timestamp: number;
  imageUrl: string;
  garmentType: string;
  category: GarmentCategory;
  color: ColorData;
  pattern: string;
  estimatedMaterial: string;
  materialCategory: MaterialType;
  brandStatus: string;
  conditionStatus: string;
  conditionScore: number; // 0-100
  confidenceScore: number; // 0.0 - 1.0
  boundingBox: BoundingBox;
  careGuide: CareGuideSummary;
  inferenceStats: InferenceStats;
  preprocessingLogs: PreprocessingStep[];
  textureFeatures: {
    weaveType: string;
    density: string;
    sheen: string;
    stretchFactor: string;
  };
  datasetMatch?: DatasetMatchResult;
}

export interface DatasetReferenceItem {
  id: string;
  fileName: string;
  filePath: string;
  subfolder?: string;
  inferredCategory?: GarmentCategory;
  inferredMaterial?: string;
  customLabel?: string;
  previewUrl: string;
  fileSize: number;
}

export interface DatasetFolderState {
  folderName: string;
  totalFiles: number;
  imageCount: number;
  categoriesDetected: string[];
  materialsDetected: string[];
  referenceItems: DatasetReferenceItem[];
  metadataJson?: any;
  isGroundingEnabled: boolean;
  lastUploadedAt: number;
}

export interface DatasetMatchResult {
  matchedItemName: string;
  matchedCategory: string;
  matchedMaterial: string;
  similarityScore: number;
  referenceThumbnailUrl?: string;
  accuracyBoostDescription: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  imageUrl: string;
  garmentType: string;
  category: GarmentCategory;
  colorName: string;
  colorHex: string;
  pattern: string;
  material: string;
  confidence: number;
  condition: string;
  analysis: GarmentAnalysisResult;
}

export interface SampleTestGarment {
  id: string;
  name: string;
  shortDesc: string;
  category: GarmentCategory;
  thumbnailUrl: string;
  result: GarmentAnalysisResult;
}

export interface StylingSuggestion {
  category: string;
  garment: string;
  colorSuggestion: string;
  colorHex: string;
  rationale: string;
}

export interface OutfitRecommendation {
  vibe: string;
  occasion: string;
  topRecommendation?: StylingSuggestion;
  bottomRecommendation?: StylingSuggestion;
  outerwearRecommendation?: StylingSuggestion;
  footwearRecommendation: StylingSuggestion;
  colorHarmonyType: string;
  stylingNotes: string[];
}
