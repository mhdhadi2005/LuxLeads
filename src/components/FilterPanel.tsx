
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Filter, X, RefreshCw } from 'lucide-react';

interface FilterPanelProps {
  columns: string[];
  data: any[];
  onFilterChange: (filters: Record<string, any>) => void;
}

export const FilterPanel = ({ columns, data, onFilterChange }: FilterPanelProps) => {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isExpanded, setIsExpanded] = useState(false);

  const getUniqueValues = (column: string) => {
    const values = data.map(row => row[column]).filter(val => val !== null && val !== undefined);
    return [...new Set(values)].slice(0, 20); // Limit to 20 unique values for performance
  };

  const getColumnType = (column: string) => {
    const sampleValue = data.find(row => row[column] !== null && row[column] !== undefined)?.[column];
    if (typeof sampleValue === 'number') return 'number';
    if (sampleValue instanceof Date || /date/i.test(column)) return 'date';
    return 'text';
  };

  const updateFilter = (column: string, value: any) => {
    const newFilters = { ...filters };
    if (value === 'all' || value === null || value === undefined) {
      delete newFilters[column];
    } else {
      newFilters[column] = value;
    }
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilter = (column: string) => {
    updateFilter(column, null);
  };

  const clearAllFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  const activeFilterCount = Object.keys(filters).length;

  return (
    <Card className="mb-6 bg-slate-800/50 border-slate-700">
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Filter className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Advanced Filters</h3>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                {activeFilterCount} active
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-slate-400 hover:text-white"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-slate-400 hover:text-white"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {columns.map((column) => {
              const columnType = getColumnType(column);
              const uniqueValues = getUniqueValues(column);
              const hasFilter = filters[column];

              return (
                <div key={column} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-300">{column}</label>
                    {hasFilter && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => clearFilter(column)}
                        className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>

                  {columnType === 'text' && uniqueValues.length < 10 ? (
                    <Select value={filters[column] || 'all'} onValueChange={(value) => updateFilter(column, value)}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder={`Select ${column}`} />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="all">All</SelectItem>
                        {uniqueValues.map((value) => (
                          <SelectItem key={value} value={value.toString()}>
                            {value.toString()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : columnType === 'number' ? (
                    <div className="flex space-x-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={filters[column]?.min || ''}
                        onChange={(e) => updateFilter(column, { 
                          ...filters[column], 
                          min: e.target.value ? parseInt(e.target.value) : undefined 
                        })}
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={filters[column]?.max || ''}
                        onChange={(e) => updateFilter(column, { 
                          ...filters[column], 
                          max: e.target.value ? parseInt(e.target.value) : undefined 
                        })}
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                      />
                    </div>
                  ) : (
                    <Input
                      placeholder={`Search ${column}...`}
                      value={filters[column] || ''}
                      onChange={(e) => updateFilter(column, e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
};
