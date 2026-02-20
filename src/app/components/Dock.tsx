import { motion } from 'motion/react';
import { FolderWindow } from '../types';

interface DockProps {
  minimizedFolders: FolderWindow[];
  onRestore: (folderId: string) => void;
}

export function Dock({ minimizedFolders, onRestore }: DockProps) {
  if (minimizedFolders.length === 0) return null;

  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-[9999] pb-safe">
      <motion.div
        className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl px-3 py-2 shadow-2xl flex gap-2"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {minimizedFolders.map((folder) => (
          <motion.button
            key={folder.id}
            onClick={() => onRestore(folder.id)}
            className="w-14 h-14 rounded-xl shadow-lg flex items-center justify-center transition-all relative overflow-hidden group"
            whileHover={{ scale: 1.1, y: -8 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* macOS Folder Icon */}
            <div className="relative w-[46px] h-[36px]">
              {/* Folder back part */}
              <div className="absolute bottom-0 left-0 right-0 h-[30px] rounded-b-[6px] rounded-tr-[6px] bg-gradient-to-br from-[#6BB0EC] via-[#5BA4E5] to-[#4D98DD] shadow-lg" />
              
              {/* Folder tab */}
              <div className="absolute top-0 left-0 w-[22px] h-[10px] rounded-t-[3px] bg-gradient-to-br from-[#78B8EE] to-[#6BB0EC]" />
              
              {/* Folder front highlight */}
              <div className="absolute bottom-0 left-0 right-0 h-[30px] rounded-b-[6px] rounded-tr-[6px] bg-gradient-to-b from-white/30 via-white/10 to-transparent pointer-events-none" />
              
              {/* Folder edge highlight */}
              <div className="absolute bottom-[1px] left-[1px] right-[1px] h-[28px] rounded-b-[5px] rounded-tr-[5px] border-t-[1px] border-white/20 pointer-events-none" />
            </div>
            
            {/* Folder name tooltip */}
            <div className="absolute bottom-full mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
              {folder.name}
            </div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}