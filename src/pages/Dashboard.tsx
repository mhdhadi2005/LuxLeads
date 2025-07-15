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

const [businessData, setBusinessData] = useState([]);

useEffect(() => {
  const fetchExcelData = async () => {
    const response = await fetch("/webdata.xlsx"); // make sure the file is in `public/`
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


interface Contact {
  name: string;
  phone: string;
  description: string;
  category?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Contact[]>([]);
  const [filteredData, setFilteredData] = useState<Contact[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  
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
    let filtered = data.length > 0 ? data : processedData;
    
    // Apply each filter
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
    
    setFilteredData(filtered);
  };

  const resetFilters = () => {
    setFilters({ category: "all", search: "", country: "all" });
    setFilteredData(data.length > 0 ? data : processedData);
  };

  const displayData = data.length > 0 ? filteredData : processedData;
  
  return (
    <div className="min-h-screen bg-gradient-background" style={{ backgroundImage: `url(${customBG})` }}>
      {/* Colorful Header */}
      <div className="bg-[#555179] text-white shadow-colorful">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="uppercase tracking-wide font-semibold text-white px-8 py-3 rounded-lg bg-[#202328] shadow-lg hover:bg-[#2a2d33] transition duration-300"

              >
                <Home className="h-4 w-4" />
                Home
              </Button>
              
              <div className="flex items-center gap-4">
                
                <div>
                  <h1 className="text-3xl font-bold">LuxLeads Dashboard</h1>
                  <p className="text-white/80">Manage your luxury business contacts with style</p>
                </div>
              </div>
            </div>
            {/* className="uppercase tracking-wide font-semibold text-white px-8 py-3 rounded-lg bg-[#202328] shadow-lg hover:bg-[#2a2d33] transition duration-300"
 */}
            <Badge variant="secondary" className="bg-[#202328] shadow-lg hover:bg-[#2a2d33] px-2 py-2 text-white border-white/30 animate-float">
              {displayData.length} contacts loaded
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 space-y-6">


      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-gradient-card shadow-soft rounded-xl p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-[#202328] data-[state=active]:text-white">
            Overview
          </TabsTrigger>
          <TabsTrigger value="data" className="data-[state=active]:bg-[#202328] data-[state=active]:text-white">
            Data Table
          </TabsTrigger>
          <TabsTrigger value="export" className="data-[state=active]:bg-[#202328] data-[state=active]:text-white">
            Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 animate-fade-in">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="bg-slate-800/50 shadow-soft border-0 animate-scale-in">
              <CardHeader>
                <CardTitle className="text-center bg-white bg-clip-text text-transparent">
                  Filter Options
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FilterPanel
                  columns={['name', 'phone', 'description', 'category']}
                  data={displayData}
                  onFilterChange={handleAdvancedFilterChange}
                />
              </CardContent>
            </Card>
            
            <div className="md:col-span-2">
              <CategoryStats data={displayData} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="data" className="space-y-4 animate-fade-in">
          <Card className="bg-gradient-card shadow-soft border-0">
            <CardHeader className="bg-[#1b2030] rounded-t-lg">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Contact Data</CardTitle>
                <Badge variant="outline" className="bg-white/50 border-secondary-foreground/20">
                  {displayData.length} contacts
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <DataTable 
                data={displayData}
                columns={displayData.length > 0 ? Object.keys(displayData[0]) : []}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4 animate-fade-in">
          <Card className="bg-gradient-card shadow-colorful border-0 text-center p-8">
            <CardHeader>
              <CardTitle className="text-2xl bg-[#1b2030] bg-clip-text text-transparent mb-4">
                Export Your Data
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                Download your contact data in your preferred format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExportButton 
                data={displayData}
                filename="luxleads-contacts"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
