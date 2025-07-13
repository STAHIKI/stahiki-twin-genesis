import Navigation from "./Navigation";
import Header from "./Header";
import Dashboard from "./Dashboard";
import AiInputPanel from "./AiInputPanel";
import WorkflowBuilder from "./WorkflowBuilder";
import NodeRedWorkflowBuilder from "./NodeRedWorkflowBuilder";
import TwinCreator from "./TwinCreator";
import LiveSimulation from "./LiveSimulation";
import IoTIntegration from "./IoTIntegration";
import APIConnections from "./APIConnections";
import Analytics from "./Analytics";
import Settings from "./Settings";
import { NavigationProvider, useNavigation } from "@/lib/contexts/NavigationContext";

const StahikiApp = () => {
  const { activeView } = useNavigation();

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard />;
      case "ai-input":
        return <AiInputPanel />;
      case "workflow":
        return <NodeRedWorkflowBuilder />;
      case "twin-creator":
        return <TwinCreator />;
      case "simulation":
        return <LiveSimulation />;
      case "iot":
        return <IoTIntegration />;
      case "api":
        return <APIConnections />;
      case "analytics":
        return <Analytics />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Navigation />
        <div className="flex-1 flex flex-col min-w-0">
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