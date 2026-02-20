import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Minus, Maximize2 } from 'lucide-react';
import { FolderWindow as FolderWindowType, DesktopItem } from '../types';
import { DesktopIcon } from './DesktopIcon';

interface FolderWindowProps {
  folder: FolderWindowType;
  items: DesktopItem[];
  selectedItemId: string | null;
  onClose: () => void;
  onBringToFront: () => void;
  onUpdatePosition: (x: number, y: number) => void;
  onToggleMinimize: () => void;
  onToggleFullscreen: () => void;
  onItemClick: (itemId: string) => void;
  onItemDoubleClick: (item: DesktopItem) => void;
  onItemContextMenu: (e: React.MouseEvent, itemId: string) => void;
  onContextMenu: (e: React.MouseEvent, folderId: string) => void;
  onItemDragEnd?: (itemId: string, x: number, y: number) => void;
}

export function FolderWindow({
  folder,
  items,
  selectedItemId,
  onClose,
  onBringToFront,
  onUpdatePosition,
  onToggleMinimize,
  onToggleFullscreen,
  onItemClick,
  onItemDoubleClick,
  onItemContextMenu,
  onContextMenu,
  onItemDragEnd,
}: FolderWindowProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const folderItems = items.filter((item) => item.parentId === folder.id);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.window-controls')) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - folder.x,
      y: e.clientY - folder.y,
    });
    onBringToFront();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || folder.isFullscreen) return;
      onUpdatePosition(e.clientX - dragStart.x, e.clientY - dragStart.y);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, onUpdatePosition, folder.isFullscreen]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onContextMenu(e, folder.id);
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  const handleMinimizeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleMinimize();
  };

  const handleFullscreenClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFullscreen();
  };

  if (folder.isMinimized) {
    return null;
  }

  const windowStyle = folder.isFullscreen
    ? {
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        zIndex: folder.zIndex,
      }
    : {
        left: folder.x,
        top: folder.y,
        width: folder.width,
        height: folder.height,
        zIndex: folder.zIndex,
      };

  return (
    <motion.div
      ref={windowRef}
      className="absolute bg-white/10 backdrop-blur-2xl rounded-[12px] shadow-2xl overflow-hidden border border-white/20"
      style={windowStyle}
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      onClick={onBringToFront}
    >
      {/* Title Bar */}
      <div
        className="h-12 bg-gradient-to-b from-white/[0.08] to-white/[0.03] border-b border-white/10 flex items-center px-4 cursor-move"
        onMouseDown={handleMouseDown}
      >
        {/* Traffic Lights */}
        <div className="flex gap-2 window-controls">
          <button
            onClick={handleCloseClick}
            className="w-3 h-3 rounded-full bg-[#FF5F57] hover:bg-[#FF5F57]/80 transition-colors flex items-center justify-center group"
          >
            <X className="w-2 h-2 text-[#9A201A] opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button
            onClick={handleMinimizeClick}
            className="w-3 h-3 rounded-full bg-[#FFBD2E] hover:bg-[#FFBD2E]/80 transition-colors flex items-center justify-center group"
          >
            <Minus className="w-2 h-2 text-[#995600] opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button
            onClick={handleFullscreenClick}
            className="w-3 h-3 rounded-full bg-[#28C840] hover:bg-[#28C840]/80 transition-colors flex items-center justify-center group"
          >
            <Maximize2 className="w-2 h-2 text-[#006500] opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        {/* Window Title */}
        <div
          className="flex-1 text-center text-sm text-white/90 select-none"
          style={{
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            fontWeight: 500,
          }}
        >
          {folder.name}
        </div>

        {/* Spacer for symmetry */}
        <div className="w-[52px]" />
      </div>

      {/* Content Area */}
      <div
        className="h-[calc(100%-3rem)] p-6 overflow-auto"
        onContextMenu={handleContextMenu}
      >
        {folderItems.length === 0 ? (
          <div className="h-full flex items-center justify-center text-white/50 text-sm">
            This folder is empty
          </div>
        ) : (
          <div
            className="grid gap-3 justify-start items-start content-start"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, 90px)',
              gridAutoRows: '100px',
              gridAutoFlow: 'row',
            }}
          >
            {folderItems.map((item) => (
              <DesktopIcon
                key={item.id}
                item={item}
                isSelected={selectedItemId === item.id}
                onClick={() => onItemClick(item.id)}
                onDoubleClick={() => onItemDoubleClick(item)}
                onContextMenu={(e) => onItemContextMenu(e, item.id)}
                onDragEnd={(x, y) => onItemDragEnd?.(item.id, x, y)}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}