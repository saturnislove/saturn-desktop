import { motion } from 'motion/react';
import { Edit3, Eye } from 'lucide-react';

interface EditModeToggleProps {
  editMode: boolean;
  onToggle: () => void;
}

export function EditModeToggle({ editMode, onToggle }: EditModeToggleProps) {
  return (
    <motion.button
      onClick={onToggle}
      className="fixed top-6 right-6 z-[9999] bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full px-4 py-2 flex items-center gap-2 text-white/90 hover:bg-white/20 transition-colors shadow-lg"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
        fontWeight: 500,
      }}
    >
      {editMode ? (
        <>
          <Edit3 className="w-4 h-4" />
          <span className="text-sm">Edit Mode</span>
        </>
      ) : (
        <>
          <Eye className="w-4 h-4" />
          <span className="text-sm">Public Mode</span>
        </>
      )}
    </motion.button>
  );
}
