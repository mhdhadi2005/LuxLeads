import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Filter, Download, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "@/components/DataTable";
import { FilterPanel } from "@/components/FilterPanel";
import { CategoryStats } from "@/components/CategoryStats";
import { ExportButton } from "@/components/ExportButton";
import { classifyBusiness, addClassificationToData, getCategoryStats } from "@/utils/classifier";
import customBG from "@/assets/cover.png";
import * as XLSX from "xlsx";

const luxLeadsLogo = "/lovable-uploads/72645a97-d464-43a4-b3ff-822d41ea5a10.png";

interface Contact {
  name: string;
  phone: string;
  description: string;
  category?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();

const [businessData, setBusinessData] = useState([]);

useEffect(() => {
  const fetchExcelData = async () => {
    const response = await fetch("/webdata.xlsx"); 
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: ["name", "phone", "description"],
      range: 2 // skip header row if needed
      });


    setBusinessData(jsonData); // expects columns: name, phone, description
  };

  fetchExcelData();
}, []);

  const [data, setData] = useState<Contact[]>([]);
  const [filteredData, setFilteredData] = useState<Contact[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [advancedFilters, setAdvancedFilters] = useState<Record<string, any>>({});
  
  // Process business data on component mount
  const processedData = businessData.map(contact => ({
    ...contact,
    category: classifyBusiness(contact)
  }));
  
  const [filters, setFilters] = useState({
    category: "all",
    search: "",
    country: "all"
  });


  const updateFilter = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    let filtered = data.length > 0 ? data : processedData;
    
    if (newFilters.category !== "all") {
      filtered = filtered.filter(contact => contact.category === newFilters.category);
    }
    
    if (newFilters.search) {
      filtered = filtered.filter(contact =>
        contact.name.toLowerCase().includes(newFilters.search.toLowerCase()) ||
        contact.phone.includes(newFilters.search) ||
        contact.description.toLowerCase().includes(newFilters.search.toLowerCase())
      );
    }
    
    if (newFilters.country !== "all") {
      filtered = filtered.filter(contact => {
        if (newFilters.country === "uae") return contact.phone.startsWith("+971");
        if (newFilters.country === "qatar") return contact.phone.startsWith("+974");
        if (newFilters.country === "eu") return !contact.phone.startsWith("+971") && !contact.phone.startsWith("+974");
        return true;
      });
    }
    
    setFilteredData(filtered);
  };

  // Enhanced filter handler for FilterPanel
  const handleAdvancedFilterChange = (newFilters: Record<string, any>) => {
    setAdvancedFilters(newFilters);
    let filtered = processedData; // Always start with the full processed data
    
    // Apply each advanced filter
    Object.keys(newFilters).forEach(column => {
      const filterValue = newFilters[column];
      
      if (filterValue !== null && filterValue !== undefined && filterValue !== '') {
        filtered = filtered.filter(contact => {
          const cellValue = contact[column as keyof Contact];
          
          if (typeof filterValue === 'object' && (filterValue.min !== undefined || filterValue.max !== undefined)) {
            // Handle number range filters
            const numValue = parseFloat(cellValue?.toString() || '0');
            if (filterValue.min !== undefined && numValue < filterValue.min) return false;
            if (filterValue.max !== undefined && numValue > filterValue.max) return false;
            return true;
          } else {
            // Handle text filters
            return cellValue?.toString().toLowerCase().includes(filterValue.toString().toLowerCase());
          }
        });
      }
    });
    
    // Apply basic filters on top of advanced filters
    if (filters.category !== "all") {
      filtered = filtered.filter(contact => contact.category === filters.category);
    }
    
    if (filters.search) {
      filtered = filtered.filter(contact =>
        contact.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        contact.phone.includes(filters.search) ||
        contact.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    if (filters.country !== "all") {
      filtered = filtered.filter(contact => {
        if (filters.country === "uae") return contact.phone.startsWith("+971");
        if (filters.country === "qatar") return contact.phone.startsWith("+974");
        if (filters.country === "eu") return !contact.phone.startsWith("+971") && !contact.phone.startsWith("+974");
        return true;
      });
    }
    
    setFilteredData(filtered);
  };

  const resetFilters = () => {
    setFilters({ category: "all", search: "", country: "all" });
    setFilteredData(data.length > 0 ? data : processedData);
  };

  // Use filtered data if any filters are applied, otherwise show all processed data
  const displayData = filteredData.length > 0 || Object.keys(advancedFilters).length > 0 || filters.category !== "all" || filters.search !== "" || filters.country !== "all" 
    ? filteredData 
    : processedData;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black relative overflow-hidden">
      {/* Floating Particles Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute bg-white/5 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-tl from-slate-900/50 via-transparent to-slate-800/50 pointer-events-none"></div>

      {/* Dynamic Header */}
      <div className="relative z-10 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 shadow-2xl">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="group relative overflow-hidden bg-slate-800/50 border-slate-600 text-slate-200 hover:bg-slate-700 hover:border-slate-500 transition-all duration-300 backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Home className="h-4 w-4 mr-2 relative z-10" />
                <span className="relative z-10">Home</span>
              </Button>
              
              <div className="flex items-center gap-4">
                <div className="animate-fade-in">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-100 via-slate-200 to-slate-300 bg-clip-text text-transparent">
                    LuxLeads Dashboard
                  </h1>
                  <p className="text-slate-400 text-sm font-medium">Manage your luxury business contacts with style</p>
                </div>
              </div>
            </div>

            <Badge 
              variant="secondary" 
              className="bg-slate-800/50 backdrop-blur-sm border-slate-600 text-slate-200 shadow-lg animate-bounce"
            >
              <span className="bg-green-400 w-2 h-2 rounded-full mr-2 animate-pulse"></span>
              {displayData.length} contacts loaded
            </Badge>
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto p-6 space-y-8">
        {/* Enhanced Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 backdrop-blur-xl border border-slate-600 shadow-2xl rounded-2xl p-2">
            <TabsTrigger 
              value="overview" 
              className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-700 data-[state=active]:to-slate-600 data-[state=active]:text-slate-100 data-[state=active]:shadow-lg text-slate-400 hover:text-slate-200 transition-all duration-300"
            >
              <span className="relative z-10">Overview</span>
            </TabsTrigger>
            <TabsTrigger 
              value="data" 
              className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-700 data-[state=active]:to-slate-600 data-[state=active]:text-slate-100 data-[state=active]:shadow-lg text-slate-400 hover:text-slate-200 transition-all duration-300"
            >
              <span className="relative z-10">Data Table</span>
            </TabsTrigger>
            <TabsTrigger 
              value="export" 
              className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-700 data-[state=active]:to-slate-600 data-[state=active]:text-slate-100 data-[state=active]:shadow-lg text-slate-400 hover:text-slate-200 transition-all duration-300"
            >
              <span className="relative z-10">Export</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8 animate-fade-in">
            <div className="grid gap-8 md:grid-cols-3">
              {/* Enhanced Filter Panel */}
              <Card className="group relative overflow-hidden bg-slate-800/30 backdrop-blur-xl border border-slate-600/50 shadow-2xl hover:shadow-purple-500/10 hover:border-slate-500 transition-all duration-500 animate-scale-in">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700/20 to-slate-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="relative z-10">
                  <CardTitle className="text-center text-xl font-bold bg-gradient-to-r from-slate-100 via-slate-200 to-slate-300 bg-clip-text text-transparent">
                    Smart Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <FilterPanel
                    columns={['name', 'phone', 'description', 'category']}
                    data={displayData}
                    onFilterChange={handleAdvancedFilterChange}
                  />
                </CardContent>
              </Card>
              
              {/* Enhanced Category Stats */}
              <div className="md:col-span-2 animate-scale-in delay-200">
                <CategoryStats data={displayData} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="data" className="space-y-6 animate-fade-in">
            <Card className="group relative overflow-hidden bg-slate-800/30 backdrop-blur-xl border border-slate-600/50 shadow-2xl hover:shadow-blue-500/10 hover:border-slate-500 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-700/20 to-slate-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <CardHeader className="relative z-10 bg-slate-800/50 backdrop-blur-sm border-b border-slate-600/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-100 text-xl font-bold">
                    <span className="bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
                      Contact Database
                    </span>
                  </CardTitle>
                  <Badge 
                    variant="outline" 
                    className="bg-slate-700/50 border-slate-500 text-slate-200 backdrop-blur-sm shadow-lg"
                  >
                    <span className="bg-green-400 w-2 h-2 rounded-full mr-2 animate-pulse"></span>
                    {displayData.length} contacts
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="relative z-10 p-6">
                <div className="overflow-hidden rounded-xl border border-slate-600/50 bg-slate-800/20 backdrop-blur-sm">
                  <DataTable 
                    data={displayData}
                    columns={displayData.length > 0 ? Object.keys(displayData[0]) : []}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="export" className="space-y-6 animate-fade-in">
            <Card className="group relative overflow-hidden bg-slate-800/30 backdrop-blur-xl border border-slate-600/50 shadow-2xl hover:shadow-green-500/10 hover:border-slate-500 transition-all duration-500 text-center p-12">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-700/20 to-slate-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <CardHeader className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-r from-slate-600 to-slate-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Download className="h-10 w-10 text-slate-100" />
                </div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-100 via-slate-200 to-slate-300 bg-clip-text text-transparent mb-4">
                  Export Your Data
                </CardTitle>
                <CardDescription className="text-lg text-slate-300 font-medium">
                  Download your contact data in your preferred format
                </CardDescription>
              </CardHeader>
              
              <CardContent className="relative z-10">
                <div className="transform group-hover:scale-105 transition-transform duration-300">
                  <ExportButton 
                    data={displayData}
                    filename="luxleads-contacts"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
