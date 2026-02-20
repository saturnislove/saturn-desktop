import { FileText, File as FileIcon, FileSpreadsheet, FileCode, Archive } from 'lucide-react';

interface FileIconProps {
  fileType?: string;
  fileName?: string;
}

export function FileIconDisplay({ fileType, fileName }: FileIconProps) {
  const getFileIcon = () => {
    if (!fileType) return FileIcon;

    if (fileType.includes('pdf')) {
      return FileText;
    } else if (fileType.includes('sheet') || fileType.includes('excel')) {
      return FileSpreadsheet;
    } else if (
      fileType.includes('code') ||
      fileType.includes('javascript') ||
      fileType.includes('typescript') ||
      fileType.includes('html') ||
      fileType.includes('css')
    ) {
      return FileCode;
    } else if (fileType.includes('zip') || fileType.includes('rar')) {
      return Archive;
    }

    return FileIcon;
  };

  const Icon = getFileIcon();

  const getFileColor = () => {
    if (!fileType) return 'from-gray-400 to-gray-500';

    if (fileType.includes('pdf')) {
      return 'from-red-400 to-red-500';
    } else if (fileType.includes('sheet') || fileType.includes('excel')) {
      return 'from-green-400 to-green-500';
    } else if (
      fileType.includes('code') ||
      fileType.includes('javascript') ||
      fileType.includes('typescript')
    ) {
      return 'from-yellow-400 to-yellow-500';
    } else if (fileType.includes('zip') || fileType.includes('rar')) {
      return 'from-purple-400 to-purple-500';
    }

    return 'from-gray-400 to-gray-500';
  };

  return (
    <div className="relative w-14 h-14">
      {/* File background with gradient */}
      <div
        className={`absolute inset-0 rounded-[8px] bg-gradient-to-br ${getFileColor()} opacity-90 shadow-lg flex items-center justify-center`}
      >
        <Icon className="w-7 h-7 text-white" strokeWidth={1.5} />
      </div>
      {/* File shine effect */}
      <div className="absolute inset-0 rounded-[8px] bg-gradient-to-br from-white/30 to-transparent opacity-60" />
    </div>
  );
}
