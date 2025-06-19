import { useEffect } from "react";
import { useWindowManager } from "@/hooks/useWindowManager";
import { useWebSocket } from "@/hooks/useWebSocket";
import TaskBar from "./TaskBar";
import BaseWindow from "@/components/windows/BaseWindow";
import ChatBotWindow from "@/components/windows/ChatBotWindow";
import MapWindow from "@/components/windows/MapWindow";
import CommunicationsWindow from "@/components/windows/CommunicationsWindow";
import SystemMonitorWindow from "@/components/windows/SystemMonitorWindow";
import SimpleGraphWindow from "@/components/windows/SimpleGraphWindow";

export default function DesktopEnvironment() {
  const { windows, bringToFront, minimizeWindow, closeWindow, createWindow } = useWindowManager();
  const { isConnected } = useWebSocket();

  useEffect(() => {
    // Create initial windows
    createWindow("chatbot", "AI ASSISTANT", <ChatBotWindow />, { x: 100, y: 80, width: 400, height: 500 });
    createWindow("maps", "NAVIGATION", <MapWindow />, { x: 550, y: 120, width: 500, height: 400 });
    createWindow("communications", "COMMUNICATIONS", <CommunicationsWindow />, { x: 1100, y: 200, width: 350, height: 450 });
    createWindow("system", "SYSTEM", <SystemMonitorWindow />, { x: 200, y: 300, width: 300, height: 250 });
    createWindow("graphs", "PERFORMANCE GRAPHS", <SimpleGraphWindow />, { x: 600, y: 50, width: 350, height: 480 });
  }, [createWindow]);

  return (
    <div className="h-screen w-screen relative bg-holo-bg overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 wireframe-grid opacity-30" />
      
      {/* Connection Status Indicator */}
      {!isConnected && (
        <div className="absolute top-4 right-4 px-3 py-1 text-xs border border-red-500 rounded bg-red-500 bg-opacity-10 text-red-400 z-50">
          DISCONNECTED
        </div>
      )}
      
      {/* Windows */}
      {windows.map((window) => (
        <BaseWindow
          key={window.id}
          id={window.id}
          title={window.title}
          position={window.position}
          size={window.size}
          zIndex={window.zIndex}
          isMinimized={window.isMinimized}
          onFocus={() => bringToFront(window.id)}
          onMinimize={() => minimizeWindow(window.id)}
          onClose={() => closeWindow(window.id)}
        >
          {window.content}
        </BaseWindow>
      ))}
      
      {/* TaskBar */}
      <TaskBar windows={windows} onCreateWindow={createWindow} />
    </div>
  );
}
