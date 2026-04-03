export const POULTRY_IMAGES = {
  // Hero & Backgrounds
  HERO: {
    FARM_VIEW: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=2000&auto=format&fit=crop',
    CHICKS_GROUP: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=2000&auto=format&fit=crop'
  },
  SCENERY: [
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1594918352610-85f782390a8a?q=80&w=1600&auto=format&fit=crop',
  ],

  // Dashboard Stat Cards
  STATS: {
    CHICKENS: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=800&auto=format&fit=crop',
    EGGS: 'https://images.unsplash.com/photo-1569252683395-62b64752a281?q=80&w=800&auto=format&fit=crop',
    FARMS: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop',
    ALERTS: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop',
  },

  // Marketplace & Store Products
  PRODUCTS: {
    EGGS: [
      'https://images.unsplash.com/photo-1569252683395-62b64752a281?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1587486915202-32ad30c8ef21?q=80&w=800&auto=format&fit=crop',
    ],
    LIVE_BIRDS: [
      'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=800&auto=format&fit=crop',
    ],
    FEED: [
      'https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=800&auto=format&fit=crop',
    ],
    MEDICINE: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop',
    ],
    EQUIPMENT: [
      'https://images.unsplash.com/photo-1582550186989-bb0d4362a78f?q=80&w=800&auto=format&fit=crop',
    ]
  },

  // Category Placeholders
  PLACEHOLDERS: {
    AVATAR: 'https://ui-avatars.com/api/?name=User&background=random',
    STORE: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=800&auto=format&fit=crop',
    AI_BOT: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=800&auto=format&fit=crop',
  }
};

/**
 * Returns a deterministic image URL based on a search term to ensure
 * consistency.
 */
export const getConsistentImage = (term = '', category = 'GENERAL') => {
  const t = (term || '').toUpperCase();
  const hash = term ? term.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
  
  // Specific Terms (Intelligent Add-on Mapping)
  if (t.includes('STARTER') || t.includes('MASH')) return 'https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=800&auto=format&fit=crop';
  if (t.includes('FINISHER') || t.includes('GROWER')) return 'https://images.unsplash.com/photo-1519413251433-2877a7605d33?q=80&w=800&auto=format&fit=crop';
  
  if (t.includes('KADAKNATH')) return 'https://images.unsplash.com/photo-1586944203664-964032d88f6f?q=80&w=800&auto=format&fit=crop';
  if (t.includes('COUNTRY') || t.includes('NATURAL') || t.includes('DESI')) return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop';
  
  if (t.includes('LAYER') || t.includes('LEGHORN')) return 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=800&auto=format&fit=crop';
  if (t.includes('CHICK')) return 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=800&auto=format&fit=crop';

  if (t.includes('EGG')) return 'https://images.unsplash.com/photo-1569252683395-62b64752a281?q=80&w=800&auto=format&fit=crop';

  if (t.includes('MED') || t.includes('VITAMIN')) return 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop';
  if (t.includes('EQUIP') || t.includes('DRINKER')) return 'https://images.unsplash.com/photo-1582550186989-bb0d4362a78f?q=80&w=800&auto=format&fit=crop';

  // Fallback to Category Logic
  let imageArray = [];
  if (t.includes('EGG') || category === 'EGG') {
    imageArray = POULTRY_IMAGES.PRODUCTS.EGGS;
  } else if (t.includes('CHICK') || t.includes('BIRD') || category === 'BIRD') {
    imageArray = POULTRY_IMAGES.PRODUCTS.LIVE_BIRDS;
  } else if (t.includes('FEED') || category === 'FEED') {
    imageArray = POULTRY_IMAGES.PRODUCTS.FEED;
  } else if (t.includes('MEDICINE') || category === 'MEDICINE') {
    imageArray = POULTRY_IMAGES.PRODUCTS.MEDICINE;
  } else if (category === 'EQUIPMENT') {
    imageArray = POULTRY_IMAGES.PRODUCTS.EQUIPMENT;
  } else {
    imageArray = POULTRY_IMAGES.SCENERY;
  }

  return imageArray[hash % imageArray.length] || POULTRY_IMAGES.SCENERY[0];
};

/**
 * Premium Rupee Formatter
 */
export const formatRupee = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};
