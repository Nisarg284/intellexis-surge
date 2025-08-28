import { Search, Settings, Activity, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="border-b border-glass bg-glass/50 backdrop-blur-xl">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                IntelliRAG
              </h1>
            </div>
            <div className="hidden md:flex text-sm text-muted-foreground">
              Enterprise Document Intelligence Platform
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="gap-2">
              <Activity className="w-4 h-4" />
              System Status
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <Settings className="w-4 h-4" />
              Configure
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;