import { motion, AnimatePresence } from 'motion/react';
import { X, Download, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FilePreviewModalProps {
  visible: boolean;
  fileName: string | null;
  fileUrl: string | null;
  fileType: string | null;
  onClose: () => void;
}

export function FilePreviewModal({
  visible,
  fileName,
  fileUrl,
  fileType,
  onClose,
}: FilePreviewModalProps) {
  const [textContent, setTextContent] = useState<string>('');

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

  // Load text file content
  useEffect(() => {
    const isTextFile = fileType?.includes('text') || fileName?.match(/\.(txt|md|json|xml|csv)$/i);
    
    if (visible && fileUrl && isTextFile) {
      fetch(fileUrl)
        .then((response) => response.text())
        .then((text) => setTextContent(text))
        .catch((error) => {
          console.error('Error loading text file:', error);
          setTextContent('Error loading file content');
        });
    }
  }, [visible, fileUrl, fileName, fileType]);

  if (!visible || !fileUrl) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName || 'download';
    link.click();
  };

  const isTextFile = fileType?.includes('text') || fileName?.match(/\.(txt|md|json|xml|csv)$/i);
  const isPDF = fileType?.includes('pdf');
  const isImage = fileType?.includes('image');
  const isVideo = fileType?.includes('video');
  const isAudio = fileType?.includes('audio');

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          {/* Action Buttons */}
          <div className="absolute top-6 right-6 flex gap-2 z-10">
            <button
              onClick={handleDownload}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Preview Container */}
          <motion.div
            className="max-w-[90vw] max-h-[90vh] relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Preview */}
            {isImage && (
              <img
                src={fileUrl}
                alt={fileName || 'Preview'}
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              />
            )}

            {/* Text File Preview */}
            {isTextFile && (
              <div className="bg-white/95 backdrop-blur-xl rounded-lg shadow-2xl p-8 w-[1200px] max-w-[90vw] max-h-[90vh] overflow-auto">
                <div className="mb-4 text-gray-900 font-semibold text-lg">
                  {fileName}
                </div>
                <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 bg-gray-50 p-4 rounded border border-gray-200 min-h-[600px]">
                  {textContent || 'Loading...'}
                </pre>
              </div>
            )}

            {/* PDF Preview */}
            {isPDF && (
              <div className="bg-white/95 backdrop-blur-xl rounded-lg shadow-2xl p-4 max-w-6xl max-h-[90vh] overflow-auto">
                <div className="mb-2 text-gray-900 font-semibold text-sm">
                  {fileName}
                </div>
                <iframe
                  src={fileUrl}
                  className="w-full h-[80vh] border-0 rounded"
                  title={fileName || 'PDF preview'}
                />
              </div>
            )}

            {/* Video Preview */}
            {isVideo && (
              <div className="bg-black rounded-lg shadow-2xl overflow-hidden">
                <video
                  src={fileUrl}
                  controls
                  className="max-w-full max-h-[90vh]"
                >
                  Your browser does not support video playback.
                </video>
              </div>
            )}

            {/* Audio Preview */}
            {isAudio && (
              <div className="bg-white/95 backdrop-blur-xl rounded-lg shadow-2xl p-8 min-w-[400px]">
                <div className="mb-4 text-gray-900 font-semibold text-lg text-center">
                  {fileName}
                </div>
                <audio src={fileUrl} controls className="w-full">
                  Your browser does not support audio playback.
                </audio>
              </div>
            )}

            {/* Generic File Preview */}
            {!isImage && !isTextFile && !isPDF && !isVideo && !isAudio && (
              <div className="bg-white/95 backdrop-blur-xl rounded-lg shadow-2xl p-8 min-w-[400px] text-center">
                <div className="mb-6">
                  <ExternalLink className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <div className="text-gray-900 font-semibold text-lg mb-2">
                    {fileName}
                  </div>
                  <div className="text-gray-500 text-sm">
                    Preview not available for this file type
                  </div>
                </div>
                <button
                  onClick={handleDownload}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
                >
                  Download File
                </button>
              </div>
            )}

            {/* File Name */}
            {fileName && (isImage || isVideo) && (
              <div className="mt-4 text-center text-white/80 text-sm">
                {fileName}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}