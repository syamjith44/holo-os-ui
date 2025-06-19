import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Minus, X, Square } from "lucide-react";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";

interface BaseWindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  isMinimized: boolean;
  onFocus: () => void;
  onMinimize: () => void;
  onClose: () => void;
}

export default function BaseWindow({
  id,
  title,
  children,
  position,
  size,
  zIndex,
  isMinimized,
  onFocus,
  onMinimize,
  onClose,
}: BaseWindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);
  const [currentPosition, setCurrentPosition] = useState(position);
  const [currentSize, setCurrentSize] = useState(size);
  const [isMaximized, setIsMaximized] = useState(false);
  
  const { dragRef, isDragging } = useDragAndDrop({
    onDrag: (deltaX, deltaY) => {
      if (!isMaximized) {
        setCurrentPosition(prev => ({
          x: Math.max(0, Math.min(window.innerWidth - currentSize.width, prev.x + deltaX)),
          y: Math.max(0, Math.min(window.innerHeight - currentSize.height - 48, prev.y + deltaY))
        }));
      }
    },
    onDragStart: onFocus,
  });

  const handleMaximize = () => {
    if (isMaximized) {
      setCurrentPosition(position);
      setCurrentSize(size);
      setIsMaximized(false);
    } else {
      setCurrentPosition({ x: 0, y: 0 });
      setCurrentSize({ width: window.innerWidth, height: window.innerHeight - 48 });
      setIsMaximized(true);
    }
  };

  useEffect(() => {
    if (!isMaximized) {
      setCurrentPosition(position);
      setCurrentSize(size);
    }
  }, [position, size, isMaximized]);

  if (isMinimized) {
    return null;
  }

  return (
    <div
      ref={windowRef}
      className={`absolute window-glass hologram-glow rounded-lg shadow-2xl transition-all duration-200 flex flex-col ${
        isDragging ? "hologram-glow-strong" : ""
      }`}
      style={{
        left: currentPosition.x,
        top: currentPosition.y,
        width: currentSize.width,
        height: currentSize.height,
        zIndex,
      }}
      onClick={onFocus}
    >
      {/* Window Header */}
      <div
        ref={dragRef}
        className="window-header draggable flex items-center justify-between p-3 border-b border-holo-border rounded-t-lg cursor-move flex-shrink-0"
      >
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 border border-holo-accent rounded" />
          <span className="text-sm font-medium select-none">{title}</span>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
            className="w-4 h-4 p-0 border border-holo-border rounded hover:bg-holo-surface"
            size="sm"
          >
            <Minus className="w-2 h-2" />
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleMaximize();
            }}
            className="w-4 h-4 p-0 border border-holo-border rounded hover:bg-holo-surface"
            size="sm"
          >
            <Square className="w-2 h-2" />
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="w-4 h-4 p-0 border border-holo-border rounded hover:bg-holo-surface"
            size="sm"
          >
            <X className="w-2 h-2" />
          </Button>
        </div>
      </div>

      {/* Window Content */}
      <div className="flex-1 overflow-hidden rounded-b-lg">
        {children}
      </div>
    </div>
  );
}
