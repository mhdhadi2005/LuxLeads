import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import AccessCodeModal from "@/components/AccessCodeModal";
import customBackground from "@/assets/bg-hadi.png"; // adjust the filename and extension


const luxLeadsLogo = "/lovable-uploads/72645a97-d464-43a4-b3ff-822d41ea5a10.png";

const Home = () => {
  const navigate = useNavigate();
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  const handleDashboardAccess = () => {
    navigate("/dashboard");
  };

  return (
    <div
  className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-cover bg-center"
  style={{ backgroundImage: `url(${customBackground})` }}>
    {/* Logo Section */}
      <div className="absolute top-0 left-8 z-20 animate-scale-in">
        <img
          src={luxLeadsLogo}
          alt="LuxLeads Logo"
          className="h-64 w-auto opacity-80 hover:opacity-100 transition-opacity duration-300"
        />
      </div>

      {/* Dashboard Button Section */}
      <div className="absolute top-8 right-8 z-20 animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <Button
          onClick={() => setIsCodeModalOpen(true)}
          size="lg"
          className="uppercase tracking-wide font-semibold text-white px-8 py-3 rounded-lg bg-[#202328] shadow-lg hover:bg-[#2a2d33] transition duration-300">
          Launch Dashboard
        </Button>
      </div>

      {/* About Us and Footer Section */}
      <div
        className="absolute bottom-0 left-0 right-0 animate-fade-in"
        style={{ animationDelay: "1s" }}
>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-base text-gray-400 leading-relaxed mb-2 max-w-2xl mx-auto">
            LuxLeads is your premier contact management platform designed specifically for luxury market professionals.
            We understand that building relationships in the high-end market requires precision, elegance, and powerful insights.
          </p>
          
          <div className="text-base text-muted-foreground mt-4 py-2 bg-white/10 rounded-lg">
            <span className="bg-white bg-clip-text text-transparent font-semibold">
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


