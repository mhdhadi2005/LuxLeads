import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// UPDATE THIS CODE HERE - Change the access code below
const ACCESS_CODE = "123456"; // <-- Update this 6-digit code

interface AccessCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AccessCodeModal = ({ isOpen, onClose, onSuccess }: AccessCodeModalProps) => {
  const [code, setCode] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code === ACCESS_CODE) {
      onSuccess();
      onClose();
      setCode("");
    } else {
      toast({
        title: "Invalid Code",
        description: "Please enter the correct 6-digit access code.",
        variant: "destructive",
      });
      setCode("");
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center bg-[#202328] bg-clip-text text-transparent">
            Access Code Required
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Enter the 6-digit access code to launch the dashboard
            </p>
            
            <Input
              type="text"
              placeholder="000000"
              value={code}
              onChange={handleCodeChange}
              className="text-center text-2xl font-mono tracking-widest space-y-6 border border-gray-500 rounded-xl p-6 shadow-md bg-white/5 backdrop-blur"
              maxLength={6}
              autoFocus
            />
          </div>
          
          <div className="flex gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-[#202328] hover:bg-[#A9A9A9] text-white"
              disabled={code.length !== 6}
            >
              Access Dashboard
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AccessCodeModal;
