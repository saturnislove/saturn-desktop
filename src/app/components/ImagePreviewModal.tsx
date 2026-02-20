import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useEffect } from 'react';

interface ImagePreviewModalProps {
  visible: boolean;
  imageUrl: string | null;
  imageName: string | null;
  onClose: () => void;
}

export function ImagePreviewModal({
  visible,
  imageUrl,
  imageName,
  onClose,
}: ImagePreviewModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (visible) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [visible, onClose]);

  return (
    <AnimatePresence>
      {visible && imageUrl && (
        <motion.div
          className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Image Container */}
          <motion.div
            className="max-w-[90vw] max-h-[90vh] relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={imageUrl}
              alt={imageName || 'Preview'}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
            {imageName && (
              <div className="mt-4 text-center text-white/80 text-sm">
                {imageName}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
