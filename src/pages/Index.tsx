import { useState } from "react";
import Header from "@/components/dashboard/Header";
import NavigationSidebar from "@/components/dashboard/NavigationSidebar";
import QueryInterface from "@/components/search/QueryInterface";
import DocumentUploader from "@/components/upload/DocumentUploader";
import SystemMetrics from "@/components/analytics/SystemMetrics";
import KnowledgeGraph from "@/components/knowledge/KnowledgeGraph";
import AIModels from "@/components/models/AIModels";
import HotSwap from "@/components/hotswap/HotSwap";
import SecurityCenter from "@/components/security/SecurityCenter";
import Settings from "@/components/settings/Settings";

const Index = () => {
  const [activeTab, setActiveTab] = useState("search");

  const renderContent = () => {
    switch (activeTab) {
      case "search":
        return <QueryInterface />;
      case "upload":
        return <DocumentUploader />;
      case "analytics":
        return <SystemMetrics />;
      case "knowledge":
        return <KnowledgeGraph />;
      case "models":
        return <AIModels />;
      case "hotswap":
        return <HotSwap />;
      case "security":
        return <SecurityCenter />;
      case "settings":
        return <Settings />;
      default:
        return <QueryInterface />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex h-[calc(100vh-73px)]">
        <NavigationSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6 max-w-7xl">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;