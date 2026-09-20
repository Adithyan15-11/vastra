import { GarmentAnalysisResult, OutfitRecommendation } from '../types';

interface ColorRule {
  family: string;
  complementary: { name: string; hex: string; rationale: string }[];
  analogous: { name: string; hex: string; rationale: string }[];
  neutral: { name: string; hex: string; rationale: string }[];
}

const COLOR_THEORY_MAP: Record<string, ColorRule> = {
  blue: {
    family: 'Blue / Indigo',
    complementary: [
      { name: 'Warm Terracotta / Tan', hex: '#C86D51', rationale: 'Direct complementary contrast creates balanced visual energy between cool and warm tones.' },
      { name: 'Camel / Caramel', hex: '#C19A6B', rationale: 'Warm amber tones ground blue fabrics in timeless sartorial balance.' }
    ],
    analogous: [
      { name: 'Slate Teal / Petrol', hex: '#2A6F7B', rationale: 'Harmonious adjacent spectral cool flow.' },
      { name: 'Navy Midnight', hex: '#162447', rationale: 'Depth-oriented monochromatic gradient that enhances textile sophistication.' }
    ],
    neutral: [
      { name: 'Crisp Optical White', hex: '#F8F9FA', rationale: 'High contrast anchor that brightens the overall silhouette.' },
      { name: 'Heather Stone Grey', hex: '#9CA3AF', rationale: 'Soft neutral bridge that diffuses color saturation smoothly.' }
    ]
  },
  black: {
    family: 'Black / Charcoal',
    complementary: [
      { name: 'Warm Ecru / Ivory', hex: '#F5F5DC', rationale: 'High-definition contrast without stark clinical coldness.' },
      { name: 'Burgundy / Oxblood', hex: '#6A1B29', rationale: 'Deep jewel tone adds rich depth against dark neutrals.' }
    ],
    analogous: [
      { name: 'Graphite Slate', hex: '#475569', rationale: 'Tonal layered gradient for contemporary monochrome precision.' },
      { name: 'Ashen Melange', hex: '#64748B', rationale: 'Micro-texture contrast against solid dark base.' }
    ],
    neutral: [
      { name: 'Muted Olive Drab', hex: '#556B2F', rationale: 'Military utilitarian neutral that softens dark structural garments.' },
      { name: 'Camel Tan', hex: '#B8860B', rationale: 'Heritage neutral creating warm architectural polarity.' }
    ]
  },
  white: {
    family: 'White / Cream',
    complementary: [
      { name: 'Deep Indigo Denim', hex: '#1E2A4A', rationale: 'Classic heritage contrast with rich visual anchor.' },
      { name: 'Rich Espresso Brown', hex: '#3E2723', rationale: 'Earthy organic contrast highlighting fabric weave textures.' }
    ],
    analogous: [
      { name: 'Oatmeal / Ecru', hex: '#E5DDC8', rationale: 'Subtle tone-on-tone quiet luxury palette.' },
      { name: 'Soft Sandstone', hex: '#D2B48C', rationale: 'Gentle warmth gradient across natural fibers like linen and cotton.' }
    ],
    neutral: [
      { name: 'Sage Green', hex: '#87A96B', rationale: 'Subtle muted botanical tone that feels fresh and balanced.' },
      { name: 'Charcoal Wool', hex: '#374151', rationale: 'Clean structural perimeter.' }
    ]
  },
  default: {
    family: 'Neutral Tone',
    complementary: [
      { name: 'Rich Navy Blue', hex: '#1B2A4A', rationale: 'Universal foundation tone providing depth and formal grounding.' },
      { name: 'Warm Cognac', hex: '#9A3816', rationale: 'Leather-adjacent warm accent that highlights tactile weaving.' }
    ],
    analogous: [
      { name: 'Smoky Taupe', hex: '#8B8589', rationale: 'Harmonious adjacent earthy gradient.' },
      { name: 'Muted Slate', hex: '#64748B', rationale: 'Subtle desaturated counter-weight.' }
    ],
    neutral: [
      { name: 'Chalk White', hex: '#F3F4F6', rationale: 'Clean canvas element.' },
      { name: 'Charcoal Black', hex: '#1F2937', rationale: 'Structured defining perimeter.' }
    ]
  }
};

