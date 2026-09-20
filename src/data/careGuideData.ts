import { MaterialType } from '../types';

export interface MaterialCareInfo {
  type: MaterialType;
  displayName: string;
  badgeColor: string;
  tagline: string;
  origin: string;
  keyCharacteristics: string[];
  washing: {
    recommendedTemp: string;
    cycle: string;
    detergent: string;
    description: string;
  };
  drying: {
    method: string;
    tumbleDrySafe: boolean;
    description: string;
  };
  ironing: {
    heatSetting: string;
    maxTemp: string;
    steamRecommended: boolean;
    description: string;
  };
  bleaching: {
    allowed: boolean;
    warning: string;
  };
  dryCleaning: {
    recommended: boolean;
    notes: string;
  };
  symbols: {
    wash: string;
    dry: string;
    iron: string;
    bleach: string;
  };
  dos: string[];
  donts: string[];
  stainGuide: {
    stainType: string;
    treatment: string;
  }[];
}

export const CARE_GUIDE_DATABASE: MaterialCareInfo[] = [
  {
    type: 'Cotton',
    displayName: 'Cotton (Natural Cellulosic)',
    badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    tagline: 'Breathable, durable, and highly absorbent natural staple fiber.',
    origin: 'Natural plant fiber from Gossypium seed pods.',
    keyCharacteristics: [
      'High wet tensile strength (stronger when wet than dry)',
      'Excellent breathability and moisture absorption',
      'Susceptible to wrinkling and shrinkage under excessive thermal heat',
      'Prone to color fading with prolonged direct UV exposure'
    ],
    washing: {
      recommendedTemp: '30°C - 40°C (Cold to Warm)',
      cycle: 'Normal / Regular Cycle',
      detergent: 'Standard bio/non-bio liquid detergent',
      description: 'Separate whites, light pastels, and dark colors. For pre-shrunk cotton, warm water is acceptable; use cold wash for raw or dyed cotton to prevent color bleeding.'
    },
    drying: {
      method: 'Line Dry or Tumble Dry Low',
      tumbleDrySafe: true,
      description: 'Remove from dryer slightly damp to prevent fiber over-drying and permanent creasing. Line drying preserves fiber longevity.'
    },
    ironing: {
      heatSetting: 'High / Cotton Setting',
      maxTemp: '200°C',
      steamRecommended: true,
      description: 'Iron while the fabric is still slightly damp using medium-to-high steam for crisp crease removal.'
    },
    bleaching: {
      allowed: true,
      warning: 'Only non-chlorine (oxygen-based) bleach for colored cottons. Diluted chlorine bleach only for 100% white cotton.'
    },
    dryCleaning: {
      recommended: false,
      notes: 'Generally unnecessary unless garment has delicate structural interlinings or tailored suit pads.'
    },
    symbols: {
      wash: '30°C Normal',
      dry: 'Tumble Low',
      iron: 'Hot Steam',
      bleach: 'Non-Chlorine'
    },
    dos: [
      'Wash vibrant colored cotton garments inside-out to maintain surface saturation.',
      'Treat stains immediately before the cellulosic fibers absorb the pigment.',
      'Use fabric conditioner sparingly to avoid reducing natural fiber absorbency.'
    ],
    donts: [
      'Avoid high-temperature tumble drying which causes micro-fiber shrinkage.',
      'Do not leave damp cotton in closed hampers to prevent mildew and sour odor.'
    ],
    stainGuide: [
      {
        stainType: 'Coffee / Tea',
        treatment: 'Rinse immediately under cold running water. Dab with a mild vinegar and water solution (1:2), then machine wash normally.'
      },
      {
        stainType: 'Oil & Grease',
        treatment: 'Dust with talcum powder or cornstarch to absorb surface grease for 15 mins. Apply concentrated dish soap, then wash at 40°C.'
      },
      {
        stainType: 'Sweat / Deodorant',
        treatment: 'Pre-soak in warm water with dissolved baking soda for 30 minutes before regular wash.'
      }
    ]
  },
  {
    type: 'Denim',
    displayName: 'Denim (Warp-Faced Cotton Twill)',
    badgeColor: 'border-blue-500/30 text-blue-400 bg-blue-500/10',
    tagline: 'Heavy-duty twill weave with indigo-dyed warp and ecru weft yarns.',
    origin: 'Originally crafted in Nîmes, France (Serge de Nîmes) from sturdy cotton.',
    keyCharacteristics: [
      'Characteristic 3×1 or 2×1 diagonal twill weave pattern',
      'Surface indigo dye naturally patinas with friction and wear over time',
      'High structural durability and tensile resilience',
      'Substantial stiffness that softens gradually with use'
    ],
    washing: {
      recommendedTemp: '20°C - 30°C (Strictly Cold)',
      cycle: 'Delicate / Gentle Cycle (Low Spin <800 RPM)',
      detergent: 'Color-preserving liquid detergent without optical brighteners',
      description: 'Always zip zippers and button fly before washing. Turn jeans inside-out. Wash with similar dark hues to avoid crocking dye transfer.'
    },
    drying: {
      method: 'Hang Dry In Shade (Never Direct Sun)',
      tumbleDrySafe: false,
      description: 'Hang upside down by the leg hems on a sturdy drying rack away from direct ultraviolet sunlight, which accelerates unwanted fading.'
    },
    ironing: {
      heatSetting: 'Medium-High',
      maxTemp: '150°C',
      steamRecommended: true,
      description: 'Steam inside-out while damp if required, or simply hang in the bathroom while taking a hot shower to let gravity steam away wrinkles.'
    },
    bleaching: {
      allowed: false,
      warning: 'Never bleach indigo denim. Bleach decomposes indigo dyestuff into uneven yellowish patchy stains.'
    },
    dryCleaning: {
      recommended: false,
      notes: 'Dry cleaning chemicals strip the natural oils and indigo dye balance from the cotton fibers.'
    },
    symbols: {
      wash: 'Cold 30°C Delicate',
      dry: 'Line Dry Shade',
      iron: 'Medium Reverse',
      bleach: 'Do Not Bleach'
    },
    dos: [
      'Wash infrequently (every 5-10 wears) to develop authentic whiskers and honeycombs.',
      'Spot clean minor smudges with a damp cloth instead of full laundering.',
      'Turn completely inside-out before water immersion.'
    ],
    donts: [
      'Never tumble dry high-heat — it destroys elastane blend fibers and causes leg twist.',
      'Do not scrub isolated stained spots vigorously, as it creates localized white halos.'
    ],
    stainGuide: [
      {
        stainType: 'Mud & Dirt',
        treatment: 'Allow mud to dry completely, brush off dried crust with a stiff bristle brush, then dab remaining residue with cold soapy water.'
      },
      {
        stainType: 'Ink / Marker',
        treatment: 'Place a paper towel under the stain. Dab with rubbing alcohol using a cotton swab, working from outside edge inward.'
      }
    ]
  },
  {
    type: 'Wool',
    displayName: 'Wool (Natural Protein Fiber)',
    badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
    tagline: 'Thermoregulating, naturally elastic, and odor-resistant animal keratin fiber.',
    origin: 'Fleece shorn from sheep, merino, alpaca, or cashmere goats.',
    keyCharacteristics: [
      'Microscopic overlapping scales that can interlock (felt) under heat and agitation',
      'Natural crimp provides superior thermal insulation and elasticity recovery',
      'Naturally flame-retardant and moisture-wicking',
      'Vulnerable to moth larvae and alkaline pH detergents'
    ],
    washing: {
      recommendedTemp: 'Cold / Max 30°C',
      cycle: 'Hand Wash or Certified Wool Delicate Cycle',
      detergent: 'pH-neutral wool detergent (containing lanolin, enzyme-free)',
      description: 'Submerge gently without twisting, scrubbing, or wringing. Agitation causes the microscopic scales to lock together permanently (felting).'
    },
    drying: {
      method: 'Lay Flat On Dry Towel (Never Hang)',
      tumbleDrySafe: false,
      description: 'Roll up in a clean terry cloth towel like a jelly roll to press out excess moisture. Reshape to original dimensions and dry flat on a horizontal mesh rack.'
    },
    ironing: {
      heatSetting: 'Low-Medium Wool Setting with Pressing Cloth',
      maxTemp: '148°C',
      steamRecommended: true,
      description: 'Use copious steam without pressing down firmly. Hover the steam iron 1 cm above fabric to let fibers rebound naturally.'
    },
    bleaching: {
      allowed: false,
      warning: 'Chlorine bleach will dissolve keratin protein fibers entirely, disintegrating the textile.'
    },
    dryCleaning: {
      recommended: true,
      notes: 'Recommended for tailored wool coats, blazers with shoulder padding, and fine suiting.'
    },
    symbols: {
      wash: 'Hand Wash Cold',
      dry: 'Dry Flat Only',
      iron: 'Steam Hover',
      bleach: 'No Bleach'
    },
    dos: [
      'Air out wool garments between wears; wool naturally releases odors without washing.',
      'Store clean with cedar blocks or lavender sachets to deter textile moths.',
      'Use a fabric depiller comb to gently remove superficial surface fuzz.'
    ],
    donts: [
      'Never hang wet wool on hangers — water weight will stretch shoulders out of shape permanently.',
      'Never use hot water or rapid mechanical spin cycles.'
    ],
    stainGuide: [
      {
        stainType: 'Red Wine',
        treatment: 'Blot immediately with carbonated water or seltzer. Do not rub. Apply a few drops of enzyme-free wool detergent and rinse cold.'
      },
      {
        stainType: 'Sauce / Gravy',
        treatment: 'Scrape off excess with a dull knife. Blot with diluted wool shampoo, then sponge with cold water.'
      }
    ]
  },
  {
    type: 'Silk',
    displayName: 'Silk (Continuous Protein Filament)',
    badgeColor: 'border-purple-500/30 text-purple-400 bg-purple-500/10',
    tagline: 'Lustrous, ultra-smooth luxury filament produced by Bombyx mori silkworms.',
    origin: 'Cultivated sericulture silk fibers composed of fibroin protein.',
    keyCharacteristics: [
      'Triangular prism fiber cross-section reflects light at various angles for natural shimmer',
      'Smooth, hypoallergenic, and gentle on sensitive skin',
      'Weakened by moisture and perspiration acids',
      'Sensitized by UV sunlight and perfume chemicals'
    ],
    washing: {
      recommendedTemp: 'Lukewarm to Cool (20°C - 30°C)',
      cycle: 'Hand Wash Only',
      detergent: 'Specialty pH-neutral silk wash or gentle mild baby shampoo',
      description: 'Gently swirl the silk item in cool water for 3-5 minutes. Add a few drops of white vinegar to the final rinse to neutralize detergent alkalinity and restore luster.'
    },
    drying: {
      method: 'Roll In Towel & Hang In Shade',
      tumbleDrySafe: false,
      description: 'Never wring or twist. Roll in a clean dry towel to extract water, then lay flat or hang on a padded smooth hanger indoors away from heaters.'
    },
    ironing: {
      heatSetting: 'Low / Silk Setting (No Direct Steam Spray)',
      maxTemp: '120°C',
      steamRecommended: false,
      description: 'Iron while the silk is still slightly damp, on the reverse side. Avoid spraying water drops directly onto dry silk as it creates permanent water rings.'
    },
    bleaching: {
      allowed: false,
      warning: 'Never bleach silk. Bleach turns silk yellow and degrades the delicate protein filaments.'
    },
    dryCleaning: {
      recommended: true,
      notes: 'Dry cleaning is strongly recommended for structured silk garments, silk dupioni, and deep multicolored prints.'
    },
    symbols: {
      wash: 'Hand Wash Cool',
      dry: 'Hang In Shade',
      iron: 'Low Reverse Damp',
      bleach: 'Strictly No Bleach'
    },
    dos: [
      'Apply perfume, body lotions, and hairspray before dressing to avoid droplet stains.',
      'Store in breathable cotton garment bags away from cedar wood and mothballs.'
    ],
    donts: [
      'Never expose silk to direct tropical sunlight on clotheslines.',
      'Never wring silk like a rope — this snaps the continuous filament threads.'
    ],
    stainGuide: [
      {
        stainType: 'Water Stains / Rings',
        treatment: 'Dip the entire garment in lukewarm water and dry uniformly to eliminate water ring boundaries.'
      },
      {
        stainType: 'Cosmetics / Lipstick',
        treatment: 'Dab gently with a solvent-based spot cleaner or take directly to a professional dry cleaner specialized in silk.'
      }
    ]
  },
  {
    type: 'Polyester',
    displayName: 'Polyester (Synthetic Polymer / PET)',
    badgeColor: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
    tagline: 'Resilient, hydrophobic, wrinkle-free, and quick-drying synthetic fiber.',
    origin: 'Petroleum-based synthetic polymer (Polyethylene Terephthalate).',
    keyCharacteristics: [
      'Exceptionally high tensile strength and abrasion resistance',
      'Virtually wrinkle-proof with outstanding dimensional stability',
      'Low moisture absorbency (hydrophobic, ideal for athletic wear)',
      'Prone to static electricity and oleophilic (bonds easily with body oils)'
    ],
    washing: {
      recommendedTemp: '30°C - 40°C (Warm)',
      cycle: 'Permanent Press / Synthetic Cycle',
      detergent: 'Heavy-duty sport/synthetic liquid detergent',
      description: 'Permanent press cycle with a cool-down rinse reduces wash wrinkling. Use sport detergents with odor-neutralizing enzymes for workout apparel.'
    },
    drying: {
      method: 'Tumble Dry Low or Line Dry',
      tumbleDrySafe: true,
      description: 'Dries very rapidly. Tumble dry on low heat to prevent static buildup and fiber melting. Add a dryer sheet to curb static cling.'
    },
    ironing: {
      heatSetting: 'Low Synthetic Setting',
      maxTemp: '110°C',
      steamRecommended: true,
      description: 'Use a pressing cloth. Excessive heat will instantly melt synthetic polymer fibers, leaving a shiny burn patch or hole.'
    },
    bleaching: {
      allowed: false,
      warning: 'Chlorine bleach weakens synthetic fibers and causes gray discoloration. Use oxygen bleach if brightening is required.'
    },
    dryCleaning: {
      recommended: false,
      notes: 'Most polyester garments can be easily and safely machine laundered at home.'
    },
    symbols: {
      wash: 'Warm 40°C Synthetic',
      dry: 'Tumble Dry Low',
      iron: 'Low Heat (110°C)',
      bleach: 'Oxygen Bleach Only'
    },
    dos: [
      'Wash athletic polyester promptly after workouts to prevent bacterial sebum buildup.',
      'Use mesh wash bags for fine microfiber garments to catch micro-shedding.'
    ],
    donts: [
      'Never iron with high heat — synthetic fibers melt at ~250°C and deform at lower temps.',
      'Do not overload the washing drum to avoid friction pilling.'
    ],
    stainGuide: [
      {
        stainType: 'Body Oils & Odor',
        treatment: 'Pre-treat underarms with white vinegar and baking soda paste or an active enzyme sport spray 15 mins prior to wash.'
      },
      {
        stainType: 'Ink / Ballpoint',
        treatment: 'Spray with aerosol hairspray or isopropyl alcohol, blot firmly with paper towels until lifted, then wash.'
      }
    ]
  },
  {
    type: 'Linen',
    displayName: 'Linen (Natural Flax Fiber)',
    badgeColor: 'border-amber-600/30 text-amber-300 bg-amber-600/10',
    tagline: 'Ancient bast fiber from the flax plant, famed for crisp structure and cooling airflow.',
    origin: 'Extracted from the cellulose bast of the Linum usitatissimum (flax) plant.',
    keyCharacteristics: [
      'Up to 3x stronger than cotton, highly breathable and cooling',
      'Signature slub texture and crisp natural drape',
      'Softens substantially with every wash cycle',
      'Low fiber elasticity results in characteristic relaxed wrinkling'
    ],
    washing: {
      recommendedTemp: '30°C - 40°C',
      cycle: 'Gentle Cycle with plenty of water volume',
      detergent: 'Mild gentle liquid detergent',
      description: 'Linen loves water; avoid crowding the machine so flax fibers can move freely without excessive friction.'
    },
    drying: {
      method: 'Line Dry in Breeze',
      tumbleDrySafe: false,
      description: 'Air dry on a sturdy hanger in a breezy spot. Tumble drying causes deep, brittle fiber creasing that is hard to iron out.'
    },
    ironing: {
      heatSetting: 'High / Linen Setting (Max Steam)',
      maxTemp: '220°C',
      steamRecommended: true,
      description: 'Best ironed while visibly damp with max steam, or embrace linen’s natural relaxed rumpled aesthetic.'
    },
    bleaching: {
      allowed: false,
      warning: 'Never bleach natural unbleached or dyed linen. It rots the bast cellulose.'
    },
    dryCleaning: {
      recommended: false,
      notes: 'Linen excels with natural water washing; dry cleaning can make fibers brittle over time.'
    },
    symbols: {
      wash: 'Gentle 30°C',
      dry: 'Line Dry',
      iron: 'High Steam Damp',
      bleach: 'No Bleach'
    },
    dos: [
      'Shake garments out vigorously before line hanging to relax creases naturally.',
      'Embrace the organic natural wrinkles as an intentional hallmark of flax luxury.'
    ],
    donts: [
      'Do not wring tightly; twist pressure breaks the stiff flax bast filaments.',
      'Do not store in sealed plastic containers; linen needs airflow.'
    ],
    stainGuide: [
      {
        stainType: 'Grass / Green Stains',
        treatment: 'Sponge with rubbing alcohol, let sit for 5 minutes, then hand wash with mild liquid soap in lukewarm water.'
      },
      {
        stainType: 'Tomato / Curry',
        treatment: 'Flush with cold water, apply liquid detergent directly, then lay damp in indirect sunshine for gentle natural bleaching.'
      }
    ]
  }
];
