import { useRef, useState, useCallback, useEffect } from "react";

interface DragOptions {
  onDrag?: (deltaX: number, deltaY: number) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export function useDragAndDrop({ onDrag, onDragStart, onDragEnd }: DragOptions) {
  const dragRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (e.button !== 0) return; // Only handle left mouse button
    
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    onDragStart?.();
    
    e.preventDefault();
    e.stopPropagation();
  }, [onDragStart]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    onDrag?.(deltaX, deltaY);
    setDragStart({ x: e.clientX, y: e.clientY });
  }, [isDragging, dragStart, onDrag]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);
    onDragEnd?.();
  }, [isDragging, onDragEnd]);

  // Attach event listeners
  useEffect(() => {
    const element = dragRef.current;
    if (!element) return;

    element.addEventListener('mousedown', handleMouseDown);
    
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
    }

    return () => {
      element.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
    };
  }, [handleMouseDown, handleMouseMove, handleMouseUp, isDragging]);

  return {
    dragRef,
    isDragging,
  };
}
