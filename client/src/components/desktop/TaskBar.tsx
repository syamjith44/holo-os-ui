import { Button } from "@/components/ui/button";
import { Plus, Circle } from "lucide-react";
import { useEffect, useState } from "react";
import type { WindowInstance } from "@/hooks/useWindowManager";

interface TaskBarProps {
  windows: WindowInstance[];
  onCreateWindow: (id: string, title: string, content: React.ReactNode, config: { x: number; y: number; width: number; height: number }) => void;
}

export default function TaskBar({ windows, onCreateWindow }: TaskBarProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }) + ' GMT';
  };

  const activeWindows = windows.filter(w => !w.isMinimized);

  const handleNewWindow = () => {
    const windowTypes = [
      { id: "terminal", title: "TERMINAL", component: <div className="p-4 font-mono text-green-400">$ Ready for commands...</div> },
      { id: "files", title: "FILES", component: <div className="p-4">File system browser not implemented</div> },
      { id: "settings", title: "SETTINGS", component: <div className="p-4">System settings panel</div> },
    ];
    
    const randomType = windowTypes[Math.floor(Math.random() * windowTypes.length)];
    const randomId = `${randomType.id}-${Date.now()}`;
    
    onCreateWindow(
      randomId,
      randomType.title,
      randomType.component,
      {
        x: Math.random() * 300 + 200,
        y: Math.random() * 200 + 100,
        width: 400,
        height: 300
      }
    );
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 h-12 window-glass border-t border-holo-border flex items-center justify-center space-x-4 z-50">
      <Button
        onClick={handleNewWindow}
        className="holo-button text-xs"
      >
        <Plus className="w-3 h-3 mr-1" />
        NEW WINDOW
      </Button>
      
      <div className="flex space-x-2">
        {[0, 1, 2].map((index) => (
          <Circle
            key={index}
            className={`w-2 h-2 ${
              index < Math.min(activeWindows.length, 3)
                ? "fill-holo-accent text-holo-accent"
                : "text-holo-border"
            }`}
          />
        ))}
      </div>
      
      <div className="text-xs opacity-60">
        {formatTime(currentTime)}
      </div>
    </div>
  );
}
