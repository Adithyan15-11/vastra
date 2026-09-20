import { SampleTestGarment } from '../types';

export const SAMPLE_GARMENTS: SampleTestGarment[] = [
  {
    id: 'sample-shirt-01',
    name: 'Oxford Button-Down Shirt',
    shortDesc: 'Crisp sky blue tailored cotton formal shirt',
    category: 'top',
    thumbnailUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=700&auto=format&fit=crop&q=80',
    result: {
      id: 'res-sample-shirt-01',
      timestamp: 1726820400000,
      imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=700&auto=format&fit=crop&q=80',
      garmentType: 'Formal Oxford Shirt',
      category: 'top',
      color: {
        name: 'Sky Blue',
        hex: '#7FA1C3',
        secondaryHex: '#F5F5F7',
        paletteType: 'Pastel',
        contrastRatio: '4.8:1'
      },
      pattern: 'Solid Pinpoint Weave',
      estimatedMaterial: '100% Combed Cotton (80s Two-Ply)',
      materialCategory: 'Cotton',
      brandStatus: 'Subtle Embroidered Monogram (Left Chest)',
      conditionStatus: 'Pristine (No collar fraying, zero pilling)',
      conditionScore: 97,
      confidenceScore: 0.962,
      boundingBox: {
        x: 18,
        y: 12,
        width: 64,
        height: 76,
        label: 'Shirt: Formal Button-Down',
        confidence: 0.962
      },
      careGuide: {
        washing: 'Machine wash warm (40°C) on normal cycle with like colors.',
        washTemp: '40°C / Warm',
        drying: 'Hang dry or tumble dry low; remove promptly to avoid deep creasing.',
        ironing: 'Medium-high heat (up to 150°C) with steam while slightly damp.',
        bleaching: 'Only non-chlorine bleach when needed. Never use chlorine bleach.',
        dryClean: 'Commercial dry cleaning safe (Perchloroethylene).',
        specialNotes: 'Unbutton collar stays prior to laundering to prevent fabric puncture.'
      },
      inferenceStats: {
        latencyMs: 27.8,
        inputResolution: '640x640',
        fps: 36.0,
        backbone: 'CSPDarknet53-YOLOv8',
        confidenceThreshold: 0.45,
        nmsThreshold: 0.50,
        preprocessingTimeMs: 4.2,
        postprocessingTimeMs: 2.1
      },
      preprocessingLogs: [
        {
          name: 'Spatial Letterbox Rescaling',
          description: 'Aspect-ratio preserved scaling with bilinear interpolation to 640×640 px',
          kernelOrFilter: 'Bilinear Anti-alias',
          outputStatus: 'Completed',
          timeMs: 1.2
        },
        {
          name: 'Adaptive Histogram Equalization (CLAHE)',
          description: 'Localized contrast enhancement to reveal subtle textile weave patterns',
          kernelOrFilter: 'Grid 8×8, ClipLimit 2.0',
          outputStatus: 'Completed',
          timeMs: 1.5
        },
        {
          name: 'CIE-Lab Color Space Segmentation',
          description: 'Chrominance decoupling (L* lightness isolated from a* and b* color channels)',
          kernelOrFilter: 'Delta E 2000 Distance Clustering',
          outputStatus: 'Completed',
          timeMs: 0.9
        },
        {
          name: 'Gabor Texture Wavelet Filter',
          description: 'Multi-orientation frequency analysis detecting 45° twill/oxford basket weave',
          kernelOrFilter: 'Wavelet λ=4.0, θ=[0, 45, 90, 135]',
          outputStatus: 'Completed',
          timeMs: 0.6
        }
      ],
      textureFeatures: {
        weaveType: 'Basket Weave (Pinpoint Oxford)',
        density: 'Medium-High (140 gsm)',
        sheen: 'Matte Natural Luster',
        stretchFactor: 'Rigid / Non-stretch (100% natural fiber)'
      }
    }
  },
  {
    id: 'sample-tshirt-02',
    name: 'Crewneck Graphic T-Shirt',
    shortDesc: 'Vintage charcoal washed relaxed jersey knit t-shirt',
    category: 'top',
    thumbnailUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=700&auto=format&fit=crop&q=80',
    result: {
      id: 'res-sample-tshirt-02',
      timestamp: 1726820410000,
      imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=700&auto=format&fit=crop&q=80',
      garmentType: 'Casual Crewneck T-Shirt',
      category: 'top',
      color: {
        name: 'Washed Charcoal',
        hex: '#373A40',
        secondaryHex: '#E5E7EB',
        paletteType: 'Neutral',
        contrastRatio: '6.2:1'
      },
      pattern: 'Graphic Screen-print (Chest Placement)',
      estimatedMaterial: '100% Ring-spun Single Jersey Cotton',
      materialCategory: 'Cotton',
      brandStatus: 'Front Graphic Motif detected; neck printed label',
      conditionStatus: 'Good (Slight mineral wash patina, intact ribbing)',
      conditionScore: 91,
      confidenceScore: 0.948,
      boundingBox: {
        x: 16,
        y: 10,
        width: 68,
        height: 80,
        label: 'T-Shirt: Crewneck Jersey',
        confidence: 0.948
      },
      careGuide: {
        washing: 'Turn inside-out. Machine wash cold (30°C) on delicate cycle.',
        washTemp: '30°C / Cold',
        drying: 'Air dry flat or tumble dry delicate low heat.',
        ironing: 'Warm iron on reverse side. Do NOT iron directly over screen-print.',
        bleaching: 'Do not bleach. Harsh oxidizers will fade vintage charcoal dye.',
        dryClean: 'Do not dry clean; solvents can dissolve print plastisol.',
        specialNotes: 'Wash inside-out to protect graphic print and preserve collar elasticity.'
      },
      inferenceStats: {
        latencyMs: 25.4,
        inputResolution: '640x640',
        fps: 39.4,
        backbone: 'CSPDarknet53-YOLOv8',
        confidenceThreshold: 0.45,
        nmsThreshold: 0.50,
        preprocessingTimeMs: 3.8,
        postprocessingTimeMs: 1.8
      },
      preprocessingLogs: [
        {
          name: 'Spatial Letterbox Rescaling',
          description: 'Rescaled to 640×640 px maintaining 1:1 tensor dimensions',
          kernelOrFilter: 'Bilinear Anti-alias',
          outputStatus: 'Completed',
          timeMs: 1.1
        },
        {
          name: 'Contrast & Gamma Normalization',
          description: 'Gamma correction (γ=0.85) to separate dark charcoal from deep shadows',
          kernelOrFilter: 'Non-linear Histogram Equalizer',
          outputStatus: 'Completed',
          timeMs: 1.4
        },
        {
          name: 'HSV Masking for Graphic Isolation',
          description: 'Segmented foreground graphic text from background knit textile',
          kernelOrFilter: 'Otsu Dynamic Thresholding',
          outputStatus: 'Completed',
          timeMs: 0.8
        },
        {
          name: 'Knit Ribbing Edge Density Scan',
          description: 'Detected circular rib collar via Sobel gradient operator',
          kernelOrFilter: 'Sobel 3×3 Gradient Operator',
          outputStatus: 'Completed',
          timeMs: 0.5
        }
      ],
      textureFeatures: {
        weaveType: 'Single Jersey Weft Knit',
        density: 'Light-Medium (180 gsm)',
        sheen: 'Matte Mineral Washed',
        stretchFactor: 'Natural Mechanical 2-Way Stretch'
      }
    }
  },
  {
    id: 'sample-jeans-03',
    name: 'Raw Indigo Denim Jeans',
    shortDesc: 'Deep indigo 5-pocket straight-leg twill denim trousers',
    category: 'bottom',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=700&auto=format&fit=crop&q=80',
    result: {
      id: 'res-sample-jeans-03',
      timestamp: 1726820420000,
      imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=700&auto=format&fit=crop&q=80',
      garmentType: 'Straight-Leg Denim Jeans',
      category: 'bottom',
      color: {
        name: 'Deep Indigo Blue',
        hex: '#1E2A4A',
        secondaryHex: '#C68B59',
        paletteType: 'Deep',
        contrastRatio: '7.8:1'
      },
      pattern: '3x1 Right-Hand Twill Weave (Diagonal Rib)',
      estimatedMaterial: '98% Cotton Denim, 2% Elastane (13.5 oz)',
      materialCategory: 'Denim',
      brandStatus: 'Copper Rivet & Leather Waist Patch Detected',
      conditionStatus: 'Pristine (Crisp raw denim, zero fading or knee blowouts)',
      conditionScore: 98,
      confidenceScore: 0.975,
      boundingBox: {
        x: 22,
        y: 8,
        width: 56,
        height: 86,
        label: 'Jeans: 5-Pocket Indigo Denim',
        confidence: 0.975
      },
      careGuide: {
        washing: 'Wash infrequently (after 10+ wears). Turn inside out, cold water wash.',
        washTemp: 'Cold / 20°C - 30°C',
        drying: 'Always hang dry in the shade. Never machine tumble dry to prevent shrinkage.',
        ironing: 'Medium heat on reverse if needed, or allow natural hanging wrinkles to drop.',
        bleaching: 'Never bleach. Chlorine causes irreversible patchiness on indigo.',
        dryClean: 'Not recommended. Natural indigo benefits from minimal water immersion.',
        specialNotes: 'Raw indigo may bleed onto lighter fabrics or furniture during initial wears.'
      },
      inferenceStats: {
        latencyMs: 29.1,
        inputResolution: '640x640',
        fps: 34.3,
        backbone: 'CSPDarknet53-YOLOv8',
        confidenceThreshold: 0.45,
        nmsThreshold: 0.50,
        preprocessingTimeMs: 4.5,
        postprocessingTimeMs: 2.2
      },
      preprocessingLogs: [
        {
          name: 'Spatial Letterbox Rescaling',
          description: 'Padded vertical tensor to fit 640×640 detection receptive field',
          kernelOrFilter: 'Bilinear Anti-alias',
          outputStatus: 'Completed',
          timeMs: 1.3
        },
        {
          name: 'Twill Diagonal Line Transform (Radon/Hough)',
          description: 'Identified characteristic 63° diagonal twill ridges distinctive of denim',
          kernelOrFilter: 'Probabilistic Hough Transform',
          outputStatus: 'Completed',
          timeMs: 1.7
        },
        {
          name: 'Copper Rivet Blob Detection',
          description: 'Circularity and specular reflectance filter pinpointing pocket rivets',
          kernelOrFilter: 'Laplacian of Gaussian (LoG)',
          outputStatus: 'Completed',
          timeMs: 0.9
        },
        {
          name: 'Indigo Spectral Profile Verification',
          description: 'Correlated blue-absorption wavelength profile with genuine denim dyestuff',
          kernelOrFilter: 'K-Means Color Cluster (K=5)',
          outputStatus: 'Completed',
          timeMs: 0.6
        }
      ],
      textureFeatures: {
        weaveType: '3×1 Right-Hand Twill (Indigo Warp / White Weft)',
        density: 'Heavyweight (13.5 oz / ~460 gsm)',
        sheen: 'Low Raw Sheen with Indigo Depth',
        stretchFactor: 'Comfort Stretch (~10% elasticity recovery)'
      }
    }
  },
  {
    id: 'sample-jacket-04',
    name: 'Trucker Utility Jacket',
    shortDesc: 'Washed indigo denim trucker jacket with sherpa fleece collar',
    category: 'outerwear',
    thumbnailUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=700&auto=format&fit=crop&q=80',
    result: {
      id: 'res-sample-jacket-04',
      timestamp: 1726820430000,
      imageUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=700&auto=format&fit=crop&q=80',
      garmentType: 'Denim Trucker Jacket',
      category: 'outerwear',
      color: {
        name: 'Medium Stonewash Blue',
        hex: '#4A628A',
        secondaryHex: '#F0ECE5',
        paletteType: 'Earthy',
        contrastRatio: '5.5:1'
      },
      pattern: 'Stonewashed Twill with Sherpa Accent',
      estimatedMaterial: 'Outer: 100% Cotton Denim | Collar: Polyester Sherpa Fleece',
      materialCategory: 'Denim',
      brandStatus: 'Branded Metal Shank Buttons & Flap Pockets',
      conditionStatus: 'Good (Artisanal factory fading, heavy structural integrity)',
      conditionScore: 94,
      confidenceScore: 0.958,
      boundingBox: {
        x: 14,
        y: 10,
        width: 72,
        height: 80,
        label: 'Jacket: Outerwear Trucker',
        confidence: 0.958
      },
      careGuide: {
        washing: 'Button all closures. Machine wash cold, gentle cycle, separate colors.',
        washTemp: '30°C / Cold',
        drying: 'Hang on wide padded wooden hanger to preserve shoulder silhouette.',
        ironing: 'Steam iron denim areas. Do not iron directly on sherpa fleece.',
        bleaching: 'Strictly no bleach.',
        dryClean: 'Specialized dry clean recommended if sherpa lining is heavily soiled.',
        specialNotes: 'Brush sherpa collar gently with a soft textile brush to restore loft after washing.'
      },
      inferenceStats: {
        latencyMs: 31.2,
        inputResolution: '640x640',
        fps: 32.1,
        backbone: 'CSPDarknet53-YOLOv8',
        confidenceThreshold: 0.45,
        nmsThreshold: 0.50,
        preprocessingTimeMs: 4.8,
        postprocessingTimeMs: 2.4
      },
      preprocessingLogs: [
        {
          name: 'Spatial Letterbox Rescaling',
          description: 'Aspect-ratio preserved scaling to 640×640 px tensor',
          kernelOrFilter: 'Bilinear Anti-alias',
          outputStatus: 'Completed',
          timeMs: 1.4
        },
        {
          name: 'Multi-scale Feature Fusion',
          description: 'Isolated high-frequency fleece texture from low-frequency flat denim panels',
          kernelOrFilter: 'Gaussian Pyramid Decomposition',
          outputStatus: 'Completed',
          timeMs: 1.8
        },
        {
          name: 'Metal Button Specular Reflection Filter',
          description: 'Located circular metal hardware fasteners along vertical placket',
          kernelOrFilter: 'Hough Circles Detection',
          outputStatus: 'Completed',
          timeMs: 1.0
        },
        {
          name: 'Seam & Flap Pocket Contour Tracing',
          description: 'Detected chest yoke seams and flap geometries characteristic of trucker style',
          kernelOrFilter: 'Canny Edge Detector (50, 150)',
          outputStatus: 'Completed',
          timeMs: 0.6
        }
      ],
      textureFeatures: {
        weaveType: 'Heavy Twill Shell with Pile Knitted Sherpa Lining',
        density: 'Heavyweight Outerwear (14.5 oz shell)',
        sheen: 'Matte Stonewashed',
        stretchFactor: 'Rigid Non-stretch'
      }
    }
  }
];
