import { useState, useCallback } from "react";

export interface WindowInstance {
  id: string;
  title: string;
  content: React.ReactNode;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  isMinimized: boolean;
}

export function useWindowManager() {
  const [windows, setWindows] = useState<WindowInstance[]>([]);
  const [nextZIndex, setNextZIndex] = useState(10);

  const createWindow = useCallback((
    id: string,
    title: string,
    content: React.ReactNode,
    config: { x: number; y: number; width: number; height: number }
  ) => {
    setWindows(prev => {
      // Don't create duplicate windows with the same ID
      if (prev.some(w => w.id === id)) {
        return prev;
      }
      
      const newWindow: WindowInstance = {
        id,
        title,
        content,
        position: { x: config.x, y: config.y },
        size: { width: config.width, height: config.height },
        zIndex: nextZIndex,
        isMinimized: false,
      };
      
      setNextZIndex(prev => prev + 1);
      return [...prev, newWindow];
    });
  }, [nextZIndex]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMinimized: !w.isMinimized } : w
    ));
  }, []);

  const bringToFront = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, zIndex: nextZIndex } : w
    ));
    setNextZIndex(prev => prev + 1);
  }, [nextZIndex]);

  const updateWindowPosition = useCallback((id: string, position: { x: number; y: number }) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, position } : w
    ));
  }, []);

  const updateWindowSize = useCallback((id: string, size: { width: number; height: number }) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, size } : w
    ));
  }, []);

  return {
    windows,
    createWindow,
    closeWindow,
    minimizeWindow,
    bringToFront,
    updateWindowPosition,
    updateWindowSize,
  };
}
