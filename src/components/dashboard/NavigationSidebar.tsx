import { useState } from "react";
import { 
  FileText, 
  Search, 
  Upload, 
  BarChart3, 
  Settings, 
  Database,
  Brain,
  Zap,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  icon: any;
  description: string;
}

const navItems: NavItem[] = [
  { id: "search", label: "Query Engine", icon: Search, description: "Intelligent document search" },
  { id: "upload", label: "Document Hub", icon: Upload, description: "Upload & process documents" },
  { id: "analytics", label: "Analytics", icon: BarChart3, description: "Performance metrics" },
  { id: "knowledge", label: "Knowledge Graph", icon: Database, description: "Document relationships" },
  { id: "models", label: "AI Models", icon: Brain, description: "Model management" },
  { id: "hotswap", label: "Hot Swap", icon: Zap, description: "Zero-downtime updates" },
  { id: "security", label: "Security", icon: Shield, description: "Access & permissions" },
  { id: "settings", label: "Settings", icon: Settings, description: "System configuration" },
];

interface NavigationSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const NavigationSidebar = ({ activeTab, onTabChange }: NavigationSidebarProps) => {
  return (
    <div className="w-64 bg-card border-r border-glass h-full">
      <div className="p-6">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 group",
                  activeTab === item.id
                    ? "bg-gradient-primary text-primary-foreground shadow-glow"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 transition-colors",
                  activeTab === item.id ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                )} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{item.label}</div>
                  <div className={cn(
                    "text-xs mt-1 line-clamp-1",
                    activeTab === item.id ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}>
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default NavigationSidebar;