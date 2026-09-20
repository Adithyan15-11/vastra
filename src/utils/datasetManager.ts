import { DatasetFolderState, DatasetReferenceItem, GarmentCategory } from '../types';

/**
 * Heuristics to infer category and material from file path and file name
 */
export function inferCategoryAndMaterialFromPath(
  path: string,
  fileName: string
): { category: GarmentCategory; material: string; subfolder: string } {
  const combined = `${path}/${fileName}`.toLowerCase();
  const parts = path.split('/').filter(Boolean);
  const subfolder = parts.length > 1 ? parts[parts.length - 2] : parts[0] || 'general';

  let category: GarmentCategory = 'top';
  if (
    combined.includes('jean') ||
    combined.includes('pant') ||
    combined.includes('trouser') ||
    combined.includes('chino') ||
    combined.includes('short') ||
    combined.includes('skirt')
  ) {
    category = 'bottom';
  } else if (
    combined.includes('jacket') ||
    combined.includes('coat') ||
    combined.includes('blazer') ||
    combined.includes('parka') ||
    combined.includes('windbreaker')
  ) {
    category = 'outerwear';
  } else if (
    combined.includes('dress') ||
    combined.includes('jumpsuit') ||
    combined.includes('romper') ||
    combined.includes('gown')
  ) {
    category = 'one-piece';
  } else if (
    combined.includes('scarf') ||
    combined.includes('hat') ||
    combined.includes('belt') ||
    combined.includes('tie') ||
    combined.includes('bag')
  ) {
    category = 'accessory';
  }

  let material = 'Cotton Blend';
  if (combined.includes('denim') || combined.includes('jeans')) {
    material = 'Denim Twill';
  } else if (combined.includes('wool') || combined.includes('merino') || combined.includes('cashmere')) {
    material = 'Wool Knit';
  } else if (combined.includes('silk') || combined.includes('satin')) {
    material = 'Mulberry Silk';
  } else if (combined.includes('linen') || combined.includes('flax')) {
    material = 'Pure Linen';
  } else if (combined.includes('polyester') || combined.includes('nylon') || combined.includes('fleece')) {
    material = 'Synthetic Technical Blend';
  } else if (combined.includes('oxford') || combined.includes('combed') || combined.includes('cotton')) {
    material = '100% Combed Cotton';
  } else if (combined.includes('leather') || combined.includes('suede')) {
    material = 'Natural Leather';
  }

  return { category, material, subfolder };
}

/**
 * Process uploaded files from a directory input or drop event
 */
