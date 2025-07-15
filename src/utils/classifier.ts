
export type BusinessCategory = 
  | 'Car Dealership'
  | 'Dealer'
  | 'Broker'
  | 'Private Owner'
  | 'Car Rental'
  | 'Luxury Watches'
  | 'Jewellery'
  | 'Bags'
  | 'Glasses'
  | 'Other';

interface ClassificationRule {
  category: BusinessCategory;
  keywords: string[];
}

const classificationRules: ClassificationRule[] = [
  {
    category: 'Car Dealership',
    keywords: ['dealership', 'auto dealer', 'car dealer', 'automotive', 'motors', 'cars ltd', 'auto sales', 'vehicle sales']
  },
  {
    category: 'Dealer',
    keywords: ['dealer', 'trading', 'wholesale', 'distribution', 'supplier']
  },
  {
    category: 'Broker',
    keywords: ['broker', 'brokerage', 'intermediary', 'agent', 'consultant']
  },
  {
    category: 'Private Owner',
    keywords: ['private', 'individual', 'personal', 'owner', 'seller']
  },
  {
    category: 'Car Rental',
    keywords: ['rental', 'rent', 'hire', 'lease', 'leasing', 'car hire']
  },
  {
    category: 'Luxury Watches',
    keywords: ['watch', 'watches', 'timepiece', 'rolex', 'omega', 'luxury watch', 'chronograph']
  },
  {
    category: 'Jewellery',
    keywords: ['jewellery', 'jewelry', 'diamond', 'gold', 'silver', 'ring', 'necklace', 'bracelet']
  },
  {
    category: 'Bags',
    keywords: ['bag', 'bags', 'handbag', 'purse', 'luggage', 'briefcase', 'backpack']
  },
  {
    category: 'Glasses',
    keywords: ['glasses', 'eyewear', 'sunglasses', 'spectacles', 'frames', 'optical']
  }
];

export const classifyBusiness = (data: any): BusinessCategory => {
  const searchText = Object.values(data)
    .join(' ')
    .toLowerCase();

  for (const rule of classificationRules) {
    if (rule.keywords.some(keyword => searchText.includes(keyword.toLowerCase()))) {
      return rule.category;
    }
  }

  return 'Other';
};

export const addClassificationToData = (data: any[]): any[] => {
  return data.map(item => ({
    ...item,
    Category: classifyBusiness(item)
  }));
};

export const getCategoryStats = (data: any[]): Record<BusinessCategory, number> => {
  const stats: Record<BusinessCategory, number> = {
    'Car Dealership': 0,
    'Dealer': 0,
    'Broker': 0,
    'Private Owner': 0,
    'Car Rental': 0,
    'Luxury Watches': 0,
    'Jewellery': 0,
    'Bags': 0,
    'Glasses': 0,
    'Other': 0
  };

  data.forEach(item => {
    const category = item.Category || classifyBusiness(item);
    stats[category as BusinessCategory]++;
  });

  return stats;
};
