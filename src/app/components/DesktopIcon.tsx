import { motion } from 'motion/react';
import { Folder, FileText, Image as ImageIcon } from 'lucide-react';
import { DesktopItem } from '../types';
import { useState, useRef, useEffect } from 'react';

interface DesktopIconProps {
  item: DesktopItem;
  isSelected: boolean;
  onClick: () => void;
  onDoubleClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
  onDragEnd?: (x: number, y: number) => void;
}

export function DesktopIcon({
  item,
  isSelected,
  onClick,
  onDoubleClick,
  onContextMenu,
  onDragEnd,
}: DesktopIconProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const iconRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    
    e.stopPropagation();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !iconRef.current) return;

    const deltaX = e.clientX - dragStartPos.current.x;
    const deltaY = e.clientY - dragStartPos.current.y;

    iconRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (!isDragging || !iconRef.current) return;

    const deltaX = e.clientX - dragStartPos.current.x;
    const deltaY = e.clientY - dragStartPos.current.y;

    // Calculate new grid position
    const ICON_WIDTH = 90;
    const ICON_HEIGHT = 100;
    const GAP = 12;
    
    const rect = iconRef.current.getBoundingClientRect();
    const newX = Math.round((rect.left - 24) / (ICON_WIDTH + GAP));
    const newY = Math.round((rect.top - 56) / (ICON_HEIGHT + GAP));

    // Reset transform
    iconRef.current.style.transform = '';
    
    setIsDragging(false);
    
    if (onDragEnd && (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5)) {
      onDragEnd(Math.max(0, newX), Math.max(0, newY));
    }
  };

  // Set up global mouse listeners when dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const getIcon = () => {
    if (item.type === 'folder') {
      return (
        <div className="relative w-16 h-16 mb-1">
          <Folder
            className="w-full h-full text-blue-400/90"
            fill="currentColor"
            strokeWidth={1.5}
          />
        </div>
      );
    } else if (item.type === 'image') {
      return item.imageUrl ? (
        <div className="relative w-14 h-14 mb-2 rounded-lg overflow-hidden shadow-lg border-2 border-white/50">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="relative w-16 h-16 mb-1">
          <ImageIcon
            className="w-full h-full text-purple-400/90"
            strokeWidth={1.5}
          />
        </div>
      );
    } else {
      return (
        <div className="relative w-16 h-16 mb-1">
          <FileText
            className="w-full h-full text-gray-300/90"
            strokeWidth={1.5}
          />
        </div>
      );
    }
  };

  return (
    <motion.div
      ref={iconRef}
      className={`flex flex-col items-center justify-start cursor-pointer p-2 rounded-lg transition-all ${
        isSelected ? 'bg-blue-500/30 backdrop-blur-sm' : ''
      } ${isDragging ? 'cursor-grabbing opacity-80 z-50' : 'cursor-grab'}`}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
      onMouseDown={handleMouseDown}
      whileHover={{ scale: isDragging ? 1 : 1.05 }}
      style={{
        gridColumn: item.x + 1,
        gridRow: item.y + 1,
      }}
    >
      {getIcon()}
      <div
        className="text-white text-xs text-center max-w-full px-2 py-1 rounded shadow-sm whitespace-nowrap overflow-hidden text-ellipsis"
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
          textShadow: '0 1px 3px rgba(0,0,0,0.8)',
        }}
      >
        {item.name}
      </div>
    </motion.div>
  );
}