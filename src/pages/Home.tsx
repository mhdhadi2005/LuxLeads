import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import AccessCodeModal from "@/components/AccessCodeModal";

const Home = () => {
  const navigate = useNavigate();
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  const handleDashboardAccess = () => {
    navigate("/dashboard");
  };

  const handleWhatsAppRedirect = () => {
    window.open("https://wa.me/YOUR_WHATSAPP_NUMBER", "_blank");
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent animate-pulse"></div>
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full filter blur-xl animate-bounce" style={{ animationDuration: "6s" }}></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-xl animate-bounce" style={{ animationDuration: "8s", animationDelay: "2s" }}></div>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col">
        
        {/* Header Section with Logo */}
        <div className="flex flex-col items-center text-center mb-16 pt-8">
          <div className="animate-scale-in mb-8">
            <img 
              src="/lovable-uploads/7b56d562-80f1-496d-ab0e-5c5e0f802e3c.png" 
              alt="LuxLeads Logo" 
              className="h-24 md:h-32 lg:h-40 w-auto mx-auto mb-4 drop-shadow-2xl"
            />
            <p className="text-sm text-gray-300 tracking-widest mt-4">
              CRAFTED FOR CLOSERS
            </p>
          </div>
        </div>

        {/* Central Dashboard Section */}
        <div className="flex-1 flex items-center justify-center mb-16">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 lg:p-12 text-center animate-scale-in border border-white/20 shadow-2xl" style={{ animationDelay: "0.3s" }}>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8 tracking-tight">
              Access Your Dashboard
            </h2>
            
            <div className="space-y-4">
              <Button
                onClick={() => setIsCodeModalOpen(true)}
                size="lg"
                className="w-full lg:w-auto uppercase tracking-wide font-semibold text-white px-12 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                Launch Dashboard
              </Button>
              
              <div className="flex items-center justify-center space-x-2 text-gray-300">
                <div className="h-px bg-gray-400 flex-1"></div>
                <span className="px-3 text-sm">or</span>
                <div className="h-px bg-gray-400 flex-1"></div>
              </div>
              
              <Button
                onClick={handleWhatsAppRedirect}
                variant="outline"
                size="lg"
                className="w-full lg:w-auto border-2 border-green-500 text-green-400 hover:bg-green-500 hover:text-white px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105">
                <MessageCircle className="mr-2 h-5 w-5" />
                Don't Have Code? Contact Us
              </Button>
            </div>
          </div>
        </div>

        {/* Feature Cards with Enhanced Animations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-110 hover:rotate-1 animate-fade-in"
              style={{ animationDelay: `${0.9 + index * 0.2}s` }}
            >
              <div className="p-6 lg:p-8">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg mb-4 inline-block shadow-lg">
                  <h3 className="font-bold text-sm tracking-wider">{feature.title}</h3>
                </div>
                <p className="text-gray-200 text-sm lg:text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Footer Content */}
        <div className="text-center animate-fade-in" style={{ animationDelay: "1.5s" }}>
          <p className="text-gray-300 leading-relaxed mb-6 max-w-4xl mx-auto">
            LuxLeads is your premier contact management platform designed specifically for luxury market 
            professionals. We understand that building relationships in the high-end market requires 
            precision, elegance, and powerful insights.
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl py-4 px-8 inline-block border border-white/20">
            <span className="text-white font-semibold">
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