export async function processDatasetFiles(
  files: File[],
  customFolderName?: string
): Promise<DatasetFolderState> {
  const imageFiles: File[] = [];
  let metadataJson: any = null;
  let detectedRoot = customFolderName || 'custom_dataset';

  for (const file of files) {
    const relPath = (file as any).webkitRelativePath || file.name;
    const pathParts = relPath.split('/').filter(Boolean);
    if (pathParts.length > 1 && !customFolderName) {
      detectedRoot = pathParts[0];
    }

    if (file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|avif|bmp)$/i.test(file.name)) {
      imageFiles.push(file);
    } else if (file.name.endsWith('.json') && !metadataJson) {
      try {
        const text = await file.text();
        metadataJson = JSON.parse(text);
      } catch (e) {
        console.warn('Could not parse metadata JSON in data folder', e);
      }
    }
  }

  const referenceItems: DatasetReferenceItem[] = [];
  const categoriesSet = new Set<string>();
  const materialsSet = new Set<string>();

  // Limit preview thumbnails to first 60 images to ensure smooth performance
  const displayLimit = Math.min(imageFiles.length, 60);

  for (let i = 0; i < displayLimit; i++) {
    const file = imageFiles[i];
    const relPath = (file as any).webkitRelativePath || file.name;
    const { category, material, subfolder } = inferCategoryAndMaterialFromPath(relPath, file.name);

    categoriesSet.add(category);
    materialsSet.add(material);

    // Create object URL for client-side preview
    const previewUrl = URL.createObjectURL(file);

    referenceItems.push({
      id: `ref-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
      fileName: file.name,
      filePath: relPath,
      subfolder,
      inferredCategory: category,
      inferredMaterial: material,
      customLabel: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      previewUrl,
      fileSize: file.size,
    });
  }

  // Scan remaining images just for category counts if > 60
  for (let i = displayLimit; i < imageFiles.length; i++) {
    const file = imageFiles[i];
    const relPath = (file as any).webkitRelativePath || file.name;
    const { category, material } = inferCategoryAndMaterialFromPath(relPath, file.name);
    categoriesSet.add(category);
    materialsSet.add(material);
  }

  return {
    folderName: detectedRoot,
    totalFiles: files.length,
    imageCount: imageFiles.length,
    categoriesDetected: Array.from(categoriesSet),
    materialsDetected: Array.from(materialsSet),
    referenceItems,
    metadataJson,
    isGroundingEnabled: true,
    lastUploadedAt: Date.now(),
  };
}

/**
 * Traverse dropped directory entries recursively using webkitGetAsEntry
 */
export async function getFilesFromDataTransfer(items: DataTransferItemList): Promise<File[]> {
  const files: File[] = [];

  async function traverseEntry(entry: any, path = ''): Promise<void> {
    if (entry.isFile) {
      await new Promise<void>((resolve) => {
        entry.file((file: File) => {
          // Set relative path on the file object
          Object.defineProperty(file, 'webkitRelativePath', {
            value: path ? `${path}/${file.name}` : file.name,
            writable: true,
          });
          files.push(file);
          resolve();
        }, () => resolve());
      });
    } else if (entry.isDirectory) {
      const dirReader = entry.createReader();
      const readEntries = async (): Promise<any[]> => {
        return new Promise((resolve) => {
          dirReader.readEntries((entries: any[]) => resolve(entries), () => resolve([]));
        });
      };

      let entries = await readEntries();
      while (entries.length > 0) {
        for (const childEntry of entries) {
          await traverseEntry(childEntry, path ? `${path}/${entry.name}` : entry.name);
        }
        entries = await readEntries();
      }
    }
  }

  const entries: any[] = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.kind === 'file') {
      const entry = item.webkitGetAsEntry?.();
      if (entry) {
        entries.push(entry);
      } else {
        const file = item.getAsFile();
        if (file) files.push(file);
      }
    }
  }

  for (const entry of entries) {
    await traverseEntry(entry);
  }

  return files;
}

/**
 * Built-in Academic Benchmark Dataset
 * Preloaded with 12 reference garment/textile archetypes across categories
 */
export function getDefaultBenchmarkDataset(): DatasetFolderState {
  const referenceItems: DatasetReferenceItem[] = [
    {
      id: 'ref-bm-1',
      fileName: 'oxford_formal_blue.jpg',
      filePath: 'pbcmt504_cv_dataset/cotton/oxford_formal_blue.jpg',
      subfolder: 'cotton',
      inferredCategory: 'top',
      inferredMaterial: '100% Combed Cotton',
      customLabel: 'Formal Sky Blue Oxford Button-Down',
      previewUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80',
      fileSize: 428000,
    },
    {
      id: 'ref-bm-2',
      fileName: 'indigo_selvedge_jeans.jpg',
      filePath: 'pbcmt504_cv_dataset/denim/indigo_selvedge_jeans.jpg',
      subfolder: 'denim',
      inferredCategory: 'bottom',
      inferredMaterial: '3x1 Twill Cotton Denim',
      customLabel: '5-Pocket Raw Indigo Selvedge Denim',
      previewUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80',
      fileSize: 512000,
    },
    {
      id: 'ref-bm-3',
      fileName: 'merino_wool_sweater.jpg',
      filePath: 'pbcmt504_cv_dataset/wool/merino_wool_sweater.jpg',
      subfolder: 'wool',
      inferredCategory: 'top',
      inferredMaterial: '100% Extra-fine Merino Wool',
      customLabel: 'Cable Knit Crewneck Merino Wool',
      previewUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&auto=format&fit=crop&q=80',
      fileSize: 384000,
    },
    {
      id: 'ref-bm-4',
      fileName: 'trucker_jacket_denim.jpg',
      filePath: 'pbcmt504_cv_dataset/outerwear/trucker_jacket_denim.jpg',
      subfolder: 'outerwear',
      inferredCategory: 'outerwear',
      inferredMaterial: 'Heavyweight Cotton Denim with Sherpa',
      customLabel: 'Stonewashed Trucker Utility Jacket',
      previewUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80',
      fileSize: 620000,
    },
    {
      id: 'ref-bm-5',
      fileName: 'charcoal_jersey_tshirt.jpg',
      filePath: 'pbcmt504_cv_dataset/cotton/charcoal_jersey_tshirt.jpg',
      subfolder: 'cotton',
      inferredCategory: 'top',
      inferredMaterial: '100% Ring-spun Cotton Jersey',
      customLabel: 'Heather Charcoal Crewneck T-Shirt',
      previewUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
      fileSize: 310000,
    },
    {
      id: 'ref-bm-6',
      fileName: 'linen_summer_sundress.jpg',
      filePath: 'pbcmt504_cv_dataset/linen/linen_summer_sundress.jpg',
      subfolder: 'linen',
      inferredCategory: 'one-piece',
      inferredMaterial: '100% Natural Flax Linen',
      customLabel: 'A-Line Breathable Summer Sundress',
      previewUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80',
      fileSize: 455000,
    },
    {
      id: 'ref-bm-7',
      fileName: 'tailored_chinos_olive.jpg',
      filePath: 'pbcmt504_cv_dataset/cotton/tailored_chinos_olive.jpg',
      subfolder: 'cotton',
      inferredCategory: 'bottom',
      inferredMaterial: '98% Cotton Twill, 2% Spandex',
      customLabel: 'Slim Fit Olive Drab Tailored Chinos',
      previewUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&auto=format&fit=crop&q=80',
      fileSize: 480000,
    },
    {
      id: 'ref-bm-8',
      fileName: 'mulberry_silk_scarf.jpg',
      filePath: 'pbcmt504_cv_dataset/silk/mulberry_silk_scarf.jpg',
      subfolder: 'silk',
      inferredCategory: 'accessory',
      inferredMaterial: '100% Mulberry Silk Twill (16 Momme)',
      customLabel: 'Printed Artisan Mulberry Silk Scarf',
      previewUrl: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&auto=format&fit=crop&q=80',
      fileSize: 340000,
    },
  ];

  return {
    folderName: 'pbcmt504_cv_dataset',
    totalFiles: 8,
    imageCount: 8,
    categoriesDetected: ['top', 'bottom', 'outerwear', 'one-piece', 'accessory'],
    materialsDetected: ['100% Combed Cotton', '3x1 Twill Cotton Denim', '100% Extra-fine Merino Wool', '100% Natural Flax Linen', '100% Mulberry Silk Twill (16 Momme)'],
    referenceItems,
    metadataJson: {
      dataset_name: 'PBCMT504 CV Ground-Truth Benchmark Dataset',
      version: '1.2.0',
      num_classes: 5,
      textile_fibers: ['Cotton', 'Denim', 'Wool', 'Linen', 'Silk'],
      annotation_format: 'YOLO-Textile + CIE-Lab Chrominance Centroids',
    },
    isGroundingEnabled: true,
    lastUploadedAt: Date.now(),
  };
}
