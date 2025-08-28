import { useState } from "react";
import Header from "@/components/dashboard/Header";
import NavigationSidebar from "@/components/dashboard/NavigationSidebar";
import QueryInterface from "@/components/search/QueryInterface";
import DocumentUploader from "@/components/upload/DocumentUploader";
import SystemMetrics from "@/components/analytics/SystemMetrics";

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
        return (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Knowledge Graph</h3>
            <p className="text-muted-foreground">Document relationship visualization coming soon...</p>
          </div>
        );
      case "models":
        return (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">AI Model Management</h3>
            <p className="text-muted-foreground">Model configuration and optimization tools...</p>
          </div>
        );
      case "hotswap":
        return (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Hot Swap Configuration</h3>
            <p className="text-muted-foreground">Zero-downtime component updates...</p>
          </div>
        );
      case "security":
        return (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Security Center</h3>
            <p className="text-muted-foreground">Access control and audit logs...</p>
          </div>
        );
      case "settings":
        return (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">System Settings</h3>
            <p className="text-muted-foreground">Global configuration options...</p>
          </div>
        );
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