
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCategoryStats, BusinessCategory } from '@/utils/classifier';
import { Car, User, Building, Clock, Watch, Gem, ShoppingBag, Glasses } from 'lucide-react';

interface CategoryStatsProps {
  data: any[];
}

const categoryIcons: Record<BusinessCategory, any> = {
  'Car Dealership': Car,
  'Dealer': Building,
  'Broker': User,
  'Private Owner': User,
  'Car Rental': Clock,
  'Luxury Watches': Watch,
  'Jewellery': Gem,
  'Bags': ShoppingBag,
  'Glasses': Glasses,
  'Other': Building
};

const categoryColors: Record<BusinessCategory, string> = {
  'Car Dealership': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Dealer': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Broker': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Private Owner': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Car Rental': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  'Luxury Watches': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Jewellery': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  'Bags': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  'Glasses': 'bg-red-500/20 text-red-400 border-red-500/30',
  'Other': 'bg-gray-500/20 text-gray-400 border-gray-500/30'
};

export const CategoryStats = ({ data }: CategoryStatsProps) => {
  const stats = getCategoryStats(data);
  const totalRecords = data.length;

  return (
    <Card className="p-6 bg-slate-800/50 border-slate-700 mb-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <Building className="h-5 w-5 mr-2 text-blue-400" />
        Business Categories
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {Object.entries(stats).map(([category, count]) => {
          if (count === 0) return null;
          
          const Icon = categoryIcons[category as BusinessCategory];
          const colorClass = categoryColors[category as BusinessCategory];
          const percentage = totalRecords > 0 ? Math.round((count / totalRecords) * 100) : 0;
          
          return (
            <div key={category} className={`p-3 rounded-lg border ${colorClass}`}>
              <div className="flex items-center justify-between mb-2">
                <Icon className="h-4 w-4" />
                <Badge variant="secondary" className="text-xs">
                  {percentage}%
                </Badge>
              </div>
              <div className="text-sm font-medium mb-1">{category}</div>
              <div className="text-lg font-bold">{count}</div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