function resolveColorFamily(colorName: string, hex: string): ColorRule {
  const lower = (colorName + ' ' + hex).toLowerCase();
  if (lower.includes('blue') || lower.includes('indigo') || lower.includes('navy') || lower.includes('cyan') || lower.includes('azure')) {
    return COLOR_THEORY_MAP.blue;
  }
  if (lower.includes('black') || lower.includes('charcoal') || lower.includes('grey') || lower.includes('gray') || lower.includes('slate')) {
    return COLOR_THEORY_MAP.black;
  }
  if (lower.includes('white') || lower.includes('cream') || lower.includes('ivory') || lower.includes('ecru') || lower.includes('sand')) {
    return COLOR_THEORY_MAP.white;
  }
  return COLOR_THEORY_MAP.default;
}

export function generateOutfitRecommendations(result: GarmentAnalysisResult): OutfitRecommendation[] {
  const colorRule = resolveColorFamily(result.color.name, result.color.hex);
  const isTop = result.category === 'top';
  const isBottom = result.category === 'bottom';
  const isOuterwear = result.category === 'outerwear';

  const recs: OutfitRecommendation[] = [];

  // Recommendation 1: Smart Casual / Layered Sartorial
  recs.push({
    vibe: 'Smart Casual / Layered Balance',
    occasion: 'Professional Presentations, Academic Seminars & Creative Workplaces',
    colorHarmonyType: 'Complementary Contrast & Tactile Balance',
    topRecommendation: isTop ? undefined : {
      category: 'Top',
      garment: 'Poplin Button-Down Shirt or Fine-Gauge Merino Crewneck',
      colorSuggestion: colorRule.complementary[0].name,
      colorHex: colorRule.complementary[0].hex,
      rationale: colorRule.complementary[0].rationale
    },
    bottomRecommendation: isBottom ? undefined : {
      category: 'Bottom',
      garment: 'Tailored Flat-Front Chinos or Raw Denim Trousers',
      colorSuggestion: colorRule.neutral[0].name,
      colorHex: colorRule.neutral[0].hex,
      rationale: 'Neutral foundation balances upper-body color saturation and keeps the silhouette grounded.'
    },
    outerwearRecommendation: isOuterwear ? undefined : {
      category: 'Outerwear',
      garment: 'Unstructured Cotton-Linen Blazer or Harrington Jacket',
      colorSuggestion: colorRule.analogous[1].name,
      colorHex: colorRule.analogous[1].hex,
      rationale: 'Adds architectural structure and depth through textural layering without competing for attention.'
    },
    footwearRecommendation: {
      category: 'Footwear',
      garment: 'Derby Shoes or Minimalist Leather Low-Top Trainers',
      colorSuggestion: 'Rich Mahogany / Dark Chestnut',
      colorHex: '#4A2C2A',
      rationale: 'Earthy leather tones harmoniously anchor the lower visual weight of the outfit.'
    },
    stylingNotes: [
      `Fabric Balance: Pair the ${result.estimatedMaterial} with contrasting textile weights (e.g. smooth weave vs. textured knit).`,
      `Color Accent: Introduce the complementary tone (${colorRule.complementary[0].name}) in accessories or inner plackets to avoid visual monotony.`,
      `Proportions: Maintain clean vertical lines at the cuffs and hem to accentuate clean garment tailoring.`
    ]
  });

  // Recommendation 2: Minimalist Monochromatic / Tonal
  recs.push({
    vibe: 'Refined Monochromatic / Scandinavian Modern',
    occasion: 'Exhibitions, Weekend Travel & Casual Meetings',
    colorHarmonyType: 'Analogous Gradient & Tonal Layering',
    topRecommendation: isTop ? undefined : {
      category: 'Top',
      garment: 'Heavyweight Drop-Shoulder Relaxed Tee or Waffle-Knit Longsleeve',
      colorSuggestion: colorRule.analogous[0].name,
      colorHex: colorRule.analogous[0].hex,
      rationale: colorRule.analogous[0].rationale
    },
    bottomRecommendation: isBottom ? undefined : {
      category: 'Bottom',
      garment: 'Relaxed Tapered Pleated Trousers or Straight Carpenter Pants',
      colorSuggestion: colorRule.analogous[1].name,
      colorHex: colorRule.analogous[1].hex,
      rationale: 'Creates a sophisticated vertical column of unified tones that visually unifies the ensemble.'
    },
    outerwearRecommendation: isOuterwear ? undefined : {
      category: 'Outerwear',
      garment: 'Overshirt / Wool CPO Utility Jacket',
      colorSuggestion: colorRule.neutral[1].name,
      colorHex: colorRule.neutral[1].hex,
      rationale: 'Mid-weight overshirt gives functional temperature adaptation with clean boxy geometric lines.'
    },
    footwearRecommendation: {
      category: 'Footwear',
      garment: 'Suede Chelsea Boots or Minimalist Canvas Deck Shoes',
      colorSuggestion: 'Smoky Slate / Sand',
      colorHex: '#6B7280',
      rationale: 'Suede nap texture absorbs light, enriching the subdued tonal palette.'
    },
    stylingNotes: [
      `Textural Contrast: In monochromatic dressing, distinct fabric textures (twill against jersey knit) prevent flat visual repetition.`,
      `Occasion Flexibility: Roll cuffs slightly or unbutton top layer to easily transition from formal lecture halls to social gatherings.`,
      `Hardware Harmony: Match metal zipper or watch finishes to cool chrome or warm brass depending on the primary undertone.`
    ]
  });

  // Recommendation 3: High-Contrast Modern Casual
  recs.push({
    vibe: 'Modern Utilitarian Casual',
    occasion: 'Campus Days, Tech Meetups & Everyday Routine',
    colorHarmonyType: 'Neutral Anchor with Crisp Negative Space',
    topRecommendation: isTop ? undefined : {
      category: 'Top',
      garment: 'Premium Ring-Spun Supima Cotton Crewneck',
      colorSuggestion: colorRule.neutral[0].name,
      colorHex: colorRule.neutral[0].hex,
      rationale: 'Clean negative space creates crisp definition around the focal garment.'
    },
    bottomRecommendation: isBottom ? undefined : {
      category: 'Bottom',
      garment: 'Heavy Twill Cargo Trousers or 5-Pocket Selvedge Denim',
      colorSuggestion: colorRule.complementary[1]?.name || 'Deep Indigo',
      colorHex: colorRule.complementary[1]?.hex || '#1E2A4A',
      rationale: 'Durable bottom weight establishes functional stability and high wear resistance.'
    },
    outerwearRecommendation: isOuterwear ? undefined : {
      category: 'Outerwear',
      garment: 'Water-Resistant Technical Windbreaker or Denim Trucker',
      colorSuggestion: colorRule.neutral[1].name,
      colorHex: colorRule.neutral[1].hex,
      rationale: 'Technical weather protection with structured collar definition.'
    },
    footwearRecommendation: {
      category: 'Footwear',
      garment: 'Retro Heritage Runners or Vibram-soled Moc Boots',
      colorSuggestion: 'Gum Sole / Off-White',
      colorHex: '#C2B280',
      rationale: 'Natural rubber gum soles provide subtle heritage athletic charm.'
    },
    stylingNotes: [
      `Ease of Movement: Emphasize functional ergonomics when pairing with ${result.pattern} fabric patterns.`,
      `Negative Space: Avoid clashing prints; if the scanned item features a prominent pattern, keep supporting garments strictly solid.`,
      `Longevity: Follow the companion Care Guide to retain dye integrity across all paired items.`
    ]
  });

  return recs;
}
