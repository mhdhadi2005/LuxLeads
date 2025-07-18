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
    window.open("https://wa.me/message/67X542H3PRCLJ1", "_blank");
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
      {/* Multiple Animated Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/30 via-transparent to-transparent animate-pulse"></div>
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full filter blur-xl animate-bounce" style={{ animationDuration: "6s" }}></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/15 rounded-full filter blur-xl animate-bounce" style={{ animationDuration: "8s", animationDelay: "2s" }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial from-transparent via-purple-500/5 to-transparent animate-pulse" style={{ animationDuration: "4s" }}></div>
      
      {/* Floating particles */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-white/30 rounded-full animate-ping" style={{ animationDelay: "1s" }}></div>
      <div className="absolute top-40 right-32 w-1 h-1 bg-purple-400/50 rounded-full animate-ping" style={{ animationDelay: "3s" }}></div>
      <div className="absolute bottom-32 left-16 w-1.5 h-1.5 bg-blue-400/40 rounded-full animate-ping" style={{ animationDelay: "5s" }}></div>
      <div className="absolute bottom-64 right-20 w-1 h-1 bg-white/20 rounded-full animate-ping" style={{ animationDelay: "7s" }}></div>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col">
        
        {/* Header Section with Logo */}
        <div className="flex flex-col items-center text-center mb-16 pt-16">
          <div className="animate-scale-in mb-8">
            <img 
              src="/lovable-uploads/7b56d562-80f1-496d-ab0e-5c5e0f802e3c.png" 
              alt="LuxLeads Logo" 
              className="h-24 md:h-32 lg:h-24 w-auto mx-auto mb-4 drop-shadow-2xl"
            />
            <p className="text-md text-gray-300 tracking-widest mt-4">
              CRAFTED FOR CLOSERS
            </p>
          </div>
        </div>

        {/* Central Dashboard Section */}
        <div className="flex-1 flex items-center justify-center mb-16">
          <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-3xl p-8 lg:p-12 text-center animate-scale-in border border-white/30 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:scale-105" style={{ animationDelay: "0.3s" }}>
            <div className="relative">
              {/* Glowing effect behind title */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 rounded-xl blur-xl opacity-20 animate-pulse"></div>
              <h2 className="relative text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
                Premium Contact Management
              </h2>
              <p className="text-gray-300 mb-8 text-lg">Subscribe → Pay with Crypto → Get Access Code → Enter Dashboard</p>
            </div>
            
            <div className="space-y-6">
              <Button
                onClick={() => navigate('/auth')}
                size="lg"
                className="group w-full lg:w-auto uppercase tracking-wide font-semibold text-white px-12 py-4 rounded-xl bg-gradient-primary hover:opacity-90 shadow-colorful transition-all duration-500 transform hover:scale-110 hover:-rotate-1 relative overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                <span className="relative">🚀 Get Started</span>
              </Button>
              
              <div className="flex items-center justify-center space-x-4 text-gray-300">
                <div className="h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent flex-1"></div>
                <span className="px-4 text-sm font-medium bg-white/10 rounded-full border border-white/20">or</span>
                <div className="h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent flex-1"></div>
              </div>
              
              <Button
                onClick={() => setIsCodeModalOpen(true)}
                variant="outline"
                size="lg"
                className="group w-full lg:w-auto border-2 border-accent/70 bg-accent/10 text-accent hover:bg-accent hover:text-accent-foreground hover:border-accent px-8 py-4 rounded-xl transition-all duration-500 transform hover:scale-110 hover:rotate-1 relative overflow-hidden shadow-lg hover:shadow-accent/30">
                <span className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                <span className="relative z-10">🔑 Have Access Code?</span>
              </Button>

              <Button
                onClick={handleWhatsAppRedirect}
                variant="ghost"
                size="lg"
                className="group w-full lg:w-auto text-muted-foreground hover:text-foreground px-8 py-4 rounded-xl transition-all duration-500">
                <MessageCircle className="mr-2 h-4 w-4" />
                <span>Contact Support</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Feature Cards with Enhanced Animations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl border border-white/30 hover:border-purple-400/50 transition-all duration-700 hover:scale-110 hover:rotate-2 animate-fade-in relative overflow-hidden shadow-xl hover:shadow-purple-500/30"
              style={{ animationDelay: `${0.9 + index * 0.2}s` }}
            >
              {/* Glowing background effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="relative p-6 lg:p-8">
                <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 text-white px-4 py-3 rounded-xl mb-6 inline-block shadow-lg transform group-hover:scale-105 transition-transform duration-500">
                  <h3 className="font-bold text-sm tracking-wider">{feature.title}</h3>
                </div>
                <p className="text-gray-400 text-sm lg:text-base leading-relaxed group-hover:text-black transition-colors duration-500">
                  {feature.description}
                </p>
                
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-purple-400/50 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute bottom-4 left-4 w-1 h-1 bg-blue-400/50 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ animationDelay: "0.5s" }}></div>
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


