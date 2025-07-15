import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import AccessCodeModal from "@/components/AccessCodeModal";

const Home = () => {
  const navigate = useNavigate();
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  const handleDashboardAccess = () => {
    navigate("/dashboard");
  };

  const features = [
    {
      title: "SMART CLASSIFICATION",
      description: "Automatically categorize and organize your luxury market contacts with AI-powered insights."
    },
    {
      title: "BEAUTIFUL ANALYTICS", 
      description: "Visualize your network with stunning charts and metrics that matter to your business."
    },
    {
      title: "EFFORTLESS EXPORT",
      description: "Export your data in multiple formats, perfectly formatted for your workflow."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 relative overflow-hidden">
      {/* Dashboard Button Section - Keep as requested */}
      <div className="absolute top-8 right-8 z-20 animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <Button
          onClick={() => setIsCodeModalOpen(true)}
          size="lg"
          className="uppercase tracking-wide font-semibold text-white px-8 py-3 rounded-lg bg-[#202328] shadow-lg hover:bg-[#2a2d33] transition duration-300">
          Launch Dashboard
        </Button>
      </div>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-start justify-between mb-16 pt-8">
          {/* Left Side - LUXLEADS Logo */}
          <div className="animate-scale-in mb-8 lg:mb-0">
            <h1 className="text-6xl lg:text-8xl font-bold text-gray-800 tracking-tight">
              LUXLEADS
            </h1>
            <p className="text-sm text-gray-600 tracking-widest mt-2 ml-1">
              CRAFTED FOR CLOSERS
            </p>
          </div>

          {/* Right Side - Description */}
          <div className="lg:max-w-md xl:max-w-lg animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <p className="text-lg lg:text-xl text-gray-700 leading-relaxed font-medium">
              Your comprehensive business contact management platform. Discover insights, 
              analyze data, and manage your luxury market connections with style.
            </p>
          </div>
        </div>

        {/* Central Branding with Dark Background */}
        <div className="flex-1 flex items-center justify-center mb-16">
          <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-12 lg:p-16 text-center animate-scale-in" style={{ animationDelay: "0.7s" }}>
            <h2 className="text-4xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 tracking-tight">
              Lux<span className="text-gray-300">_</span>Leads
            </h2>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16 animate-fade-in" style={{ animationDelay: "0.9s" }}>
          {features.map((feature, index) => (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border border-gray-300 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="p-6 lg:p-8">
                <div className="bg-gray-800 text-white px-4 py-2 rounded-lg mb-4 inline-block">
                  <h3 className="font-bold text-sm tracking-wider">{feature.title}</h3>
                </div>
                <p className="text-gray-700 text-sm lg:text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Footer Content */}
        <div className="text-center animate-fade-in" style={{ animationDelay: "1.1s" }}>
          <p className="text-gray-600 leading-relaxed mb-4 max-w-4xl mx-auto">
            LuxLeads is your premier contact management platform designed specifically for luxury market 
            professionals. We understand that building relationships in the high-end market requires 
            precision, elegance, and powerful insights.
          </p>
          
          <div className="bg-black/10 backdrop-blur-sm rounded-lg py-3 px-6 inline-block">
            <span className="text-gray-800 font-semibold">
              Crafted for Closers • Built by Mohammed
            </span>
          </div>
        </div>
      </div>

      {/* Modal Section */}
      <AccessCodeModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        onSuccess={handleDashboardAccess}
      />
    </div>
  );
};

export default Home;


