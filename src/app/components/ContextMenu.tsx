import { motion, AnimatePresence } from 'motion/react';
import { Upload, FolderPlus, Image as ImageIcon, FileUp, Pencil, Trash2 } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface ContextMenuProps {
  visible: boolean;
  x: number;
  y: number;
  type: 'desktop' | 'folder' | 'item';
  editMode: boolean;
  onClose: () => void;
  onChangeWallpaper?: () => void;
  onNewFolder?: () => void;
  onUploadImage?: () => void;
  onUploadFile?: () => void;
  onRename?: () => void;
  onDelete?: () => void;
}

export function ContextMenu({
  visible,
  x,
  y,
  type,
  editMode,
  onClose,
  onChangeWallpaper,
  onNewFolder,
  onUploadImage,
  onUploadFile,
  onRename,
  onDelete,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visible, onClose]);

  if (!visible) return null;

  const desktopMenuItems = [
    { icon: ImageIcon, label: 'Change Wallpaper', onClick: onChangeWallpaper },
    { icon: FolderPlus, label: 'New Folder', onClick: onNewFolder },
    { icon: Upload, label: 'Upload Image', onClick: onUploadImage },
    { icon: FileUp, label: 'Upload File', onClick: onUploadFile },
  ];

  const folderMenuItems = [
    { icon: Upload, label: 'Upload Image', onClick: onUploadImage },
    { icon: FileUp, label: 'Upload File', onClick: onUploadFile },
    { icon: FolderPlus, label: 'New Folder', onClick: onNewFolder },
  ];

  const itemMenuItems = [
    { icon: Pencil, label: 'Rename', onClick: onRename },
    { icon: Trash2, label: 'Delete', onClick: onDelete },
  ];

  let menuItems = [];
  if (type === 'desktop') {
    menuItems = desktopMenuItems;
  } else if (type === 'folder') {
    menuItems = folderMenuItems;
  } else if (type === 'item') {
    menuItems = itemMenuItems;
  }

  // Only show menu in edit mode
  if (!editMode) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={menuRef}
          className="fixed bg-white/10 backdrop-blur-2xl rounded-lg shadow-2xl border border-white/20 py-1 min-w-[200px] overflow-hidden"
          style={{
            left: x,
            top: y,
            zIndex: 10000,
          }}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.onClick?.();
                onClose();
              }}
              className="w-full px-4 py-2 flex items-center gap-3 text-white/90 hover:bg-white/10 transition-colors text-left text-sm"
              style={{
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
              }}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}