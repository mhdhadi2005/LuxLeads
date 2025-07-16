
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X, Sparkles } from 'lucide-react';

interface FilterPanelProps {
  columns: string[];
  data: any[];
  onFilterChange: (filters: Record<string, any>) => void;
}

export const FilterPanel = ({ columns, data, onFilterChange }: FilterPanelProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    
    // Create a simple global search filter
    const filters: Record<string, any> = {};
    
    if (value.trim()) {
      // Apply search to all text columns
      columns.forEach(column => {
        if (column !== 'phone') { // Keep phone searches more specific
          filters[column] = value.trim();
        }
      });
    }
    
    // Add any active category filters
    Object.keys(activeFilters).forEach(key => {
      filters[key] = activeFilters[key];
    });
    
    onFilterChange(filters);
  };

  const addQuickFilter = (column: string, value: string) => {
    const newActiveFilters = { ...activeFilters, [column]: value };
    setActiveFilters(newActiveFilters);
    
    const filters: Record<string, any> = { ...newActiveFilters };
    
    // Also include search if active
    if (searchTerm.trim()) {
      columns.forEach(col => {
        if (col !== 'phone') {
          filters[col] = searchTerm.trim();
        }
      });
    }
    
    onFilterChange(filters);
  };

  const removeFilter = (column: string) => {
    const newActiveFilters = { ...activeFilters };
    delete newActiveFilters[column];
    setActiveFilters(newActiveFilters);
    
    const filters: Record<string, any> = { ...newActiveFilters };
    
    // Keep search if active
    if (searchTerm.trim()) {
      columns.forEach(col => {
        if (col !== 'phone') {
          filters[col] = searchTerm.trim();
        }
      });
    }
    
    onFilterChange(filters);
  };

  const clearAll = () => {
    setSearchTerm('');
    setActiveFilters({});
    onFilterChange({});
  };

  // Get unique categories for quick filters
  const categories = data.length > 0 ? [...new Set(data.map(item => item.category).filter(Boolean))] : [];

  return (
    <div className="space-y-4">
      {/* Magic Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
        <Input
          placeholder="✨ Search anything... names, phones, descriptions..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-500/30 text-white placeholder:text-purple-300 focus:border-purple-400 transition-all duration-300 h-12 text-lg"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSearch('')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-purple-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Quick Category Filters */}
      {categories.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span className="text-sm text-purple-300 font-medium">Quick Filters</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeFilters.category === category ? "default" : "outline"}
                size="sm"
                onClick={() => 
                  activeFilters.category === category 
                    ? removeFilter('category')
                    : addQuickFilter('category', category)
                }
                className={`transition-all duration-300 ${
                  activeFilters.category === category
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                    : 'border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400'
                }`}
              >
                {category}
                {activeFilters.category === category && (
                  <X className="ml-2 h-3 w-3" />
                )}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {(searchTerm || Object.keys(activeFilters).length > 0) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-400">Active filters:</span>
          
          {searchTerm && (
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              Search: "{searchTerm}"
              <X 
                className="ml-2 h-3 w-3 cursor-pointer hover:text-white" 
                onClick={() => handleSearch('')}
              />
            </Badge>
          )}
          
          {Object.entries(activeFilters).map(([key, value]) => (
            <Badge 
              key={key} 
              variant="secondary" 
              className="bg-blue-500/20 text-blue-300 border-blue-500/30"
            >
              {key}: {value}
              <X 
                className="ml-2 h-3 w-3 cursor-pointer hover:text-white" 
                onClick={() => removeFilter(key)}
              />
            </Badge>
          ))}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="text-gray-400 hover:text-white text-xs"
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
};
