import { useState } from "react";
import Navigation from "./Navigation";
import Header from "./Header";
import Dashboard from "./Dashboard";
import AiInputPanel from "./AiInputPanel";
import WorkflowBuilder from "./WorkflowBuilder";

const StahikiApp = () => {
  const [activeView, setActiveView] = useState("dashboard");

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard />;
      case "ai-input":
        return <AiInputPanel />;
      case "workflow":
        return <WorkflowBuilder />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Navigation />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-auto">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default StahikiApp;